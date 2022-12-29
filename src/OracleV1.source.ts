import { Cell } from "ton";
import { combineFunc } from "./utils/combineFunc";

export const oracleMasterSourceV1 = () => {
    return combineFunc(__dirname, [
      "./contract/imports/stdlib.fc",
      "./contract/imports/params.fc",
      "./contract/imports/constants.fc",
      "./contract/imports/jetton-utils.fc",
      "./contract/imports/op-codes.fc",
      "./contract/imports/utils.fc",
      "./contract/imports/discovery-params.fc",
      "./contract/oracle-master.fc",
    ])
  }

const oracleMasterSourceV1CodeBoc =
  'te6ccsEBBgEAawANEhdWY2sBFP8A9KQT9LzyyAsBAgFiBQICASAEAwB5vJvJh2omh9IGpqGBj8FAC4KhAJqgoB5CgCfQEsZ4sA54tmZJFkZYCJegB6AGWAZPyAODpkZYFlA+X/5OhAAVvtePaiaH0gamoYQADNBsMccA3H4vHq0='

export const oracleMasterSourceV1CodeCell = Cell.fromBoc(Buffer.from(oracleMasterSourceV1CodeBoc, 'base64'))[0];

export const oracleClientSourceV1 = () => {
    return combineFunc(__dirname, [
      "./contract/imports/stdlib.fc",
      "./contract/imports/params.fc",
      "./contract/imports/constants.fc",
      "./contract/imports/jetton-utils.fc",
      "./contract/imports/op-codes.fc",
      "./contract/imports/utils.fc",
      "./contract/imports/discovery-params.fc",
      "./contract/oracle-client.fc",
    ])
  }

const oracleClientSourceV1CodeBoc =
  'te6ccsEBBgEAiwANEjI3QosBFP8A9KQT9LzyyAsBAgEgAwIAPPIgxwCRMODTH4IQmCU1eBK6mdM/MMjLP8ntVJEw4gIBSAUEABGhLP/aiaGmfmEAjtAgxwCRW+AB0NMDMfpAMAHTHzCCEILpY0O6jiiCAZZ/7UPYcMjLH8s/yXFwgBjIywVQBM8WI/oCE8tpEssAzMmAQPsAkTDie5a4DQ=='

export const oracleClientSourceV1CodeCell = Cell.fromBoc(Buffer.from(oracleClientSourceV1CodeBoc, 'base64'))[0]
