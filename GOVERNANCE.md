# Governance

Agent Trust Contract Kit is standard-first.

## Stability

- `spec/v0.1` is stable enough for experiments and conformance tests.
- Breaking changes require a written proposal and migration notes.
- Examples and compatibility notes may evolve faster than schemas.

## Decision Rules

Schema changes should optimize for:

1. agent-readable safety before action
2. no-key public discovery
3. language-neutral implementation
4. clear stop, retry, review, and receipt semantics
5. no private or secret data in public examples

## RFC Process

For substantial changes, open an RFC-style issue or pull request with:

- problem statement
- affected danger moment
- proposed schema or example change
- compatibility impact
- conformance test plan

Maintainers may reject changes that add private data, vendor-specific claims, legal assurances, or implementation-specific hosted-service dependencies.
