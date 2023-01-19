import BN, { isBN } from 'bn.js'
import {
  Address,
  TonClient,
  Wallet, CellMessage,
  StateInit,
  contractAddress,
  Cell,
  beginCell,
  toNano,
  WalletV3R2Source,
  WalletContract,
  InternalMessage,
  CommonMessageInfo,
  Message
} from 'ton';
import {
  sign,
  mnemonicNew, mnemonicToPrivateKey
} from "ton-crypto";
import { actionToMessage } from '../src/utils/actionToMessage';
import { internalMessage } from '../src/utils/internalMessage';
import { parseOracleDetails, parseJettonWalletDetails } from '../src/utils/jetton-utils';
import { randomAddress, zeroAddress } from '../src/utils/randomAddress';
import { OracleV1LocalMaster } from '../src/OracleV1LocalMaster';
import { OracleV1LocalClient } from '../src/OracleV1LocalClient';
import { convertFromExecutorStack } from '../src/utils/convertFromExecutorStack';
import { loadAddressesDict, MODES, OPS, OracleClientInitConfig, OracleClientUploadConfig, oracleClientUploadData, OracleMasterConfig } from '../src/OracleV1.data';
import { randomInt } from 'crypto';
import { kill } from 'process';
import { info, warn } from 'console';
import { oracleClientSourceV1CodeCell } from '../src/OracleV1.source';
import { oracleMasterInitData } from '../src/OracleV1.data';
import { oracleMasterSourceV1, oracleMasterSourceV1CodeCell } from '../src/OracleV1.source';
import { compileFunc } from '../src/utils/compileFunc';

// import { Providers, Mnemonic, Builder, BOC } from 'ton3'
// import {
//   Contracts, Coins
// } from 'ton3-core'
// import { Wallets } from 'ton3-contracts'
import qrcode from "qrcode-terminal";

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
  actual_value: new BN(0),
};

const clientInitConfig: OracleClientInitConfig = {
  oracle_master_address: randomAddress('oracle_master_address'),
  client_id: new BN(0),
  balance: toNano(1)
};

const clientUploadConfig: OracleClientUploadConfig = {
  actual_value: new BN(0),
  owner_address: randomAddress('owner_address'),
  oracle_master_address: randomAddress('oracle_master_address'),
  smartcontract_address: randomAddress('smartcontract_address'),
  comission_size: toNano(0.1),
  whitelisted_oracle_addresses: [randomAddress('WHITELISTED_ORACLE_ADDRESS')],
  mode: new BN(MODES.OnDemand),
  interval: new BN(1),
};

// todo generate wallets
// todo deposit waiter
// todo masterContract deploy from ownerWallet + update data function
// todo signup from clientWallet
// todo deploy clientContract and userContract 
// todo withdraw entire balance when money on userContract is gone 

const worker: any = async (client: TonClient, contract: WalletContract, trx: Cell) => new Promise(async (res, _) => {
  try {
    const result: any = await client.sendExternalMessage(contract, trx);
    console.log(result);
    // console.log(result.response.status);
    // console.log(123)
    // if (result.response.status !== 200) {
    //   return await worker(client, contract, trx)
    // }
    return res(true);
  } catch (e) {
    console.log(e)
    // return setTimeout(async () => {
    //   console.log(e);
    //   return await worker(client, contract, trx)
    // }, 1000)
  }
})
const workerInternal: any = async (client: TonClient, contract: WalletContract, trx: Message) => new Promise(async (res, _) => {
  try {
    const result: any = await client.sendMessage(trx);
    console.log(result);
    // console.log(result.response.status);
    // console.log(123)
    // if (result.response.status !== 200) {
    //   return await worker(client, contract, trx)
    // }
    return res(true);
  } catch (e) {
    console.log(e)
    // return setTimeout(async () => {
    //   console.log(e);
    //   return await worker(client, contract, trx)
    // }, 1000)
  }
})

const depositWaiter = async (client: TonClient, address: Address) => new Promise((res, rej) => {
  let i = setInterval(async () => {
    const transactions = await client.getTransactions(address, { limit: 1 });
    if (transactions.length > 0) {
      clearInterval(i);
      res(transactions[0].inMessage?.source)
    }
  }, 1000)
})

const emulateExecution = async () => {
  const endpoint = 'https://testnet.toncenter.com/api/v2/jsonRPC'
  const apiKey = '90b7661848dd60552f44bbcb30ad961127dcc21961707bf3b86ca0fb93933d0e'

  const client = new TonClient({
    endpoint,
    apiKey
  });

  // const mnemonicOwner = await mnemonicNew();

  const mnemonicOwner =
    [
      'spice', 'option', 'broken',
      'identify', 'beach', 'liberty',
      'fossil', 'age', 'camera',
      'lion', 'comfort', 'fold',
      'cattle', 'claw', 'grape',
      'width', 'scare', 'column',
      'early', 'exile', 'alone',
      'cradle', 'ordinary', 'road'
    ]
  console.log(mnemonicOwner)
  const keyPairOwner = await mnemonicToPrivateKey(mnemonicOwner);
  // const walletOwner = Wallet.openDefault(client, 0, keyPairOwner.secretKey);
  const walletOwner = WalletContract.create(
    client,
    WalletV3R2Source.create({ publicKey: keyPairOwner.publicKey, workchain: 0 })
  );
  const addressOwner = walletOwner.address.toFriendly();

  const mnemonicClient = await mnemonicNew();
  const keyPairClient = await mnemonicToPrivateKey(mnemonicClient);
  const walletClient = Wallet.openDefault(client, 0, keyPairClient.secretKey);
  const addressClient = walletOwner.address.toFriendly();

  console.log('owner:')
  console.log(addressOwner) // Get contract address

  config.admin_address = walletOwner.address
  console.log(config)

  const linkForOwner = `ton://transfer/${addressOwner}?amount=150000000`
  await qrcode.generate(linkForOwner, { small: true });

  // console.log('client:')
  // console.log(addressClient) // Get contract address

  // const linkForClient = `ton://transfer/${addressClient}?amount=50000000`
  // await qrcode.generate(linkForClient, { small: true });

  //  const depositer1 = await depositWaiter(client, walletOwner.address);
  // const depositer2 = await depositWaiter(client, walletClient.address);
  // console.log(depositer1)
  const code = await compileFunc(oracleMasterSourceV1());
  const data = oracleMasterInitData(config);
  const masterContract = await OracleV1LocalMaster.createFromConfig(config);

  // const address = contractAddress({
  //   workchain: 0,
  //   initialData: data,
  //   initialCode: code.cell,
  // });
  //
  // const body = beginCell()
  //   .storeUint(0, 6)
  //   .storeDict(code.cell)
  //   .storeDict(data)
  //   .storeUint(0, 1)
  //   .endCell();
  // console.log(mnemonicOwner);
  const codeCell = oracleMasterSourceV1CodeCell

  const initCell = new Cell();

  new StateInit({
    code: codeCell,
    data: data,
  }).writeTo(initCell);

  const addressa = contractAddress({
    workchain: 0,
    initialCode: codeCell,
    initialData: data,
  });
  // // Create wallet v4
  console.log(addressa)
  // // Sign
  enum SendMode {
    CARRRY_ALL_REMAINING_BALANCE = 128,
    CARRRY_ALL_REMAINING_INCOMING_VALUE = 64,
    DESTROY_ACCOUNT_IF_ZERO = 32,
    PAY_GAS_SEPARATLY = 1,
    IGNORE_ERRORS = 2,
  }

  let seqno: number = await walletOwner.getSeqNo();
  const trx = walletOwner.createTransfer({
    secretKey: keyPairOwner.secretKey,
    seqno: seqno,
    sendMode: SendMode.PAY_GAS_SEPARATLY + SendMode.IGNORE_ERRORS,
    order: new InternalMessage({
      to: addressa,
      value: toNano(0.05),
      bounce: false,
      body: new CommonMessageInfo({
        stateInit: new StateInit({
          code: codeCell,
          data: data,
        }),
        body: null,
      })
    })
  });
  // deploy
  // await worker(client, walletOwner, trx)

  const newBody = beginCell()
    .storeUint(0x6d2d3b45, 32)
    .storeUint(0, 64)
    .storeCoins(toNano(0.04))
    .endCell()

  let seqno1: number = await walletOwner.getSeqNo();
  const trx1 = walletOwner.createTransfer({
    secretKey: keyPairOwner.secretKey,
    seqno: seqno1,
    sendMode: 64,
    order: new InternalMessage({
      to: addressa,
      value: toNano(0.03),
      bounce: false,
      body: new CommonMessageInfo({
        body: new CellMessage(newBody),
      })
    })
  });
  //test
  await client.sendExternalMessage(walletOwner, trx1)

  // const trx1 = walletOwner.createTransfer({
  //   secretKey: keyPairOwner.secretKey,
  //   seqno: seqno,
  //   sendMode: 3,
  //   order: new InternalMessage({
  //     to: addressa,
  //     from: walletOwner.address,
  //     value: 0.03,
  //     bounce: false,
  //     body: new CommonMessageInfo({
  //       stateInit: null,
  //       body: new CellMessage(newBody),
  //     })
  //   })
  // });


  // body: new CommonMessageInfo({
  //   body: new CellMessage(newBody),
  // })
  //
  // sign(trx1.toBoc(), keyPairOwner.secretKey)
  // await workerInternal(client, walletOwner, trx2)
  // Send
  // let seqno: number = await walletOwner.getSeqNo();
  // let transfer = await walletOwner.transferSign({
  //   seqno,
  //   to: addressa,
  //   value: new BN(0.05),
  //   secretKey: keyPairOwner.secretKey,
  //   bounce: false,
  //   payload: initCell
  // })
  // // console.log(Buffer.from(transfer.toBoc(), 'base64'))
  // console.log(transfer.toBoc().toString('base64'))
  // // console.log(transfer.toString())
  // console.log(transfer.toDebugString('base64'))

  //

  //  const newBody = beginCell()
  //    .storeUint(OPS.Withdrawal, 32)
  //    .storeUint(0, 64)
  //    .storeCoins(toNano(0.03))
  //    .endCell()
  //
  //  let transfer2 = await walletOwner.transfer({
  //    seqno,
  //    to: address,
  //    value: new BN(0),
  //    secretKey: keyPairOwner.secretKey,
  //    bounce: false,
  //    payload: newBody
  //  })
  //  console.log(transfer2)
  // //BOC.toBase64Standard(deploy)
  //
  // const ton3Cell = BOC.fromStandard(new Uint8Array(data.toBoc().toJSON().data));
  // const ton3Cell1 = BOC.fromStandard(new Uint8Array(code.cell.toBoc().toJSON().data));
  //
  // await highloadOwner.createTransferMessage([{
  //   destination: address,
  //   amount: new Coins(0),
  //   body: ton3Cell1 as any,
  //   init: ton3Cell as any,
  //   mode: 64
  // }])
}

emulateExecution()

//describe('Oracle v1 Master', () => {
//  let masterContract: OracleV1LocalMaster;
//
//  beforeEach(async () => {
//    masterContract = await OracleV1LocalMaster.createFromConfig(config);
//  });
//
//  it('should get oracle master initialization data correctly', async () => {
//    const call = await masterContract.contract.invokeGetMethod('get_oracle_data', []);
//    const { metadata, admin_address, comission_size, client_init_code, whitelisted_oracle_addresses, number_of_clients, actual_value } =
//      parseOracleDetails(call);
//
//    expect(admin_address).toBeDefined();
//    assertAddress(admin_address, config.admin_address);
//    expect(metadata.name).toEqual('USDT/TON Price Oracle');
//    expect(metadata.description).toEqual('This is master oracle for USDT/TON price');
//    expect(client_init_code.hash()).toEqual(oracleClientSourceV1CodeCell.hash());
//    assertCoins(comission_size, config.comission_size);
//    assertAddressArray(whitelisted_oracle_addresses, config.whitelisted_oracle_addresses);
//    expect(number_of_clients).toEqual(new BN(0));
//    expect(actual_value).toEqual(new BN(0));
//  });
//
//  it('should send signup command and verify the outgoing data', async () => {
//    const sc_address = randomAddress('smart_contract');
//
//    const stack = await masterContract.contract.sendInternalMessage(
//      internalMessage({
//        from: END_USER,
//        value: toNano(2),
//        body: OracleV1LocalMaster.createSignupPayload(sc_address),
//      }),
//    );
//
//    expect(stack.exit_code).toEqual(0);
//    expect(stack.actionList.length).toEqual(1);
//
//    const accountCreationMessage = stack.actionList[0];
//    expect(accountCreationMessage.type).toEqual('send_msg');
//
//    // TODO: How to test the init state of the deployed client contract?
//  });
//
//  // TODO clients_update check
//  it('should update actual_value on master contract correctly', async () => {
//    const tonUsdPrice = new BN(2.44 * 100); // USD price in cents
//
//    const result = await masterContract.contract.sendInternalMessage(
//      internalMessage({
//        value: toNano(1),
//        from: config.whitelisted_oracle_addresses[0],
//        body: beginCell()
//          .storeUint(OPS.Update, 32)
//          .storeUint(0, 64)
//          .storeUint(tonUsdPrice, 64)
//          .endCell(),
//      }),
//    );
//    expect(result.exit_code).toEqual(0);
//    expect(result.type).toEqual('success');
//    // TODO: How do we test the value is right?
//    // TODO: Test that update was send to ALL client contracts
//  });
//
//  it('should fail updating actual_value on master contract with 103 error', async () => {
//    const tonUsdPrice = new BN(2.44 * 100); // USD price in cents
//    const senderAddress = randomAddress('UKNOWN_ORACLE_ADDRESS')
//
//    const result = await masterContract.contract.sendInternalMessage(
//      internalMessage({
//        value: toNano(1),
//        from: senderAddress,
//        body: beginCell()
//          .storeUint(OPS.Update, 32)
//          .storeUint(0, 64)
//          .storeUint(tonUsdPrice, 64)
//          .endCell(),
//      }),
//    );
//
//    expect(result.exit_code).toEqual(103);
//  });
//
//  it('should successfully withdraw requested amount of TONs', async () => {
//    masterContract.contract.setC7Config({
//      balance: toNano(20),
//    });
//
//    const withdrawalMethodResult = await masterContract.contract.sendInternalMessage(
//      internalMessage({
//        from: config.admin_address,
//        value: toNano(0.2),
//        body: beginCell()
//          .storeUint(OPS.Withdrawal, 32)
//          .storeUint(0, 64)
//          .storeCoins(toNano(10))
//          .endCell(),
//      }),
//    );
//
//    expect(withdrawalMethodResult.type).toEqual('success');
//    if (withdrawalMethodResult.type === 'success') {
//      expect(withdrawalMethodResult.exit_code).toEqual(0);
//      expect(withdrawalMethodResult.actionList.length).toEqual(1);
//      const tx = withdrawalMethodResult.actionList[2];
//      expect(tx.type).toEqual('send_msg');
//      if (tx.type === 'send_msg') {
//        expect(tx.message.info.type).toEqual('internal');
//        if (tx.message.info.type === 'internal') {
//          assertCoins(tx.message.info.value.coins, new BN(toNano(10)));
//        }
//      }
//    }
//  });
//});
//
//describe('Oracle v1 Client', () => {
//  let clientContract: OracleV1LocalClient;
//  const tonUsdPrice = new BN(2.44 * 100); // USD price in cents
//  const senderAddress = randomAddress('WHITELISTED_ORACLE_ADDRESS');
//
//  beforeEach(async () => {
//    clientContract = await OracleV1LocalClient.createFromConfig(clientInitConfig);
//    await clientContract.contract.sendInternalMessage(
//      internalMessage({
//        value: toNano(1),
//        from: clientInitConfig.oracle_master_address,
//        body: oracleClientUploadData(clientUploadConfig),
//      }),
//    );
//  });
//
//  it('should store updated data on client contract correctly', async () => {
//    const result = await clientContract.contract.sendInternalMessage(
//      internalMessage({
//        value: toNano(1),
//        from: clientInitConfig.oracle_master_address,
//        body: beginCell()
//          .storeUint(OPS.NewValue, 32)
//          .storeUint(0, 64)
//          .storeUint(tonUsdPrice, 64)
//          .endCell(),
//      }),
//    );
//
//    expect(result.exit_code).toEqual(0);
//
//    const getMethodResult = await clientContract.contract.invokeGetMethod('get_actual_value', []);
//    expect(getMethodResult.type).toEqual('success');
//    // TODO: How do we test the value is right?
//  });
//
//  it('should fail a fetch request with 101 error code - insufficient balance', async () => {
//    clientContract.contract.setC7Config({
//      balance: toNano(0),
//    });
//
//    const result = await clientContract.contract.sendInternalMessage(
//      internalMessage({
//        from: clientUploadConfig.smartcontract_address,
//        body: beginCell()
//          .storeUint(OPS.Fetch, 32)
//          .storeUint(0, 64)
//          .storeUint(tonUsdPrice, 64)
//          .endCell(),
//      }),
//    );
//
//    expect(result.exit_code).toEqual(101);
//  });
//
//  it('should fail a fetch request with 103 error code - unallowed sc address for fetch', async () => {
//    await clientContract.contract.sendInternalMessage(
//      internalMessage({
//        value: toNano(1),
//        from: clientInitConfig.oracle_master_address,
//        body: oracleClientUploadData({ ...clientUploadConfig, smartcontract_address: randomAddress('NOT_ALLOWED_ADDRESS') }),
//      }),
//    );
//
//    const result = await clientContract.contract.sendInternalMessage(
//      internalMessage({
//        from: senderAddress,
//        body: beginCell()
//          .storeUint(OPS.Fetch, 32)
//          .storeUint(0, 64)
//          .storeUint(tonUsdPrice, 64)
//          .endCell(),
//      }),
//    );
//    expect(result.exit_code).toEqual(103);
//  });
//
//  it('should successfully fetch actual value', async () => {
//    await clientContract.contract.sendInternalMessage(
//      internalMessage({
//        value: toNano(1),
//        from: clientUploadConfig.oracle_master_address,
//        body: beginCell()
//          .storeUint(OPS.NewValue, 32)
//          .storeUint(0, 64)
//          .storeUint(tonUsdPrice, 64)
//          .endCell(),
//      }),
//    );
//
//    const result = await clientContract.contract.sendInternalMessage(
//      internalMessage({
//        from: clientUploadConfig.smartcontract_address,
//        body: beginCell()
//          .storeUint(OPS.Fetch, 32)
//          .storeUint(0, 64)
//          .endCell(),
//      }),
//    );
//
//    // TODO: test there were actual 2 tx send - comission payment and op::update
//    expect(result.exit_code).toEqual(0);
//  });
//});


