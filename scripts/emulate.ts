import BN from 'bn.js'
import {
  Address,
  TonClient,
  contractAddress,
  beginCell,
  toNano,
  InternalMessage,
  fromNano,
  CommonMessageInfo,
  beginDict,
} from 'ton';
import { mnemonicNew } from "ton-crypto";
import { randomAddress } from '../src/utils/randomAddress';
import { OPS, OracleClientInitConfig, OracleMasterConfig } from '../src/OracleV1.data';
import { oracleMasterInitData, oracleUserInitData, oracleClientInitData } from '../src/OracleV1.data';
import { oracleMasterSourceV1CodeCell, oracleClientSourceV1CodeCell, oracleUserSourceV1CodeCell } from '../src/OracleV1.source';
import { getTonToUsdPrice, depositWaiter, deploySmartContract, createTransaction, generateWallet, seqnoWaiter } from './helpers';
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

  const rpcClient = new TonClient({
    endpoint,
    apiKey
  });

  const mnemonicOracle = await mnemonicNew();
  // const mnemonicOracle = [
  //   'sister', 'upgrade', 'eager',
  //   'certain', 'ahead', 'eight',
  //   'patch', 'rose', 'blue',
  //   'celery', 'process', 'human',
  //   'urban', 'peasant', 'crunch',
  //   'post', 'fantasy', 'voice',
  //   'razor', 'adjust', 'staff',
  //   'pyramid', 'aspect', 'erode'
  // ]
  const oracle = await generateWallet(rpcClient, mnemonicOracle);
  config.whitelisted_oracle_addresses = [oracle.wallet.address]

  const mnemonicOwner = await mnemonicNew();
  // const mnemonicOwner =
  //   [
  //     'spice', 'option', 'broken',
  //     'identify', 'beach', 'liberty',
  //     'fossil', 'age', 'camera',
  //     'lion', 'comfort', 'fold',
  //     'cattle', 'claw', 'grape',
  //     'width', 'scare', 'column',
  //     'early', 'exile', 'alone',
  //     'cradle', 'ordinary', 'road'
  //   ]
  const owner = await generateWallet(rpcClient, mnemonicOwner);
  config.admin_address = owner.wallet.address

  const mnemonicClient = await mnemonicNew();
  // const mnemonicClient =
  //   [
  //     'target', 'staff', 'exact',
  //     'jacket', 'obscure', 'assist',
  //     'note', 'cat', 'earth',
  //     'find', 'pull', 'subject',
  //     'guilt', 'furnace', 'fall',
  //     'magic', 'minimum', 'stamp',
  //     'add', 'keen', 'dwarf',
  //     'season', 'mom', 'fetch'
  //   ]
  const client = await generateWallet(rpcClient, mnemonicClient);

  // -------------- WALLETS ACTIVATION
  console.log(`Deposit 1TON to wallet ${owner.address}`)
  const linkForOwner = `ton://transfer/${owner.address}?amount=100000000`
  qrcode.generate(linkForOwner, { small: true });
  console.log(`Deposit 1TON to wallet ${client.address}`)
  const linkForClient = `ton://transfer/${client.address}?amount=2500000000`
  qrcode.generate(linkForClient, { small: true });
  const depositer1 = (await depositWaiter(rpcClient, owner.address)).toFriendly();
  const depositer2 = (await depositWaiter(rpcClient, client.address)).toFriendly();
  // const depositer1 = 'kQAf9V4MmFbGU_BMKTxJuM4pFSM5E7B70ECi_Od0hnHMGQps'
  console.log(`Depositer 1st wallet: ${depositer1}`)
  // console.log(`Depositer 2nd wallet: ${depositer2}`)
  // -------------- WALLETS ACTIVATION

  console.log(`owner wallet: ${owner.address}`)
  console.log(`client wallet: ${client.address}`)
  console.log(`oracle wallet: ${oracle.address}`)

  // -------------- ORACLE WALLET DEPLOY
  const depositToOracleByOwnerTrx = () => createTransaction(owner.wallet, owner.keys, oracle.wallet.address, beginCell().endCell(), toNano('0.7'));
  // -------------- ORACLE WALLET DEPLOY

  // -------------- MASTER SC DEPLOY
  const masterContractCode = oracleMasterSourceV1CodeCell
  const masterContractInitDataCell = oracleMasterInitData(config);
  const masterContractAddress = contractAddress({
    workchain: 0,
    initialCode: masterContractCode,
    initialData: masterContractInitDataCell,
  });
  console.log(`master contract address: ${masterContractAddress.toFriendly()}`)
  clientInitConfig.oracle_master_address = masterContractAddress
  const masterContractDeployTrx = () => deploySmartContract(owner.wallet, owner.keys, masterContractAddress, masterContractCode, masterContractInitDataCell);
  // -------------- MASTER SC DEPLOY

  // -------------- MASTER UPDATE BY ORACLE 
  const updateOnMasterByOracleTrx = async () => {
    const updateBody = beginCell()
      .storeUint(OPS.Update, 32) // opcode
      .storeUint(0, 64) // queryid
      .storeUint(await getTonToUsdPrice(), 64)
      .endCell()
    return await createTransaction(oracle.wallet, oracle.keys, masterContractAddress, updateBody);
  }
  // -------------- MASTER UPDATE BY ORACLE 

  // -------------- GENERATE CLIENT SC ADDRESS 
  const clientContractCode = oracleClientSourceV1CodeCell
  const clientContractInitDataCell = oracleClientInitData(clientInitConfig);
  const clientContractAddress = contractAddress({
    workchain: 0,
    initialCode: clientContractCode,
    initialData: clientContractInitDataCell,
  });
  console.log(`client contract address: ${clientContractAddress.toFriendly()}`)
  // -------------- GENERATE CLIENT SC ADDRESS 

  // -------------- USER SC DEPLOY
  const userContractCode = oracleUserSourceV1CodeCell
  const userContractInitDataCell = oracleUserInitData({});
  const userContractAddress = contractAddress({
    workchain: 0,
    initialCode: userContractCode,
    initialData: userContractInitDataCell,
  });
  console.log(`user contract address: ${userContractAddress.toFriendly()}`)
  const userContractDeployTrx = () => deploySmartContract(client.wallet, client.keys, userContractAddress, userContractCode, userContractInitDataCell);
  // -------------- USER SC DEPLOY

  // -------------- SIGNUP CALL 
  const signupBody = beginCell()
    .storeUint(OPS.Signup, 32) // opcode
    .storeUint(0, 64) // queryid
    .storeAddress(userContractAddress)
    .endCell()
  const clietnWalletBalance = await rpcClient.getBalance(client.wallet.address)
  const signupOnMasterByClientTrx = () => createTransaction(client.wallet, client.keys, masterContractAddress, signupBody, new BN(clietnWalletBalance.toNumber() - 1000000000));
  // -------------- SIGNUP CALL 

  // -------------- FETCH DATA FROM CLIENT SC CALL 
  const fetchBody = beginCell()
    .storeUint(OPS.Fetch, 32) // opcode
    .storeUint(0, 64) // queryid
    .storeAddress(clientContractAddress)
    .endCell()
  const fetchOnClientByUserTrx = () => createTransaction(client.wallet, client.keys, userContractAddress, fetchBody);
  // -------------- FETCH DATA FROM CLIENT SC CALL 

  // ------------- EXECUTION
  console.log('Execution has been started!')
  await rpcClient.sendExternalMessage(owner.wallet, await depositToOracleByOwnerTrx()); // deploy oracle 
  await seqnoWaiter(rpcClient, owner.wallet)
  console.log('Done oracle wallet deploy!')
  await rpcClient.sendExternalMessage(owner.wallet, await masterContractDeployTrx()); // deploy master
  await seqnoWaiter(rpcClient, owner.wallet)
  console.log('Done master sc deploy!')
  await rpcClient.sendExternalMessage(client.wallet, await userContractDeployTrx()) // deploy user contract
  await seqnoWaiter(rpcClient, client.wallet)
  console.log('Done user sc deploy!')
  await rpcClient.sendExternalMessage(client.wallet, await signupOnMasterByClientTrx()) // signup (deploy client contract) 
  await seqnoWaiter(rpcClient, client.wallet)
  console.log('Done signup!')

  const updatePrice = async (intervalUpdateStep: number) => {
    await rpcClient.sendExternalMessage(oracle.wallet, await updateOnMasterByOracleTrx()) // update master actual value
    await seqnoWaiter(rpcClient, oracle.wallet)
    const newValue = await rpcClient.callGetMethod(clientContractAddress, 'get_actual_value')
    if (intervalUpdateStep !== 1) console.log(`Price has been updated on client smart contract ${intervalUpdateStep} time! New value: 1TON ~ ${parseInt(newValue.stack[0][1]) / 100}$`)
  }

  await updatePrice(1)
  await updatePrice(2)
  let intervalUpdateStep = 2;
  let intervalUpdate = setInterval(async () => {
    intervalUpdateStep++;
    await updatePrice(intervalUpdateStep)
  }, 20000)

  const fetchPrice = async (intervalFetchStep: number) => {
    await rpcClient.sendExternalMessage(client.wallet, await fetchOnClientByUserTrx()) // fetch actual value from client contract
    await seqnoWaiter(rpcClient, client.wallet)
    const newValue = await rpcClient.callGetMethod(userContractAddress, 'get_actual_value')
    console.log(`Price has been fetched from client smart contract by user smart contract ${intervalFetchStep} time! New value: 1TON ~ ${parseInt(newValue.stack[0][1]) / 100}$`)
  }

  await fetchPrice(1)
  let intervalFetchStep = 1;
  let intervalFetch = setInterval(async () => {
    intervalFetchStep++;
    await fetchPrice(intervalFetchStep)
  }, 20000)

  const waiter: any = async () => new Promise((res, _) => {
    let i = setInterval(async () => {
      const clientContractBalance = await rpcClient.getBalance(clientContractAddress)
      console.log(`Client contract balance: ${fromNano(clientContractBalance)} TON`)
      if (clientContractBalance.toNumber() <= 200000000) { //0.2
        clearInterval(i);
        res(true)
      }
    }, 2000)
  })

  await waiter();

  clearInterval(intervalUpdate)
  clearInterval(intervalFetch)
  console.log('Done fetching price from client contract by user!')
  // -------------- WITHDRAWAL FROM MASTER BY OWNER
  const mainContractBalance = await rpcClient.getBalance(masterContractAddress)
  const withdrawalBody = beginCell()
    .storeUint(OPS.Withdrawal, 32) // opcode
    .storeUint(0, 64) // queryid
    .storeCoins(new BN(mainContractBalance.toNumber() - 100000000)) // amount
    .endCell()
  const withdrawalOnMasterByOwnerTrx = () => createTransaction(owner.wallet, owner.keys, masterContractAddress, withdrawalBody);
  // -------------- WITHDRAWAL FROM MASTER BY OWNER
  await rpcClient.sendExternalMessage(owner.wallet, await withdrawalOnMasterByOwnerTrx()) // withdrawal money from the sistem back to user wallet
  await seqnoWaiter(rpcClient, owner.wallet)
  console.log('Done withdrawal from master sc!')
  // -------------- WITHDRAWAL FROM OWNER TO DEPOSITER BY OWNER
  const ownerWalletBalance = await rpcClient.getBalance(owner.wallet.address)
  const seqnoOwnerWithdrawal: number = await owner.wallet.getSeqNo();
  const withdrawalOnOwnerByOwnerTrx = owner.wallet.createTransfer({
    secretKey: owner.keys.secretKey,
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
  await rpcClient.sendExternalMessage(owner.wallet, withdrawalOnOwnerByOwnerTrx) // withdrawal money from the sistem back to user wallet
  await seqnoWaiter(rpcClient, owner.wallet)
  console.log('Done withdrawal from owner wallet!')
  console.log('-----------\nDone raven v1 script!\n-----------')
}
emulateExecution() 
