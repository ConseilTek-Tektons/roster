create extension if not exists pgcrypto;
create extension if not exists btree_gist;
create extension if not exists pg_trgm;

create table organisation (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table discovery_source (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisation(id) on delete cascade,
  name text not null,
  source_type text not null check (source_type in ('collector', 'aws', 'azure', 'entra', 'jamf', 'intune', 'manual')),
  expected_interval interval not null default interval '4 hours',
  last_success_at timestamptz,
  state text not null default 'healthy' check (state in ('healthy', 'degraded', 'stale', 'disabled')),
  configuration jsonb not null default '{}'::jsonb,
  unique (organisation_id, name)
);

create table asset (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisation(id) on delete cascade,
  asset_tag text not null,
  canonical_name text not null,
  asset_type text not null check (asset_type in ('laptop', 'desktop', 'server', 'cloud', 'network', 'mobile', 'peripheral', 'other')),
  hardware_uuid text,
  serial_number text,
  created_at timestamptz not null default now(),
  unique (organisation_id, asset_tag)
);

create table asset_version (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references asset(id) on delete cascade,
  source_id uuid references discovery_source(id),
  lifecycle_state text not null check (lifecycle_state in ('procured', 'in_stock', 'deployed', 'repair', 'retired', 'disposed')),
  owner_subject text,
  cost_centre text,
  location text,
  facts jsonb not null default '{}'::jsonb,
  last_seen_at timestamptz,
  valid_during tstzrange not null,
  recorded_at timestamptz not null default now(),
  constraint asset_version_no_overlap exclude using gist (asset_id with =, valid_during with &&)
);

create index asset_name_trgm_idx on asset using gin (canonical_name gin_trgm_ops);
create index asset_version_current_idx on asset_version (asset_id) where upper(valid_during) is null;

create table software_title (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisation(id) on delete cascade,
  publisher text not null,
  canonical_name text not null,
  recognition_patterns jsonb not null default '[]'::jsonb,
  metric text not null default 'named_user',
  unique (organisation_id, publisher, canonical_name)
);

create table installation (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references asset(id) on delete cascade,
  software_title_id uuid references software_title(id),
  raw_title text not null,
  version text,
  discovered_at timestamptz not null,
  last_used_at timestamptz,
  source_id uuid references discovery_source(id),
  unique (asset_id, raw_title, version, source_id)
);

create table licence (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisation(id) on delete cascade,
  software_title_id uuid not null references software_title(id),
  metric text not null,
  quantity numeric(14,2) not null check (quantity >= 0),
  unit_cost_minor bigint not null default 0 check (unit_cost_minor >= 0),
  currency char(3) not null default 'USD',
  true_up_on date,
  terms jsonb not null default '{}'::jsonb
);

create table entitlement (
  id uuid primary key default gen_random_uuid(),
  licence_id uuid not null references licence(id) on delete cascade,
  assignee_subject text not null,
  assigned_at timestamptz not null,
  last_used_at timestamptz,
  state text not null default 'active' check (state in ('active', 'reclaim_candidate', 'revoked')),
  unique (licence_id, assignee_subject)
);

create table contract (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisation(id) on delete cascade,
  vendor text not null,
  name text not null,
  starts_on date not null,
  renews_on date not null,
  annual_value_minor bigint not null,
  currency char(3) not null default 'USD',
  owner_subject text,
  evidence_uri text,
  notice_days integer not null default 90
);

create table reconciliation_run (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisation(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  rule_version text not null,
  source_snapshot jsonb not null,
  status text not null default 'running' check (status in ('running', 'completed', 'failed'))
);

create table licence_position (
  reconciliation_run_id uuid not null references reconciliation_run(id) on delete cascade,
  licence_id uuid not null references licence(id) on delete cascade,
  entitled numeric(14,2) not null,
  consumed numeric(14,2) not null,
  balance numeric(14,2) generated always as (entitled - consumed) stored,
  evidence jsonb not null,
  primary key (reconciliation_run_id, licence_id)
);

create table audit_event (
  id bigint generated always as identity primary key,
  organisation_id uuid not null references organisation(id) on delete cascade,
  actor_subject text not null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index audit_event_org_time_idx on audit_event (organisation_id, occurred_at desc);

create table role_policy (
  organisation_id uuid not null references organisation(id) on delete cascade,
  role_key text not null,
  permissions text[] not null default '{}',
  updated_by text not null,
  updated_at timestamptz not null default now(),
  primary key (organisation_id, role_key)
);
