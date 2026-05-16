# Contributing

Thanks for helping improve Agent Trust Contract Kit.

ATCK is a public standard and conformance kit. Contributions should make agent pre-action trust contracts easier to implement, validate, and compare across tools.

## Good Contributions

- Synthetic examples for new danger moments.
- JSON Schema fixes that improve portability.
- Failure-mode and payload-ceiling edge cases.
- Conformance tests for invalid contracts.
- Compatibility notes for MCP, OpenAPI, x402, payment mandates, catalogs, and observability systems.
- Reference validators in other languages.

## Boundaries

Do not submit:

- API keys, credentials, proof solutions, OAuth codes, or wallet secrets.
- Private customer, vendor, billing, wallet, or production data.
- Real incident logs or screenshots with secrets.
- Claims that ATCK provides legal, compliance, sanctions, custody, security, tax, or accounting assurance.
- Vendor-specific negative claims that cannot be verified from public information.

## Schema Changes

`spec/v0.1` is a stability boundary. Additive clarifications and new examples are easier to accept than breaking schema changes.

For schema changes, include:

- the danger moment being addressed
- one valid synthetic example
- one invalid counterexample when relevant
- tests that fail before the change and pass after it
- migration notes if existing examples change

## Inbound License

Unless you state otherwise, contributions submitted to this project are licensed under Apache-2.0.
