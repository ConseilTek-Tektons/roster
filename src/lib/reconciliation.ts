export type LicensePosition = {
  publisher: string;
  product: string;
  entitled: number;
  consumed: number;
  unitCost: number;
};

export function reconcileLicense(position: LicensePosition) {
  const balance = position.entitled - position.consumed;
  return {
    ...position,
    balance,
    state: balance < 0 ? "shortfall" : balance > 0 ? "surplus" : "balanced",
    exposure: balance < 0 ? Math.abs(balance) * position.unitCost : 0,
    reclaimValue: balance > 0 ? balance * position.unitCost : 0,
  } as const;
}
