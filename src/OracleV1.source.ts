import { Cell } from "ton";
import { combineFunc } from "./utils/combineFunc";

export const oracleMasterSourceV1 = () => {
  return combineFunc(__dirname, [
    "./contract/imports/stdlib.fc",
    "./contract/imports/params.fc",
    "./contract/imports/constants.fc",
    "./contract/imports/jetton-utils.fc",
    "./contract/imports/op-codes.fc",
    "./contract/imports/utils.fc",
    "./contract/imports/discovery-params.fc",
    "./contract/oracle-master.fc",
  ]);
};

const oracleMasterSourceV1CodeBoc =
  "te6ccsECDAEAAtQAAA0AEgAYACkAaABtANwBWwF8Af0CewLUART/APSkE/S88sgLAQIBYgUCAgN6YAQDAB2vFvaiaH0AamoYP4E2gUAAea289qJofQBqahg2EPwUALgqEAmqCgHkKAJ9ASxniwDni2ZkkWRlgIl6AHoAZYBk/IA4OmRlgWUD5f/k6EACAswHBgDZt/BQkhDgqEAmqCgHkKAJ9ASxniwDni2ZkkWRlgIl6AHoAZYBkkHyAODpkZYFlA+X/5OgoNAohmEEIPe7L6ORlj4tln6gCfQEsZ4sA54sA/QEA54tku8AMZGWCqALniygB/QEJ5bWJZmZkuP2AQL12QY4BJL4JwAOhpgfaiaH0AamoYAumP6Z+DONhHIRobwQg97svoi91HGQF9AH0gGEEIapk7bbhACGRlgqgB54soA/0BZbUK5Y/ln+S5fYAsUKzkKAH9AWZmZPaqSS+DcXACfSB9IBj9ABi465D9ABj9ABhACqkYXXGBHMCwgCOoIQe92X3lIguuMCbCKCECx2uXMSuuMCXwaED/LwCgkA/oIImJaAFqAUvPLgS/pA0wAwlcghzxbJkW3ighDRc1QAcIAYyMsFUAfPFib6AhbLahXLHxPLPyL6RDBwuo4z+ChDA3BUIBNUFAPIUAT6AljPFgHPFszJIsjLARL0APQAywDJ+QBwdMjLAsoHy//J0M8WlTFwMssB4vQAyYBA+wAA+DE2NgL6APpA+ChUEgZwVCATVBQDyFAE+gJYzxYBzxbMySLIywES9AD0AMsAyfkAcHTIywLKB8v/ydBQBscF8uBKEqFQQshQA/oCzMzJ7VT6QDAg1wsBwwCOH4IQ1TJ223CAEMjLBVADzxYi+gISy2rLH8s/yYBC+wCRW+IArjIF+kD6QPoA+gBTx6FQDKGCCJiWgGa2CKFTcqAhoIIImJaAoCagUtC88uBHU3KgAaCCCJiWgKBQBaAboSgQN1FrBhBFCUS08AtQI6BZyFAD+gLMzMntVM/mHpc=";

export const oracleMasterSourceV1CodeCell = Cell.fromBoc(
  Buffer.from(oracleMasterSourceV1CodeBoc, "base64")
)[0];

export const oracleClientSourceV1 = () => {
  return combineFunc(__dirname, [
    "./contract/imports/stdlib.fc",
    "./contract/imports/params.fc",
    "./contract/imports/constants.fc",
    "./contract/imports/jetton-utils.fc",
    "./contract/imports/op-codes.fc",
    "./contract/imports/utils.fc",
    "./contract/imports/discovery-params.fc",
    "./contract/oracle-client.fc",
  ]);
};

const oracleClientSourceV1CodeBoc =
  "te6ccsECEQEAAy0AAA0AEgAiACcALAAxAHUA4wDoAWgBqAHiAl4CrwK0Ar8DLQEU/wD0pBP0vPLICwECAWIDAgAboPYF2omh9AH0gfSBqGECAswOBAIBIAgFAgFIBwYAgyAINch7UTQ+gD6QPpA1DAE0x+CEBeNRRlSILqCEHvdl94TuhKx8uLF0z8x+gAwE6BQI8hQBPoCWM8WAc8WzMntVIADXO1E0PoA+kD6QNQwB9M/+gD6QDBRUaFSSccF8uLBJ8L/8uLCBYIJMS0AoBa88uLDghB73ZfeyMsfFcs/UAP6AiLPFgHPFslxgBjIywUkzxZw+gLLaszJgED7AEATyFAE+gJYzxYBzxbMye1UgAgFYDAkC9ztRND6APpA+kDUMAjTP/oAUVGgBfpA+kBTW8cFVHNtcFQgE1QUA8hQBPoCWM8WAc8WzMkiyMsBEvQA9ADLAMn5AHB0yMsCygfL/8nQUA3HBRyx8uLDCvoAUaihggiYloBmtgihggiYloCgGKEnlxBJEDg3XwTjDSXXCwGALCgB8wwAjwgCwjiGCENUydttwgBDIywVQCM8WUAT6AhbLahLLHxLLP8ly+wCTNWwh4gPIUAT6AljPFgHPFszJ7VQAcFJ5oBihghBzYtCcyMsfUjDLP1j6AlAHzxZQB88WyXGAEMjLBSTPFlAG+gIVy2oUzMlx+wAQJBAjAfEA9M/+gD6QCHwAe1E0PoA+kD6QNQwUTahUirHBfLiwSjC//LiwlQ0QnBUIBNUFAPIUAT6AljPFgHPFszJIsjLARL0APQAywDJIPkAcHTIywLKB8v/ydAE+kD0BDH6ACDXScIA8uLEd4AYyMsFUAjPFnD6AhfLaxPMgDQCeghAXjUUZyMsfGcs/UAf6AiLPFlAGzxYl+gJQA88WyVAFzCORcpFx4lAIqBOgggnJw4CgFLzy4sUEyYBA+wAQI8hQBPoCWM8WAc8WzMntVAIB1BAPABE+kQwcLry4U2AA1wgxwCSXwTgAdDTAwFxsJUTXwPwDeD6QPpAMfoAMXHXIfoAMfoAMHOptAAC0x+CEA+KfqVSILqVMTRZ8ArgghAXjUUZUiC6ghB73ZfRUjC6sZYxREQD8AvgNYIQWV8HvLqTWfAM4F8EhA/y8IFLo1vY=";

export const oracleClientSourceV1CodeCell = Cell.fromBoc(
  Buffer.from(oracleClientSourceV1CodeBoc, "base64")
)[0];
