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
  'te6ccsECEAEAAmsAAA0AEgAXADIANwA8AFYAbgCMAJEAlgD5AWMB4gJjAmsBFP8A9KQT9LzyyAsBAgFiCQICASAEAwAxvbUfaiaH0gamp9AGoA6HoCgOmP6hgLL4NAIBIAgFAgEgBwYAL7dCnaiaH0gamp9AGoA6HoCgOmP6hg2MMAArt149qJofSBqan0AagDoegKA6Y/qGEAA3uhle1E0PpA1NT6ANQB0PQFAdMf1DBsYdDXCx+AICzA0KAgFIDAsAwVcJNTArmOVqT4KFMUAnACyFjPFssfySHIywET9AAS9ADLAMn5AHB0yMsCygfL/8nQcIIQ5eEb6cjLH8s/UjDMydBwgBjIywVQA88Wggr68ID6AhLLagHPFsmAQPsA6F8EgAz1MTU1+ChAYwJwAshYzxbLH8khyMsBE/QAEvQAywDJIPkAcHTIywLKB8v/ydCCEIZgqdwQNEZQcHCCEC8gZ8LIyx/LP1AEzxZY+gLLH8sfzMl3gBjIywVQBM8WWPoCEstrEszMyXH7AIAffZBjgEkvgnAA6GmB/SAYEH0iGIE42EkvgvB2omh9IGpqfQBqAOh6AoDpj+oYBOmP6Z/BCEwSmrwpGF1HG5ytnBwcKKNBg/oHN9CY+XAzgWoYKgmAqguylAFkegBk5CgD54sK5gnmAP0BCeZlj+Zk9qoseAXwHUEIJ1GPd8DgH8UiC6jjsxOwmCCTEtAKEH+kAwCaRUFUNUc2UsAsj0AMnIUAfPFhXME8wB+gITzMsfzMntVBAoECcQRkAzBQTwCeAWXwY0NIIQbS07RRO6ji0B+QEi+QG68uBn+gAwAoIID0JAoVIgu/LgZXCAGMjLBVjPFlj6AstqyYBA+wDgDwAMXwSED/Lwylce5A=='

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
  'te6ccsECEgEAAi8AAA0AEgAXADQAOQBYAF0AewCdAKIApwC+AMMA8QEIAXgB+QIvART/APSkE/S88sgLAQIBYgkCAgEgBAMANbyVT2omhqagDofSB9IBgBfQBpj+mP6Y+YCCLAIBIAYFADm7oU7UTQ1NQB0PpA+kAwAvoA0x/TH9MfMBBFXwaAICdAgHADiqJ+1E0NTUAdD6QPpAMAL6ANMf0x/THzAQRWxhAECple1E0NTUAdD6QPpAMAL6ANMf0x/THzAQRV8G0NcLHwICzA8KAgEgDAsAKdOEAMZGWCqAHniwD9AWW1ZMAgfYBAIBWA4NAFcghCYJTV4yMsfE8s/zMnQcIAYyMsFUAPPFoIK+vCA+gISy2oBzxbJgED7AIAApHCAGMjLBVADzxYB+gLLasmAQPsAgAdnZkQ44BJL4HwaGmBgLjYSS+B8HwTt5EYAP0gGAFpj+mfwQgXkDPhKRhdRyAar4H2omh9IGmPmAF8gJD8gN15cDOBfSB9AGmP6Y/qGAMCAuQoA2eLKAJni2SC5GYK5gD9AQnlj4llj+WP5PaqcEEAH87UTQ1NQB0PpA+kAwAvoA0x/TH9MfMBBFghDl4RvpUqC6jjI2Nzc3OAb5ASf5Abry4GcB1DAGVTDIUAbPFlAEzxbJBcjMFcwB+gITyx8Syx/LH8ntVOBfA4IQguljQ1Jwuo4aNDU3BfkBJvkBuvLgZ1EzufLQZUA08AsB8ArgEQBoECNfAzIzghBtLTtFErqOHQL5ASL5Abry4Gf6ADACgggPQkChUiC78uBlAfAM4F8EhA/y8P+kLOQ='

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
  'te6ccsEBBgEAlgANEhchL5YBFP8A9KQT9LzyyAsBAgFiBQICAUgEAwAPu6FO1E0NQwgAF7oZXtRNDUMNDXCx+ADK0DMixwCSXwPg0NMDMHGwkVvgAdMfghCC6WNDUiC6ji3TPzH6QHCCEILpY0PIyx/LP8nQcIAYyMsFUATPFlAF+gISy2pQA88WyYBA+wCRMuKCEJglNXi6mtM/MdQwyMzJ7VSRMOKJGWFw'

export const oracleUserSourceV1CodeCell = Cell.fromBoc(Buffer.from(oracleUserSourceV1CodeBoc, 'base64'))[0]
