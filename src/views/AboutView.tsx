import React from 'react';
import { useLocale } from '../context/LocaleContext';
import { InstitutionalAccordion } from '../components/common/InstitutionalAccordion';

export const AboutView: React.FC = () => {
  const { t } = useLocale();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900">
          {t('عن مبادرة', 'About')} <span className="brand-gradient-text">Sci Infinity</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
          {t(
            'مبادرة غير هادفة للربح، متخصصة في البحث العلمي وريادة الأعمال، تسعى إلى تمكين الشباب وتطوير قدراتهم البحثية والابتكارية.',
            'A non-profit initiative specializing in scientific research and entrepreneurship, dedicated to empowering young people and developing their research and innovation capabilities.'
          )}
        </p>
      </div>

      {/* Expandable Accordion: Full-Width Container */}
      <div className="w-full max-w-6xl mx-auto">
        <InstitutionalAccordion initialOpen={['vision', 'mission']} />
      </div>

    </div>
  );
};
