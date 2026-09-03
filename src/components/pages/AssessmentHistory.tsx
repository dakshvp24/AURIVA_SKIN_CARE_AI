import React, { useState, useEffect } from 'react';
import { History, Calendar, ArrowRight, Trash2, Stethoscope } from 'lucide-react';
import { AssessmentResult } from '../../types';
import { assessmentService } from '../../services/assessmentService';

interface AssessmentHistoryProps {
  userId?: string;
  onSelectResult: (result: AssessmentResult) => void;
  onStartNew: () => void;
}

export const AssessmentHistory: React.FC<AssessmentHistoryProps> = ({
  userId,
  onSelectResult,
  onStartNew
}) => {
  const [history, setHistory] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await assessmentService.getUserAssessmentHistory(userId);
      setHistory(list);
      setLoading(false);
    }
    load();
  }, [userId]);

  const handleClear = async () => {
    if (confirm('Are you sure you want to clear your assessment history?')) {
      await assessmentService.clearAssessmentHistory(userId);
      setHistory([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-[#FAFAF7] border border-[#E5DFD5] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#4A5D4E]">Diagnostic Records</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1F1F]">Assessment History</h1>
          <p className="text-xs text-[#666666] font-light mt-1">Review your past skin assessments and diagnostic evolutions over time.</p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-red-600 hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="text-center py-16 space-y-4 bg-white border border-[#E5DFD5] rounded-3xl">
          <History className="w-12 h-12 text-[#D8D0C5] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#1F1F1F]">No Assessments Saved Yet</h3>
          <p className="text-xs text-[#666666]">Complete your first guided skin assessment to track diagnostic results over time.</p>
          <button onClick={onStartNew} className="derm-pill-btn text-xs px-6 py-2.5">
            Start Skin Assessment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectResult(item)}
              className="derm-card p-5 bg-white border border-[#E5DFD5] hover:border-[#4A5D4E] cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#4A5D4E]" />
                  <span className="text-xs text-[#666666] font-medium">
                    {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1F1F1F]">
                  {item.possibleConcern}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[#666666]">
                  <span>Skin Type: {item.request.skinType}</span>
                  <span>•</span>
                  <span>Symptoms: {item.request.symptoms.join(', ')}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-3 py-1 bg-[#4A5D4E] text-white rounded-full">
                  {item.confidenceScore}% Confidence
                </span>
                <span className="text-xs font-semibold px-3 py-1 bg-[#EFECE6] text-[#1F1F1F] rounded-full border border-[#E5DFD5]">
                  {item.riskLevel} Risk
                </span>
                <ArrowRight className="w-4 h-4 text-[#4A5D4E]" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
