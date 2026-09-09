# Flutterwave Payout Contract Research

Research date: 2026-09-08
Project: NobleCards backend
Phase: 7B, research only

## Executive Summary

Flutterwave's current official transfer documentation describes a v4 payout API. The recommended model for NobleCards is the Transfer Orchestrator/direct-transfer flow because it accepts recipient data in the transfer request and avoids a separate recipient lifecycle.

This document does not enable payout execution. No provider request, recipient creation, PayoutAttempt, wallet mutation, or withdrawal status transition was performed during this phase.

The NobleCards merchant account is not verified from this repository or from a live Flutterwave account. Documentation support and merchant enablement must remain separate.

## Phase 7C Implementation Status

Implemented behind explicit configuration gates:

- payout-specific OAuth2 client-credentials client with in-memory token caching;
- sandbox-only route allowlisting through `FLUTTERWAVE_PAYOUT_SUPPORTED_ROUTES`;
- `POST /direct-transfers` request client with `X-Trace-Id` and `X-Idempotency-Key`;
- `GET /transfers/{id}` status client;
- raw-body `flutterwave-signature` HMAC verification;
- durable payout-attempt claim before an external request;
- deterministic payout idempotency derived from the NobleCards withdrawal reference;
- ambiguous provider errors preserve the hold and move the withdrawal under review;
- dedicated payout webhook replay protection through `ProviderWebhookEvent`.

Not implemented or verified:

- no sandbox API call was made because sandbox credentials were not available for this workspace;
- no route is enabled by default;
- production payout is explicitly disabled by the adapter's environment gate;
- merchant enablement is unverified;
- transfer reversal accounting remains an open financial-design item.

## Phase 7D Status

Sandbox configuration status: **NOT CONFIGURED**. No Flutterwave payout-related environment variables were present in the workspace, so no sandbox OAuth or transfer API request was made.

Sandbox route results:

| Route | Result |
|---|---|
| Nigeria / NGN | SANDBOX_BLOCKED - credentials unavailable |
| Ghana / GHS | SANDBOX_BLOCKED - credentials unavailable |
| UK / GBP | SANDBOX_BLOCKED - credentials unavailable and recipient fields incomplete |
| USA / USD | SANDBOX_BLOCKED - credentials unavailable and recipient fields incomplete |
| Canada / CAD | UNSUPPORTED |

### Transfer Reversal Accounting Model

The documented reversal payload contains reversal/reconciliation state, but the inspected contract does not provide enough verified returned-funds amount and currency semantics to automatically credit a NobleCards wallet. Therefore `transfer.reversal` is handled conservatively:

- the original successful withdrawal and transaction remain historical records;
- the payout attempt is marked `UNDER_REVIEW`;
- the withdrawal is moved to `UNDER_REVIEW` when it was previously successful;
- no `releaseHeldFunds` call is made after a finalized success;
- no wallet credit, FX conversion, refund amount, or reversal ledger entry is invented;
- duplicate provider events are blocked by `ProviderWebhookEvent` identity;
- manual/provider-authoritative reconciliation is required before any reversal credit is designed.

This is intentionally not a completed automatic reversal-credit implementation. A later phase must verify the actual returned amount/currency and define the minimum reversal/refund ledger model before crediting funds.

## Phase 7E Readiness

### Sandbox Environment

The required payout environment variables were checked without displaying values. No payout-related variables were configured in the workspace.

Sandbox credentials status: **NOT CONFIGURED**

### Sandbox Route Matrix

| Route | Result | Evidence |
|---|---|---|
| Nigeria / NGN | SANDBOX_BLOCKED | No sandbox OAuth credentials |
| Ghana / GHS | SANDBOX_BLOCKED | No sandbox OAuth credentials |
| UK / GBP | SANDBOX_BLOCKED | No sandbox OAuth credentials; beneficiary fields incomplete |
| USA / USD | SANDBOX_BLOCKED | No sandbox OAuth credentials; beneficiary fields incomplete |
| Canada / CAD | UNSUPPORTED | No verified current CAD route |

### First Sandbox Transfer

Status: **BLOCKED**. No sandbox transfer request, OAuth request, recipient request, or status lookup was made. No provider transfer ID or provider reference exists from this phase.

### Idempotency and Status Observations

No live sandbox behavior was observed. The implementation tests cover deterministic idempotency-key construction, OAuth caching, environment mismatch rejection, and fail-closed configuration behavior only.

### Webhook Observation

No provider webhook was received. The payout webhook remains protected by raw-body HMAC verification and provider event replay protection. Deposit webhook behavior was not changed.

### Merchant Enablement

Merchant transfer/disbursement enablement, KYC approval, route limits, and currency permissions remain **UNVERIFIED**. Documentation support is not treated as account enablement.

### Production Readiness

**PRODUCTION PAYOUT DISABLED**. Sandbox credentials, real sandbox transfer evidence, provider idempotency observation, status observation, webhook observation, merchant enablement, and reversal economics remain unresolved.

## Official Documentation Used

- [Transfer Orchestrator](https://developer.flutterwave.com/docs/direct-transfer-flow.md)
- [Bank Account Transfers](https://developer.flutterwave.com/docs/bank-transfer.md)
- [Mobile Money Transfers](https://developer.flutterwave.com/docs/mobile-money-1.md)
- [General Transfer Flow](https://developer.flutterwave.com/docs/general-transfer-flow.md)
- [Authentication](https://developer.flutterwave.com/docs/authentication.md)
- [Environments](https://developer.flutterwave.com/docs/environments.md)
- [Idempotency](https://developer.flutterwave.com/docs/idempotency.md)
- [Testing](https://developer.flutterwave.com/docs/testing.md)
- [Webhooks](https://developer.flutterwave.com/docs/webhooks.md)
- [Initiate an Orchestrator transfer](https://developer.flutterwave.com/reference/direct_transfers_post.md)
- [Create a transfer](https://developer.flutterwave.com/reference/transfers_post.md)
- [Retrieve a transfer](https://developer.flutterwave.com/reference/transfer_get.md)
- [Create a transfer recipient](https://developer.flutterwave.com/reference/transfers_recipients_create.md)
- [Create a transfer sender](https://developer.flutterwave.com/reference/transfers_senders_create.md)
- [Retrieve banks](https://developer.flutterwave.com/reference/banks_get.md)
- [Bank Account Look Up](https://developer.flutterwave.com/reference/bank_account_resolve_post.md)
- [Rate conversion](https://developer.flutterwave.com/reference/transfer_rates_post.md)
- [Documentation index](https://developer.flutterwave.com/llms.txt)

## Selected Transfer Model

### Selected: Transfer Orchestrator

Endpoint:

```text
POST /direct-transfers
```

Reason for selection:

- Recipient fields can be supplied inline.
- It supports currency-specific bank and mobile-money schemas.
- It avoids storing Flutterwave recipient IDs as the only source of truth.
- It supports deterministic transfer references and an idempotency header.
- It supports the status and webhook model required for later reconciliation.

### Alternative: General Transfer Flow

The general flow uses:

1. `POST /transfers/recipients`
2. Optional `POST /transfers/senders`
3. `POST /transfers`
4. `GET /transfers/{id}` or webhooks

This is valid, but creates a separate provider-recipient and sometimes provider-sender lifecycle. It is more operationally complex for NobleCards' encrypted beneficiary model. It may be useful later where the provider requires reusable recipient IDs or where a sender entity is mandatory.

## Environments

The official environment guide documents:

- Sandbox: `https://developersandbox-api.flutterwave.com`
- Production: `https://f4bexperience.flutterwave.com/`

The production host must be confirmed with Flutterwave before implementation because the existing NobleCards provider uses the older v3 host. Do not copy either host into payout code until the account's API version and access are confirmed.

## Authentication

The current transfer documentation uses OAuth 2.0 client credentials:

```http
POST https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
client_id=<environment-specific-client-id>
client_secret=<environment-specific-client-secret>
```

The token response includes an access token and an expiry of 600 seconds in the official example. Requests use:

```http
Authorization: Bearer <access-token>
Content-Type: application/json
```

The existing NobleCards `FlutterwaveService` currently uses `FLUTTERWAVE_SECRET_KEY` against `https://api.flutterwave.com/v3`. That authentication and host cannot be assumed compatible with the documented v4 transfer API. A future phase needs separate, environment-specific OAuth configuration and token caching.

IP whitelisting is listed as a payout prerequisite. It is a merchant-account requirement, not something verified by this repository.

## Headers

| Header | Classification | Contract |
|---|---|---|
| `Authorization` | REQUIRED | OAuth2 bearer access token |
| `Content-Type` | REQUIRED | `application/json` |
| `X-Trace-Id` | REQUIRED in transfer examples / strongly required operationally | 12 to 255 characters |
| `X-Idempotency-Key` | REQUIRED by official idempotency guidance; optional in the OpenAPI parameter | 12 to 255 characters in the OpenAPI schema |
| `X-Scenario-Key` | SANDBOX-ONLY | Optional test behavior selector, 1 to 1000 characters |

The official idempotency guide recommends UUID keys and says retrying the same key after network errors or 5xx responses is safe. Reusing a key returns the original response and may include `X-Idempotency-Cache-Hit: true`.

The official pages do not state a retention duration or provide a definitive payload-mismatch policy for reusing a key with a changed body. NobleCards must treat a key as permanently bound to one logical payout and never reuse it for another payload.

## Direct Transfer Request

Sanitized bank-transfer structure:

```json
{
  "action": "instant",
  "type": "bank",
  "reference": "NobleCards-withdrawal-reference",
  "narration": "NobleCards withdrawal",
  "callback_url": "https://merchant.example/withdrawals/webhook",
  "payment_instruction": {
    "source_currency": "USD",
    "destination_currency": "NGN",
    "amount": {
      "value": 147.00,
      "applies_to": "destination_currency"
    },
    "recipient": {
      "bank": {
        "account_number": "decrypted-in-memory-only",
        "code": "044"
      }
    }
  }
}
```

The exact recipient schema depends on destination currency. The official examples include currency-specific requirements for NGN, GHS, GBP, and USD. The request must not be assembled from fields that are absent from the verified beneficiary record.

## Amount, FX, and Fee Semantics

The official transfer amount object is:

```json
{
  "value": 1000,
  "applies_to": "destination_currency"
}
```

`applies_to` accepts:

- `destination_currency`: recipient receives the specified value; Flutterwave determines the source debit for cross-currency transfers.
- `source_currency`: the specified value is taken from the source balance and converted to the destination currency.

The official cross-currency guide states that Flutterwave converts between `source_currency` and `destination_currency` using its current rate. It also documents a transfer-rate endpoint and says limits are based on destination currency.

The provider response can contain:

- `amount.value`
- `amount.applies_to`
- `source_currency`
- `destination_currency`
- `fee.currency`
- `fee.value`
- `debit_information.currency`
- `debit_information.actual_debit_amount`
- `debit_information.rate_used`
- `debit_information.vat`
- `extra_information.amount_credited`

For NobleCards, the Phase 4 quote snapshot must remain authoritative. The future Phase 7C mapping must be explicitly chosen after deciding whether the business promise is a fixed recipient amount or a fixed source debit. This phase does not change the quote or fee engine.

Provider fee behavior is documented as a separate `fee` object, while actual total debit and VAT are represented under `debit_information`. NobleCards must not assume its existing `providerFee` or `totalFee` equals the provider's final fee.

## Transfer Response

Important response fields:

```json
{
  "status": "success",
  "message": "Transfer created",
  "data": {
    "id": "trf_provider_transfer_id",
    "reference": "NobleCards-withdrawal-reference",
    "status": "NEW",
    "source_currency": "USD",
    "destination_currency": "NGN",
    "amount": {
      "value": 147.00,
      "applies_to": "destination_currency"
    },
    "fee": {
      "currency": "NGN",
      "value": 10
    },
    "debit_information": {
      "currency": "USD",
      "actual_debit_amount": 100.35,
      "rate_used": 0.00123,
      "vat": 0
    },
    "recipient": {},
    "meta": {},
    "created_datetime": "2025-06-02T16:04:36.072Z"
  }
}
```

These identifiers must remain distinct:

- NobleCards withdrawal reference: internal business reference sent as provider `reference`.
- NobleCards idempotency key: stable internal key sent as `X-Idempotency-Key`.
- Flutterwave transfer ID: provider `data.id`, later stored as the provider transaction identifier.
- Flutterwave transfer reference: provider `data.reference`, expected to match the submitted reference when confirmed.

No provider identifier is generated locally.

## Status Contract

Official transfer statuses include:

- `NEW`: accepted/initiated, not completed.
- `PENDING`: processing.
- `SUCCESSFUL`: completed successfully.
- `FAILED`: could not be processed.
- `CANCELLED` and `INITIATED` also appear in the API schema.

Future mapping:

| Flutterwave | NobleCards withdrawal | Transaction | Wallet action |
|---|---|---|---|
| `NEW` | `PROCESSING` | `PROCESSING` | Hold remains |
| `PENDING` | `PROCESSING` | `PROCESSING` | Hold remains |
| `SUCCESSFUL` | `SUCCESSFUL` | `SUCCESSFUL` | Finalize hold once |
| `FAILED` | `FAILED` | `FAILED` | Release hold once |
| `CANCELLED` | Requires explicit business policy | Requires explicit policy | Never release without definitive provider semantics |

This mapping is documentation only and is not implemented in Phase 7B.

## Retrieve Transfer

The official retrieve endpoint is:

```http
GET /transfers/{id}
```

Use the provider transfer ID from `data.id`, not the NobleCards withdrawal ID or internal reference. The endpoint returns the same transfer object and current status. The official guide recommends periodic polling while avoiding provider rate limits.

## Webhooks

Documented transfer events:

- `transfer.disburse`
- `transfer.reversal`

The payload envelope contains:

```json
{
  "webhook_id": "provider-webhook-id",
  "timestamp": 1739877172874,
  "type": "transfer.disburse",
  "data": {
    "id": "trf_provider_transfer_id",
    "reference": "NobleCards-withdrawal-reference",
    "status": "SUCCESSFUL",
    "source_currency": "NGN",
    "destination_currency": "NGN",
    "amount": 50000,
    "fee": {},
    "debit_information": {},
    "payment_information": {},
    "meta": {}
  }
}
```

Duplicate delivery must be assumed. The official webhook guide recommends recording event IDs and processing idempotently. NobleCards' `ProviderWebhookEvent` has the required provider/event uniqueness fields, but no payout webhook processing was added in this phase.

## Webhook Security

The current official webhook guide documents a `flutterwave-signature` header containing an HMAC-SHA256 value computed over the raw request body using the merchant-configured secret hash. The guide shows base64 output.

This differs from the existing NobleCards deposit implementation, which currently compares a configured hash value directly. A future payout webhook implementation must use the current raw-body HMAC contract and must not silently reuse the deposit verifier without review.

Webhook processing should:

1. Verify the signature over the raw body.
2. Validate `webhook_id`, event type, transfer ID, reference, currency, amount, and status.
3. Re-query `GET /transfers/{id}` before financial finalization where appropriate.
4. Persist the event using the provider/event uniqueness constraint.
5. Apply financial effects once.

## Recipient Model

Direct transfer accepts inline recipient details. The general flow creates provider recipient IDs at `/transfers/recipients` and returns IDs such as `rcb_...` or `rcm_...`.

For NobleCards, direct transfer is the preferred initial model because beneficiary secrets remain encrypted locally and are decrypted only in memory for one provider request. No provider recipient ID should be stored as a substitute for the NobleCards beneficiary record.

## Country Capability Matrix

The matrix distinguishes documentation evidence from merchant enablement. No live account verification or sandbox request was performed.

| Country | Currency | Bank transfer | Mobile money | Provider evidence | Required fields | Cross-currency | Sandbox | Production | Status |
|---|---|---|---|---|---|---|---|---|---|
| Nigeria | NGN | Documented | Not verified for NobleCards route | NGN bank schema and examples; banks endpoint includes NG | Account number, bank code | Documented in general transfer guide | Documented, not run | Merchant enablement required | UNVERIFIED |
| Ghana | GHS | Documented | GHS mobile-money example documented | GHS bank schema requires bank code and branch; GHS mobile money example | Bank account, code, branch; or network and MSISDN | Documented generally | Documented, not run | Merchant enablement required | UNVERIFIED |
| United Kingdom | GBP | Documented schema | Not documented for GBP | GBP bank schema requires account number, account type, bank name, sort code, recipient identity/contact/address | More than current NobleCards beneficiary stores | Documented generally | Not run | Merchant enablement and route approval required | UNVERIFIED |
| United States | USD | Documented schema | Not documented for USD | USD bank schema requires account number, account type, bank code, routing number, SWIFT code, recipient identity/contact/address | More than current NobleCards beneficiary stores | Documented generally | Documented in schema, not run | Merchant enablement required | UNVERIFIED |
| Canada | CAD | No current official route found in the inspected transfer schemas or bank-country enum | Not documented | CAD appears in generic currency enum, but Canada is absent from the official bank-country enum and no CAD bank instruction was found | Unknown | Unknown | Not verified | Unknown | UNSUPPORTED for NobleCards until Flutterwave confirms a route |

The official bank-country endpoint's documented country enum includes `GH`, `NG`, and `US`, but not `GB` or `CA`. That does not prove every transfer route is impossible, but it prevents claiming bank-route support for UK or Canada from the currently inspected bank API contract.

## Country-Specific Findings

### Nigeria

Official direct-transfer examples use:

- `destination_currency: NGN`
- `source_currency: NGN` or another source currency for cross-currency
- `recipient.bank.account_number`
- `recipient.bank.code`

The bank account lookup contract supports NGN and requires bank code plus account number. The current NobleCards beneficiary model can hold an institution code and encrypted account number. Provider account resolution is not currently implemented against this v4 endpoint.

### Ghana

Official GHS bank transfer requires:

- account number
- bank code
- branch code

The official bank guide specifically says branch lookup may be required for GHS. The current NobleCards beneficiary model has only one institution code field and does not have a separate persisted branch code. That is a schema/mapping gap for future GHS bank payouts.

Official GHS mobile money examples use a network and an MSISDN beginning with country code `233`. The current beneficiary model has a mobile-money number and provider field, but merchant support and exact network persistence need verification.

### United Kingdom

The official schema includes GBP bank transfers and requires account number, account type, bank name, and sort code plus recipient identity/contact/address fields. The official general-flow guide says sender entities are required for GBP in the general model.

The current NobleCards beneficiary schema does not persist all required GBP fields, and the merchant's UK payout enablement is unverified. The existing repository's GBP code is a deposit/charge path, not a payout path.

### United States

The official USD bank schema requires account number, account type, bank code, routing number, and SWIFT code plus recipient identity/contact/address fields. The bank-country lookup enum includes `US`.

The current NobleCards beneficiary schema does not persist all required recipient fields. USD payout availability for this merchant remains unverified.

### Canada

No exact CAD bank-transfer instruction or Canadian bank-country entry was found in the current official pages inspected. Generic currency lists are not sufficient evidence of a CAD payout route. Canada is therefore unsupported for NobleCards until Flutterwave provides and the merchant verifies an exact route.

## Sandbox Contract

Official sandbox guidance states:

- Test data is mocked and separated from production.
- Test data is archived after 30 days.
- Transfers without a scenario header remain pending and send no webhook in the documented default behavior.
- `X-Scenario-Key: scenario:successful` simulates success.
- Other documented scenarios include `reversed`, `failed`, `account_verification_failed`, transfer limit failures, `disabled_transfer`, `duplicate_reference`, `insufficient_balance`, and `payout_creation_failed`.

No sandbox API request was performed because no safe sandbox credentials were verified in the repository. No real or test beneficiary details were sent to Flutterwave.

## Merchant Account Requirements

The official payout documentation identifies or implies these requirements:

- v4 API credentials: client ID and client secret.
- OAuth token retrieval.
- IP allowlisting.
- Sufficient provider balance in the source currency.
- Transfer/disbursement capability enabled for the merchant.
- Currency conversion/pricing configured for cross-currency routes.
- Webhook URL configured in the Flutterwave dashboard.
- Country, currency, bank, mobile-network, and transfer-limit enablement.
- Compliance/KYC approval and any international-transfer approval required by Flutterwave.

None of these account-level capabilities are verified for NobleCards in this phase.

## NobleCards Mapping for Future Phase 7C

Proposed mapping, subject to final merchant and amount-semantics approval:

```text
Withdrawal.reference
  -> Flutterwave request.data.reference

stable payout idempotency key derived from withdrawal.id/reference
  -> X-Idempotency-Key

Withdrawal.amountReceived
  -> provider amount.value when the product promise is fixed recipient amount

Withdrawal.destinationCurrencyCode
  -> payment_instruction.destination_currency

Withdrawal.sourceCurrencyCode
  -> payment_instruction.source_currency

Beneficiary encrypted details
  -> decrypted in memory only for recipient fields

Flutterwave data.id
  -> PayoutAttempt.providerTransactionId

Flutterwave data.reference
  -> PayoutAttempt.providerReference
```

Do not implement this mapping until the product decision between source-applied and destination-applied amount is approved and the merchant account confirms the route.

## Current NobleCards Gaps

- Existing `FlutterwaveService` uses v3 secret-key authentication, not the documented v4 OAuth flow.
- Existing Flutterwave code has no transfer creation method.
- Existing Flutterwave code has no transfer status method.
- Existing Flutterwave deposit webhook verification is not the current payout HMAC contract.
- Beneficiary data is insufficient for GBP and USD recipient schemas.
- GHS bank branch data is not separately represented.
- Canada has no verified route.
- Merchant enablement is unknown.
- No sandbox contract test was performed.
- PayoutAttempt and ProviderWebhookEvent are not yet used by payout code.

## Phase 7C Readiness

**NOT READY**

Critical blockers:

- [ ] Merchant payout/disbursement capability verified.
- [ ] v4 OAuth credentials and production host verified.
- [ ] NobleCards payout routes verified in sandbox.
- [ ] Nigeria route verified with the merchant account.
- [ ] Ghana route and branch requirements verified.
- [ ] UK route and merchant enablement verified.
- [ ] USA route and merchant enablement verified.
- [ ] Canada route confirmed or formally excluded.
- [ ] Amount and fee semantics reconciled with the NobleCards quote snapshot.
- [ ] Beneficiary model extended only where verified fields are required.
- [ ] Current webhook HMAC contract implemented and tested.
- [ ] Safe status reconciliation and timeout handling implemented.

## No-Execution Statement

Phase 7B performed no provider API calls, no payout initiation, no recipient creation, no wallet mutation, no PayoutAttempt creation, no provider identifier persistence, and no withdrawal financial-state transition.
