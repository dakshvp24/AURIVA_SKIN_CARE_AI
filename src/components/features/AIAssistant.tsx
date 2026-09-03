import React, { useState } from 'react';
import { Send, Sparkles, User, RefreshCw, Database } from 'lucide-react';
import { ChatMessage, AssessmentResult } from '../../types';
import { MedicalDisclaimerBanner } from '../layout/MedicalDisclaimerBanner';
import { loadProductsData, loadSymptomsData, loadDoctorsData } from '../../services/dataLoader';

interface AIAssistantProps {
  latestAssessment: AssessmentResult | null;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ latestAssessment }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: "Hello! I am your Auriva Clinical AI Assistant. I retrieve clinical answers directly from our verified databases (1,200 Products, 550 Symptoms & Treatments, and 1,165 Dermatologists). How can I assist your skincare journey today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "What product is suitable for my oily skin?",
    "What does my assessment mean?",
    "Find dermatologists in Mumbai",
    "What side effects does Benzoyl Peroxide have?"
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    const q = query.toLowerCase();

    const [products, symptoms, doctors] = await Promise.all([
      loadProductsData(),
      loadSymptomsData(),
      loadDoctorsData()
    ]);

    let replyText = "";

    if (q.includes('product') || q.includes('oily') || q.includes('dry') || q.includes('serum')) {
      const matches = products.filter(p => 
        p.product_name.toLowerCase().includes(q) ||
        p.skin_type.toLowerCase().includes(q) ||
        p.key_ingredients.toLowerCase().includes(q)
      );

      if (matches.length > 0) {
        const top = matches[0];
        replyText = `Based on Auriva's Product Dataset (1,200 records), I found **"${top.product_name}"** by ${top.brand_name}. Key Actives: ${top.key_ingredients}. Price: ₹${top.price_inr}. Category: ${top.product_category}.`;
      } else {
        replyText = "I couldn't find a matching product in our database for that query.";
      }
    } else if (q.includes('doctor') || q.includes('mumbai') || q.includes('delhi') || q.includes('bengaluru')) {
      const matches = doctors.filter(d => 
        d.city.toLowerCase().includes(q) ||
        d.doctor_name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q)
      );

      if (matches.length > 0) {
        const doc = matches[0];
        replyText = `Found in Auriva Dermatologist Directory: **${doc.doctor_name}** (${doc.qualification}), ${doc.hospital_or_clinic} in ${doc.city}. Fee: ₹${doc.consultation_fee_inr}. Specialization: ${doc.specialization}.`;
      } else {
        replyText = "No matching dermatologist found in the available database for your city query.";
      }
    } else if (q.includes('side effect') || q.includes('benzoyl') || q.includes('symptom') || q.includes('active')) {
      const matches = symptoms.filter(s => 
        s.active_ingredient.toLowerCase().includes(q) ||
        s.skin_condition.toLowerCase().includes(q) ||
        s.common_symptoms.toLowerCase().includes(q)
      );

      if (matches.length > 0) {
        const s = matches[0];
        replyText = `According to Auriva Symptoms Dataset: **${s.active_ingredient}** is used for ${s.skin_condition}. Side Effects: ${s.common_side_effects}. Allergy Warning: ${s.allergy_warning}.`;
      } else {
        replyText = "I couldn't find treatment information for that ingredient in our Symptoms Dataset.";
      }
    } else if (q.includes('assessment')) {
      if (latestAssessment) {
        replyText = `Your latest Auriva assessment correlated reported symptoms with **${latestAssessment.possibleConcern}** (${latestAssessment.confidenceScore}% Confidence). Recommended active ingredients: ${latestAssessment.suggestedIngredients.join(', ')}.`;
      } else {
        replyText = "You haven't completed a skin assessment yet. Use the Skin Assessment page to evaluate your symptoms.";
      }
    } else {
      replyText = "Auriva operates on a dataset-driven platform. Ask me about products in our 1,200 database, dermatologist availability across 25 cities, or ingredient contraindications!";
    }

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, assistantMsg]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#2D4A3E] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Database className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D4A3E]">Auriva AI Assistant</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111827]">Clinical AI Intelligence</h1>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="derm-pill-secondary text-xs px-4 py-2 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Questions */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">Dataset Search Prompts</span>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs bg-white border border-[#E5E7EB] hover:border-[#2D4A3E] text-[#111827] px-3.5 py-2 rounded-full transition-all shadow-xs font-medium"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="derm-card p-4 sm:p-6 bg-white border border-[#E5E7EB] space-y-4 min-h-[400px] flex flex-col justify-between">
        
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                msg.sender === 'user' ? 'bg-[#111827] text-white' : 'bg-[#2D4A3E] text-white'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-emerald-300" />}
              </div>

              <div className={`max-w-[80%] rounded-2xl p-4 space-y-1 text-xs sm:text-sm ${
                msg.sender === 'user'
                  ? 'bg-[#2D4A3E] text-white rounded-tr-none font-medium'
                  : 'bg-[#FAFAF8] border border-[#E5E7EB] text-[#111827] rounded-tl-none font-normal leading-relaxed'
              }`}>
                <p>{msg.text}</p>
                <span className={`text-[10px] block text-right pt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-[#6B7280]'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#4B5563] italic">
              <div className="w-2 h-2 rounded-full bg-[#2D4A3E] animate-ping" />
              <span>Querying Auriva dataset records...</span>
            </div>
          )}
        </div>

        {/* Input Composer */}
        <div className="pt-4 border-t border-[#E5E7EB]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Auriva about products, side effects, active ingredients, or doctors..."
              className="flex-1 px-4 py-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-full text-xs sm:text-sm text-[#111827] focus:outline-none focus:border-[#2D4A3E]"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-full bg-[#2D4A3E] text-white flex items-center justify-center hover:bg-[#233B31] transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      <MedicalDisclaimerBanner compact />

    </div>
  );
};
