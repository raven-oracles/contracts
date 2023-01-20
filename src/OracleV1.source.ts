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
  'te6ccsECCwEAAZwAAA0AEgArADAANQBMAMIBQwFJAXcBnAEU/wD0pBP0vPLICwECAWIDAgAtoLXj2omh9IGpqfQBqAOh6AoDpn+mfmECAswHBAIBSAYFAClMhQB88WFcwTzAH6AszLP8s/ye1UgA51N/goQIUCcALIWM8Wyx/JIcjLARP0ABL0AMsAySD5AHB0yMsCygfL/8nQghCGYKnccPgoEHkQaAUEEDlKqjIzM3CCEC8gZ8LIyx/LP1AEzxZQA/oCEssfyx/LP8l3gBjIywVQBM8WWPoCEstrEszMyXH7AIA/fZBjgEkvgnAA6GmB/SAYEH0iGIE42EkvgvB2omh9IGpqfQBqAOh6AoDpn+mfmATpj+mfwQhMEpq8KRhdRw+crZwcHCijQYP6BzfQmPlwM4Fpn5gvEKoLKSk7+AUt8BucwQgnUY93qQhdcYEcL4IaGkEINpadooldcYEvgkCgkIAAiED/LwAFj5ASL5Abry4Gf6ADACgggPQkChUiC78uBlcIAYyMsFWM8WWPoCy2rJgED7AABGMDU5ghBlJbPF/iAwB4IJMS0AoQL6QDADpAgQVxBGRQUE8AkQouwx'

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
  'te6ccsECCAEAATIAAA0AEgAyADcAWADYARgBMgEU/wD0pBP0vPLICwECAWIDAgA7odmV2omhpn+oA6H0gfSAYAX0AaY/pj+mPmAgir4NAgLMBQQAPbOQoA2eLKAJni2SC5GWfiuYA/QEJ5Y+JZY/lj+T2qkC99thEQY4BIrfAA6GmBgLjYSK3wfBO3kRgA/SAYAWmP6Z+YwQgXkDPhKRBdRxK2EPaiaH0gaY+YAfyAkPyA3XlwM4D9IH0AaY/pj+mfmAMIIvgE8HaiaGmf6gDofSB9IBgBfQBpj+mP6Y+YCCKbQQhy8I30qUBdcYEIEa+BwHBgB8bCKCEILpY0NSMLqOFDID+QEj+QE0UAO68uBnIbkx8tBl4DAyghBtLTtFupwB+QEh+QFsErry4GfgW4QP8vAAMDc3B/kBIfkBuvLgZwPTPzAGA1BERRXwCXSt5Mk='

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
  'te6ccsEBBAEAcwANEh1zART/APSkE/S88sgLAQIBYgMCABGh2ZXaiaGmfmEAqNDTH4IQguljQ1Iguo4t0z8x+kBwghCC6WNDyMsfyz/JcXCAGMjLBVAFzxYk+gIUy2kTywASzMmAQPsA3oIQmCU1eBK6nNM/MdM/MMjLP8ntVJEw4ukwKgM='

export const oracleUserSourceV1CodeCell = Cell.fromBoc(Buffer.from(oracleUserSourceV1CodeBoc, 'base64'))[0]
