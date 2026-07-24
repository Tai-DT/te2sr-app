// ══════════════════════════════════════════════════════════════
//  Connectivity check — verifies the DB connection without leaking
//  credentials. Usage: npm run db:ping
// ══════════════════════════════════════════════════════════════

import { pool } from './pool';
import { config } from './config';

const url = new URL(config.databaseUrl);

async function main() {
  const started = Date.now();
  const [rows] = await pool.query('SELECT VERSION() AS version');
  const [tables] = await pool.query('SHOW TABLES');
  const version = (rows as { version: string }[])[0]?.version;
  const tableNames = (tables as Record<string, string>[]).map((t) => Object.values(t)[0]);
  console.log(`✅ Kết nối OK tới ${url.hostname}:${url.port || 3306}/${url.pathname.replace(/^\//, '')}`);
  console.log(`   MySQL ${version} · ${Date.now() - started}ms · bảng: ${tableNames.join(', ') || '(chưa có — chạy npm run db:init)'}`);
  await pool.end();
}

main().catch(async (err) => {
  console.error(`❌ Kết nối THẤT BẠI tới ${url.hostname}:${url.port || 3306}`);
  console.error(`   ${err.code || ''} ${err.message || err}`);
  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('   → Sai user/mật khẩu. Cập nhật DATABASE_URL trong backend/.env với mật khẩu mới.');
  }
  await pool.end().catch(() => {});
  process.exit(1);
});
