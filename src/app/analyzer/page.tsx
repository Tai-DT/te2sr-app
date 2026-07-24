'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/lib/i18n/language-context';
import { api, ApiError } from '@/lib/api-client';
import { useAuth } from '@/lib/auth';
import type { DesignAnalysisReport, SuggestionLevel } from '@/lib/types';
import { Sparkles, UploadCloud, Loader2, AlertCircle, CheckCircle2, RefreshCw, ImageIcon, Info, History } from 'lucide-react';

const LEVEL_STYLE: Record<SuggestionLevel, { badge: string; dot: string; label: string }> = {
  Critical: { badge: 'bg-red-50 border-red-200 text-red-800', dot: 'bg-red-500', label: 'Nghiêm trọng' },
  Warning: { badge: 'bg-amber-50 border-amber-200 text-amber-800', dot: 'bg-amber-500', label: 'Cảnh báo' },
  Recommendation: { badge: 'bg-blue-50 border-blue-200 text-brand-blue', dot: 'bg-brand-blue', label: 'Gợi ý' },
};

function scoreColor(score: number): string {
  if (score >= 90) return 'text-emerald-600';
  if (score >= 80) return 'text-brand-blue';
  if (score >= 70) return 'text-amber-600';
  return 'text-red-600';
}

function scoreBadge(score: number): string {
  if (score >= 90) return 'bg-emerald-50 border-emerald-200 text-emerald-700';
  if (score >= 80) return 'bg-blue-50 border-blue-200 text-brand-blue';
  if (score >= 70) return 'bg-amber-50 border-amber-200 text-amber-700';
  return 'bg-red-50 border-red-200 text-red-700';
}

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score / 100);
  const stroke = score >= 90 ? '#059669' : score >= 80 ? '#0071E3' : score >= 70 ? '#D97706' : '#DC2626';
  return (
    <div className="relative w-36 h-36">
      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#E5E7EB" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none" stroke={stroke} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-extrabold font-display ${scoreColor(score)}`}>{score}</span>
        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">/ 100</span>
      </div>
    </div>
  );
}

function SubScore({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-slate-700">{label}</span>
        <span className={scoreColor(value)}>{value}</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-brand-blue rounded-full transition-all duration-1000" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function AnalyzerPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<DesignAnalysisReport | null>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [history, setHistory] = useState<DesignAnalysisReport[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadHistory = useCallback(() => {
    if (!user) { setHistory([]); return; }
    api.listReports().then(setHistory).catch(() => setHistory([]));
  }, [user]);
  useEffect(() => { loadHistory(); }, [loadHistory]);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    setReport(null);
    setError('');
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!fileName) { setError('Vui lòng chọn một ảnh thiết kế trước.'); return; }
    setAnalyzing(true);
    setError('');
    try {
      const result = await api.analyzeDesign(fileName);
      setReport(result);
      if (user) setHistory((prev) => [result, ...prev]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Phân tích thất bại. Vui lòng thử lại.');
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setReport(null);
    setFileName('');
    setError('');
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-extrabold">
            <Sparkles className="w-4 h-4" />
            <span>AI UI/UX Design Analyzer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">{t('analyzer_title')}</h1>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">{t('analyzer_subtitle')}</p>
        </div>

        {!report ? (
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Upload box */}
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
              className={`cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition-all ${
                dragOver ? 'border-brand-blue bg-blue-50/50' : 'border-slate-300 bg-slate-50 hover:border-brand-blue hover:bg-blue-50/30'
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              {previewUrl ? (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt={fileName} className="max-h-64 mx-auto rounded-xl border border-slate-200 shadow-apple-sm object-contain" />
                  <p className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-brand-blue" />{fileName}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">Nhấp để chọn ảnh khác</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto">
                    <UploadCloud className="w-7 h-7 text-brand-blue" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">{t('analyzer_upload_box')}</p>
                  <p className="text-[11px] text-slate-500 font-medium">PNG · JPG · WEBP</p>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span>
              </div>
            )}

            {!user && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-semibold">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-brand-blue" />
                <span>Đăng nhập để lưu lại lịch sử báo cáo phân tích của bạn.</span>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={analyzing || !fileName}
              className="w-full py-3.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-extrabold text-sm shadow-brand-blue transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{analyzing ? 'Đang phân tích thiết kế...' : t('analyzer_btn_analyze')}</span>
            </button>

            {/* History (logged-in users) */}
            {user && history.length > 0 && (
              <div className="pt-4 space-y-2">
                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-brand-blue" /> Lịch sử phân tích ({history.length})
                </h3>
                <div className="space-y-2">
                  {history.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setReport(h)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-brand-blue shadow-apple-sm transition-all text-left group"
                    >
                      <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-extrabold font-display border shrink-0 ${scoreBadge(h.score)}`}>{h.score}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate group-hover:text-brand-blue">{h.fileName}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{new Date(h.createdAt).toLocaleString()} · {h.suggestions.length} gợi ý</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Score summary */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-apple-md p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{t('analyzer_score_label')}</p>
                <ScoreRing score={report.score} />
                <p className="text-[11px] font-bold text-slate-500 font-mono">{report.fileName}</p>
              </div>
              <div className="space-y-4">
                <SubScore label="Bố cục & Khoảng cách" value={report.layoutScore} />
                <SubScore label="Typography" value={report.typographyScore} />
                <SubScore label="Màu sắc & Tương phản" value={report.contrastScore} />
                <SubScore label="Khả năng tiếp cận (A11y)" value={report.accessibilityScore} />
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-3">
              <h2 className="text-lg font-extrabold font-display text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-blue" />
                <span>{t('analyzer_suggestions_title')}</span>
                <span className="text-xs font-bold text-slate-500">({report.suggestions.length})</span>
              </h2>
              {report.suggestions.map((s, i) => {
                const lv = LEVEL_STYLE[s.level];
                return (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-apple-sm p-5 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${lv.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${lv.dot}`} />{lv.label}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700">{s.category}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900">{s.title}</h3>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{s.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 rounded-xl bg-slate-100 border border-slate-300 text-slate-900 font-extrabold text-xs hover:border-brand-blue hover:bg-white transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /><span>Phân tích ảnh khác</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
