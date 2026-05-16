import assert from "node:assert";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  atckSchemaNames,
  inferAtckSchemaName,
  validateAtckFile,
  validateAtckObject
} from "../src/validator";

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

const root = path.resolve(__dirname, "..", "..");

test("ATCK v0.1 exposes the expected local schemas", () => {
  assert.deepEqual(atckSchemaNames(), [
    "trust-contract",
    "pre-action-receipt",
    "failure-mode",
    "payload-ceiling"
  ]);
});

test("pre-action examples validate without keys or network calls", () => {
  for (const file of [
    "examples/pre-action/mcp-first-call.json",
    "examples/pre-action/x402-spend-ceiling.json",
    "examples/pre-action/ap2-mandate-bridge.json",
    "examples/pre-action/tool-failure-duplicate-call.json"
  ]) {
    const result = validateAtckFile(path.join(root, file), { rootDir: root });
    assert.equal(result.valid, true, `${file}: ${result.errors.join("; ")}`);
    assert.equal(result.schema, "trust-contract");
  }
});

test("schema inference uses the public schema_version field", () => {
  assert.equal(
    inferAtckSchemaName({
      schema_version: "atck.pre_action_receipt.v0.1"
    }),
    "pre-action-receipt"
  );
});

test("validator rejects missing required pre-action fields", () => {
  const result = validateAtckObject(
    {
      schema_version: "atck.pre_action_trust_contract.v0.1",
      contract_id: "bad"
    },
    { rootDir: root }
  );

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("$.profile is required")));
  assert.ok(result.errors.some((error) => error.includes("$.receipt is required")));
});

test("standalone failure-mode schema validates exported failure-mode packets", () => {
  const example = JSON.parse(fs.readFileSync(path.join(root, "examples/pre-action/mcp-first-call.json"), "utf8"));
  const result = validateAtckObject(example.failure_modes[0], { schema: "failure-mode", rootDir: root });
  assert.equal(result.valid, true, result.errors.join("; "));
});

test("CLI validates examples and emits JSON when requested", () => {
  const output = execFileSync(
    process.execPath,
    ["dist/bin/atck-check.js", "examples/pre-action/mcp-first-call.json", "--json"],
    {
      cwd: root,
      encoding: "utf8"
    }
  );
  const parsed = JSON.parse(output);
  assert.equal(parsed.valid, true);
  assert.equal(parsed.schema, "trust-contract");
});

test("CLI rejects invalid fixtures", () => {
  let failed = false;
  try {
    execFileSync(process.execPath, ["dist/bin/atck-check.js", "fixtures/bad/missing-receipt.json"], {
      cwd: root,
      encoding: "utf8",
      stdio: "pipe"
    });
  } catch (error) {
    failed = true;
    const output = String((error as { stdout?: Buffer }).stdout || "");
    assert.match(output, /invalid:/);
    assert.match(output, /\$\.receipt is required/);
  }
  assert.equal(failed, true);
});
