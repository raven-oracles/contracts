import BN from 'bn.js'
import {
  Address,
  TonClient,
  StateInit,
  contractAddress,
  Cell,
  beginCell,
  CellMessage,
  toNano,
  WalletV3R2Source,
  WalletContract,
  InternalMessage,
  CommonMessageInfo,
} from 'ton';
import { mnemonicNew, mnemonicToPrivateKey } from "ton-crypto";
import { randomAddress } from '../src/utils/randomAddress';
import { loadAddressesDict, MODES, OPS, OracleClientInitConfig, OracleClientUploadConfig, oracleClientUploadData, OracleMasterConfig } from '../src/OracleV1.data';
import { oracleMasterInitData, oracleUserInitData, oracleClientInitData } from '../src/OracleV1.data';
import { oracleMasterSourceV1CodeCell, oracleClientSourceV1CodeCell, oracleUserSourceV1CodeCell } from '../src/OracleV1.source';
import { OracleV1LocalClient } from '../src/OracleV1LocalClient';
import { OracleV1LocalUser } from '../src/OracleV1LocalUser';

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
  actual_value: toNano(0),
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

  // const mnemonicOracle = await mnemonicNew();
  const mnemonicOracle = [
    'sister', 'upgrade', 'eager',
    'certain', 'ahead', 'eight',
    'patch', 'rose', 'blue',
    'celery', 'process', 'human',
    'urban', 'peasant', 'crunch',
    'post', 'fantasy', 'voice',
    'razor', 'adjust', 'staff',
    'pyramid', 'aspect', 'erode'
  ]
  const keyPairOracle = await mnemonicToPrivateKey(mnemonicOracle);
  const walletOracle = WalletContract.create(
    client,
    WalletV3R2Source.create({ publicKey: keyPairOracle.publicKey, workchain: 0 })
  );
  const addressOracle = walletOracle.address.toFriendly();
  config.whitelisted_oracle_addresses = [walletOracle.address]
  clientInitConfig.oracle_master_address = walletOracle.address
  clientUploadConfig.oracle_master_address = walletOracle.address
  clientUploadConfig.whitelisted_oracle_addresses = [walletOracle.address]
  console.log('oracle:')
  console.log(addressOracle) // Get contract address

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

  // const mnemonicClient = await mnemonicNew();
  // console.log(mnemonicClient)
  const mnemonicClient =
    [
      'target', 'staff', 'exact',
      'jacket', 'obscure', 'assist',
      'note', 'cat', 'earth',
      'find', 'pull', 'subject',
      'guilt', 'furnace', 'fall',
      'magic', 'minimum', 'stamp',
      'add', 'keen', 'dwarf',
      'season', 'mom', 'fetch'
    ]
  const keyPairClient = await mnemonicToPrivateKey(mnemonicClient);
  const walletClient = WalletContract.create(
    client,
    WalletV3R2Source.create({ publicKey: keyPairClient.publicKey, workchain: 0 })
  );
  const addressClient = walletClient.address.toFriendly();
  console.log('owner:')
  console.log(addressOwner) // Get contract address

  const linkForOwner = `ton://transfer/${addressOwner}?amount=50000000`
  // qrcode.generate(linkForOwner, { small: true });

  console.log('client:')
  console.log(addressClient) // Get contract address

  const linkForClient = `ton://transfer/${addressClient}?amount=50000000`
  // qrcode.generate(linkForClient, { small: true });

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
  clientUploadConfig.smartcontract_address = masterContractAddress

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


  const tonUsdPrice = toNano(2.44 * 100); // USD price in cents
  const newUpdateValueBody = beginCell()
    .storeUint(OPS.Update, 32) // opcode
    .storeUint(0, 64) // queryid
    .storeUint(tonUsdPrice, 64)
    .endCell()

  let seqnoOracle: number = await walletOracle.getSeqNo();
  const oracleTransaction = walletClient.createTransfer({
    secretKey: keyPairOracle.secretKey,
    seqno: seqnoOracle,
    sendMode: 3,
    order: new InternalMessage({
      to: masterContractAddress,
      value: toNano(0),
      bounce: false,
      body: new CommonMessageInfo({
        body: new CellMessage(newUpdateValueBody),
      })
    })
  })


  const userContractCode = oracleUserSourceV1CodeCell
  const userContractInitDataCell = oracleUserInitData({});

  const userInitCell = new Cell();
  new StateInit({
    code: userContractCode,
    data: userContractInitDataCell,
  }).writeTo(userInitCell);

  const userContractAddress = contractAddress({
    workchain: 0,
    initialCode: userContractCode,
    initialData: userContractInitDataCell,
  });
  // clientUploadConfig.smartcontract_address = masterContractAddress

  console.log(userContractAddress)
  // todo price updater
  // OracleV1LocalMaster.createSignupPayload(sc_address)
  //todo signup
  const newClientBody = beginCell()
    .storeUint(OPS.Signup, 32) // opcode
    .storeUint(0, 64) // queryid
    .storeAddress(userContractAddress)
    .endCell()
  //
  let seqnoClient: number = await walletClient.getSeqNo();
  const clientTransaction = walletClient.createTransfer({
    secretKey: keyPairClient.secretKey,
    seqno: seqnoClient,
    sendMode: 3,
    order: new InternalMessage({
      to: masterContractAddress,
      value: toNano(0.1),
      bounce: false,
      body: new CommonMessageInfo({
        body: new CellMessage(newClientBody),
      })
    })
  })
  // await client.sendExternalMessage(walletOwner, masteerContractDeployTrx);
  // await client.sendExternalMessage(walletOracle, oracleTransaction)
  await client.sendExternalMessage(walletClient, clientTransaction)
}
emulateExecution() 
