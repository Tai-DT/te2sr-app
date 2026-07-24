-- ══════════════════════════════════════════════════════════════
--  TE2SR — MySQL 8 schema (Aiven)
--  Apply:  npm run db:init
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS users (
  id            VARCHAR(64)  NOT NULL,
  name          VARCHAR(191) NOT NULL,
  email         VARCHAR(191) NOT NULL,
  password_hash VARCHAR(255) NULL,
  `role`        VARCHAR(16)  NOT NULL DEFAULT 'client',
  avatar        TEXT         NULL,
  auth_provider VARCHAR(32)  NOT NULL DEFAULT 'password',
  created_at    VARCHAR(32)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id               VARCHAR(64)  NOT NULL,
  user_id          VARCHAR(64)  NULL,
  app_name         VARCHAR(255) NOT NULL,
  client_email     VARCHAR(191) NOT NULL,
  platform         VARCHAR(16)  NOT NULL DEFAULT 'Both',
  service_type     VARCHAR(32)  NOT NULL DEFAULT 'Testing',
  status           VARCHAR(24)  NOT NULL DEFAULT 'Pending',
  target_countries TEXT         NOT NULL,
  testing_url      TEXT         NULL,
  details          TEXT         NULL,
  package_price    INT          NULL,
  paid_deposit     TINYINT(1)   NOT NULL DEFAULT 0,
  paid_final       TINYINT(1)   NOT NULL DEFAULT 0,
  created_at       VARCHAR(32)  NOT NULL,
  updated_at       VARCHAR(32)  NOT NULL,
  PRIMARY KEY (id),
  KEY idx_orders_user (user_id),
  KEY idx_orders_email (client_email),
  KEY idx_orders_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_messages (
  id          VARCHAR(80)  NOT NULL,
  order_id    VARCHAR(64)  NOT NULL,
  sender_id   VARCHAR(64)  NULL,
  sender_name VARCHAR(191) NOT NULL,
  `role`      VARCHAR(16)  NOT NULL,
  `text`      TEXT         NOT NULL,
  created_at  VARCHAR(32)  NOT NULL,
  PRIMARY KEY (id),
  KEY idx_msg_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS design_reports (
  id                  VARCHAR(64)  NOT NULL,
  user_id             VARCHAR(64)  NULL,
  file_name           VARCHAR(255) NOT NULL,
  score               INT          NOT NULL,
  layout_score        INT          NOT NULL,
  typography_score    INT          NOT NULL,
  contrast_score      INT          NOT NULL,
  accessibility_score INT          NOT NULL,
  suggestions         TEXT         NOT NULL,
  created_at          VARCHAR(32)  NOT NULL,
  PRIMARY KEY (id),
  KEY idx_reports_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Demo seed orders (so the admin dashboard isn't empty) ──────
INSERT IGNORE INTO orders
  (id, user_id, app_name, client_email, platform, service_type, status, target_countries, details, package_price, paid_deposit, paid_final, created_at, updated_at)
VALUES
  ('ORD-8921', NULL, 'CryptoPulse Trading Pro', 'dev@cryptopulse.io', 'Both', 'Publishing', 'In Progress', '["USA","Vietnam","Japan"]', 'Full publishing setup for iOS App Store and Google Play with ASO metadata optimization.', 100, 1, 0, '2026-07-22T09:00:00.000Z', '2026-07-22T09:00:00.000Z'),
  ('ORD-8922', NULL, 'ZenFit Yoga & Meditate', 'support@zenfitapp.com', 'iOS', 'Promotion_5Star', 'In Progress', '["Korea","USA","Germany"]', '10 localized 5-star reviews campaign bundled with publishing.', 100, 1, 0, '2026-07-21T09:00:00.000Z', '2026-07-21T09:00:00.000Z'),
  ('ORD-8923', NULL, 'SpeedyDelivery Partner', 'qa@speedydelivery.vn', 'Android', 'Testing', 'Completed', '["Vietnam"]', '12-tester / 14-day closed testing coverage & crash profiling report generated.', 50, 1, 1, '2026-07-19T09:00:00.000Z', '2026-07-19T09:00:00.000Z'),
  ('ORD-8924', NULL, 'Artisan Photo Studio AI', 'design@artisanphoto.com', 'Both', 'DesignAnalyzer', 'Completed', '["Worldwide"]', 'Automated AI UI/UX visual inspection & Apple HIG compliance check.', 100, 1, 1, '2026-07-18T09:00:00.000Z', '2026-07-18T09:00:00.000Z');
