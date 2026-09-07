import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/auth";
import { database } from "@/lib/db";
import { hasEffectivePermission } from "@/lib/rbac-server";

export const runtime = "nodejs";
const workspaceId = process.env.WORKSPACE_ID ?? "00000000-0000-4000-8000-000000000001";

const querySchema = z.object({
  q: z.string().trim().max(120).default(""),
  state: z.enum(["procured", "in_stock", "deployed", "repair", "retired", "disposed"]).optional(),
});

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!await hasEffectivePermission(session.user.roles, "assets.view")) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({ q: url.searchParams.get("q") ?? "", state: url.searchParams.get("state") ?? undefined });
  if (!parsed.success) return NextResponse.json({ error: "Invalid asset query." }, { status: 400 });
  if (!process.env.DATABASE_URL && !process.env.PGHOST) return NextResponse.json({ data: [], mode: "demo-ui" });

  const sql = database();
  const search = `%${parsed.data.q}%`;
  const rows = await sql`
    select a.id, a.asset_tag, a.canonical_name, a.asset_type,
           av.lifecycle_state, av.location, av.owner_subject, av.source_id,
           av.last_seen_at, av.valid_during
    from asset a
    join asset_version av on av.asset_id = a.id and upper(av.valid_during) is null
    where a.organisation_id = ${workspaceId}
      and (${parsed.data.q} = '' or a.asset_tag ilike ${search} or a.canonical_name ilike ${search} or av.owner_subject ilike ${search})
      and (${parsed.data.state ?? null}::text is null or av.lifecycle_state = ${parsed.data.state ?? null})
    order by av.last_seen_at desc nulls last
    limit 250
  `;
  return NextResponse.json({ data: rows, mode: "postgres" });
}
