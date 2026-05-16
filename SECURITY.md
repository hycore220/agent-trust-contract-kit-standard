# Security Policy

This repository contains a public contract standard and local validator. It is not a hosted production service.

## Reporting Issues

Please report vulnerabilities through a private maintainer channel once the public GitHub repository is created. Until then, do not post exploit details in public issues.

## Do Not Include Secrets

Never include:

- API keys
- OAuth codes
- proof solutions
- private customer records
- wallet private keys
- production screenshots with secrets
- private logs or raw user data

## Scope

In scope:

- validator bugs that accept malformed contracts
- schema ambiguity that could cause unsafe proceed/retry decisions
- examples that accidentally normalize unsafe disclosure
- documentation that overstates assurance

Out of scope:

- legal, compliance, custody, tax, sanctions, or accounting certification
- hosted-service availability
- private implementations or proprietary proof packs
