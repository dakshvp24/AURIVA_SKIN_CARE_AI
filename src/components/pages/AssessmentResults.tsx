import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, CheckCircle2, ShoppingBag, User, ArrowRight, ShieldCheck, 
  Sun, Moon, AlertCircle, Info, ExternalLink, RefreshCw, X, Tag, Sparkles, Check 
} from 'lucide-react';
import { AssessmentResult, ProductRecord, SymptomTreatmentRecord } from '../../types';
import { loadProductsData, loadSymptomsData } from '../../services/dataLoader';
import { 
  getRecommendedProducts, buildPersonalizedRoutine, getProductUsageInstructions,
  ScoredProduct, PersonalizedRoutine, DetailedRoutineStep 
} from '../../services/recommendationEngine';
import { VerifiedProductImage } from '../common/VerifiedProductImage';
import { MedicalDisclaimerBanner } from '../layout/MedicalDisclaimerBanner';

interface AssessmentResultsProps {
  result: AssessmentResult | null;
  onNavigate: (tab: string) => void;
  onRetake: () => void;
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  result,
  onNavigate,
  onRetake
}) => {
  const [recommendedProducts, setRecommendedProducts] = useState<ScoredProduct[]>([]);
  const [personalizedRoutine, setPersonalizedRoutine] = useState<PersonalizedRoutine | null>(null);
  const [symptomDetail, setSymptomDetail] = useState<SymptomTreatmentRecord | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [showRetakeConfirmModal, setShowRetakeConfirmModal] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<ProductRecord | null>(null);

  useEffect(() => {
    async function initData() {
      if (!result) {
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      const [allProducts, allSymptoms] = await Promise.all([
        loadProductsData(),
        loadSymptomsData()
      ]);

      const skinType = result.request.skinType;
      const concern = result.possibleConcern;

      // 1. Multi-Level Recommended Products Filter (1,200 products dataset)
      const scored = getRecommendedProducts(allProducts, skinType, concern);
      setRecommendedProducts(scored);

      // 2. Personalized Actual Product-Infused Routine Generator
      const routine = buildPersonalizedRoutine(allProducts, skinType, concern);
      setPersonalizedRoutine(routine);

      // 3. Symptoms Guidance Filter (550 symptoms dataset)
      const concernLower = (concern || '').toLowerCase();
      const matchedSymptom = allSymptoms.find(s => 
        s.skin_condition.toLowerCase().includes(concernLower) ||
        concernLower.includes(s.skin_condition.toLowerCase())
      );

      if (matchedSymptom) {
        setSymptomDetail(matchedSymptom);
      }

      setLoadingData(false);
    }

    initData();
  }, [result]);

  if (!result) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <Stethoscope className="w-12 h-12 text-[#6B7280] mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-[#111827]">No Assessment Results Available</h2>
        <p className="text-xs text-[#4B5563]">Please complete a skin assessment to view clinical insights.</p>
        <button onClick={onRetake} className="derm-pill-btn text-xs px-6 py-2.5">
          Start Assessment
        </button>
      </div>
    );
  }

  // Helper for ingredient benefits explanation
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* 1. ASSESSMENT COMPLETE BANNER HEADER */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D4A3E]">AURIVA ASSESSMENT REPORT</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              ASSESSMENT COMPLETE ✓
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#111827] mt-1">Clinical Evaluation Results</h1>
          <p className="text-xs text-[#4B5563] font-medium mt-1">
            Evaluated on {new Date(result.createdAt).toLocaleDateString()} for <strong>{result.request.skinType}</strong> skin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowRetakeConfirmModal(true)} 
            className="derm-pill-secondary text-xs px-4 py-2 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>
          <button onClick={() => onNavigate('doctors')} className="derm-pill-btn text-xs px-5 py-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>Consult Dermatologist</span>
          </button>
        </div>
      </div>

      {/* 2. YOUR SKIN PROFILE SUMMARY CARD */}
      <div className="derm-card p-6 sm:p-8 bg-white space-y-4 border border-[#E5E7EB]">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <h2 className="font-serif text-2xl font-bold text-[#111827]">Your Skin Profile</h2>
          <span className="px-3 py-1 bg-[#2D4A3E] text-white text-xs font-bold rounded-full">
            {result.confidenceScore}% Confidence Match
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Skin Type</span>
            <span className="font-serif text-lg font-bold text-[#111827] block">{result.request.skinType}</span>
          </div>

          <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Primary Concern</span>
            <span className="font-serif text-lg font-bold text-[#111827] block">{result.possibleConcern}</span>
          </div>

          <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Evaluation Risk Level</span>
            <span className="font-serif text-lg font-bold text-[#111827] block">{result.riskLevel} Risk</span>
          </div>
        </div>

        {/* Reported Symptoms Tags */}
        <div className="pt-2 space-y-2">
          <strong className="text-xs font-bold uppercase tracking-wider text-[#111827] block">Reported Symptoms & Indicators:</strong>
          <div className="flex flex-wrap gap-2">
            {(result.request.symptoms && result.request.symptoms.length > 0 ? result.request.symptoms : ['Moderate Sebum', 'Occasional Blemishes']).map((sym, idx) => (
              <span key={idx} className="text-xs bg-[#F3F4F1] text-[#2D4A3E] border border-[#E5E7EB] px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#2D4A3E]" />
                <span>{sym}</span>
              </span>
            ))}
          </div>
        </div>

        <p className="text-xs text-[#374151] leading-relaxed pt-1">
          {result.explanation}
        </p>
      </div>

      {/* 3. YOUR SKIN CONCERNS & SYMPTOMS */}
      <div className="space-y-4">
        <div className="border-b border-[#E5E7EB] pb-3">
          <h3 className="font-serif text-2xl font-bold text-[#111827]">Your Skin Concerns & Symptoms</h3>
          <p className="text-xs text-[#4B5563]">Symptom analysis retrieved directly from Auriva's 550 Symptoms Dataset.</p>
        </div>

        <div className="derm-card p-6 sm:p-8 bg-white border border-[#E5E7EB] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <span className="text-sm font-bold text-[#111827]">{result.possibleConcern} Overview</span>
            <span className="text-xs text-[#2D4A3E] font-semibold">Dataset Category Match</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1 text-xs">
              <strong className="text-xs font-bold text-[#111827] block">Relevant Symptoms & Signs:</strong>
              <p className="text-[#374151]">{symptomDetail?.common_symptoms || `Persistent redness, localized inflammation, uneven texture, or active breakouts on ${result.request.skinType} skin.`}</p>
            </div>

            <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1 text-xs">
              <strong className="text-xs font-bold text-[#111827] block">Possible Contributing Factors & Precautions:</strong>
              <p className="text-[#374151]">{symptomDetail?.contraindications || symptomDetail?.treatment_notes || 'Hormonal fluctuations, environmental humidity, pore blockage from heavy comedogenic products, or barrier stress.'}</p>
            </div>
          </div>

          <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1 text-xs">
            <strong className="text-xs font-bold text-[#111827] block">General Care Information:</strong>
            <p className="text-[#374151]">{symptomDetail?.frequency_guidance || 'Maintain consistent gentle cleansing twice daily. Avoid harsh abrasive physical scrubs, and protect your skin barrier with non-comedogenic moisturizers.'}</p>
          </div>
        </div>
      </div>

      {/* 4. POSSIBLE SKIN CONDITION (STRICT NON-DIAGNOSTIC SAFETY) */}
      <div className="derm-card p-6 sm:p-8 bg-white border border-[#E5E7EB] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D4A3E]">Medical Safety & Observation</span>
            <h3 className="font-serif text-2xl font-bold text-[#111827]">Possible Skin Condition</h3>
          </div>
          <ShieldCheck className="w-8 h-8 text-[#2D4A3E]" />
        </div>

        <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-2 text-xs text-emerald-950">
          <strong className="text-sm font-bold block text-[#111827]">{symptomDetail?.skin_condition || result.possibleConcern}</strong>
          <p>
            Your responses <strong>are consistent with concerns commonly associated with {result.possibleConcern}</strong>. This assessment provides educational skincare insights and does not constitute a formal clinical diagnosis.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <p className="text-xs text-[#6B7280] max-w-lg">
            If your symptoms are severe, persistent, painful, or worsening, we recommend consulting a qualified dermatologist.
          </p>

          <button 
            onClick={() => onNavigate('doctors')}
            className="derm-pill-btn text-xs px-6 py-2.5 shrink-0 flex items-center justify-center gap-1.5"
          >
            <User className="w-4 h-4" />
            <span>Consult a Dermatologist ↗</span>
          </button>
        </div>
      </div>

      {/* 5. RECOMMENDED PRODUCTS FOR YOU (5-LEVEL MATCHING HIERARCHY) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#111827]">Recommended Products For You</h3>
            <p className="text-xs text-[#4B5563]">Matched from Auriva's Indian Skincare Products 200 Catalog using multi-level suitability scoring for {result.request.skinType} skin targeting {result.possibleConcern}.</p>
          </div>

          <button onClick={() => onNavigate('products')} className="text-xs text-[#2D4A3E] font-bold hover:underline flex items-center gap-1">
            <span>Explore All 200+ Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loadingData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-48 bg-white border border-[#E5E7EB] rounded-2xl animate-pulse p-4" />
            ))}
          </div>
        ) : recommendedProducts.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#E5E7EB] rounded-2xl space-y-3">
            <ShoppingBag className="w-8 h-8 text-[#9CA3AF] mx-auto" />
            <p className="text-xs font-semibold text-[#4B5563]">No suitable products are currently available in our database for this specific filter combination.</p>
            <button onClick={() => onNavigate('products')} className="derm-pill-btn text-xs px-5 py-2">
              Explore All Products Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProducts.map((prod) => (
              <div key={prod.product_id} className="derm-card p-5 bg-white border border-[#E5E7EB] flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-full h-36 rounded-xl overflow-hidden border border-[#E5E7EB] bg-[#FAFAF8]">
                    <VerifiedProductImage 
                      productName={prod.product_name}
                      productId={prod.product_id}
                      imageUrl={prod.image_url}
                      alt={prod.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#2D4A3E] uppercase tracking-wider block">{prod.brand_name}</span>
                    <span className="text-[10px] bg-[#F3F4F1] text-[#111827] px-2 py-0.5 rounded font-medium">{prod.product_category}</span>
                  </div>

                  <h4 className="text-xs font-bold text-[#111827] line-clamp-2">{prod.product_name}</h4>

                  {/* Key Ingredients */}
                  <div className="space-y-1">
                    <strong className="text-[10px] uppercase font-bold text-[#6B7280] block">Key Ingredients:</strong>
                    <p className="text-[11px] text-[#374151] font-medium line-clamp-2">
                      {prod.key_ingredients || 'Ingredient information unavailable'}
                    </p>
                  </div>

                  {/* Dynamic Why Recommended Card */}
                  <div className="p-2.5 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-[10px] text-[#2D4A3E] font-medium leading-normal">
                    💡 <strong>Why this is recommended:</strong> {prod.whyRecommended}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                  <span className="font-serif text-base font-bold text-[#111827]">₹{prod.price_inr || 'N/A'}</span>
                  
                  <button 
                    onClick={() => window.open(`?view=product-detail&id=${prod.product_id}`, '_blank')}
                    className="derm-pill-btn text-xs px-4 py-1.5"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. YOUR PERSONALIZED ROUTINE (ACTUAL PRODUCT-INFUSED STEPS) */}
      <div className="space-y-4">
        <div className="border-b border-[#E5E7EB] pb-3">
          <h3 className="font-serif text-2xl font-bold text-[#111827]">Your Personalized Skincare Routine</h3>
          <p className="text-xs text-[#4B5563]">Customized daily regimen with actual recommended dataset products and step-by-step usage guidance.</p>
        </div>

        {personalizedRoutine && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ☀️ MORNING ROUTINE */}
            <div className="derm-card p-6 bg-white border border-[#E5E7EB] space-y-5">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 text-[#2D4A3E]">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-500" />
                  <h4 className="font-serif text-lg font-bold text-[#111827]">☀️ MORNING ROUTINE</h4>
                </div>
                <span className="text-xs font-bold text-[#2D4A3E] bg-[#F3F4F1] px-2.5 py-0.5 rounded-full border border-[#E5E7EB]">
                  4 Steps
                </span>
              </div>

              <div className="space-y-4">
                {personalizedRoutine.morning.map((step) => (
                  <div key={step.stepNumber} className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#2D4A3E] text-white flex items-center justify-center font-bold text-[10px]">
                          {step.stepNumber}
                        </span>
                        <strong className="text-xs font-bold text-[#111827]">{step.stepTitle}</strong>
                      </div>
                      <span className="text-[10px] font-semibold text-[#6B7280] bg-white px-2 py-0.5 rounded border border-[#E5E7EB]">
                        {step.categoryName}
                      </span>
                    </div>

                    {step.product ? (
                      <div className="pt-1 space-y-2">
                        <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#E5E7EB]">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            {step.product.image_url && (
                              <img src={step.product.image_url} alt={step.product.product_name} className="w-9 h-9 object-cover rounded-lg shrink-0 border border-[#E5E7EB]" />
                            )}
                            <div className="overflow-hidden">
                              <span className="text-[10px] font-bold text-[#2D4A3E] uppercase block">{step.product.brand_name}</span>
                              <h5 className="text-xs font-bold text-[#111827] truncate">{step.product.product_name}</h5>
                            </div>
                          </div>
                          <span className="font-serif text-xs font-bold text-[#111827] shrink-0 pl-2">₹{step.product.price_inr || 'N/A'}</span>
                        </div>

                        <div className="text-[11px] text-[#374151] space-y-1">
                          <p><strong>Use:</strong> {step.usageInstruction}</p>
                          <p><strong>Why:</strong> {step.whySelected}</p>
                          <p className="text-[#2D4A3E]"><strong>Key ingredient:</strong> {step.keyIngredient}</p>
                        </div>

                        <button 
                          onClick={() => step.product && window.open(`?view=product-detail&id=${step.product.product_id}`, '_blank')} 
                          className="text-[11px] text-[#2D4A3E] font-bold hover:underline block pt-0.5"
                        >
                          View Product Details &rarr;
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-[#6B7280] italic">No specific dataset product matched for this step.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 🌙 EVENING ROUTINE */}
            <div className="derm-card p-6 bg-white border border-[#E5E7EB] space-y-5">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 text-[#2D4A3E]">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-serif text-lg font-bold text-[#111827]">🌙 EVENING ROUTINE</h4>
                </div>
                <span className="text-xs font-bold text-[#2D4A3E] bg-[#F3F4F1] px-2.5 py-0.5 rounded-full border border-[#E5E7EB]">
                  3 Steps
                </span>
              </div>

              <div className="space-y-4">
                {personalizedRoutine.evening.map((step) => (
                  <div key={step.stepNumber} className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#2D4A3E] text-white flex items-center justify-center font-bold text-[10px]">
                          {step.stepNumber}
                        </span>
                        <strong className="text-xs font-bold text-[#111827]">{step.stepTitle}</strong>
                      </div>
                      <span className="text-[10px] font-semibold text-[#6B7280] bg-white px-2 py-0.5 rounded border border-[#E5E7EB]">
                        {step.categoryName}
                      </span>
                    </div>

                    {step.product ? (
                      <div className="pt-1 space-y-2">
                        <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#E5E7EB]">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            {step.product.image_url && (
                              <img src={step.product.image_url} alt={step.product.product_name} className="w-9 h-9 object-cover rounded-lg shrink-0 border border-[#E5E7EB]" />
                            )}
                            <div className="overflow-hidden">
                              <span className="text-[10px] font-bold text-[#2D4A3E] uppercase block">{step.product.brand_name}</span>
                              <h5 className="text-xs font-bold text-[#111827] truncate">{step.product.product_name}</h5>
                            </div>
                          </div>
                          <span className="font-serif text-xs font-bold text-[#111827] shrink-0 pl-2">₹{step.product.price_inr || 'N/A'}</span>
                        </div>

                        <div className="text-[11px] text-[#374151] space-y-1">
                          <p><strong>Use:</strong> {step.usageInstruction}</p>
                          <p><strong>Why:</strong> {step.whySelected}</p>
                          <p className="text-[#2D4A3E]"><strong>Key ingredient:</strong> {step.keyIngredient}</p>
                        </div>

                        <button 
                          onClick={() => step.product && window.open(`?view=product-detail&id=${step.product.product_id}`, '_blank')} 
                          className="text-[11px] text-[#2D4A3E] font-bold hover:underline block pt-0.5"
                        >
                          View Product Details &rarr;
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-[#6B7280] italic">No specific dataset product matched for this step.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Routine Disclaimer */}
        <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl p-4 text-xs text-[#6B7280] flex items-center gap-2">
          <Info className="w-4 h-4 text-[#2D4A3E] shrink-0" />
          <span>This routine is for general skincare guidance and is not a medical diagnosis or substitute for professional dermatological advice.</span>
        </div>
      </div>

      <MedicalDisclaimerBanner />

      {/* 7. PRODUCT DETAILS OVERLAY MODAL */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedProductModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#6B7280] hover:bg-[#F3F4F1] transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Product Image & Basic Info */}
            <div className="flex flex-col sm:flex-row items-start gap-4 pb-4 border-b border-[#E5E7EB]">
              {selectedProductModal.image_url ? (
                <img 
                  src={selectedProductModal.image_url} 
                  alt={selectedProductModal.product_name}
                  className="w-28 h-28 object-cover rounded-2xl border border-[#E5E7EB] shrink-0 bg-[#FAFAF8]"
                />
              ) : (
                <div className="w-28 h-28 bg-[#FAFAF8] rounded-2xl border border-[#E5E7EB] shrink-0 flex items-center justify-center text-[#9CA3AF]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
              )}

              <div className="space-y-1">
                <span className="text-xs font-bold text-[#2D4A3E] uppercase tracking-wider block">{selectedProductModal.brand_name}</span>
                <h3 className="font-serif text-xl font-bold text-[#111827]">{selectedProductModal.product_name}</h3>
                <span className="text-xs text-[#6B7280] font-medium block">Category: {selectedProductModal.product_category}</span>
                <span className="font-serif text-lg font-bold text-[#111827] block pt-1">₹{selectedProductModal.price_inr || 'N/A'}</span>
              </div>
            </div>

            {/* Suitability & Target Concern Tags */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-[#6B7280] block">Suitable Skin Type</span>
                <span className="font-semibold text-[#111827]">{selectedProductModal.skin_type || 'All Skin Types'}</span>
              </div>
              <div className="p-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-[#6B7280] block">Target Skin Concern</span>
                <span className="font-semibold text-[#111827]">{selectedProductModal.skin_concern || 'General Care'}</span>
              </div>
            </div>

            {/* Key Ingredients Breakdown & Explanation */}
            <div className="space-y-2 text-xs">
              <strong className="font-bold text-[#111827] block uppercase tracking-wider">Key Ingredients & Active Analysis:</strong>
              <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-2 text-[#374151]">
                <p className="font-semibold text-[#111827]">{selectedProductModal.key_ingredients || 'Ingredient information unavailable'}</p>
                <p className="text-[11px] text-[#4B5563]">
                  {getIngredientExplanation(selectedProductModal.key_ingredients)}
                </p>
              </div>
            </div>

            {/* Badges: Fragrance-Free & Non-Comedogenic */}
            <div className="flex flex-wrap gap-2 text-xs">
              {selectedProductModal.fragrance_free === 'Yes' && (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-semibold">
                  ✓ Fragrance-Free
                </span>
              )}
              {selectedProductModal.non_comedogenic === 'Yes' && (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-semibold">
                  ✓ Non-Comedogenic
                </span>
              )}
              {selectedProductModal.ingredients_to_avoid && selectedProductModal.ingredients_to_avoid !== 'None' && (
                <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-semibold">
                  Avoid if sensitive to: {selectedProductModal.ingredients_to_avoid}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex gap-3">
              <button
                onClick={() => {
                  setSelectedProductModal(null);
                  onNavigate('products');
                }}
                className="derm-pill-btn text-xs px-6 py-2.5 flex-1 flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Product in Catalog</span>
              </button>
              <button
                onClick={() => setSelectedProductModal(null)}
                className="derm-pill-secondary text-xs px-4 py-2.5"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 8. RETAKE ASSESSMENT CONFIRMATION DIALOG MODAL */}
      {showRetakeConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
            <button
              onClick={() => setShowRetakeConfirmModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#6B7280] hover:bg-[#F3F4F1] transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center mx-auto">
                <RefreshCw className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#111827]">Start a new assessment?</h3>
              <p className="text-xs text-[#4B5563]">
                Your current assessment result will remain saved in your history, but a new evaluation questionnaire will be started.
              </p>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                onClick={() => setShowRetakeConfirmModal(false)}
                className="derm-pill-secondary text-xs px-5 py-2.5 flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRetakeConfirmModal(false);
                  onRetake();
                }}
                className="derm-pill-btn text-xs px-5 py-2.5 flex-1"
              >
                Start New Assessment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
