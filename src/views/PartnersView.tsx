import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { partnersDirectory } from '../data/partnersData';
import { publicAsset } from '../lib/publicAsset';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export const PartnersView: React.FC = () => {
  const { locale, t, dir } = useLocale();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight brand-gradient-text">
          {t('الشراكات', 'Partnerships')}
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          {t(
            'شبكة شركاء النجاح المؤسسيين والأكاديميين والصناعيين الداعمين لفعاليات وبرامج ومعسكرات مبادرة ساي إنفينيتي.',
            'Our network of institutional, academic, and industrial partners supporting Sci Infinity programs, student camps, and research forums.'
          )}
        </p>
      </div>

      {/* Partners Grid - All in One Place with Enlarged Clear Logos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {partnersDirectory.map((partner) => (
          <div
            key={partner.id}
            className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-brand-purple/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group"
          >
            {/* Enlarged Logo Stage */}
            <div className="w-full h-36 rounded-xl bg-slate-50/90 border border-gray-100 flex items-center justify-center p-3 overflow-hidden group-hover:bg-white group-hover:border-slate-200 transition-colors">
              <img
                src={publicAsset(partner.logoUrl)}
                alt={locale === 'ar' ? partner.name_ar : partner.name_en}
                loading="lazy"
                className="max-h-28 max-w-[90%] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Institution Information */}
            <div className="space-y-2 flex-1">
              {partner.role_en && (
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-brand-purple/10 text-brand-purple inline-block">
                  {t(partner.role_ar || partner.role_en, partner.role_en)}
                </span>
              )}
              <h3 className="font-extrabold text-base text-gray-900 leading-snug group-hover:text-brand-purple transition-colors">
                {t(partner.name_ar, partner.name_en)}
              </h3>
              {partner.activity_en ? (
                <p className="text-xs text-gray-600 leading-relaxed">
                  {t(partner.activity_ar, partner.activity_en)}
                </p>
              ) : null}
              {partner.tagline_en && (
                <p className="text-[11px] text-brand-purple font-semibold italic border-t border-gray-100 pt-2">
                  "{t(partner.tagline_ar || partner.tagline_en, partner.tagline_en)}"
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span>{t('شراكة معتمدة', 'Verified Partner')}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action for Partnerships with Site Brand Gradient */}
      <div className="rounded-3xl p-8 sm:p-12 text-center brand-gradient-bg text-white space-y-6 shadow-xl shadow-brand-purple/20">
        <h2 className="text-2xl sm:text-3xl font-extrabold max-w-xl mx-auto leading-tight">
          {t('هل ترغب مؤسستكم في بناء شراكة علمية واعدة؟', 'Looking to Partner with Our Scientific Initiative?')}
        </h2>
        <p className="text-sm sm:text-base text-white/90 max-w-lg mx-auto">
          {t(
            'نرحب بالتعاون مع الجامعات والشركات والمراكز البحثية لدعم وتأهيل شباب الباحثين ورواد الأعمال.',
            'We welcome collaborations in specialized training camps, applied research incubation, and scientific student forums.'
          )}
        </p>
        <div>
          <Link
            to={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-white text-brand-ink hover:bg-gray-100 shadow-md transition-all text-sm group"
          >
            <span>{t('تواصل معنا وكن شريكًا', 'Contact & Partner With Us')}</span>
            <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

    </div>
  );
};
