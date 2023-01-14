import {
    Address,
    Cell,
    contractAddress,
    serializeDict,
    StateInit,
    beginDict,
    beginCell,
    Slice,
    toNano,
    DictBuilder,
    parseDict,
} from 'ton';
import BN from 'bn.js';
import { oracleMasterSourceV1CodeCell, oracleClientSourceV1CodeCell } from './OracleV1.source';
import { Sha256 } from '@aws-crypto/sha256-js';
import { randomAddress } from './utils/randomAddress';

const ONCHAIN_CONTENT_PREFIX = 0x00;
const SNAKE_PREFIX = 0x00;

export type OracleMetaDataKeys = 'name' | 'description' | 'image';

const oracleOnChainMetadataSpec: {
    [key in OracleMetaDataKeys]: 'utf8' | 'ascii' | undefined;
} = {
    name: 'utf8',
    description: 'utf8',
    image: 'ascii',
};

const sha256 = (str: string) => {
    const sha = new Sha256();
    sha.update(str);
    return Buffer.from(sha.digestSync());
};

export function buildOracleMetadataCell(data: { [s: string]: string | undefined }): Cell {
    const KEYLEN = 256;
    const dict = beginDict(KEYLEN);

    Object.entries(data).forEach(([k, v]: [string, string | undefined]) => {
        if (!oracleOnChainMetadataSpec[k as OracleMetaDataKeys])
            throw new Error(`Unsupported onchain key: ${k}`);
        if (v === undefined || v === '') return;

        let bufferToStore = Buffer.from(v, oracleOnChainMetadataSpec[k as OracleMetaDataKeys]);

        const CELL_MAX_SIZE_BYTES = Math.floor((1023 - 8) / 8);

        const rootCell = new Cell();
        rootCell.bits.writeUint8(SNAKE_PREFIX);
        let currentCell = rootCell;

        while (bufferToStore.length > 0) {
            currentCell.bits.writeBuffer(bufferToStore.slice(0, CELL_MAX_SIZE_BYTES));
            bufferToStore = bufferToStore.slice(CELL_MAX_SIZE_BYTES);
            if (bufferToStore.length > 0) {
                const newCell = new Cell();
                currentCell.refs.push(newCell);
                currentCell = newCell;
            }
        }

        dict.storeRef(sha256(k), rootCell);
    });

    return beginCell().storeInt(ONCHAIN_CONTENT_PREFIX, 8).storeDict(dict.endDict()).endCell();
}

export function parseOracleMetadataCell(contentCell: Cell): {
    [s in OracleMetaDataKeys]?: string;
} {
    // Note that this relies on what is (perhaps) an internal implementation detail:
    // "ton" library dict parser converts: key (provided as buffer) => BN(base10)
    // and upon parsing, it reads it back to a BN(base10)
    // tl;dr if we want to read the map back to a JSON with string keys, we have to convert BN(10) back to hex
    const toKey = (str: string) => new BN(str, 'hex').toString(10);

    const KEYLEN = 256;
    const contentSlice = contentCell.beginParse();
    if (contentSlice.readUint(8).toNumber() !== ONCHAIN_CONTENT_PREFIX)
        throw new Error('Expected onchain content marker');

    const dict = contentSlice.readDict(KEYLEN, s => {
        const buffer = Buffer.from('');

        const sliceToVal = (s: Slice, v: Buffer, isFirst: boolean) => {
            s.toCell().beginParse();
            if (isFirst && s.readUint(8).toNumber() !== SNAKE_PREFIX)
                throw new Error('Only snake format is supported');

            v = Buffer.concat([v, s.readRemainingBytes()]);
            if (s.remainingRefs === 1) {
                v = sliceToVal(s.readRef(), v, false);
            }

            return v;
        };

        return sliceToVal(s.readRef(), buffer, true);
    });

    const res: { [s in OracleMetaDataKeys]?: string } = {};

    Object.keys(oracleOnChainMetadataSpec).forEach(k => {
        const val = dict
            .get(toKey(sha256(k).toString('hex')))
            ?.toString(oracleOnChainMetadataSpec[k as OracleMetaDataKeys]);
        if (val) res[k as OracleMetaDataKeys] = val;
    });

    return res;
}

export function oracleMasterInitData(config: {
    admin_address: Address;
    metadata: {
        [s in OracleMetaDataKeys]?: string;
    };
    comission_size: BN;
    whitelisted_oracle_addresses: Address[];
    number_of_clients: BN;
    actual_value: BN;
}): Cell {
    return beginCell()
        .storeAddress(config.admin_address)
        .storeRef(buildOracleMetadataCell(config.metadata))
        .storeRef(oracleClientSourceV1CodeCell)
        .storeCoins(config.comission_size)
        .storeRef(beginCell().storeDict(buildAddressesDict(config.whitelisted_oracle_addresses)).endCell())
        .storeUint(config.number_of_clients, 64)
        .storeUint(config.actual_value, 64)
        .endCell();
}

function buildAddressesDict(addresses: Address[]): Cell {
    const addressesMap = new Map(addresses.map((address, i) => [new BN(address.hash).toString(10), i]));
    const addressesDict = serializeDict(addressesMap, 256, (i, cell) => cell.bits.writeUint(i, 32));
    return addressesDict;
}

export function loadAddressesDict(dict: Cell): Address[] {
    if (!dict) {
        return [];
    }

    const addressesDict = parseDict(dict.beginParse(), 256, i => i.readUint(32).toNumber());
    return [...addressesDict.entries()].map(([address, i]) => new Address(0, new BN(address).toBuffer()));
}

export interface OracleMasterConfig {
    admin_address: Address;
    metadata: {
        name: string;
        image: string;
        description: string;
    };
    comission_size: BN;
    whitelisted_oracle_addresses: Address[];
    number_of_clients: BN,
    actual_value: BN,
}

export interface OracleClientInitConfig {
    balance?: BN;
    oracle_master_address: Address;
    client_id: BN;
}

export function oracleClientInitData(config: OracleClientInitConfig): Cell {
    return beginCell()
        .storeAddress(config.oracle_master_address)
        .storeUint(config.client_id, 32)
        .endCell();
}

export interface OracleClientUploadConfig {
    actual_value: BN;
    owner_address: Address;
    oracle_master_address: Address;
    smartcontract_address: Address;
    comission_size: BN;
    mode: BN;
    interval: BN;
    whitelisted_oracle_addresses: Address[];
}

export function oracleClientUploadData(config: OracleClientUploadConfig): Cell {
    return beginCell()
        .storeUint(OPS.CreateAccount, 32)
        .storeUint(0, 64)
        .storeRef(
            beginCell()
                .storeAddress(config.owner_address)
                .storeAddress(config.oracle_master_address)
                .storeAddress(config.smartcontract_address)
                .endCell(),
        )
        .storeCoins(config.comission_size)
        .storeRef(beginCell().storeDict(buildAddressesDict(config.whitelisted_oracle_addresses)).endCell())
        .storeUint(config.mode, 32)
        .storeUint(config.interval, 32)
        .storeUint(config.actual_value, 64)
        .endCell();
}

// return the op that should be sent to the contract on deployment, can be "null" to send an empty message
export function initMessage() {
    return null;
}

export enum OPS {
    // Excesses = 0xd53276db,
    Signup = 0x4ea31eef,
    CreateAccount = 0x2f2067c2,
    Fetch = 0x82e96343,
    Update = 0x98253578,
    Withdrawal = 0x6d2d3b45,
    NewValue = 0xe5e11be9,
}

export enum MODES {
    OnDemand = 0x8660a9dc,
    Subscription = 0xa3c664d3,
}
