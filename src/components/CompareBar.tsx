import React from 'react';
import { Language } from '../types';
import { translations } from '../data';

interface CompareBarProps {
  lang: Language;
  compareCount: number;
  onOpenCompare: () => void;
  onResetCompare: () => void;
}

export const CompareBar: React.FC<CompareBarProps> = ({ lang, compareCount, onOpenCompare, onResetCompare }) => {
  const t = (key: string) => translations[lang]?.[key] || translations['en'][key];

  if (compareCount === 0) return null;

  return (
    <div className="bg-white border-2 border-adm rounded-lg shadow-sm mb-4">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-adm-light text-adm font-bold">
            {compareCount}
          </div>
          <span className="text-sm font-medium text-text-sec hidden sm:inline-block">
            {t('itemsSelectedForCompare')}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onResetCompare}
            className="text-xs font-medium text-text-muted hover:text-text-main transition-colors px-3 py-2"
          >
            {t('resetCompare')}
          </button>
          <button
            onClick={onOpenCompare}
            disabled={compareCount < 2}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
              compareCount >= 2
                ? 'bg-adm text-white hover:bg-adm-dark hover:shadow-lg hover:-translate-y-0.5'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span dangerouslySetInnerHTML={{ __html: t('compareBtn') }} />
          </button>
        </div>
      </div>
    </div>
  );
};
