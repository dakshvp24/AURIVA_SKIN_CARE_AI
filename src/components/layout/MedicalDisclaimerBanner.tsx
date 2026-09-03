import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

interface MedicalDisclaimerBannerProps {
  compact?: boolean;
}

export const MedicalDisclaimerBanner: React.FC<MedicalDisclaimerBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl p-3 flex items-center gap-2.5 text-xs text-[#666666]">
        <Info className="w-4 h-4 text-[#4A5D4E] shrink-0" />
        <span>
          <strong>Informational Guidance:</strong> DermAI provides AI-assisted insights and does not replace professional medical diagnosis or treatment.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] border border-[#E5DFD5] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3.5 shadow-sm my-4">
      <div className="w-10 h-10 rounded-full bg-[#EFECE6] flex items-center justify-center shrink-0 text-[#4A5D4E]">
        <ShieldAlert className="w-5 h-5" />
      </div>
      <div className="flex-1 text-sm text-[#444444] leading-relaxed">
        <strong className="text-[#1F1F1F] font-semibold block mb-0.5">Medical & Safety Notice</strong>
        DermAI provides AI-assisted informational guidance based on dermatological research and symptom patterns. It is not a medical diagnosis. Consult a qualified dermatologist for clinical evaluation and prescription treatments.
      </div>
    </div>
  );
};
