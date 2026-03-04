import React from 'react';
import { Product, Language } from '../types';
import { translations } from '../data';

interface ProductCardProps {
  product: Product;
  lang: Language;
  isCompared: boolean;
  toggleCompare: (id: number) => void;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  isCompared,
  toggleCompare,
  onClick
}) => {
  const t = (key: string) => translations[lang]?.[key] || translations['en'][key];

  const trimBrand = (s: string) => (s || '').replace(/^(ADM|LBY)\s+/i, '');
  
  const partDesc = (p: Product) => {
    const cleaned = trimBrand(p.name);
    const baseSku = p.sku.replace(/\s*\(.*?\)\s*$/, '').trim();
    const escaped = baseSku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cleaned.replace(new RegExp('^' + escaped + '\\s*', 'i'), '').trim();
  };

  const pillClass = {
    'SMD Strip': 'bg-[#dbeafe] text-[#1e40af]',
    'COB Strip': 'bg-[#ede9fe] text-[#5b21b6]',
    'Neon Flex Strip': 'bg-[#fef3c7] text-[#92400e]',
    'LED Backlit Module': 'bg-[#d1fae5] text-[#065f46]',
    'LED Edge Lit Module': 'bg-[#d1fae5] text-[#065f46]'
  }[product.category] || 'bg-[#d1fae5] text-[#065f46]';

  const inStock = product.stock > 0;

  return (
    <article 
      className={`bg-white rounded-[10px] border-[1.5px] p-4 flex flex-col transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] ${
        isCompared ? 'border-compare shadow-[0_0_0_2px_var(--color-compare)]' : 'border-border-lt hover:border-border-main'
      }`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-[3px] rounded leading-relaxed whitespace-nowrap ${pillClass}`}>
          {product.category}
        </span>
        <button
          className={`w-[26px] h-[26px] rounded-md border-[1.5px] cursor-pointer grid place-items-center text-[13px] transition-all duration-150 shrink-0 ${
            isCompared 
              ? 'bg-compare text-white border-compare' 
              : 'bg-white border-border-main text-text-muted hover:border-compare hover:text-compare hover:bg-compare-lt'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleCompare(product.id);
          }}
          title={isCompared ? t('removeCmp') : t('addCmp')}
        >
          {isCompared ? '✓' : '+'}
        </button>
      </div>

      <h2 className="text-xs font-bold leading-tight text-text-main mb-0.5 font-mono tracking-wide m-0">
        {product.sku}
      </h2>
      <div className="text-xs text-text-sec leading-relaxed mb-2.5">
        {partDesc(product)}
      </div>

      <div className="flex flex-wrap gap-1 mb-2.5">
        {product.voltage && <span className="text-[11px] font-semibold px-[7px] py-[2px] rounded whitespace-nowrap bg-[#dbeafe] text-[#1e40af]">{product.voltage}</span>}
        {product.cct && <span className="text-[11px] font-semibold px-[7px] py-[2px] rounded whitespace-nowrap bg-[#fef3c7] text-[#92400e]">{product.cct}</span>}
        {product.ipRating && <span className="text-[11px] font-semibold px-[7px] py-[2px] rounded whitespace-nowrap bg-[#d1fae5] text-[#065f46]">{product.ipRating}</span>}
        {product.ledWidth && <span className="text-[11px] font-semibold px-[7px] py-[2px] rounded whitespace-nowrap bg-[#f1f5f9] text-[#475569]">{product.ledWidth}</span>}
        {product.wattPerM ? (
          <span className="text-[11px] font-semibold px-[7px] py-[2px] rounded whitespace-nowrap bg-[#fff7ed] text-[#c2410c]">{product.wattPerM} W/m</span>
        ) : product.wattage ? (
          <span className="text-[11px] font-semibold px-[7px] py-[2px] rounded whitespace-nowrap bg-[#fce7f3] text-[#9d174d]">{product.wattage}</span>
        ) : null}
        {product.lumens && <span className="text-[11px] font-semibold px-[7px] py-[2px] rounded whitespace-nowrap bg-[#e0e7ff] text-[#3730a3]">{product.lumens}</span>}
        {product.cri && <span className="text-[11px] font-semibold px-[7px] py-[2px] rounded whitespace-nowrap bg-[#ccfbf1] text-[#115e59]">{product.cri}</span>}
      </div>

      {(product.beamAngle || product.dimensions) && (
        <div className="text-[11px] text-text-muted mb-0.5">
          {[product.beamAngle ? `Beam: ${product.beamAngle}` : '', product.dimensions].filter(Boolean).join(' · ')}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-border-lt mt-auto">
        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${inStock ? 'text-success' : 'text-danger'}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${inStock ? 'bg-success' : 'bg-danger'}`}></span>
          {inStock ? t('stocked') : t('outOfStock')}
        </span>
        <div className="flex flex-wrap gap-1.5 items-center">
          {product.datasheet && (
            <a
              href={product.datasheet}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-text-sec no-underline px-2 py-1 border-[1.5px] border-border-main rounded-md transition-all duration-150 whitespace-nowrap hover:border-text-sec hover:text-text-main hover:bg-bg-main"
              onClick={(e) => e.stopPropagation()}
            >
              &#128196; {t('datasheet')}
            </a>
          )}
          {product.url && (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-adm text-white px-2.5 py-1 rounded-md text-[10px] font-bold no-underline transition-all duration-150 tracking-wide whitespace-nowrap hover:bg-adm-dark hover:shadow-[0_3px_10px_rgba(61,46,143,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              &#128722;&ensp;{t('buyNow')}
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
