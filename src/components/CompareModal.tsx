import React from 'react';
import { Product, Language } from '../types';
import { translations } from '../data';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  lang: Language;
  toggleCompare: (id: number) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  products,
  lang,
  toggleCompare
}) => {
  if (!isOpen) return null;

  const t = (key: string) => translations[lang]?.[key] || translations['en'][key];
  const trimBrand = (s: string) => (s || '').replace(/^(ADM|LBY)\s+/i, '');

  const rows = [
    { label: t('cmpProductName'), key: 'name' as keyof Product },
    { label: t('cmpSKU'), key: 'sku' as keyof Product },
    { label: t('cmpCategory'), key: 'category' as keyof Product },
    { label: t('cmpVoltage'), key: 'voltage' as keyof Product },
    { label: t('cmpCCT'), key: 'cct' as keyof Product },
    { label: t('cmpIP'), key: 'ipRating' as keyof Product },
    { label: t('cmpLedWidth'), key: 'ledWidth' as keyof Product },
    { label: t('cmpPower'), key: 'wattPerM' as keyof Product },
    { label: t('cmpTotalPower'), key: 'wattage' as keyof Product },
    { label: t('cmpLumens'), key: 'lumens' as keyof Product },
    { label: t('cmpCRI'), key: 'cri' as keyof Product },
    { label: t('cmpBeam'), key: 'beamAngle' as keyof Product },
    { label: t('cmpDimensions'), key: 'dimensions' as keyof Product },
    { label: t('cmpAvailability'), key: 'stock' as keyof Product }
  ];

  return (
    <div 
      className="fixed inset-0 bg-[#020a1c94] z-[300] grid place-items-center p-5 backdrop-blur-[4px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-[14px] w-[min(1240px,95vw)] max-h-[88vh] overflow-auto shadow-[0_28px_56px_rgba(0,0,0,0.24)]">
        <div className="sticky top-0 bg-white border-b border-border-main px-5 py-4 flex items-center justify-between rounded-t-[14px] z-10">
          <h2 className="text-base font-bold text-text-main flex items-center gap-2" dangerouslySetInnerHTML={{ __html: t('compareBtnTitle') }} />
          <button 
            className="w-7 h-7 border-none bg-bg-main rounded-md cursor-pointer text-[15px] grid place-items-center text-text-sec hover:bg-border-main"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="overflow-x-auto pb-4 cmp-wrap">
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <th className="text-left px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-text-muted bg-bg-main whitespace-nowrap sticky left-0 z-[5] min-w-[130px]"></th>
                {products.map(p => (
                  <td key={p.id} className="px-4 py-2 border-b border-border-lt text-[13px] min-w-[190px] align-top bg-white">
                    <strong className="text-[13px] leading-tight block mb-1">{trimBrand(p.name)}</strong>
                    <span 
                      className="text-danger cursor-pointer text-[11px] font-semibold mt-1 inline-block hover:underline"
                      onClick={() => {
                        toggleCompare(p.id);
                        if (products.length <= 1) onClose();
                      }}
                    >
                      {t('removeLbl')}
                    </span>
                  </td>
                ))}
              </tr>
              {rows.map((row, i) => (
                <tr key={row.key} className={i % 2 === 0 ? 'bg-[#fafbfc]' : 'bg-white'}>
                  <th className="text-left px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-text-muted bg-bg-main whitespace-nowrap sticky left-0 z-[5] min-w-[130px]">
                    {row.label}
                  </th>
                  {products.map(p => {
                    let v = p[row.key];
                    if (row.key === 'stock') v = (v as number) > 0 ? t('stocked') : t('outOfStock');
                    else if (row.key === 'wattPerM') v = v ? v + ' W/m' : '—';
                    else if (!v) v = '—';
                    
                    return (
                      <td key={p.id} className="px-4 py-2 border-b border-border-lt text-[13px] min-w-[190px] align-top">
                        {v}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
