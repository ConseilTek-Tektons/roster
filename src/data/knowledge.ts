import type { KnowledgeArticle } from "@/lib/assistant";

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: "reclaim-opportunity",
    title: "License reclaim opportunity",
    summary: "The current largest verified reclaim opportunity is 38 inactive Figma editor seats, worth an estimated $7,752 annually at the recorded contract unit price.",
    content: "A seat becomes a candidate after 90 days without an IdP sign-in or product activity. Candidates require owner notification and a seven-day response window before revocation.",
    tags: ["license", "reclaim", "unused", "figma", "cost"],
  },
  {
    id: "collector-health",
    title: "Discovery source health",
    summary: "The Munich on-site collector is stale: its last signed batch arrived 19 hours ago against a four-hour expected interval. Cloud and IdP sources are current.",
    content: "Collectors use short-lived client certificates and push outbound-only signed batches. A source is degraded after two missed intervals and stale after four.",
    tags: ["collector", "discovery", "stale", "munich", "inventory"],
  },
  {
    id: "m365-reconciliation",
    title: "Microsoft 365 reconciliation",
    summary: "Named-user entitlements are joined to active Entra assignments. Disabled accounts are excluded, service accounts are classified separately, and usage is derived from the configured 90-day activity feed.",
    content: "Reconciliation rules are versioned. Every effective license position records the entitlement snapshot, assignment snapshot, rule version, and run time used to calculate it.",
    tags: ["microsoft", "m365", "entra", "reconciliation", "entitlement"],
  },
  {
    id: "asset-history",
    title: "Point-in-time asset history",
    summary: "Roster stores asset state as slowly changing dimensions with non-overlapping validity ranges, enabling evidence-grade point-in-time estate reports.",
    content: "A changed assignment, lifecycle state, discovery fact, or cost center closes the current version and creates a new version inside one transaction.",
    tags: ["history", "asset", "scd", "audit", "postgres"],
  },
];
