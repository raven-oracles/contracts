import { SmartContract } from "ton-contract-executor";
import {
  Address,
  beginCell,
  Cell,
  contractAddress,
  parseDict,
  Slice,
  toNano,
} from "ton";
import BN from "bn.js";
import { oracleMasterInitData, OPS } from "./OracleV1.data";
import { oracleMasterSourceV1 } from "./OracleV1.source";
import { compileFunc } from "./utils/compileFunc";
import { randomAddress } from "./utils/randomAddress";
export class OracleV1LocalMaster {
  private constructor(
    public readonly contract: SmartContract,
    public readonly address: Address
  ) {}

  static async createFromConfig(config: {
    metadata: {
      name: string;
      image: string;
      description: string;
    };
  }) {
    const code = await compileFunc(oracleMasterSourceV1());

    const data = oracleMasterInitData(config.metadata);
    const contract = await SmartContract.fromCell(code.cell, data);

    const address = contractAddress({
      workchain: 0,
      initialData: contract.dataCell,
      initialCode: contract.codeCell,
    });

    contract.setC7Config({
      myself: address,
    });

    return new OracleV1LocalMaster(contract, address);
  }

  // TODO: remove
  // static createMintPayload(
  //   recepientAddress: Address,
  //   responseAddress: Address,
  //   jettonValue: BN,
  //   forwardAmount: BN,
  //   forwardPayload: Cell
  // ): Cell {
  //   return beginCell()
  //     .storeUint(OPS.Mint, 32) // opcode
  //     .storeUint(0, 64) // queryid
  //     .storeAddress(recepientAddress)
  //     .storeAddress(responseAddress)
  //     .storeCoins(jettonValue)
  //     .storeCoins(forwardAmount)
  //     .storeRef(forwardPayload)
  //     .endCell();
  // }
}
