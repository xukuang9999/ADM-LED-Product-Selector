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
    <header className="bg-white border-b border-border-main backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-8 h-[80px] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo className="w-20 h-10" />
          <div className="w-[1px] h-8 bg-border-lt hidden sm:block"></div>
          <h1 className="text-[13px] font-bold text-text-main tracking-tight hidden sm:block m-0 uppercase">
            <span dangerouslySetInnerHTML={{ __html: t('logoTitle') }} />
          </h1>
        </div>

        <div className="flex gap-4 items-center">
          <button
            className="hidden lg:flex items-center gap-2 bg-adm text-white px-5 py-2.5 rounded-lg cursor-pointer text-xs font-bold transition-all duration-200 hover:bg-adm-dark hover:shadow-lg hover:shadow-adm/20 active:scale-95 whitespace-nowrap"
            onClick={onOpenContact}
            dangerouslySetInnerHTML={{ __html: t('contactBtn').split('&ensp;')[1] }}
          />
          <div className="relative group">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="appearance-none bg-[#f8f9fc] border border-border-main text-text-main text-[11px] font-bold rounded-lg pl-3 pr-8 py-2.5 cursor-pointer outline-none hover:border-adm transition-all"
            >
              <option value="en">ENGLISH</option>
              <option value="zh">简体中文</option>
              <option value="ja">日本語</option>
              <option value="hi">हिन्दी</option>
              <option value="vi">Tiếng Việt</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
