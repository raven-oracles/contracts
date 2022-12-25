import BN from "bn.js";
import { Cell, StackItem } from "ton";
import { TVMStackEntry } from "ton-contract-executor";

export function convertFromExecutorStack(
  stack: (TVMStackEntry | null)[]
): StackItem[] {
  let res: StackItem[] = [];
  for (let s of stack) {
    if (s === null) {
      res.push({ type: "null" });
    } else if (s.type === "int") {
      res.push({ type: "int", value: new BN(s.value, 10) });
    } else if (s.type === "cell") {
      res.push({
        type: "cell",
        cell: Cell.fromBoc(Buffer.from(s.value, "base64"))[0],
      });
    } else if (s.type === "cell_slice") {
      res.push({
        type: "slice",
        cell: Cell.fromBoc(Buffer.from(s.value, "base64"))[0],
      });
    } else if (s.type === "null") {
      res.push({ type: "null" });
    } else if (s.type === "tuple") {
      res.push({ type: "tuple", items: convertFromExecutorStack(s.value) });
    } else {
      throw Error("Unsupported type");
    }
  }
  return res;
}
