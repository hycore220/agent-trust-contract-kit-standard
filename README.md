# Agent Trust Contract Kit

Agent Trust Contract Kit (ATCK) is an open, no-key-first contract standard for AI agents before they act.

It answers one narrow question:

```text
Does this API, MCP server, package, workflow, or counterparty expose enough machine-readable trust information for an agent to proceed?
```

ATCK is for the moment before an agent:

- spends money or calls a paid endpoint
- writes database, CRM, vendor, invoice, ecommerce, or ticket state
- trusts a new MCP server, API, package, SDK, skill, or manifest
- posts, deploys, retries a failed tool call, or chains multiple services
- sends sensitive payloads to another tool

This repository is the public standard, examples, TypeScript reference validator, CLI checker, and conformance test kit. It is not a hosted service, compliance certification, legal assurance, custody system, or production security audit.

## Quick Start

```bash
npm install
npm run build
npm test

node dist/bin/atck-check.js examples/pre-action/mcp-first-call.json
node dist/bin/atck-check.js examples/pre-action/x402-spend-ceiling.json
node dist/bin/atck-check.js examples/pre-action/tool-failure-duplicate-call.json
```

## What Is Included

- `spec/v0.1/`: portable JSON Schemas for pre-action trust contracts, receipts, failure modes, and payload ceilings.
- `examples/pre-action/`: synthetic, no-secret examples for MCP first calls, paid endpoint spend ceilings, delegated payment mandates, and duplicate tool-call protection.
- `src/`: TypeScript reference validator.
- `bin/`: CLI checker.
- `tests/`: conformance tests for examples, schema inference, and failure cases.
- `docs/`: standard notes and contribution guidance.

## Design Principles

1. No-key first: public discovery must be useful before signup or secret exchange.
2. Language-neutral standard: JSON Schema is the contract; TypeScript is only the first reference implementation.
3. Pre-action only: ATCK helps decide whether to proceed, stop, retry, or escalate before a risky action.
4. Synthetic examples only: never include credentials, private payloads, customer data, production logs, wallet secrets, or API keys.
5. Failure semantics are part of the contract: retry, abort, backoff, review, and safe-to-log fields should be machine-readable.

## Contributing

Good first contributions:

- add a new synthetic danger-moment example
- improve failure-mode taxonomy
- add payload-ceiling edge cases
- add MCP, OpenAPI, x402, payment-mandate, or tool-failure compatibility notes
- add conformance tests for invalid contracts
- port the validator to another language

Read `CONTRIBUTING.md` and `GOVERNANCE.md` before proposing schema changes.

## License

Apache-2.0. See `LICENSE`.
