import BN from 'bn.js'
import {
  Address,
  TonClient,
  StateInit,
  contractAddress,
  Cell,
  toNano,
  WalletV3R2Source,
  WalletContract,
  InternalMessage,
  CommonMessageInfo,
} from 'ton';
import { mnemonicNew, mnemonicToPrivateKey } from "ton-crypto";
import { randomAddress } from '../src/utils/randomAddress';
import { loadAddressesDict, MODES, OPS, OracleClientInitConfig, OracleClientUploadConfig, oracleClientUploadData, OracleMasterConfig } from '../src/OracleV1.data';
import { oracleMasterInitData } from '../src/OracleV1.data';
import { oracleMasterSourceV1CodeCell } from '../src/OracleV1.source';

import qrcode from "qrcode-terminal";

enum SendMode {
  CARRRY_ALL_REMAINING_BALANCE = 128,
  CARRRY_ALL_REMAINING_INCOMING_VALUE = 64,
  DESTROY_ACCOUNT_IF_ZERO = 32,
  PAY_GAS_SEPARATLY = 1,
  IGNORE_ERRORS = 2,
}

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

const depositWaiter = async (client: TonClient, address: Address) => new Promise((res, _) => {
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

  const keyPairOwner = await mnemonicToPrivateKey(mnemonicOwner);
  const walletOwner = WalletContract.create(
    client,
    WalletV3R2Source.create({ publicKey: keyPairOwner.publicKey, workchain: 0 })
  );
  const addressOwner = walletOwner.address.toFriendly();
  config.admin_address = walletOwner.address


  const mnemonicClient = await mnemonicNew();
  const keyPairClient = await mnemonicToPrivateKey(mnemonicClient);
  const walletClient = WalletContract.create(
    client,
    WalletV3R2Source.create({ publicKey: keyPairClient.publicKey, workchain: 0 })
  );
  const addressClient = walletClient.address.toFriendly();

  console.log('owner:')
  console.log(addressOwner) // Get contract address

  const linkForOwner = `ton://transfer/${addressOwner}?amount=50000000`
  qrcode.generate(linkForOwner, { small: true });

  console.log('client:')
  console.log(addressClient) // Get contract address

  const linkForClient = `ton://transfer/${addressClient}?amount=50000000`
  qrcode.generate(linkForClient, { small: true });

  // const depositer1 = await depositWaiter(client, walletOwner.address);
  // const depositer2 = await depositWaiter(client, walletClient.address);
  // console.log(depositer1)
  // console.log(depositer2)

  const masteerContractCode = oracleMasterSourceV1CodeCell
  const masterContractInitDataCell = oracleMasterInitData(config);

  const initCell = new Cell();
  new StateInit({
    code: masteerContractCode,
    data: masterContractInitDataCell,
  }).writeTo(initCell);

  const masterContractAddress = contractAddress({
    workchain: 0,
    initialCode: masteerContractCode,
    initialData: masterContractInitDataCell,
  });

  console.log(masterContractAddress)

  let seqno: number = await walletOwner.getSeqNo();

  const masteerContractDeployTrx = walletOwner.createTransfer({
    secretKey: keyPairOwner.secretKey,
    seqno: seqno,
    sendMode: SendMode.PAY_GAS_SEPARATLY + SendMode.IGNORE_ERRORS,
    order: new InternalMessage({
      to: masterContractAddress,
      value: toNano(0.05),
      bounce: false,
      body: new CommonMessageInfo({
        stateInit: new StateInit({
          code: masteerContractCode,
          data: masterContractInitDataCell,
        }),
        body: null,
      })
    })
  });

  await client.sendExternalMessage(walletOwner, masteerContractDeployTrx);

  //todo signup
  // const newBody = beginCell()
  //   .storeUint(0x6d2d3b45, 32)
  //   .storeUint(0, 64)
  //   .storeCoins(toNano(0.04))
  //   .endCell()
  //
  // let seqno1: number = await walletOwner.getSeqNo();
  // const trx1 = walletOwner.createTransfer({
  //   secretKey: keyPairOwner.secretKey,
  //   seqno: seqno1,
  //   sendMode: 64,
  //   order: new InternalMessage({
  //     to: addressa,
  //     value: toNano(0.03),
  //     bounce: false,
  //     body: new CommonMessageInfo({
  //       body: new CellMessage(newBody),
  //     })
  //   })
  // });
  // await client.sendExternalMessage(walletOwner, trx1)
}
emulateExecution() 
