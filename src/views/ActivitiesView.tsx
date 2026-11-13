import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { activities } from '../data/seedData';
import { publicAsset } from '../lib/publicAsset';
import { Search, Calendar, MapPin, ArrowLeft, ArrowRight, CheckCircle2, Video } from 'lucide-react';

export const ActivitiesView: React.FC = () => {
  const { locale, t, dir } = useLocale();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'recorded', labelAr: 'جلسات مسجلة', labelEn: 'Recorded Sessions' },
    { id: 'camp', labelAr: 'المعسكرات', labelEn: 'Camps' },
    { id: 'workshop', labelAr: 'ورش العمل', labelEn: 'Workshops' },
    { id: 'training', labelAr: 'البرامج التدريبية', labelEn: 'Training Programs' },
    { id: 'session', labelAr: 'الجلسات العلمية', labelEn: 'Scientific Sessions' },
    { id: 'team', labelAr: 'أنشطة الفريق', labelEn: 'Team Activities' },
  ];

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'team':
        return { labelAr: 'أنشطة الفريق', labelEn: 'Team Activities', color: 'bg-brand-purple/10 text-brand-purple border-brand-purple/20' };
      case 'conference':
        return { labelAr: 'منتدى / مؤتمر', labelEn: 'Forum / Conference', color: 'bg-brand-purple/10 text-brand-purple border-brand-purple/20' };
      case 'camp':
        return { labelAr: 'معسكر تدريبي', labelEn: 'Camp', color: 'bg-brand-cyan/15 text-brand-ocean border-brand-cyan/30' };
      case 'workshop':
        return { labelAr: 'ورشة عمل', labelEn: 'Workshop', color: 'bg-brand-ocean/10 text-brand-ocean border-brand-ocean/20' };
      case 'training':
        return { labelAr: 'برنامج تدريبي', labelEn: 'Training Track', color: 'bg-brand-purple/10 text-brand-purple border-brand-purple/20' };
      case 'session':
        return { labelAr: 'جلسة علمية', labelEn: 'Scientific Session', color: 'bg-brand-cyan/15 text-brand-ocean border-brand-cyan/30' };
      default:
        return { labelAr: 'فعالية', labelEn: 'Activity', color: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  const hasRecording = (act: (typeof activities)[0]) =>
    !!(act.youtube_url || act.youtube_playlist_url || (act.youtube_videos && act.youtube_videos.length > 0) || (act.facebook_videos && act.facebook_videos.length > 0));

  // Ordering by aspect-ratio clusters (side-by-side matching sizes) and newest-first within each cluster
  const aspectGroupOrder: Record<string, number> = {
    // Group 1: 1:1 Square posters (newest first)
    'arps-workshop-medical-physics-2026': 101,
    'entrepreneurship-business-camp': 102,
    'etss-entrepreneurship-training-stem': 103,
    'bioinformatics-drug-discovery-session': 104,
    'medical-rep-career-gateway': 105,
    'scientific-figures-biorender-workshop': 106,

    // Group 2: 4:3 Standard cards (526x441)
    'atomic-absorption-spectrometer-course': 201,
    'industrial-detergents-workshop': 202,
    'chemistry-cosmetic-industry-nov': 203,
    'human-pluripotent-stem-cells-session': 204,
    'chemical-biosensors-environmental-applications': 205,
    'rd-detergents-cosmetics-session': 206,
    'plant-biotechnology-applications': 207,
    'synthetic-biology-fields-applications': 208,
    'chemistry-cosmetic-industry-july': 209,
    'water-analysis-treatment-training': 210,

    // Group 3: 16:9 Wide Banners
    'orientation-day-sci-infinity': 301,
    'pr-training-program': 302,
    'scientific-research-program': 303,

    // Group 4: Portrait
    'ideation-camp-creativa': 401,
  };

  const filtered = activities
    .filter((act) => act.slug !== '1st-forum-specialized-programs' && act.slug !== '2nd-forum-specialized-programs')
    .sort((a, b) => (aspectGroupOrder[a.slug] || 999) - (aspectGroupOrder[b.slug] || 999))
    .filter((act) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'recorded' ? hasRecording(act) : act.category === selectedCategory);
      const query = search.trim().toLowerCase();
    if (!query) return matchesCategory;

    const matchesSearch =
      act.title_ar.toLowerCase().includes(query) ||
      act.title_en.toLowerCase().includes(query) ||
      act.summary_ar.toLowerCase().includes(query) ||
      act.summary_en.toLowerCase().includes(query) ||
      (act.location_ar && act.location_ar.toLowerCase().includes(query)) ||
      (act.location_en && act.location_en.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight brand-gradient-text">
          {t('الأنشطة والمعسكرات العلمية', 'Activities & Scientific Camps')}
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          {t(
            'أرشيف توثيقي شامل يضم المعسكرات التدريبية والورش المتخصصة والجلسات العلمية التي نفذتها مبادرة ساي إنفينيتي، مزودة بكافة الفيديوهات المسجلة والتغطيات الرسمية.',
            'Comprehensive documentation archive featuring specialized camps, training programs, and workshops delivered by Sci Infinity, with embedded video lectures and official media.'
          )}
        </p>

        {/* Highlight link to Annual Forum */}
        <div className="pt-2">
          <Link
            to={`/${locale}/annual-forum`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl brand-gradient-bg text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-95 transition-all"
          >
            <span>{t('صفحة المنتدى السنوي لطلاب البرامج النوعية', 'Specialized Programs Annual Forum Hub')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === c.id
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {c.id === 'recorded' && <Video className="w-3.5 h-3.5" />}
              {t(c.labelAr, c.labelEn)}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('ابحث في الأنشطة أو المحاور...', 'Search activities or topics...')}
            className="w-full ps-9 pe-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-purple focus:bg-white transition-colors"
          />
        </div>

      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          {t(`عرض ${filtered.length} من أصل ${activities.length} فعالية ونشاط`, `Showing ${filtered.length} of ${activities.length} total activities`)}
        </span>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="font-medium text-brand-ocean hover:underline"
          >
            {t('عرض جميع الفئات', 'Show all categories')}
          </button>
        )}
      </div>

      {/* Activities Grid */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-gray-50 border border-gray-200 space-y-3">
          <p className="text-gray-600 text-base font-medium">
            {t('لا توجد أنشطة مطابقة لبحثك حالياً.', 'No matching activities found.')}
          </p>
          <button 
            onClick={() => { setSearch(''); setSelectedCategory('all'); }}
            className="text-sm font-semibold text-brand-ocean hover:underline"
          >
            {t('إعادة تعيين الفلاتر', 'Reset filters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((act) => {
            const badge = getCategoryBadge(act.category);
            const hasMedia = act.youtube_url || act.youtube_playlist_url || (act.youtube_videos && act.youtube_videos.length > 0) || (act.facebook_videos && act.facebook_videos.length > 0);

            return (
              <Link
                key={act.id}
                to={`/${locale}/projects-activities/${act.slug}`}
                className="rounded-3xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between group"
              >
                {/* Activity Photo — Full Natural Size, No Awkward Crop */}
                {act.image_url ? (
                  <div className="relative w-full overflow-hidden bg-gray-50 flex items-center justify-center p-3 border-b border-gray-100">
                    <img
                      src={publicAsset(act.image_url)}
                      alt={t(act.title_ar, act.title_en)}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto max-h-64 object-contain rounded-2xl group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                ) : null}

                <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] border ${badge.color}`}>
                        {t(badge.labelAr, badge.labelEn)}
                      </span>
                      <span className="text-gray-500 flex items-center gap-1 font-medium text-[11px] shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {t(act.date_display_ar, act.date_display_en)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg sm:text-xl text-gray-900 group-hover:text-brand-ocean transition-colors leading-snug">
                      {t(act.title_ar, act.title_en)}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {t(act.summary_ar, act.summary_en)}
                    </p>
                  </div>

                  {/* Footer Meta */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    {/* Location if available */}
                    {act.location_ar && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <MapPin className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                        <span className="truncate">{t(act.location_ar, act.location_en || act.location_ar)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        {hasMedia ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple font-semibold text-[11px] border border-brand-purple/20">
                            <Video className="w-3 h-3" />
                            <span>{t('جلسات مسجلة', 'Recordings')}</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-500 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-ocean" />
                            <span>{t('مؤرشفة وموثقة', 'Archived')}</span>
                          </span>
                        )}
                      </div>

                      <span className="font-semibold text-brand-ocean flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>{t('التفاصيل والوسائط', 'Details & Media')}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
};
