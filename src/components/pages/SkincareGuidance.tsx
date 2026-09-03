import React from 'react';
import { Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { AssessmentResult, SkinProfile } from '../../types';

interface SkincareGuidanceProps {
  latestAssessment: AssessmentResult | null;
  skinProfile: SkinProfile | null;
  onNavigate: (tab: string) => void;
}

export const SkincareGuidance: React.FC<SkincareGuidanceProps> = ({
  latestAssessment,
  skinProfile,
  onNavigate
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D4A3E]">Auriva Evidence Guidance</span>
          <h1 className="font-serif text-3xl font-bold text-[#111827] mt-1">Personalized Skincare Routine</h1>
          <p className="text-xs text-[#4B5563] font-medium mt-1">
            Recommended regimen for {skinProfile?.skinType || 'Combination'} skin based on clinical dataset matching.
          </p>
        </div>

        <button onClick={() => onNavigate('products')} className="derm-pill-btn text-xs px-5 py-2.5">
          Browse Formulations
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* AM Routine */}
        <div className="derm-card p-6 bg-white space-y-4">
          <div className="border-b border-[#E5E7EB] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D4A3E]">Morning Regimen (AM)</span>
            <h3 className="font-serif text-xl font-bold text-[#111827]">Protect & Hydrate</h3>
          </div>

          <ul className="space-y-3 text-xs text-[#374151]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2D4A3E] shrink-0 mt-0.5" />
              <span><strong>1. Gentle Cleanser:</strong> Wash with pH-balanced non-stripping cleanser.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2D4A3E] shrink-0 mt-0.5" />
              <span><strong>2. Antioxidant Active:</strong> Apply Vitamin C or Niacinamide serum to protect against environmental stressors.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2D4A3E] shrink-0 mt-0.5" />
              <span><strong>3. Sunscreen:</strong> Apply broad spectrum SPF 30/50 non-comedogenic sunscreen daily.</span>
            </li>
          </ul>
        </div>

        {/* PM Routine */}
        <div className="derm-card p-6 bg-white space-y-4">
          <div className="border-b border-[#E5E7EB] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D4A3E]">Evening Regimen (PM)</span>
            <h3 className="font-serif text-xl font-bold text-[#111827]">Repair & Restore</h3>
          </div>

          <ul className="space-y-3 text-xs text-[#374151]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2D4A3E] shrink-0 mt-0.5" />
              <span><strong>1. Double Cleanse:</strong> Remove sunscreen & impurities gently.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2D4A3E] shrink-0 mt-0.5" />
              <span><strong>2. Targeted Active:</strong> Apply recommended active ingredient ({latestAssessment?.suggestedIngredients[0] || 'Ceramides'}).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2D4A3E] shrink-0 mt-0.5" />
              <span><strong>3. Barrier Cream:</strong> Lock in moisture with barrier support moisturizer before sleep.</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
