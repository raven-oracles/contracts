import { SmartContract } from 'ton-contract-executor';
import { Address, DictBuilder, beginCell, contractAddress } from 'ton';
import { oracleUserSourceV1 } from './OracleV1.source';
import { compileFunc } from './utils/compileFunc';
import { zeroAddress } from './utils/randomAddress';
import BN from 'bn.js';
import { OracleUserInitConfig, oracleUserInitData, oracleClientInitData } from './OracleV1.data';

export class OracleV1LocalUser {
    private constructor(public readonly contract: SmartContract, public readonly address: Address) { }

    static async createFromConfig(config: OracleUserInitConfig) {
        const code = await compileFunc(oracleUserSourceV1());

        const data = oracleUserInitData(config);
        const contract = await SmartContract.fromCell(code.cell, data);

        const address = contractAddress({
            workchain: 0,
            initialData: contract.dataCell,
            initialCode: contract.codeCell,
        });

        contract.setC7Config({
            myself: address,
            balance: new BN(0),
        });

        return new OracleV1LocalUser(contract, address);
    }
}
