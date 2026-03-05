import React from 'react';
import { motion } from 'motion/react';
import { Product, Language } from '../types';
import { translations } from '../data';
import { Logo } from './Logo';

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
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      className={`group bg-white rounded-[10px] border-[1.5px] p-4 flex flex-col cursor-pointer transition-colors duration-200 ${isCompared ? 'border-compare ring-2 ring-compare/20 shadow-md' : 'border-border-lt hover:border-border-main shadow-sm'
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
      <div className="relative aspect-[4/3] rounded-lg mb-3 flex items-center justify-center bg-bg-main overflow-hidden border border-border-lt">
        {product.image ? (
          <img
            src={product.image}
            alt={product.sku}
            loading="lazy"
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-adm/20">
            <Logo className="w-16 grayscale opacity-20" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{product.sku.split('-')[1] || product.sku.split('-')[0]}</span>
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm ${pillClass}`}>
            {product.category}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <button
            className={`w-[26px] h-[26px] rounded-md border-[1.5px] cursor-pointer grid place-items-center text-[13px] transition-all duration-150 shrink-0 ${isCompared
              ? 'bg-compare text-white border-compare'
              : 'bg-white/80 backdrop-blur-sm border-border-main text-text-muted hover:border-compare hover:text-compare hover:bg-white shadow-sm'
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
    </motion.article>
  );
};
