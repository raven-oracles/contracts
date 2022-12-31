import { Cell } from "ton";
import { combineFunc } from "./utils/combineFunc";

export const oracleMasterSourceV1 = () => {
    return combineFunc(__dirname, [
      "./contract/imports/stdlib.fc",
      "./contract/imports/params.fc",
      "./contract/imports/constants.fc",
      "./contract/imports/op-codes.fc",
      "./contract/imports/utils.fc",
      "./contract/imports/discovery-params.fc",
      "./contract/oracle-master.fc",
    ])
  }

const oracleMasterSourceV1CodeBoc =
  'te6ccsECCAEAASAAAA0AEgAXAF8AbgBzANEBIAEU/wD0pBP0vPLICwECAWIFAgIBIAQDAIu85NdqJofSBqan0gGDYRfBQqkBk4KhIBqhIoGjhkZZ+oAeeLAOeLZgDni2SQ5GWCifoACXoAZYBk/IA4OmRlgWUD5f/k6EABm+149qJofSBqan0gGEAgLMBwYAt7XwUCCKBqCqZOCoSAaoSKBo4ZGWfqAHniwDni2YA54tkkORlgon6AAl6AGWAZJB8gDg6ZGWBZQPl/+ToAblkZY/ln+S7wAxkZYKoAueLKAH9AQnltYlmZmS4/YBAJnZmRY4BJL4HwaGmB/SAYALjYSS+B8BDBBJiWgFz5aCf2omh9IGpqfSAYNhECaY/pn/0gGALBBJiWgFCBYADLgogaIJh4BXAvg0IH+XhDtwRQo='

export const oracleMasterSourceV1CodeCell = Cell.fromBoc(Buffer.from(oracleMasterSourceV1CodeBoc, 'base64'))[0];

export const oracleClientSourceV1 = () => {
    return combineFunc(__dirname, [
      "./contract/imports/stdlib.fc",
      "./contract/imports/params.fc",
      "./contract/imports/constants.fc",
      "./contract/imports/op-codes.fc",
      "./contract/imports/utils.fc",
      "./contract/imports/discovery-params.fc",
      "./contract/oracle-client.fc",
    ])
  }

const oracleClientSourceV1CodeBoc =
  'te6ccsECBgEAASEAAA0AEgAdAJcBGQEhART/APSkE/S88sgLAQIBYgMCABGhLP/aiaGmfmEB7tAgxwCRW+AB0NMDMfpAMAHTHzDtRNDTAPpA1NT6QNQB0NcLPwHUAdD0BQH6QDAzNDQh0GwS0wcwghCYJTV4UmC6jjExMjP4J28iMIIJMS0AvI4aUTKBAQj0Cm+hMTIgwAExsZPAATDgMIQP8vDgXwSED/Lw4DIzBAH+ghCC6WNDUkC6jkQz+CdvIjCCCTEtALwk+QED+QETuhKwjiUBwAAwcMjLH8s/yXFwgBjIywVQBM8WI/oCE8tpEssAzMmAQPsA4F8DhA/y8OBbghBtLTtFErqOJCH5AQH5AbqOE3CAGMjLBVjPFiH6AstqyYMG+wDgMIIA//7y8AUADOBbhA/y8KqN98c='

export const oracleClientSourceV1CodeCell = Cell.fromBoc(Buffer.from(oracleClientSourceV1CodeBoc, 'base64'))[0]
