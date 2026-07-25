-- TE2SR — lược đồ D1 THỰC TẾ (te2sr-db)
-- CẢNH BÁO: DB đã có dữ liệu. KHÔNG chạy DROP. File này chỉ để tham khảo/tái tạo.

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

CREATE TABLE IF NOT EXISTS orders (
  id                 TEXT PRIMARY KEY,
  user_id            TEXT,
  app_name           TEXT NOT NULL,
  client_email       TEXT NOT NULL,
  platform           TEXT NOT NULL DEFAULT 'Both',
  service_type       TEXT NOT NULL DEFAULT 'Testing',
  status             TEXT NOT NULL DEFAULT 'Pending',
  target_countries   TEXT NOT NULL DEFAULT '[]',
  testing_url        TEXT,
  details            TEXT,
  package_price      INTEGER,
  package_slug       TEXT,
  paid_deposit       INTEGER NOT NULL DEFAULT 0,
  paid_final         INTEGER NOT NULL DEFAULT 0,
  testing_started_at TEXT,
  created_at         TEXT NOT NULL,
  updated_at         TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_messages (
  id          TEXT PRIMARY KEY,
  order_id    TEXT NOT NULL,
  sender_id   TEXT,
  sender_name TEXT NOT NULL,
  role        TEXT NOT NULL,
  text        TEXT NOT NULL,
  created_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_created ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_email   ON orders (client_email);
