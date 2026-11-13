import React, { useState } from 'react';
import { useLocale } from '../../context/LocaleContext';
import { aboutData } from '../../data/seedData';
import { ChevronDown, Compass, Target, Lightbulb, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface InstitutionalAccordionProps {
  initialOpen?: string[];
  className?: string;
}

export const InstitutionalAccordion: React.FC<InstitutionalAccordionProps> = ({
  initialOpen = ['vision'],
  className = '',
}) => {
  const { t } = useLocale();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {
      vision: initialOpen.includes('vision'),
      mission: initialOpen.includes('mission'),
      objectives: initialOpen.includes('objectives'),
      values: initialOpen.includes('values'),
    };
    return state;
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const sections = [
    {
      key: 'vision',
      titleAr: 'الرؤية',
      titleEn: 'Vision',
      icon: Compass,
      renderContent: () => (
        <div className="text-base sm:text-lg text-gray-700 leading-relaxed pt-3 font-normal">
          {t(aboutData.vision_ar, aboutData.vision_en)}
        </div>
      ),
    },
    {
      key: 'mission',
      titleAr: 'الرسالة',
      titleEn: 'Mission',
      icon: Target,
      renderContent: () => (
        <div className="text-base sm:text-lg text-gray-700 leading-relaxed pt-3 font-normal">
          {t(aboutData.mission_ar, aboutData.mission_en)}
        </div>
      ),
    },
    {
      key: 'objectives',
      titleAr: 'الأهداف الاستراتيجية',
      titleEn: 'Strategic Objectives',
      icon: Lightbulb,
      renderContent: () => (
        <div className="pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aboutData.goals.map((g, idx) => (
              <div 
                key={g.id} 
                className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 hover:border-brand-purple/40 hover:shadow-sm transition-all"
              >
                <div className="w-8 h-8 rounded-full brand-gradient-bg text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  {idx + 1}
                </div>
                <p className="text-sm font-semibold text-gray-800 leading-snug">
                  {t(g.title_ar, g.title_en)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'values',
      titleAr: 'القيم الأساسية',
      titleEn: 'Core Values',
      icon: ShieldCheck,
      renderContent: () => (
        <div className="pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {aboutData.values.map((v) => (
              <div 
                key={v.id} 
                className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 hover:border-brand-purple/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-brand-purple" />
                  </div>
                  <h4 className="font-bold text-base text-gray-900">
                    {t(v.title_ar, v.title_en)}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {t(v.desc_ar, v.desc_en)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {sections.map((section) => {
        const isOpen = !!openSections[section.key];
        const Icon = section.icon;

        return (
          <div
            key={section.key}
            className={`w-full rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? 'bg-white border-brand-purple/30 shadow-md ring-1 ring-brand-purple/10'
                : 'bg-white border-gray-200 hover:border-brand-purple/30'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleSection(section.key)}
              aria-expanded={isOpen}
              className="w-full p-5 sm:p-6 flex items-center justify-between text-start gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl brand-gradient-bg text-white flex items-center justify-center shrink-0 shadow-sm shadow-brand-purple/20">
                  <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <h3 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight">
                  {t(section.titleAr, section.titleEn)}
                </h3>
              </div>

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 bg-brand-purple/10 text-brand-purple' : 'bg-gray-100 text-gray-500'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 border-t border-gray-100 animate-fadeIn">
                {section.renderContent()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
