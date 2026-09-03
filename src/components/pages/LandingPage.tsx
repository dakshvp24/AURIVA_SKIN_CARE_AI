import React from 'react';
import { 
  Sparkles, Stethoscope, ShoppingBag, ShieldCheck, 
  ArrowRight, Award, CheckCircle2, UserCheck, Activity, Brain
} from 'lucide-react';

interface LandingPageProps {
  onStartAssessment: () => void;
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAssessment,
  onNavigate
}) => {
  return (
    <div className="space-y-16 py-8 animate-fade-in">
      
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xs relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3F4F1] border border-[#E5E7EB] text-xs font-bold text-[#2D4A3E]">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AURIVA — Clinical Skincare Intelligence</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] leading-[1.15] tracking-tight">
              Calm, Evidence-Based Dermatology for Your Skin.
            </h1>

            <p className="text-base sm:text-lg text-[#374151] font-normal leading-relaxed max-w-xl">
              Auriva correlates clinical dermatological datasets, 1,200 formulations, and machine learning models to recommend evidence-backed routines and verified dermatologists.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartAssessment}
                className="derm-pill-btn text-sm px-7 py-3.5 shadow-md flex items-center gap-2"
              >
                <Stethoscope className="w-5 h-5" />
                <span>Start Free Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="derm-pill-secondary text-sm px-6 py-3.5"
              >
                Explore 1,200 Products
              </button>
            </div>

            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-[#E5E7EB] text-xs text-[#374151]">
              <div>
                <strong className="font-serif text-xl font-bold text-[#111827] block">98.8%</strong>
                <span>ML Accuracy Score</span>
              </div>
              <div>
                <strong className="font-serif text-xl font-bold text-[#111827] block">1,200</strong>
                <span>Verified Products</span>
              </div>
              <div>
                <strong className="font-serif text-xl font-bold text-[#111827] block">1,165</strong>
                <span>Doctors Listed</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#E5E7EB] bg-[#F3F4F1] shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
                alt="Auriva Skincare Science"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D4A3E]">How Auriva Works</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111827]">
            Dataset-Driven Dermatology Engine
          </h2>
          <p className="text-sm text-[#4B5563]">
            Simple enough for anyone to understand. Professional enough to trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="derm-card p-6 bg-white space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#F3F4F1] text-[#2D4A3E] flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#111827]">AI Symptom Assessment</h3>
            <p className="text-xs text-[#374151] leading-relaxed">
              Correlates symptoms against 2,200 clinical skin condition records to identify concern probability and risk levels.
            </p>
          </div>

          <div className="derm-card p-6 bg-white space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#F3F4F1] text-[#2D4A3E] flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#111827]">Safety & Allergen Checker</h3>
            <p className="text-xs text-[#374151] leading-relaxed">
              Matches product ingredients against user sensitivity profiles and triggers immediate safety alerts if conflicts exist.
            </p>
          </div>

          <div className="derm-card p-6 bg-white space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#F3F4F1] text-[#2D4A3E] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#111827]">Verified Doctor Search</h3>
            <p className="text-xs text-[#374151] leading-relaxed">
              Connect with 1,165 verified dermatologists across 25 cities in India with direct booking and consultation types.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
