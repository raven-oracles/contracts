import { SmartContract } from "ton-contract-executor";
import {
  Address,
  beginCell,
  Cell,
  contractAddress,
  parseDict,
  Slice,
} from "ton";
import BN from "bn.js";
import { initData, oracleMasterInitData } from "./OracleV1.data";
import { oracleClientSourceV1 } from "./OracleV1.source";
import { compileFunc } from "./utils/compileFunc";
import { randomAddress, zeroAddress } from "./utils/randomAddress";

export class OracleV1LocalClient {
  private constructor(
    public readonly contract: SmartContract,
    public readonly address: Address
  ) {}

  static async create(
    walletOwnerAddress?: Address,
    jettonMasterAddress?: Address
  ) {
    const code = await compileFunc(oracleClientSourceV1());

    const contract = await SmartContract.fromCell(
      code.cell,
      beginCell()
        .storeCoins(0)
        .storeAddress(walletOwnerAddress ? walletOwnerAddress : zeroAddress) 
        .storeAddress(jettonMasterAddress ? jettonMasterAddress : zeroAddress)
        .storeRef(code.cell)
        .endCell()
    );

    const address = contractAddress({
      workchain: 0,
      initialData: contract.dataCell,
      initialCode: contract.codeCell,
    });

    contract.setC7Config({
      myself: address,
    });

    return new OracleV1LocalClient(contract, address);
  }
}
