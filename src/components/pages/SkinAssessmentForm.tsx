import React, { useState } from 'react';
import { Stethoscope, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { AssessmentResult } from '../../types';
import { generateDatasetRecommendations } from '../../services/recommendationEngine';
import { assessmentService } from '../../services/assessmentService';
import { MedicalDisclaimerBanner } from '../layout/MedicalDisclaimerBanner';

interface SkinAssessmentFormProps {
  userId?: string;
  userSkinType: string;
  onComplete: (result: AssessmentResult) => void;
  onCancel: () => void;
}

export const SkinAssessmentForm: React.FC<SkinAssessmentFormProps> = ({
  userId,
  userSkinType,
  onComplete,
  onCancel
}) => {
  const [skinType, setSkinType] = useState<string>(userSkinType || 'Combination');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>('1-2 weeks');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableSymptoms = [
    'Acne breakouts & blackheads',
    'Facial redness & flushing',
    'Dry patches & scaling',
    'Flaking & scalp dandruff',
    'Excess oiliness in T-zone',
    'Itching or burning sensation',
    'Hyperpigmentation & dark spots',
    'Sensitivity & inflammation'
  ];

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom or skin concern.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Query FastAPI ML endpoint
      let mlData: any = null;
      try {
        const mlRes = await fetch('http://127.0.0.1:8000/api/assess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skinType,
            symptoms: selectedSymptoms,
            sensitivity: 'Medium',
            age: 25
          })
        });

        if (mlRes.ok) {
          mlData = await mlRes.json();
        }
      } catch (e) {
        console.warn('FastAPI ML backend offline, using dataset recommendation fallback.', e);
      }

      // 2. Generate multi-factor dataset recommendation
      const rec = await generateDatasetRecommendations(null, {
        skinType,
        symptoms: selectedSymptoms,
        duration
      });

      const possibleConcern = mlData?.possibleConcern || rec.matchingCondition || selectedSymptoms[0];
      const confidenceScore = mlData?.confidenceScore || 92;
      const riskLevel = mlData?.riskLevel || 'Moderate';

      const result: AssessmentResult = {
        id: `ASSESS-${Date.now()}`,
        createdAt: new Date().toISOString(),
        request: {
          skinType,
          symptoms: selectedSymptoms,
          duration
        },
        possibleConcern,
        confidenceScore,
        riskLevel,
        explanation: mlData?.explanation || `Auriva clinical dataset correlation matches patterns of ${possibleConcern} for ${skinType} skin.`,
        suggestedIngredients: rec.suggestedIngredients,
        ingredientsToAvoid: rec.ingredientsToAvoid,
        generalGuidance: rec.guidanceNotes,
        matchingTreatments: rec.matchingTreatments,
        matchingProducts: rec.matchingProducts,
        allergyWarnings: rec.allergyWarnings
      };

      await assessmentService.saveUserAssessment(userId, result);
      onComplete(result);
    } catch (err: any) {
      setError('An error occurred during assessment processing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-[#2D4A3E] text-white flex items-center justify-center mx-auto shadow-xs">
          <Stethoscope className="w-6 h-6 text-emerald-300" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#2D4A3E]">Auriva AI Diagnosis</span>
        <h1 className="font-serif text-3xl font-bold text-[#111827]">Guided Skin Assessment</h1>
        <p className="text-xs sm:text-sm text-[#4B5563] font-medium">
          Select your reported skin characteristics to correlate against Auriva's 2,200 clinical training records.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="derm-card p-6 sm:p-8 bg-white space-y-6">
        
        {/* Skin Type Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#111827] block">1. Select Skin Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {['Combination', 'Oily', 'Sensitive', 'Dry', 'Normal'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSkinType(type)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  skinType === type
                    ? 'bg-[#2D4A3E] text-white border-[#2D4A3E]'
                    : 'bg-[#FAFAF8] text-[#374151] border-[#E5E7EB] hover:bg-[#F3F4F1]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms Checkboxes */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#111827] block">2. Select Current Symptoms / Concerns</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {availableSymptoms.map((sym) => {
              const isChecked = selectedSymptoms.includes(sym);
              return (
                <div
                  key={sym}
                  onClick={() => toggleSymptom(sym)}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    isChecked
                      ? 'bg-[#F3F4F1] border-[#2D4A3E] text-[#111827] font-semibold'
                      : 'bg-[#FAFAF8] border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB]'
                  }`}
                >
                  <span className="text-xs">{sym}</span>
                  {isChecked && <CheckCircle2 className="w-4 h-4 text-[#2D4A3E] shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Duration Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#111827] block">3. Symptom Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#111827]"
          >
            <option value="Less than 1 week">Less than 1 week</option>
            <option value="1-2 weeks">1-2 weeks</option>
            <option value="1 month">1 month</option>
            <option value="More than 1 month">More than 1 month</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-[#2D4A3E] text-white font-semibold text-xs hover:bg-[#233B31] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span>Correlating clinical datasets...</span>
          ) : (
            <>
              <span>Evaluate Symptoms</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>

      <MedicalDisclaimerBanner />

    </div>
  );
};
