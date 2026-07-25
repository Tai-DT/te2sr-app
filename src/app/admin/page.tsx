'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getTranslation } from '@/lib/i18n/dictionaries';
import { useLanguage } from '@/lib/useLanguage';
import { adminHeaders, getAdminToken, setAdminToken } from '@/lib/adminAuth';
import { useAuth } from '@/lib/auth';
import { Order } from '@/lib/store';
import {
  LayoutDashboard, MessageSquare, Send, ShieldAlert, RefreshCw,
  CheckCircle2, Clock, TestTube, Rocket, Star, ChevronRight, Package,
  Activity, Search, BarChart2, Globe, ArrowUpRight, Zap, Lock, Users, Copy, Check, ShieldCheck,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  role: 'client' | 'admin';
  text: string;
  timestamp: string;
  avatar?: string;
}

const SERVICE_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  Testing: { label: 'QA Testing', color: 'text-brand-blue bg-blue-50 border-blue-300 font-bold', icon: <TestTube className="w-3.5 h-3.5 text-brand-blue" /> },
  Publishing: { label: 'App Store', color: 'text-slate-900 bg-slate-100 border-slate-300 font-bold', icon: <Rocket className="w-3.5 h-3.5 text-slate-900" /> },
  Promotion_5Star: { label: '5★ Boost', color: 'text-amber-800 bg-amber-50 border-amber-300 font-bold', icon: <Star className="w-3.5 h-3.5 text-amber-600" /> },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  Pending:     { label: 'Pending',     color: 'text-amber-900 bg-amber-50 border-amber-300 font-semibold',   dot: 'bg-amber-600' },
  'In Progress': { label: 'In Progress', color: 'text-brand-blue bg-blue-50 border-blue-300 font-semibold',     dot: 'bg-brand-blue animate-pulse' },
  Completed:   { label: 'Completed',   color: 'text-emerald-900 bg-emerald-50 border-emerald-300 font-semibold', dot: 'bg-emerald-600' },
  Rejected:    { label: 'Rejected',    color: 'text-red-900 bg-red-50 border-red-300 font-semibold',         dot: 'bg-red-600' },
};

export default function AdminPortalPage() {
  const [currentLang, setCurrentLang] = useLanguage();
  const { user, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsToken, setNeedsToken] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'chat' | 'analytics'>('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedGroup, setCopiedGroup] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const googleGroupEmail = 'te2sr@googlegroups.com';

  const [activeChat, setActiveChat] = useState<ChatMessage[]>([
    { id: '1', sender: 'TE2SR Support', role: 'admin', text: 'Chào bạn! Đơn hàng của bạn đã được tiếp nhận. Đội ngũ kỹ sư TE2SR đang tiến hành chuẩn bị tài nguyên.', timestamp: '10:15' },
    { id: '2', sender: 'Khách hàng', role: 'client', text: 'Chào Admin, cho mình hỏi với gói Google Play thì quy trình 12 testers sẽ như thế nào?', timestamp: '10:18' },
    { id: '3', sender: 'TE2SR Support', role: 'admin', text: 'Đối với Google Play, bạn chỉ cần thêm Google Group: te2sr@googlegroups.com vào phần Closed Testing trong Google Play Console, sau đó dán Link Kiểm Thử (Opt-in URL) tại đây. Đội ngũ 12 testers thực tế của TE2SR sẽ tự động cài đặt & đếm 14 ngày liên tục!', timestamp: '10:22' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${apiUrl}/api/admin/orders`, { headers: adminHeaders() });
      if (res.status === 401 || res.status === 503) {
        setNeedsToken(true);
        setApiError('Token quản trị không đúng hoặc chưa được nhập.');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setNeedsToken(false);
        setOrders(data.orders);
        if (data.orders.length > 0 && !selectedOrder) {
          setSelectedOrder(data.orders[0]);
        }
      } else {
        setApiError(data.error || 'Không tải được danh sách đơn.');
      }
    } catch (err) {
      setApiError('Không kết nối được máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Chưa lưu token → hiện ngay màn hình nhập, khỏi gọi API để nhận 401
    if (!getAdminToken()) {
      setNeedsToken(true);
      setLoading(false);
      return;
    }
    fetchOrders();
  }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeChat]);

  const handleCopyGroup = () => {
    navigator.clipboard.writeText(googleGroupEmail);
    setCopiedGroup(true);
    setTimeout(() => setCopiedGroup(false), 2000);
  };

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    setApiError(null);
    try {
      const res = await fetch(`${apiUrl}/api/admin/orders`, {
        method: 'PATCH',
        headers: adminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json().catch(() => null);
      // Chỉ cập nhật giao diện khi server XÁC NHẬN đã lưu
      if (!res.ok || !data?.success) {
        setApiError(data?.error || 'Không cập nhật được trạng thái. Thử lại.');
        if (res.status === 401) setNeedsToken(true);
        return;
      }
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      setApiError('Không kết nối được máy chủ.');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: user?.role === 'admin' ? 'TE2SR Support' : (user?.name || 'Khách hàng'),
      role: user?.role === 'admin' ? 'admin' : 'client',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setActiveChat(prev => [...prev, newMessage]);
    setInputMessage('');
  };

  const filteredOrders = orders.filter(o => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchSearch = o.appName.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalOrders = orders.length;
  const inProgress = orders.filter(o => o.status === 'In Progress').length;
  const completed = orders.filter(o => o.status === 'Completed').length;
  const pending = orders.filter(o => o.status === 'Pending').length;

  const TABS = [
    { id: 'overview', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'orders', label: 'Đơn Hàng', icon: Package },
    { id: 'chat', label: 'Hỗ Trợ Chat', icon: MessageSquare },
    { id: 'analytics', label: 'Thống Kê', icon: BarChart2 },
  ];

  // Chưa có token quản trị hợp lệ → yêu cầu nhập trước khi hiện bất kỳ đơn nào
  if (needsToken) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-sm space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6 text-amber-400" aria-hidden />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Cổng quản trị TE2SR</h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Nhập token quản trị để xem đơn hàng. Token được cấp phía máy chủ và chỉ lưu trên máy này.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAdminToken(tokenInput);
                setNeedsToken(false);
                setTokenInput('');
                fetchOrders();
              }}
              className="space-y-3"
            >
              <input
                type="password"
                autoFocus
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Dán token quản trị"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white focus-visible:ring-2 focus-visible:ring-brand-blue/30 transition-all"
              />
              {apiError && <p className="text-xs text-red-700">{apiError}</p>}
              <button
                type="submit"
                disabled={!tokenInput.trim()}
                className="w-full py-3 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white font-semibold text-sm transition-colors disabled:opacity-50"
              >
                Mở bảng điều khiển
              </button>
            </form>
          </div>
        </main>
        <Footer currentLang={currentLang} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ─── PAGE HEADER ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-blue text-white flex items-center justify-center shadow-apple-sm">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold font-display text-slate-900 tracking-tight">
                {user?.role === 'admin' ? 'Admin Control Center' : '📦 Cổng Theo Dõi Dịch Vụ'}
              </h1>
            </div>
            <p className="text-xs text-slate-700 pl-10 font-bold">
              {user ? `Xin chào, ${user.name} · ${user.role === 'admin' ? 'Quản Trị Viên' : 'Khách Hàng'}` : 'Theo dõi tiến độ app & trao đổi trực tiếp với kỹ sư'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 hover:border-brand-blue hover:text-brand-blue shadow-apple-sm transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-blue' : ''}`} />
              <span>Làm Mới</span>
            </button>
          </div>
        </div>

        {/* ─── AUTH GATE ─── */}
        {!user ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-6 border border-slate-300 shadow-apple-md">
            <div className="relative mx-auto w-20 h-20">
              <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto shadow-apple-sm">
                <Lock className="w-9 h-9 text-brand-blue" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                <ShieldAlert className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-900">Khu Vực Yêu Cầu Xác Thực</h3>
              <p className="text-sm text-slate-800 max-w-sm mx-auto leading-relaxed font-semibold">
                Đăng nhập để truy cập bảng điều khiển, theo dõi tiến độ đơn hàng & trao đổi trực tiếp với đội ngũ kỹ sư TE2SR.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={openAuthModal}
                className="px-8 py-3 rounded-2xl bg-brand-blue text-white font-semibold text-sm shadow-brand-blue hover:bg-brand-blueHover transition-all"
              >
                Đăng Nhập Ngay
              </button>
              <button
                onClick={() => openAuthModal()}
                className="px-8 py-3 rounded-2xl bg-slate-100 border border-slate-300 text-slate-900 font-semibold text-sm hover:bg-slate-200 transition-all"
              >
                Tạo Tài Khoản Mới
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ─── NAV TABS ─── */}
            <div className="flex gap-1 p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300 w-fit">
              {TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-brand-blue shadow-apple-sm'
                        : 'text-slate-800 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ══════════ TAB: OVERVIEW ══════════ */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Google Group Callout Banner */}
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-apple-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">Google Play Tester Group (12 Testers / 14 Ngày)</h4>
                      <p className="text-[11px] text-slate-800 font-semibold">
                        Để thực hiện kiểm thử 12 testers trong 14 ngày trên Google Play Console, hãy thêm email: <span className="font-mono font-semibold text-brand-blue select-all">{googleGroupEmail}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyGroup}
                    className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-semibold text-xs flex items-center gap-1.5 shrink-0 shadow-apple-sm hover:bg-amber-100 transition-colors"
                  >
                    {copiedGroup ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedGroup ? 'Đã sao chép' : 'Sao chép Email'}</span>
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Tổng Đơn Hàng', value: totalOrders, icon: Package, color: 'text-brand-blue', change: '+12%' },
                    { label: 'Đang Xử Lý', value: inProgress, icon: Activity, color: 'text-blue-700', change: `${inProgress} active` },
                    { label: 'Hoàn Thành', value: completed, icon: CheckCircle2, color: 'text-emerald-700', change: `${Math.round((completed/Math.max(totalOrders,1))*100)}%` },
                    { label: 'Chờ Xác Nhận', value: pending, icon: Clock, color: 'text-amber-700', change: 'Cần xử lý' },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="bg-white rounded-2xl p-5 border border-slate-300 shadow-apple-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-800 font-semibold uppercase tracking-wider">{stat.label}</span>
                          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                            <Icon className={`w-4 h-4 ${stat.color}`} />
                          </div>
                        </div>
                        <div className="text-3xl font-semibold text-slate-900 font-display">{stat.value}</div>
                        <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>{stat.change}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-white rounded-2xl border border-slate-300 shadow-apple-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-sm font-semibold text-slate-900">Đơn Hàng Gần Đây</h2>
                    <button onClick={() => setActiveTab('orders')} className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1">
                      Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {orders.slice(0, 4).map(order => {
                      const svc = SERVICE_LABELS[order.serviceType];
                      const sts = STATUS_CONFIG[order.status];
                      return (
                        <div
                          key={order.id}
                          onClick={() => { setSelectedOrder(order); setActiveTab('orders'); }}
                          className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-900 font-bold">
                              {svc?.icon}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-blue transition-colors">{order.appName}</p>
                              <p className="text-[11px] text-slate-700 font-semibold">{order.id} · {order.platform}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${svc?.color}`}>
                              {svc?.label}
                            </span>
                            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${sts?.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sts?.dot}`} />
                              {sts?.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Actions (Admin Only) */}
                {user.role === 'admin' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { title: 'Cập Nhật Trạng Thái', desc: 'Chuyển đổi tiến độ đơn hàng', icon: Zap, action: () => setActiveTab('orders') },
                      { title: 'Phản Hồi Chat', desc: 'Trả lời tin nhắn khách hàng', icon: MessageSquare, action: () => setActiveTab('chat') },
                      { title: 'Xem Thống Kê', desc: 'Báo cáo dịch vụ & doanh thu', icon: BarChart2, action: () => setActiveTab('analytics') },
                    ].map((action, i) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={i}
                          onClick={action.action}
                          className="bg-white rounded-2xl p-5 border border-slate-300 shadow-apple-sm hover:border-brand-blue text-left group transition-all hover:scale-[1.01]"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                              <Icon className="w-5 h-5 text-brand-blue" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-blue transition-colors">{action.title}</p>
                              <p className="text-[11px] text-slate-700 font-semibold mt-0.5">{action.desc}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ══════════ TAB: ORDERS ══════════ */}
            {activeTab === 'orders' && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Orders List */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Search & Filter Bar */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo tên app hoặc mã đơn..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-500 focus:outline-none focus:border-brand-blue shadow-apple-sm transition-colors"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                      className="px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-brand-blue shadow-apple-sm"
                    >
                      <option value="all">Tất Cả</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Order Cards */}
                  <div className="space-y-3">
                    {filteredOrders.map(order => {
                      const svc = SERVICE_LABELS[order.serviceType];
                      const sts = STATUS_CONFIG[order.status];
                      const isSelected = selectedOrder?.id === order.id;
                      return (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all shadow-apple-sm hover:border-brand-blue ${
                            isSelected ? 'border-brand-blue bg-blue-50/20' : 'border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-900 font-bold shrink-0">
                              {svc?.icon || <Package className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold text-slate-900 leading-tight truncate">{order.appName}</p>
                                  <p className="text-[11px] text-slate-700 font-semibold mt-0.5">{order.id} · {order.clientEmail}</p>
                                </div>
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${sts?.color}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${sts?.dot}`} />
                                  {sts?.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${svc?.color}`}>
                                  {svc?.icon}<span>{svc?.label}</span>
                                </span>
                                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-[11px] text-slate-900 font-semibold">{order.platform}</span>
                                <span className="text-[11px] text-slate-600 font-semibold">{order.createdAt}</span>
                              </div>
                              {order.details && (
                                <p className="text-[11px] text-slate-800 font-medium line-clamp-1">{order.details}</p>
                              )}

                              {/* Admin: Status update buttons */}
                              {user.role === 'admin' && (
                                <div className="flex gap-1.5 pt-1 flex-wrap">
                                  {(['Pending', 'In Progress', 'Completed', 'Rejected'] as Order['status'][]).map(s => (
                                    <button
                                      key={s}
                                      onClick={e => { e.stopPropagation(); handleUpdateStatus(order.id, s); }}
                                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                                        order.status === s
                                          ? STATUS_CONFIG[s]?.color
                                          : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                                      }`}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {filteredOrders.length === 0 && (
                      <div className="text-center py-12 text-slate-600 bg-white rounded-2xl border border-slate-300 font-semibold">
                        <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">Không tìm thấy đơn hàng nào</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Detail Panel */}
                <div className="lg:col-span-2">
                  {selectedOrder ? (
                    <div className="bg-white rounded-2xl border border-slate-300 shadow-apple-sm overflow-hidden sticky top-20">
                      {/* Header */}
                      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-brand-blue uppercase tracking-wider">Chi Tiết Đơn</span>
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${STATUS_CONFIG[selectedOrder.status]?.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[selectedOrder.status]?.dot}`} />
                            {STATUS_CONFIG[selectedOrder.status]?.label}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-slate-900">{selectedOrder.appName}</h3>
                      </div>

                      {/* Details */}
                      <div className="px-5 py-4 space-y-3 text-xs border-b border-slate-200">
                        {[
                          { label: 'Mã Đơn', value: selectedOrder.id },
                          { label: 'Email Client', value: selectedOrder.clientEmail },
                          { label: 'Nền Tảng', value: selectedOrder.platform },
                          { label: 'Dịch Vụ', value: SERVICE_LABELS[selectedOrder.serviceType]?.label || selectedOrder.serviceType },
                          { label: 'Ngày Tạo', value: selectedOrder.createdAt },
                          { label: 'Quốc Gia', value: selectedOrder.targetCountries.join(', ') },
                        ].map((row, i) => (
                          <div key={i} className="flex justify-between items-start gap-2">
                            <span className="text-slate-700 shrink-0 font-bold">{row.label}</span>
                            <span className="text-slate-900 font-semibold text-right">{row.value}</span>
                          </div>
                        ))}

                        {/* Google Play Group Requirement for Android/Both */}
                        {(selectedOrder.platform === 'Android' || selectedOrder.platform === 'Both') && (
                          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-amber-900 text-[11px] flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-amber-700" /> Google Play Tester Group:
                              </span>
                              <button
                                onClick={handleCopyGroup}
                                className="text-[10px] font-semibold text-amber-800 underline"
                              >
                                {copiedGroup ? 'Đã sao chép' : 'Sao chép'}
                              </button>
                            </div>
                            <p className="font-mono text-[11px] font-bold text-brand-blue select-all">{googleGroupEmail}</p>
                          </div>
                        )}

                        {selectedOrder.details && (
                          <div className="pt-2 border-t border-slate-200">
                            <p className="text-slate-700 mb-1 font-bold">Ghi chú:</p>
                            <p className="text-slate-900 leading-relaxed font-medium">{selectedOrder.details}</p>
                          </div>
                        )}
                      </div>

                      {/* Progress Track */}
                      <div className="px-5 py-4 space-y-3 border-b border-slate-200">
                        <p className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Tiến Độ Xử Lý</p>
                        <div className="flex items-center gap-1">
                          {['Pending', 'In Progress', 'Completed'].map((s, i) => {
                            const statuses = ['Pending', 'In Progress', 'Completed'];
                            const currentIdx = statuses.indexOf(selectedOrder.status);
                            const isActive = i <= currentIdx;
                            return (
                              <React.Fragment key={s}>
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-semibold border transition-all ${
                                  isActive ? 'bg-brand-blue border-brand-blue text-white shadow-apple-sm' : 'bg-slate-100 border-slate-300 text-slate-500'
                                }`}>
                                  {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                                </div>
                                {i < 2 && (
                                  <div className={`flex-1 h-0.5 ${isActive && i < currentIdx ? 'bg-brand-blue' : 'bg-slate-300'}`} />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-800 font-bold">
                          <span>Nhận Đơn</span>
                          <span>Xử Lý</span>
                          <span>Hoàn Tất</span>
                        </div>
                      </div>

                      {/* Quick Chat Button */}
                      <div className="px-5 py-4">
                        <button
                          onClick={() => setActiveTab('chat')}
                          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-brand-blue text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-apple-sm"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Trao Đổi Về Đơn Hàng Này</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-300 p-8 text-center text-slate-700 font-semibold shadow-apple-sm">
                      <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">Chọn một đơn hàng để xem chi tiết</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══════════ TAB: CHAT ══════════ */}
            {activeTab === 'chat' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl border border-slate-300 shadow-apple-sm overflow-hidden">
                  {/* Chat Header */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 bg-slate-50">
                    <div className="w-9 h-9 rounded-full bg-brand-blue flex items-center justify-center shadow-apple-sm">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {user.role === 'admin' ? 'Hỗ Trợ Khách Hàng TE2SR Support' : 'Trao Đổi Với Kỹ Sư TE2SR'}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        <span>Trực tuyến · Phản hồi ngay</span>
                      </div>
                    </div>
                    {selectedOrder && (
                      <div className="ml-auto px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-[11px] text-brand-blue font-mono font-semibold">
                        {selectedOrder.id}
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="h-96 overflow-y-auto space-y-4 p-5 bg-slate-50">
                    {activeChat.map(msg => (
                      <div key={msg.id} className={`flex gap-2.5 ${msg.role !== 'admin' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-semibold shrink-0 ${
                          msg.role === 'admin'
                            ? 'bg-brand-blue border-brand-blue text-white'
                            : 'bg-slate-300 border-slate-400 text-slate-900'
                        }`}>
                          {msg.role === 'admin' ? 'TE' : user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className={`max-w-[78%] space-y-1 ${msg.role !== 'admin' ? 'items-end flex flex-col' : ''}`}>
                          <p className="text-[11px] text-slate-700 font-bold">{msg.sender} · {msg.timestamp}</p>
                          <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed font-semibold ${
                            msg.role === 'admin'
                              ? 'bg-white border border-slate-300 text-slate-900 rounded-tl-sm shadow-apple-sm'
                              : 'bg-brand-blue text-white rounded-tr-sm shadow-brand-blue'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-4 border-t border-slate-200 bg-white">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={e => setInputMessage(e.target.value)}
                      placeholder={user.role === 'admin' ? 'Trả lời khách hàng...' : 'Nhắn tin với kỹ sư hỗ trợ...'}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:bg-white transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim()}
                      className="p-2.5 rounded-xl bg-brand-blue text-white shadow-brand-blue hover:bg-brand-blueHover transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ══════════ TAB: ANALYTICS ══════════ */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Service Breakdown */}
                <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-apple-sm">
                  <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-brand-blue" />
                    <span>Phân Tích Theo Dịch Vụ</span>
                  </h2>
                  <div className="space-y-3">
                    {Object.entries(SERVICE_LABELS).map(([key, svc]) => {
                      const count = orders.filter(o => o.serviceType === key).length;
                      const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
                      return (
                        <div key={key} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="flex items-center gap-1.5 text-slate-900">
                              {svc.icon}<span>{svc.label}</span>
                            </span>
                            <span className="text-slate-700">{count} đơn · {pct}%</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-blue rounded-full transition-all duration-1000"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(STATUS_CONFIG).map(([key, sts]) => {
                    const count = orders.filter(o => o.status === key).length;
                    return (
                      <div key={key} className="bg-white rounded-2xl p-5 border border-slate-300 text-center space-y-2 shadow-apple-sm">
                        <span className="text-xs font-semibold text-slate-800">{sts.label}</span>
                        <p className="text-3xl font-semibold text-slate-900">{count}</p>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${sts.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sts.dot}`} />
                          {count} đơn
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Global Coverage */}
                <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-apple-sm">
                  <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-brand-blue" />
                    <span>Thị Trường Mục Tiêu</span>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(orders.flatMap(o => o.targetCountries))).map(country => (
                      <span key={country} className="px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-xs text-slate-900 font-semibold">
                        {country}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer currentLang={currentLang} />
    </div>
  );
}
