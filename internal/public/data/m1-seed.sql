-- ============================================================
-- ORACLE LABS — TOWER DATABASE DUMP
-- Extracted: 2026-03-18 02:15 GMT+7 (post-incident)
-- Classification: INVESTIGATION USE ONLY
-- Note: All timestamps are local (GMT+7) unless otherwise noted
-- ============================================================

-- ============================================================
-- TABLE 1: employees
-- Core employee records. 9 named suspects + 15 background staff.
-- ============================================================
CREATE TABLE employees (
  emp_id     TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  role       TEXT NOT NULL,
  department TEXT NOT NULL,
  dob        TEXT,
  start_date TEXT,
  manager_id TEXT,
  status     TEXT DEFAULT 'active'
);

INSERT INTO employees VALUES
  ('E001', 'Kai Đặng',     'Founder & CEO',           'Executive',    '1993-03-17', '2019-01-15', NULL,   'active'),
  ('E002', 'Minh Trần',    'Chief Technology Officer', 'Engineering',  '1992-08-22', '2019-01-15', 'E001', 'active'),
  ('E003', 'Andy Đức Lê',  'Co-founder & COO',        'Operations',   '1993-06-04', '2019-01-15', NULL,   'active'),
  ('E004', 'Bảo Nguyễn',   'Head of Security',        'Security',     '1985-11-30', '2020-06-01', 'E003', 'active'),
  ('E005', 'Linh Phạm',    'Head of Product',         'Product',      '1994-02-14', '2019-03-20', 'E001', 'active'),
  ('E006', 'Phúc Hoàng',   'Board Chair',             'Board',        '1968-09-12', '2020-01-01', NULL,   'active'),
  ('E007', 'Trang Vũ',     'Executive Assistant',     'Executive',    '1996-05-28', '2021-08-10', 'E001', 'active'),
  ('E008', 'Dr. Hạnh Lý',  'Company Physician',       'Medical',      '1975-12-03', '2022-01-15', 'E003', 'active'),
  ('E009', 'Sơn Phan',     'Junior Engineer',         'Engineering',  '2000-07-19', '2024-09-01', 'E002', 'active'),
  ('E010', 'Thảo Đinh',    'Senior Frontend Dev',     'Engineering',  '1995-04-11', '2020-11-15', 'E002', 'active'),
  ('E011', 'Hùng Lê',      'Backend Engineer',        'Engineering',  '1997-01-25', '2021-03-01', 'E002', 'active'),
  ('E012', 'Mai Ngô',      'Data Scientist',          'Data',         '1996-10-08', '2021-06-15', 'E002', 'active'),
  ('E013', 'Đạt Trương',   'DevOps Lead',             'Engineering',  '1991-08-14', '2020-04-01', 'E002', 'active'),
  ('E014', 'Yến Hoàng',    'HR Manager',              'People',       '1990-03-22', '2020-09-01', 'E003', 'active'),
  ('E015', 'Khoa Võ',      'Security Guard',          'Security',     '1988-06-17', '2021-01-10', 'E004', 'active'),
  ('E016', 'Phương Trịnh',  'Security Guard',          'Security',     '1990-12-01', '2021-01-10', 'E004', 'active'),
  ('E017', 'Tuấn Đỗ',     'ML Engineer',             'Engineering',  '1998-02-28', '2023-01-15', 'E002', 'active'),
  ('E018', 'Ngọc Bùi',    'Product Designer',        'Product',      '1997-09-15', '2022-05-01', 'E005', 'active'),
  ('E019', 'Quân Lý',     'Finance Controller',      'Finance',      '1989-04-30', '2020-08-15', 'E003', 'active'),
  ('E020', 'Lan Nguyễn',   'Office Manager',          'Operations',   '1993-11-20', '2021-02-01', 'E003', 'active'),
  ('E021', 'Việt Hoàng',   'QA Lead',                 'Engineering',  '1995-07-07', '2022-03-01', 'E002', 'active'),
  ('E022', 'Hà Trần',      'Legal Counsel',           'Legal',        '1987-01-18', '2021-11-01', 'E003', 'active'),
  ('E023', 'Dũng Phạm',    'Infrastructure Eng',      'Engineering',  '1994-05-09', '2023-06-01', 'E013', 'active'),
  ('E024', 'Vy Lê',        'Marketing Lead',          'Marketing',    '1996-08-25', '2022-07-01', 'E003', 'active');


-- ============================================================
-- TABLE 2: hr_directory
-- Private HR data. Links emp_id → tax_no, home address, contacts.
-- The ONLY table connecting emp_id to tax_no (needed for bank_transactions).
-- ============================================================
CREATE TABLE hr_directory (
  emp_id            TEXT PRIMARY KEY REFERENCES employees(emp_id),
  tax_no            TEXT UNIQUE NOT NULL,
  home_address      TEXT,
  emergency_contact TEXT,
  blood_type        TEXT,
  national_id       TEXT
);

INSERT INTO hr_directory VALUES
  ('E001', 'TX-8839201', '42 Nguyễn Huệ, D1, HCMC',           'Kiên Đặng (brother) — 0901-555-0101',   'O+',  'ID-930317-001'),
  ('E002', 'TX-7712445', '15 Lê Thánh Tôn, D1, HCMC',         'Lan Trần (mother) — 0908-222-3344',      'A+',  'ID-920822-002'),
  ('E003', 'TX-6634890', '88 Thảo Điền, D2, HCMC',             'Nguyệt Lê (wife) — 0912-777-8899',      'B+',  'ID-930604-003'),
  ('E004', 'TX-5590123', '7 Phú Mỹ Hưng, D7, HCMC',           'None listed',                            'AB-', 'ID-851130-004'),
  ('E005', 'TX-4478234', '201 Võ Văn Tần, D3, HCMC',           'Minh Phạm (father) — 0903-111-2233',    'A-',  'ID-940214-005'),
  ('E006', 'TX-3312567', '1 Thảo Điền Pearl, D2, HCMC',        'An Hoàng (son) — 0909-666-5544',         'O-',  'ID-680912-006'),
  ('E007', 'TX-2289901', '33 Bến Vân Đồn, D4, HCMC',           'Hương Vũ (sister) — 0907-333-4455',     'B-',  'ID-960528-007'),
  ('E008', 'TX-1156789', 'Cho Ray Hospital Staff Housing',     'None listed',                            'A+',  'ID-751203-008'),
  ('E009', 'TX-9923456', '12 KTX Đại học Bách Khoa, Thủ Đức',  'Bình Phan (father) — 0911-888-9900',    'O+',  'ID-000719-009'),
  ('E010', 'TX-8801234', '55 Nguyễn Thị Minh Khai, D1, HCMC',  'Anh Đinh (spouse) — 0905-444-5566',     'B+',  'ID-950411-010'),
  ('E011', 'TX-7745678', '28 Cộng Hòa, Tân Bình, HCMC',        'Thanh Lê (mother) — 0918-111-0099',     'A+',  'ID-970125-011'),
  ('E012', 'TX-6690123', '90 Trần Hưng Đạo, D5, HCMC',         'Nam Ngô (brother) — 0906-222-1188',     'AB+', 'ID-961008-012'),
  ('E013', 'TX-5534567', '17 Pasteur, D1, HCMC',                'Thu Trương (wife) — 0902-333-2277',     'O-',  'ID-910814-013'),
  ('E014', 'TX-4478901', '62 Hai Bà Trưng, D1, HCMC',           'Hải Hoàng (husband) — 0919-444-3366',  'B-',  'ID-900322-014'),
  ('E015', 'TX-3323456', '5 Bình Thạnh, HCMC',                  'Loan Võ (wife) — 0904-555-4455',        'A-',  'ID-880617-015'),
  ('E016', 'TX-2267890', '8 Gò Vấp, HCMC',                      'Trúc Trịnh (mother) — 0913-666-5544',  'O+',  'ID-901201-016'),
  ('E017', 'TX-1112345', '45 Phú Nhuận, HCMC',                  'Duyên Đỗ (sister) — 0916-777-6633',    'B+',  'ID-980228-017'),
  ('E018', 'TX-9956789', '31 D3, HCMC',                          'Quỳnh Bùi (mother) — 0910-888-7722',  'A+',  'ID-970915-018'),
  ('E019', 'TX-8890123', '19 D7, HCMC',                          'Thy Lý (wife) — 0917-999-8811',        'AB-', 'ID-890430-019'),
  ('E020', 'TX-7734567', '77 Bình Tân, HCMC',                    'Dung Nguyễn (father) — 0915-000-9900', 'O+',  'ID-931120-020'),
  ('E021', 'TX-6678901', '22 Tân Phú, HCMC',                     'Liên Hoàng (mother) — 0914-111-0088',  'B-',  'ID-950707-021'),
  ('E022', 'TX-5523456', '50 D1, HCMC',                          'Phát Trần (husband) — 0903-222-1177',  'A-',  'ID-870118-022'),
  ('E023', 'TX-4467890', '14 Thủ Đức, HCMC',                     'Hiền Phạm (wife) — 0901-333-2266',    'O-',  'ID-940509-023'),
  ('E024', 'TX-3312345', '66 D2, HCMC',                           'Long Lê (brother) — 0920-444-3355',   'B+',  'ID-960825-024');


-- ============================================================
-- TABLE 3: device_registry
-- Maps emp_id → physical devices. The CRITICAL bridge table.
-- Links emp_id to badge_id (for badge_access), sim_id (for phone_logs),
-- mac_addr (for wifi_sessions), and laptop_id.
-- ============================================================
CREATE TABLE device_registry (
  emp_id    TEXT PRIMARY KEY REFERENCES employees(emp_id),
  badge_id  TEXT UNIQUE NOT NULL,
  sim_id    TEXT UNIQUE,
  mac_addr  TEXT UNIQUE,
  laptop_id TEXT
);

INSERT INTO device_registry VALUES
  ('E001', 'B-1001', 'SIM-4401', 'AA:BB:CC:01:01:01', 'LP-K001'),
  ('E002', 'B-1002', 'SIM-4402', 'AA:BB:CC:02:02:02', 'LP-M002'),
  ('E003', 'B-1003', 'SIM-4403', 'AA:BB:CC:03:03:03', 'LP-A003'),
  ('E004', 'B-1004', 'SIM-4404', 'AA:BB:CC:04:04:04', 'LP-B004'),
  ('E005', 'B-1005', 'SIM-4405', 'AA:BB:CC:05:05:05', 'LP-L005'),
  ('E006', 'B-1006', 'SIM-4406', 'AA:BB:CC:06:06:06', NULL),
  ('E007', 'B-1007', 'SIM-4407', 'AA:BB:CC:07:07:07', 'LP-T007'),
  ('E008', 'B-1008', 'SIM-4408', NULL,                 NULL),
  ('E009', 'B-1009', 'SIM-4409', 'AA:BB:CC:09:09:09', 'LP-S009'),
  ('E010', 'B-1010', 'SIM-4410', 'AA:BB:CC:10:10:10', 'LP-T010'),
  ('E011', 'B-1011', 'SIM-4411', 'AA:BB:CC:11:11:11', 'LP-H011'),
  ('E012', 'B-1012', 'SIM-4412', 'AA:BB:CC:12:12:12', 'LP-M012'),
  ('E013', 'B-1013', 'SIM-4413', 'AA:BB:CC:13:13:13', 'LP-D013'),
  ('E014', 'B-1014', 'SIM-4414', NULL,                 'LP-Y014'),
  ('E015', 'B-1015', 'SIM-4415', NULL,                 NULL),
  ('E016', 'B-1016', 'SIM-4416', NULL,                 NULL),
  ('E017', 'B-1017', 'SIM-4417', 'AA:BB:CC:17:17:17', 'LP-T017'),
  ('E018', 'B-1018', 'SIM-4418', 'AA:BB:CC:18:18:18', 'LP-N018'),
  ('E019', 'B-1019', 'SIM-4419', 'AA:BB:CC:19:19:19', 'LP-Q019'),
  ('E020', 'B-1020', 'SIM-4420', NULL,                 'LP-L020'),
  ('E021', 'B-1021', 'SIM-4421', 'AA:BB:CC:21:21:21', 'LP-V021'),
  ('E022', 'B-1022', 'SIM-4422', NULL,                 'LP-H022'),
  ('E023', 'B-1023', 'SIM-4423', 'AA:BB:CC:23:23:23', 'LP-D023'),
  ('E024', 'B-1024', 'SIM-4424', 'AA:BB:CC:24:24:24', 'LP-V024');


-- ============================================================
-- TABLE 4: badge_access  ⏰ THE TIMEZONE TRAP
-- Physical badge swipes at tower doors.
-- Door controller export. The timestamp column is named by the source system.
-- ============================================================
CREATE TABLE badge_access (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  badge_id  TEXT NOT NULL,
  floor     INTEGER NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('IN', 'OUT')),
  ts_utc    TEXT NOT NULL
);

-- Launch night: 2026-03-17 (evening, local time = UTC + 7)
-- Normal daytime traffic (UTC times = local - 7)
INSERT INTO badge_access (badge_id, floor, direction, ts_utc) VALUES
  -- Morning arrivals (local ~08:00-09:00 = UTC 01:00-02:00)
  ('B-1001', 1,  'IN',  '2026-03-17 01:15:00'),  -- Kai arrives 08:15 local
  ('B-1001', 41, 'IN',  '2026-03-17 01:18:00'),  -- Kai goes to 41F
  ('B-1002', 1,  'IN',  '2026-03-17 01:30:00'),  -- Minh arrives 08:30
  ('B-1002', 38, 'IN',  '2026-03-17 01:33:00'),  -- Minh to eng floor 38
  ('B-1003', 1,  'IN',  '2026-03-17 01:45:00'),  -- Andy arrives 08:45
  ('B-1003', 40, 'IN',  '2026-03-17 01:48:00'),  -- Andy to ops floor 40
  ('B-1004', 1,  'IN',  '2026-03-17 00:55:00'),  -- Bảo arrives 07:55 (early, security)
  ('B-1004', 2,  'IN',  '2026-03-17 00:58:00'),  -- Bảo to security office floor 2
  ('B-1005', 1,  'IN',  '2026-03-17 02:00:00'),  -- Linh arrives 09:00
  ('B-1005', 35, 'IN',  '2026-03-17 02:03:00'),  -- Linh to product floor 35
  ('B-1007', 1,  'IN',  '2026-03-17 01:20:00'),  -- Trang arrives 08:20
  ('B-1007', 41, 'IN',  '2026-03-17 01:23:00'),  -- Trang to exec floor 41
  ('B-1009', 1,  'IN',  '2026-03-17 02:30:00'),  -- Sơn arrives 09:30
  ('B-1009', 38, 'IN',  '2026-03-17 02:33:00'),  -- Sơn to eng floor
  ('B-1010', 1,  'IN',  '2026-03-17 02:15:00'),  -- Thảo arrives
  ('B-1010', 38, 'IN',  '2026-03-17 02:18:00'),
  ('B-1011', 1,  'IN',  '2026-03-17 02:20:00'),  -- Hùng arrives
  ('B-1011', 38, 'IN',  '2026-03-17 02:23:00'),
  ('B-1013', 1,  'IN',  '2026-03-17 01:50:00'),  -- Đạt arrives
  ('B-1013', 38, 'IN',  '2026-03-17 01:53:00'),

  -- Midday movement (lunch, meetings)
  ('B-1001', 41, 'OUT', '2026-03-17 04:00:00'),  -- Kai leaves 41 for lunch 11:00
  ('B-1001', 1,  'OUT', '2026-03-17 04:05:00'),
  ('B-1001', 1,  'IN',  '2026-03-17 05:00:00'),  -- Kai returns 12:00
  ('B-1001', 41, 'IN',  '2026-03-17 05:03:00'),
  ('B-1002', 38, 'OUT', '2026-03-17 04:30:00'),  -- Minh leaves for lunch
  ('B-1002', 1,  'OUT', '2026-03-17 04:33:00'),
  ('B-1002', 1,  'IN',  '2026-03-17 05:30:00'),  -- Minh returns
  ('B-1002', 38, 'IN',  '2026-03-17 05:33:00'),

  -- Afternoon: Minh visits floor 41 (meeting with Kai — normal)
  ('B-1002', 38, 'OUT', '2026-03-17 07:00:00'),  -- Minh leaves 38 at 14:00 local
  ('B-1002', 41, 'IN',  '2026-03-17 07:03:00'),  -- Minh goes to 41 (meeting)
  ('B-1002', 41, 'OUT', '2026-03-17 08:00:00'),  -- Minh leaves 41 at 15:00
  ('B-1002', 38, 'IN',  '2026-03-17 08:03:00'),  -- Minh back to 38

  -- Evening: launch party setup (floor 39 = event floor)
  ('B-1007', 41, 'OUT', '2026-03-17 10:00:00'),  -- Trang leaves 41 at 17:00
  ('B-1007', 39, 'IN',  '2026-03-17 10:03:00'),  -- Trang to party floor
  ('B-1003', 40, 'OUT', '2026-03-17 10:30:00'),  -- Andy leaves ops
  ('B-1003', 39, 'IN',  '2026-03-17 10:33:00'),  -- Andy to party floor
  ('B-1005', 35, 'OUT', '2026-03-17 10:15:00'),  -- Linh leaves product
  ('B-1005', 39, 'IN',  '2026-03-17 10:18:00'),  -- Linh to party floor

  -- Bảo moves around (security rounds — normal for him)
  ('B-1004', 2,  'OUT', '2026-03-17 09:00:00'),  -- 16:00 local
  ('B-1004', 39, 'IN',  '2026-03-17 09:05:00'),  -- checks party floor
  ('B-1004', 39, 'OUT', '2026-03-17 09:30:00'),
  ('B-1004', 2,  'IN',  '2026-03-17 09:35:00'),  -- back to security

  -- Engineers leaving for the day
  ('B-1010', 38, 'OUT', '2026-03-17 11:00:00'),  -- Thảo leaves 18:00
  ('B-1010', 1,  'OUT', '2026-03-17 11:05:00'),
  ('B-1011', 38, 'OUT', '2026-03-17 11:30:00'),  -- Hùng leaves 18:30
  ('B-1011', 1,  'OUT', '2026-03-17 11:35:00'),
  ('B-1013', 38, 'OUT', '2026-03-17 12:00:00'),  -- Đạt leaves 19:00
  ('B-1013', 1,  'OUT', '2026-03-17 12:05:00'),

  -- *** THE CRITICAL EVENING WINDOW (local 20:00-00:00 = UTC 13:00-17:00) ***

  -- Kai still on 41 (has been there since lunch return)
  -- Kai's last system logout is at 21:00 local (14:00 UTC) — see system_events

  -- Bảo does evening security round
  ('B-1004', 2,  'OUT', '2026-03-17 13:00:00'),  -- Bảo leaves security 20:00 local
  ('B-1004', 39, 'IN',  '2026-03-17 13:05:00'),  -- checks party floor (party is ramping up)
  ('B-1004', 39, 'OUT', '2026-03-17 13:30:00'),  -- 20:30
  ('B-1004', 41, 'IN',  '2026-03-17 13:35:00'),  -- Bảo goes to 41! (20:35 local)
  ('B-1004', 41, 'OUT', '2026-03-17 13:45:00'),  -- Bảo leaves 41 after 10 min (20:45)
  ('B-1004', 2,  'IN',  '2026-03-17 13:50:00'),  -- back to security

  -- Sơn working late
  ('B-1009', 38, 'OUT', '2026-03-17 14:30:00'),  -- Sơn leaves eng 21:30 local
  ('B-1009', 39, 'IN',  '2026-03-17 14:33:00'),  -- goes to party
  ('B-1009', 39, 'OUT', '2026-03-17 15:00:00'),  -- leaves party 22:00
  ('B-1009', 1,  'OUT', '2026-03-17 15:05:00'),  -- goes home

  -- Minh leaves the building
  ('B-1002', 38, 'OUT', '2026-03-17 15:15:00'),  -- Minh leaves eng 22:15 local
  ('B-1002', 39, 'IN',  '2026-03-17 15:18:00'),  -- stops by party briefly
  ('B-1002', 39, 'OUT', '2026-03-17 15:25:00'),  -- leaves party 22:25
  ('B-1002', 1,  'OUT', '2026-03-17 15:28:00'),  -- Minh exits building 22:28 local

  -- *** LINH goes to floor 41 at ~23:00 local (16:00 UTC) ***
  ('B-1005', 39, 'OUT', '2026-03-17 15:55:00'),  -- Linh leaves party 22:55
  ('B-1005', 41, 'IN',  '2026-03-17 16:00:00'),  -- Linh enters 41 at 23:00 local!
  ('B-1005', 41, 'OUT', '2026-03-17 16:08:00'),  -- Linh leaves 41 after 8 min (23:08)
  ('B-1005', 39, 'IN',  '2026-03-17 16:12:00'),  -- back to party

  -- Andy briefly goes to 41
  ('B-1003', 39, 'OUT', '2026-03-17 16:15:00'),  -- Andy leaves party 23:15
  ('B-1003', 41, 'IN',  '2026-03-17 16:18:00'),  -- Andy enters 41 at 23:18
  ('B-1003', 41, 'OUT', '2026-03-17 16:22:00'),  -- Andy leaves 41 at 23:22
  ('B-1003', 39, 'IN',  '2026-03-17 16:25:00'),  -- back to party

  -- Late floor-41 access from Minh's badge
  ('B-1002', 41, 'IN',  '2026-03-17 16:40:00'),

  -- THEIA emergency call at 23:47 local (16:47 UTC)
  -- After: Bảo's badge logs
  ('B-1004', 2,  'OUT', '2026-03-17 14:00:00'),  -- Bảo leaves security 21:00 local (second round)
  ('B-1004', 1,  'IN',  '2026-03-17 17:00:00'),  -- Bảo enters lobby at 00:00 (responding to incident)
  ('B-1004', 41, 'IN',  '2026-03-17 17:05:00'),  -- Bảo arrives 41 at 00:05 (officially responding)
  ('B-1004', 41, 'OUT', '2026-03-17 17:30:00'),  -- Bảo leaves 41 at 00:30

  -- Party-goers leaving after the incident
  ('B-1003', 39, 'OUT', '2026-03-17 17:15:00'),  -- Andy leaves party after commotion
  ('B-1003', 1,  'OUT', '2026-03-17 17:20:00'),
  ('B-1005', 39, 'OUT', '2026-03-17 17:10:00'),  -- Linh leaves
  ('B-1005', 1,  'OUT', '2026-03-17 17:12:00'),
  ('B-1007', 39, 'OUT', '2026-03-17 17:25:00'),  -- Trang leaves
  ('B-1007', 1,  'OUT', '2026-03-17 17:28:00');


-- ============================================================
-- TABLE 5: phone_logs
-- Cell tower pings. ts_local is GMT+7.
-- KEY: Minh's phone pings tower VT-D2-047 (Thảo Điền, District 2)
-- at 23:40 local — he's across the city, NOT at the tower.
-- ============================================================
CREATE TABLE phone_logs (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  sim_id   TEXT NOT NULL,
  tower_id TEXT NOT NULL,
  ts_local TEXT NOT NULL,
  duration_sec INTEGER,
  call_type TEXT CHECK (call_type IN ('VOICE_IN', 'VOICE_OUT', 'SMS_IN', 'SMS_OUT', 'DATA', 'PING'))
);

INSERT INTO phone_logs (sim_id, tower_id, ts_local, duration_sec, call_type) VALUES
  -- Minh's phone throughout the day (SIM-4402)
  ('SIM-4402', 'VT-D1-012', '2026-03-17 08:30:00', NULL, 'PING'),       -- morning, D1 (tower office)
  ('SIM-4402', 'VT-D1-012', '2026-03-17 12:15:00', 180, 'VOICE_OUT'),   -- lunch call
  ('SIM-4402', 'VT-D1-012', '2026-03-17 14:00:00', NULL, 'DATA'),       -- afternoon
  ('SIM-4402', 'VT-D1-012', '2026-03-17 18:30:00', 45,  'SMS_OUT'),     -- evening text
  ('SIM-4402', 'VT-D1-012', '2026-03-17 22:15:00', NULL, 'PING'),       -- still at tower 22:15
  ('SIM-4402', 'VT-D1-012', '2026-03-17 22:25:00', NULL, 'PING'),       -- 22:25 still at tower
  ('SIM-4402', 'VT-D2-047', '2026-03-17 22:55:00', NULL, 'PING'),       -- Thảo Điền! Left building
  ('SIM-4402', 'VT-D2-047', '2026-03-17 23:10:00', 120, 'VOICE_OUT'),   -- call from Thảo Điền
  ('SIM-4402', 'VT-D2-047', '2026-03-17 23:40:00', NULL, 'PING'),       -- *** 23:40 in Thảo Điền ***
  ('SIM-4402', 'VT-D2-047', '2026-03-17 23:55:00', NULL, 'DATA'),       -- still in D2

  -- Kai's phone (SIM-4401)
  ('SIM-4401', 'VT-D1-012', '2026-03-17 08:15:00', NULL, 'PING'),
  ('SIM-4401', 'VT-D1-012', '2026-03-17 14:00:00', 300, 'VOICE_OUT'),   -- long call
  ('SIM-4401', 'VT-D1-012', '2026-03-17 18:00:00', NULL, 'DATA'),
  ('SIM-4401', 'VT-D1-012', '2026-03-17 20:30:00', 60,  'VOICE_OUT'),   -- last call from Kai
  ('SIM-4401', 'VT-D1-012', '2026-03-17 21:00:00', NULL, 'PING'),       -- last ping at 21:00

  -- Andy (SIM-4403)
  ('SIM-4403', 'VT-D1-012', '2026-03-17 08:45:00', NULL, 'PING'),
  ('SIM-4403', 'VT-D1-012', '2026-03-17 19:00:00', NULL, 'DATA'),
  ('SIM-4403', 'VT-D1-012', '2026-03-17 22:00:00', 90,  'VOICE_OUT'),   -- call during party
  ('SIM-4403', 'VT-D1-012', '2026-03-17 23:15:00', NULL, 'PING'),       -- at tower during incident window
  ('SIM-4403', 'VT-D1-012', '2026-03-18 00:20:00', NULL, 'PING'),       -- still at tower after

  -- Bảo (SIM-4404) — at tower all evening
  ('SIM-4404', 'VT-D1-012', '2026-03-17 07:55:00', NULL, 'PING'),
  ('SIM-4404', 'VT-D1-012', '2026-03-17 20:00:00', NULL, 'PING'),
  ('SIM-4404', 'VT-D1-012', '2026-03-17 23:00:00', NULL, 'PING'),
  ('SIM-4404', 'VT-D1-012', '2026-03-18 00:10:00', NULL, 'PING'),

  -- Linh (SIM-4405)
  ('SIM-4405', 'VT-D1-012', '2026-03-17 09:00:00', NULL, 'PING'),
  ('SIM-4405', 'VT-D1-012', '2026-03-17 22:00:00', 200, 'VOICE_OUT'),   -- long call at party
  ('SIM-4405', 'VT-D1-012', '2026-03-17 23:00:00', NULL, 'PING'),       -- at tower
  ('SIM-4405', 'VT-D1-012', '2026-03-18 00:15:00', NULL, 'PING'),

  -- Sơn (SIM-4409)
  ('SIM-4409', 'VT-D1-012', '2026-03-17 09:30:00', NULL, 'PING'),
  ('SIM-4409', 'VT-D1-012', '2026-03-17 22:00:00', NULL, 'PING'),       -- at party
  ('SIM-4409', 'VT-TD-003', '2026-03-17 22:30:00', NULL, 'PING'),       -- Sơn left, Thủ Đức tower

  -- Trang (SIM-4407)
  ('SIM-4407', 'VT-D1-012', '2026-03-17 08:20:00', NULL, 'PING'),
  ('SIM-4407', 'VT-D1-012', '2026-03-17 22:00:00', NULL, 'PING'),
  ('SIM-4407', 'VT-D1-012', '2026-03-17 23:30:00', NULL, 'PING'),
  ('SIM-4407', 'VT-D1-012', '2026-03-18 00:30:00', NULL, 'PING');


-- ============================================================
-- TABLE 6: bank_transactions
-- Financial records linked via tax_no (from hr_directory).
-- Shows Phúc's suspicious offshore activity + Minh's normal finances.
-- ============================================================
CREATE TABLE bank_transactions (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  tax_no       TEXT NOT NULL,
  amount       REAL NOT NULL,
  currency     TEXT DEFAULT 'VND',
  counterparty TEXT,
  description  TEXT,
  ts_local     TEXT NOT NULL
);

INSERT INTO bank_transactions (tax_no, amount, currency, counterparty, description, ts_local) VALUES
  -- Minh (TX-7712445) — normal salary, rent, nothing suspicious
  ('TX-7712445',  45000000,  'VND', 'Oracle Labs Payroll',     'March salary',            '2026-03-01 09:00:00'),
  ('TX-7712445', -12000000,  'VND', 'Vinhomes Landlord',       'Rent D1 apartment',       '2026-03-05 10:00:00'),
  ('TX-7712445',  -850000,   'VND', 'Grab Vietnam',            'Monthly transport',       '2026-03-10 14:00:00'),
  ('TX-7712445',  -2100000,  'VND', 'Highland Coffee',         'Team coffees (expensed)', '2026-03-15 16:30:00'),

  -- Kai (TX-8839201) — normal but includes a large personal transfer
  ('TX-8839201',  85000000,  'VND', 'Oracle Labs Payroll',     'March salary',            '2026-03-01 09:00:00'),
  ('TX-8839201', -50000000,  'VND', 'VPBank Savings',          'Savings transfer',        '2026-03-10 11:00:00'),
  ('TX-8839201', -15000000,  'VND', 'Dr. Hạnh Lý',            'Medical consultation',    '2026-03-12 09:00:00'),
  ('TX-8839201',  -3500000,  'VND', 'Vietnam Airlines',        'Flight booking (personal)', '2026-03-14 20:00:00'),

  -- Andy (TX-6634890) — hides a suspicious wire
  ('TX-6634890',  65000000,  'VND', 'Oracle Labs Payroll',     'March salary',            '2026-03-01 09:00:00'),
  ('TX-6634890', -25000000,  'VND', 'Thảo Điền Villa Mortgage', 'Monthly mortgage',       '2026-03-05 10:00:00'),
  ('TX-6634890', 150000,     'USD', 'Meridian Consulting Ltd', 'Consulting fee received', '2026-03-08 03:00:00'),
  ('TX-6634890', -120000,    'USD', 'BVI Holdings Corp',       'Investment transfer',     '2026-03-09 04:00:00'),

  -- Phúc (TX-3312567) — OFFSHORE WIRE, suspicious
  ('TX-3312567', 250000,     'USD', 'Cayman Structured Fund',  'Return on investment',    '2026-03-01 02:00:00'),
  ('TX-3312567', -180000,    'USD', 'Meridian Consulting Ltd', 'Advisory retainer',       '2026-03-07 03:30:00'),
  ('TX-3312567', 500000,     'USD', 'Singapore Holdco Pte',    'Capital distribution',    '2026-03-15 04:00:00'),
  ('TX-3312567', -75000000,  'VND', 'Landmark 81 Penthouse',   'Property installment',    '2026-03-10 10:00:00'),

  -- Bảo (TX-5590123) — a suspicious cash deposit
  ('TX-5590123',  28000000,  'VND', 'Oracle Labs Payroll',     'March salary',            '2026-03-01 09:00:00'),
  ('TX-5590123',  50000000,  'VND', 'Cash Deposit',            'ATM deposit',             '2026-03-16 22:00:00'),
  ('TX-5590123',  -8000000,  'VND', 'Phú Mỹ Hưng Rent',       'Rent D7',                 '2026-03-05 10:00:00'),

  -- Trang (TX-2289901) — totally normal
  ('TX-2289901',  22000000,  'VND', 'Oracle Labs Payroll',     'March salary',            '2026-03-01 09:00:00'),
  ('TX-2289901',  -6500000,  'VND', 'D4 Apartment Rent',       'Monthly rent',            '2026-03-05 10:00:00'),
  ('TX-2289901',  -1200000,  'VND', 'The Coffee House',        'March coffees',           '2026-03-17 07:30:00');


-- ============================================================
-- TABLE 7: equity_ledger
-- Share ownership and dilution events. Shows MOTIVE for Minh.
-- ============================================================
CREATE TABLE equity_ledger (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  emp_id          TEXT NOT NULL,
  event_type      TEXT NOT NULL,
  shares          INTEGER NOT NULL,
  share_price_vnd REAL,
  dilution_pct    REAL,
  effective_date  TEXT NOT NULL,
  notes           TEXT
);

INSERT INTO equity_ledger (emp_id, event_type, shares, share_price_vnd, dilution_pct, effective_date, notes) VALUES
  ('E001', 'GRANT',    5000000, 10000, NULL,  '2019-01-15', 'Founder shares'),
  ('E002', 'GRANT',    2000000, 10000, NULL,  '2019-01-15', 'Co-founder CTO shares'),
  ('E003', 'GRANT',    2500000, 10000, NULL,  '2019-01-15', 'Co-founder COO shares'),
  ('E005', 'GRANT',     500000, 10000, NULL,  '2019-03-20', 'Early employee grant'),
  ('E006', 'GRANT',    1000000, 15000, NULL,  '2020-01-01', 'Board chair allocation'),

  -- Series B: everyone diluted
  ('E001', 'DILUTION', 5000000, 25000, -15.0, '2024-06-01', 'Series B — all founders diluted 15%'),
  ('E002', 'DILUTION', 2000000, 25000, -15.0, '2024-06-01', 'Series B dilution'),
  ('E003', 'DILUTION', 2500000, 25000, -15.0, '2024-06-01', 'Series B dilution'),

  -- *** THE MOTIVE: Minh about to lose 40% of remaining shares ***
  ('E002', 'DILUTION', 1700000, 25000, -40.0, '2026-04-01', 'Board-approved restructuring — CTO diluted 40%. Effective after launch.'),

  -- Andy gaining shares (suspicious in hindsight)
  ('E003', 'GRANT',     800000, 25000, NULL,  '2026-02-15', 'Performance bonus — board approved'),

  -- Sơn's tiny grant
  ('E009', 'GRANT',      50000, 25000, NULL,  '2025-01-15', 'New hire equity');


-- ============================================================
-- TABLE 8: hr_actions
-- Scheduled HR events. Shows Minh's TERMINATION is imminent.
-- ============================================================
CREATE TABLE hr_actions (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  emp_id         TEXT NOT NULL,
  action_type    TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  status         TEXT DEFAULT 'PENDING',
  initiated_by   TEXT,
  notes          TEXT
);

INSERT INTO hr_actions (emp_id, action_type, scheduled_date, status, initiated_by, notes) VALUES
  ('E002', 'TERMINATION',        '2026-03-20', 'PENDING',   'E001', 'CTO removal — board decision. Effective after product launch. Do not notify before 03-18.'),
  ('E002', 'EQUITY_CLAWBACK',    '2026-03-20', 'PENDING',   'E006', 'Unvested shares returned per separation agreement'),
  ('E009', 'PROBATION_REVIEW',   '2026-03-25', 'PENDING',   'E002', '6-month review'),
  ('E014', 'ANNUAL_REVIEW',      '2026-04-01', 'SCHEDULED', 'E003', 'Standard annual review'),
  ('E017', 'PROMOTION',          '2026-04-15', 'PENDING',   'E002', 'ML Engineer → Senior ML Engineer'),
  ('E005', 'ROLE_CHANGE',        '2026-04-01', 'PENDING',   'E001', 'Head of Product → VP Product'),
  ('E010', 'ANNUAL_REVIEW',      '2026-04-01', 'SCHEDULED', 'E002', 'Standard annual review');


-- ============================================================
-- TABLE 9: system_events
-- Application login/logout events. ts_local is GMT+7.
-- KEY: Kai's last logout at 21:00 establishes the death window.
-- ============================================================
CREATE TABLE system_events (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  event    TEXT NOT NULL CHECK (event IN ('LOGIN', 'LOGOUT', 'SESSION_TIMEOUT', 'PASSWORD_RESET', 'MFA_VERIFY')),
  app      TEXT NOT NULL,
  ts_local TEXT NOT NULL
);

INSERT INTO system_events (username, event, app, ts_local) VALUES
  -- Morning logins
  ('kai.dang',    'LOGIN',  'THEIA-Admin',    '2026-03-17 08:20:00'),
  ('kai.dang',    'LOGIN',  'Slack',          '2026-03-17 08:22:00'),
  ('minh.tran',   'LOGIN',  'GitLab',         '2026-03-17 08:35:00'),
  ('minh.tran',   'LOGIN',  'Slack',          '2026-03-17 08:36:00'),
  ('andy.le',     'LOGIN',  'Slack',          '2026-03-17 08:50:00'),
  ('andy.le',     'LOGIN',  'Finance-Portal', '2026-03-17 08:52:00'),
  ('son.phan',    'LOGIN',  'GitLab',         '2026-03-17 09:35:00'),
  ('thao.dinh',   'LOGIN',  'GitLab',         '2026-03-17 09:20:00'),
  ('trang.vu',    'LOGIN',  'Calendar',       '2026-03-17 08:25:00'),

  -- Afternoon activity
  ('kai.dang',    'LOGIN',  'Finance-Portal', '2026-03-17 14:00:00'),
  ('kai.dang',    'LOGOUT', 'Finance-Portal', '2026-03-17 14:30:00'),
  ('minh.tran',   'LOGIN',  'THEIA-Admin',    '2026-03-17 14:15:00'),
  ('minh.tran',   'LOGOUT', 'THEIA-Admin',    '2026-03-17 15:00:00'),

  -- Evening
  ('andy.le',     'LOGOUT', 'Finance-Portal', '2026-03-17 17:30:00'),
  ('trang.vu',    'LOGOUT', 'Calendar',       '2026-03-17 17:00:00'),

  -- *** KAI'S LAST LOGOUT — 21:00 local ***
  ('kai.dang',    'LOGOUT', 'THEIA-Admin',    '2026-03-17 21:00:00'),
  ('kai.dang',    'LOGOUT', 'Slack',          '2026-03-17 21:00:00'),

  -- Minh logs out before leaving
  ('minh.tran',   'LOGOUT', 'GitLab',         '2026-03-17 22:10:00'),
  ('minh.tran',   'LOGOUT', 'Slack',          '2026-03-17 22:12:00'),

  -- Sơn still working late
  ('son.phan',    'LOGOUT', 'GitLab',         '2026-03-17 21:30:00'),

  -- Late-night: Sơn briefly reconnects (from home?)
  ('son.phan',    'LOGIN',  'GitLab',         '2026-03-17 23:45:00'),
  ('son.phan',    'LOGOUT', 'GitLab',         '2026-03-18 00:05:00');


-- ============================================================
-- TABLE 10: theia_call_log
-- THEIA system logs. The emergency call at 23:47.
-- ============================================================
CREATE TABLE theia_call_log (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  event          TEXT NOT NULL,
  target         TEXT,
  trigger_source TEXT,
  ts_local       TEXT NOT NULL,
  notes          TEXT
);

INSERT INTO theia_call_log (event, target, trigger_source, ts_local, notes) VALUES
  ('SYSTEM_START',    NULL,        'boot',           '2026-03-17 06:00:00', 'Daily system initialization'),
  ('MODEL_LOAD',      'THEIA-v3',  'scheduler',      '2026-03-17 06:01:00', 'Production model loaded'),
  ('HEALTH_CHECK',    NULL,        'cron',           '2026-03-17 12:00:00', 'All systems nominal'),
  ('HEALTH_CHECK',    NULL,        'cron',           '2026-03-17 18:00:00', 'All systems nominal'),
  ('ANOMALY_DETECT',  NULL,        'sensor_array',   '2026-03-17 23:44:00', 'Anomaly detected: floor 41 biometric sensor — no heartbeat signal'),
  ('ANOMALY_DETECT',  NULL,        'sensor_array',   '2026-03-17 23:45:00', 'Anomaly confirmed: floor 41 office 4101 — vital signs absent'),
  ('EMERGENCY_CALL',  '113',       'theia_protocol', '2026-03-17 23:47:00', 'Automated emergency call placed to 113. Report: death in office 4101, floor 41.'),
  ('SYSTEM_LOCK',     'floor_41',  'security',       '2026-03-17 23:48:00', 'Floor 41 access locked by security protocol');


-- ============================================================
-- TABLE 11: security_admin_log
-- Security system admin actions. Shows Bảo has badge clone rights.
-- ============================================================
CREATE TABLE security_admin_log (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_emp_id  TEXT NOT NULL,
  action        TEXT NOT NULL,
  target_badge  TEXT,
  target_floor  TEXT,
  ts_local      TEXT NOT NULL,
  notes         TEXT
);

INSERT INTO security_admin_log (admin_emp_id, action, target_badge, target_floor, ts_local, notes) VALUES
  ('E004', 'BADGE_CLONE_AUTHORIZED',  'B-1002',  NULL,  '2026-03-15 14:00:00', 'Duplicate badge request — approved by security head'),
  ('E004', 'BADGE_CLONE_COMPLETED',   'B-1002',  NULL,  '2026-03-15 14:30:00', 'Clone issued. Original remains active.'),
  ('E004', 'FLOOR_ACCESS_OVERRIDE',   NULL,       '41', '2026-03-17 20:30:00', 'Temporary override: maintenance access floor 41'),
  ('E004', 'CAMERA_MAINTENANCE',      NULL,       '41', '2026-03-17 20:32:00', 'Camera system floor 41 — scheduled maintenance mode (30min)'),
  ('E004', 'CAMERA_RESTORE',          NULL,       '41', '2026-03-17 21:05:00', 'Camera system floor 41 — restored to normal'),
  ('E015', 'GUARD_SHIFT_START',       NULL,       NULL, '2026-03-17 18:00:00', 'Night shift started'),
  ('E016', 'GUARD_SHIFT_START',       NULL,       NULL, '2026-03-17 18:00:00', 'Night shift started'),
  ('E004', 'INCIDENT_REPORT_FILED',   NULL,       '41', '2026-03-18 00:15:00', 'Incident report: death on floor 41, office 4101');


-- ============================================================
-- TABLE 12: calendar_audit
-- Meeting room bookings + audit trail. Shows Trang edited the schedule.
-- ============================================================
CREATE TABLE calendar_audit (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  room         TEXT NOT NULL,
  organizer    TEXT NOT NULL,
  title        TEXT,
  start_time   TEXT NOT NULL,
  end_time     TEXT NOT NULL,
  created_by   TEXT NOT NULL,
  created_at   TEXT NOT NULL,
  edited_by    TEXT,
  edit_ts      TEXT,
  edit_reason  TEXT
);

INSERT INTO calendar_audit (room, organizer, title, start_time, end_time, created_by, created_at, edited_by, edit_ts, edit_reason) VALUES
  ('41-Board',    'E001', 'Product Launch Final Review',      '2026-03-17 10:00:00', '2026-03-17 11:30:00', 'E007', '2026-03-14 09:00:00', NULL,   NULL, NULL),
  ('39-Event',    'E003', 'THEIA Launch Party',               '2026-03-17 18:00:00', '2026-03-18 00:00:00', 'E003', '2026-03-01 10:00:00', NULL,   NULL, NULL),
  ('41-Office',   'E001', 'Private — do not disturb',         '2026-03-17 19:00:00', '2026-03-17 23:59:00', 'E001', '2026-03-16 16:00:00', 'E007', '2026-03-17 17:45:00', 'Extended end time per CEO request'),
  ('38-Standup',  'E002', 'Engineering standup',               '2026-03-17 09:30:00', '2026-03-17 10:00:00', 'E002', '2026-03-10 08:00:00', NULL,   NULL, NULL),
  ('41-Board',    'E001', 'Kai + Minh — restructuring discussion', '2026-03-17 14:00:00', '2026-03-17 15:00:00', 'E007', '2026-03-15 11:00:00', NULL, NULL, NULL),
  ('41-Office',   'E001', 'CANCELLED — Kai solo session',      '2026-03-17 21:00:00', '2026-03-17 22:00:00', 'E007', '2026-03-16 17:00:00', 'E007', '2026-03-17 20:50:00', 'Cancelled by EA — CEO said he was done for the night');


-- ============================================================
-- TABLE 13: parking_gate
-- Vehicle entry/exit. Minh's car exits at 22:28 (corroborates alibi).
-- ============================================================
CREATE TABLE parking_gate (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  plate     TEXT NOT NULL,
  owner     TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('ENTER', 'EXIT')),
  ts_local  TEXT NOT NULL
);

INSERT INTO parking_gate (plate, owner, direction, ts_local) VALUES
  ('51A-123.45', 'Kai Đặng',    'ENTER', '2026-03-17 08:12:00'),
  ('51A-678.90', 'Minh Trần',   'ENTER', '2026-03-17 08:28:00'),
  ('51A-234.56', 'Andy Lê',     'ENTER', '2026-03-17 08:42:00'),
  ('51A-345.67', 'Bảo Nguyễn',  'ENTER', '2026-03-17 07:50:00'),
  ('51A-456.78', 'Linh Phạm',   'ENTER', '2026-03-17 08:58:00'),
  ('51A-567.89', 'Đạt Trương',  'ENTER', '2026-03-17 08:48:00'),
  ('51A-789.01', 'Thảo Đinh',   'ENTER', '2026-03-17 09:13:00'),

  -- Evening departures
  ('51A-567.89', 'Đạt Trương',  'EXIT',  '2026-03-17 19:05:00'),
  ('51A-789.01', 'Thảo Đinh',   'EXIT',  '2026-03-17 18:08:00'),
  ('51A-678.90', 'Minh Trần',   'EXIT',  '2026-03-17 22:28:00'),  -- *** Minh leaves at 22:28 ***

  -- Late night (after incident)
  ('51A-234.56', 'Andy Lê',     'EXIT',  '2026-03-18 00:25:00'),
  ('51A-456.78', 'Linh Phạm',   'EXIT',  '2026-03-18 00:18:00'),
  ('51A-345.67', 'Bảo Nguyễn',  'EXIT',  '2026-03-18 01:30:00');
  -- Note: Kai's car never exits the garage.


-- ============================================================
-- TABLE 14: wifi_sessions  🟥 DECOY-TRAP
-- Wireless access point connections. Minh's laptop still connected
-- to floor 41 AP at 23:40 — but a device is not a person!
-- ============================================================
CREATE TABLE wifi_sessions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  mac_addr   TEXT NOT NULL,
  ap_name    TEXT NOT NULL,
  ap_floor   INTEGER NOT NULL,
  connect_ts TEXT NOT NULL,
  disconnect_ts TEXT,
  bytes_tx   INTEGER DEFAULT 0
);

INSERT INTO wifi_sessions (mac_addr, ap_name, ap_floor, connect_ts, disconnect_ts, bytes_tx) VALUES
  -- Minh's laptop (AA:BB:CC:02:02:02) — THE TRAP
  ('AA:BB:CC:02:02:02', 'OL-AP-38-A',  38, '2026-03-17 08:33:00', '2026-03-17 14:58:00', 524288000),
  ('AA:BB:CC:02:02:02', 'OL-AP-41-A',  41, '2026-03-17 15:03:00', NULL,                   15728640),
  -- *** Minh's laptop STILL on floor 41 wifi — never disconnected ***
  -- *** But Minh himself left at 22:28. Device ≠ person. ***

  -- Kai's laptop — disconnects at 21:00 (matches system logout)
  ('AA:BB:CC:01:01:01', 'OL-AP-41-A',  41, '2026-03-17 08:18:00', '2026-03-17 21:00:00', 1073741824),

  -- Other engineers
  ('AA:BB:CC:09:09:09', 'OL-AP-38-A',  38, '2026-03-17 09:33:00', '2026-03-17 21:30:00', 268435456),
  ('AA:BB:CC:10:10:10', 'OL-AP-38-A',  38, '2026-03-17 09:18:00', '2026-03-17 18:00:00', 419430400),
  ('AA:BB:CC:11:11:11', 'OL-AP-38-A',  38, '2026-03-17 09:23:00', '2026-03-17 18:30:00', 335544320),
  ('AA:BB:CC:13:13:13', 'OL-AP-38-A',  38, '2026-03-17 08:53:00', '2026-03-17 19:00:00', 503316480),
  ('AA:BB:CC:17:17:17', 'OL-AP-38-A',  38, '2026-03-17 09:00:00', '2026-03-17 20:00:00', 167772160),

  -- Andy's laptop on party floor
  ('AA:BB:CC:03:03:03', 'OL-AP-40-A',  40, '2026-03-17 08:48:00', '2026-03-17 17:30:00', 209715200),
  ('AA:BB:CC:03:03:03', 'OL-AP-39-A',  39, '2026-03-17 17:33:00', '2026-03-18 00:20:00', 52428800),

  -- Linh
  ('AA:BB:CC:05:05:05', 'OL-AP-35-A',  35, '2026-03-17 09:03:00', '2026-03-17 17:15:00', 314572800),
  ('AA:BB:CC:05:05:05', 'OL-AP-39-A',  39, '2026-03-17 17:18:00', '2026-03-18 00:12:00', 41943040);


-- ============================================================
-- TABLE 15: helpdesk_tickets  🟥 NOISE (motive bait)
-- IT support tickets. Contains a "Minh vs Kai" dispute ticket.
-- ============================================================
CREATE TABLE helpdesk_tickets (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  emp_id      TEXT NOT NULL,
  subject     TEXT NOT NULL,
  category    TEXT,
  priority    TEXT DEFAULT 'NORMAL',
  status      TEXT DEFAULT 'OPEN',
  created_at  TEXT NOT NULL,
  resolved_at TEXT,
  notes       TEXT
);

INSERT INTO helpdesk_tickets (emp_id, subject, category, priority, status, created_at, resolved_at, notes) VALUES
  ('E002', 'Access revoked to THEIA-Admin without notice',    'ACCESS',   'HIGH',   'ESCALATED', '2026-03-10 09:00:00', NULL, 'CTO reports losing admin access to the product he built. Escalated to CEO.'),
  ('E002', 'Dispute: unauthorized share dilution proposal',   'HR/LEGAL', 'URGENT', 'ESCALATED', '2026-03-12 14:00:00', NULL, 'CTO disputes board restructuring. Kai and Minh in heated disagreement. Legal involved.'),
  ('E009', 'GitLab permissions — need access to theia-core',  'ACCESS',   'NORMAL', 'RESOLVED',  '2026-03-05 10:00:00', '2026-03-05 14:00:00', 'Junior eng needed repo access. Approved by CTO.'),
  ('E010', 'Monitor flickering on desk 38-12',                'HARDWARE', 'LOW',    'RESOLVED',  '2026-03-08 11:00:00', '2026-03-09 16:00:00', 'Replaced monitor.'),
  ('E007', 'Calendar sync issues with CEO account',           'SOFTWARE', 'NORMAL', 'RESOLVED',  '2026-03-13 09:00:00', '2026-03-13 12:00:00', 'Reconfigured CalDAV sync.'),
  ('E013', 'CI/CD pipeline timeout on theia-deploy',          'DEVOPS',   'HIGH',   'RESOLVED',  '2026-03-14 16:00:00', '2026-03-15 10:00:00', 'Increased runner timeout. Root cause: large model artifact.'),
  ('E017', 'GPU allocation request for training cluster',     'INFRA',    'NORMAL', 'OPEN',      '2026-03-16 09:00:00', NULL, 'Needs 4x A100 for fine-tuning run.'),
  ('E005', 'Product analytics dashboard not loading',         'SOFTWARE', 'HIGH',   'RESOLVED',  '2026-03-11 14:00:00', '2026-03-11 17:00:00', 'Postgres connection pool exhausted. Fixed.'),
  ('E004', 'Request: badge duplication for VIP guest access',  'SECURITY', 'NORMAL', 'RESOLVED',  '2026-03-15 13:00:00', '2026-03-15 15:00:00', 'Security head self-approved. Badge B-1002 duplicated.');


-- ============================================================
-- TABLE 16: printer_jobs  🟥 NOISE
-- Print queue logs. A resignation letter is a red herring.
-- ============================================================
CREATE TABLE printer_jobs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  emp_id     TEXT NOT NULL,
  printer    TEXT NOT NULL,
  doc_name   TEXT NOT NULL,
  pages      INTEGER DEFAULT 1,
  ts_local   TEXT NOT NULL,
  status     TEXT DEFAULT 'COMPLETED'
);

INSERT INTO printer_jobs (emp_id, printer, doc_name, pages, ts_local, status) VALUES
  ('E002', 'PR-38-01', 'Resignation_Final_Draft.docx',         3,  '2026-03-16 23:15:00', 'COMPLETED'),
  ('E002', 'PR-38-01', 'THEIA_Architecture_v3.pdf',            28, '2026-03-16 14:00:00', 'COMPLETED'),
  ('E001', 'PR-41-01', 'Board_Restructuring_Proposal.pdf',     12, '2026-03-15 16:00:00', 'COMPLETED'),
  ('E007', 'PR-41-01', 'Launch_Night_Run_of_Show.docx',        5,  '2026-03-17 09:00:00', 'COMPLETED'),
  ('E003', 'PR-40-01', 'Q1_Financial_Summary.xlsx',            8,  '2026-03-16 11:00:00', 'COMPLETED'),
  ('E019', 'PR-40-01', 'Oracle_Labs_Tax_Filing_2025.pdf',      45, '2026-03-14 10:00:00', 'COMPLETED'),
  ('E005', 'PR-35-01', 'THEIA_Product_Roadmap_2026.pdf',       15, '2026-03-12 14:00:00', 'COMPLETED'),
  ('E022', 'PR-40-01', 'Employment_Agreement_Template.docx',   6,  '2026-03-13 09:00:00', 'COMPLETED'),
  ('E009', 'PR-38-01', 'son_notes_whistleblower_draft.txt',    2,  '2026-03-16 22:00:00', 'COMPLETED'),
  ('E012', 'PR-38-01', 'Anomaly_Detection_Model_Results.pdf',  18, '2026-03-15 15:00:00', 'COMPLETED');


-- ============================================================
-- TABLE 17: visitor_registry  🟥 DECOY
-- External visitors. A mysterious visitor is a red herring.
-- ============================================================
CREATE TABLE visitor_registry (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_name TEXT NOT NULL,
  company      TEXT,
  host_emp_id  TEXT NOT NULL,
  purpose      TEXT,
  check_in     TEXT NOT NULL,
  check_out    TEXT,
  badge_temp   TEXT
);

INSERT INTO visitor_registry (visitor_name, company, host_emp_id, purpose, check_in, check_out, badge_temp) VALUES
  ('Nguyễn Văn Hải',   'VNG Corporation',      'E003', 'Partnership discussion',    '2026-03-17 10:00:00', '2026-03-17 11:30:00', 'VIS-001'),
  ('Lê Thị Thanh',     'Mekong Capital',        'E006', 'Board pre-meeting',         '2026-03-17 09:00:00', '2026-03-17 12:00:00', 'VIS-002'),
  ('Đặng Kiên',        'Personal',              'E001', 'Family visit',              '2026-03-17 13:00:00', '2026-03-17 14:00:00', 'VIS-003'),
  ('Trần Minh Quân',   'Deloitte Vietnam',      'E019', 'Audit preparation',         '2026-03-17 14:00:00', '2026-03-17 17:00:00', 'VIS-004'),
  ('Unknown — refused', NULL,                    'E004', 'Would not state. Security.', '2026-03-17 19:30:00', '2026-03-17 20:00:00', 'VIS-005'),
  ('Phạm Đức Anh',     'FPT Software',          'E013', 'Infrastructure review',     '2026-03-16 10:00:00', '2026-03-16 16:00:00', 'VIS-006');


-- ============================================================
-- TABLE 18: git_activity  🟥 NOISE
-- Code commits. An engineer committing at 23:50 is irrelevant.
-- ============================================================
CREATE TABLE git_activity (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  emp_id     TEXT NOT NULL,
  repo       TEXT NOT NULL,
  branch     TEXT,
  commit_msg TEXT,
  additions  INTEGER DEFAULT 0,
  deletions  INTEGER DEFAULT 0,
  commit_ts  TEXT NOT NULL
);

INSERT INTO git_activity (emp_id, repo, branch, commit_msg, additions, deletions, commit_ts) VALUES
  ('E002', 'theia-core',     'main',           'fix: model inference timeout handling',     45,  12, '2026-03-17 16:30:00'),
  ('E002', 'theia-core',     'main',           'refactor: prediction pipeline batching',   128,  67, '2026-03-17 18:00:00'),
  ('E009', 'theia-core',     'feat/logging',   'feat: add structured logging to API layer', 89,   3, '2026-03-17 20:00:00'),
  ('E009', 'theia-core',     'feat/logging',   'test: logging integration tests',           56,   0, '2026-03-17 21:15:00'),
  ('E009', 'theia-core',     'feat/logging',   'fix: log rotation config',                  12,   4, '2026-03-17 23:50:00'),
  ('E010', 'theia-dashboard', 'main',          'style: launch night UI polish',             34,  18, '2026-03-17 17:30:00'),
  ('E013', 'theia-deploy',   'main',           'ops: update k8s manifest for launch',       22,   8, '2026-03-17 16:00:00'),
  ('E011', 'theia-api',      'main',           'feat: rate limiting middleware',             78,  23, '2026-03-17 17:00:00'),
  ('E017', 'theia-ml',       'experiment/v4',  'experiment: fine-tune with new dataset',   312,  45, '2026-03-17 19:30:00'),
  ('E012', 'theia-analytics', 'main',          'feat: anomaly scoring pipeline',           145,  32, '2026-03-17 15:00:00');


-- ============================================================
-- TABLE 19: cafeteria_purchases  🟥 NOISE
-- Snack bar / vending machine transactions. Pure color.
-- ============================================================
CREATE TABLE cafeteria_purchases (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  emp_id   TEXT NOT NULL,
  item     TEXT NOT NULL,
  amount   INTEGER NOT NULL,
  ts_local TEXT NOT NULL
);

INSERT INTO cafeteria_purchases (emp_id, item, amount, ts_local) VALUES
  ('E001', 'Cà phê sữa đá',          35000,  '2026-03-17 08:25:00'),
  ('E001', 'Bánh mì thịt',            45000,  '2026-03-17 12:10:00'),
  ('E002', 'Trà đá',                  10000,  '2026-03-17 08:40:00'),
  ('E002', 'Phở bò',                  55000,  '2026-03-17 12:30:00'),
  ('E002', 'Monster Energy',          38000,  '2026-03-17 20:15:00'),
  ('E003', 'Espresso double shot',    55000,  '2026-03-17 09:00:00'),
  ('E009', 'Bún bò Huế',             50000,  '2026-03-17 12:00:00'),
  ('E009', 'Cà phê đen đá',          25000,  '2026-03-17 19:30:00'),
  ('E009', 'Mì gói (emergency fuel)', 15000,  '2026-03-17 22:30:00'),
  ('E010', 'Sinh tố bơ',             40000,  '2026-03-17 10:00:00'),
  ('E013', 'Red Bull',                30000,  '2026-03-17 15:00:00'),
  ('E007', 'Trà sen vàng',           42000,  '2026-03-17 08:30:00'),
  ('E007', 'Champagne (launch)',      850000, '2026-03-17 18:30:00'),
  ('E005', 'Matcha latte',            48000,  '2026-03-17 09:10:00'),
  ('E017', 'Cà phê trứng',           45000,  '2026-03-17 09:15:00'),
  ('E004', 'Nước suối',              10000,  '2026-03-17 08:00:00'),
  ('E004', 'Cơm tấm',               50000,  '2026-03-17 12:00:00');


-- ============================================================
-- TABLE 20: hvac_sensors  🟥 NOISE
-- Temperature and humidity sensors. Pure filler, no signal.
-- ============================================================
CREATE TABLE hvac_sensors (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  floor      INTEGER NOT NULL,
  zone       TEXT NOT NULL,
  temp_c     REAL NOT NULL,
  humidity   REAL NOT NULL,
  co2_ppm    INTEGER,
  ts_local   TEXT NOT NULL
);

INSERT INTO hvac_sensors (floor, zone, temp_c, humidity, co2_ppm, ts_local) VALUES
  (41, 'Office-4101',  23.2, 62, 420, '2026-03-17 08:00:00'),
  (41, 'Office-4101',  23.5, 61, 450, '2026-03-17 12:00:00'),
  (41, 'Office-4101',  24.1, 58, 480, '2026-03-17 16:00:00'),
  (41, 'Office-4101',  23.8, 60, 510, '2026-03-17 20:00:00'),
  (41, 'Office-4101',  22.9, 63, 490, '2026-03-17 23:00:00'),
  (41, 'Office-4101',  22.4, 65, 440, '2026-03-18 00:00:00'),
  (38, 'Eng-Open',     22.0, 55, 620, '2026-03-17 10:00:00'),
  (38, 'Eng-Open',     22.8, 53, 680, '2026-03-17 14:00:00'),
  (38, 'Eng-Open',     21.5, 58, 520, '2026-03-17 20:00:00'),
  (39, 'Event-Hall',   21.0, 50, 380, '2026-03-17 16:00:00'),
  (39, 'Event-Hall',   24.5, 68, 850, '2026-03-17 20:00:00'),
  (39, 'Event-Hall',   25.2, 72, 920, '2026-03-17 22:00:00'),
  (39, 'Event-Hall',   25.8, 74, 980, '2026-03-17 23:00:00'),
  (39, 'Event-Hall',   24.0, 65, 600, '2026-03-18 00:00:00'),
  (2,  'Security-Ops', 23.0, 55, 400, '2026-03-17 08:00:00'),
  (2,  'Security-Ops', 23.0, 55, 410, '2026-03-17 20:00:00'),
  (1,  'Lobby',        24.5, 60, 380, '2026-03-17 08:00:00'),
  (1,  'Lobby',        25.0, 62, 450, '2026-03-17 20:00:00');
