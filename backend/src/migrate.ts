// ══════════════════════════════════════════════════════════════
//  One-shot migration runner — applies schema.sql to the database
//  Usage: npm run db:init
// ══════════════════════════════════════════════════════════════

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql, { type SslOptions } from 'mysql2/promise';
import { config } from './config';

const here = dirname(fileURLToPath(import.meta.url));

async function main() {
  const url = new URL(config.databaseUrl);
  let ssl: SslOptions | undefined;
  if (config.dbCaPath) {
    ssl = { ca: readFileSync(resolve(process.cwd(), config.dbCaPath)), rejectUnauthorized: true };
  } else if (/ssl-mode=required/i.test(config.databaseUrl)) {
    ssl = { rejectUnauthorized: false };
  }

  const conn = await mysql.createConnection({
    host: url.hostname,
    port: url.port ? parseInt(url.port, 10) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ''),
    ssl,
    multipleStatements: true,
  });

  const sql = readFileSync(resolve(here, '../schema.sql'), 'utf8');
  console.log(`⏳ Applying schema to ${url.hostname}/${url.pathname.replace(/^\//, '')} ...`);
  await conn.query(sql);
  const [tables] = await conn.query('SHOW TABLES');
  console.log('✅ Schema applied. Tables:', (tables as Record<string, string>[]).map((t) => Object.values(t)[0]).join(', '));
  await conn.end();
}

main().catch((err) => {
  console.error('❌ Migration failed:', err.message || err);
  process.exit(1);
});
