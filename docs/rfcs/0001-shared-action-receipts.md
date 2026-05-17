# RFC 0001: Shared Action Receipts For Duplicate Agent Calls

Status: draft

ATCK needs a small contract shape for a common multi-agent failure: two agents
repeat the same API call, paid request, write, or handoff because they cannot
see the other agent's prior action.

This RFC proposes a minimal, safe-to-log receipt boundary that an agent can
inspect before repeating work.

## Problem

Multi-agent frameworks often separate roles such as researcher, fact-checker,
writer, reviewer, publisher, or operator. The roles may be orchestrated by the
same workflow while still acting like independent callers.

That creates a failure mode:

1. Agent A calls an API or tool.
2. The result is ambiguous, slow, oversized, or hidden behind another agent's
   local state.
3. Agent B cannot prove whether the action already happened.
4. Agent B repeats the call, spends quota, triggers a paid endpoint, mutates
   state, or creates a conflicting handoff.

ATCK should not require agents to share raw tool payloads. It should let them
share a compact action receipt instead.

## Draft Field Set

The first portable field set is intentionally small:

| Field | Purpose |
| --- | --- |
| `prior_receipt_id` | Lets the next agent prove a related action already happened. |
| `idempotency_key` | Lets the target service or coordinator reject duplicate work. |
| `downstream_stop_condition` | Tells the next agent exactly when to stop instead of retrying. |
| `action_fingerprint` | Hash or stable summary of the intended action, without raw payloads. |
| `handoff_owner` | Names the agent or coordinator responsible for resolving ambiguity. |
| `safe_to_log_receipt_id` | Gives observers a public-safe handle for audits and discussion. |

The current synthetic example is:

```text
examples/pre-action/tool-failure-duplicate-call.json
```

## Required Behavior

Before repeating a risky action, the receiving agent should:

1. Check whether `prior_receipt_id` exists.
2. Check whether `idempotency_key` exists and matches the intended action.
3. Check whether the `downstream_stop_condition` applies.
4. Stop or route to `handoff_owner` if any of those fields are missing.
5. Avoid copying raw payloads, authorization headers, customer records, or
   private tool output into the receipt.

## Safe To Log

These fields should be safe to log in public examples and local audit traces:

- `contract_id`
- `profile`
- `request_id`
- `prior_receipt_id`
- `idempotency_key`
- `safe_to_log_receipt_id`
- `missing_contract_fields`

These fields must not be logged:

- raw tool payloads
- authorization headers
- API keys or session tokens
- private records
- customer data
- real production logs copied from a service

## Open Questions

1. Is `prior_receipt_id` enough, or does every duplicate-call guard also need an
   `action_fingerprint`?
2. Should `downstream_stop_condition` be free text, an enum, or a nested
   machine-readable policy?
3. Should duplicate-call prevention live in the core ATCK contract or a profile
   such as `tool_failure_duplicate_call`?
4. How should agents distinguish a safe retry from a duplicate paid call?
5. What is the smallest field that would have stopped the second agent before
   it touched the API?

## Non-Goals

This RFC does not define:

- a global agent identity system
- a reputation score
- a distributed lock service
- a production audit service
- a legal or compliance guarantee

It only defines the receipt fields an agent can check before deciding whether
to repeat, stop, retry, or escalate.
