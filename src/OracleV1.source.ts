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
  'te6ccsEBBgEAywANEiEmecsBFP8A9KQT9LzyyAsBAgFiAwIAGaC149qJofSBqan0gGECAswFBACh38FAgigagqmTgqEgGqEigaOGRln6gB54sA54tmAOeLZJDkZYKJ+gAJegBlgGSQfIA4OmRlgWUD5f/k6DvADGRlgqxniygB/QEJZbXmZLj9gEAJ/ZmRY4BJL4HwaGmB/SAYALjYSS+B8BDBBJiWgFz5cCf2omh9IGpqfSAYNhECaY/pn5j9IBiCQQSYloBQgOAAzIH9IBgiAYF4BHAvgsIH+XhElSkTo='

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
  'te6ccsEBBAEALgANEiIuART/APSkE/S88sgLAQIBYgMCABug9gXaiaH0AfSB9IGoYQAU0GwxxwDchA/y8MPYmGc='

export const oracleClientSourceV1CodeCell = Cell.fromBoc(Buffer.from(oracleClientSourceV1CodeBoc, 'base64'))[0]
