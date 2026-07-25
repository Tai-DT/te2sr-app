-- ══════════════════════════════════════════════════════════════
--  TE2SR — Cloudflare D1 (SQLite) schema
--  Local:  npm run db:init
--  Remote: npm run db:init:remote
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  role          TEXT NOT NULL DEFAULT 'client',
  avatar        TEXT,
  auth_provider TEXT NOT NULL DEFAULT 'password',
  created_at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS orders (
  id               TEXT PRIMARY KEY,
  user_id          TEXT,
  app_name         TEXT NOT NULL,
  client_email     TEXT NOT NULL,
  platform         TEXT NOT NULL DEFAULT 'Both',
  service_type     TEXT NOT NULL DEFAULT 'Testing',
  status           TEXT NOT NULL DEFAULT 'Pending',
  target_countries TEXT NOT NULL DEFAULT '[]',
  testing_url      TEXT,
  details          TEXT,
  package_price    INTEGER,
  paid_deposit     INTEGER NOT NULL DEFAULT 0,
  paid_final       INTEGER NOT NULL DEFAULT 0,
  testing_started_at TEXT,
  created_at       TEXT NOT NULL,
  updated_at       TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(client_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE TABLE IF NOT EXISTS order_messages (
  id          TEXT PRIMARY KEY,
  order_id    TEXT NOT NULL,
  sender_id   TEXT,
  sender_name TEXT NOT NULL,
  role        TEXT NOT NULL,
  text        TEXT NOT NULL,
  created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_msg_order ON order_messages(order_id);

CREATE TABLE IF NOT EXISTS design_reports (
  id                  TEXT PRIMARY KEY,
  user_id             TEXT,
  file_name           TEXT NOT NULL,
  score               INTEGER NOT NULL,
  layout_score        INTEGER NOT NULL,
  typography_score    INTEGER NOT NULL,
  contrast_score      INTEGER NOT NULL,
  accessibility_score INTEGER NOT NULL,
  suggestions         TEXT NOT NULL,
  created_at          TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_reports_user ON design_reports(user_id);

-- Demo seed orders so the admin dashboard isn't empty
-- Dữ liệu demo đã được gỡ: 4 đơn mẫu làm sai doanh thu ở trang quản trị.
-- Giới hạn tần suất. Đếm tập trung ở D1 vì binding ratelimit của Workers chỉ
-- đếm cục bộ trên từng máy nên không chặn được tấn công rải đều.
CREATE TABLE IF NOT EXISTS rate_limits (
  key      TEXT PRIMARY KEY,
  count    INTEGER NOT NULL,
  reset_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset ON rate_limits(reset_at);
