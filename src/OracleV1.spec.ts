import BN from "bn.js";
import { Address, beginCell, toNano, TupleSlice4 } from "ton";
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
