import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { activities, magazineIssues, podcastEpisodes } from '../data/seedData';
import { ArrowLeft, ArrowRight, Calendar, Play, Headphones } from 'lucide-react';
import { publicAsset } from '../lib/publicAsset';
import { InstitutionalAccordion } from '../components/common/InstitutionalAccordion';
import { partnersDirectory } from '../data/partnersData';

export const HomeView: React.FC = () => {
  const { locale, t, dir } = useLocale();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  // Dynamically sort activities and podcast episodes: newest first
  // Activities sort: newest first, excluding forum activities
  const dynamicActivities = activities.filter(
    (act) => act.slug !== '1st-forum-specialized-programs' && act.slug !== '2nd-forum-specialized-programs'
  );
  const dynamicEpisodes = [...podcastEpisodes].sort((a, b) => b.episode_number - a.episode_number);

  return (
    <div className="space-y-16 sm:space-y-20 py-8 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-4 pb-4">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-cyan/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 max-w-4xl mx-auto leading-tight">
            {t('نحو آفاق', 'Towards')} <span className="brand-gradient-text">{t('لا نهائية', 'Infinite Horizons')}</span> {t('من المعرفة والبحث', 'of Knowledge & Research')}
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
            {t(
              'مبادرة غير هادفة للربح، متخصصة في البحث العلمي وريادة الأعمال، تسعى إلى تمكين الشباب وتطوير قدراتهم البحثية والابتكارية.',
              'A non-profit initiative specializing in scientific research and entrepreneurship, dedicated to empowering young people and developing their research and innovation capabilities.'
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to={`/${locale}/join-us`}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white brand-gradient-bg shadow-md shadow-brand-purple/25 hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              <span>{t('تطوع معنا', 'Volunteer With Us')}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
            <Link
              to={`/${locale}/projects-activities`}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-all flex items-center justify-center gap-2"
            >
              <span>{t('استكشف الأنشطة', 'Explore Activities')}</span>
            </Link>
          </div>

          {/* Institutional Overview: Vision, Mission, Strategic Objectives, Core Values (Accordion) */}
          <div className="pt-8 max-w-5xl mx-auto text-start">
            <InstitutionalAccordion initialOpen={[]} />
          </div>

          {/* Key Metrics Strip — Plain Bold Numbers Without Circles */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-purple">+150</div>
              <div className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">{t('أعضاء الفريق', 'Team Members')}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-purple">11</div>
              <div className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">{t('لجنة تخصصية', 'Specialized Committees')}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm text-center col-span-2 sm:col-span-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-purple">+20</div>
              <div className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">{t('التدريبات والورش العلمية', 'Scientific Trainings & Workshops')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ANNUAL FORUM SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-brand-purple/5 via-white to-brand-cyan/5 border border-gray-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-start">
            <Link
              to={`/${locale}/annual-forum`}
              className="group inline-block focus:outline-none"
            >
              <h2 className="text-2xl sm:text-4xl font-extrabold brand-gradient-text leading-tight group-hover:opacity-85 transition-opacity">
                {t('المنتدى السنوي لطلاب البرامج النوعية', 'Annual Forum for Specialized Programs')}
              </h2>
            </Link>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {t(
                'تنظم مبادرة ساي إنفينيتي سنوياً بالتعاون مع كلية العلوم بجامعة المنصورة أضخم ملتقى علمي لطلاب البرامج الأكاديمية المتخصصة، يشمل مسابقات البوسترات البحثية والمشاريع الابتكارية والريادية.',
                'Organized annually by Sci Infinity in collaboration with the Faculty of Science at Mansoura University, uniting specialized students to present scientific posters and pitch applied entrepreneurial solutions.'
              )}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to={`/${locale}/annual-forum`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold brand-gradient-bg text-white hover:opacity-95 shadow-md transition-all text-sm"
              >
                <span>{t('استكشف تفاصيل وتغطية المنتدى', 'Explore Annual Forum')}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Differentiated Editions: 2025 First Edition & 2026 Second Edition with Distinct Brand Colors */}
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
            {/* 2026 - Second Edition (Cyan / Ocean Theme) */}
            <Link
              to={`/${locale}/annual-forum`}
              className="p-6 rounded-2xl bg-white border-2 border-brand-cyan/40 shadow-sm text-center flex flex-col items-center justify-center min-w-[135px] space-y-1 hover:border-brand-cyan hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div className="text-3xl sm:text-4xl font-black text-brand-ocean">2026</div>
              <div className="text-xs font-bold text-brand-cyan">
                {t('النسخة الثانية', 'Second Edition')}
              </div>
            </Link>

            {/* 2025 - First Edition (Purple Theme) */}
            <Link
              to={`/${locale}/annual-forum`}
              className="p-6 rounded-2xl bg-white border-2 border-brand-purple/30 shadow-sm text-center flex flex-col items-center justify-center min-w-[135px] space-y-1 hover:border-brand-purple hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div className="text-3xl sm:text-4xl font-black text-brand-purple">2025</div>
              <div className="text-xs font-bold text-brand-purple">
                {t('النسخة الأولى', 'First Edition')}
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FEATURED ACTIVITIES & CAMPS (DYNAMIC: Newest First) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold brand-gradient-text">
            {t('أحدث المعسكرات والبرامج التدريبية', 'Recent Camps & Workshops')}
          </h2>
          <Link 
            to={`/${locale}/projects-activities`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ocean hover:text-brand-cyan transition-colors"
          >
            <span>{t('عرض جميع الأنشطة', 'View All Activities')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dynamicActivities.slice(0, 3).map((act) => {
            const displayImg = act.image_url || act.cover_image_url;
            return (
              <Link 
                key={act.id}
                to={`/${locale}/projects-activities/${act.slug}`}
                className="rounded-3xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between group"
              >
                {/* Dynamic Image Container if image exists — Full size, no awkward crop */}
                {displayImg && (
                  <div className="w-full bg-gray-50 border-b border-gray-100 flex items-center justify-center p-3 relative">
                    <img
                      src={publicAsset(displayImg)}
                      alt={t(act.title_ar, act.title_en)}
                      loading="lazy"
                      className="w-full h-auto max-h-52 object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-brand-purple/10 text-brand-purple font-semibold uppercase">
                        {act.category}
                      </span>
                      <span className="text-gray-500 flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-brand-ocean" />
                        {t(act.date_display_ar, act.date_display_en)}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-brand-ocean transition-colors leading-snug">
                      {t(act.title_ar, act.title_en)}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {t(act.summary_ar, act.summary_en)}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {act.event_state === 'registration_closed' 
                        ? t('التسجيل مغلق', 'Registration Closed') 
                        : t('فعالية مكتملة', 'Completed')}
                    </span>
                    <span className="font-medium text-brand-ocean flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>{t('تفاصيل', 'Details')}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. DEDICATED FODUL MAGAZINE CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <Link
            to={`/${locale}/fudul`}
            className="w-40 h-56 sm:w-48 sm:h-64 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-gray-200 bg-gray-100 flex items-center justify-center relative group cursor-pointer hover:shadow-xl transition-shadow"
            aria-label={t(magazineIssues[0].title_ar, magazineIssues[0].title_en)}
          >
            <img 
              src={publicAsset(magazineIssues[0].cover_image_url)}
              alt="Fudul Magazine Cover" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </Link>
          <div className="space-y-4 text-center md:text-start flex-1">
            <Link
              to={`/${locale}/fudul`}
              className="group inline-block focus:outline-none"
            >
              <h2 className="text-2xl sm:text-4xl font-extrabold brand-gradient-text leading-tight group-hover:opacity-85 transition-opacity">
                {t(magazineIssues[0].title_ar, magazineIssues[0].title_en)}
              </h2>
            </Link>
            <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
              {t(magazineIssues[0].description_ar, magazineIssues[0].description_en)}
            </p>
            <div className="pt-2">
              <Link
                to={`/${locale}/fudul`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold brand-gradient-bg text-white hover:opacity-95 transition-all shadow-sm"
              >
                <span>{t('تصفح أعداد وتفاصيل المجلة', 'Explore Magazine Issues')}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOUR DISTINCT SCI CAST EPISODE CARDS (DYNAMIC: Newest First) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold brand-gradient-text">
            {t('حلقات بودكاست ساي كاست (Sci Cast)', 'Sci Cast Podcast Episodes')}
          </h2>
          <Link 
            to={`/${locale}/sci-cast`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ocean hover:text-brand-cyan transition-colors"
          >
            <span>{t('صفحة البودكاست الرسمية', 'Official Podcast Hub')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dynamicEpisodes.slice(0, 4).map((ep) => {
            const hasTitle = (ep.title_ar && ep.title_ar.trim()) || (ep.title_en && ep.title_en.trim());
            const hasDesc = (ep.description_ar && ep.description_ar.trim()) || (ep.description_en && ep.description_en.trim());
            return (
              <div
                key={ep.episode_number}
                className="rounded-3xl bg-white border border-gray-200 shadow-sm hover:border-brand-purple/40 hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden"
              >
                {/* Dynamic Podcast Episode Image */}
                {ep.cover_image_url ? (
                  <Link
                    to={`/${locale}/sci-cast/episode/${ep.episode_number}`}
                    className="block relative h-40 overflow-hidden bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={publicAsset(ep.cover_image_url)}
                      alt={t(ep.title_ar, ep.title_en)}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <span className="absolute bottom-3 start-3 px-2.5 py-1 rounded-xl bg-brand-purple text-white font-bold text-xs shadow">
                      {t(`الحلقة ${ep.episode_number}`, `Episode ${ep.episode_number}`)}
                    </span>
                  </Link>
                ) : (
                  <Link
                    to={`/${locale}/sci-cast/episode/${ep.episode_number}`}
                    className="h-14 brand-gradient-bg flex items-center px-5 cursor-pointer"
                  >
                    <span className="px-2.5 py-1 rounded-lg bg-white/20 text-white font-bold text-xs">
                      {t(`الحلقة ${ep.episode_number}`, `Episode ${ep.episode_number}`)}
                    </span>
                  </Link>
                )}

                <div className="p-5 space-y-3 flex flex-col flex-1">
                  <div className="space-y-2 flex-1">
                    {ep.cover_image_url ? null : (
                      <div className="flex items-center justify-between">
                        <div />
                        <div className="w-7 h-7 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                          <Headphones className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    )}

                    {hasTitle ? (
                      <Link
                        to={`/${locale}/sci-cast/episode/${ep.episode_number}`}
                        className="block group/title focus:outline-none"
                      >
                        <h3 className="font-bold text-base text-gray-900 group-hover/title:text-brand-purple group-hover:text-brand-purple transition-colors leading-snug cursor-pointer">
                          {t(ep.title_ar, ep.title_en)}
                        </h3>
                      </Link>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <div className="h-5 rounded-lg bg-gray-100 w-3/4"></div>
                      </div>
                    )}

                    {hasDesc ? (
                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {t(ep.description_ar, ep.description_en)}
                      </p>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <div className="h-3 rounded bg-gray-100 w-full"></div>
                        <div className="h-3 rounded bg-gray-100 w-5/6"></div>
                        <div className="h-3 rounded bg-gray-100 w-2/3"></div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <Link
                      to={`/${locale}/sci-cast/episode/${ep.episode_number}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{t('الاستماع إلى الحلقة', 'Listen to Episode')}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. INSTITUTIONAL PARTNERSHIPS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-200 pb-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold brand-gradient-text tracking-tight">
              {t('شركاء المسيرة والتميز العلمي', 'Strategic Alliances & Research Partners')}
            </h2>
          </div>
          <Link
            to={`/${locale}/partners`}
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-ocean hover:text-brand-cyan transition-colors shrink-0 group"
          >
            <span>{t(`استكشف كافة الشركاء (${partnersDirectory.length})`, `Explore All Partners (${partnersDirectory.length})`)}</span>
            <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Editorial Partner Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {partnersDirectory.slice(0, 12).map((partner) => (
            <Link
              key={partner.id}
              to={`/${locale}/partners`}
              className="group flex flex-col items-center justify-between p-5 rounded-2xl bg-white border border-gray-200 hover:border-brand-purple/50 hover:shadow-md transition-all duration-300 text-center"
            >
              <div className="w-full h-24 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-center p-3 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                <img
                  src={publicAsset(partner.logoUrl)}
                  alt={locale === 'ar' ? partner.name_ar : partner.name_en}
                  loading="lazy"
                  className="max-h-16 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              <div className="mt-3.5 space-y-1 w-full">
                <h3 className="font-extrabold text-xs text-gray-900 line-clamp-1 group-hover:text-brand-ocean transition-colors">
                  {t(partner.name_ar, partner.name_en)}
                </h3>
                <p className="text-[10px] text-gray-500 font-medium line-clamp-1">
                  {t(partner.role_ar || '', partner.role_en || '')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-14 text-center brand-gradient-bg text-white space-y-6 shadow-xl shadow-brand-purple/20">
          <h2 className="text-3xl sm:text-4xl font-extrabold max-w-2xl mx-auto leading-tight">
            {t('انضم إلى مسيرة البحث والابتكار العلمي', 'Join the Journey of Scientific Innovation')}
          </h2>
          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
            {t(
              'ساهم معنا في تمكين طلاب كليات العلوم ورواد الأعمال التكنولوجية في مصر والوطن العربي من خلال برامجنا التخصصية ومبادراتنا الريادية.',
              'Contribute with us in empowering STEM students and technological entrepreneurs across Egypt and the Arab world through our specialized programs.'
            )}
          </p>
          <div className="pt-2">
            <Link
              to={`/${locale}/join-us`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-white text-brand-ink hover:bg-gray-100 shadow-md transition-all text-sm group"
            >
              <span>{t('كن جزءاً من الفريق', 'Become Part of the Team')}</span>
              <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
