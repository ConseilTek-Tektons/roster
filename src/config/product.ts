import type { ProductConfig } from "./types";

export const product: ProductConfig = {
  id: "roster",
  name: "Roster",
  category: "Platform & Ops",
  tagline: "Every asset and every licence, in one database you own.",
  description:
    "A self-hosted IT asset, software-license, contract, and renewal workspace with evidence-grade history.",
  repositoryUrl: "https://github.com/ConseilTek-Tektons/roster",
  nav: [
    { label: "Assets" },
    { label: "Software" },
    { label: "Licences", badge: "8" },
    { label: "Contracts" },
    { label: "Discovery" },
  ],
  demoUsers: [
    { id: "demo-admin", name: "Nadia Brooks", email: "nadia@northstar.example", role: "itam_admin", label: "ITAM administrator" },
    { id: "demo-manager", name: "Luis Ortega", email: "luis@northstar.example", role: "asset_manager", label: "Asset manager" },
    { id: "demo-auditor", name: "Erin Shaw", email: "erin@northstar.example", role: "auditor", label: "License auditor" },
  ],
  ai: {
    name: "Estate analyst",
    description:
      "Ask about inventory coverage, license position, renewals, normalization, or operating procedures.",
    systemPrompt:
      "You are Roster's IT asset and software-license analyst. Use only the supplied estate context and retrieved knowledge. Never claim an asset was scanned or a license was reclaimed unless the context proves it. Present cost opportunities as estimates and cite the governing reconciliation rule.",
    suggestedQuestions: [
      "Where is our largest reclaim opportunity?",
      "Which discovery source is stale?",
      "How is Microsoft 365 consumption reconciled?",
    ],
  },
};
