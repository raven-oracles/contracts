import BN from 'bn.js';
import {
    Address,
    CellMessage,
    fromNano,
    beginCell,
    Cell,
    toNano,
    CommonMessageInfo,
    ExternalMessage,
    TupleSlice4,
} from 'ton';
import { actionToMessage } from './utils/actionToMessage';
import { internalMessage } from './utils/internalMessage';
import { parseOracleDetails, parseJettonWalletDetails } from './utils/jetton-utils';
import { randomAddress, zeroAddress } from './utils/randomAddress';
import { OracleV1LocalMaster } from './OracleV1LocalMaster';
import { OracleV1LocalClient } from './OracleV1LocalClient';
import { convertFromExecutorStack } from './utils/convertFromExecutorStack';
import { loadAddressesDict, OPS } from './OracleV1.data';
import { randomInt } from 'crypto';
import { kill } from 'process';
import { info, warn } from 'console';
import { oracleClientSourceV1CodeCell } from './OracleV1.source';

function assertNotNull(a: unknown): asserts a {
    expect(a).not.toBeNull();
}

function assert(a: unknown): asserts a {
    expect(a).toBeTruthy();
}

function assertAddress(a: unknown, b: Address) {
    expect(a).toBeInstanceOf(Address);
    if (a instanceof Address) {
        expect(a.equals(b)).toBeTruthy();
    }
}

function assertAddressArray(a: Address[], b: Address[]) {
    expect(a.map(ad => ad.toString()).sort()).toEqual(b.map(ad => ad.toString()).sort());
}

function assertCoins(a: BN, b: BN) {
    expect(a.eq(b)).toBeTruthy();
}

const END_USER = randomAddress('end_user');

const config = {
    admin_address: randomAddress('ADMIN_ADDRESS'),
    metadata: {
        name: 'USDT/TON Price Oracle',
        image: 'https://www.linkpicture.com/q/download_183.png', // Image url
        description: 'This is master oracle for USDT/TON price',
    },
    comission_address: randomAddress('COMISSION_ADDRESS'),
    comission_size: toNano(0.1),
    whitelisted_oracle_addresses: [randomAddress('WHITELISTED_ORACLE_ADDRESS')], //TODO: switch to dictionary
};

describe('Oracle v1 Master', () => {
    let masterContract: OracleV1LocalMaster;
    let clientContract: OracleV1LocalClient;

    const getClientContract = async (clientOwnerAddress: Address, oracleMasterAddress: Address) =>
        await OracleV1LocalClient.create(clientOwnerAddress, oracleMasterAddress);

    beforeEach(async () => {
        masterContract = await OracleV1LocalMaster.createFromConfig(config);
    });

    it('should get oracle master initialization data correctly', async () => {
        const call = await masterContract.contract.invokeGetMethod('get_oracle_data', []);

        const { metadata, admin_address, comission_size, client_init_code, whitelisted_oracle_addresses } =
            parseOracleDetails(call);

        expect(admin_address).toBeDefined();
        assertAddress(admin_address, config.admin_address);
        expect(metadata.name).toEqual('USDT/TON Price Oracle');
        expect(metadata.description).toEqual('This is master oracle for USDT/TON price');
        expect(client_init_code.hash()).toEqual(oracleClientSourceV1CodeCell.hash());
        assertCoins(comission_size, config.comission_size);
        assertAddressArray(whitelisted_oracle_addresses, config.whitelisted_oracle_addresses);
    });

    it('should send signup command and verify the outgoing data', async () => {
        const sc_address = randomAddress('smart_contract');

        const stack = await masterContract.contract.sendInternalMessage(
            internalMessage({
                from: END_USER,
                value: toNano(2),
                body: OracleV1LocalMaster.createSignupPayload(sc_address),
            }),
        );

        expect(stack.exit_code).toEqual(0);
        expect(stack.actionList.length).toEqual(1);

        const accountCreationMessage = stack.actionList[0];

        // TODO: compare the account creation message destination with the calculated address of oracle client
        const call = await masterContract.contract.invokeGetMethod('get_oracle_client_address', []);
        // console.log(accountCreationMessage);
    });

    // TODO: tests for comission
    // fail on not-admin address change try and vise versa
    // - change comission address
    // - whitelisted oracle address
});

describe('Oracle v1 Client', () => {
    let clientContract: OracleV1LocalClient;
    const tonPrice = '2.44';
    const senderAddress = randomAddress('notowner');

    beforeEach(async () => {
        clientContract = await OracleV1LocalClient.create(null, null, senderAddress);
    });

    it('should update data on client contract correctly', async () => {
        await clientContract.contract.sendInternalMessage(
            internalMessage({
                value: toNano(1),
                from: senderAddress,
                body: beginCell().storeUint(OPS.Update, 32).storeUint(toNano(tonPrice), 64).endCell(),
            }),
        );

        const getMethodResult = await clientContract.contract.invokeGetMethod('get_stored_coin_price', []);
        expect(getMethodResult.result[0]).toEqual(toNano(tonPrice));
    });

    it('should fetch data from client contract correctly', async () => {
        await clientContract.contract.sendInternalMessage(
            internalMessage({
                from: senderAddress,
                body: beginCell().storeUint(OPS.Update, 32).storeUint(toNano(tonPrice), 64).endCell(),
            }),
        );

        const fetchMethodResult = await clientContract.contract.sendInternalMessage(
            internalMessage({
                from: senderAddress,
                body: beginCell().storeUint(OPS.Fetch, 32).endCell(),
            }),
        );

        const action = fetchMethodResult.actionList[0] as any; // TODO: need to take type from ton lib
        const resultValue = fromNano(
            parseInt('0x' + String(action.message.body).slice(18).slice(0, -2).toLowerCase()),
        ); // TODO: find another way to get data from response

        expect(resultValue).toEqual(tonPrice);
    });

    it('should withdrawal all TONs from client contract correctly', async () => {
        clientContract.contract.setC7Config({
            balance: toNano(20),
        });

        const withdrawalMethodResult = await clientContract.contract.sendInternalMessage(
            internalMessage({
                from: senderAddress,
                body: beginCell().storeUint(OPS.Withdrawal, 32).endCell(),
            }),
        );

        console.log(withdrawalMethodResult.debugLogs);
        const action = withdrawalMethodResult.actionList[0] as any; // TODO: need to take type from ton lib
        console.log(action.message.info.value.coins);
        //expect(action.message.info.value.coins).toEqual(toNano(20));
    });
});
