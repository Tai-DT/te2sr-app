// ══════════════════════════════════════════════════════════════
//  Reset the database to a pristine demo state.
//  Deletes ALL users, all messages/reports, and every order except
//  the 4 built-in seed orders. Guarded — pass --confirm to run.
//  Usage: npm run db:reset-demo -- --confirm
// ══════════════════════════════════════════════════════════════

import type { RowDataPacket } from 'mysql2';
import { pool } from './pool';

const SEED_IDS = ['ORD-8921', 'ORD-8922', 'ORD-8923', 'ORD-8924'];
const TABLES = ['users', 'orders', 'order_messages', 'design_reports'] as const;

async function counts(): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  for (const t of TABLES) {
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM ${t}`);
    out[t] = (rows[0] as { n: number }).n;
  }
  return out;
}

async function main() {
  if (!process.argv.includes('--confirm')) {
    console.error('⚠️  Lệnh này sẽ XOÁ toàn bộ users, messages, reports và mọi order ngoài 4 đơn seed.');
    console.error('   Chạy lại với --confirm:  npm run db:reset-demo -- --confirm');
    process.exit(1);
  }
  const before = await counts();
  await pool.query('DELETE FROM order_messages');
  await pool.query('DELETE FROM design_reports');
  await pool.query(`DELETE FROM orders WHERE id NOT IN (${SEED_IDS.map(() => '?').join(',')})`, SEED_IDS);
  await pool.query('DELETE FROM users');
  const after = await counts();
  console.log('Trước :', before);
  console.log('Sau   :', after);
  console.log('✅ Đã reset về trạng thái demo (giữ 4 đơn seed, xoá toàn bộ user — hãy tạo admin mới qua Google/đăng ký).');
  await pool.end();
}

main().catch((err) => {
  console.error('❌ Reset thất bại:', err.message || err);
  process.exit(1);
});
