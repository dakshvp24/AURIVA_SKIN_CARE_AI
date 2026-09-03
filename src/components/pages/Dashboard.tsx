import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Stethoscope, ShoppingBag, User, MessageSquare, History, 
  CheckCircle2, Plus, ArrowRight, BookOpen, ThumbsUp, X, Check, Compass, 
  Database, RefreshCw, Sun, Moon, Flame, CircleDot, Circle, Minus, Flame as FlameIcon
} from 'lucide-react';
import { UserProfile, SkinProfile, AssessmentResult } from '../../types';
import { 
  getDailyLog, toggleRoutineStep, saveDailyNote, calculateUserMetrics, 
  getTodayDateStr, DailyRoutineLog, UserMetrics, RoutineStep 
} from '../../services/routineTrackerService';

interface DashboardProps {
  user: UserProfile | null;
  skinProfile: SkinProfile | null;
  latestAssessment: AssessmentResult | null;
  onNavigate: (tab: string) => void;
  onStartAssessment: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  skinProfile,
  latestAssessment,
  onNavigate,
  onStartAssessment
}) => {
  const userId = user?.id || 'guest';
  const todayStr = getTodayDateStr();

  const [dailyLog, setDailyLog] = useState<DailyRoutineLog>(() => 
    getDailyLog(userId, todayStr, skinProfile, latestAssessment)
  );

  const [metrics, setMetrics] = useState<UserMetrics>(() => 
    calculateUserMetrics(userId, skinProfile, latestAssessment)
  );

  const [diaryModalOpen, setDiaryModalOpen] = useState(false);
  const [showRetakeModal, setShowRetakeModal] = useState(false);
  const [diaryNote, setDiaryNote] = useState('');
  const [selectedProductLog, setSelectedProductLog] = useState('Auriva Radiance Vitamin C Serum');

  const [communityPosts, setCommunityPosts] = useState([
    { id: 1, author: 'Sarah Color', text: 'The Vitamin C serum really helped clear my morning dullness!', likes: 14, liked: false },
    { id: 2, author: 'Daress Anotherson', text: 'Centella cleanser reduced my active redness within 3 days! 👍', likes: 22, liked: true }
  ]);

  // Sync state whenever user or profile changes
  useEffect(() => {
    const updatedLog = getDailyLog(userId, todayStr, skinProfile, latestAssessment);
    const updatedMetrics = calculateUserMetrics(userId, skinProfile, latestAssessment);
    setDailyLog(updatedLog);
    setMetrics(updatedMetrics);
  }, [userId, skinProfile, latestAssessment]);

  // Handle checking off a routine step
  const handleToggleStep = (stepId: string) => {
    const updatedLog = toggleRoutineStep(userId, todayStr, stepId, skinProfile, latestAssessment);
    const updatedMetrics = calculateUserMetrics(userId, skinProfile, latestAssessment);
    setDailyLog(updatedLog);
    setMetrics(updatedMetrics);
  };

  const toggleLike = (id: number) => {
    setCommunityPosts(posts => posts.map(p => p.id === id ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked } : p));
  };

  const handleSaveDiary = () => {
    saveDailyNote(userId, todayStr, diaryNote, selectedProductLog);
    const updatedLog = getDailyLog(userId, todayStr, skinProfile, latestAssessment);
    const updatedMetrics = calculateUserMetrics(userId, skinProfile, latestAssessment);
    setDailyLog(updatedLog);
    setMetrics(updatedMetrics);
    setDiaryModalOpen(false);
    setDiaryNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* WELCOME BANNER WITH HIGH CONTRAST TYPOGRAPHY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D4A3E]">Auriva Command Center</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#111827] mt-1">
            Welcome back, {user?.name || 'Skincare Enthusiast'}!
          </h1>
          <p className="text-sm text-[#4B5563] font-medium mt-1">
            Track your daily routine journey, assess active concerns, and review clinical AI insights.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setDiaryModalOpen(true)}
            className="derm-pill-secondary text-xs px-4 py-2.5 flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-[#2D4A3E]" />
            <span>Log Today's Routine</span>
          </button>

          {latestAssessment ? (
            <button
              onClick={() => onNavigate('results')}
              className="derm-pill-btn text-xs px-5 py-2.5 shadow-sm whitespace-nowrap"
            >
              <Stethoscope className="w-4 h-4" />
              <span>View Assessment</span>
            </button>
          ) : (
            <button
              onClick={onStartAssessment}
              className="derm-pill-btn text-xs px-5 py-2.5 shadow-sm whitespace-nowrap"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Start Assessment</span>
            </button>
          )}
        </div>
      </div>

      {/* QUICK ACTION TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        <button
          onClick={() => {
            if (latestAssessment) {
              onNavigate('results');
            } else {
              onStartAssessment();
            }
          }}
          className="bg-white border border-[#E5E7EB] hover:border-[#2D4A3E] p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all shadow-xs hover:shadow-sm group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F3F4F1] text-[#2D4A3E] flex items-center justify-center mb-2 group-hover:bg-[#2D4A3E] group-hover:text-white transition-colors">
            <Stethoscope className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-[#111827]">
            {latestAssessment ? 'View Results' : 'Start Assessment'}
          </span>
        </button>

        <button
          onClick={() => onNavigate('history')}
          className="bg-white border border-[#E5E7EB] hover:border-[#2D4A3E] p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all shadow-xs hover:shadow-sm group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F3F4F1] text-[#2D4A3E] flex items-center justify-center mb-2 group-hover:bg-[#2D4A3E] group-hover:text-white transition-colors">
            <History className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-[#111827]">View History</span>
        </button>

        <button
          onClick={() => onNavigate('guidance')}
          className="bg-white border border-[#E5E7EB] hover:border-[#2D4A3E] p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all shadow-xs hover:shadow-sm group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F3F4F1] text-[#2D4A3E] flex items-center justify-center mb-2 group-hover:bg-[#2D4A3E] group-hover:text-white transition-colors">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-[#111827]">Recommendations</span>
        </button>

        <button
          onClick={() => onNavigate('doctors')}
          className="bg-white border border-[#E5E7EB] hover:border-[#2D4A3E] p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all shadow-xs hover:shadow-sm group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F3F4F1] text-[#2D4A3E] flex items-center justify-center mb-2 group-hover:bg-[#2D4A3E] group-hover:text-white transition-colors">
            <User className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-[#111827]">Dermatologists</span>
        </button>

        <button
          onClick={() => onNavigate('products')}
          className="bg-white border border-[#E5E7EB] hover:border-[#2D4A3E] p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all shadow-xs hover:shadow-sm group col-span-2 sm:col-span-1"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F3F4F1] text-[#2D4A3E] flex items-center justify-center mb-2 group-hover:bg-[#2D4A3E] group-hover:text-white transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-[#111827]">Product Catalog</span>
        </button>

      </div>

      {/* DASHBOARD MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Dynamic Routine Journey & Weekly Skin Consistency */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* DYNAMIC ROUTINE JOURNEY CARD */}
          <div className="derm-card p-6 bg-white space-y-6 border border-[#E5E7EB]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#2D4A3E]">Dynamic Regimen Tracker</span>
                <h3 className="font-serif text-2xl font-bold text-[#111827]">Your Routine Journey</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 bg-[#2D4A3E] text-white text-xs font-bold rounded-full shadow-2xs">
                  {metrics.todayCompletedCount}/{metrics.todayTotalCount} Steps Completed
                </span>
                <span className="px-3 py-1 bg-[#F3F4F1] text-[#111827] border border-[#E5E7EB] text-xs font-bold rounded-full">
                  {metrics.todayProgressPercent}% Today
                </span>
              </div>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#111827]">
                <span>Today's Completion Progress</span>
                <span className="text-[#2D4A3E] font-bold">{metrics.todayProgressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-[#F3F4F1] border border-[#E5E7EB] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2D4A3E] transition-all duration-500 rounded-full"
                  style={{ width: `${metrics.todayProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Morning & Evening Step Checklists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              {/* Morning Checklist */}
              <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-3">
                <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2 text-[#2D4A3E]">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <strong className="text-xs font-bold uppercase tracking-wider text-[#111827]">☀️ Morning Routine</strong>
                </div>

                <div className="space-y-2">
                  {dailyLog.morningSteps.map((step) => (
                    <label 
                      key={step.id}
                      onClick={() => handleToggleStep(step.id)}
                      className={`flex items-start gap-2.5 p-2 rounded-xl border transition-all cursor-pointer select-none text-xs ${
                        step.completed
                          ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 font-semibold'
                          : 'bg-white border-[#E5E7EB] text-[#374151] hover:border-[#2D4A3E]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={step.completed}
                        onChange={() => {}} // Handled by parent label click
                        className="mt-0.5 rounded text-[#2D4A3E] focus:ring-[#2D4A3E] accent-[#2D4A3E]"
                      />
                      <span className="line-clamp-2">{step.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Evening Checklist */}
              <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-3">
                <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2 text-[#2D4A3E]">
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <strong className="text-xs font-bold uppercase tracking-wider text-[#111827]">🌙 Evening Routine</strong>
                </div>

                <div className="space-y-2">
                  {dailyLog.eveningSteps.map((step) => (
                    <label 
                      key={step.id}
                      onClick={() => handleToggleStep(step.id)}
                      className={`flex items-start gap-2.5 p-2 rounded-xl border transition-all cursor-pointer select-none text-xs ${
                        step.completed
                          ? 'bg-indigo-50/60 border-indigo-300 text-indigo-950 font-semibold'
                          : 'bg-white border-[#E5E7EB] text-[#374151] hover:border-[#2D4A3E]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={step.completed}
                        onChange={() => {}} // Handled by parent label click
                        className="mt-0.5 rounded text-[#2D4A3E] focus:ring-[#2D4A3E] accent-[#2D4A3E]"
                      />
                      <span className="line-clamp-2">{step.name}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* DYNAMIC WEEKLY SKIN CONSISTENCY CARD */}
          <div className="derm-card p-6 bg-white space-y-6 border border-[#E5E7EB]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#2D4A3E]">Calculated Activity Analytics</span>
                <h3 className="font-serif text-2xl font-bold text-[#111827]">Weekly Skin Consistency</h3>
              </div>

              <div className="flex items-center gap-2">
                {metrics.streakDays > 0 && (
                  <span className="px-3.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold rounded-full flex items-center gap-1">
                    <FlameIcon className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    <span>{metrics.streakDays} Day Streak</span>
                  </span>
                )}
                
                <span className="px-3.5 py-1 bg-[#2D4A3E] text-white text-xs font-bold rounded-full">
                  {metrics.hasAnyActivity ? `${metrics.weeklyConsistencyPercent}% Consistency` : 'Start Tracking'}
                </span>
              </div>
            </div>

            {/* Dynamic 7-Day Sun-Sat Activity Grid */}
            <div className="grid grid-cols-7 gap-2 text-center">
              {metrics.weeklyDays.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-2">
                  <span className={`text-xs font-bold ${day.isToday ? 'text-[#2D4A3E]' : 'text-[#374151]'}`}>
                    {day.dayLabel}
                  </span>

                  <div className={`w-full aspect-[3/4] rounded-2xl p-2 flex flex-col items-center justify-center transition-all ${
                    day.status === 'completed'
                      ? 'bg-emerald-50 border-2 border-emerald-600 text-emerald-800 shadow-2xs'
                      : day.status === 'partial'
                      ? 'bg-blue-50 border-2 border-blue-400 text-blue-800'
                      : day.isFuture
                      ? 'bg-[#FAFAF8] border border-[#E5E7EB] opacity-60'
                      : 'bg-[#FAFAF8] border border-[#E5E7EB]'
                  }`}>
                    {day.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : day.status === 'partial' ? (
                      <CircleDot className="w-5 h-5 text-blue-600" />
                    ) : day.isFuture ? (
                      <Minus className="w-4 h-4 text-[#9CA3AF]" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#D1D5DB]" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Activity-Based Motivational Guidance Box */}
            <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D4A3E] block">Clinical Regimen Insight</span>
              <p className="text-xs font-medium text-[#111827]">
                "{metrics.motivationalMessage}"
              </p>
            </div>
          </div>

          {/* Community Spotlights */}
          <div className="derm-card p-6 bg-white space-y-4 border border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#111827]">Auriva Skincare Community</h3>
              <button 
                onClick={() => onNavigate('products')}
                className="text-xs text-[#2D4A3E] font-semibold hover:underline"
              >
                Explore Products &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {communityPosts.map(post => (
                <div key={post.id} className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#2D4A3E] text-white font-semibold flex items-center justify-center text-xs shrink-0 shadow-xs">
                    {post.author.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#111827]">{post.author}</span>
                      <button 
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full transition-all ${
                          post.liked ? 'bg-[#2D4A3E] text-white' : 'bg-[#F3F4F1] text-[#374151]'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{post.likes}</span>
                      </button>
                    </div>
                    <p className="text-xs text-[#374151] font-normal leading-relaxed">{post.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Profile Summary & Latest Assessment */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Skin Profile Summary */}
          <div className="derm-card p-6 bg-white space-y-4 border border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#111827]">Your Skin Profile</h3>
              <button
                onClick={() => onNavigate('skin-profile')}
                className="text-xs text-[#2D4A3E] font-semibold hover:underline"
              >
                Edit Profile
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB]">
                <span className="text-xs text-[#4B5563] font-medium">Skin Type</span>
                <span className="text-xs font-semibold text-[#111827] px-3 py-1 bg-[#F3F4F1] rounded-full">
                  {skinProfile?.skinType || 'Combination'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB]">
                <span className="text-xs text-[#4B5563] font-medium">Sensitivity Level</span>
                <span className="text-xs font-semibold text-[#111827] px-3 py-1 bg-[#F3F4F1] rounded-full">
                  {skinProfile?.sensitivity || 'Moderate'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] space-y-2">
                <span className="text-xs text-[#4B5563] font-medium block">Primary Concerns</span>
                <div className="flex flex-wrap gap-1.5">
                  {(skinProfile?.mainConcerns && skinProfile.mainConcerns.length > 0
                    ? skinProfile.mainConcerns
                    : ['Fine Lines', 'Dullness', 'Acne']
                  ).map((concern, idx) => (
                    <span key={idx} className="text-xs bg-[#2D4A3E] text-white px-3 py-1 rounded-full font-medium">
                      {concern}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Latest Assessment Summary */}
          <div className="derm-card p-6 bg-white space-y-4 border border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#111827]">Your Latest Skin Assessment</h3>
              <span className="text-xs font-medium text-[#6B7280]">
                {latestAssessment?.createdAt ? new Date(latestAssessment.createdAt).toLocaleDateString() : 'Active'}
              </span>
            </div>

            {latestAssessment ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB] space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-[#4B5563] font-semibold block">Identified Concern</span>
                  <span className="font-serif text-xl font-bold text-[#111827] block">
                    {latestAssessment.possibleConcern}
                  </span>
                  
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-xs px-3 py-0.5 rounded-full bg-[#2D4A3E] text-white font-medium">
                      {latestAssessment.confidenceScore}% Match
                    </span>
                    <span className="text-xs px-3 py-0.5 rounded-full bg-[#E5E7EB] text-[#111827] font-semibold">
                      {latestAssessment.riskLevel} Risk
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('results')}
                    className="flex-1 py-2.5 rounded-full bg-[#2D4A3E] text-white text-xs font-semibold hover:bg-[#233B31] transition-all flex items-center justify-center gap-1"
                  >
                    <span>View Full Results</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setShowRetakeModal(true)}
                    className="px-4 py-2.5 rounded-full bg-[#F3F4F1] border border-[#E5E7EB] text-xs font-semibold text-[#111827] hover:bg-[#E5E7EB] transition-colors flex items-center gap-1 shrink-0"
                    title="Retake Assessment"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#2D4A3E]" />
                    <span>Retake</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl p-4">
                <Stethoscope className="w-8 h-8 text-[#9CA3AF] mx-auto" />
                <span className="text-xs font-bold text-[#111827] block">No Completed Assessment Yet</span>
                <p className="text-xs text-[#4B5563]">Take our clinical questionnaire to unlock personalized product recommendations & routine.</p>
                <button
                  onClick={onStartAssessment}
                  className="w-full py-2.5 rounded-full bg-[#2D4A3E] text-white text-xs font-semibold hover:bg-[#233B31] transition-all"
                >
                  Start Skin Assessment
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* DIARY LOGGING MODAL */}
      {diaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
            
            <button
              onClick={() => setDiaryModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#6B7280] hover:bg-[#F3F4F1] transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2D4A3E]">Skin Routine Log</span>
              <h3 className="font-serif text-2xl font-bold text-[#111827]">Log Today's Skincare</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#111827] mb-1">Select Product Used Today</label>
                <select
                  value={selectedProductLog}
                  onChange={(e) => setSelectedProductLog(e.target.value)}
                  className="w-full p-2.5 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs font-medium text-[#111827]"
                >
                  <option value="Auriva Radiance Vitamin C Serum">Auriva Radiance Vitamin C Serum</option>
                  <option value="Centella Soothing Cleanser">Centella Soothing Cleanser</option>
                  <option value="Barrier Repair Hydrating Cream">Barrier Repair Hydrating Cream</option>
                  <option value="Auriva Matte Defense SPF 50">Auriva Matte Defense SPF 50</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#111827] mb-1">Daily Skin Note (Optional)</label>
                <textarea
                  rows={3}
                  value={diaryNote}
                  onChange={(e) => setDiaryNote(e.target.value)}
                  placeholder="How does your skin feel today? (e.g. hydrated, mild tightness, reduced redness...)"
                  className="w-full p-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#2D4A3E]"
                />
              </div>
            </div>

            <button
              onClick={handleSaveDiary}
              className="w-full py-3 rounded-full bg-[#2D4A3E] text-white text-xs font-semibold hover:bg-[#233B31] transition-all shadow-sm"
            >
              Save Routine Entry
            </button>

          </div>
        </div>
      )}

      {/* RETAKE CONFIRMATION DIALOG MODAL */}
      {showRetakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
            <button
              onClick={() => setShowRetakeModal(false)}
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
                onClick={() => setShowRetakeModal(false)}
                className="derm-pill-secondary text-xs px-5 py-2.5 flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRetakeModal(false);
                  onStartAssessment();
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
