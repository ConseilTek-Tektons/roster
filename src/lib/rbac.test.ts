import { describe, expect, it } from "vitest";

import { hasPermission, resolveRolesFromClaims } from "./rbac";

describe("RBAC", () => {
  it("allows auditors to export evidence", () => expect(hasPermission(["auditor"], "exports.create")).toBe(true));
  it("prevents technicians from changing licences", () => expect(hasPermission(["technician"], "licenses.manage")).toBe(false));
  it("maps identity groups", () => expect(resolveRolesFromClaims({ groups: ["software-audit"] })).toEqual(["auditor"]));
});
