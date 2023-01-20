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
  'te6ccsECCwEAAaMAAA0AEgArADAANQBMAMkBSgFQAX4BowEU/wD0pBP0vPLICwECAWIDAgAtoLXj2omh9IGpqfQBqAOh6AoDpn+mfmECAswHBAIBSAYFAClMhQB88WFcwTzAH6AszLP8s/ye1UgA9VN/goQIUCcALIWM8Wyx/JIcjLARP0ABL0AMsAySD5AHB0yMsCygfL/8nQghCGYKnccPgoEHkQaAUEEDlKqshQB88WUAXPFlADzxbJcIIQLyBnwsjLH8s/zAH6AszLH8sfyz/Jd4AYyMsFUATPFlj6AhLLaxLMzMlx+wCAP32QY4BJL4JwAOhpgf0gGBB9IhiBONhJL4LwdqJofSBqan0AagDoegKA6Z/pn5gE6Y/pn8EITBKavCkYXUcPnK2cHBwoo0GD+gc30Jj5cDOBaZ+YLxCqCykpO/gFLfAbnMEIJ1GPd6kIXXGBHC+CGhpBCDaWnaKJXXGBL4JAoJCAAIhA/y8ABY+QEi+QG68uBn+gAwAoIID0JAoVIgu/LgZXCAGMjLBVjPFlj6AstqyYBA+wAARjA1OYIQZSWzxf4gMAeCCTEtAKEC+kAwA6QIEFcQRkUFBPAJbQdryQ=='

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
  'te6ccsECCAEAAVoAAA0AEgA8AEEAbADNAU4BWgEU/wD0pBP0vPLICwECAWIDAgBPodmV2omhpn+oA6H0gfSB9IBgB/QBqAOh6AoDpj+mP6Y+YCDOIKy+EQICzAUEAFGyB5HoAZOQoBGeLKANniygCZ4tkg2Rln4tmAP0BCeYJZY/lj+WP5PaqQG722ERBjgEit8ADoaYGAuNhIrfB8E7eRGAD9IBgBaY/pn5jBCBeQM+EpEF1HGDYQ9qJofSBpj5gB/ICA/IDdeXAz6gDofSB9IH0gGAH9AGppj+mP6Z+YBAgziCt4BPBAYB/O1E0NM/1AHQ+kD6QPpAMAP6ANQB0PQFAdMf0x/THzAQZxBWOIIQ5eEb6VKguo4aOTkJ+QEj+QG68uBnBdM/MAgQN0YTQAUE8AngXwNsQoIQguljQ1Iwuo4UMgP5ASP5ATRQA7ry4GchuTHy0GXgMDKCEG0tO0W64wJbhA/y8AcAFCH5ATL5Abry4GftKqTw'

export const oracleClientSourceV1CodeCell = Cell.fromBoc(Buffer.from(oracleClientSourceV1CodeBoc, 'base64'))[0]

export const oracleUserSourceV1 = () => {
    return combineFunc(__dirname, [
        './contract/imports/stdlib.fc',
        './contract/imports/params.fc',
        './contract/imports/constants.fc',
        './contract/imports/op-codes.fc',
        './contract/imports/modes.fc',
        './contract/imports/utils.fc',
        './contract/imports/discovery-params.fc',
        './contract/oracle-user.fc',
    ])
}

const oracleUserSourceV1CodeBoc =
  'te6ccsEBAgEAGwANGwEU/wD0pBP0vPLICwEAGNPTHzCCEILpY0O6MPTJ56U='

export const oracleUserSourceV1CodeCell = Cell.fromBoc(Buffer.from(oracleUserSourceV1CodeBoc, 'base64'))[0]
