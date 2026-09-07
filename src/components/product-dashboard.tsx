"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  Cloud,
  Download,
  Filter,
  HardDrive,
  Laptop,
  MoreHorizontal,
  Network,
  RefreshCw,
  Search,
  Server,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { hasPermission } from "@/lib/rbac";
import { reconcileLicense } from "@/lib/reconciliation";

type Asset = {
  id: string;
  name: string;
  type: "Laptop" | "Server" | "Cloud" | "Network";
  owner: string;
  location: string;
  source: string;
  state: "Deployed" | "In stock" | "Repair";
  lastSeen: string;
};

const assets: Asset[] = [
  { id: "AST-02491", name: "MBP-AFOSTER", type: "Laptop", owner: "Amina Foster", location: "New York", source: "Jamf", state: "Deployed", lastSeen: "3m ago" },
  { id: "AST-02490", name: "ip-10-24-8-42", type: "Cloud", owner: "Platform Ops", location: "us-east-1", source: "AWS", state: "Deployed", lastSeen: "6m ago" },
  { id: "AST-02489", name: "MUC-SW-014", type: "Network", owner: "Network Team", location: "Munich", source: "Collector", state: "Deployed", lastSeen: "19h ago" },
  { id: "AST-02488", name: "WIN-FIN-033", type: "Laptop", owner: "Unassigned", location: "London", source: "Intune", state: "In stock", lastSeen: "31m ago" },
  { id: "AST-02487", name: "db-reporting-02", type: "Server", owner: "Data Platform", location: "Azure UKS", source: "Azure", state: "Deployed", lastSeen: "8m ago" },
  { id: "AST-02486", name: "MBP-LORTEGA", type: "Laptop", owner: "Luis Ortega", location: "Austin", source: "Jamf", state: "Repair", lastSeen: "2d ago" },
];

const estateMix = [
  { name: "Endpoints", value: 1284, color: "#a3ff12" },
  { name: "Cloud", value: 702, color: "#8b5cf6" },
  { name: "Servers", value: 231, color: "#39d7d4" },
  { name: "Network", value: 183, color: "#555" },
];

const licensePositions = [
  reconcileLicense({ publisher: "Figma", product: "Professional", entitled: 220, consumed: 182, unitCost: 204 }),
  reconcileLicense({ publisher: "Microsoft", product: "M365 E5", entitled: 600, consumed: 612, unitCost: 684 }),
  reconcileLicense({ publisher: "Adobe", product: "Creative Cloud", entitled: 96, consumed: 91, unitCost: 659 }),
];

function typeIcon(type: Asset["type"]) {
  if (type === "Laptop") return <Laptop size={15} />;
  if (type === "Server") return <Server size={15} />;
  if (type === "Cloud") return <Cloud size={15} />;
  return <Network size={15} />;
}

export function ProductDashboard({ roles }: { roles: string[] }) {
  const [query, setQuery] = useState("");
  const [state, setState] = useState("All states");
  const [notice, setNotice] = useState("");
  const canExport = hasPermission(roles, "exports.create");
  const canManageDiscovery = hasPermission(roles, "discovery.manage");
  const filtered = useMemo(() => assets.filter((asset) => {
    const matchesQuery = `${asset.id} ${asset.name} ${asset.owner} ${asset.location}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (state === "All states" || asset.state === state);
  }), [query, state]);

  function exportAssets() {
    const rows = ["id,name,type,owner,location,source,state,last_seen", ...filtered.map((asset) => Object.values(asset).join(","))];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "roster-assets.csv";
    link.click();
    URL.revokeObjectURL(href);
    setNotice(`${filtered.length} asset records exported.`);
  }

  return (
    <>
      <header className="page-heading"><div><p className="mono-label">ESTATE CONTROL · LIVE INVENTORY</p><h1>Know what you own.</h1><p>2,400 assets across six sites · 98.7% inventory coverage</p></div><div className="heading-actions">{canExport && <button className="secondary-button" onClick={exportAssets}><Download size={15} /> Export evidence</button>}{canManageDiscovery && <button className="primary-button" onClick={() => setNotice("Discovery run queued across five healthy sources.")}><RefreshCw size={15} /> Run discovery</button>}</div></header>

      {notice && <div className="notice" role="status"><CheckCircle2 size={16} /> {notice}<button onClick={() => setNotice("")}><X size={14} /></button></div>}

      <section className="metric-grid" aria-label="Estate metrics">
        <article className="metric-card featured"><div className="metric-top"><span>Discovered assets</span><Boxes size={17} /></div><strong>2,400</strong><p><span className="positive">+37</span> since last full scan</p><div className="comparison"><span>Coverage</span><b>98.7%</b></div></article>
        <article className="metric-card"><div className="metric-top"><span>License position</span><CircleDollarSign size={17} /></div><strong>$46.2k</strong><p><span className="warning">12 shortfall</span> · 43 reclaim</p><div className="progress-track"><span style={{ width: "74%" }} /></div></article>
        <article className="metric-card"><div className="metric-top"><span>Renewals at risk</span><AlertTriangle size={17} /></div><strong>8</strong><p><span className="warning">$128k ARR</span> within 120 days</p><div className="status-row"><span /><span className="warn" /><span className="warn" /><span /></div></article>
        <article className="metric-card"><div className="metric-top"><span>Discovery health</span><Network size={17} /></div><strong>5 / 6</strong><p><span className="warning">Munich stale</span> for 19 hours</p><div className="comparison"><span>Last full sync</span><b>08:42 UTC</b></div></article>
      </section>

      <div className="dashboard-grid roster-grid">
        <section className="surface asset-surface">
          <header className="surface-header asset-header"><div><h2>Asset inventory</h2><p>Current state · PostgreSQL SCD-2 history available</p></div><div className="table-tools"><label><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search assets" aria-label="Search assets" /></label><label><Filter size={13} /><select value={state} onChange={(event) => setState(event.target.value)}><option>All states</option><option>Deployed</option><option>In stock</option><option>Repair</option></select></label></div></header>
          <div className="asset-table-wrap"><table className="asset-table"><thead><tr><th>Asset</th><th>Owner</th><th>Location</th><th>Source</th><th>State</th><th>Last seen</th><th /></tr></thead><tbody>{filtered.map((asset) => <tr key={asset.id}><td><span className="asset-type">{typeIcon(asset.type)}</span><span><strong>{asset.name}</strong><small>{asset.id} · {asset.type}</small></span></td><td>{asset.owner}</td><td>{asset.location}</td><td><span className="source-chip">{asset.source}</span></td><td><span className={`state-chip ${asset.state.toLowerCase().replace(" ", "-")}`}>{asset.state}</span></td><td className={asset.lastSeen.includes("h") || asset.lastSeen.includes("d") ? "warning" : ""}>{asset.lastSeen}</td><td><button className="icon-button" aria-label={`More actions for ${asset.name}`}><MoreHorizontal size={15} /></button></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="table-empty">No assets match this view.</div>}</div>
        </section>

        <div className="side-stack">
          <section className="surface"><header className="surface-header"><div><h2>Estate mix</h2><p>2,400 active assets</p></div><HardDrive size={18} /></header><div className="estate-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={estateMix} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3}>{estateMix.map((entry) => <Cell fill={entry.color} key={entry.name} />)}</Pie><Tooltip contentStyle={{ background: "#171717", border: "1px solid #333", borderRadius: 6, fontSize: 10 }} /></PieChart></ResponsiveContainer><div className="estate-total"><b>2.4k</b><span>assets</span></div></div><div className="estate-legend">{estateMix.map((entry) => <span key={entry.name}><i style={{ background: entry.color }} />{entry.name}<b>{entry.value}</b></span>)}</div></section>
          <section className="insight-card"><span className="insight-icon"><Sparkles size={18} /></span><div><p className="mono-label">AI OPPORTUNITY</p><h3>38 Figma seats look reclaimable.</h3><p>No sign-in or product activity for 90 days. Estimated annual value is $7,752 using the recorded contract price.</p><button>Open evidence set <ArrowUpRight size={14} /></button></div></section>
        </div>
      </div>

      <section className="surface license-surface"><header className="surface-header"><div><h2>Effective license position</h2><p>Latest completed reconciliation · Sep 7, 08:44 UTC</p></div><CircleDollarSign size={18} /></header><div className="license-grid">{licensePositions.map((position) => <article key={position.product}><div><strong>{position.publisher}</strong><small>{position.product}</small></div><span><small>Entitled</small><b>{position.entitled}</b></span><span><small>Consumed</small><b>{position.consumed}</b></span><span><small>Balance</small><b className={position.state === "shortfall" ? "warning" : "positive"}>{position.balance > 0 ? "+" : ""}{position.balance}</b></span><span><small>{position.state === "shortfall" ? "Exposure" : "Reclaim value"}</small><b>${(position.exposure || position.reclaimValue).toLocaleString()}</b></span><button className="icon-button" aria-label={`Open ${position.product} details`}><ArrowUpRight size={15} /></button></article>)}</div></section>
    </>
  );
}
