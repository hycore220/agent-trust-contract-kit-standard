#!/usr/bin/env node
import { atckSchemaNames, renderAtckValidationResult, validateAtckFile } from "../src/validator";
import type { AtckSchemaName } from "../src/validator";

interface CliArgs {
  file: string;
  schema?: AtckSchemaName;
  json: boolean;
  list: boolean;
}

function usage(): string {
  return [
    "Usage:",
    "  atck-check <json-file> [--schema <name>] [--json]",
    "  atck-check list",
    "",
    "Schemas:",
    `  ${atckSchemaNames().join(", ")}`,
    "",
    "Examples:",
    "  atck-check examples/pre-action/mcp-first-call.json",
    "  atck-check examples/pre-action/x402-spend-ceiling.json"
  ].join("\n");
}

function isSchemaName(value: string): value is AtckSchemaName {
  return atckSchemaNames().includes(value as AtckSchemaName);
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    file: "",
    schema: undefined,
    json: false,
    list: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "list") {
      args.list = true;
    } else if (token === "--json") {
      args.json = true;
    } else if (token === "--schema") {
      const schema = argv[index + 1];
      if (!schema || !isSchemaName(schema)) {
        throw new Error(`Unknown schema: ${schema || ""}`);
      }
      args.schema = schema;
      index += 1;
    } else if (!args.file) {
      args.file = token;
    } else {
      throw new Error(`Unexpected argument: ${token}`);
    }
  }

  return args;
}

function main(): void {
  let args: CliArgs;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n\n${usage()}\n`);
    process.exitCode = 1;
    return;
  }

  if (args.list) {
    process.stdout.write(`${JSON.stringify({ schemas: atckSchemaNames() }, null, 2)}\n`);
    return;
  }

  if (!args.file) {
    process.stderr.write(`${usage()}\n`);
    process.exitCode = 1;
    return;
  }

  try {
    const result = validateAtckFile(args.file, { schema: args.schema });
    if (args.json) {
      process.stdout.write(`${JSON.stringify({ file: args.file, ...result }, null, 2)}\n`);
    } else {
      process.stdout.write(renderAtckValidationResult(result, args.file));
    }
    if (!result.valid) process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

main();
