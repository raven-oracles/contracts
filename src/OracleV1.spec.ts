import BN from "bn.js";
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
} from "ton";
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
import { info } from "console";

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

const config = {
  metadata: {
    name: "USDT/TON Price Oracle",
    image: "https://www.linkpicture.com/q/download_183.png", // Image url
    description: "This is master oracle for USDT/TON price",
  },
};

describe("Oracle v1 Master", () => {
  let masterContract: OracleV1LocalMaster;
  let clientContract: OracleV1LocalClient;

  const getClientContract = async (
    clientOwnerAddress: Address,
    oracleMasterAddress: Address
  ) =>
    await OracleV1LocalClient.create(clientOwnerAddress, oracleMasterAddress);

  beforeEach(async () => {
    masterContract = await OracleV1LocalMaster.createFromConfig(config);
  });

  it("should get oracle master initialization data correctly", async () => {
    const call = await masterContract.contract.invokeGetMethod(
      "get_oracle_data",
      []
    );

    const { metadata, address } = parseOracleDetails(call);

    expect(address).toBeDefined();
    expect(metadata.name).toEqual("USDT/TON Price Oracle");
    expect(metadata.description).toEqual(
      "This is master oracle for USDT/TON price"
    );
  });
});

describe("Oracle v1 Client", () => {
  let clientContract: OracleV1LocalClient;
  const tonPrice = "2.44";

  beforeEach(async () => {
    clientContract = await OracleV1LocalClient.create();
  });

  it("should update data on client contract correctly", async () => {
    await clientContract.contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("notowner"),
        body: beginCell()
          .storeUint(0x98253578, 32)
          .storeUint(toNano(tonPrice), 64)
          .endCell(),
      })
    );

    const getMethodResult = await clientContract.contract.invokeGetMethod(
      "get_stored_coin_price",
      []
    );

    expect(getMethodResult.result[0]).toEqual(toNano(tonPrice));
  });

  it("should fetch data from client contract correctly", async () => {
    await clientContract.contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("notowner"),
        body: beginCell()
          .storeUint(0x98253578, 32)
          .storeUint(toNano(tonPrice), 64)
          .endCell(),
      })
    );

    const fetchMethodResult = await clientContract.contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("notowner"),
        body: beginCell().storeUint(0x82e96343, 32).endCell(),
      })
    );

    const action = fetchMethodResult.actionList[0] as any; // TODO: need to take type from ton lib
    const resultValue = fromNano(
      parseInt(
        "0x" + String(action.message.body).slice(18).slice(0, -2).toLowerCase()
      )
    ); // TODO: find another way to get data from response

    expect(resultValue).toEqual(tonPrice);
  });
});
