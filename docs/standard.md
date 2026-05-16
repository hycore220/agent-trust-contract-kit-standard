# ATCK v0.1 Standard Notes

ATCK v0.1 defines a portable contract shape for agents before risky actions.

The core object is a pre-action trust contract. It may embed:

- a payload ceiling contract
- one or more failure-mode contracts
- a pre-action receipt
- safe-to-log and do-not-share fields
- first-safe-call guidance
- review or escalation rules

The standard is intentionally local and no-key. A validator can run without a hosted service, network access, credentials, or production data.

## Non-Goals

ATCK does not:

- certify that a tool is safe
- prove legal or regulatory compliance
- replace human approval for high-risk actions
- require a specific hosted API
- require TypeScript

The TypeScript validator in this repository is a reference implementation only.
