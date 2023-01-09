import BN from 'bn.js';
import { Address, Cell, Slice } from 'ton';
import { OracleMetaDataKeys, parseOracleMetadataCell } from '../OracleV1.data';

interface OracleDetails {
    admin_address: Address;
    metadata: { [s in OracleMetaDataKeys]?: string };
    client_init_code: Cell;
    comission_address: Address;
    comission_size: BN;
    whitelisted_oracle_address: Address;
}
export function parseOracleDetails(execResult: { result: any[] }): OracleDetails {
    return {
        admin_address: (execResult.result[0] as Slice)?.readAddress() as Address,
        metadata: parseOracleMetadataCell(execResult.result[1]),
        client_init_code: execResult.result[2] as Cell,
        comission_address: (execResult.result[3] as Slice)?.readAddress() as Address,
        comission_size: execResult.result[4] as BN,
        whitelisted_oracle_address: (execResult.result[5] as Slice)?.readAddress() as Address,
    };
}

export function getWalletAddress(stack: any[]): Address {
    return stack[0][1].bytes[0].beginParse().readAddress()!;
}

interface JettonWalletDetails {
    balance: BN;
    owner: Address;
    jettonMasterContract: Address; // Minter
}

export function parseJettonWalletDetails(execResult: { result: any[] }): JettonWalletDetails {
    return {
        balance: execResult.result[0] as BN,
        owner: (execResult.result[1] as Slice).readAddress()!,
        jettonMasterContract: (execResult.result[2] as Slice).readAddress()!,
    };
}
