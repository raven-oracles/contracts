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
  'te6ccsECCQEAAXAAAA0AEgAtADIAWADZAOABLAFwART/APSkE/S88sgLAQIBYgMCADGhLP/aiaGmAGP0gGOoY6hj9IBjqGGhrhZ/AgLMBQQAR7IDkegBkgWRln+SD5GWAKANniwpmCWYA54sJ5glmAOeLZPaqQP32QY4BIrfAA6GmBmP0gGADpj/aiaGmAfSBqan0gagDoa4WfgOoA6HoCgP0gGBJoaYOYQQhMEpq8KVhdcYEYGLYxQQhBdLGhqRhdcYEYwQg2lp2iiV1HEhD8gID8gN1HCbhADGRlgqxnixD9AWW1ZMGDfYBwGEEAf/95eHBAgHBgAKW4QP8vAAlDL4J28iMIIJMS0AvH+xI/kBA/kBE7oSsI4qghJUC+P//iAwcMjLH8s/yXFwgBjIywVQBM8WI/oCE8tpEssAzMmAQPsA4FuED/LwAIQzOfgnbyIwggkxLQC8IsAAsY4oUZmBAQj0Cm+hMSbAAbGOEcABMAXTPzAQRxA2QBVQQ/AJ4F8JhA/y8OBfCoQP8vBJlsb9'

export const oracleClientSourceV1CodeCell = Cell.fromBoc(Buffer.from(oracleClientSourceV1CodeBoc, 'base64'))[0]
