import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Sparkles, Activity, ShieldCheck, Heart } from 'lucide-react';
import { SkinProfile, SkinType } from '../../types';

interface SkinProfileWizardProps {
  initialProfile: SkinProfile | null;
  onSave: (profile: SkinProfile) => void;
  onCancel: () => void;
}

export const SkinProfileWizard: React.FC<SkinProfileWizardProps> = ({
  initialProfile,
  onSave,
  onCancel
}) => {
  const [step, setStep] = useState(1);
  
  const [skinType, setSkinType] = useState<SkinType>(initialProfile?.skinType || 'Combination');
  const [oiliness, setOiliness] = useState<string>(initialProfile?.oiliness || 'Moderate');
  const [dryness, setDryness] = useState<string>(initialProfile?.dryness || 'Low');
  const [sensitivity, setSensitivity] = useState<string>(initialProfile?.sensitivity || 'Moderate');
  const [allergiesText, setAllergiesText] = useState((initialProfile?.allergies || []).join(', '));
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(
    initialProfile?.mainConcerns && initialProfile.mainConcerns.length > 0
      ? initialProfile.mainConcerns
      : ['Dullness', 'Acne']
  );

  const skinTypeOptions: { type: SkinType; label: string; desc: string }[] = [
    { type: 'Normal', label: 'Normal Skin', desc: 'Balanced hydration, few imperfections, non-sensitive' },
    { type: 'Dry', label: 'Dry Skin', desc: 'Tightness, flaking, dull tone, requires deep emollient moisture' },
    { type: 'Oily', label: 'Oily Skin', desc: 'Excess sebum, visible pores, prone to blackheads and acne' },
    { type: 'Combination', label: 'Combination Skin', desc: 'Oily T-zone (forehead/nose) with normal to dry cheeks' },
    { type: 'Sensitive', label: 'Sensitive Skin', desc: 'Prone to redness, burning, itching, reactive to formulas' },
  ];

  const concernOptions = [
    { id: 'Fine Lines', label: 'Fine Lines & Wrinkles', icon: Activity, img: 'https://images.unsplash.com/photo-1512290900673-7002b5420925?auto=format&fit=crop&w=400&q=80' },
    { id: 'Dullness', label: 'Dullness & Uneven Tone', icon: Sparkles, img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80' },
    { id: 'Acne', label: 'Acne & Blemishes', icon: ShieldCheck, img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80' },
    { id: 'Pigmentation', label: 'Pigmentation & Spots', icon: Heart, img: 'https://images.unsplash.com/photo-1608248597261-75468779b5c7?auto=format&fit=crop&w=400&q=80' },
  ];

  const toggleConcern = (id: string) => {
    if (selectedConcerns.includes(id)) {
      setSelectedConcerns(selectedConcerns.filter(c => c !== id));
    } else {
      setSelectedConcerns([...selectedConcerns, id]);
    }
  };

  const handleFinish = () => {
    const allergiesList = allergiesText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const updated: SkinProfile = {
      skinType,
      oiliness,
      dryness,
      sensitivity,
      allergies: allergiesList,
      mainConcerns: selectedConcerns,
      profileCompleted: true,
      updatedAt: new Date().toISOString()
    };

    onSave(updated);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="derm-card p-6 sm:p-10 bg-white space-y-8">
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#666666]">
            <span>Step {step} of 5</span>
            <span>{Math.round((step / 5) * 100)}% Completed</span>
          </div>
          <div className="h-2 w-full bg-[#F6F3EE] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#4A5D4E] transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: SKIN TYPE */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#4A5D4E]">Step 1</span>
              <h2 className="font-serif text-2xl font-bold text-[#1F1F1F]">Select Your Primary Skin Type</h2>
              <p className="text-xs text-[#666666] font-light">Choose the description that best reflects your bare skin state.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {skinTypeOptions.map((opt) => {
                const isSelected = skinType === opt.type;
                return (
                  <div
                    key={opt.type}
                    onClick={() => setSkinType(opt.type)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#FAFAF7] border-2 border-[#4A5D4E] shadow-sm'
                        : 'bg-white border-[#E5DFD5] hover:border-[#D8D0C5]'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-[#1F1F1F]">{opt.label}</h4>
                      <p className="text-xs text-[#666666] font-light mt-0.5">{opt.desc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                      isSelected ? 'bg-[#4A5D4E] border-[#4A5D4E] text-white' : 'border-[#E5DFD5]'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: CHARACTERISTICS */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#4A5D4E]">Step 2</span>
              <h2 className="font-serif text-2xl font-bold text-[#1F1F1F]">Skin Characteristics</h2>
              <p className="text-xs text-[#666666] font-light">Rate your typical daily oiliness, dryness, and reactivity.</p>
            </div>

            <div className="space-y-5">
              
              {/* Oiliness */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1F1F1F]">Oiliness Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Low', 'Moderate', 'High'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setOiliness(lvl)}
                      className={`py-2.5 rounded-xl border text-xs font-medium transition-all ${
                        oiliness === lvl
                          ? 'bg-[#4A5D4E] text-white border-[#4A5D4E]'
                          : 'bg-[#FAFAF7] border-[#E5DFD5] text-[#1F1F1F] hover:bg-[#EFECE6]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dryness */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1F1F1F]">Dryness Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Low', 'Moderate', 'High'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDryness(lvl)}
                      className={`py-2.5 rounded-xl border text-xs font-medium transition-all ${
                        dryness === lvl
                          ? 'bg-[#4A5D4E] text-white border-[#4A5D4E]'
                          : 'bg-[#FAFAF7] border-[#E5DFD5] text-[#1F1F1F] hover:bg-[#EFECE6]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sensitivity */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1F1F1F]">Sensitivity Reactivity</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Low', 'Moderate', 'High'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSensitivity(lvl)}
                      className={`py-2.5 rounded-xl border text-xs font-medium transition-all ${
                        sensitivity === lvl
                          ? 'bg-[#4A5D4E] text-white border-[#4A5D4E]'
                          : 'bg-[#FAFAF7] border-[#E5DFD5] text-[#1F1F1F] hover:bg-[#EFECE6]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STEP 3: ALLERGIES */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#4A5D4E]">Step 3</span>
              <h2 className="font-serif text-2xl font-bold text-[#1F1F1F]">Known Allergies & Sensitivities</h2>
              <p className="text-xs text-[#666666] font-light">List any specific ingredients, fragrances, or preservatives you avoid.</p>
            </div>

            <div className="space-y-3">
              <textarea
                rows={4}
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                placeholder="e.g. Artificial fragrance, Denatured alcohol, Benzoyl peroxide, Essential oils..."
                className="w-full p-4 bg-[#FAFAF7] border border-[#E5DFD5] rounded-2xl text-sm focus:outline-none focus:border-[#4A5D4E]"
              />
              <p className="text-xs text-[#888888]">Separate multiple items with commas.</p>
            </div>
          </div>
        )}

        {/* STEP 4: MAIN CONCERNS (Visual 2x2 Cards from Reference) */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#4A5D4E]">Step 4</span>
              <h2 className="font-serif text-2xl font-bold text-[#1F1F1F]">Primary Skin Concerns</h2>
              <p className="text-xs text-[#666666] font-light">Select all concerns you want your personalized routine to target.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {concernOptions.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedConcerns.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleConcern(item.id)}
                    className={`rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-2 border-[#4A5D4E] bg-[#4A5D4E] text-white shadow-md'
                        : 'border-[#E5DFD5] bg-[#FAFAF7] text-[#1F1F1F] hover:border-[#D8D0C5]'
                    }`}
                  >
                    <div className="h-28 overflow-hidden relative">
                      <img 
                        src={item.img} 
                        alt={item.label}
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                    <div className="p-3 text-center flex items-center justify-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-semibold">{item.id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & CONFIRM */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#4A5D4E]">Step 5</span>
              <h2 className="font-serif text-2xl font-bold text-[#1F1F1F]">Review Your Skin Profile</h2>
              <p className="text-xs text-[#666666] font-light">Confirm your selections to finalize your personalized recommendation engine.</p>
            </div>

            <div className="space-y-3 bg-[#FAFAF7] border border-[#E5DFD5] rounded-2xl p-5 text-sm">
              <div className="flex justify-between py-1 border-b border-[#E5DFD5]">
                <span className="text-[#666666]">Skin Type:</span>
                <span className="font-semibold text-[#1F1F1F]">{skinType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5DFD5]">
                <span className="text-[#666666]">Oiliness / Dryness:</span>
                <span className="font-semibold text-[#1F1F1F]">{oiliness} Oil / {dryness} Dry</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5DFD5]">
                <span className="text-[#666666]">Sensitivity:</span>
                <span className="font-semibold text-[#1F1F1F]">{sensitivity}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#666666]">Target Concerns:</span>
                <span className="font-semibold text-[#4A5D4E]">{selectedConcerns.join(', ')}</span>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION CONTROLS */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E5DFD5]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="derm-pill-secondary text-xs px-5 py-2.5 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-[#666666] hover:underline px-3 py-2"
            >
              Cancel
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="derm-pill-btn text-xs px-6 py-2.5 flex items-center gap-1.5"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="derm-pill-btn text-xs px-7 py-2.5 shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Skin Profile</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
