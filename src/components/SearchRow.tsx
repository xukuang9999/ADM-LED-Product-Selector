import React from 'react';
import { Language } from '../types';
import { translations } from '../data';

interface SearchRowProps {
  lang: Language;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sort: string;
  setSort: (sort: string) => void;
  totalCount: number;
  filteredCount: number;
  isFilterOpen: boolean;
  toggleFilter: () => void;
}

export const SearchRow: React.FC<SearchRowProps> = ({
  lang,
  searchQuery,
  setSearchQuery,
  sort,
  setSort,
  totalCount,
  filteredCount,
  isFilterOpen,
  toggleFilter
}) => {
  const t = (key: string) => translations[lang]?.[key] || translations['en'][key];

  return (
    <section aria-label="Search and Sort" className="bg-[#f8f9fc] border-b border-border-main">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-7 py-2.5 flex items-center gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm pointer-events-none">
            &#128269;
          </span>
          <input
            type="text"
            className="w-full h-9 pl-9 pr-10 border-[1.5px] border-border-main rounded-md text-[13px] font-inherit text-text-main bg-white transition-all duration-150 focus:outline-none focus:border-adm focus:ring-3 focus:ring-adm/10"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={t('searchPlaceholder')}
          />
        </div>
        
        <div className="text-xs text-text-muted whitespace-nowrap hidden sm:block">
          <span>{t('showingLabel')}</span> <strong className="text-text-main font-bold">{filteredCount}</strong> <span>{t('ofLabel')}</span> <strong>{totalCount}</strong>
        </div>

        <select
          className="h-[34px] px-2.5 border-[1.5px] border-border-main rounded-md text-xs font-inherit bg-white text-text-sec cursor-pointer"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort products"
        >
          <option value="name">{t('sortAZ')}</option>
          <option value="nameDesc">{t('sortZA')}</option>
          <option value="stock">{t('sortAvailability')}</option>
          <option value="power">{t('sortPower')}</option>
          <option value="colour">{t('sortColour')}</option>
        </select>

        <button
          className={`h-[34px] px-3.5 border-[1.5px] rounded-md text-xs font-inherit font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap ${
            isFilterOpen 
              ? 'bg-adm text-white border-adm' 
              : 'bg-white text-text-sec border-border-main hover:border-adm hover:text-adm hover:bg-adm-light'
          }`}
          onClick={toggleFilter}
        >
          <span dangerouslySetInnerHTML={{ __html: isFilterOpen ? '&#9662;&ensp;Filters' : '&#9656;&ensp;Filters' }} />
        </button>
      </div>
    </section>
  );
};
