import BN from "bn.js";
import { Address, beginCell, Cell, toNano, TupleSlice4 } from "ton";
import { actionToMessage } from "./utils/actionToMessage";
import { internalMessage } from "./utils/internalMessage";
import {
  parseOracleDetails,
  parseJettonWalletDetails,
} from "./utils/jetton-utils";
import { randomAddress, zeroAddress } from "./utils/randomAddress";
import { OracleV1LocalMaster } from "./OracleV1LocalMaster";
import { OracleV1LocalClient } from "./OracleV1LocalClient";
import { convertFromExecutorStack } from "./utils/convertFromExecutorStack";
import { OPS } from "./OracleV1.data";
import { randomInt } from "crypto";
import { kill } from "process";

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

function assertCoins(a: BN, b: BN) {
  expect(a.eq(b)).toBeTruthy();
}

function updateBodyConstructor(params: { payload: BN }): Cell {
	return beginCell()
		.storeUint(0x757064617465 , 32)
		.storeUint(params.payload, 64)
		.endCell();


function fetchBodyConstructor(params: { payload: BN }): Cell {
	return beginCell()
		.storeUint(0x6665746368 , 32)
		.storeUint(params.payload, 64)
		.endCell();
}

describe("Oracle v1 Client Push", () => {
  console.log(1231376549);
  it("should get oracle master initialization data correctly", async () => {
  let clientContract: OracleV1LocalClient;
  clientContract = await OracleV1LocalClient.create();
    const call = await clientContract.contract.sendInternalMessage(internalMessage({
				from: randomAddress("notowner"),
				body: updateBodyConstructor({
					payload: toNano('2.35'),
				})}));

        console.log(call.debugLogs)

    const cal2 = await clientContract.contract.sendInternalMessage(internalMessage({
				from: randomAddress("notowner"),
				body: fetchBodyConstructor({
					payload: toNano('2.35'),
				})}));
  console.log(123123);
        console.log(cal2.actionList)

  });
})};
