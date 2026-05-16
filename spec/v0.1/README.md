# Agent Trust Contract Kit Spec v0.1

ATCK v0.1 defines a small, no-key-first contract shape for agents before they take risky actions.

The target boundary is narrow:

- before an agent trusts a new MCP server, API, package, SDK, skill, or manifest
- before an agent spends money, calls a paid endpoint, or consumes quota
- before an agent writes, posts, deploys, or chains work across services
- before an agent passes sensitive payloads to another tool

The public spec is intentionally portable. It does not require a hosted API.

## Files

- `trust-contract.schema.json`: a pre-action contract packet an agent can inspect before acting.
- `pre-action-receipt.schema.json`: a compact receipt for the decision made before action.
- `failure-mode.schema.json`: the retry, abort, review, or backoff semantics for a failure.
- `payload-ceiling.schema.json`: request, response, tool-result, and fetch limits plus overflow policy.
- `compatibility.md`: how ATCK v0.1 fits MCP, paid API, delegated payment mandate, API catalog, and observability surfaces.

## Local Validation

```powershell
node scripts\atck-check.js examples/pre-action/mcp-first-call.json
node scripts\atck-check.js examples/pre-action/x402-spend-ceiling.json
node scripts\atck-check.js examples/pre-action/ap2-mandate-bridge.json
node scripts\atck-check.js examples/pre-action/tool-failure-duplicate-call.json
```

These checks are local and no-key. They validate public contract shape only; they do not approve real execution, spend, deployment, legal claims, or security-sensitive changes.
