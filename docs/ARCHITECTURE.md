# Architecture and data history

Roster is a modular monolith packaged as one standard container. It separates user experience, authenticated APIs, RBAC, inventory/reconciliation modules, and AI orchestration inside one release. PostgreSQL is the system of record; Redis carries only ephemeral rate-limit state.

![Application flow](architecture/application-flow.svg)

## Request flow

1. AWS App Runner or Azure App Service receives HTTPS traffic and forwards it to the Next.js container.
2. NextAuth validates an enterprise OIDC session; Keycloak can broker upstream SAML.
3. Group claims map to a Roster role. Each API route rechecks its feature permission and organization scope.
4. Discovery/import data is validated and placed in an asynchronous work queue for normalization and reconciliation.
5. PostgreSQL stores the current asset plus non-overlapping historical versions. Reconciliation snapshots preserve evidence used to calculate license positions.
6. AI questions require `assistant.ask`, pass a Redis rate limit, and use only approved knowledge or an optional vector store.

## Core data flows

| Flow | Input | Durable result |
|---|---|---|
| Discovery | endpoint, MDM, cloud, or CSV observations | source record, asset, time-bounded asset version |
| Normalization | raw publisher/title/version | canonical software title plus match confidence |
| Reconciliation | installations, entitlements, metric/rules | immutable run and per-title position |
| Contract review | dates, spend, terms, evidence | contract record and private artifact reference |
| Optimization | unused installs, duplicate titles, shortfalls | explainable opportunity; no automatic destructive action |

## Temporal history

`asset_versions` implements slowly changing dimension type 2. A version has `valid_during` and PostgreSQL prevents overlapping periods for the same asset. Changes close the current range and insert a new version in one transaction. This makes inventory answers reproducible at an earlier date and supports audit review.

## Deployment position

Roster is not a static website. App Runner and App Service Web App for Containers execute authenticated APIs and asynchronous integration logic without VM or Kubernetes maintenance. PostgreSQL and Redis remain managed services on private network paths.
