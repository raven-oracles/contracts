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
} from 'ton';
import BN from 'bn.js';
import { oracleMasterSourceV1CodeCell, oracleClientSourceV1CodeCell } from './OracleV1.source';
import { Sha256 } from '@aws-crypto/sha256-js';
import { randomAddress } from './utils/randomAddress';

const ONCHAIN_CONTENT_PREFIX = 0x00;
const SNAKE_PREFIX = 0x00;

const oracleMetadataParams = {
    owner: Address.parse('EQD4gS-Nj2Gjr2FYtg-s3fXUvjzKbzHGZ5_1Xe_V0-GCp0p2'),
    name: 'USDT/TON Price Oracle',
    image: 'https://www.linkpicture.com/q/download_183.png', // Image url
    description: 'This is master oracle for USDT/TON price',
};

// TODO: add comission size here?

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
    comission_address: Address;
    comission_size: BN;
}): Cell {
    return beginCell()
        .storeAddress(config.admin_address)
        .storeRef(buildOracleMetadataCell(config.metadata))
        .storeRef(oracleMasterSourceV1CodeCell)
        .storeAddress(config.comission_address)
        .storeCoins(config.comission_size)
        .endCell();
}
// return the init Cell of the contract storage (according to load_data() contract method)
// export function initData() {
//     return oracleMasterInitData({
//         name: oracleMetadataParams.name,
//         image: oracleMetadataParams.image,
//         description: oracleMetadataParams.description,
//     });
// }

// return the op that should be sent to the contract on deployment, can be "null" to send an empty message
export function initMessage() {
    return null;
}

export enum OPS {
    // Excesses = 0xd53276db,
    Signup = 1,
    AccountCreation = 2,
    Fetch = 0x82e96343,
    Update = 0x98253578,
    Withdrawal = 0x6d2d3b45,
}
