import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageSquare, X, Send, User, RefreshCw, Database } from 'lucide-react';
import { ChatMessage, AssessmentResult } from '../../types';
import { loadProductsData, loadSymptomsData, loadDoctorsData } from '../../services/dataLoader';

interface FloatingChatbotProps {
  latestAssessment: AssessmentResult | null;
}

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ latestAssessment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: "Hello! I am your Auriva Clinical AI Assistant. I retrieve clinical answers directly from our verified databases (1,200 Products, 550 Symptoms, and 1,165 Dermatologists). How can I assist your skincare journey today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedQuestions = [
    "What product is suitable for oily skin?",
    "What side effects does Benzoyl Peroxide have?",
    "Find dermatologists in Mumbai",
    "What does my assessment mean?"
  ];

  // Auto-scroll chat history to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Keyboard Escape listener to close chat window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

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

    if (q.includes('product') || q.includes('oily') || q.includes('dry') || q.includes('serum') || q.includes('cleanser')) {
      const matches = products.filter(p => 
        p.product_name.toLowerCase().includes(q) ||
        p.skin_type.toLowerCase().includes(q) ||
        p.key_ingredients.toLowerCase().includes(q) ||
        p.product_category.toLowerCase().includes(q)
      );

      if (matches.length > 0) {
        const top = matches[0];
        replyText = `Based on Auriva's Product Dataset (1,200 records), I found **"${top.product_name}"** by ${top.brand_name}. Key Actives: ${top.key_ingredients}. Price: ₹${top.price_inr || 'Unavailable'}. Category: ${top.product_category}.`;
      } else {
        replyText = "I couldn't find a matching product in our 1,200 product database for that query.";
      }
    } else if (q.includes('doctor') || q.includes('mumbai') || q.includes('delhi') || q.includes('bengaluru') || q.includes('ahmedabad')) {
      const matches = doctors.filter(d => 
        d.city.toLowerCase().includes(q) ||
        d.doctor_name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q)
      );

      if (matches.length > 0) {
        const doc = matches[0];
        replyText = `Found in Auriva Dermatologist Directory: **${doc.doctor_name}** (${doc.qualification}), ${doc.hospital_or_clinic} in ${doc.city}. Fee: ₹${doc.consultation_fee_inr}. Specialization: ${doc.specialization}.`;
      } else {
        replyText = "No matching dermatologist found in the available dataset for your city query.";
      }
    } else if (q.includes('side effect') || q.includes('benzoyl') || q.includes('symptom') || q.includes('active') || q.includes('salicylic')) {
      const matches = symptoms.filter(s => 
        s.active_ingredient.toLowerCase().includes(q) ||
        s.skin_condition.toLowerCase().includes(q) ||
        s.common_symptoms.toLowerCase().includes(q)
      );

      if (matches.length > 0) {
        const s = matches[0];
        replyText = `According to Auriva Symptoms Dataset: **${s.active_ingredient}** is used for ${s.skin_condition}. Side Effects: ${s.common_side_effects}. Allergy Warning: ${s.allergy_warning}.`;
      } else {
        replyText = "I couldn't find treatment information for that active ingredient in our Symptoms Dataset.";
      }
    } else if (q.includes('assessment')) {
      if (latestAssessment) {
        replyText = `Your latest Auriva assessment correlated reported symptoms with **${latestAssessment.possibleConcern}** (${latestAssessment.confidenceScore}% Confidence). Suggested actives: ${latestAssessment.suggestedIngredients.join(', ')}.`;
      } else {
        replyText = "You haven't completed a skin assessment yet. Use the Skin Assessment page to evaluate your symptoms.";
      }
    } else {
      replyText = "Auriva operates on a dataset-driven platform. Ask me about products in our 1,200 database, dermatologist availability across 25 cities, or ingredient side effects!";
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
    <>
      {/* FLOATING OVERLAY CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[560px] h-[520px] bg-white border border-[#E5E7EB] rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between animate-fade-in">
          
          {/* Header */}
          <div className="bg-[#2D4A3E] text-white p-4 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold tracking-wide">Auriva AI Assistant</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Clinical Dataset Engine</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([messages[0]])}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Clear Chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages & Suggested Prompts Area */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-[#FAFAF8]">
            
            {/* Suggested Prompts Pill Bar */}
            {messages.length <= 2 && (
              <div className="space-y-1.5 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block">Dataset Prompts</span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="text-[11px] bg-white border border-[#E5E7EB] hover:border-[#2D4A3E] text-[#111827] px-2.5 py-1 rounded-full transition-all shadow-2xs font-medium text-left line-clamp-1"
                    >
                      "{q}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-semibold ${
                  msg.sender === 'user' ? 'bg-[#111827] text-white' : 'bg-[#2D4A3E] text-white'
                }`}>
                  {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-300" />}
                </div>

                <div className={`max-w-[82%] rounded-2xl p-3 text-xs space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-[#2D4A3E] text-white rounded-tr-none font-medium'
                    : 'bg-white border border-[#E5E7EB] text-[#111827] rounded-tl-none font-normal leading-relaxed shadow-2xs'
                }`}>
                  <p>{msg.text}</p>
                  <span className={`text-[9px] block text-right pt-0.5 ${msg.sender === 'user' ? 'text-white/70' : 'text-[#6B7280]'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#4B5563] italic py-1">
                <div className="w-2 h-2 rounded-full bg-[#2D4A3E] animate-ping" />
                <span>Querying Auriva dataset records...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Composer */}
          <div className="p-3 bg-white border-t border-[#E5E7EB] shrink-0">
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
                placeholder="Ask about products, ingredients, or doctors..."
                className="flex-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E5E7EB] rounded-full text-xs text-[#111827] focus:outline-none focus:border-[#2D4A3E]"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-full bg-[#2D4A3E] text-white flex items-center justify-center hover:bg-[#233B31] transition-all disabled:opacity-50 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      )}

      {/* FLOATING CHATBOT ICON BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Auriva AI Assistant"
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-[#2D4A3E] text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-2 border-white group"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <Sparkles className="w-6 h-6 text-emerald-300 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#2D4A3E] animate-pulse" />
          </div>
        )}
      </button>
    </>
  );
};
