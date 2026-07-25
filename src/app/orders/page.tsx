'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/lib/i18n/language-context';
import { api, ApiError } from '@/lib/api-client';
import { useAuth } from '@/lib/auth';
import type { Order, OrderMessage, OrderStatus } from '@/lib/types';
import { formatUsd } from '@/lib/payment';
import {
  Package, Loader2, AlertCircle, LogIn, MessageSquare, Send,
  CheckCircle2, Circle, RefreshCw, Smartphone, Apple, Globe,
} from 'lucide-react';

const STATUS_STYLE: Record<OrderStatus, { badge: string; dot: string; key: string }> = {
  Pending: { badge: 'bg-amber-50 border-amber-200 text-amber-800', dot: 'bg-amber-500', key: 'adm_status_pending' },
  'In Progress': { badge: 'bg-blue-50 border-blue-200 text-brand-blue', dot: 'bg-brand-blue', key: 'adm_status_in_progress' },
  Completed: { badge: 'bg-emerald-50 border-emerald-200 text-emerald-700', dot: 'bg-emerald-500', key: 'adm_status_completed' },
  Rejected: { badge: 'bg-red-50 border-red-200 text-red-700', dot: 'bg-red-500', key: 'adm_status_rejected' },
};

/**
 * Ngày giờ phải render giống hệt nhau ở server và trình duyệt, nếu không React
 * sẽ vứt bỏ toàn bộ cây DOM vì lệch hydration. `toLocaleString()` phụ thuộc
 * locale của máy khách nên tuyệt đối không dùng ở đây.
 */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getUTCDate())}/${p(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
}

function PlatformIcon({ platform }: { platform: Order['platform'] }) {
  if (platform === 'Android') return <Smartphone className="w-3.5 h-3.5" aria-hidden />;
  if (platform === 'iOS') return <Apple className="w-3.5 h-3.5" aria-hidden />;
  return <Globe className="w-3.5 h-3.5" aria-hidden />;
}

/** Hai mốc thanh toán của một đơn. */
function PaymentSteps({ order }: { order: Order }) {
  const { t } = useLanguage();
  const half = order.packagePrice !== null ? order.packagePrice / 2 : null;
  const steps = [
    { done: order.paidDeposit, label: t('adm_payment_deposit'), amount: half },
    { done: order.paidFinal, label: t('adm_payment_final'), amount: half },
  ];
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {steps.map((s) => (
        <div
          key={s.label}
          className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-semibold ${
            s.done
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          {s.done
            ? <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden />
            : <Circle className="w-4 h-4 shrink-0" aria-hidden />}
          <span className="truncate">{s.label}</span>
          {s.amount !== null && <span className="ml-auto shrink-0">{formatUsd(s.amount)}</span>}
        </div>
      ))}
    </div>
  );
}

/** Khung chat của một đơn — chỉ tải tin nhắn khi khách thực sự mở ra. */
function OrderChat({ orderId }: { orderId: string }) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<OrderMessage[] | null>(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    try {
      setMessages(await api.listMessages(orderId));
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('myorders_chat_error'));
    }
  }, [orderId, t]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }); }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setError(null);
    try {
      const msg = await api.sendMessage(orderId, body);
      setMessages((prev) => [...(prev ?? []), msg]);
      setText('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('myorders_chat_error'));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-3 pt-3 border-t border-slate-200 space-y-3">
      <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
        {messages === null ? (
          <p className="text-[11px] text-slate-500 flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden />
            {t('myorders_chat_loading')}
          </p>
        ) : messages.length === 0 ? (
          <p className="text-[11px] text-slate-500">{t('myorders_chat_empty')}</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'admin' ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'admin'
                    ? 'bg-slate-100 text-slate-800 rounded-tl-sm'
                    : 'bg-brand-blue text-white rounded-tr-sm'
                }`}
              >
                <p className={`text-[10px] font-semibold mb-0.5 ${m.role === 'admin' ? 'text-slate-500' : 'text-blue-100'}`}>
                  {m.senderName} · {formatDate(m.createdAt)}
                </p>
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      {error && (
        <p className="text-[11px] text-red-700 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      <form onSubmit={send} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('myorders_chat_placeholder')}
          className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="shrink-0 px-3 py-2 rounded-xl bg-brand-blue text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          aria-label={t('myorders_chat_send')}
        >
          {sending
            ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
            : <Send className="w-4 h-4" aria-hidden />}
        </button>
      </form>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const { t } = useLanguage();
  const [chatOpen, setChatOpen] = useState(false);
  const style = STATUS_STYLE[order.status] ?? STATUS_STYLE.Pending;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-apple-sm">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h2 className="font-extrabold text-slate-900 truncate">{order.appName}</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            <span className="font-mono font-semibold text-brand-blue">{order.id}</span>
            {' · '}{formatDate(order.createdAt)}
          </p>
        </div>
        <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${style.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden />
          {t(style.key)}
        </span>
      </div>

      <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-600 font-semibold flex-wrap">
        <span className="inline-flex items-center gap-1.5">
          <PlatformIcon platform={order.platform} />
          {order.platform}
        </span>
        <span className="text-slate-300" aria-hidden>|</span>
        <span>{order.serviceType}</span>
        <span className="text-slate-300" aria-hidden>|</span>
        <span className="font-bold text-slate-900">
          {order.packagePrice !== null ? formatUsd(order.packagePrice) : t('myorders_quote_price')}
        </span>
      </div>

      {order.packagePrice !== null && (
        <div className="mt-3">
          <PaymentSteps order={order} />
        </div>
      )}

      <button
        onClick={() => setChatOpen((v) => !v)}
        className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-blue hover:text-blue-700 transition-colors"
        aria-expanded={chatOpen}
      >
        <MessageSquare className="w-3.5 h-3.5" aria-hidden />
        {chatOpen ? t('myorders_chat_hide') : t('myorders_chat_show')}
      </button>

      {chatOpen && <OrderChat orderId={order.id} />}
    </article>
  );
}

export default function MyOrdersPage() {
  const { t } = useLanguage();
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      setOrders(await api.listOrders());
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('myorders_load_error'));
    } finally {
      setRefreshing(false);
    }
  }, [user, t]);

  useEffect(() => { void load(); }, [load]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10 sm:py-14">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display flex items-center gap-2.5">
            <Package className="w-6 h-6 text-brand-blue" aria-hidden />
            {t('myorders_title')}
          </h1>
          <p className="text-sm text-slate-600 mt-1.5">{t('myorders_subtitle')}</p>
        </header>

        {authLoading ? (
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
            {t('myorders_loading')}
          </p>
        ) : !user ? (
          /* Chưa đăng nhập — nêu rõ vì sao nên dùng Google: chỉ email đã được
             Google xác thực mới tự nhận lại đơn đã đặt lúc chưa đăng nhập. */
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-apple-sm">
            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-brand-blue flex items-center justify-center mx-auto">
              <LogIn className="w-6 h-6" aria-hidden />
            </div>
            <h2 className="mt-3 font-extrabold text-slate-900">{t('myorders_signin_title')}</h2>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-md mx-auto">
              {t('myorders_signin_desc')}
            </p>
            <button
              onClick={openAuthModal}
              className="mt-4 px-5 py-2.5 rounded-xl bg-brand-blue text-white font-bold text-sm shadow-brand-blue hover:bg-blue-600 transition-colors"
            >
              {t('myorders_signin_cta')}
            </button>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden />
            <div className="min-w-0">
              <p className="text-xs text-red-800 font-semibold">{error}</p>
              <button onClick={() => void load()} className="mt-2 text-xs font-bold text-red-700 underline">
                {t('myorders_retry')}
              </button>
            </div>
          </div>
        ) : orders === null ? (
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
            {t('myorders_loading')}
          </p>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-apple-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" aria-hidden />
            </div>
            <h2 className="mt-3 font-extrabold text-slate-900">{t('myorders_empty_title')}</h2>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-md mx-auto">
              {t('myorders_empty_desc')}
            </p>
            <a
              href="/"
              className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-brand-blue text-white font-bold text-sm shadow-brand-blue hover:bg-blue-600 transition-colors"
            >
              {t('myorders_empty_cta')}
            </a>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500 font-semibold">
                {orders.length} {t('myorders_count_suffix')}
              </p>
              <button
                onClick={() => void load()}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-blue disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} aria-hidden />
                {t('myorders_refresh')}
              </button>
            </div>
            <div className="space-y-3">
              {orders.map((o) => <OrderCard key={o.id} order={o} />)}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
