import BN from 'bn.js';
import { Address, Cell, Slice } from 'ton';
import { loadAddressesDict, OracleMetaDataKeys, parseOracleMetadataCell } from '../OracleV1.data';

interface OracleDetails {
    admin_address: Address;
    metadata: { [s in OracleMetaDataKeys]?: string };
    client_init_code: Cell;
    comission_size: BN;
    whitelisted_oracle_addresses: any;
    number_of_clients: BN,
    actual_value: BN,
}
export function parseOracleDetails(execResult: { result: any[] }): OracleDetails {
    return {
        admin_address: (execResult.result[0] as Slice)?.readAddress() as Address,
        metadata: parseOracleMetadataCell(execResult.result[1]),
        client_init_code: execResult.result[2] as Cell,
        comission_size: execResult.result[3] as BN,
        whitelisted_oracle_addresses: loadAddressesDict(execResult.result[4] as Cell),
        number_of_clients: execResult.result[5] as BN,
        actual_value: execResult.result[6] as BN,
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
