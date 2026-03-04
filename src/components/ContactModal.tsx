import React from 'react';
import { Language } from '../types';
import { translations } from '../data';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const t = (key: string) => translations[lang]?.[key] || translations['en'][key];
  
  const emailBody = encodeURIComponent('Hello ADM Special Product Team,\n\nI am enquiring about:\n\nProduct Type:\nSpecifications (Voltage / Power / CCT / IP Rating):\nQuantity Required:\nProject Application:\nPreferred Delivery Timeline:\n\nThank you.');

  return (
    <div 
      className="fixed inset-0 bg-[#020a1c94] z-[300] grid place-items-center p-5 backdrop-blur-[4px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-[14px] w-[min(600px,95vw)] shadow-[0_28px_56px_rgba(0,0,0,0.24)]">
        <div className="bg-adm px-6 py-5 rounded-t-[14px] flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2" dangerouslySetInnerHTML={{ __html: t('contactModalTitle') }} />
          <button 
            className="w-7 h-7 border-none bg-white/15 text-white rounded-md cursor-pointer text-[15px] grid place-items-center hover:bg-white/30"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="px-6 pt-7 pb-8">
          <p className="text-[13px] text-text-sec mb-5 leading-relaxed">
            {t('contactTagline')}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
            {(t('usecases') as [string, string][]).map(([icon, text], i) => (
              <div key={i} className="bg-adm-light rounded-lg px-3 py-2.5 flex items-start gap-2 text-xs text-adm font-semibold leading-snug">
                <span className="text-[15px] shrink-0 mt-[1px]">{icon}</span>
                {text}
              </div>
            ))}
          </div>
          
          <div className="bg-[#f8f9fc] rounded-lg px-4 py-3 mb-4 border-l-[3px] border-adm">
            <p className="text-xs font-bold text-adm mb-2 uppercase tracking-wide">
              {t('whatToIncludeTitle')}
            </p>
            <ol className="pl-4 flex flex-col gap-1 list-decimal">
              {(t('checklistItems') as string[]).map((item, i) => (
                <li key={i} className="text-xs text-text-sec leading-relaxed">{item}</li>
              ))}
            </ol>
          </div>
          
          <div className="text-center text-[11px] font-bold uppercase tracking-wide text-text-muted my-4 relative before:content-[''] before:absolute before:top-1/2 before:left-0 before:w-[42%] before:h-[1px] before:bg-border-main after:content-[''] after:absolute after:top-1/2 after:right-0 after:w-[42%] after:h-[1px] after:bg-border-main">
            {t('orReachUs')}
          </div>
          
          <div className="flex items-start gap-3.5 py-3.5 border-b border-border-lt">
            <div className="w-9 h-9 rounded-lg bg-adm-light grid place-items-center text-[17px] shrink-0">&#9993;</div>
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-bold uppercase tracking-wide text-text-muted">{t('contactEmailLabel')}</div>
              <div className="text-sm font-semibold text-text-main">
                <a href="mailto:illuminate@admtech.com.au" className="text-adm no-underline hover:underline">illuminate@admtech.com.au</a>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3.5 py-3.5 border-b border-border-lt">
            <div className="w-9 h-9 rounded-lg bg-adm-light grid place-items-center text-[17px] shrink-0">&#128222;</div>
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-bold uppercase tracking-wide text-text-muted">{t('contactPhoneLabel')}</div>
              <div className="text-sm font-semibold text-text-main">
                <a href="tel:1300236467" className="text-adm no-underline hover:underline">1300 236 467</a>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3.5 py-3.5">
            <div className="w-9 h-9 rounded-lg bg-adm-light grid place-items-center text-[17px] shrink-0">&#128205;</div>
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-bold uppercase tracking-wide text-text-muted">{t('contactAddressLabel')}</div>
              <div className="text-sm font-semibold text-text-main">
                26 Garden Blvd, Dingley Village VIC 3172
              </div>
            </div>
          </div>
          
          <div className="mt-5 flex justify-center">
            <a 
              href={`mailto:illuminate@admtech.com.au?subject=Special%20Product%20Enquiry&body=${emailBody}`}
              className="inline-flex items-center gap-2 bg-adm text-white px-7 py-2.5 rounded-lg text-[13px] font-bold no-underline transition-all duration-150 hover:bg-adm-dark hover:shadow-[0_4px_12px_rgba(61,46,143,0.3)]"
              dangerouslySetInnerHTML={{ __html: t('contactEmailCTA') }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
