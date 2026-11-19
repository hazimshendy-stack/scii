import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocale } from '../context/LocaleContext';
import {
  BookOpen,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  ShieldCheck,
  Bookmark,
  Eye,
  ArrowLeft,
  ArrowRight,
  Info,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Users,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Mail,
} from 'lucide-react';

/**
 * Fudul Magazine — static digital viewer.
 *
 * The 39 pages are pre-rendered at build/preparation time into watermarked
 * WebP images (public/magazine/fudul-issue-1/{desktop,mobile}/pNNN.webp).
 * The original PDF is never placed in the public directory and is never
 * referenced by this page. There is no backend and no API.
 *
 * Client-side protections (context menu, selection, drag, copy/cut, print,
 * and keyboard shortcuts) are FRICTION ONLY. Anyone with developer tools can
 * bypass them. They are documented as such in the UI and in the security report.
 */

const PAGE_COUNT = 39;
/** Vite's BASE_URL is "/" locally and "/sci/" on GitHub Pages. */
const ISSUE_BASE = `${import.meta.env.BASE_URL}magazine/fudul-issue-1`;
const MOBILE_BREAKPOINT = 768;
/** Master page proportions (595.5 x 842.25 pt) so the frame never jumps while loading. */
const PAGE_ASPECT = '595.5 / 842.25';

type Variant = 'desktop' | 'mobile';
type LoadState = 'loading' | 'ready' | 'error';

const variantForWidth = (width: number): Variant => (width < MOBILE_BREAKPOINT ? 'mobile' : 'desktop');
const pageSrc = (n: number, variant: Variant) =>
  `${ISSUE_BASE}/${variant}/p${String(n).padStart(3, '0')}.webp`;

const READER_CSS = `
.fodol-reader, .fodol-reader * {
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-drag: none;
}
.fodol-reader img {
  pointer-events: none;
  -webkit-user-drag: none;
}
.fodol-page-enter {
  animation: fodol-page-enter 420ms ease-out both;
}
@keyframes fodol-page-enter {
  from { opacity: 0; transform: translateX(var(--fodol-dx, 24px)); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .fodol-page-enter { animation: none; }
}
@media print {
  .fodol-reader-section { display: none !important; }
}
`;

export const MagazineView: React.FC = () => {
  const { t, dir } = useLocale();
  const isRtl = dir === 'rtl';
  const ArrowBackIcon = isRtl ? ArrowRight : ArrowLeft;
  const PrevIcon = isRtl ? ArrowRight : ArrowLeft;
  const NextIcon = isRtl ? ArrowLeft : ArrowRight;
  /** Keyboard / swipe direction that advances to the next page. */
  const forwardKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
  const backKey = isRtl ? 'ArrowRight' : 'ArrowLeft';

  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [variant, setVariant] = useState<Variant>(() =>
    typeof window === 'undefined' ? 'desktop' : variantForWidth(window.innerWidth)
  );
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [attempt, setAttempt] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = window.setTimeout(() => setToastMessage(null), 4500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const goTo = useCallback(
    (target: number, d: 1 | -1) => {
      const clamped = Math.min(Math.max(target, 1), PAGE_COUNT);
      if (clamped === page) return;
      setDirection(d);
      setLoadState('loading');
      setPage(clamped);
    },
    [page]
  );

  const goPrev = useCallback(() => goTo(page - 1, -1), [goTo, page]);
  const goNext = useCallback(() => goTo(page + 1, 1), [goTo, page]);

  // Responsive variant (desktop vs mobile image set).
  useEffect(() => {
    const onResize = () => setVariant(variantForWidth(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Preload the next page so turning forward is instant.
  useEffect(() => {
    if (page < PAGE_COUNT) {
      const img = new Image();
      img.src = pageSrc(page + 1, variant);
    }
  }, [page, variant]);

  // Sync fullscreen state.
  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  /**
   * Client-side deterrents. Friction only: DevTools bypasses all of them.
   */
  useEffect(() => {
    const notify = () =>
      showToast(
        t(
          'هذا المحتوى مخصص للقراءة الرقمية فقط عبر مبادرة Sci Infinity لحماية حقوق النشر.',
          'This content is protected for online reading only via Sci Infinity Initiative to safeguard publication rights.'
        )
      );

    const inReader = () => {
      const el = containerRef.current;
      return !!el && !!document.activeElement && el.contains(document.activeElement);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();

      if (e.key === 'F12') {
        e.preventDefault();
        notify();
        return;
      }
      if (mod && e.shiftKey && ['i', 'j', 'c', 'k'].includes(k)) {
        e.preventDefault();
        notify();
        return;
      }
      if (mod && ['s', 'p', 'u', 'a', 'c', 'x'].includes(k)) {
        e.preventDefault();
        notify();
        return;
      }
      if (!mod && !e.altKey && (inReader() || isFullscreen)) {
        if (e.key === forwardKey) {
          e.preventDefault();
          goNext();
        } else if (e.key === backKey) {
          e.preventDefault();
          goPrev();
        }
      }
    };

    const onCopyOrCut = (e: ClipboardEvent) => {
      e.preventDefault();
      notify();
    };

    const onSelectStart = (e: Event) => {
      const el = containerRef.current;
      if (el && e.target instanceof Node && el.contains(e.target)) e.preventDefault();
    };

    const onBeforePrint = () => notify();

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('copy', onCopyOrCut);
    document.addEventListener('cut', onCopyOrCut);
    document.addEventListener('selectstart', onSelectStart);
    window.addEventListener('beforeprint', onBeforePrint);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('copy', onCopyOrCut);
      document.removeEventListener('cut', onCopyOrCut);
      document.removeEventListener('selectstart', onSelectStart);
      window.removeEventListener('beforeprint', onBeforePrint);
    };
  }, [t, showToast, isFullscreen, forwardKey, backKey, goNext, goPrev]);

  const handleZoom = (delta: number) => setZoomLevel((p) => Math.min(Math.max(p + delta, 60), 200));
  const resetZoom = () => setZoomLevel(100);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {
        showToast(
          t('وضع ملء الشاشة غير مدعوم في هذا المتصفح.', 'Fullscreen mode is not supported in this browser.')
        );
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const scrollToViewer = () => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(
      t(
        'أنت الآن في عارض الإصدار الأول لمجلة فضول | Sci Infinity',
        'You are now viewing Fudul Issue 1 Viewer | Sci Infinity'
      )
    );
  };

  const handleProtectedAction = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast(
      t(
        'المحتوى متاح للمطالعة المباشرة فقط لحماية حقوق الطبع والنشر الخاصة بمجلة فضول.',
        'Content is available for direct reading only to protect Fudul Magazine copyright.'
      )
    );
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? startX) - startX;
    if (Math.abs(dx) < 50) return;
    const movedLeft = dx < 0;
    const forward = isRtl ? !movedLeft : movedLeft;
    if (forward) goNext();
    else goPrev();
  };

  const pageUrl = pageSrc(page, variant);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <style>{READER_CSS}</style>

      {/* 1. Hero Header */}
      <header className="w-full pb-8 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col items-start gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-ocean">
              <ArrowBackIcon className="w-3.5 h-3.5" />
              <span>{t('المنصة التحريرية والنشر العلمي لمبادرة Sci Infinity', 'Editorial & Science Publishing — Sci Infinity Initiative')}</span>
            </span>
            <div className="flex items-baseline flex-wrap gap-x-4 gap-y-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold brand-gradient-text tracking-tight">
                {t('مجلة فضول', 'Fudul Magazine')}
              </h1>
              <span className="inline-flex items-center px-3 py-1 rounded-md bg-brand-purple/15 text-brand-purple font-bold text-xs">
                {t('الإصدار الأول', 'Inaugural Issue')}
              </span>
              <span className="text-xs text-gray-500 dir-ltr font-sans">Sci Infinity</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
              {t(
                'الإصدار التحريري الأول لمبادرة Sci Infinity، المعني بنشر المعرفة العلمية وتبسيطها. يمكنك تصفح المجلة كاملةً مباشرةً عبر العارض التفاعلي أدناه.',
                'The inaugural editorial issue of Sci Infinity Initiative, dedicated to communicating research. Browse the full magazine via the interactive reader below.'
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('قراءة رقمية حصرية', 'Exclusive Digital Reading')}</span>
            </div>
            <button
              onClick={scrollToViewer}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl brand-gradient-bg text-white font-bold text-sm shadow-md transition-all hover:opacity-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('بدء القراءة التفاعلية', 'Interactive Reader')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Advanced Reader */}
      <section aria-label={t('عارض مجلة فضول', 'Fudul Magazine Viewer')} className="fodol-reader-section w-full flex flex-col items-center">
        <div
          ref={containerRef}
          className={`fodol-reader w-full rounded-3xl overflow-hidden flex flex-col bg-slate-900 shadow-2xl border border-gray-800 transition-all duration-300 ${
            isFullscreen ? 'p-0 h-screen rounded-none' : ''
          }`}
          onContextMenu={handleProtectedAction}
          onDragStart={(e) => e.preventDefault()}
        >
          {/* Premium Toolbar */}
          <div className="w-full px-5 sm:px-7 py-3 bg-gradient-to-r from-slate-800 to-slate-900 flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 select-none">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-7 h-7 rounded-lg brand-gradient-bg flex items-center justify-center shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-extrabold text-sm text-white">{t('مجلة فضول', 'Fudul Magazine')}</span>
              <span className="text-slate-600">•</span>
              <span className="font-medium">{t('الإصدار الأول', 'Issue 01')}</span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="hidden sm:inline px-2 py-0.5 rounded-md bg-slate-700 font-bold text-slate-300 text-[11px]">
                {PAGE_COUNT} {t('صفحة', 'Pages')}
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/80 text-slate-300 text-xs font-medium border border-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-purple" />
              <span>{t('محتوى محمي • للمطالعة فقط', 'Protected • Read-Only')}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg bg-slate-800 p-0.5 shadow-inner border border-slate-700">
                <button
                  type="button"
                  onClick={() => handleZoom(-15)}
                  title={t('تصغير', 'Zoom Out')}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-xs font-semibold text-slate-300 min-w-[42px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={() => handleZoom(15)}
                  title={t('تكبير', 'Zoom In')}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                {zoomLevel !== 100 && (
                  <button
                    type="button"
                    onClick={resetZoom}
                    title={t('إعادة ضبط القياس', 'Reset Zoom')}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-700 hover:text-white transition-colors border-s border-slate-700"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={toggleFullscreen}
                title={isFullscreen ? t('إنهاء ملء الشاشة', 'Exit Fullscreen') : t('ملء الشاشة', 'Fullscreen')}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Viewport */}
          <div
            className={`w-full overflow-auto bg-slate-950 flex p-2 sm:p-6 md:p-8 ${
              isFullscreen ? 'flex-1 h-full' : 'h-[72vh] sm:h-[78vh] min-h-[560px]'
            }`}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Side prev button */}
            <button
              type="button"
              onClick={goPrev}
              disabled={page <= 1}
              className="fixed left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-800/90 hover:bg-slate-700 text-white flex items-center justify-center shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 backdrop-blur-sm hidden lg:flex"
              aria-label={t('الصفحة السابقة', 'Previous Page')}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div
              style={{ width: `${zoomLevel}%`, transition: 'width 0.2s ease', aspectRatio: PAGE_ASPECT, margin: 'auto' }}
              className="shrink-0 relative bg-white shadow-2xl overflow-hidden rounded-sm"
            >
              {loadState === 'error' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-amber-50 p-6 text-center">
                  <AlertTriangle className="w-7 h-7 text-amber-700" />
                  <p className="text-sm font-medium text-amber-900 max-w-xs">
                    {t('تعذر تحميل الصفحة.', 'This page could not be loaded.')}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setLoadState('loading');
                      setAttempt((a) => a + 1);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg brand-gradient-bg text-white text-xs font-bold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{t('إعادة المحاولة', 'Retry')}</span>
                  </button>
                </div>
              ) : (
                <>
                  {loadState === 'loading' && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-slate-100">
                      <Loader2 className="w-6 h-6 animate-spin text-brand-purple" />
                      <span className="text-xs font-medium text-gray-500">{t('جارٍ التحميل…', 'Loading…')}</span>
                    </div>
                  )}
                  <div key={page} className="fodol-page-enter absolute inset-0" style={{ ['--fodol-dx' as string]: `${direction * 24}px` }}>
                    <img
                      key={`${page}-${variant}-${attempt}`}
                      src={pageUrl}
                      alt={t(`صفحة ${page} من ${PAGE_COUNT}`, `Page ${page} of ${PAGE_COUNT}`)}
                      className="w-full h-full object-contain block"
                      draggable={false}
                      onLoad={() => setLoadState('ready')}
                      onError={() => setLoadState('error')}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Side next button */}
            <button
              type="button"
              onClick={goNext}
              disabled={page >= PAGE_COUNT}
              className="fixed right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-800/90 hover:bg-slate-700 text-white flex items-center justify-center shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 backdrop-blur-sm hidden lg:flex"
              aria-label={t('الصفحة التالية', 'Next Page')}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Navigation Bar */}
          <div className="w-full px-5 sm:px-7 py-3 bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-between gap-3 border-t border-slate-700 select-none">
            <button
              type="button"
              onClick={goPrev}
              disabled={page <= 1}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-200 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-slate-600"
            >
              <PrevIcon className="w-3.5 h-3.5" />
              <span>{t('السابقة', 'Previous')}</span>
            </button>

            <div className="flex items-center gap-3 text-xs font-bold text-slate-300" aria-live="polite">
              <span>{t('صفحة', 'Page')}</span>
              <span className="px-3 py-1.5 rounded-lg brand-gradient-bg text-white tabular-nums shadow-sm" dir="ltr">
                {page} / {PAGE_COUNT}
              </span>
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={page >= PAGE_COUNT}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-200 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-slate-600"
            >
              <span>{t('التالية', 'Next')}</span>
              <NextIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {toastMessage && (
            <div className="w-full px-5 py-3 brand-gradient-bg text-white text-center text-xs font-bold">
              {toastMessage}
            </div>
          )}
        </div>

        {/* Notice */}
        <div className="w-full mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>{t('تنويه حقوقي:', 'Copyright Notice:')}</strong> {t(
              'هذه المجلة إصدار مستقل غير تابع لأي دار نشر أو مؤسسة. وتُتاح حصريًا عبر هذه النسخة الرقمية للاطلاع والقراءة فقط، دون السماح بتنزيلها أو نسخها أو إعادة نشرها أو استغلال محتواها أو بيعها بأي شكل من الأشكال.',
              'This magazine is an independent edition not affiliated with any publisher or institution. It is exclusively available through this digital copy for browsing and reading only, and downloading, copying, republishing, exploiting its content, or selling it in any form is strictly prohibited.'
            )}
          </p>
        </div>
      </section>

      {/* 3. Editorial Team & Review Process */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editorial Team */}
        <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl brand-gradient-bg flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900">{t('هيئة التحرير', 'Editorial Board')}</h2>
          </div>

          <div className="space-y-5">
            {/* Editor-in-Chief */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-purple/5 to-brand-cyan/5 border border-brand-purple/15">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-purple block mb-2">
                {t('رئيس التحرير', 'Editor-in-Chief')}
              </span>
              <p className="font-extrabold text-gray-900 text-base">عبدالرحمن سعد</p>
            </div>

            {/* Editorial Team */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-ocean block">
                {t('فريق التحرير', 'Editorial Team')}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="font-bold text-gray-900 text-sm">عمر محمد السيد</p>
                  <p className="text-[11px] text-gray-500">{t('مسؤول المراجعة العلمية', 'Scientific Review Officer')}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="font-bold text-gray-900 text-sm">عمرو خالد عثمان</p>
                  <p className="text-[11px] text-gray-500">{t('مسؤول المراجعة العلمية', 'Scientific Review Officer')}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 sm:col-span-2">
                  <p className="font-bold text-gray-900 text-sm">غنى قاسم</p>
                  <p className="text-[11px] text-gray-500">{t('مسؤول التصميم والإخراج', 'Design & Layout Officer')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Peer Review Process */}
        <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl brand-gradient-bg flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900">{t('آلية التحكيم العلمي', 'Peer Review Process')}</h2>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            {t(
              'تخضع جميع المقالات المقدمة إلى مجلة SCI INFINITY لعملية مراجعة علمية وتحريرية منظمة، بهدف ضمان دقة المحتوى وجودته وملاءمته العلمية.',
              'All articles submitted to SCI INFINITY Magazine undergo a structured scientific and editorial review process to ensure accuracy, quality, and scientific relevance.'
            )}
          </p>

          <div className="space-y-3">
            {[
              { step: '01', ar: 'المراجعة الأولية', en: 'Initial Screening', desc_ar: 'فحص المقال من قبل هيئة التحرير للتأكد من توافقه مع نطاق المجلة ومعايير الجودة.', desc_en: 'The article is screened by the editorial board for scope and quality standards.' },
              { step: '02', ar: 'المراجعة العلمية', en: 'Scientific Review', desc_ar: 'مراجعة علمية من قبل متخصصين أو طلاب ذوي خبرة تحت إشراف أكاديمي.', desc_en: 'Scientific review by specialists or experienced students under academic supervision.' },
              { step: '03', ar: 'التحرير اللغوي والعلمي', en: 'Editorial Refinement', desc_ar: 'تحسين الصياغة اللغوية وتنظيم المحتوى مع الحفاظ على الدقة العلمية.', desc_en: 'Language refinement and content organization while maintaining scientific accuracy.' },
              { step: '04', ar: 'الاعتماد النهائي', en: 'Final Approval', desc_ar: 'اعتماد المقال للنشر من قبل رئيس التحرير.', desc_en: 'Article approved for publication by the Editor-in-Chief.' },
              { step: '05', ar: 'الإخراج والنشر', en: 'Layout & Publication', desc_ar: 'تنسيق المقال بصرياً وإدراجه ضمن العدد النهائي للمجلة.', desc_en: 'Visual layout and integration into the final magazine issue.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="w-7 h-7 rounded-lg brand-gradient-bg text-white text-[11px] font-extrabold flex items-center justify-center shrink-0 shadow-sm">
                  {item.step}
                </span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t(item.ar, item.en)}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{t(item.desc_ar, item.desc_en)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-brand-purple/5 border border-brand-purple/15 text-xs text-brand-purple font-semibold">
            {t(
              'تعتمد المجلة نظام المراجعة أحادية التعمية (SINGLE-BLIND REVIEW)، حيث يقوم المراجعون بتقييم المحتوى دون معرفة هوية المؤلفين.',
              'The magazine adopts the SINGLE-BLIND REVIEW system, where reviewers evaluate content without knowing the authors\' identities.'
            )}
          </div>
        </div>
      </section>

      {/* 4. Publication Ethics & How to Submit */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Publication Ethics */}
        <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl brand-gradient-bg flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900">{t('سياسة أخلاقيات النشر', 'Publication Ethics Policy')}</h2>
          </div>
          <ul className="space-y-3">
            {[
              { ar: 'تلتزم المجلة بمنع الانتحال العلمي بجميع أشكاله.', en: 'The magazine is committed to preventing plagiarism in all its forms.' },
              { ar: 'يجب توثيق جميع المصادر والمراجع المستخدمة.', en: 'All sources and references used must be documented.' },
              { ar: 'يلتزم المؤلفون بضمان أصالة المحتوى ودقته العلمية.', en: 'Authors are committed to ensuring the originality and scientific accuracy of the content.' },
              { ar: 'تخضع جميع المشاركات لمعايير النزاهة الأكاديمية.', en: 'All submissions are subject to academic integrity standards.' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full brand-gradient-bg shrink-0 mt-2" />
                {t(item.ar, item.en)}
              </li>
            ))}
          </ul>
        </div>

        {/* How to Submit */}
        <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl brand-gradient-bg flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900">{t('كيفية التقديم', 'How to Submit')}</h2>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            {t(
              'ترحب "مجلة فضول" باستقبال المقالات العلمية من الطلاب والباحثين في مجالات العلوم والتكنولوجيا، مع الالتزام بمعايير الجودة والدقة العلمية.',
              '"Fudul Magazine" welcomes scientific articles from students and researchers in science and technology, with commitment to quality and scientific accuracy standards.'
            )}
          </p>

          <div className="space-y-3 text-sm">
            {[
              { title_ar: 'شروط المقال', title_en: 'Article Requirements', items_ar: ['أصلي وغير منشور مسبقاً', 'مبسط علمياً لغير المتخصصين', '800 إلى 2000 كلمة'], items_en: ['Original and unpublished', 'Scientifically simplified for non-specialists', '800 to 2000 words'] },
              { title_ar: 'التنسيق المطلوب', title_en: 'Required Format', items_ar: ['عنوان رئيسي + مقدمة + محتوى بعناوين فرعية + خاتمة', 'اللغة: عربية أو إنجليزية', 'مصادر علمية موثقة (APA / Vancouver)'], items_en: ['Title + Introduction + Sectioned Body + Conclusion', 'Language: Arabic or English', 'Cited scientific sources (APA / Vancouver)'] },
            ].map((section, si) => (
              <div key={si} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <p className="font-bold text-gray-900 text-sm mb-2">{t(section.title_ar, section.title_en)}</p>
                <ul className="space-y-1">
                  {section.items_ar.map((item, ii) => (
                    <li key={ii} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-purple/60 shrink-0 mt-1.5" />
                      {t(item, section.items_en[ii])}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl brand-gradient-bg text-white flex items-center gap-3">
            <Mail className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold text-sm">{t('إرسال المقالات عبر البريد الإلكتروني:', 'Submit articles via email:')}</p>
              <p className="text-xs text-white/90 font-mono mt-0.5">sci_infinity_official@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Editorial Info Cards */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-gray-200 flex flex-col justify-between space-y-3 shadow-sm hover:border-brand-purple/40 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-gray-900 brand-gradient-text">{t('مجلة فضول', 'Fudul Magazine')}</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {t(
              'الإصدار التحريري لمبادرة Sci Infinity؛ المعني بنشر المعرفة العلمية وتبسيطها بأسلوب رصين وموثوق.',
              'The editorial publication of Sci Infinity Initiative, dedicated to communicating research with academic rigor.'
            )}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-gray-200 flex flex-col justify-between space-y-3 shadow-sm hover:border-brand-purple/40 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-ocean/10 text-brand-ocean flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-gray-900">{t('الإصدار الأول', 'Inaugural Issue')}</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {t(
              'النسخة الافتتاحية للمجلة. يغطي مقالات في التكنولوجيا الحيوية، وتطبيقات النانو تكنولوجي، ومسارات البحث العلمي.',
              'Inaugural edition featuring biotechnology insights, nanotechnology applications, and research pathways.'
            )}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-gray-200 flex flex-col justify-between space-y-3 shadow-sm hover:border-brand-purple/40 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 text-brand-cyan flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-gray-900">
              {t('تجربة قراءة رحبة ومحمية', 'Protected Reading Experience')}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {t(
              'صُمم العارض بدقة لراحة العين دون أي مشتتات، مع توفير أدوات التنقل والتكبير والشاشة الكاملة وعلامة مائية ثابتة على كل صفحة.',
              'Viewer precision-crafted for ocular comfort and distraction-free focus, with page navigation, zoom, full-screen reading, and a fixed watermark on every page.'
            )}
          </p>
        </div>
      </section>
    </div>
  );
};
