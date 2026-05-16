# ATCK v0.1 Compatibility Notes

ATCK v0.1 is intended to sit before existing agent runtimes, MCP registries, scanners, payment protocols, and observability systems. It is not a gateway, wallet, registry, model runtime, or payment protocol.

The compatibility goal is simple:

```text
Any system that lets an agent spend, write, post, deploy, trust a tool, or chain a service should be able to export or consume an ATCK pre-action contract and receipt.
```

## Interop Targets

- MCP servers and registries: export a first-call trust contract before tool invocation.
- Paid API and x402-style flows: expose spend ceiling, retry, abort, refund, and safe-to-log receipt fields before payment.
- Delegated payment mandate systems: map mandate scope, merchant identity, ceiling, expiration, and revocation into a pre-action receipt.
- API and SDK catalogs: expose failure modes, payload ceilings, auth boundaries, first safe calls, and escalation rules before integration.
- Agent observability tools: attach ATCK receipt IDs to traces without logging private payloads or secrets.

## Minimum Compatible Surface

An ATCK-compatible system should expose:

- a machine-readable pre-action contract
- at least one first safe call or no-key preview path
- explicit auth boundary and forbidden inputs
- failure-mode semantics for retry, abort, backoff, or human review
- payload and logging ceilings
- a redacted receipt that can be safely attached to logs, traces, or support tickets

## What ATCK Does Not Require

- no specific model provider
- no specific agent framework
- no specific wallet or payment rail
- no central registry
- no API key for local validation
- no private user, billing, wallet, or production data in public examples

## Reference Examples

- `examples/pre-action/mcp-first-call.json`
- `examples/pre-action/x402-spend-ceiling.json`
- `examples/pre-action/ap2-mandate-bridge.json`
- `examples/pre-action/tool-failure-duplicate-call.json`
