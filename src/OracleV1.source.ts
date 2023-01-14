import { Cell } from "ton";
import { combineFunc } from "./utils/combineFunc";

export const oracleMasterSourceV1 = () => {
    return combineFunc(__dirname, [
      './contract/imports/stdlib.fc',
      './contract/imports/params.fc',
      './contract/imports/constants.fc',
      './contract/imports/op-codes.fc',
      './contract/imports/modes.fc',
      './contract/imports/utils.fc',
      './contract/imports/discovery-params.fc',
      './contract/oracle-master.fc',
    ])
  }

const oracleMasterSourceV1CodeBoc =
  'te6ccsECCgEAAZcAAA0AEgArADAANQBMAMUBQwFyAZcBFP8A9KQT9LzyyAsBAgFiAwIALaC149qJofSBqan0AagDoegKA6Z/pn5hAgLMBwQCAUgGBQApTIUAfPFhXME8wB+gLMyz/LP8ntVIAO1Tf4KECFAnACyFjPFssfySHIywUT9AAS9ADLAMkg+QBwdMjLAsoHy//J0IIQhmCp3HD4KBB5EGgFBBA5SqrIUAfPFlAFzxZQA88WyYIQLyBnwsjLH8zLP8zLH8sfyz/Jd4AYyMsFUATPFlj6AhLLaxLMzMlx+wCALz2QY4BJL4JwAOhpgf0gGAC42EkvgnB2omh9IGpqfQBqAOh6AoDpn+mfmARpj+mfwQhMEpq8KRhdRw8dLZwcKKPAgIR6BTfQmPlwM4Jpn5giGCobKQR4BS3wG8EIJ1GPd6kQXXGBCq+CmhpBCDaWnaKJ3XGBL4JCB/l4QJCABa+QEh+QG68uBnAfoAMAKCCA9CQKFSILvy4GVwgBjIywVYzxZY+gLLasmAQPsAAEYxNjknggkxLQC+8uBlB4IJMS0AoQP6QDAIpAheJEUTQUTwCbvYaRc='

export const oracleMasterSourceV1CodeCell = Cell.fromBoc(Buffer.from(oracleMasterSourceV1CodeBoc, 'base64'))[0];

export const oracleClientSourceV1 = () => {
    return combineFunc(__dirname, [
      './contract/imports/stdlib.fc',
      './contract/imports/params.fc',
      './contract/imports/constants.fc',
      './contract/imports/op-codes.fc',
      './contract/imports/modes.fc',
      './contract/imports/utils.fc',
      './contract/imports/discovery-params.fc',
      './contract/oracle-client.fc',
    ])
  }

const oracleClientSourceV1CodeBoc =
  'te6ccsECBwEAAVEAAA0AEgA8AEEAbADrAVEBFP8A9KQT9LzyyAsBAgFiAwIAT6HZldqJoaZ/qAOh9IH0gfSAYAf0AagDoegKA6Y/pj+mPmAgziCsvhECAswFBABRsgeR6AGTkKARniygDZ4soAmeLZINkZZ+LZgD9AQnmCWWP5Y/lj+T2qkB99thEQY4BIrfB8E7eRGAFoaYGY/SAYAOmP6Z+YwQgXkDPhKRBdRxiYmXaiaH0gaY+YAXyAgPyA3XlwM4DqAOh9IH0gfSAYAemf6mmP6Y/pn5gECDOIK3gE8HaiaGmf6gDofSB9IH0gGAH9AGoA6HoCgOmP6Y/pj5gIM4grQGAMg4ghDl4RvpUqC6jhk5Ogj5ASP5Abry4GcF0z8wCBA3QGYFBPAJ4F8DbEKCEILpY0NSMLqOEzJRMbkx8tBl+QEh+QFsErry4GfgMDOCEG0tO0W6myD5ATEB+QG68uBn4FuED/LwaCl7qg=='

export const oracleClientSourceV1CodeCell = Cell.fromBoc(Buffer.from(oracleClientSourceV1CodeBoc, 'base64'))[0]
