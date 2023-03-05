import {
    beginCell,
    toNano,
} from 'ton';
import { contractConfig } from './IcoV1.data';
import { icoContract } from './IcoContract';

import { randomAddress } from './utils/randomAddress';

const config: contractConfig = {
    admin_address: randomAddress('ADMIN_ADDRESS'),
    metadata: {
        name: 'ICO',
        image: 'https://www.linkpicture.com/q/download_183.png', // todo change image url
        description: 'This is sample contract for ico',
    },
    total_supply: toNano(100),
    jetton_wallet_code: beginCell().endCell(), // todo add code of JW
};

describe('ICO sc', () => {
    let contract: icoContract;

    beforeEach(async () => {
        contract = await icoContract.createFromConfig(config);
    });

    it('test getter', async () => {
        const call = await contract.contract.invokeGetMethod('test', []);
        console.log(call.result[0]);
    });

    // todo buy jetton
    // todo mint jettons 
    // todo burn jettons

    // it('should send signup command and verify the outgoing data', async () => {
    //     const sc_address = randomAddress('smart_contract');
    //
    //     const stack = await masterContract.contract.sendInternalMessage(
    //         internalMessage({
    //             from: END_USER,
    //             value: toNano(2),
    //             body: IcoV1LocalMaster.createSignupPayload(sc_address),
    //         }),
    //     );
    //
    //     expect(stack.exit_code).toEqual(0);
    //     expect(stack.actionList.length).toEqual(1);
    //
    //     const accountCreationMessage = stack.actionList[0];
    //     expect(accountCreationMessage.type).toEqual('send_msg');
    // });
});

