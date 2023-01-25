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
  'te6ccsECDgEAAl0AAA0AEgAXABwANwBTAGwAcQB2ANoBTQHHAicCXQEU/wD0pBP0vPLICwECAWIHAgIBIAYDAgEgBQQAMbrMrtRND6QNTU+gDUAdD0BQHTP9M/MGxhgAM7tqPtRND6QNTU+gDUAdD0BQHTP9M/MBZfBoAC2+149qJofSBqan0AagDoegKA6Z/pn5hAICzAsIAgFICgkAw1cJNTArmOV6T4KFMUAnACyFjPFssfySHIywET9AAS9ADLAMn5AHB0yMsCygfL/8nQcIIQ5eEb6cjLH8s/UjDLP8nQcIAYyMsFUAPPFoIK+vCA+gISy2oBzxbJgED7AOhfBIAOFTf4KECFAnACyFjPFssfySHIywET9AAS9ADLAMkg+QBwdMjLAsoHy//J0IIQhmCp3HD4KBB5EGgFBBA5SqoyNDRwghAvIGfCyMsfyz9YzxYB+gLLH8sfyz/Jd4AYyMsFUATPFlj6AhLLaxLMzMlx+wCAHt2QY4BJL4JwAOhpgf0gGBB9IhiBONhJL4LwdqJofSBqan0AagDoegKA6Z/pn5gE6Y/pn8EITBKavCkYXUcbnK2cnKisQYP6BzfQmPlwM4Hpn5giGCoJOSk8gWR6AGTkKAPniwrmCeYA/QEJ5mWf5Z/k9qp4BfAdQMAbqCEE6jHu9SILqOPDE7CYIJMS0AoQf6QDAJpFQVQ1RzZSwCyPQAychQB88WFcwTzAH6AhPMyz/LP8ntVBAoECcQRkAzBQTwCeAWXwY0NIIQbS07RRO64wJfBIQP8vANAGgB+QEi+QG68uBn+gAwAoIID0JAoVIgu/LgZXCAGMjLBVjPFgKCCA9CQKES+gLLasmAQPsAYdfAlg=='

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
  'te6ccsECEQEAAhMAAA0AEgAXABwAPABaAHoAfwCEAJsAoADPAOYBWAHYAfcCEwEU/wD0pBP0vPLICwECAWIHAgIBIAYDAgEgBQQAO7rMrtRNDTP9QB0PpA+kAwAvoA0x/TH9MfMBBFXwaAA3uSqe1E0NM/1AHQ+kD6QDAC+gDTH9Mf0x8wEEWAA7vTE/aiaGmf6gDofSB9IBgBfQBpj+mP6Y+YCCK2MMAgLMDQgCASAKCQAp04QAxkZYKoAeeLAP0BZbVkwCB9gEAgFYDAsAWSCEJglNXjIyx8Tyz/LP8nQcIAYyMsFUAPPFoIK+vCA+gISy2oBzxbJgED7AIAApHCAGMjLBVADzxYB+gLLasmAQPsAgAd3ZkQ44BJL4HwaGmBgLjYSS+B8HwTt5EYAP0gGAFpj+mfwQgXkDPhKRhdRyEar4H2omh9IGmPmAF8gJD8gN15cDOBfSB9AGmP6Y/pn5gDAgLkKANniygCZ4tkguRln4rmAP0BCeWPiWWP5Y/k9qpwQOAvjtRNDTP9QB0PpA+kAwAvoA0x/TH9MfMBBFghDl4RvpUqC6jjQ2Nzc3OAb5ASf5Abry4GcB0z8wBlUwyFAGzxZQBM8WyQXIyz8VzAH6AhPLHxLLH8sfye1U4F8DghCC6WNDUnC64wIQI18DMjOCEG0tO0USuuMCXwSED/LwEA8AOgL5ASL5Abry4Gf6ADACgggPQkChUiC78uBlAfAMADQ0NTcF+QEm+QG68uBnUTO58tBlQDTwCwHwCg2oHw4='

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
