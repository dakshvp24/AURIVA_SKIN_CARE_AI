import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Stethoscope, ShoppingBag, ArrowRight, ShieldAlert, ExternalLink, 
  ChevronDown, ChevronUp, Layers, CheckCircle2, Droplets, Sun, Activity
} from 'lucide-react';
import { UserProfile, SkinProfile, AssessmentResult, ProductRecord } from '../../types';
import { loadProductsData } from '../../services/dataLoader';
import { getRecommendedProducts, getProductUsageInstructions, ScoredProduct } from '../../services/recommendationEngine';
import { VerifiedProductImage } from '../common/VerifiedProductImage';
import { MedicalDisclaimerBanner } from '../layout/MedicalDisclaimerBanner';

interface PersonalGuidanceProps {
  user: UserProfile | null;
  skinProfile: SkinProfile | null;
  latestAssessment: AssessmentResult | null;
  onNavigate: (tab: string) => void;
  onStartAssessment: () => void;
}

function ProductRecommendationCard({ prod, skinType, concern }: { prod: ScoredProduct; skinType: string; concern: string }) {
  const [imageError, setImageError] = useState(false);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [showUsageSteps, setShowUsageSteps] = useState(false);

  const hasPrice = prod.price_inr !== undefined && prod.price_inr !== null && !isNaN(prod.price_inr);
  
  // Format ingredients list cleanly
  const rawIngredients = (prod.key_ingredients || '').trim();
  const ingredientList = rawIngredients && rawIngredients !== 'None'
    ? rawIngredients.split(/[,;\n]/).map(i => i.trim()).filter(Boolean)
    : [];

  const displayIngredients = showAllIngredients ? ingredientList : ingredientList.slice(0, 3);
  const usageSteps = getProductUsageInstructions(prod);

  // Shopping Links
  const amazonUrl = prod.amazon_url && prod.amazon_url.startsWith('http') ? prod.amazon_url : null;
  const flipkartUrl = prod.flipkart_url && prod.flipkart_url.startsWith('http') ? prod.flipkart_url : null;
  const myntraUrl = prod.myntra_url && prod.myntra_url.startsWith('http') ? prod.myntra_url : null;

  // About Product description from dataset
  const aboutProduct = prod.product_description?.trim() || 
    `${prod.product_name} by ${prod.brand_name} is a ${prod.product_category} formulated specifically for ${prod.skin_type || 'various skin types'} addressing ${prod.skin_concern || 'skincare'} needs.`;

  return (
    <div className="derm-card p-6 bg-white border border-[#E5E7EB] hover:border-[#2D4A3E] space-y-6 transition-all rounded-3xl shadow-xs">
      
      {/* 1. PRODUCT HEADER & IMAGE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Product Image */}
        <div className="md:col-span-4 w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAFAF8] border border-[#F3F4F1] relative">
          <VerifiedProductImage 
            productName={prod.product_name}
            productId={prod.product_id}
            imageUrl={prod.image_url}
            alt={prod.product_name}
            className="w-full h-full object-cover"
          />

          <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-full bg-[#111827]/80 text-white text-[10px] uppercase font-bold tracking-wider">
            {prod.product_category}
          </div>
        </div>

        {/* Brand, Product Name, Price, & Suitability */}
        <div className="md:col-span-8 space-y-3">
          <div>
            <span className="text-xs font-bold text-[#2D4A3E] uppercase tracking-widest block">{prod.brand_name}</span>
            <h3 className="font-serif text-2xl font-bold text-[#111827] leading-tight">{prod.product_name}</h3>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {hasPrice ? (
              <span className="font-serif text-2xl font-bold text-[#111827]">
                ₹{prod.price_inr?.toLocaleString()}
              </span>
            ) : (
              <span className="text-xs font-semibold text-[#9CA3AF] italic">
                Price unavailable
              </span>
            )}

            <div className="h-4 w-px bg-[#E5E7EB]" />

            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="bg-[#F3F4F1] text-[#374151] px-2.5 py-1 rounded-md font-medium">
                Suitable: {prod.skin_type || 'All Skin Types'}
              </span>
              <span className="bg-[#F3F4F1] text-[#374151] px-2.5 py-1 rounded-md font-medium">
                Concern: {prod.skin_concern || 'General Care'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ABOUT, WHY RECOMMEND, INGREDIENTS & USAGE */}
      <div className="border-t border-[#E5E7EB] pt-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        
        {/* ABOUT THIS PRODUCT */}
        <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block">About This Product</span>
          <p className="text-[#374151] leading-relaxed line-clamp-4 font-medium">
            {aboutProduct}
          </p>
        </div>

        {/* WHY WE RECOMMEND IT */}
        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#2D4A3E]" />
            Why We Recommend It
          </span>
          <p className="text-emerald-900 leading-relaxed font-medium">
            {prod.whyRecommended || `Recommended based on your skin profile: ${prod.product_name} is listed as suitable for ${skinType} skin and matches ${concern} concerns.`}
          </p>
        </div>

        {/* KEY INGREDIENTS */}
        <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block">Key Ingredients</span>
          {ingredientList.length > 0 ? (
            <div className="space-y-1">
              <ul className="space-y-1 text-[#374151] font-medium">
                {displayIngredients.map((ing, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#2D4A3E] font-bold">•</span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
              {ingredientList.length > 3 && (
                <button
                  onClick={() => setShowAllIngredients(!showAllIngredients)}
                  className="text-[11px] font-bold text-[#2D4A3E] hover:underline pt-1 flex items-center gap-0.5"
                >
                  <span>{showAllIngredients ? 'Show less ingredients' : `View all ingredients (${ingredientList.length})`}</span>
                  {showAllIngredients ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>
          ) : (
            <p className="text-[#6B7280] italic">Ingredient information is currently unavailable.</p>
          )}
        </div>

        {/* HOW TO USE */}
        <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">How To Use</span>
            <button
              onClick={() => setShowUsageSteps(!showUsageSteps)}
              className="text-[10px] font-bold text-[#2D4A3E] hover:underline"
            >
              {showUsageSteps ? 'Hide steps' : 'View steps'}
            </button>
          </div>
          
          <div className="space-y-1 text-[#374151] font-medium leading-relaxed">
            {(showUsageSteps ? usageSteps : usageSteps.slice(0, 2)).map((step, idx) => (
              <p key={idx}>{step}</p>
            ))}
          </div>
        </div>

      </div>

      {/* 3. FOOTER ACTIONS & SHOPPING LINKS */}
      <div className="pt-3 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* SHOPPING LINKS */}
        <div className="flex flex-wrap items-center gap-2">
          {amazonUrl && (
            <a href={amazonUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#FF9900] text-black font-bold text-xs rounded-xl hover:opacity-90 transition-all">
              🛒 Buy on Amazon
            </a>
          )}
          {flipkartUrl && (
            <a href={flipkartUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#2874F0] text-white font-bold text-xs rounded-xl hover:opacity-90 transition-all">
              🛍️ Buy on Flipkart
            </a>
          )}
          {myntraUrl && (
            <a href={myntraUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#FF3F6C] text-white font-bold text-xs rounded-xl hover:opacity-90 transition-all">
              💄 Buy on Myntra
            </a>
          )}
        </div>

        <button
          onClick={() => window.open(`?view=product-detail&id=${prod.product_id}`, '_blank')}
          className="derm-pill-btn text-xs px-6 py-2.5 flex items-center gap-2 shadow-xs shrink-0"
        >
          <span>View Full Details</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}

export const PersonalGuidance: React.FC<PersonalGuidanceProps> = ({
  user,
  skinProfile,
  latestAssessment,
  onNavigate,
  onStartAssessment
}) => {
  const [recommendedProducts, setRecommendedProducts] = useState<ScoredProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const activeSkinType = skinProfile?.skinType || latestAssessment?.request?.skinType;
  const activeConcern = skinProfile?.mainConcerns?.[0] || latestAssessment?.possibleConcern;
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.name || 'Auriva Member';

  useEffect(() => {
    async function loadData() {
      if (!activeSkinType && !activeConcern) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const allProducts = await loadProductsData();

      // Fetch 3-5 maximum relevant products
      const scored = getRecommendedProducts(allProducts, activeSkinType, activeConcern);
      setRecommendedProducts(scored.slice(0, 5));
      setLoading(false);
    }

    loadData();
  }, [activeSkinType, activeConcern]);

  // IF NO ASSESSMENT EXISTS
  if (!activeSkinType && !activeConcern) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-center animate-fade-in font-sans">
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 max-w-lg mx-auto space-y-4 shadow-xs">
          <Stethoscope className="w-12 h-12 text-[#2D4A3E] mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-[#111827]">Personal Recommendations</h2>
          <p className="text-xs text-[#4B5563]">
            Complete your skin assessment to receive personalized product recommendations based on your skin type and concerns.
          </p>
          <button 
            onClick={onStartAssessment}
            className="derm-pill-btn text-xs px-6 py-2.5 inline-flex items-center gap-2"
          >
            <span>Take Skin Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in font-sans">
      
      {/* 1. PERSONALIZED PROFILE HEADER BANNER */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D4A3E]">Auriva Intelligence</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#111827] mt-0.5">
              Personal Recommendations
            </h1>
            <p className="text-xs text-[#4B5563] font-medium mt-1">
              Data-driven skincare recommendations curated for <strong className="text-[#111827]">{userName}</strong>.
            </p>
          </div>

          <button 
            onClick={onStartAssessment}
            className="derm-pill-secondary text-xs px-4 py-2 flex items-center gap-1.5 shrink-0"
          >
            <Stethoscope className="w-3.5 h-3.5 text-[#2D4A3E]" />
            <span>Update Profile</span>
          </button>
        </div>

        {/* PROFILE ATTRIBUTES SUMMARY */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-[#6B7280] block">Skin Type</span>
            <strong className="font-serif text-sm text-[#111827]">{activeSkinType || 'Combination'}</strong>
          </div>

          <div className="p-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-[#6B7280] block">Primary Concern</span>
            <strong className="font-serif text-sm text-[#111827]">{activeConcern || 'General Care'}</strong>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase text-emerald-800 block">Evaluation Status</span>
            <strong className="font-serif text-sm text-emerald-950 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              Active Match
            </strong>
          </div>
        </div>
      </div>

      {/* 2. RECOMMENDED FOR YOU (3-5 PRODUCTS MAXIMUM) */}
      <div className="space-y-6">
        <div className="border-b border-[#E5E7EB] pb-3 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#111827]">Recommended For You</h2>
            <p className="text-xs text-[#4B5563]">Top {recommendedProducts.length} curated products matched from the Indian Skincare Catalog.</p>
          </div>

          <button 
            onClick={() => onNavigate('products')}
            className="text-xs font-bold text-[#2D4A3E] hover:underline"
          >
            Browse Full Catalog ({recommendedProducts.length > 0 ? '200+ Catalog' : ''}) &rarr;
          </button>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(n => <div key={n} className="h-72 bg-white border border-[#E5E7EB] rounded-3xl animate-pulse p-6" />)}
          </div>
        ) : recommendedProducts.length === 0 ? (
          <div className="text-center py-12 bg-white border border-[#E5E7EB] rounded-3xl space-y-3 p-6">
            <ShieldAlert className="w-10 h-10 text-[#9CA3AF] mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#111827]">No closely matching products were found in our current product database.</h3>
            <p className="text-xs text-[#6B7280]">Try updating your assessment preferences or exploring the general product catalog.</p>
            <button onClick={() => onNavigate('products')} className="derm-pill-secondary text-xs px-4 py-2">
              Explore Product Catalog
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {recommendedProducts.map((prod) => (
              <ProductRecommendationCard 
                key={prod.product_id} 
                prod={prod} 
                skinType={activeSkinType || 'Combination'} 
                concern={activeConcern || 'General Care'} 
              />
            ))}
          </div>
        )}
      </div>

      {/* 3. KEY ACTIVE INGREDIENTS GUIDE */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="border-b border-[#E5E7EB] pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D4A3E]">Dermatological Actives</span>
          <h3 className="font-serif text-xl font-bold text-[#111827]">Key Active Ingredients For Your Skin Concern</h3>
          <p className="text-xs text-[#4B5563]">Active ingredients present in your recommended products and how they support your skin barrier.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1">
            <span className="font-serif text-sm font-bold text-[#111827] block">Salicylic Acid / Neem</span>
            <p className="text-[#4B5563] leading-relaxed">Helps exfoliate dead skin cells, unclog pores, and reduce excess sebum accumulation in oily & acne-prone skin.</p>
          </div>

          <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1">
            <span className="font-serif text-sm font-bold text-[#111827] block">Niacinamide / Cica</span>
            <p className="text-[#4B5563] leading-relaxed">Supports natural barrier function, calms visible redness, and helps improve uneven skin tone texture.</p>
          </div>

          <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1">
            <span className="font-serif text-sm font-bold text-[#111827] block">Hyaluronic Acid / Aloe</span>
            <p className="text-[#4B5563] leading-relaxed">Provides deep moisture retention without clogging pores, leaving skin hydrated, soft, and balanced.</p>
          </div>
        </div>
      </div>

      {/* 4. SKINCARE PRODUCT LAYERING GUIDE */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="border-b border-[#E5E7EB] pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D4A3E]">Routine Best Practices</span>
          <h3 className="font-serif text-xl font-bold text-[#111827]">Skincare Product Layering Order</h3>
          <p className="text-xs text-[#4B5563]">Follow this standard clinical order to maximize product absorption and efficacy.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1 text-center">
            <div className="w-8 h-8 rounded-full bg-[#2D4A3E] text-white font-bold flex items-center justify-center mx-auto mb-2 text-xs">1</div>
            <strong className="text-[#111827] block font-serif text-sm">Cleanser</strong>
            <p className="text-[#6B7280] text-[11px]">Wash face thoroughly with lukewarm water.</p>
          </div>

          <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1 text-center">
            <div className="w-8 h-8 rounded-full bg-[#2D4A3E] text-white font-bold flex items-center justify-center mx-auto mb-2 text-xs">2</div>
            <strong className="text-[#111827] block font-serif text-sm">Serum / Active</strong>
            <p className="text-[#6B7280] text-[11px]">Apply lightweight active formulas onto dry skin.</p>
          </div>

          <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1 text-center">
            <div className="w-8 h-8 rounded-full bg-[#2D4A3E] text-white font-bold flex items-center justify-center mx-auto mb-2 text-xs">3</div>
            <strong className="text-[#111827] block font-serif text-sm">Moisturizer</strong>
            <p className="text-[#6B7280] text-[11px]">Lock in hydration and support barrier health.</p>
          </div>

          <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1 text-center">
            <div className="w-8 h-8 rounded-full bg-[#2D4A3E] text-white font-bold flex items-center justify-center mx-auto mb-2 text-xs">4</div>
            <strong className="text-[#111827] block font-serif text-sm">Sunscreen (AM)</strong>
            <p className="text-[#6B7280] text-[11px]">Shield skin against daily UV exposure.</p>
          </div>
        </div>
      </div>

      <MedicalDisclaimerBanner />

    </div>
  );
};
