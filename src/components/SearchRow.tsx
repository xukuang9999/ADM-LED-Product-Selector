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
    <section aria-label="Search and Sort" className="bg-white/90 backdrop-blur-xl border-b border-border-lt">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm pointer-events-none group-focus-within:text-adm transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            className="w-full h-11 pl-11 pr-10 border border-border-main rounded-xl text-[13px] font-bold text-text-main bg-[#f8f9fc] transition-all duration-200 focus:outline-none focus:border-adm focus:ring-4 focus:ring-adm/10 focus:bg-white placeholder:text-text-muted placeholder:font-medium"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={t('searchPlaceholder')}
          />
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="bg-[#f0f4f8] px-3 py-1.5 rounded-lg border border-border-lt flex items-center gap-2 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-adm animate-pulse"></div>
            <span className="text-[11px] font-bold text-text-sec uppercase tracking-wider">
              {filteredCount} {t('ofLabel')} {totalCount} {t('catLabel')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              className="h-11 px-4 border border-border-main rounded-xl text-[12px] font-bold bg-[#f8f9fc] text-text-main cursor-pointer hover:border-adm transition-all outline-none"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort products"
            >
              <option value="name">{t('sortAZ').toUpperCase()}</option>
              <option value="nameDesc">{t('sortZA').toUpperCase()}</option>
              <option value="stock">{t('sortAvailability').toUpperCase()}</option>
              <option value="power">{t('sortPower').toUpperCase()}</option>
              <option value="colour">{t('sortColour').toUpperCase()}</option>
            </select>

            <button
              className={`h-11 px-6 border rounded-xl text-[12px] font-extrabold cursor-pointer inline-flex items-center gap-2.5 transition-all duration-200 whitespace-nowrap uppercase tracking-wider ${isFilterOpen
                ? 'bg-adm text-white border-adm shadow-lg shadow-adm/30'
                : 'bg-white text-adm border-adm hover:bg-adm hover:text-white hover:shadow-md'
                }`}
              onClick={toggleFilter}
            >
              <svg className={`w-4 h-4 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
              {isFilterOpen ? 'CLOSE FILTERS' : 'OPEN FILTERS'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
