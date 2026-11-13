import React, { useState, useEffect } from 'react';
import { useLocale } from '../context/LocaleContext';
import { activities } from '../data/seedData';
import forumPostersData from '../data/forumPosters.json';
import {
  Calendar, MapPin, Award, Video, FileText, ChevronLeft, X, Image as ImageIcon
} from 'lucide-react';
import { FacebookEmbed } from '../components/common/FacebookEmbed';

interface PosterMeta {
  id: string;
  filename: string;
  title: string;
  path?: string;
  rawPath?: string;
  thumbnail: string;
  pages: string[];
  pageCount?: number;
}

type Tab = 'posters' | 'forum2' | 'forum1';

// ─── Block right-click / keyboard shortcuts on canvas ───────────────────────
const noOp = (e: React.SyntheticEvent) => e.preventDefault();

/** Renders the first page of a PDF as a protected canvas thumbnail */
const PosterThumbnail: React.FC<{ src: string; title: string }> = ({ src, title }) => {
  return (
    <div
      className="w-full aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center relative select-none"
      onContextMenu={noOp}
      onDragStart={noOp}
    >
      <img
        src={src}
        alt={title}
        className="w-full h-full object-contain"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
        onContextMenu={noOp}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

/** Renders ALL pages of a PDF in a protected full-screen viewer */
const PosterFullViewer: React.FC<{ pages: string[]; title: string }> = ({ pages, title }) => {
  return (
    <div
      className="w-full h-full overflow-y-auto flex flex-col items-center gap-4 py-4 px-2"
      onContextMenu={noOp}
      style={{ userSelect: 'none' }}
    >
      {pages.map((page, idx) => (
        <div key={idx} className="max-w-full">
          <img
            src={page}
            alt={title}
            className="max-w-full h-auto object-contain"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
            onContextMenu={noOp}
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
};

export const AnnualForumView: React.FC = () => {
  const { t } = useLocale();

  const [activeTab, setActiveTab] = useState<Tab>('forum1');
  const [activePosterIndex, setActivePosterIndex] = useState<number | null>(null);

  const secondForum = activities.find((a) => a.slug === '2nd-forum-specialized-programs');
  const firstForum = activities.find((a) => a.slug === '1st-forum-specialized-programs');

  const posters: PosterMeta[] = forumPostersData as PosterMeta[];

  const openPoster = (index: number) => setActivePosterIndex(index);
  const closePoster = () => setActivePosterIndex(null);

  const prevPoster = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePosterIndex !== null)
      setActivePosterIndex((prev) => (prev! - 1 + posters.length) % posters.length);
  };

  const nextPoster = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePosterIndex !== null)
      setActivePosterIndex((prev) => (prev! + 1) % posters.length);
  };

  const currentPoster = activePosterIndex !== null ? posters[activePosterIndex] : null;

  // Block browser print (Ctrl+P) when viewer is open
  useEffect(() => {
    if (activePosterIndex === null) return;
    const noPrint = () => { window.print = () => {}; };
    window.addEventListener('beforeprint', noPrint);
    return () => window.removeEventListener('beforeprint', noPrint);
  }, [activePosterIndex]);

  // Keyboard navigation: Escape to close, Left/Right arrows to navigate
  useEffect(() => {
    if (activePosterIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setActivePosterIndex(null); return; }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const dir = e.key === 'ArrowLeft' ? -1 : 1;
        setActivePosterIndex((prev) => ((prev ?? 0) + dir + posters.length) % posters.length);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activePosterIndex, posters.length]);

  const tabs: { id: Tab; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      id: 'forum1',
      labelAr: 'المنتدى الأول — 2025',
      labelEn: 'First Forum — 2025',
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: 'forum2',
      labelAr: 'المنتدى الثاني — 2026',
      labelEn: 'Second Forum — 2026',
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: 'posters',
      labelAr: 'البوسترات العلمية',
      labelEn: 'Scientific Posters',
      icon: <ImageIcon className="w-4 h-4" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* ── Page Header ───────────────────────────────────────── */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight brand-gradient-text">
          {t('المنتدى السنوي لطلاب البرامج النوعية', 'Annual Forum for Specialized Programs')}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
          {t(
            'أضخم ملتقى علمي وطلابي سنوي تنظمه مبادرة ساي إنفينيتي بالتعاون مع كلية العلوم بجامعة المنصورة، يجمع طلاب البرامج النوعية المتخصصة لعرض البوسترات البحثية والمشاريع الابتكارية.',
            'The flagship annual student research forum co-organized by Sci Infinity and the Faculty of Science at Mansoura University, uniting specialized academic programs to present scientific posters and innovation projects.'
          )}
        </p>
      </div>

      {/* ── Tab Navigation ────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 justify-center border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl transition-all -mb-px border-b-2 ${
              activeTab === tab.id
                ? 'brand-gradient-bg text-white border-transparent shadow-sm'
                : 'bg-white text-gray-600 border-transparent hover:text-brand-purple hover:border-brand-purple/40'
            }`}
          >
            {tab.icon}
            {t(tab.labelAr, tab.labelEn)}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════
          TAB 1 — SCIENTIFIC POSTERS GALLERY
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'posters' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-gray-900">
                {t('البوسترات العلمية', 'Scientific Posters')}
              </h2>
              <p className="text-sm text-gray-500">
                {t(
                  'معرض البوسترات البحثية الأصلية المقدمة من طلاب وباحثي المبادرة. انقر على أي بوستر لعرضه بالحجم الكامل.',
                  'Gallery of original research posters submitted by initiative members. Click any poster to view it full-screen.'
                )}
              </p>
            </div>
            <span className="shrink-0 text-xs font-bold px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple self-start sm:self-auto">
              {posters.length} {t('بوستر', 'Posters')}
            </span>
          </div>

          {posters.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {posters.map((poster, index) => (
                <button
                  key={poster.id}
                  onClick={() => openPoster(index)}
                  className="group relative rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-brand-purple/60 transition-all duration-200 flex flex-col cursor-pointer"
                  aria-label={t(`فتح البوستر ${index + 1}`, `Open Poster ${index + 1}`)}
                >
                  {/* PDF Thumbnail */}
                  <div className="w-full overflow-hidden rounded-t-2xl">
                    <PosterThumbnail src={poster.thumbnail} title={poster.title} />
                  </div>
                  {/* Footer */}
                  <div className="p-2.5 space-y-1 text-center border-t border-gray-100">
                    <span className="text-[11px] font-bold text-gray-700 group-hover:text-brand-purple transition-colors line-clamp-2 leading-tight block">
                      {poster.title.length > 40 ? poster.title.substring(0, 40) + '…' : poster.title}
                    </span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-brand-purple/10 text-brand-purple inline-block">
                      {t('عرض', 'View')}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-brand-purple/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-2xl bg-white border border-dashed border-gray-300 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm text-gray-500">
                {t('سيتم عرض البوسترات هنا تلقائياً.', 'Posters will appear here automatically.')}
              </p>
            </div>
          )}
        </section>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB 2 — SECOND FORUM (2026)
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'forum2' && secondForum && (
        <section className="space-y-8 p-6 sm:p-10 rounded-3xl bg-white border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                {t('النسخة الثانية — 2026', 'Second Edition — 2026')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {t(secondForum.title_ar, secondForum.title_en)}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                <Calendar className="w-3.5 h-3.5 text-brand-purple" />
                {t(secondForum.date_display_ar, secondForum.date_display_en)}
              </span>
              {secondForum.location_ar && (
                <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                  <MapPin className="w-3.5 h-3.5 text-brand-ocean" />
                  {t(secondForum.location_ar, secondForum.location_en || secondForum.location_ar)}
                </span>
              )}
            </div>
          </div>

          <p className="text-base text-gray-700 leading-relaxed">
            {t(secondForum.summary_ar, secondForum.summary_en)}
          </p>

          {secondForum.facebook_url && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-gray-900">
                {t('المنشور والبيان الرسمي:', 'Official Announcement Post:')}
              </h3>
              <FacebookEmbed
                url={secondForum.facebook_url}
                type="post"
                title={t(secondForum.title_ar, secondForum.title_en)}
              />
            </div>
          )}

          {secondForum.facebook_videos && secondForum.facebook_videos.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-brand-purple" />
                <h3 className="text-base font-bold text-gray-900">
                  {t('عروض ونماذج مشاريع الطلاب:', 'Student Project Pitches & Highlights:')}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {secondForum.facebook_videos.map((vid, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <h4 className="text-xs font-bold text-gray-900">{t(vid.label_ar, vid.label_en)}</h4>
                    <FacebookEmbed url={vid.url} type="video" title={t(vid.label_ar, vid.label_en)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {secondForum.facebook_posts && secondForum.facebook_posts.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                {t('التغطيات والجوائز الموثقة:', 'Documented Coverage & Awards:')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {secondForum.facebook_posts.map((post, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-900">{t(post.label_ar, post.label_en)}</span>
                      {post.group && (
                        <span className="px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] font-semibold uppercase">
                          {post.group}
                        </span>
                      )}
                    </div>
                    <FacebookEmbed url={post.url} type="post" title={t(post.label_ar, post.label_en)} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB 3 — FIRST FORUM (2025)
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'forum1' && firstForum && (
        <section className="space-y-8 p-6 sm:p-10 rounded-3xl bg-white border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-ocean/10 text-brand-ocean border border-brand-ocean/20">
                {t('النسخة الأولى — 2025', 'First Edition — 2025')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {t(firstForum.title_ar, firstForum.title_en)}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                <Calendar className="w-3.5 h-3.5 text-brand-purple" />
                {t(firstForum.date_display_ar, firstForum.date_display_en)}
              </span>
              {firstForum.location_ar && (
                <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                  <MapPin className="w-3.5 h-3.5 text-brand-ocean" />
                  {t(firstForum.location_ar, firstForum.location_en || firstForum.location_ar)}
                </span>
              )}
            </div>
          </div>

          <p className="text-base text-gray-700 leading-relaxed">
            {t(firstForum.summary_ar, firstForum.summary_en)}
          </p>

          {firstForum.facebook_url && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-gray-900">
                {t('المنشور والبيان الرسمي:', 'Official Announcement Post:')}
              </h3>
              <FacebookEmbed
                url={firstForum.facebook_url}
                type="post"
                title={t(firstForum.title_ar, firstForum.title_en)}
              />
            </div>
          )}

          {firstForum.facebook_posts && firstForum.facebook_posts.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                {t('التغطيات وجداول الفعاليات الموثقة:', 'Documented Program & Results:')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {firstForum.facebook_posts.map((post, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <span className="text-xs font-bold text-gray-900 block">{t(post.label_ar, post.label_en)}</span>
                    <FacebookEmbed url={post.url} type="post" title={t(post.label_ar, post.label_en)} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ════════════════════════════════════════════════════════
          FULL-SCREEN POSTER VIEWER — pdfjs canvas (protected, no download)
      ════════════════════════════════════════════════════════ */}
      {currentPoster && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col"
          onClick={closePoster}
          onContextMenu={noOp}
          style={{ userSelect: 'none' }}
        >
          {/* Top bar */}
          <div
            className="shrink-0 w-full flex items-center justify-between text-white px-4 py-3 border-b border-white/10 bg-black/40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev arrow */}
            <button
              type="button"
              onClick={prevPoster}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={t('السابق', 'Previous')}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Title + counter */}
            <div className="flex flex-col items-center gap-0.5 min-w-0 px-3">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-purple text-white shrink-0">
                {activePosterIndex! + 1} / {posters.length}
              </span>
              <span className="text-xs font-semibold text-white/80 line-clamp-1 max-w-[200px] sm:max-w-xs text-center">
                {currentPoster.title.length > 55
                  ? currentPoster.title.substring(0, 55) + '…'
                  : currentPoster.title}
              </span>
            </div>

            {/* Close button — NO download button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={nextPoster}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label={t('التالي', 'Next')}
              >
                <ChevronLeft className="w-5 h-5 rotate-180" />
              </button>
              <button
                type="button"
                onClick={closePoster}
                className="p-2 rounded-xl bg-white/10 hover:bg-red-500/80 text-white transition-colors"
                aria-label={t('إغلاق', 'Close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Protected PDF canvas viewer */}
          <div
            className="flex-1 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={noOp}
          >
            <PosterFullViewer
              key={currentPoster.id}
              pages={currentPoster.pages}
              title={currentPoster.title}
            />
          </div>

          <div
            className="shrink-0 text-center text-[11px] text-white/40 py-2 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {t('اضغط خارج النافذة للإغلاق · استخدم الأسهم للتنقل', 'Click outside to close · Use arrows to navigate')}
          </div>
        </div>
      )}

    </div>
  );
};