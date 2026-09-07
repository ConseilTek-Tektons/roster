insert into organisation (id, name, slug) values ('00000000-0000-4000-8000-000000000001', 'Northstar', 'northstar') on conflict do nothing;

insert into discovery_source (id, organisation_id, name, source_type, last_success_at, state) values
('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'AWS Organizations', 'aws', now() - interval '6 minutes', 'healthy'),
('10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'Microsoft Entra', 'entra', now() - interval '11 minutes', 'healthy'),
('10000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', 'Munich collector', 'collector', now() - interval '19 hours', 'stale')
on conflict do nothing;

insert into asset (id, organisation_id, asset_tag, canonical_name, asset_type, hardware_uuid, serial_number) values
('20000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'AST-02491', 'MBP-AFOSTER', 'laptop', 'HW-MBP-2491', 'C02NORTHSTAR01'),
('20000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'AST-02490', 'ip-10-24-8-42', 'cloud', 'i-0a123456789', null),
('20000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', 'AST-02489', 'MUC-SW-014', 'network', '00:11:22:33:44:55', 'SWMUC014')
on conflict do nothing;

insert into asset_version (asset_id, source_id, lifecycle_state, owner_subject, cost_centre, location, facts, last_seen_at, valid_during) values
('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002', 'deployed', 'amina@northstar.example', 'PEOPLE', 'New York', '{"os":"macOS 15.6"}', now() - interval '3 minutes', tstzrange(now() - interval '90 days', null, '[)')),
('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'deployed', 'platform-ops', 'PLATFORM', 'us-east-1', '{"instanceType":"m7g.large"}', now() - interval '6 minutes', tstzrange(now() - interval '40 days', null, '[)')),
('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', 'deployed', 'network-team', 'IT', 'Munich', '{"vendor":"Cisco"}', now() - interval '19 hours', tstzrange(now() - interval '400 days', null, '[)'));
