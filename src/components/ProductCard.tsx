import React from 'react';
import { motion } from 'motion/react';
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
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className={`group bg-white rounded-xl border p-5 flex flex-col cursor-pointer transition-all duration-300 ${isCompared ? 'border-compare ring-4 ring-compare/10 shadow-lg' : 'border-border-main hover:border-adm shadow-sm hover:shadow-xl'
        }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm ${pillClass}`}>
          {product.category}
        </span>
        <button
          className={`w-8 h-8 rounded-lg border cursor-pointer grid place-items-center text-[14px] transition-all duration-200 shrink-0 ${isCompared
            ? 'bg-compare text-white border-compare shadow-inner'
            : 'bg-[#f8f9fc] border-border-main text-text-muted hover:border-compare hover:text-compare hover:bg-white hover:shadow-md'
            }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleCompare(product.id);
          }}
          title={isCompared ? t('removeCmp') : t('addCmp')}
        >
          {isCompared ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-[14px] font-black leading-tight text-text-main mb-1.5 font-mono tracking-tight group-hover:text-adm transition-colors">
          {product.sku}
        </h2>
        <div className="text-[13px] text-text-sec leading-snug font-medium line-clamp-2">
          {partDesc(product)}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
        {product.voltage && (
          <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100/50">
            <span className="text-[10px] font-bold uppercase mr-1 opacity-50">V</span>
            <span className="text-[11px] font-bold">{product.voltage}</span>
          </div>
        )}
        {product.cct && (
          <div className="flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded-md border border-amber-100/50">
            <span className="text-[10px] font-bold uppercase mr-1 opacity-50">K</span>
            <span className="text-[11px] font-bold">{product.cct}</span>
          </div>
        )}
        {product.ipRating && (
          <div className="flex items-center bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-100/50">
            <span className="text-[10px] font-bold uppercase mr-1 opacity-50">IP</span>
            <span className="text-[11px] font-bold">{product.ipRating}</span>
          </div>
        )}
        {product.wattPerM && (
          <div className="flex items-center bg-orange-50 text-orange-700 px-2 py-1 rounded-md border border-orange-100/50">
            <span className="text-[10px] font-bold uppercase mr-1 opacity-50">W</span>
            <span className="text-[11px] font-bold">{product.wattPerM}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border-lt">
        <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${inStock ? 'text-emerald-600' : 'text-rose-600'}`}>
          <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></div>
          {inStock ? t('stocked') : t('outOfStock')}
        </div>

        <div className="flex gap-2">
          {product.datasheet && (
            <a
              href={product.datasheet}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg border border-border-main flex items-center justify-center text-text-sec hover:bg-[#f8f9fc] hover:border-text-main transition-all group/btn"
              onClick={(e) => e.stopPropagation()}
              title={t('datasheet')}
            >
              <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </a>
          )}
          {product.url && (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 h-9 bg-adm text-white rounded-lg flex items-center gap-2 text-[11px] font-black uppercase tracking-widest hover:bg-adm-dark hover:shadow-lg hover:shadow-adm/20 transition-all active:scale-95"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {t('buyNow')}
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};
