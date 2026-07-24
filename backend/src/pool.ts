// ══════════════════════════════════════════════════════════════
//  Shared MySQL connection pool (TLS to Aiven via CA cert)
// ══════════════════════════════════════════════════════════════

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import mysql, { type PoolOptions, type SslOptions } from 'mysql2/promise';
import { config } from './config';

export function buildConnectionOptions(): PoolOptions {
  const url = new URL(config.databaseUrl);

  let ssl: SslOptions | undefined;
  if (config.dbCaPath) {
    ssl = { ca: readFileSync(resolve(process.cwd(), config.dbCaPath)), rejectUnauthorized: true };
  } else if (/ssl-mode=required/i.test(config.databaseUrl)) {
    ssl = { rejectUnauthorized: false };
  }

  return {
    host: url.hostname,
    port: url.port ? parseInt(url.port, 10) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ''),
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    ssl,
  };
}

export const pool = mysql.createPool(buildConnectionOptions());
