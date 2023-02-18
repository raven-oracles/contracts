import { SmartContract } from 'ton-contract-executor';
import { Address, beginCell, Cell, contractAddress, parseDict, Slice, toNano } from 'ton';
import BN from 'bn.js';
import { oracleMasterInitData, OPS, OracleMasterConfig } from './OracleV1.data';
import { oracleMasterSourceV1 } from './OracleV1.source';
import { compileFunc } from './utils/compileFunc';
import { randomAddress } from './utils/randomAddress';
export class OracleV1LocalMaster {
    private constructor(public readonly contract: SmartContract, public readonly address: Address) { }

    static async createFromConfig(config: OracleMasterConfig) {
        const code = await compileFunc(oracleMasterSourceV1());

        const data = oracleMasterInitData(config);
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

    static createSignupPayload(user_sc_address: Address, interval: BN, mode: number): Cell {
        return beginCell()
            .storeUint(OPS.Signup, 32) // opcode
            .storeUint(0, 64) // queryid
            .storeAddress(user_sc_address)
            .storeUint(mode, 32)
            .storeUint(interval, 32)
            .endCell();
    }
}
