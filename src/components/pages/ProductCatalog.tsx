import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Star, Heart, ShoppingBag, X, ArrowUpDown, SlidersHorizontal, ImageOff, 
  Sparkles, Stethoscope, ChevronRight, Filter, RefreshCw, ArrowRight, ShieldAlert 
} from 'lucide-react';
import { ProductRecord, AssessmentResult, SymptomTreatmentRecord } from '../../types';
import { loadProductsData, loadSymptomsData, extractUniqueValues } from '../../services/dataLoader';
import { getRecommendedProducts } from '../../services/recommendationEngine';

import { VerifiedProductImage } from '../common/VerifiedProductImage';
import { ProductAuthenticationModal } from '../features/ProductAuthenticationModal';

interface ProductCatalogProps {
  onNavigate: (tab: string) => void;
}

type PageViewMode = 'overview' | 'all';

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [symptomsData, setSymptomsData] = useState<SymptomTreatmentRecord[]>([]);
  const [latestAssessment, setLatestAssessment] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [authModalProduct, setAuthModalProduct] = useState<ProductRecord | null>(null);
  
  // Page View Mode (default overview: 6-8 recommended products)
  const [viewMode, setViewMode] = useState<PageViewMode>('overview');
  const [displayLimit, setDisplayLimit] = useState<number>(16);

  // Dynamic Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedSkinType, setSelectedSkinType] = useState<string>('All');
  const [selectedConcern, setSelectedConcern] = useState<string>('All');

  // Price Filter States
  const [sortOption, setSortOption] = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating'>('recommended');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  useEffect(() => {
    async function init() {
      setLoading(true);
      const [prodList, sympList] = await Promise.all([
        loadProductsData(),
        loadSymptomsData()
      ]);
      setProducts(prodList);
      setSymptomsData(sympList);

      try {
        const storedRaw = localStorage.getItem('auriva_latest_assessment');
        if (storedRaw) {
          setLatestAssessment(JSON.parse(storedRaw));
        }
      } catch (e) {}

      setLoading(false);
    }
    init();
  }, []);

  // Dynamically extract categories, brands, skin types from dataset
  const dynamicCategories = useMemo(() => ['All', ...extractUniqueValues(products, 'product_category')], [products]);
  const dynamicSkinTypes = useMemo(() => ['All', 'Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'], []);
  const dynamicConcerns = useMemo(() => [
    'All', 'Acne & Pimples', 'Dryness', 'Dark Spots', 'Sensitivity', 'Redness', 'Pigmentation', 'Oiliness'
  ], []);

  // Compute 6-8 Recommended For You products
  const recommendedOverviewProducts = useMemo(() => {
    if (products.length === 0) return [];
    
    const skinType = latestAssessment?.request?.skinType || 'Combination';
    const concern = latestAssessment?.possibleConcern || 'General Care';

    const ranked = getRecommendedProducts(products, skinType, concern);
    return ranked.slice(0, 8);
  }, [products, latestAssessment]);

  // Dataset Price Bounds
  const datasetPriceBounds = useMemo(() => {
    const validPrices = products
      .map(p => p.price_inr)
      .filter((p): p is number => p !== undefined && p !== null && !isNaN(p));

    if (validPrices.length === 0) return { min: 0, max: 5000 };
    return {
      min: Math.min(...validPrices),
      max: Math.max(...validPrices)
    };
  }, [products]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(w => w !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  // Filter & Sort Pipeline
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter(p => {
      // Search query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        p.product_name.toLowerCase().includes(q) ||
        p.brand_name.toLowerCase().includes(q) ||
        p.product_category.toLowerCase().includes(q) ||
        p.key_ingredients.toLowerCase().includes(q);

      // Category filter
      const matchesCategory = selectedCategory === 'All' || p.product_category.toLowerCase() === selectedCategory.toLowerCase();

      // Brand filter
      const matchesBrand = selectedBrand === 'All' || p.brand_name.toLowerCase() === selectedBrand.toLowerCase();

      // Skin Type filter
      const matchesSkinType = selectedSkinType === 'All' || 
        p.skin_type.toLowerCase().includes(selectedSkinType.toLowerCase()) || 
        p.skin_type.toLowerCase().includes('all');

      // Skin Concern filter
      const matchesConcern = selectedConcern === 'All' || 
        p.skin_concern.toLowerCase().includes(selectedConcern.toLowerCase());

      // Price filter
      const pPrice = p.price_inr ?? 0;
      const matchesMinPrice = minPrice === '' || pPrice >= minPrice;
      const matchesMaxPrice = maxPrice === '' || pPrice <= maxPrice;

      return matchesSearch && matchesCategory && matchesBrand && matchesSkinType && matchesConcern && matchesMinPrice && matchesMaxPrice;
    });

    // 2. SORTING
    return filtered.sort((a, b) => {
      if (sortOption === 'price_asc') {
        return (a.price_inr || 0) - (b.price_inr || 0);
      }
      if (sortOption === 'price_desc') {
        return (b.price_inr || 0) - (a.price_inr || 0);
      }
      if (sortOption === 'rating') {
        return b.rating - a.rating;
      }
      return b.recommendation_score - a.recommendation_score;
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedSkinType, selectedConcern, minPrice, maxPrice, sortOption]);

  // Grouped Categories for "All Products" View
  const groupedProducts = useMemo(() => {
    const categories = ['Cleanser', 'Serum', 'Moisturizer', 'Sunscreen', 'Face Wash'];
    const groups: Record<string, ProductRecord[]> = {};

    categories.forEach(cat => {
      const matched = filteredAndSortedProducts.filter(p => p.product_category.toLowerCase().includes(cat.toLowerCase()));
      if (matched.length > 0) {
        groups[cat] = matched.slice(0, 4);
      }
    });

    return groups;
  }, [filteredAndSortedProducts]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedSkinType('All');
    setSelectedConcern('All');
    setMinPrice('');
    setMaxPrice('');
    setSortOption('recommended');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in font-sans">
      
      {/* 1. PAGE HEADER & QUICK VIEW TOGGLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D4A3E]">Auriva Skincare Intelligence</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#111827] mt-1">
            Skincare Product Catalog
          </h1>
          <p className="text-sm text-[#4B5563] font-medium mt-1">
            Explore verified Indian skincare products matched dynamically to your skin needs.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-[#FAFAF8] p-1.5 rounded-2xl border border-[#E5E7EB]">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'overview'
                ? 'bg-[#2D4A3E] text-white shadow-xs'
                : 'text-[#374151] hover:bg-[#F3F4F1]'
            }`}
          >
            Recommended Overview
          </button>

          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'all'
                ? 'bg-[#2D4A3E] text-white shadow-xs'
                : 'text-[#374151] hover:bg-[#F3F4F1]'
            }`}
          >
            All Products ({products.length})
          </button>
        </div>
      </div>

      {/* 2. HORIZONTALLY SCROLLABLE QUICK CATEGORIES BAR */}
      <div className="bg-white border border-[#E5E7EB] p-4 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Quick Categories</span>
          <span className="text-[11px] text-[#6B7280]">Select a category to filter</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setViewMode('all');
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat && viewMode === 'all'
                  ? 'bg-[#2D4A3E] text-white shadow-xs'
                  : 'bg-[#FAFAF8] border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F1]'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. DEFAULT OVERVIEW VIEW MODE (6-8 RECOMMENDED PRODUCTS MAX) */}
      {viewMode === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* ASSESSMENT PROMPT BANNER OR PROFILE SUMMARY */}
          {!latestAssessment ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2D4A3E] text-white flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#111827]">Get Personalized Product Recommendations</h3>
                  <p className="text-xs text-[#4B5563]">Complete your 2-minute skin assessment to get AI-matched dataset products tailored to your exact skin type.</p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('assessment')}
                className="derm-pill-btn text-xs px-5 py-2.5 shrink-0 flex items-center gap-1.5"
              >
                <span>Take Skin Assessment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2D4A3E]" />
                <span className="font-bold text-[#111827]">Personalized for your {latestAssessment.request.skinType} skin</span>
                <span className="text-[#6B7280]">targeting {latestAssessment.possibleConcern}</span>
              </div>
              <button 
                onClick={() => onNavigate('assessment')} 
                className="text-[11px] font-bold text-[#2D4A3E] hover:underline"
              >
                Update Profile &rarr;
              </button>
            </div>
          )}

          {/* RECOMMENDED FOR YOU (MAX 6-8 PRODUCTS) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#111827]">Recommended For You</h2>
                <p className="text-xs text-[#4B5563]">Top curated products matched from the 200 Indian Skincare Products Catalog.</p>
              </div>

              <button
                onClick={() => setViewMode('all')}
                className="text-xs text-[#2D4A3E] font-bold hover:underline flex items-center gap-1"
              >
                <span>View All Products ({products.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <div key={n} className="derm-card p-4 bg-white space-y-3 animate-pulse">
                    <div className="w-full aspect-[4/3] bg-[#F3F4F1] rounded-2xl" />
                    <div className="h-4 bg-[#F3F4F1] rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedOverviewProducts.map((product: ProductRecord) => {
                  const isWished = wishlist.includes(product.product_id);
                  const hasPrice = product.price_inr !== undefined && product.price_inr !== null && !isNaN(product.price_inr);

                  return (
                    <div
                      key={product.product_id}
                      onClick={() => window.open(`?view=product-detail&id=${product.product_id}`, '_blank')}
                      className="derm-card p-4 bg-white border border-[#E5E7EB] hover:border-[#2D4A3E] cursor-pointer group flex flex-col justify-between transition-all relative"
                    >
                      <div className="space-y-3">
                        <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAFAF8] relative border border-[#F3F4F1]">
                          <VerifiedProductImage 
                            productName={product.product_name} 
                            productId={product.product_id}
                            imageUrl={product.image_url} 
                            alt={product.product_name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          
                          <button
                            onClick={(e) => toggleWishlist(product.product_id, e)}
                            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all ${
                              isWished ? 'bg-white text-red-500 shadow-md' : 'bg-white/80 text-[#6B7280] hover:bg-white'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isWished ? 'fill-red-500' : ''}`} />
                          </button>

                          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#111827]/80 text-white text-[10px] uppercase font-bold">
                            {product.product_category}
                          </div>
                        </div>

                        <div>
                          <span className="text-[11px] text-[#2D4A3E] font-bold tracking-wide uppercase">{product.brand_name}</span>
                          <h3 className="font-serif text-base font-bold text-[#111827] leading-tight group-hover:text-[#2D4A3E] transition-colors line-clamp-1">
                            {product.product_name}
                          </h3>
                        </div>

                        <div className="space-y-1 text-xs">
                          <p className="text-[#4B5563] line-clamp-2">
                            <strong className="text-[#111827] font-semibold">Actives:</strong> {product.key_ingredients}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            <span className="text-[10px] bg-[#F3F4F1] text-[#374151] px-2 py-0.5 rounded-md font-medium">
                              Suitable: {product.skin_type}
                            </span>
                            <span className="text-[10px] bg-[#F3F4F1] text-[#374151] px-2 py-0.5 rounded-md font-medium">
                              Concern: {product.skin_concern}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 mt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                        <div>
                          {hasPrice ? (
                            <span className="font-serif text-lg font-bold text-[#111827]">
                              ₹{product.price_inr?.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-[#9CA3AF] italic">
                              Price unavailable
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setAuthModalProduct(product);
                            }}
                            title="Verify Product Authenticity"
                            className="p-1.5 rounded-full bg-[#FAFAF8] border border-[#E5E7EB] hover:border-[#2D4A3E] text-[#2D4A3E] transition-colors"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                          <button className="px-3 py-1.5 rounded-full bg-[#2D4A3E] text-white text-xs font-semibold hover:bg-[#233B31] transition-all shadow-xs">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SHOP BY SKIN CONCERN SECTION (NON-DIAGNOSTIC SAFETY WORDING) */}
          <div className="space-y-4 pt-4">
            <div className="border-b border-[#E5E7EB] pb-3">
              <h2 className="font-serif text-2xl font-bold text-[#111827]">Shop by Skin Concern</h2>
              <p className="text-xs text-[#4B5563]">Discover skincare products formulated for specific skin concerns.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { title: 'Products for Acne-Prone Skin', concern: 'Acne & Pimples', icon: '🌿' },
                { title: 'Products for Dryness', concern: 'Dryness', icon: '💧' },
                { title: 'Products for Sensitivity & Redness', concern: 'Sensitivity', icon: '🛡️' },
                { title: 'Products for Dark Spots', concern: 'Dark Spots', icon: '✨' }
              ].map(c => (
                <div
                  key={c.concern}
                  onClick={() => {
                    setSelectedConcern(c.concern);
                    setViewMode('all');
                  }}
                  className="p-4 bg-white border border-[#E5E7EB] hover:border-[#2D4A3E] rounded-2xl cursor-pointer space-y-2 group transition-all"
                >
                  <span className="text-2xl">{c.icon}</span>
                  <h3 className="font-serif text-sm font-bold text-[#111827] group-hover:text-[#2D4A3E] transition-colors">{c.title}</h3>
                  <span className="text-[10px] text-[#2D4A3E] font-bold block">Explore Category &rarr;</span>
                </div>
              ))}
            </div>
          </div>

          {/* SEPARATED PRESCRIPTION MEDICAL TREATMENTS CALLOUT */}
          {symptomsData.length > 0 && (
            <div className="p-6 bg-white border border-[#E5E7EB] rounded-3xl space-y-4 shadow-2xs">
              <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-3">
                <ShieldAlert className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#111827]">Medical & Dermatological Treatments</h3>
                  <p className="text-xs text-[#6B7280]">Topical medical active guidance separated from daily cosmetic skincare products.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {symptomsData.slice(0, 3).map((symp) => (
                  <div key={symp.medicine_id} className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">{symp.treatment_category}</span>
                    <h4 className="font-serif font-bold text-[#111827] text-sm">{symp.active_ingredient}</h4>
                    <p className="text-[#4B5563] text-[11px]"><strong>For:</strong> {symp.skin_condition}</p>
                    <p className="text-[#6B7280] text-[10px] italic pt-1">{symp.treatment_notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW ALL PRODUCTS CTA BUTTON */}
          <div className="text-center pt-6">
            <button
              onClick={() => setViewMode('all')}
              className="derm-pill-btn text-sm px-8 py-3.5 shadow-md"
            >
              View Complete Product Catalogue ({products.length} Products) &rarr;
            </button>
          </div>

        </div>
      )}

      {/* 4. FULL CATALOGUE VIEW MODE (ALL PRODUCTS WITH FILTERS & PAGINATION) */}
      {viewMode === 'all' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* SEARCH BAR & SORT BY PRICE */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8 relative">
                <Search className="w-5 h-5 text-[#6B7280] absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 200+ Indian skincare products by name, brand, category, or key active ingredients..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E5E7EB] rounded-2xl text-sm text-[#111827] focus:outline-none focus:border-[#2D4A3E] shadow-xs"
                />
              </div>

              <div className="md:col-span-4 flex items-center gap-2 bg-white border border-[#E5E7EB] px-4 py-2.5 rounded-2xl shadow-xs">
                <ArrowUpDown className="w-4 h-4 text-[#2D4A3E] shrink-0" />
                <span className="text-xs font-semibold text-[#111827] shrink-0">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e: any) => setSortOption(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-[#2D4A3E] focus:outline-none cursor-pointer"
                >
                  <option value="recommended">Featured / Recommended</option>
                  <option value="price_asc">Lowest Price (Low → High)</option>
                  <option value="price_desc">Highest Price (High → Low)</option>
                  <option value="rating">Top Rating</option>
                </select>
              </div>
            </div>

            {/* SECONDARY FILTER BAR: SKIN TYPE & CONCERN */}
            <div className="bg-white border border-[#E5E7EB] p-4 rounded-2xl shadow-xs space-y-4">
              
              {/* Skin Type Filter Bar */}
              <div className="flex flex-wrap items-center gap-2 border-b border-[#F3F4F1] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mr-2">Skin Type:</span>
                {dynamicSkinTypes.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedSkinType(st)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      selectedSkinType === st
                        ? 'bg-[#2D4A3E] text-white shadow-xs'
                        : 'bg-[#FAFAF8] border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F1]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Skin Concern Filter Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mr-2">Concern:</span>
                {dynamicConcerns.map((sc) => (
                  <button
                    key={sc}
                    onClick={() => setSelectedConcern(sc)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      selectedConcern === sc
                        ? 'bg-[#2D4A3E] text-white shadow-xs'
                        : 'bg-[#FAFAF8] border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F1]'
                    }`}
                  >
                    {sc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PRODUCT DISPLAY RESULTS */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <div key={n} className="derm-card p-4 bg-white space-y-3 animate-pulse">
                  <div className="w-full aspect-[4/3] bg-[#F3F4F1] rounded-2xl" />
                  <div className="h-4 bg-[#F3F4F1] rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-white rounded-3xl border border-[#E5E7EB]">
              <ShoppingBag className="w-12 h-12 text-[#9CA3AF] mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#111827]">No products found for this category.</h3>
              <p className="text-xs text-[#4B5563]">Try adjusting your search query, price filter, or category selections.</p>
              <button
                onClick={resetAllFilters}
                className="derm-pill-secondary text-xs px-5 py-2"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredAndSortedProducts.slice(0, displayLimit).map((product) => {
                  const isWished = wishlist.includes(product.product_id);
                  const hasPrice = product.price_inr !== undefined && product.price_inr !== null && !isNaN(product.price_inr);

                  return (
                    <div
                      key={product.product_id}
                      onClick={() => window.open(`?view=product-detail&id=${product.product_id}`, '_blank')}
                      className="derm-card p-4 bg-white border border-[#E5E7EB] hover:border-[#2D4A3E] cursor-pointer group flex flex-col justify-between transition-all relative"
                    >
                      <div className="space-y-3">
                        <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAFAF8] relative border border-[#F3F4F1]">
                          <VerifiedProductImage 
                            productName={product.product_name} 
                            productId={product.product_id}
                            imageUrl={product.image_url} 
                            alt={product.product_name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          
                          <button
                            onClick={(e) => toggleWishlist(product.product_id, e)}
                            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all ${
                              isWished ? 'bg-white text-red-500 shadow-md' : 'bg-white/80 text-[#6B7280] hover:bg-white'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isWished ? 'fill-red-500' : ''}`} />
                          </button>

                          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#111827]/80 text-white text-[10px] uppercase font-bold">
                            {product.product_category}
                          </div>
                        </div>

                        <div>
                          <span className="text-[11px] text-[#2D4A3E] font-bold tracking-wide uppercase">{product.brand_name}</span>
                          <h3 className="font-serif text-base font-bold text-[#111827] leading-tight group-hover:text-[#2D4A3E] transition-colors line-clamp-1">
                            {product.product_name}
                          </h3>
                        </div>

                        <div className="space-y-1 text-xs">
                          <p className="text-[#4B5563] line-clamp-2">
                            <strong className="text-[#111827] font-semibold">Actives:</strong> {product.key_ingredients}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            <span className="text-[10px] bg-[#F3F4F1] text-[#374151] px-2 py-0.5 rounded-md font-medium">
                              Suitable: {product.skin_type}
                            </span>
                            <span className="text-[10px] bg-[#F3F4F1] text-[#374151] px-2 py-0.5 rounded-md font-medium">
                              Concern: {product.skin_concern}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 mt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                        <div>
                          {hasPrice ? (
                            <span className="font-serif text-lg font-bold text-[#111827]">
                              ₹{product.price_inr?.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-[#9CA3AF] italic">
                              Price unavailable
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setAuthModalProduct(product);
                            }}
                            title="Verify Product Authenticity"
                            className="p-1.5 rounded-full bg-[#FAFAF8] border border-[#E5E7EB] hover:border-[#2D4A3E] text-[#2D4A3E] transition-colors"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                          <button className="px-3 py-1.5 rounded-full bg-[#2D4A3E] text-white text-xs font-semibold hover:bg-[#233B31] transition-all shadow-xs">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Performance Load More Pagination Button */}
              {displayLimit < filteredAndSortedProducts.length && (
                <div className="text-center pt-6">
                  <button
                    onClick={() => setDisplayLimit(prev => prev + 16)}
                    className="derm-pill-secondary text-xs px-6 py-3 font-bold"
                  >
                    Load More Products ({filteredAndSortedProducts.length - displayLimit} Remaining) &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* PRODUCT AUTHENTICATION MODAL */}
      <ProductAuthenticationModal 
        product={authModalProduct}
        isOpen={Boolean(authModalProduct)}
        onClose={() => setAuthModalProduct(null)}
      />

    </div>
  );
};
