import { describe, expect, it } from "vitest";

import { reconcileLicense } from "./reconciliation";

describe("license reconciliation", () => {
  it("calculates a shortfall exposure", () => {
    const result = reconcileLicense({ publisher: "Microsoft", product: "M365", entitled: 600, consumed: 612, unitCost: 684 });
    expect(result.state).toBe("shortfall");
    expect(result.exposure).toBe(8208);
  });

  it("calculates reclaim value for a surplus", () => {
    const result = reconcileLicense({ publisher: "Figma", product: "Professional", entitled: 220, consumed: 182, unitCost: 204 });
    expect(result.reclaimValue).toBe(7752);
  });
});
