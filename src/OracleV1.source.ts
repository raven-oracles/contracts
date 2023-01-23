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
  'te6ccsECDgEAAlwAAA0AEgAXABwANwBTAGwAcQB2ANkBTAHGAiYCXAEU/wD0pBP0vPLICwECAWIHAgIBIAYDAgEgBQQAMbrMrtRND6QNTU+gDUAdD0BQHTP9M/MGxhgAM7tqPtRND6QNTU+gDUAdD0BQHTP9M/MBZfBoAC2+149qJofSBqan0AagDoegKA6Z/pn5hAICzAsIAgFICgkAwVcJNTArmOVqT4KFMUAnACyFjPFssfySHIywET9AAS9ADLAMn5AHB0yMsCygfL/8nQcIIQ5eEb6cjLH8s/UjDLP8nQcIAYyMsFUAPPFoIK+vCA+gISy2oBzxbJc/sA6F8EgA4VN/goQIUCcALIWM8Wyx/JIcjLARP0ABL0AMsAySD5AHB0yMsCygfL/8nQghCGYKnccPgoEHkQaAUEEDlKqjI0NHCCEC8gZ8LIyx/LP1jPFgH6Assfyx/LP8l3gBjIywVQBM8WWPoCEstrEszMyXH7AIAe3ZBjgEkvgnAA6GmB/SAYEH0iGIE42EkvgvB2omh9IGpqfQBqAOh6AoDpn+mfmATpj+mfwQhMEpq8KRhdRxucrZycqKxBg/oHN9CY+XAzgemfmCIYKgk5KTyBZHoAZOQoA+eLCuYJ5gD9AQnmZZ/ln+T2qngF8B1AwBuoIQTqMe71Iguo48MTsJggkxLQChB/pAMAmkVBVDVHNlLALI9ADJyFAHzxYVzBPMAfoCE8zLP8s/ye1UECgQJxBGQDMFBPAJ4BZfBjQ0ghBtLTtFE7rjAl8EhA/y8A0AaAH5ASL5Abry4Gf6ADACgggPQkChUiC78uBlcIAYyMsFWM8WAoIID0JAoRL6AstqyYBA+wCOZUhn'

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
  'te6ccsECEQEAAf0AAA0AEgAXABwAPABaAHoAfwCEAJoAnwDOAOUBVgHVAeMB/QEU/wD0pBP0vPLICwECAWIHAgIBIAYDAgEgBQQAO7rMrtRNDTP9QB0PpA+kAwAvoA0x/TH9MfMBBFXwaAA3uSqe1E0NM/1AHQ+kD6QDAC+gDTH9Mf0x8wEEWAA7vTE/aiaGmf6gDofSB9IBgBfQBpj+mP6Y+YCCK2MMAgLMDQgCASAKCQAn04QAxkZYKsZ4sQ/QFltWTBg32AQCAVgMCwBZIIQmCU1eMjLHxPLP8s/ydBwgBjIywVQA88Wggr68ID6AhLLagHPFsmAQPsAgACkcIAYyMsFUAPPFgH6AstqyYBA+wCAB29thEQY4BIrfAA6GmBgLjYSK3wfBO3kRgA/SAYAWmP6Z/BCBeQM+EpGF1HILYY9qJofSBpj5gB/ICQ/IDdeXAzgP0gfQBpj+mP6Z+YAwgi5CgDZ4soAmeLZILkZZ+K5gD9AQnlj4llj+WP5PaqcEDgL27UTQ0z/UAdD6QPpAMAL6ANMf0x/THzAQRYIQ5eEb6VKguo42Njc3Nwf5ASf5Abry4GcC0z8wRRZEFFAzyFAGzxZQBM8WyQXIyz8VzAH6AhPLHxLLH8sfye1U4F8DNIIQguljQ1JguuMCFF8EMoIQbS07RbrjAluED/LwEA8AGAH5ASH5Abry4GfwDAAwNQb5ASb5Abry4GdRQbny0GVBNPALAfAK6IeQbA=='

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
  'te6ccsEBBAEAhgANEh2GART/APSkE/S88sgLAQIBYgMCABGh2ZXaiaGmfmEAztAzIscAkl8D4NDTAzBxsJFb4AHTH4IQguljQ1Iguo4t0z8x+kBwghCC6WNDyMsfyz/J0HCAGMjLBVAEzxZQBfoCEstqUAPPFsmAQPsAkTLighCYJTV4upzTPzHTPzDIyz/J7VSRMOJXpFkc'

export const oracleUserSourceV1CodeCell = Cell.fromBoc(Buffer.from(oracleUserSourceV1CodeBoc, 'base64'))[0]
