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
const depositer1 = 'kQAf9V4MmFbGU_BMKTxJuM4pFSM5E7B70ECi_Od0hnHMGQps'

enum SendMode {
  CARRRY_ALL_REMAINING_BALANCE = 128,
  CARRRY_ALL_REMAINING_INCOMING_VALUE = 64,
  DESTROY_ACCOUNT_IF_ZERO = 32,
  PAY_GAS_SEPARATLY = 1,
  IGNORE_ERRORS = 2,
}

const config: OracleMasterConfig = {
  admin_address: randomAddress(''),
  metadata: {
    name: 'USDT/TON Price Oracle',
    image: 'https://www.linkpicture.com/q/download_183.png', // Image url
    description: 'This is master oracle for USDT/TON price',
  },
  comission_size: toNano(0.1),
  whitelisted_oracle_addresses: [],
  number_of_clients: new BN(0),
  actual_value: new BN(0),
};

const clientInitConfig: OracleClientInitConfig = {
  oracle_master_address: randomAddress(''),
  client_id: new BN(1),
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
  console.log('oracle wallet:')
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
  console.log('owner wallet:')
  console.log(addressOwner) // Get contract address

  const linkForOwner = `ton://transfer/${addressOwner}?amount=50000000`
  // qrcode.generate(linkForOwner, { small: true });

  console.log('client wallet:')
  console.log(addressClient) // Get contract address

  const linkForClient = `ton://transfer/${addressClient}?amount=50000000`
  // qrcode.generate(linkForClient, { small: true });

  // const depositer1 = await depositWaiter(client, walletOwner.address);
  // const depositer2 = await depositWaiter(client, walletClient.address);
  // console.log(depositer1)
  // console.log(depositer2)
  const masterContractCode = oracleMasterSourceV1CodeCell
  const masterContractInitDataCell = oracleMasterInitData(config);

  const initCell = new Cell();
  new StateInit({
    code: masterContractCode,
    data: masterContractInitDataCell,
  }).writeTo(initCell);

  const masterContractAddress = contractAddress({
    workchain: 0,
    initialCode: masterContractCode,
    initialData: masterContractInitDataCell,
  });
  clientInitConfig.oracle_master_address = masterContractAddress


  // -------------- Master deploy
  let seqno: number = await walletOwner.getSeqNo();

  const masterContractDeployTrx = walletOwner.createTransfer({
    secretKey: keyPairOwner.secretKey,
    seqno: seqno,
    sendMode: SendMode.PAY_GAS_SEPARATLY + SendMode.IGNORE_ERRORS,
    order: new InternalMessage({
      to: masterContractAddress,
      value: toNano(0.05),
      bounce: false,
      body: new CommonMessageInfo({
        stateInit: new StateInit({
          code: masterContractCode,
          data: masterContractInitDataCell,
        }),
        body: null,
      })
    })
  });
  // --------------

  // -------------- MASTER UPDATE BY ORACLE 
  const tonUsdPrice = new BN(2.44 * 100); // USD price in cents
  const newUpdateValueBody = beginCell()
    .storeUint(OPS.Update, 32) // opcode
    .storeUint(0, 64) // queryid
    .storeUint(tonUsdPrice, 64)
    .endCell()

  let seqnoOracle: number = await walletOracle.getSeqNo();
  const oracleTransaction = walletClient.createTransfer({
    secretKey: keyPairOracle.secretKey,
    seqno: seqnoOracle,
    sendMode: 64,
    order: new InternalMessage({
      to: masterContractAddress,
      value: toNano(0.05), // TODO WORK HERE
      bounce: false,
      body: new CommonMessageInfo({
        body: new CellMessage(newUpdateValueBody),
      })
    })
  })
  // --------------

  const clientContractCode = oracleClientSourceV1CodeCell
  const clientContractInitDataCell = oracleClientInitData(clientInitConfig);

  const clientContractAddress = contractAddress({
    workchain: 0,
    initialCode: clientContractCode,
    initialData: clientContractInitDataCell,
  });
  console.log('master contract address:')
  console.log(masterContractAddress)

  console.log('client contract address:')
  console.log(clientContractAddress)
  const userContractCode = oracleUserSourceV1CodeCell
  const userContractInitDataCell = oracleUserInitData({});

  const userContractAddress = contractAddress({
    workchain: 0,
    initialCode: userContractCode,
    initialData: userContractInitDataCell,
  });

  // -------------- user DEPLOY 
  let seqnoUserDeploy: number = await walletClient.getSeqNo();

  const userContractDeployTrx = walletClient.createTransfer({
    secretKey: keyPairClient.secretKey,
    seqno: seqnoUserDeploy,
    sendMode: SendMode.PAY_GAS_SEPARATLY + SendMode.IGNORE_ERRORS,
    order: new InternalMessage({
      to: userContractAddress,
      value: toNano(0.05),
      bounce: false,
      body: new CommonMessageInfo({
        stateInit: new StateInit({
          code: userContractCode,
          data: userContractInitDataCell,
        }),
        body: null,
      })
    })
  });
  // --------------

  // -------------- signup 
  console.log('user contract addres:')
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
  // --------------

  //  ---------------- user fetch
  const newClientUserFetchBody = beginCell()
    .storeUint(OPS.Fetch, 32) // opcode
    .storeUint(0, 64) // queryid
    .storeAddress(clientContractAddress)
    .endCell()

  let seqnoClientUserFetch: number = await walletClient.getSeqNo();
  const userContractFetchTrx = walletClient.createTransfer({
    secretKey: keyPairClient.secretKey,
    seqno: seqnoClient,
    sendMode: 64,
    order: new InternalMessage({
      to: userContractAddress,
      value: toNano(0.1),
      bounce: false,
      body: new CommonMessageInfo({
        body: new CellMessage(newClientUserFetchBody),
      })
    })
  })
  // --------------


  const getBalanceByAddress = async (add: Address) => {
    const balance = client.getBalance(add)
    return balance;
  }
  // -------------- Master withdraw
  const mainContractBalance = await getBalanceByAddress(masterContractAddress);

  const contractWithdrawalBody = beginCell()
    .storeUint(OPS.Withdrawal, 32) // opcode
    .storeUint(0, 64) // queryid
    .storeCoins(new BN(mainContractBalance.toNumber() - 1000000)) // amount
    .endCell()

  let seqnoOwnerWithdrawalFromSc: number = await walletOwner.getSeqNo();

  const ownerWithdrawalBalanceFromMaster = walletOwner.createTransfer({
    secretKey: keyPairOwner.secretKey,
    seqno: seqnoOwnerWithdrawalFromSc,
    sendMode: SendMode.PAY_GAS_SEPARATLY + SendMode.IGNORE_ERRORS,
    order: new InternalMessage({
      to: masterContractAddress,
      value: toNano(0.05),
      bounce: false,
      body: new CommonMessageInfo({
        body: new CellMessage(contractWithdrawalBody),
      })
    })
  });
  // --------------
  const ownerWalletBalance = await getBalanceByAddress(walletOwner.address);
  console.log(ownerWalletBalance.toNumber())

  let seqnoOwnerWithdrawal: number = await walletOwner.getSeqNo();

  const ownerWithdrawalBalance = walletOwner.createTransfer({
    secretKey: keyPairOwner.secretKey,
    seqno: seqnoOwnerWithdrawal,
    sendMode: 64,
    order: new InternalMessage({
      to: Address.parseFriendly(depositer1).address,
      value: new BN(ownerWalletBalance.toNumber() - 100000000),
      bounce: false,
      body: new CommonMessageInfo({
      })
    })
  });
  // --------------

  //
  // --------------
  // setTimeout(async () => {
  //   await client.sendExternalMessage(walletOwner, masterContractDeployTrx); // deploy master
  // }, 10)
  // setTimeout(async () => {
  //   await client.sendExternalMessage(walletClient, clientTransaction) // signup (deploy client contract) 
  // }, 5000)
  // setTimeout(async () => {
  //   await client.sendExternalMessage(walletOracle, oracleTransaction) // update master actual value
  // }, 10000)
  // setTimeout(async () => {
  //   let seqnoOracle: number = await walletOracle.getSeqNo();
  //   const oracleTransaction = walletClient.createTransfer({
  //     secretKey: keyPairOracle.secretKey,
  //     seqno: seqnoOracle,
  //     sendMode: 64,
  //     order: new InternalMessage({
  //       to: masterContractAddress,
  //       value: toNano(0.05), // TODO WORK HERE
  //       bounce: false,
  //       body: new CommonMessageInfo({
  //         body: new CellMessage(newUpdateValueBody),
  //       })
  //     })
  //   })
  //   await client.sendExternalMessage(walletOracle, oracleTransaction) // update master actual value
  // }, 15000)
  // --------------
  // --------------
  // await client.sendExternalMessage(walletClient, userContractDeployTrx) // deploy user contract
  // --------------
  // --------------
  // setTimeout(async () => {
  //   await client.sendExternalMessage(walletOracle, oracleTransaction) // update master actual value
  //   // await client.sendExternalMessage(walletOwner, masterContractDeployTrx); // deploy master
  // }, 10)
  // setTimeout(async () => {
  //   await client.sendExternalMessage(walletClient, userContractFetchTrx) // fetch actual value from client contract
  // }, 5000)
  // --------------
  // --------------
  // await client.sendExternalMessage(walletOwner, ownerWithdrawalBalanceFromMaster) // withdrawal money from the sistem back to user wallet
  // --------------
  // --------------
  await client.sendExternalMessage(walletOwner, ownerWithdrawalBalance) // withdrawal money from the sistem back to user wallet
  // --------------
  // await client.sendExternalMessage(walletClient, userContractDeployTrx) // deploy user contract
  // await client.sendExternalMessage(walletOracle, oracleTransaction) // update master actual value
  // await client.sendExternalMessage(walletClient, userContractFetchTrx) // fetch actual value from client contract
  //
  //TODO:
  //setIntrarval for ton price update every 30sec
  //setIntrarval for user fetch every 15sec
  //when money will be gone from client sc then withdrawal all from master contract back to depositer
}
emulateExecution() 
