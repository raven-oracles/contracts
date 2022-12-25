import BN from "bn.js";
import { Address, Slice } from "ton";
import { OracleMetaDataKeys, parseOracleMetadataCell } from "../OracleV1.data";

interface OracleDetails {
  address: Address;
  metadata: { [s in OracleMetaDataKeys]?: string };
}
export function parseOracleDetails(execResult: {
  result: any[];
}): OracleDetails {
  return {
    address: (execResult.result[0] as Slice)?.readAddress() as Address,
    metadata: parseOracleMetadataCell(execResult.result[1]),
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

export function parseJettonWalletDetails(execResult: {
  result: any[];
}): JettonWalletDetails {
  return {
    balance: execResult.result[0] as BN,
    owner: (execResult.result[1] as Slice).readAddress()!,
    jettonMasterContract: (execResult.result[2] as Slice).readAddress()!,
  };
}
