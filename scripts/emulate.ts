import BN from 'bn.js'
import {
  Address,
  TonClient,
  contractAddress,
  beginCell,
  toNano,
  InternalMessage,
  CommonMessageInfo,
} from 'ton';
import { randomAddress } from '../src/utils/randomAddress';
import { OPS, OracleClientInitConfig, OracleMasterConfig } from '../src/OracleV1.data';
import { oracleMasterInitData, oracleUserInitData, oracleClientInitData } from '../src/OracleV1.data';
import { oracleMasterSourceV1CodeCell, oracleClientSourceV1CodeCell, oracleUserSourceV1CodeCell } from '../src/OracleV1.source';
import { depositWaiter, deploySmartContract, createTransaction, generateWallet } from './helpers';
import qrcode from "qrcode-terminal";

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
  const { keyPairOracle, walletOracle, addressOracle } = await generateWallet('oracle', client, mnemonicOracle);
  config.whitelisted_oracle_addresses = [walletOracle.address]

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
  const { keyPairOwner, walletOwner, addressOwner } = await generateWallet('owner', client, mnemonicOwner);
  config.admin_address = walletOwner.address

  // const mnemonicClient = await mnemonicNew();
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
  const { keyPairClient, walletClient, addressClient } = await generateWallet('client', client, mnemonicClient);

  // -------------- WALLETS ACTIVATION
  // const linkForOwner = `ton://transfer/${addressOwner}?amount=50000000`
  // qrcode.generate(linkForOwner, { small: true });
  // const linkForClient = `ton://transfer/${addressClient}?amount=50000000`
  // qrcode.generate(linkForClient, { small: true });
  // const depositer1 = await depositWaiter(client, walletOwner.address);
  const depositer1 = 'kQAf9V4MmFbGU_BMKTxJuM4pFSM5E7B70ECi_Od0hnHMGQps'
  // const depositer2 = await depositWaiter(client, walletClient.address);
  // console.log(depositer1)
  // console.log(depositer2)
  // -------------- WALLETS ACTIVATION

  // -------------- MASTER SC DEPLOY
  const masterContractCode = oracleMasterSourceV1CodeCell
  const masterContractInitDataCell = oracleMasterInitData(config);
  const masterContractAddress = contractAddress({
    workchain: 0,
    initialCode: masterContractCode,
    initialData: masterContractInitDataCell,
  });
  console.log(`master contract address: ${masterContractAddress}`)
  clientInitConfig.oracle_master_address = masterContractAddress
  const masterContractDeployTrx = await deploySmartContract(walletOwner, keyPairOwner, masterContractAddress, masterContractCode, masterContractInitDataCell);
  // -------------- MASTER SC DEPLOY

  // -------------- MASTER UPDATE BY ORACLE 
  const tonUsdPrice = new BN(2.44 * 100); // USD price in cents
  const updateBody = beginCell()
    .storeUint(OPS.Update, 32) // opcode
    .storeUint(0, 64) // queryid
    .storeUint(tonUsdPrice, 64)
    .endCell()
  const updateOnMasterByOracleTrx = await createTransaction(walletOracle, keyPairOracle, masterContractAddress, updateBody);
  // -------------- MASTER UPDATE BY ORACLE 

  // -------------- USER SC DEPLOY
  const userContractCode = oracleUserSourceV1CodeCell
  const userContractInitDataCell = oracleUserInitData({});
  const userContractAddress = contractAddress({
    workchain: 0,
    initialCode: userContractCode,
    initialData: userContractInitDataCell,
  });
  console.log(`user contract address: ${userContractAddress}`)
  const userContractDeployTrx = await deploySmartContract(walletClient, keyPairClient, userContractAddress, userContractCode, userContractInitDataCell);

  // -------------- SIGNUP CALL 
  const signupBody = beginCell()
    .storeUint(OPS.Signup, 32) // opcode
    .storeUint(0, 64) // queryid
    .storeAddress(userContractAddress)
    .endCell()
  const signupOnMasterByClientTrx = await createTransaction(walletClient, keyPairClient, masterContractAddress, signupBody);
  // -------------- SIGNUP CALL 

  // -------------- FETCH DATA FROM CLIENT SC CALL 
  const clientContractCode = oracleClientSourceV1CodeCell
  const clientContractInitDataCell = oracleClientInitData(clientInitConfig);
  const clientContractAddress = contractAddress({
    workchain: 0,
    initialCode: clientContractCode,
    initialData: clientContractInitDataCell,
  });
  console.log(`client contract address: ${clientContractAddress}`)
  const fetchBody = beginCell()
    .storeUint(OPS.Fetch, 32) // opcode
    .storeUint(0, 64) // queryid
    .storeAddress(clientContractAddress)
    .endCell()
  const fetchOnClientByUserTrx = await createTransaction(walletClient, keyPairClient, userContractAddress, fetchBody);
  // -------------- FETCH DATA FROM CLIENT SC CALL 

  // -------------- WITHDRAWAL FROM MASTER BY OWNER
  const mainContractBalance = await client.getBalance(masterContractAddress)
  const withdrawalBody = beginCell()
    .storeUint(OPS.Withdrawal, 32) // opcode
    .storeUint(0, 64) // queryid
    .storeCoins(new BN(mainContractBalance.toNumber() - 1000000)) // amount
    .endCell()
  const withdrawalOnMasterByOwnerTrx = await createTransaction(walletOwner, keyPairOwner, masterContractAddress, withdrawalBody);
  // -------------- WITHDRAWAL FROM MASTER BY OWNER

  // -------------- WITHDRAWAL FROM OWNER TO DEPOSITER BY OWNER
  const ownerWalletBalance = await client.getBalance(walletOwner.address)
  console.log(ownerWalletBalance.toNumber() - 100000000)
  const seqnoOwnerWithdrawal: number = await walletOwner.getSeqNo();
  const withdrawalOnOwnerByOwnerTrx = walletOwner.createTransfer({
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
  // -------------- WITHDRAWAL FROM OWNER TO DEPOSITER BY OWNER

  // -------------- EXECUTION
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
  // await client.sendExternalMessage(walletOwner, ownerWithdrawalBalance) // withdrawal money from the sistem back to user wallet
  // --------------
  // await client.sendExternalMessage(walletClient, userContractDeployTrx) // deploy user contract
  // await client.sendExternalMessage(walletOracle, oracleTransaction) // update master actual value
  // await client.sendExternalMessage(walletClient, userContractFetchTrx) // fetch actual value from client contract
  //
  //TODO:
  //setIntrarval for ton price update every 30sec
  //setIntrarval for user fetch every 15sec
  //when money will be gone from client sc then withdrawal all from master contract back to depositer
  // -------------- EXECUTION
}
emulateExecution() 
