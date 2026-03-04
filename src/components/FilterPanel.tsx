import React from 'react';
import { Filters, Language } from '../types';
import { translations } from '../data';

interface FilterPanelProps {
  lang: Language;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  isOpen: boolean;
  clearAll: () => void;
  availableOptions: Record<keyof Filters, string[]>;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  lang,
  filters,
  setFilters,
  isOpen,
  clearAll,
  availableOptions
}) => {
  const t = (key: string) => translations[lang]?.[key] || translations['en'][key];

  const toggleFilter = (key: keyof Filters, value: string) => {
    setFilters(prev => {
      const current = prev[key];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      
      const newFilters = { ...prev, [key]: updated };
      
      // Auto-select LED Module categories when any module type is chosen
      if (key === 'moduleType' && newFilters.moduleType.length > 0 && !newFilters.category.some(c => c.includes('Module'))) {
        newFilters.category = [...newFilters.category, 'LED Backlit Module', 'LED Edge Lit Module'];
      }
      
      // Clear module type chips when LED Module deselected
      if (key === 'category' && !newFilters.category.some(c => c.includes('Module')) && newFilters.moduleType.length > 0) {
        newFilters.moduleType = [];
      }
      
      return newFilters;
    });
  };

  const renderChips = (key: keyof Filters, options: string[], isCat = false) => {
    return (
      <div className="flex flex-wrap gap-1 flex-1" role="group" aria-label={`Filter by ${key}`}>
        {options.map(opt => {
          const isOn = filters[key].includes(opt);
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={isOn}
              className={`px-3 py-1 border-[1.5px] rounded-full text-xs cursor-pointer transition-all duration-150 select-none whitespace-nowrap leading-relaxed hover:border-adm hover:text-adm hover:bg-adm-light ${
                isOn 
                  ? 'bg-adm text-white border-adm font-semibold' 
                  : 'bg-white text-text-sec border-border-main font-medium'
              }`}
              onClick={() => toggleFilter(key, opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    );
  };

  const onlyModule = filters.category.length > 0 && filters.category.every(c => c.includes('Module'));
  const noModule = filters.category.length > 0 && !filters.category.some(c => c.includes('Module'));

  return (
    <section aria-label="Filters" className={`bg-white border-b border-border-main overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
      <div className="max-w-[1480px] mx-auto px-4 sm:px-7 pt-1.5 pb-2.5">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-0 md:gap-x-8">
          
          <div className="flex flex-col">
            <div className="flex items-start gap-0 py-1.5 border-b border-border-lt">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-adm whitespace-nowrap min-w-[88px] sm:min-w-[110px] pt-1.5 shrink-0">
                {t('catLabel')}
              </span>
              {renderChips('category', availableOptions.category, true)}
            </div>
            <div className="flex items-start gap-0 py-1.5 border-b border-border-lt">
              <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted whitespace-nowrap min-w-[88px] sm:min-w-[110px] pt-1.5 shrink-0">
                {t('colourTempLabel')}
              </span>
              {renderChips('cct', availableOptions.cct)}
            </div>
            {!onlyModule && (
              <div className="flex items-start gap-0 py-1.5 border-b border-border-lt">
                <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted whitespace-nowrap min-w-[88px] sm:min-w-[110px] pt-1.5 shrink-0">
                  {t('ledWidthLabel')}
                </span>
                {renderChips('ledWidth', availableOptions.ledWidth)}
              </div>
            )}
            {!noModule && (
              <div className="flex items-start gap-0 py-1.5 border-b border-border-lt">
                <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted whitespace-nowrap min-w-[88px] sm:min-w-[110px] pt-1.5 shrink-0">
                  {t('moduleTypeLabel')}
                </span>
                {renderChips('moduleType', availableOptions.moduleType)}
              </div>
            )}
          </div>

          <div className="hidden md:block bg-border-lt w-[1px] self-stretch my-1"></div>

          <div className="flex flex-col">
            <div className="flex items-start gap-0 py-1.5 border-b border-border-lt">
              <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted whitespace-nowrap min-w-[88px] sm:min-w-[110px] pt-1.5 shrink-0">
                {t('voltageLabel')}
              </span>
              {renderChips('voltage', availableOptions.voltage)}
            </div>
            <div className="flex items-start gap-0 py-1.5 border-b border-border-lt">
              <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted whitespace-nowrap min-w-[88px] sm:min-w-[110px] pt-1.5 shrink-0">
                {t('ipRatingLabel')}
              </span>
              {renderChips('ipRating', availableOptions.ipRating)}
            </div>
            <div className="flex items-start gap-0 py-1.5 border-b border-border-lt">
              <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted whitespace-nowrap min-w-[88px] sm:min-w-[110px] pt-1.5 shrink-0">
                {t('powerLabel')}
              </span>
              {renderChips('wpm', availableOptions.wpm)}
            </div>
            <div className="flex items-start gap-0 py-1.5 border-b border-border-lt border-b-0">
              <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted whitespace-nowrap min-w-[88px] sm:min-w-[110px] pt-1.5 shrink-0">
                {t('criLabel')}
              </span>
              {renderChips('cri', availableOptions.cri)}
            </div>
          </div>

        </div>
        <div className="flex items-center py-1.5 pt-2 gap-0">
          <button
            className="bg-transparent border-none font-inherit text-[11px] font-semibold text-text-muted cursor-pointer py-1 flex items-center gap-1 transition-colors duration-150 whitespace-nowrap hover:text-danger"
            onClick={clearAll}
            dangerouslySetInnerHTML={{ __html: t('clearAll') }}
          />
        </div>
      </div>
    </section>
  );
};
