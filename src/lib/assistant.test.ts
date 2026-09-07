import { describe, expect, it } from "vitest";

import { knowledgeArticles } from "../data/knowledge";
import { retrieveLocalKnowledge } from "./assistant";

describe("estate knowledge retrieval", () => {
  it("finds collector health context", () => {
    expect(retrieveLocalKnowledge("Which discovery collector is stale?", knowledgeArticles)[0]?.id).toBe("collector-health");
  });
});
