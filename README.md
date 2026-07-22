# Northline

A custody passport for explicit responsibility transfer.

> A handoff request is not a transfer of responsibility.

Northline is an operational custody passport designed around one narrow rule:

**Responsibility moves only when acceptance leaves a permanent imprint.**

## Live Product

Public:
https://faadil1.github.io/northline/

Interactive demo:
https://faadil1.github.io/northline/?demo=1

## The Problem

Operational systems often treat assignment, notification, or handoff initiation as if responsibility has already transferred.

Northline separates those events.

A receiver may:

- receive a handoff request;
- verify the load;
- complete every required check;
- become ready to accept;
- or allow the handoff to expire.

But custody does not move until the receiver explicitly accepts it.

## The Mechanism

The custody passport contains two permanent sheets.

### Sheet 01

Preserves the previous custodian and accepted history.

### Sheet 02

Records the proposed custody transfer.

The receiver verifies:

- load identity;
- seal;
- units;
- condition;
- photo evidence.

Completing all five checks makes the handoff ready.

It does not transfer custody.

Only **Accept Custody** creates the permanent Transfer Imprint.

## Accepted Path

After explicit acceptance:

- Sheet 02 becomes locked;
- the Transfer Imprint is created;
- Northline becomes the current custodian;
- Charlotte remains visible in permanent history.

## Expired Path

When the handoff expires:

- no Transfer Imprint is created;
- Charlotte remains accountable;
- Northline never becomes custodian;
- an exception owner may be assigned without changing custody.

## Product Invariants

- Charlotte remains custodian in OPEN.
- Charlotte remains custodian in READY.
- Northline becomes custodian only after explicit acceptance.
- Expiry never creates a Transfer Imprint.
- Exception assignment never transfers custody.
- Permanent custody history remains visible.

## Visual Direction

Northline was designed as an operational custody document rather than a SaaS dashboard.

Its interface uses:

- passport-like custody sheets;
- archival record structure;
- reserved imprint space;
- a permanent Transfer Imprint;
- visible absence in expired states;
- marginal exception annotations.

The visual principle is:

> Responsibility should leave an imprint when it moves.

## Technology

- React
- TypeScript
- Vite
- GitHub Pages
- Remotion
- Vitest

## Validation

- 14 automated tests passing
- responsive desktop and mobile layouts
- GitHub Pages deployment
- explicit acceptance invariant
- expiry invariant
- exception-only invariant
- permanent history preserved

## 30 Days of Real Business Problems

Northline is Day 7 of the challenge:

**30 Days of Real Business Problems**

Each day:

1. identify a credible business problem;
2. define a distinctive mechanism;
3. build a functional prototype;
4. validate the interaction;
5. publish the product, case study, and demonstration.

## Author

Faadil Boussari

Product design, interaction design, prototyping, and creative direction.
