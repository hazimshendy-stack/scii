import React, { useState } from 'react';
import { useLocale } from '../context/LocaleContext';
import { researchAchievements } from '../data/seedData';
import {
  Trophy, Users, BookOpen, Mic, GraduationCap, FlaskConical,
  ExternalLink, CheckCircle, Clock, FileText, Medal, Award,
  Star, TrendingUp,
} from 'lucide-react';
import { FacebookEmbed } from '../components/common/FacebookEmbed';

// ─── Types ───────────────────────────────────────────────────────────────────

type AchievementCategory = 'team' | 'entrepreneurship' | 'academic' | 'research' | 'media' | 'publication';

interface Participant {
  name_ar: string;
  name_en: string;
}

interface Achievement {
  id: string;
  category: AchievementCategory;
  isTeamInitiative?: boolean;
  title_ar: string;
  title_en: string;
  award_ar: string;
  award_en: string;
  organizer_ar?: string;
  organizer_en?: string;
  year?: string;
  participants: Participant[];
  place?: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

// Team-level achievements (The initiative itself)
const teamAchievements: Achievement[] = [
  {
    id: 'best-podcast',
    category: 'media',
    isTeamInitiative: true,
    title_ar: 'أفضل بودكاست — جامعة المنصورة',
    title_en: 'Best Podcast Award — Mansoura University',
    award_ar: 'فوز فريق Sci Infinity بجائزة أفضل بودكاست على مستوى جامعة المنصورة',
    award_en: 'Sci Infinity Team — Best Podcast Award, Mansoura University',
    organizer_ar: 'جامعة المنصورة',
    organizer_en: 'Mansoura University',
    participants: [
      { name_ar: 'فريق عمل مبادرة ساي إنفينيتي (Sci Infinity Team)', name_en: 'Sci Infinity Initiative Team' }
    ],
  },
  {
    id: 'best-wall-magazine',
    category: 'media',
    isTeamInitiative: true,
    title_ar: 'أفضل مجلة حائط — كلية العلوم، جامعة المنصورة',
    title_en: 'Best Wall Magazine — Faculty of Science, Mansoura University',
    award_ar: 'المركز الأول — أفضل مجلة حائط علمية بكلية العلوم',
    award_en: '1st Place — Best Wall Magazine, Faculty of Science',
    organizer_ar: 'كلية العلوم — جامعة المنصورة',
    organizer_en: 'Faculty of Science, Mansoura University',
    participants: [
      { name_ar: 'فريق تحرير وإعلام ساي إنفينيتي', name_en: 'Sci Infinity Editorial & Media Team' },
    ],
  },
];

// Individual / Member Achievements
const memberAchievements: Achievement[] = [
  // Entrepreneurship
  {
    id: 'hp-2025',
    category: 'entrepreneurship',
    title_ar: 'Hult Prize — جامعة المنصورة 2025',
    title_en: 'Hult Prize — Mansoura University 2025',
    award_ar: 'المركز الرابع (4th Place)',
    award_en: '4th Place',
    organizer_ar: 'Hult Prize — جامعة المنصورة',
    organizer_en: 'Hult Prize — Mansoura University',
    year: '2025',
    participants: [
      { name_ar: 'شادي أحمد', name_en: 'Shady Ahmed' }
    ],
    place: '4th',
  },
  {
    id: 'hp-2026',
    category: 'entrepreneurship',
    title_ar: 'Hult Prize — جامعة المنصورة 2026',
    title_en: 'Hult Prize — Mansoura University 2026',
    award_ar: 'المركز الخامس (5th Place)',
    award_en: '5th Place',
    organizer_ar: 'Hult Prize — جامعة المنصورة',
    organizer_en: 'Hult Prize — Mansoura University',
    year: '2026',
    participants: [
      { name_ar: 'شادي أحمد', name_en: 'Shady Ahmed' },
      { name_ar: 'حنان أحمد', name_en: 'Hanan Ahmed' },
    ],
    place: '5th',
  },
  {
    id: 'spark',
    category: 'entrepreneurship',
    title_ar: 'مسابقة SPARK',
    title_en: 'SPARK Competition',
    award_ar: 'أفضل مشروع تطبيقي في مسابقة SPARK',
    award_en: 'Best Applied Project at SPARK Competition',
    organizer_ar: 'مسابقة SPARK',
    organizer_en: 'SPARK Competition',
    participants: [
      { name_ar: 'شادي أحمد', name_en: 'Shady Ahmed' },
      { name_ar: 'آدم وليد', name_en: 'Adam Waleed' },
      { name_ar: 'أدهم وليد', name_en: 'Adham Waleed' },
      { name_ar: 'ستيفن رمسيس', name_en: 'Steven Ramsis' },
    ],
  },

  // Academic Excellence
  {
    id: 'ideal-student-2025',
    category: 'academic',
    title_ar: 'الطالب المثالي — كلية العلوم، جامعة المنصورة 2025',
    title_en: 'Ideal Student — Faculty of Science, Mansoura University 2025',
    award_ar: 'الطالب المثالي / الطالبة المثالية',
    award_en: 'Ideal Student, Faculty of Science, Mansoura University 2025',
    organizer_ar: 'كلية العلوم — جامعة المنصورة',
    organizer_en: 'Faculty of Science, Mansoura University',
    year: '2025',
    participants: [
      { name_ar: 'آدم وليد — الطالب المثالي', name_en: 'Adam Waleed — Ideal Student' },
      { name_ar: 'حنان أحمد — الطالبة المثالية', name_en: 'Hanan Ahmed — Ideal Student' },
    ],
  },
  {
    id: 'ideal-student-2026',
    category: 'academic',
    title_ar: 'الطالب المثالي — كلية العلوم، جامعة المنصورة 2026',
    title_en: 'Ideal Student — Faculty of Science, Mansoura University 2026',
    award_ar: 'الطالب المثالي / الطالبة المثالية',
    award_en: 'Ideal Student, Faculty of Science, Mansoura University 2026',
    organizer_ar: 'كلية العلوم — جامعة المنصورة',
    organizer_en: 'Faculty of Science, Mansoura University',
    year: '2026',
    participants: [
      { name_ar: 'أدهم وليد — الطالب المثالي', name_en: 'Adham Waleed — Ideal Student' },
      { name_ar: 'شهد أحمد — الطالبة المثالية', name_en: 'Shahd Ahmed — Ideal Student' },
    ],
  },

  // Research & Innovation
  {
    id: 'young-researchers-14',
    category: 'research',
    title_ar: 'الملتقى الرابع عشر لشباب الباحثين',
    title_en: '14th Young Researchers Forum',
    award_ar: 'جائزة أفضل بوستر بحثي',
    award_en: 'Best Research Poster Award at the 14th Young Researchers Forum',
    organizer_ar: 'الملتقى الرابع عشر لشباب الباحثين',
    organizer_en: '14th Young Researchers Forum',
    participants: [
      { name_ar: 'عبدالرحمن سعد', name_en: 'Abdelrahman Saad' },
      { name_ar: 'محمود فرحات', name_en: 'Mahmoud Farahat' },
      { name_ar: 'شادي أحمد', name_en: 'Shady Ahmed' },
      { name_ar: 'آدم وليد', name_en: 'Adam Waleed' },
      { name_ar: 'أدهم وليد', name_en: 'Adham Waleed' },
    ],
  },
  {
    id: 'research-innovation-forum',
    category: 'research',
    title_ar: 'ملتقى البحث والابتكار — جامعة المنصورة',
    title_en: 'Research & Innovation Forum — Mansoura University',
    award_ar: 'المركز الأول — أفضل مشروع ابتكاري',
    award_en: '1st Place — Best Innovative Project, Research & Innovation Forum, Mansoura University',
    organizer_ar: 'جامعة المنصورة',
    organizer_en: 'Mansoura University',
    participants: [
      { name_ar: 'محمود فرحات', name_en: 'Mahmoud Farahat' },
      { name_ar: 'عبدالرحمن سعد', name_en: 'Abdelrahman Saad' },
      { name_ar: 'شادي أحمد', name_en: 'Shady Ahmed' },
      { name_ar: 'آدم وليد', name_en: 'Adam Waleed' },
      { name_ar: 'أدهم وليد', name_en: 'Adham Waleed' },
    ],
    place: '1st',
  },
];

// ─── Category Config ─────────────────────────────────────────────────────────

const categoryConfig = {
  team: {
    labelAr: 'إنجازات المبادرة',
    labelEn: 'Initiative Honors',
    icon: Trophy,
    color: 'bg-brand-purple/10 text-brand-purple border-brand-purple/20',
  },
  entrepreneurship: {
    labelAr: 'ريادة الأعمال',
    labelEn: 'Entrepreneurship',
    icon: Trophy,
    color: 'bg-brand-purple/10 text-brand-purple border-brand-purple/20',
  },
  academic: {
    labelAr: 'التميز الأكاديمي',
    labelEn: 'Academic Excellence',
    icon: GraduationCap,
    color: 'bg-brand-ocean/10 text-brand-ocean border-brand-ocean/20',
  },
  research: {
    labelAr: 'البحث والابتكار',
    labelEn: 'Research & Innovation',
    icon: FlaskConical,
    color: 'bg-brand-cyan/15 text-brand-ocean border-brand-cyan/30',
  },
  media: {
    labelAr: 'الإعلام والإبداع',
    labelEn: 'Media & Creativity',
    icon: Mic,
    color: 'bg-brand-purple/10 text-brand-purple border-brand-purple/20',
  },
  publication: {
    labelAr: 'النشر الدولي',
    labelEn: 'International Publication',
    icon: BookOpen,
    color: 'bg-brand-ocean/10 text-brand-ocean border-brand-ocean/20',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export const TeamAchievementsView: React.FC = () => {
  const { t } = useLocale();
  const [activeFilter, setActiveFilter] = useState<AchievementCategory | 'all'>('all');

  const filters: { key: AchievementCategory | 'all'; labelAr: string; labelEn: string }[] = [
    { key: 'all', labelAr: 'الكل', labelEn: 'All' },
    { key: 'team', labelAr: 'إنجازات المبادرة', labelEn: 'Initiative Honors' },
    { key: 'publication', labelAr: 'النشر الدولي', labelEn: 'International Publications' },
    { key: 'research', labelAr: 'البحث والابتكار', labelEn: 'Research & Innovation' },
    { key: 'entrepreneurship', labelAr: 'ريادة الأعمال', labelEn: 'Entrepreneurship' },
    { key: 'academic', labelAr: 'التميز الأكاديمي', labelEn: 'Academic Excellence' },
  ];

  const showTeamSection = activeFilter === 'all' || activeFilter === 'team';
  const showPubSection = activeFilter === 'all' || activeFilter === 'publication';
  const showMembersSection = activeFilter === 'all' || (activeFilter !== 'team' && activeFilter !== 'publication');

  const filteredMembers = activeFilter === 'all'
    ? memberAchievements
    : memberAchievements.filter((a) => a.category === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

      {/* ── Hero Header ──────────────────────────────────────────── */}
      <div className="relative text-center max-w-4xl mx-auto space-y-6">
        {/* BG Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-brand-purple/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <h1 className="text-4xl sm:text-5xl font-extrabold brand-gradient-text tracking-tight leading-tight">
          {t('إنجازات المبادرة والنشر العلمي', 'Initiative Achievements & Scientific Publications')}
        </h1>

        <p className="text-base text-gray-600 leading-relaxed max-w-3xl mx-auto">
          {t(
            'سجل موثق يبرز إنجازات مبادرة ساي إنفينيتي، والنشر العلمي الدولي المحكم، وتميز أعضاء الفريق في محافل البحث والابتكار.',
            'A verified record highlighting Sci Infinity Initiative achievements, international peer-reviewed publications, and team member recognitions in research and innovation.'
          )}
        </p>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto pt-2">
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-black brand-gradient-text">{teamAchievements.length}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">{t('إنجاز مؤسسي', 'Initiative Honors')}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-black brand-gradient-text">{researchAchievements.length}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">{t('نشر دولي', 'Int\'l Publications')}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-black brand-gradient-text">{memberAchievements.length}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">{t('إنجاز فردي', 'Member Awards')}</div>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ───────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 justify-center">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === f.key
                ? 'brand-gradient-bg text-white shadow-md shadow-brand-purple/20'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-purple/40 hover:text-brand-purple'
            }`}
          >
            {t(f.labelAr, f.labelEn)}
          </button>
        ))}
      </div>

      {/* ── 1. INITIATIVE / TEAM ACHIEVEMENTS ───────────────────── */}
      {showTeamSection && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 rounded-2xl brand-gradient-bg text-white flex items-center justify-center shadow-md">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold brand-gradient-text">
                {t('إنجازات المبادرة', 'Sci Infinity Initiative Honors')}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamAchievements.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* BG decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-2xl -z-0 pointer-events-none" />
                
                <div className="relative space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold brand-gradient-bg text-white shadow-sm">
                      <Award className="w-3.5 h-3.5" />
                      {t('إنجاز مؤسسي', 'Initiative Honor')}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-xl text-gray-900 leading-snug">
                    {t(item.title_ar, item.title_en)}
                  </h3>

                  {item.organizer_ar && (
                    <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                      {t(item.organizer_ar, item.organizer_en ?? item.organizer_ar)}
                    </p>
                  )}

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-purple/8 to-brand-cyan/8 border border-brand-purple/15 flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-brand-purple shrink-0" />
                    <span className="text-sm font-bold text-gray-900">
                      {t(item.award_ar, item.award_en)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-600">
                    <Users className="w-4 h-4 text-brand-ocean" />
                    <span className="font-semibold">{t(item.participants[0].name_ar, item.participants[0].name_en)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 2. SCIENTIFIC PUBLICATIONS ───────────────────────────── */}
      {showPubSection && researchAchievements.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 rounded-2xl brand-gradient-bg text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold brand-gradient-text">
                {t('النشر الدولي المحكم', 'International Peer-Reviewed Publications')}
              </h2>
            </div>
          </div>

          {researchAchievements.map((paper) => (
            <div
              key={paper.id}
              className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-8 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Decorative BG */}
              <div className="absolute top-0 left-0 w-full h-1 brand-gradient-bg" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-purple/5 rounded-full blur-3xl -z-0 pointer-events-none" />

              <div className="relative">
                {/* Meta Tags */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold brand-gradient-bg text-white shadow-sm">
                      <BookOpen className="w-3.5 h-3.5" />
                      {t('نشر دولي', 'International Publication')}
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-brand-purple/15 text-brand-purple font-bold border border-brand-purple/20">
                      {paper.journal_name}
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-brand-ocean/10 text-brand-ocean font-medium border border-brand-ocean/20">
                      {t('سنة النشر:', 'Year:')} {paper.publication_year}
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-green-50 text-green-700 font-medium flex items-center gap-1 border border-green-200">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t('بحث محكم منشور', 'Peer-Reviewed')}</span>
                    </span>
                  </div>

                  {paper.doi ? (
                    <a
                      href={`https://doi.org/${paper.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-xs font-bold brand-gradient-bg text-white hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md"
                    >
                      <span>{t('رابط الورقة (DOI)', 'View via DOI')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-brand-purple bg-brand-purple/10 px-3 py-1.5 rounded-lg border border-brand-purple/20">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t('رابط DOI جارٍ توثيقه', 'DOI link pending')}</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="mt-5 text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                  {t(paper.title_ar, paper.title_en)}
                </h3>

                {/* Authors & Bibliographic details */}
                <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-brand-purple/5 to-brand-cyan/5 border border-brand-purple/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">{t('الباحثون والمؤلفون:', 'Authors:')}</span>
                    <span className="font-bold text-brand-ocean">{t(paper.authors_ar, paper.authors_en)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">{t('الدورية العلمية:', 'Journal:')}</span>
                    <span className="font-semibold text-gray-800">{paper.journal_name} ({paper.publication_year})</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-5 space-y-3">
                  <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-purple" />
                    <span>{t('ملخص البحث:', 'Research Abstract:')}</span>
                  </h4>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    {t(paper.summary_ar, paper.summary_en)}
                  </p>
                </div>

                {/* Facebook Post */}
                {paper.facebook_url && (
                  <div className="mt-5 space-y-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900">
                      {t('منشور توثيق النشر العلمي:', 'Official Publication Post:')}
                    </h4>
                    <FacebookEmbed
                      url={paper.facebook_url}
                      type="post"
                      title={t(paper.title_ar, paper.title_en)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 3. MEMBER ACHIEVEMENTS ───────────────────────────────── */}
      {showMembersSection && filteredMembers.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 rounded-2xl brand-gradient-bg text-white flex items-center justify-center shadow-md">
              <Medal className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold brand-gradient-text">
                {t('إنجازات وجوائز أعضاء الفريق', 'Team Members Awards & Honors')}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((item) => {
              const cfg = categoryConfig[item.category];
              const Icon = cfg.icon;
              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-brand-purple/30 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top glow */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/5 rounded-full blur-2xl -z-0 pointer-events-none group-hover:bg-brand-purple/10 transition-colors" />

                  <div className="relative space-y-4">
                    {/* Category badge */}
                    <div className="flex items-start justify-between gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${cfg.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {t(cfg.labelAr, cfg.labelEn)}
                      </span>
                      {item.year && (
                        <span className="text-xs text-gray-400 font-medium shrink-0 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">{item.year}</span>
                      )}
                    </div>

                    {/* Title */}
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-base text-gray-900 leading-snug group-hover:text-brand-purple transition-colors">
                        {t(item.title_ar, item.title_en)}
                      </h3>
                      {item.organizer_ar && (
                        <p className="text-xs text-gray-500 font-medium">
                          {t(item.organizer_ar, item.organizer_en ?? item.organizer_ar)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Award */}
                  <div className="relative mt-4 flex items-center gap-2 px-4 py-3 rounded-xl brand-gradient-bg shadow-sm">
                    <TrendingUp className="w-4 h-4 text-white shrink-0" />
                    <span className="text-xs font-bold text-white">
                      {t(item.award_ar, item.award_en)}
                    </span>
                  </div>

                  {/* Participants */}
                  <div className="relative mt-auto space-y-2 pt-3 border-t border-gray-100 mt-4">
                    <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {t('المشاركون:', 'Participants:')}
                    </p>
                    <ul className="space-y-1">
                      {item.participants.map((p, i) => (
                        <li key={i} className="text-sm text-gray-800 font-medium flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full brand-gradient-bg shrink-0" />
                          <span>{t(p.name_ar, p.name_en)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export const ResearchView = TeamAchievementsView;

