import { writeFile } from 'fs/promises';
import path from 'path';
import { Cell } from 'ton';
import { oracleMasterSourceV1, oracleUserSourceV1, oracleClientSourceV1 } from '../src/OracleV1.source';
import { compileFunc } from '../src/utils/compileFunc';

const buildSourceContent = (master: Cell, client: Cell, user: Cell) => `import { Cell } from "ton";
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
  '${master.toBoc().toString('base64')}'

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
  '${client.toBoc().toString('base64')}'

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
  '${user.toBoc().toString('base64')}'

export const oracleUserSourceV1CodeCell = Cell.fromBoc(Buffer.from(oracleUserSourceV1CodeBoc, 'base64'))[0]
`;

async function main() {
    let master = await compileFunc(oracleMasterSourceV1());
    let client = await compileFunc(oracleClientSourceV1());
    let user = await compileFunc(oracleUserSourceV1());
    await writeFile(
        path.resolve(__dirname, '../src/OracleV1.source.ts'),
        buildSourceContent(master.cell, client.cell, user.cell),
    ).catch(e => console.log(e));
}

main();
