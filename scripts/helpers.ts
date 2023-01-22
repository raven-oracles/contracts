import { mnemonicNew, KeyPair, mnemonicToPrivateKey } from "ton-crypto";
import {
  Address,
  TonClient,
  StateInit,
  Cell,
  CellMessage,
  toNano,
  WalletV3R2Source,
  WalletContract,
  InternalMessage,
  CommonMessageInfo,
} from 'ton';

enum SendMode {
  CARRRY_ALL_REMAINING_BALANCE = 128,
  CARRRY_ALL_REMAINING_INCOMING_VALUE = 64,
  DESTROY_ACCOUNT_IF_ZERO = 32,
  PAY_GAS_SEPARATLY = 1,
  IGNORE_ERRORS = 2,
}

export const deploySmartContract = async (wallet: WalletContract, keyPair: KeyPair, toAddress: Address, code: Cell, data: Cell) => {
  let seqno: number = await wallet.getSeqNo();

  const trx = wallet.createTransfer({
    secretKey: keyPair.secretKey,
    seqno: seqno,
    sendMode: SendMode.PAY_GAS_SEPARATLY + SendMode.IGNORE_ERRORS,
    order: new InternalMessage({
      to: toAddress,
      value: toNano(0.1),
      bounce: false,
      body: new CommonMessageInfo({
        stateInit: new StateInit({
          code,
          data,
        }),
        body: null,
      })
    })
  });

  return trx;
}

export const createTransaction = async (wallet: WalletContract, keyPair: KeyPair, toAddress: Address, body: Cell) => {
  let seqno: number = await wallet.getSeqNo();

  const trx = wallet.createTransfer({
    secretKey: keyPair.secretKey,
    seqno: seqno,
    sendMode: SendMode.PAY_GAS_SEPARATLY + SendMode.IGNORE_ERRORS,
    order: new InternalMessage({
      to: toAddress,
      value: 0,
      bounce: false,
      body: new CommonMessageInfo({
        body: new CellMessage(body),
      })
    })
  });

  return trx;
}

export const depositWaiter = async (client: TonClient, address: Address) => new Promise((res, _) => {
  let i = setInterval(async () => {
    const transactions = await client.getTransactions(address, { limit: 1 });
    if (transactions.length > 0) {
      clearInterval(i);
      res(transactions[0].inMessage?.source)
    }
  }, 1000)
})

export const generateWallet = async (name: string, client: TonClient, mnemonic: string[]) => {
  // const mnemonic = await mnemonicNew();
  const keys = await mnemonicToPrivateKey(mnemonic);
  const wallet = WalletContract.create(
    client,
    WalletV3R2Source.create({ publicKey: keys.publicKey, workchain: 0 })
  );
  const address = wallet.address.toFriendly();
  console.log(`${name} wallet: ${address}`)
  return { keys, wallet, address }
}
