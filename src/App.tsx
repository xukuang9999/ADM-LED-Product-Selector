import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { products, translations, searchSynonyms } from './data';
import { Product, Language, Filters } from './types';
import { Header } from './components/Header';
import { SearchRow } from './components/SearchRow';
import { FilterPanel } from './components/FilterPanel';
import { ProductCard } from './components/ProductCard';
import { CompareModal } from './components/CompareModal';
import { ContactModal } from './components/ContactModal';
import { DetailModal } from './components/DetailModal';
import { CompareBar } from './components/CompareBar';

const wpmRanges = [
  { label: '≤2 W/m', min: 0, max: 2 },
  { label: '4–8 W/m', min: 4, max: 8 },
  { label: '9–12 W/m', min: 9, max: 12 },
  { label: '13–16 W/m', min: 13, max: 16 },
  { label: '17–20 W/m', min: 17, max: 20 },
];

const catOrder = ['SMD Strip', 'COB Strip', 'Neon Flex Strip', 'LED Backlit Module', 'LED Edge Lit Module'];

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState('name');
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    category: [], voltage: [], cct: [], ipRating: [], ledWidth: [], wpm: [], moduleType: [], cri: []
  });
  const [compareList, setCompareList] = useState<number[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [detailProductId, setDetailProductId] = useState<number | null>(null);

  const t = (key: string) => translations[lang]?.[key] || translations['en'][key];

  // Available options for filters
  const availableOptions = useMemo(() => {
    const getUnique = (field: keyof Product, isCat = false) => {
      const vals = [...new Set(products.map(p => p[field]).filter(Boolean) as string[])];
      return vals.sort((a, b) => {
        if (isCat) {
          const oa = catOrder.indexOf(a);
          const ob = catOrder.indexOf(b);
          return (oa === -1 ? 99 : oa) - (ob === -1 ? 99 : ob);
        }
        const na = parseFloat(a);
        const nb = parseFloat(b);
        return (!isNaN(na) && !isNaN(nb)) ? na - nb : a.localeCompare(b);
      });
    };

    return {
      category: getUnique('category', true),
      voltage: getUnique('voltage'),
      cct: getUnique('cct'),
      ipRating: getUnique('ipRating'),
      ledWidth: [...new Set(products.filter(p => !p.category.includes('Module')).map(p => p.ledWidth).filter(Boolean))].sort((a, b) => parseFloat(a) - parseFloat(b)),
      wpm: wpmRanges.map(r => r.label),
      moduleType: [...new Set(products.filter(p => p.category.includes('Module')).map(p => p.moduleType).filter(Boolean))].sort(),
      cri: getUnique('cri')
    };
  }, []);

  const matchSearch = (p: Product) => {
    if (!searchQuery) return true;
    const terms = searchQuery.toLowerCase().trim().split(/\s+/);
    const hay = [p.name, p.sku, p.description, p.category, p.voltage, p.cct, p.ipRating, p.wattage, p.wattPerM, p.lumens, p.ledType, p.cri, p.beamAngle, p.dimensions, p.ledWidth].join(' ').toLowerCase();

    return terms.every(t => {
      if (hay.includes(t)) return true;
      const s = searchSynonyms[t];
      return s && s.some(x => hay.includes(x));
    });
  };

  const matchWpm = (p: Product) => {
    if (!filters.wpm.length) return true;
    if (!p.wattPerM) return false;
    const v = parseFloat(p.wattPerM);
    return filters.wpm.some(lbl => {
      const r = wpmRanges.find(x => x.label === lbl);
      return r && v >= r.min && v <= r.max;
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!matchSearch(p)) return false;
      if (filters.category.length && !filters.category.includes(p.category)) return false;
      if (filters.voltage.length && !filters.voltage.includes(p.voltage)) return false;
      if (filters.cct.length && !filters.cct.some(v => p.cct && (p.cct === v || p.cct.includes(v.replace('K', ''))))) return false;
      if (filters.ipRating.length && !filters.ipRating.includes(p.ipRating)) return false;
      if (filters.ledWidth.length && !p.category.includes('Module') && !filters.ledWidth.includes(p.ledWidth)) return false;
      if (filters.moduleType.length && p.category.includes('Module') && !filters.moduleType.includes(p.moduleType)) return false;
      if (filters.cri.length && !filters.cri.some(sel => {
        const m = String(p.cri).match(/\d+/);
        const s = String(sel).match(/\d+/);
        return m && s && parseInt(m[0]) >= parseInt(s[0]);
      })) return false;
      if (!matchWpm(p)) return false;
      return true;
    });
  }, [searchQuery, filters]);

  const sortedProducts = useMemo(() => {
    const pwrVal = (p: Product) => parseFloat(p.wattPerM) || parseFloat((p.wattage || '').replace(/[^\d.]/g, '')) || 0;
    const cctVal = (p: Product) => { const m = String(p.cct || '').match(/\d+/); return m ? parseInt(m[0]) : 99999; };

    return [...filteredProducts].sort((a, b) => {
      if (sort === 'stock') return b.stock - a.stock;
      if (sort === 'nameDesc') return b.name.localeCompare(a.name);
      if (sort === 'power') return pwrVal(a) - pwrVal(b);
      if (sort === 'colour') return cctVal(a) - cctVal(b) || a.cct.localeCompare(b.cct);
      return a.name.localeCompare(b.name);
    });
  }, [filteredProducts, sort]);

  const clearAllFilters = () => {
    setFilters({ category: [], voltage: [], cct: [], ipRating: [], ledWidth: [], wpm: [], moduleType: [], cri: [] });
    setSearchQuery('');
  };

  const toggleCompare = (id: number) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 5) {
        alert(t('maxCompare'));
        return prev;
      }
      return [...prev, id];
    });
  };

  const openCompare = () => {
    if (compareList.length < 2) {
      alert(t('minCompare'));
      return;
    }
    setIsCompareOpen(true);
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCompareOpen(false);
        setIsContactOpen(false);
        setDetailProductId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle body scroll lock
  useEffect(() => {
    if (isCompareOpen || isContactOpen || detailProductId !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isCompareOpen, isContactOpen, detailProductId]);

  return (
    <div className="min-h-screen flex flex-col bg-bg-main font-sans">
      <Helmet>
        <title>LED Lighting Products Catalog | ADM Power Supplies</title>
        <meta name="description" content="Browse our extensive catalog of LED lighting products including SMD Strips, COB Strips, Neon Flex Strips, and LED Modules. Find the perfect lighting solution for your needs." />
        <meta name="keywords" content="LED strip, COB strip, Neon Flex, LED module, ADM Power Supplies, lighting catalog, commercial lighting, residential lighting" />
        <meta property="og:title" content="LED Lighting Products Catalog | ADM Power Supplies" />
        <meta property="og:description" content="Browse our extensive catalog of LED lighting products including SMD Strips, COB Strips, Neon Flex Strips, and LED Modules." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LED Lighting Products Catalog | ADM Power Supplies" />
        <meta name="twitter:description" content="Browse our extensive catalog of LED lighting products including SMD Strips, COB Strips, Neon Flex Strips, and LED Modules." />
      </Helmet>

      <div className="sticky top-0 z-40 flex flex-col">
        <Header
          lang={lang}
          setLang={setLang}
          compareCount={compareList.length}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenCompare={openCompare}
        />

        <SearchRow
          lang={lang}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sort={sort}
          setSort={setSort}
          totalCount={products.length}
          filteredCount={sortedProducts.length}
          isFilterOpen={isFilterOpen}
          toggleFilter={() => setIsFilterOpen(!isFilterOpen)}
        />
      </div>

      <div className={`transition-all duration-300 ease-in-out ${isFilterOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <FilterPanel
          lang={lang}
          filters={filters}
          setFilters={setFilters}
          isOpen={isFilterOpen}
          clearAll={clearAllFilters}
          availableOptions={availableOptions}
        />
      </div>

      <main className="max-w-[1480px] mx-auto px-4 sm:px-7 py-5 pb-24 w-full flex-1">
        {compareList.length > 0 && (
          <CompareBar
            lang={lang}
            compareCount={compareList.length}
            onOpenCompare={openCompare}
            onResetCompare={() => setCompareList([])}
          />
        )}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-24 px-5 bg-white rounded-xl border border-border-main shadow-sm">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-lg text-text-main mb-2 font-bold">{t('noResults')}</h2>
            <p className="text-text-muted mb-6 max-w-md mx-auto">{t('noResultsSub')}</p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 bg-adm text-white rounded-lg font-semibold hover:bg-adm-dark transition-all duration-150 shadow-sm active:scale-95"
            >
              {t('clearAll').replace(/&#10005;\s*/, '')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
            {sortedProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                lang={lang}
                isCompared={compareList.includes(p.id)}
                toggleCompare={toggleCompare}
                onClick={() => setDetailProductId(p.id)}
              />
            ))}
          </div>
        )}
      </main>

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        products={products.filter(p => compareList.includes(p.id))}
        lang={lang}
        toggleCompare={toggleCompare}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        lang={lang}
      />

      <DetailModal
        isOpen={detailProductId !== null}
        onClose={() => setDetailProductId(null)}
        product={products.find(p => p.id === detailProductId) || null}
        lang={lang}
        isCompared={detailProductId !== null && compareList.includes(detailProductId)}
        toggleCompare={toggleCompare}
      />
    </div>
  );
}
