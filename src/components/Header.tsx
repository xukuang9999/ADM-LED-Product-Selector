import React from 'react';
import { Language } from '../types';
import { translations } from '../data';
import { Logo } from './Logo';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  compareCount: number;
  onOpenContact: () => void;
  onOpenCompare: () => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, compareCount, onOpenContact, onOpenCompare }) => {
  const t = (key: string) => translations[lang]?.[key] || translations['en'][key];

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-adm shadow-sm">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-7 h-[92px] flex items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <Logo className="w-24 h-12" />
          <h1 className="text-sm font-semibold text-text-sec tracking-wide hidden sm:block m-0">
            <span dangerouslySetInnerHTML={{ __html: t('logoTitle') }} />
          </h1>
        </div>

        <nav className="flex gap-1 items-center flex-wrap mx-2" aria-label="Language selection">
          {(['en', 'zh', 'ja', 'hi', 'vi'] as Language[]).map((l) => (
            <button
              key={l}
              className={`border-[1.5px] font-inherit text-[11px] font-semibold cursor-pointer px-2 py-[3px] rounded-[5px] transition-all duration-150 whitespace-nowrap leading-relaxed hover:border-adm hover:text-adm hover:bg-adm-light ${
                lang === l 
                  ? 'bg-adm text-white border-adm hover:text-white hover:bg-adm' 
                  : 'bg-transparent text-text-muted border-transparent'
              }`}
              onClick={() => setLang(l)}
            >
              {l === 'en' ? 'EN' : l === 'zh' ? '中文' : l === 'ja' ? '日本語' : l === 'hi' ? 'हिन्दी' : 'Việt'}
            </button>
          ))}
        </nav>

        <div className="flex gap-2.5 items-center">
          <button 
            className="hidden lg:flex items-center gap-2 bg-white border-2 border-adm text-adm px-4 py-2 rounded-md cursor-pointer text-xs font-semibold transition-all duration-150 whitespace-nowrap hover:bg-adm-light hover:shadow-[0_3px_10px_rgba(61,46,143,0.15)]"
            onClick={onOpenContact}
            dangerouslySetInnerHTML={{ __html: t('contactBtn') }}
          />
          <button 
            className="flex items-center gap-2 bg-adm border-none text-white px-4 py-2 rounded-md cursor-pointer text-xs font-semibold transition-all duration-150 whitespace-nowrap hover:bg-adm-dark hover:shadow-[0_3px_10px_rgba(61,46,143,0.3)]"
            onClick={onOpenCompare}
          >
            <span dangerouslySetInnerHTML={{ __html: t('compareBtn') }} />
            <span className="bg-white text-adm rounded px-[7px] py-[1px] text-[11px] font-extrabold min-w-[20px] text-center">
              {compareCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
