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
  'te6ccsECEAEAAmUAAA0AEgAXADIANwA8AFYAbgCMAJEAlgD5AVoB2QI2AmUBFP8A9KQT9LzyyAsBAgFiCQICASAEAwAxvbUfaiaH0gamp9AGoA6HoCgOmP6hgLL4NAIBIAgFAgEgBwYAL7dCnaiaH0gamp9AGoA6HoCgOmP6hg2MMAArt149qJofSBqan0AagDoegKA6Y/qGEAA3uhle1E0PpA1NT6ANQB0PQFAdMf1DBsYdDXCx+AICzA0KAgFIDAsAwVcJNTArmOVqT4KFMUAnACyFjPFssfySHIywET9AAS9ADLAMn5AHB0yMsCygfL/8nQcIIQ5eEb6cjLH8s/UjDMydBwgBjIywVQA88Wggr68ID6AhLLagHPFsmAQPsA6F8EgAvVMjY2+ChAdAJwAshYzxbLH8khyMsBE/QAEvQAywDJIPkAcHTIywLKB8v/ydBGdXCCEC8gZ8LIyx/LP1AEzxZY+gLLH8sfzMl3gBjIywVQA88WUAP6AstrEszMyXH7AIAffZBjgEkvgnAA6GmB/SAYEH0iGIE42EkvgvB2omh9IGpqfQBqAOh6AoDpj+oYBOmP6Z/BCEwSmrwpGF1HG5ytnBwcKKNBg/oHN9CY+XAzgWoYKgmAqguylAFkegBk5CgD54sK5gnmAP0BCeZlj+Zk9qoseAXwHUEIJ1GPd8DgG0UiC6jj8xOwmCCTEtAKEH+kDTH9MfMAukVBdlVHVHLgLI9ADJyFAHzxYVzBPMAfoCE8zLH8zJ7VQQWl5EEDYQNUE08AngFl8GNDSCEG0tO0UTuuMCXwSED/LwDwBaAfkBIvkBuvLgZ/oAMAKCCA9CQKFSILvy4GVwgBjIywVYzxZY+gLLasmAQPsALoxn0g=='

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
  'te6ccsECFQEAAusAAA0AEgCFAIoAjwCwALUA2ADdAQEBJwEsATEBSAFNAXsBkgILAo4CxALrART/APSkE/S88sgLAQIBIAMCAOLy0x8x0z8w7UTQ1NQB0PpA+kAwAvoA0x/TH9Mf0x/THzAQZ2ahI6kE+CMioSSpBAG88rGCEIZgqdxSQLry4EL4AFQ4dvALU0PwClUG+CMByFAIzxZQBs8WyQfIzBfMUAP6Assfyx8Tyx8Syx/LH8ntVAIBSAsEAgEgBgUAPbyVT2omhqagDofSB9IBgBfQBpj+mP6Y/pj+mPmAgzwCASAIBwBBu6FO1E0NTUAdD6QPpAMAL6ANMf0x/TH9Mf0x8wEGdfCIAgJ0CgkARKon7UTQ1NQB0PpA+kAwAvoA0x/TH9Mf0x/THzAQZxAoXwgASKmV7UTQ1NQB0PpA+kAwAvoA0x/TH9Mf0x/THzAQZ18I0NcLHwICzBEMAgEgDg0AKdP8AL5GWCqAHniwD9AWW1ZMAgfYBAIBWBAPAFcghCYJTV4yMsfE8s/zMnQf4AXyMsFUAPPFoIK+vB/+gISy2oBzxbJgED7AIAApH+AF8jLBVADzxYB+gLLasmAQPsAgAevZkQ44BJL4HwaGmBALhYSS+B8HwTt5EYAP0gGAFpj+mfwQgXkDPhKRhdRySar4H2omh9IGmPmAF8gJD8gN15cDMBfSB9AGmP6Y/qGAMCAvwR/BHkKARniygDZ4tkg+RmC+YoAf0BZY/lj4nlj4llj+WP5PaqcEEgL+7UTQ1NQB0PpA+kAwAvoA0x/TH9Mf0x/THzAQZ4IoBxr84CCF7v4gMIIQ5eEb6VLAuo48ODk5OToI+QEh+QG68uBmA9QwUHgQNlBERRXIUAjPFlAGzxbJB8jMF8xQA/oCyx/LHxPLHxLLH8sfye1U4F8EghCC6WNDUoC64wIQNBQTAGhfBDIzghBtLTtFErqOHQL5ASL5Abry4Gb6ADACgggPQkChUiC78uBkAfAM4F8EggD//vLwAEo1NjgG+QEm+QG68uBmUUO58tBkQTTwC4IQhmCp3BK6kvAKkVviQ+alJg=='

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
