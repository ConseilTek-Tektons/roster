# Role-based access control

`src/config/rbac.ts` contains bootstrap roles, permissions, and enterprise-group mappings. When PostgreSQL is connected, authorized administrators can save per-feature overrides from the Access control page. Interface visibility improves usability; effective-policy enforcement in API routes is the actual boundary.

| Role | Intended user | Key access |
|---|---|---|
| `owner` | Product/data owner | Full estate, access policy, settings, and evidence control |
| `itam_admin` | IT asset-management administrator | Assets, software, licenses, contracts, discovery, reconciliation |
| `asset_manager` | Inventory operator | Manage assets, imports, normalization, and approved exports |
| `auditor` | Internal/external auditor | Read inventory, immutable history, license positions, and evidence |
| `technician` | Service-desk/endpoint technician | Read/update assigned asset facts and run approved discovery |
| `viewer` | Read-only stakeholder | Dashboard and approved assistant questions |

Default groups are `roster-owners`, `itam-administrators`, `asset-management`, `software-audit`, and `service-desk`.

Exports, access administration, discovery execution, contract changes, and reconciliation execution are separate permissions. Granting asset edit rights does not imply contract or identity-policy administration. The owner policy is immutable, saves are transactional and audited, and no-database mode exports a policy-as-code JSON draft. Add allow/deny tests whenever a new feature permission is introduced.
