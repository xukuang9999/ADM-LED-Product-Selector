import React from 'react';
import { Product, Language } from '../types';
import { translations } from '../data';

interface DetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  isCompared: boolean;
  toggleCompare: (id: number) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  product,
  isOpen,
  onClose,
  lang,
  isCompared,
  toggleCompare
}) => {
  if (!isOpen || !product) return null;

  const t = (key: string) => translations[lang]?.[key] || translations['en'][key];
  const trimBrand = (s: string) => (s || '').replace(/^(ADM|LBY)\s+/i, '');

  const pc = {
    'SMD Strip': 'bg-[#dbeafe] text-[#1e40af]',
    'COB Strip': 'bg-[#ede9fe] text-[#5b21b6]',
    'Neon Flex Strip': 'bg-[#fef3c7] text-[#92400e]',
    'LED Module': 'bg-[#d1fae5] text-[#065f46]'
  }[product.category] || 'bg-[#d1fae5] text-[#065f46]';

  const ok = product.stock > 0;

  const specs = [
    [t('specCategory'), product.category],
    [t('specVoltage'), product.voltage],
    [t('specCCT'), product.cct],
    [t('specIP'), product.ipRating],
    [t('specPower'), product.wattPerM ? product.wattPerM + ' W/m' : product.wattage || '—'],
    [t('specLumens'), product.lumens || '—'],
    [t('specCRI'), product.cri || '—'],
    [t('specBeam'), product.beamAngle || '—'],
    [t('specDimensions'), product.dimensions || '—'],
    [t('specLedWidth'), product.ledWidth || '—'],
    [t('specModuleType'), product.moduleType || '—'],
  ].filter(([, v]) => v && v !== '—');

  return (
    <div 
      className="fixed inset-0 bg-[#020a1c94] z-[300] grid place-items-center p-5 backdrop-blur-[4px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-[14px] w-[min(720px,95vw)] max-h-[88vh] overflow-auto shadow-[0_28px_56px_rgba(0,0,0,0.24)]">
        <div className="sticky top-0 bg-white border-b border-border-main px-5 py-4 flex items-start justify-between gap-3 rounded-t-[14px] z-10">
          <div className="flex flex-col gap-1">
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-[3px] rounded leading-relaxed whitespace-nowrap self-start ${pc}`}>
              {product.category}
            </span>
            <h2 className="text-[15px] font-bold mt-1.5 m-0">{trimBrand(product.name)}</h2>
            <div className="text-xs text-text-muted font-mono">{product.sku}</div>
          </div>
          <button 
            className="w-7 h-7 border-none bg-bg-main rounded-md cursor-pointer text-[15px] grid place-items-center text-text-sec hover:bg-border-main shrink-0"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        
        <div className="px-5 py-5 pb-6">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.voltage && <span className="text-xs font-semibold px-2.5 py-[3px] rounded whitespace-nowrap bg-[#dbeafe] text-[#1e40af]">{product.voltage}</span>}
            {product.cct && <span className="text-xs font-semibold px-2.5 py-[3px] rounded whitespace-nowrap bg-[#fef3c7] text-[#92400e]">{product.cct}</span>}
            {product.ipRating && <span className="text-xs font-semibold px-2.5 py-[3px] rounded whitespace-nowrap bg-[#d1fae5] text-[#065f46]">{product.ipRating}</span>}
            {product.ledWidth && <span className="text-xs font-semibold px-2.5 py-[3px] rounded whitespace-nowrap bg-[#f1f5f9] text-[#475569]">{product.ledWidth}</span>}
            {product.wattPerM ? (
              <span className="text-xs font-semibold px-2.5 py-[3px] rounded whitespace-nowrap bg-[#fff7ed] text-[#c2410c]">{product.wattPerM} W/m</span>
            ) : product.wattage ? (
              <span className="text-xs font-semibold px-2.5 py-[3px] rounded whitespace-nowrap bg-[#fce7f3] text-[#9d174d]">{product.wattage}</span>
            ) : null}
            {product.lumens && <span className="text-xs font-semibold px-2.5 py-[3px] rounded whitespace-nowrap bg-[#e0e7ff] text-[#3730a3]">{product.lumens}</span>}
            {product.cri && <span className="text-xs font-semibold px-2.5 py-[3px] rounded whitespace-nowrap bg-[#ccfbf1] text-[#115e59]">{product.cri}</span>}
          </div>

          <div className="grid grid-cols-2 gap-0 border border-border-lt rounded-lg overflow-hidden mb-4">
            {specs.map(([l, v], i) => (
              <React.Fragment key={i}>
                <div className={`text-[11px] font-bold uppercase tracking-wide text-text-muted px-3.5 py-2 bg-[#fafbfc] ${i < specs.length - 1 ? 'border-b border-border-lt' : ''}`}>
                  {l}
                </div>
                <div className={`text-[13px] text-text-main px-3.5 py-2 ${i < specs.length - 1 ? 'border-b border-border-lt' : ''}`}>
                  {v}
                </div>
              </React.Fragment>
            ))}
          </div>

          {product.description && (
            <div className="text-xs text-text-sec leading-relaxed bg-[#f8f9fc] rounded-lg px-3.5 py-3 mb-4 whitespace-pre-wrap break-words">
              {product.description.split('|').map(s => trimBrand(s.trim())).join('\n').trim()}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-border-lt">
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${ok ? 'text-success' : 'text-danger'}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ok ? 'bg-success' : 'bg-danger'}`}></span>
              {ok ? t('stocked') : t('outOfStock')}
            </span>
            <div className="flex flex-wrap gap-2 items-center">
              <button
                className={`w-auto px-3 text-xs font-semibold gap-1.5 flex items-center h-[26px] rounded-md border-[1.5px] cursor-pointer transition-all duration-150 ${
                  isCompared 
                    ? 'bg-compare text-white border-compare' 
                    : 'bg-white border-border-main text-text-muted hover:border-compare hover:text-compare hover:bg-compare-lt'
                }`}
                onClick={() => toggleCompare(product.id)}
              >
                {isCompared ? t('inCompare') : t('plusCompare')}
              </button>
              {product.datasheet && (
                <a
                  href={product.datasheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-sec no-underline px-2.5 py-1 border-[1.5px] border-border-main rounded-md transition-all duration-150 whitespace-nowrap hover:border-text-sec hover:text-text-main hover:bg-bg-main"
                >
                  &#128196; {t('datasheet')}
                </a>
              )}
              {product.url && (
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 bg-adm text-white px-3.5 py-1 rounded-md text-[11px] font-bold no-underline transition-all duration-150 tracking-wide whitespace-nowrap hover:bg-adm-dark hover:shadow-[0_3px_10px_rgba(61,46,143,0.3)]"
                >
                  &#128722;&ensp;{t('buyNow')}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
