import fs from "node:fs";
import path from "node:path";

type SchemaType = "array" | "boolean" | "null" | "number" | "object" | "string";

export type AtckSchemaName = "trust-contract" | "pre-action-receipt" | "failure-mode" | "payload-ceiling";

interface JsonSchema {
  $ref?: string;
  $defs?: Record<string, JsonSchema>;
  type?: SchemaType | SchemaType[];
  const?: unknown;
  enum?: unknown[];
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  minLength?: number;
  minItems?: number;
  additionalProperties?: boolean | JsonSchema;
}

interface ValidationOptions {
  schema?: AtckSchemaName;
  rootDir?: string;
}

export interface AtckValidationResult {
  valid: boolean;
  schema: AtckSchemaName;
  errors: string[];
}

const schemaFiles: Record<AtckSchemaName, string> = {
  "trust-contract": "trust-contract.schema.json",
  "pre-action-receipt": "pre-action-receipt.schema.json",
  "failure-mode": "failure-mode.schema.json",
  "payload-ceiling": "payload-ceiling.schema.json"
};

const schemaVersions: Record<string, AtckSchemaName> = {
  "atck.pre_action_trust_contract.v0.1": "trust-contract",
  "atck.pre_action_receipt.v0.1": "pre-action-receipt",
  "atck.failure_mode.v0.1": "failure-mode",
  "atck.payload_ceiling.v0.1": "payload-ceiling"
};

function defaultRootDir(): string {
  return path.resolve(__dirname, "..", "..");
}

function schemaDir(rootDir = defaultRootDir()): string {
  return path.join(rootDir, "spec", "v0.1");
}

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readSchema(schemaName: AtckSchemaName, rootDir?: string): JsonSchema {
  return readJson(path.join(schemaDir(rootDir), schemaFiles[schemaName])) as JsonSchema;
}

export function atckSchemaNames(): AtckSchemaName[] {
  return Object.keys(schemaFiles) as AtckSchemaName[];
}

function typeOf(value: unknown): SchemaType {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value as SchemaType;
}

function acceptsType(schemaType: SchemaType | SchemaType[], value: unknown): boolean {
  const allowed = Array.isArray(schemaType) ? schemaType : [schemaType];
  return allowed.includes(typeOf(value));
}

function formatPath(pathParts: Array<string | number>): string {
  if (!pathParts.length) return "$";
  return `$${pathParts.map((part) => (typeof part === "number" ? `[${part}]` : `.${part}`)).join("")}`;
}

function sameJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function resolveRef(schema: JsonSchema, ref: string): JsonSchema | undefined {
  if (!ref.startsWith("#/$defs/")) return undefined;
  const key = ref.slice("#/$defs/".length);
  return schema.$defs ? schema.$defs[key] : undefined;
}

function validateValue(
  rootSchema: JsonSchema,
  schema: JsonSchema | undefined,
  value: unknown,
  pathParts: Array<string | number>,
  errors: string[]
): void {
  if (!schema) return;

  if (schema.$ref) {
    const resolved = resolveRef(rootSchema, schema.$ref);
    if (!resolved) {
      errors.push(`${formatPath(pathParts)} has unsupported schema ref ${schema.$ref}`);
      return;
    }
    validateValue(rootSchema, resolved, value, pathParts, errors);
    return;
  }

  if ("const" in schema && !sameJson(value, schema.const)) {
    errors.push(`${formatPath(pathParts)} expected ${JSON.stringify(schema.const)} but got ${JSON.stringify(value)}`);
    return;
  }

  if (schema.type && !acceptsType(schema.type, value)) {
    errors.push(`${formatPath(pathParts)} expected ${JSON.stringify(schema.type)} but got ${typeOf(value)}`);
    return;
  }

  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${formatPath(pathParts)} expected one of ${schema.enum.map(String).join(", ")}`);
    return;
  }

  if (schema.type === "string" && typeof value === "string" && schema.minLength && value.length < schema.minLength) {
    errors.push(`${formatPath(pathParts)} must be at least ${schema.minLength} characters`);
  }

  if (schema.type === "array" || schema.items) {
    if (!Array.isArray(value)) return;
    if (schema.minItems && value.length < schema.minItems) {
      errors.push(`${formatPath(pathParts)} must contain at least ${schema.minItems} item(s)`);
    }
    value.forEach((item, index) => {
      validateValue(rootSchema, schema.items, item, pathParts.concat(index), errors);
    });
    return;
  }

  if (schema.type === "object" || schema.properties || schema.required || schema.additionalProperties !== undefined) {
    if (typeOf(value) !== "object") return;
    const objectValue = value as Record<string, unknown>;
    const properties = schema.properties || {};

    for (const requiredKey of schema.required || []) {
      if (!(requiredKey in objectValue)) {
        errors.push(`${formatPath(pathParts.concat(requiredKey))} is required`);
      }
    }

    for (const [key, childSchema] of Object.entries(properties)) {
      if (key in objectValue) {
        validateValue(rootSchema, childSchema, objectValue[key], pathParts.concat(key), errors);
      }
    }

    if (schema.additionalProperties === false) {
      for (const key of Object.keys(objectValue)) {
        if (!(key in properties)) {
          errors.push(`${formatPath(pathParts.concat(key))} is not allowed`);
        }
      }
    } else if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
      for (const [key, childValue] of Object.entries(objectValue)) {
        if (!(key in properties)) {
          validateValue(rootSchema, schema.additionalProperties, childValue, pathParts.concat(key), errors);
        }
      }
    }
  }
}

export function inferAtckSchemaName(value: unknown): AtckSchemaName | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const version = (value as Record<string, unknown>).schema_version;
  if (typeof version !== "string" || !Object.prototype.hasOwnProperty.call(schemaVersions, version)) {
    return null;
  }
  return schemaVersions[version] || null;
}

export function validateAtckObject(value: unknown, options: ValidationOptions = {}): AtckValidationResult {
  const schemaName = options.schema || inferAtckSchemaName(value) || "trust-contract";
  const schema = readSchema(schemaName, options.rootDir);
  const errors: string[] = [];
  validateValue(schema, schema, value, [], errors);
  return {
    valid: errors.length === 0,
    schema: schemaName,
    errors
  };
}

export function validateAtckFile(filePath: string, options: ValidationOptions = {}): AtckValidationResult {
  return validateAtckObject(readJson(path.resolve(filePath)), options);
}

export function renderAtckValidationResult(result: AtckValidationResult, filePath: string): string {
  const status = result.valid ? "valid" : "invalid";
  const lines = [`${status}: ${filePath}`, `schema: ${result.schema}`];
  if (!result.valid) {
    lines.push("errors:");
    for (const error of result.errors) {
      lines.push(`- ${error}`);
    }
  }
  return `${lines.join("\n")}\n`;
}
