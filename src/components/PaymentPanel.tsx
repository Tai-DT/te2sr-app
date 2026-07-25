'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Copy, Check, QrCode, Info } from 'lucide-react';
import {
  PAYMENT_METHODS,
  isConfigured,
  formatUsd,
  formatVnd,
  CONFIRM_WINDOW,
} from '@/lib/payment';

function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="shrink-0 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium inline-flex items-center gap-1 transition-colors"
      aria-label={label ? `Sao chép ${label}` : 'Sao chép'}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden /> : <Copy className="w-3.5 h-3.5" aria-hidden />}
      <span>{copied ? 'Đã chép' : 'Chép'}</span>
    </button>
  );
}

interface PaymentPanelProps {
  /** Số tiền phải trả cho đợt này (USD). null = gói Liên hệ. */
  amountUsd: number | null;
  /** Mã đơn — dùng làm nội dung chuyển khoản để đối soát. */
  orderId: string;
  /** Tổng giá gói, để hiển thị "50% của $100". */
  totalUsd?: number | null;
}

export const PaymentPanel: React.FC<PaymentPanelProps> = ({ amountUsd, orderId, totalUsd }) => {
  const [active, setActive] = useState<'qr' | 'binance'>('qr');
  // Ẩn ảnh QR nếu file chưa được lưu vào /public — tránh hiện icon ảnh vỡ
  const [brokenQr, setBrokenQr] = useState<Record<string, boolean>>({});
  const qrRef = useRef<HTMLImageElement | null>(null);
  const method = PAYMENT_METHODS.find((m) => m.id === active) || PAYMENT_METHODS[0];
  const vnd = amountUsd !== null ? formatVnd(amountUsd) : null;
  const showQr = Boolean(method.qrImage) && !brokenQr[method.id];

  const markQrBroken = useCallback(() => {
    setBrokenQr((s) => ({ ...s, [method.id]: true }));
  }, [method.id]);

  // Ảnh có thể lỗi TRƯỚC khi React gắn onError (ảnh render sẵn từ server),
  // nên phải kiểm tra lại trạng thái thật của ảnh sau khi mount.
  useEffect(() => {
    const el = qrRef.current;
    if (el && el.complete && el.naturalWidth === 0) markQrBroken();
  }, [markQrBroken, active]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden text-left">
      {/* Amount due */}
      <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-200">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Số tiền cần thanh toán đợt 1
        </p>
        {amountUsd !== null ? (
          <div className="flex items-baseline gap-2 mt-1 flex-wrap">
            <span className="text-3xl font-bold tracking-tight text-slate-900">{formatUsd(amountUsd)}</span>
            {vnd && <span className="text-sm text-slate-500">≈ {vnd}</span>}
            {totalUsd ? (
              <span className="text-xs text-slate-500">
                (50% của {formatUsd(totalUsd)} — 50% còn lại khi app live)
              </span>
            ) : null}
          </div>
        ) : (
          <p className="text-lg font-semibold text-slate-900 mt-1">
            Báo giá riêng — kỹ sư sẽ liên hệ xác nhận số tiền
          </p>
        )}
      </div>

      {/* Method tabs */}
      <div className="flex gap-1 p-1.5 bg-white border-b border-slate-100">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setActive(m.id)}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              active === m.id
                ? 'bg-brand-blue text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-3">
        <p className="text-[11px] text-slate-500">{method.hint}</p>

        {isConfigured(method) ? (
          <>
            {showQr ? (
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={qrRef}
                  src={method.qrImage}
                  alt={`Mã QR thanh toán — ${method.label}`}
                  onError={markQrBroken}
                  className="w-52 h-52 object-contain rounded-xl border border-slate-200 bg-white p-2"
                />
              </div>
            ) : null}

            <div className="space-y-2">
              {method.fields
                .filter((f) => f.value.trim() !== '')
                .map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <span className="text-[11px] text-slate-500 shrink-0">{f.label}</span>
                    <span className="flex items-center gap-2 min-w-0">
                      <span
                        className={`text-xs font-semibold text-slate-900 truncate ${f.mono ? 'font-mono' : ''}`}
                      >
                        {f.value}
                      </span>
                      <CopyButton value={f.value} label={f.label} />
                    </span>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <QrCode className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden />
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Thông tin thanh toán đang được cập nhật. Vui lòng nhắn qua khung chat
              (Zalo / WhatsApp / Messenger) để nhận mã QR và xác nhận đơn{' '}
              <span className="font-mono font-semibold">{orderId}</span>.
            </p>
          </div>
        )}

        {/* Transfer memo — critical for manual reconciliation */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold text-slate-700">
            Nội dung chuyển khoản <span className="text-red-600">(bắt buộc)</span>
          </p>
          <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200">
            <span className="font-mono text-sm font-bold text-blue-800 truncate">{orderId}</span>
            <CopyButton value={orderId} label="nội dung chuyển khoản" />
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Ghi đúng mã đơn để hệ thống đối soát tự động. Thiếu mã đơn sẽ làm chậm quá trình xác nhận.
          </p>
        </div>

        <div className="flex items-start gap-2 pt-1">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" aria-hidden />
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Sau khi chuyển, kỹ sư TE2SR đối soát trong khoảng {CONFIRM_WINDOW} và kích hoạt đếm 14 ngày.
            Bạn có thể gửi ảnh biên lai qua khung chat để được xác nhận nhanh hơn.
          </p>
        </div>
      </div>
    </div>
  );
};
