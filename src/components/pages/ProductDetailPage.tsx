import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, ShieldCheck, Info, ArrowLeft, ExternalLink, Check, Tag, Sparkles, AlertCircle 
} from 'lucide-react';
import { ProductRecord, AssessmentResult } from '../../types';
import { loadProductsData } from '../../services/dataLoader';
import { MedicalDisclaimerBanner } from '../layout/MedicalDisclaimerBanner';

import { VerifiedProductImage } from '../common/VerifiedProductImage';
import { ProductAuthenticationModal } from '../features/ProductAuthenticationModal';
import { lookupVerifiedProduct } from '../../services/productImageCatalog';

interface ProductDetailPageProps {
  productId?: string;
  onBack?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId: propId, onBack }) => {
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [latestAssessment, setLatestAssessment] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Read ID from URL query string if not passed directly
    const params = new URLSearchParams(window.location.search);
    const targetId = propId || params.get('id');

    // Read stored assessment for personalized recommendation logic
    try {
      const storedAssessmentRaw = localStorage.getItem('auriva_latest_assessment');
      if (storedAssessmentRaw) {
        setLatestAssessment(JSON.parse(storedAssessmentRaw));
      }
    } catch (e) {}

    async function fetchProduct() {
      setLoading(true);
      const allProducts = await loadProductsData();
      if (targetId) {
        const found = allProducts.find(
          p => p.product_id === targetId || p.product_name.toLowerCase() === targetId.toLowerCase()
        );
        if (found) {
          setProduct(found);
        }
      }
      setLoading(false);
    }

    fetchProduct();
  }, [propId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 max-w-md w-full text-center space-y-3 shadow-sm">
          <ShoppingBag className="w-10 h-10 text-[#2D4A3E] animate-bounce mx-auto" />
          <h2 className="font-serif text-xl font-bold text-[#111827]">Loading Product Details...</h2>
          <p className="text-xs text-[#6B7280]">Fetching verified dataset attributes from Auriva.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-[#111827]">Product Not Found</h2>
          <p className="text-xs text-[#4B5563]">The requested product identifier does not exist in the Auriva dataset.</p>
          <button 
            onClick={() => window.close()} 
            className="derm-pill-btn text-xs px-6 py-2.5"
          >
            Close Page
          </button>
        </div>
      </div>
    );
  }

  // Look up verified catalog details
  const verifiedInfo = lookupVerifiedProduct(product.product_name || product.product_id);
  const existingUse = verifiedInfo.existingProductUse || product.product_use;

  // Dynamic "Why This Product Was Recommended" generator
  const getWhyRecommended = () => {
    if (!latestAssessment) {
      return `Listed as suitable for ${product.skin_type || 'all skin types'} targeting ${product.skin_concern || 'general skincare'}.`;
    }

    const skinType = latestAssessment.request.skinType;
    const concern = latestAssessment.possibleConcern;
    const reasons: string[] = [];

    if (product.skin_type && product.skin_type.toLowerCase().includes(skinType.toLowerCase())) {
      reasons.push(`matches your assessed ${skinType} skin type`);
    }
    if (product.skin_concern && product.skin_concern.toLowerCase().includes(concern.toLowerCase())) {
      reasons.push(`targets your primary concern of ${concern}`);
    }
    if (product.key_ingredients && product.key_ingredients !== 'None') {
      reasons.push(`contains key active ingredients (${product.key_ingredients})`);
    }

    if (reasons.length > 0) {
      return `Recommended because this product ${reasons.join(' and ')}.`;
    }
    return `Recommended as a balanced formulation for ${skinType} skin dealing with ${concern}.`;
  };

  // Helper for active ingredient benefit analysis
  const getIngredientExplanation = (ingredientStr: string) => {
    if (!ingredientStr || ingredientStr === 'None') return "Ingredient information unavailable.";
    const ingLower = ingredientStr.toLowerCase();
    
    if (ingLower.includes('salicylic')) {
      return "Salicylic Acid → Beta Hydroxy Acid (BHA) that penetrates oil glands to exfoliate pore lining and reduce breakouts.";
    }
    if (ingLower.includes('niacinamide')) {
      return "Niacinamide (Vitamin B3) → Helps support the skin barrier, even skin tone, and balance sebum production.";
    }
    if (ingLower.includes('hyaluronic')) {
      return "Hyaluronic Acid → Humectant that attracts and locks hydration into skin layers without clogging pores.";
    }
    if (ingLower.includes('retinol') || ingLower.includes('retinoid')) {
      return "Retinol / Retinoid → Promotes cell turnover, boosts collagen production, and refines skin texture.";
    }
    if (ingLower.includes('centella') || ingLower.includes('cica')) {
      return "Centella Asiatica (Cica) → Soothes skin irritation, calms redness, and repairs compromised skin barrier.";
    }
    if (ingLower.includes('ceramide')) {
      return "Ceramides → Essential lipids that restore moisture barrier integrity and protect against moisture loss.";
    }

    return `${ingredientStr} → Formulated to support general skin health and barrier recovery.`;
  };

  // Extract Shopping Links safely without fake search URLs
  const amazonUrl = product.amazon_url && product.amazon_url.startsWith('http') ? product.amazon_url : null;
  const flipkartUrl = product.flipkart_url && product.flipkart_url.startsWith('http') ? product.flipkart_url : null;
  const myntraUrl = product.myntra_url && product.myntra_url.startsWith('http') ? product.myntra_url : null;
  const rawUrl = product.product_url || '';
  const genericOfficialUrl = (!amazonUrl && !flipkartUrl && !myntraUrl && rawUrl.startsWith('http')) ? rawUrl : null;

  const hasAnyShoppingLink = Boolean(amazonUrl || flipkartUrl || myntraUrl || genericOfficialUrl);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111827] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        {/* HEADER BAR */}
        <div className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2D4A3E] text-white flex items-center justify-center font-serif font-bold text-lg">
              A
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2D4A3E]">AURIVA CLINICAL CATALOG</span>
              <h1 className="font-serif text-lg font-bold text-[#111827]">Product Details</h1>
            </div>
          </div>

          <button 
            onClick={() => onBack ? onBack() : window.close()}
            className="derm-pill-secondary text-xs px-4 py-2 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4 text-[#2D4A3E]" />
            <span>{onBack ? 'Back to App' : 'Close Tab'}</span>
          </button>
        </div>

        {/* MAIN PRODUCT DETAIL GRID */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: AUTHENTIC PRODUCT IMAGE */}
          <div className="md:col-span-5 flex flex-col items-center space-y-3">
            <div className="w-full aspect-square rounded-2xl overflow-hidden border border-[#E5E7EB] bg-[#FAFAF8] p-4 flex items-center justify-center">
              <VerifiedProductImage 
                productName={product.product_name}
                productId={product.product_id}
                imageUrl={product.image_url}
                className="w-full h-full object-contain rounded-xl"
                showBadge={true}
              />
            </div>

            <button 
              onClick={() => setShowAuthModal(true)}
              className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Verify Product Authenticity</span>
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {product.fragrance_free === 'Yes' && (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-full">
                  ✓ Fragrance-Free
                </span>
              )}
              {product.non_comedogenic === 'Yes' && (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-full">
                  ✓ Non-Comedogenic
                </span>
              )}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO & SPECIFICATIONS */}
          <div className="md:col-span-7 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#2D4A3E] uppercase tracking-wider block">{product.brand_name}</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111827]">{product.product_name}</h2>
              <span className="inline-block text-xs bg-[#F3F4F1] text-[#111827] px-3 py-1 rounded-full font-medium mt-1">
                Category: {product.product_category}
              </span>
            </div>

            <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block">Dataset Price</span>
                <span className="font-serif text-2xl font-bold text-[#111827]">₹{product.price_inr || 'Price unavailable'}</span>
              </div>
              <span className="text-[10px] text-[#6B7280] max-w-[140px] text-right font-medium">
                *Live shopping platform prices may vary.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#6B7280] block">Suitable For</span>
                <span className="font-semibold text-[#111827]">{product.skin_type || 'All Skin Types'}</span>
              </div>
              <div className="p-3.5 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#6B7280] block">Target Concern</span>
                <span className="font-semibold text-[#111827]">{product.skin_concern || 'General Care'}</span>
              </div>
            </div>

            {/* DYNAMIC WHY THIS PRODUCT WAS RECOMMENDED */}
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-1 text-xs text-emerald-950">
              <strong className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#2D4A3E]" />
                Why We Recommend It
              </strong>
              <p className="leading-relaxed">{getWhyRecommended()}</p>
            </div>
          </div>

        </div>

        {/* KEY INGREDIENTS & ANALYSIS */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="font-serif text-xl font-bold text-[#111827] border-b border-[#E5E7EB] pb-3">Key Ingredients</h3>
          
          <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-2 text-xs">
            <p className="font-bold text-[#111827] text-sm">{product.key_ingredients || 'Ingredient information unavailable.'}</p>
            <p className="text-[#374151] leading-relaxed">
              {getIngredientExplanation(product.key_ingredients)}
            </p>
          </div>
        </div>

        {/* DESCRIPTION, HOW TO USE & PRODUCT USE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-3 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-[#111827] border-b border-[#E5E7EB] pb-2">Product Description</h3>
            <p className="text-xs text-[#374151] leading-relaxed">
              {product.product_description || `${product.product_name} is a high-efficacy ${product.product_category} formulated by ${product.brand_name} specifically for ${product.skin_type || 'all'} skin dealing with ${product.skin_concern || 'daily skincare'} concerns.`}
            </p>
            {existingUse && (
              <div className="p-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs space-y-1 mt-2">
                <strong className="text-[10px] font-bold uppercase text-[#2D4A3E] block">Existing Product Use:</strong>
                <p className="text-[#374151] font-medium">{existingUse}</p>
              </div>
            )}
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-3 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-[#111827] border-b border-[#E5E7EB] pb-2">How To Use</h3>
            <p className="text-xs text-[#374151] leading-relaxed">
              {product.usage_instructions || 'Apply a small amount to clean, dry skin as directed in your daily skincare routine. Massage gently until absorbed. For morning use, follow with broad-spectrum sunscreen.'}
            </p>
          </div>
        </div>

        {/* WHERE TO BUY — VERIFIED SHOPPING PLATFORM INTEGRATION */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="border-b border-[#E5E7EB] pb-3">
            <h3 className="font-serif text-xl font-bold text-[#111827]">Where to Buy</h3>
            <p className="text-xs text-[#4B5563]">Verified online retail listings for {product.product_name}.</p>
          </div>

          {hasAnyShoppingLink ? (
            <div className="flex flex-wrap items-center gap-4 pt-1">
              {amazonUrl && (
                <a
                  href={amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FF9900] hover:bg-[#E68A00] text-black font-bold text-xs px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-xs"
                >
                  <span>🛒 Buy on Amazon</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {flipkartUrl && (
                <a
                  href={flipkartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#2874F0] hover:bg-[#1C5CBD] text-white font-bold text-xs px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-xs"
                >
                  <span>🛍️ Buy on Flipkart</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {myntraUrl && (
                <a
                  href={myntraUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FF3F6C] hover:bg-[#E02F5A] text-white font-bold text-xs px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-xs"
                >
                  <span>💄 Buy on Myntra</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {genericOfficialUrl && (
                <a
                  href={genericOfficialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#2D4A3E] hover:bg-[#233B31] text-white font-bold text-xs px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-xs"
                >
                  <span>🌐 Buy Official Listing</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ) : (
            <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl text-xs text-[#6B7280]">
              Online purchase links are currently unavailable for this specific dataset product listing.
            </div>
          )}

          <p className="text-[10px] text-[#9CA3AF] pt-2">
            Disclaimer: Product information, stock, and pricing on external shopping platforms are managed independently by third-party retailers.
          </p>
        </div>

        <MedicalDisclaimerBanner />

        {/* AUTHENTICATION MODAL */}
        <ProductAuthenticationModal 
          product={product}
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />

      </div>
    </div>
  );
};
