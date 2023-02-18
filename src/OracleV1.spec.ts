import BN, { isBN } from 'bn.js';
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
import { loadAddressesDict, MODES, OPS, OracleClientInitConfig, OracleClientUploadConfig, oracleClientUploadData, OracleMasterConfig } from './OracleV1.data';
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

const config: OracleMasterConfig = {
    admin_address: randomAddress('ADMIN_ADDRESS'),
    metadata: {
        name: 'USDT/TON Price Oracle',
        image: 'https://www.linkpicture.com/q/download_183.png', // Image url
        description: 'This is master oracle for USDT/TON price',
    },
    comission_size: toNano(0.1),
    whitelisted_oracle_addresses: [randomAddress('WHITELISTED_ORACLE_ADDRESS')],
    number_of_clients: new BN(0),
    data_field: beginCell().storeUint(0, 32).endCell(),
};

const clientInitConfig: OracleClientInitConfig = {
    oracle_master_address: randomAddress('oracle_master_address'),
    client_id: new BN(0),
    balance: toNano(1)
};

const clientUploadConfig: OracleClientUploadConfig = {
    data_field: beginCell().storeUint(0, 32).endCell(),
    user_sc_address: randomAddress('user_sc_address'),
    oracle_master_address: randomAddress('oracle_master_address'),
    comission_size: toNano(0.1),
    mode: new BN(MODES.Subscription),
    interval: new BN(1),
};

describe('Oracle v1 Master', () => {
    let masterContract: OracleV1LocalMaster;

    beforeEach(async () => {
        masterContract = await OracleV1LocalMaster.createFromConfig(config);
    });

    it('should get oracle master initialization data correctly', async () => {
        const call = await masterContract.contract.invokeGetMethod('get_oracle_data', []);
        const { metadata, admin_address, comission_size, client_init_code, whitelisted_oracle_addresses, number_of_clients, data_field } =
            parseOracleDetails(call);

        expect(admin_address).toBeDefined();
        assertAddress(admin_address, config.admin_address);
        expect(metadata.name).toEqual('USDT/TON Price Oracle');
        expect(metadata.description).toEqual('This is master oracle for USDT/TON price');
        expect(client_init_code.hash()).toEqual(oracleClientSourceV1CodeCell.hash());
        assertCoins(comission_size, config.comission_size);
        assertAddressArray(whitelisted_oracle_addresses, config.whitelisted_oracle_addresses);
        expect(number_of_clients).toEqual(new BN(0));
        expect(data_field.toString()).toEqual(beginCell().storeUint(0, 32).endCell().toString());
    });

    it('should send signup command and verify the outgoing data', async () => {
        const user_sc_address = randomAddress('user_smart_contract');

        const stack = await masterContract.contract.sendInternalMessage(
            internalMessage({
                from: END_USER,
                value: toNano(2),
                body: OracleV1LocalMaster.createSignupPayload(user_sc_address, clientUploadConfig.interval, MODES.Subscription),
            }),
        );

        expect(stack.exit_code).toEqual(0);
        expect(stack.actionList.length).toEqual(1);

        const accountCreationMessage = stack.actionList[0];
        expect(accountCreationMessage.type).toEqual('send_msg');

        // TODO: How to test the init state of the deployed client contract?
    });

    it('should successfully withdraw requested amount of TONs', async () => {
        masterContract.contract.setC7Config({
            balance: toNano(20),
        });

        const withdrawalMethodResult = await masterContract.contract.sendInternalMessage(
            internalMessage({
                from: config.admin_address,
                value: toNano(0.2),
                body: beginCell()
                    .storeUint(OPS.Withdrawal, 32)
                    .storeUint(0, 64)
                    .storeCoins(toNano(10))
                    .endCell(),
            }),
        );

        expect(withdrawalMethodResult.type).toEqual('success');
        if (withdrawalMethodResult.type === 'success') {
            expect(withdrawalMethodResult.exit_code).toEqual(0);
            expect(withdrawalMethodResult.actionList.length).toEqual(1);
            const tx = withdrawalMethodResult.actionList[0];
            expect(tx.type).toEqual('send_msg');
            if (tx.type === 'send_msg') {
                expect(tx.message.info.type).toEqual('internal');
                if (tx.message.info.type === 'internal') {
                    assertCoins(tx.message.info.value.coins, new BN(toNano(10)));
                }
            }
        }
    });
});

describe('Oracle v1 Client', () => {
    let clientContract: OracleV1LocalClient;
    const tonUsdPrice = new BN(2.44 * 100); // USD price in cents
    const senderAddress = randomAddress('WHITELISTED_ORACLE_ADDRESS');

    beforeEach(async () => {
        clientContract = await OracleV1LocalClient.createFromConfig(clientInitConfig);
        await clientContract.contract.sendInternalMessage(
            internalMessage({
                value: toNano(1),
                from: clientInitConfig.oracle_master_address,
                body: oracleClientUploadData(clientUploadConfig),
            }),
        );
    });

    it('should update data on client contract correctly', async () => {
        const result = await clientContract.contract.sendInternalMessage(
            internalMessage({
                value: toNano(1),
                from: clientInitConfig.oracle_master_address,
                body: beginCell()
                    .storeUint(OPS.NewValue, 32)
                    .storeUint(0, 64)
                    .storeRef(beginCell().storeUint(tonUsdPrice, 32).endCell())
                    .endCell(),
            }),
        );

        console.log(result.debugLogs)
        expect(result.exit_code).toEqual(0);

        const getMethodResult = await clientContract.contract.invokeGetMethod('get_data_field', []);
        expect(getMethodResult.type).toEqual('success');
        // TODO: How do we test the value is right?
    });

    it('should fail updating data on client contract with 103 error', async () => {
        const result = await clientContract.contract.sendInternalMessage(
            internalMessage({
                value: toNano(1),
                from: randomAddress('UKNOWN_ORACLE_ADDRESS'),
                body: beginCell()
                    .storeUint(OPS.NewValue, 32)
                    .storeUint(0, 64)
                    .storeRef(beginCell().storeUint(tonUsdPrice, 32).endCell())
                    .endCell(),
            }),
        );

        expect(result.exit_code).toEqual(103);
    });

    it('should fail a fetch request with 101 error code - insufficient balance', async () => {
        clientContract.contract.setC7Config({
            balance: toNano(0),
        });

        const result = await clientContract.contract.sendInternalMessage(
            internalMessage({
                from: clientUploadConfig.user_sc_address,
                body: beginCell()
                    .storeUint(OPS.Fetch, 32)
                    .storeUint(0, 64)
                    .storeRef(beginCell().storeUint(tonUsdPrice, 32).endCell())
                    .endCell(),
            }),
        );

        expect(result.exit_code).toEqual(101);
    });

    it('should fail a fetch request with 103 error code - unallowed sc address for fetch', async () => {
        await clientContract.contract.sendInternalMessage(
            internalMessage({
                value: toNano(1),
                from: clientInitConfig.oracle_master_address,
                body: oracleClientUploadData({ ...clientUploadConfig, user_sc_address: randomAddress('NOT_ALLOWED_ADDRESS') }),
            }),
        );

        const result = await clientContract.contract.sendInternalMessage(
            internalMessage({
                from: senderAddress,
                body: beginCell()
                    .storeUint(OPS.Fetch, 32)
                    .storeUint(0, 64)
                    .storeRef(beginCell().storeUint(tonUsdPrice, 32).endCell())
                    .endCell(),
            }),
        );
        expect(result.exit_code).toEqual(103);
    });

    it('should successfully fetch actual value', async () => {
        await clientContract.contract.sendInternalMessage(
            internalMessage({
                value: toNano(1),
                from: clientUploadConfig.oracle_master_address,
                body: beginCell()
                    .storeUint(OPS.NewValue, 32)
                    .storeUint(0, 64)
                    .storeRef(beginCell().storeUint(tonUsdPrice, 32).endCell())
                    .endCell(),
            }),
        );

        const result = await clientContract.contract.sendInternalMessage(
            internalMessage({
                from: clientUploadConfig.user_sc_address,
                body: beginCell()
                    .storeUint(OPS.Fetch, 32)
                    .storeUint(0, 64)
                    .endCell(),
            }),
        );

        // TODO: test there were actual 2 tx send - comission payment and op::update
        console.log(result.debugLogs)
        expect(result.exit_code).toEqual(0);
    });

    if (clientUploadConfig.mode.toNumber() == MODES.Subscription) {
        it('ping payment should fail with 49 err', async () => {
            const result = await clientContract.contract.sendExternalMessage(
                new ExternalMessage({
                    to: clientContract.address,
                    from: clientUploadConfig.user_sc_address,
                    body: new CommonMessageInfo({
                        body: new CellMessage(beginCell().storeUint(OPS.Fetch, 32).storeUint(0, 64).endCell()),
                    }),
                }),
            );
            expect(result.exit_code).toEqual(49);
        });
    }
});



