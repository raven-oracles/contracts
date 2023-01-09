import { SmartContract } from 'ton-contract-executor';
import { Address, DictBuilder, beginCell, contractAddress } from 'ton';
import { oracleClientSourceV1 } from './OracleV1.source';
import { compileFunc } from './utils/compileFunc';
import { zeroAddress } from './utils/randomAddress';
import BN from 'bn.js';
import { OracleClientConfig, oracleClientInitData } from './OracleV1.data';

export class OracleV1LocalClient {
    private constructor(public readonly contract: SmartContract, public readonly address: Address) {}

    static async createFromConfig(config: OracleClientConfig) {
        const code = await compileFunc(oracleClientSourceV1());

        const data = oracleClientInitData(config);
        const contract = await SmartContract.fromCell(code.cell, data);

        const address = contractAddress({
            workchain: 0,
            initialData: contract.dataCell,
            initialCode: contract.codeCell,
        });

        contract.setC7Config({
            myself: address,
            balance: config.balance || new BN(0),
        });

        return new OracleV1LocalClient(contract, address);
    }
}
