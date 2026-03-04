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
    <header className="bg-white border-b-2 border-adm shadow-sm">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-7 h-[92px] flex items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <Logo className="w-24 h-12" />
          <h1 className="text-sm font-semibold text-text-sec tracking-wide hidden sm:block m-0">
            <span dangerouslySetInnerHTML={{ __html: t('logoTitle') }} />
          </h1>
        </div>

        <div className="flex gap-2.5 items-center">
          <button
            className="hidden lg:flex items-center gap-2 bg-white border-2 border-adm text-adm px-4 py-2 rounded-md cursor-pointer text-xs font-semibold transition-all duration-150 whitespace-nowrap hover:bg-adm-light hover:shadow-[0_3px_10px_rgba(61,46,143,0.15)]"
            onClick={onOpenContact}
            dangerouslySetInnerHTML={{ __html: t('contactBtn') }}
          />
          <nav className="flex items-center" aria-label="Language selection">
            <div className="relative">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="appearance-none bg-white border-2 border-adm text-adm text-xs font-semibold rounded-md pl-3 pr-8 py-1.5 cursor-pointer outline-none focus:ring-2 focus:ring-adm/20 hover:bg-adm-light transition-colors"
              >
                <option value="en">English</option>
                <option value="zh">中文</option>
                <option value="ja">日本語</option>
                <option value="hi">हिन्दी</option>
                <option value="vi">Tiếng Việt</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-adm">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
