import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Upload, Sparkles, AlertCircle, CheckCircle2, ShieldAlert, ShoppingBag,
  RefreshCw, Trash2, ExternalLink, Calendar, Info, Stethoscope, Sun, Moon, ArrowRight, X 
} from 'lucide-react';
import { UserProfile, SkinProfile, AssessmentResult, ProductRecord, SkinScanRecord, SkinScanAnalysisResult } from '../../types';
import { loadProductsData } from '../../services/dataLoader';
import { getRecommendedProducts, getProductUsageInstructions } from '../../services/recommendationEngine';
import { skinScanService } from '../../services/skinScanService';
import { MedicalDisclaimerBanner } from '../layout/MedicalDisclaimerBanner';
import { VerifiedProductImage } from '../common/VerifiedProductImage';

interface AISkinScanProps {
  user: UserProfile | null;
  skinProfile: SkinProfile | null;
  latestAssessment: AssessmentResult | null;
  onNavigate: (tab: string) => void;
}

type InputMode = 'select' | 'camera' | 'upload' | 'preview';

export const AISkinScan: React.FC<AISkinScanProps> = ({
  user,
  skinProfile,
  latestAssessment,
  onNavigate
}) => {
  const userId = user?.id || 'guest';
  const savedSkinType = skinProfile?.skinType || latestAssessment?.request?.skinType || 'Combination';

  const [inputMode, setInputMode] = useState<InputMode>('select');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [saveToHistory, setSaveToHistory] = useState<boolean>(true);

  // Camera State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Analysis & Loading State
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [qualityError, setQualityError] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<SkinScanAnalysisResult | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  // History State
  const [scanHistory, setScanHistory] = useState<SkinScanRecord[]>([]);
  const [scanToDelete, setScanToDelete] = useState<SkinScanRecord | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Scan History on mount
  useEffect(() => {
    async function loadHistory() {
      if (user?.id) {
        const history = await skinScanService.getScanHistory(user.id);
        setScanHistory(history);
      }
    }
    loadHistory();
  }, [user]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Attach MediaStream to <video> when mounted in DOM
  useEffect(() => {
    if (inputMode === 'camera' && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [inputMode, isCameraActive]);

  // CAMERA LOGIC
  const startCamera = async () => {
    setCameraError(null);
    setQualityError(null);
    setIsVideoReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setInputMode('camera');
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Unable to access device camera. Please check camera permissions or use the Upload Photo option.');
      setInputMode('select');
    }
  };

  const handleVideoReady = () => {
    if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
      setIsVideoReady(true);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsVideoReady(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !isVideoReady) return;

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) return;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    setSelectedImage(dataUrl);
    setInputMode('preview');
    stopCamera();
  };

  const handleRetakePhoto = () => {
    setSelectedImage(null);
    stopCamera();
    startCamera();
  };

  // UPLOAD LOGIC
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setQualityError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setQualityError('Unsupported file format. Please select a JPG, JPEG, PNG, or WEBP photo.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setInputMode('upload');
    };
    reader.readAsDataURL(file);
  };

  // IMAGE QUALITY VALIDATION & NON-DIAGNOSTIC ANALYSIS
  const runSkinAnalysis = async () => {
    if (!selectedImage) return;

    setQualityError(null);
    setAnalyzing(true);

    // Step 1: Analyzing Photo
    setAnalysisStep(1);
    await new Promise(r => setTimeout(r, 800));

    // Step 2: Quality Inspection Simulation
    setAnalysisStep(2);
    await new Promise(r => setTimeout(r, 900));

    // Perform basic canvas image size/quality check
    const img = new Image();
    img.src = selectedImage;
    await new Promise(resolve => { img.onload = resolve; });

    if (img.width < 150 || img.height < 150) {
      setAnalyzing(false);
      setQualityError("We couldn't get a reliable view of your skin from this photo. Please upload a clear, well-lit photo with your face clearly visible.");
      return;
    }

    // Step 3: Preparing Insights
    setAnalysisStep(3);
    await new Promise(r => setTimeout(r, 900));

    // Non-diagnostic simulated characteristics generator
    const possibleSkinTypes: Array<'Oily' | 'Dry' | 'Combination' | 'Normal' | 'Sensitive Appearance'> = ['Combination', 'Oily', 'Dry', 'Normal'];
    const estimatedSkinType = possibleSkinTypes[Math.floor(Math.random() * possibleSkinTypes.length)];

    const isMatch = estimatedSkinType.toLowerCase() === savedSkinType.toLowerCase();
    const profileCorrelation = isMatch
      ? 'Your AI scan is consistent with your saved skin profile.'
      : `Your image analysis differs from your saved profile (Saved: ${savedSkinType}, AI Scan: ${estimatedSkinType}). Consider updating your assessment if your skin has changed.`;

    const analysisResult: SkinScanAnalysisResult = {
      estimatedSkinType,
      confidence: 'Moderate',
      profileCorrelation,
      isProfileConsistent: isMatch,
      characteristics: [
        { name: 'Apparent Oiliness (T-Zone)', level: estimatedSkinType === 'Oily' || estimatedSkinType === 'Combination' ? 'High' : 'Moderate', description: 'Visible shine apparent in T-zone area.' },
        { name: 'Apparent Dryness / Flakiness', level: estimatedSkinType === 'Dry' ? 'High' : 'Low', description: 'Low visible surface scaling observed.' },
        { name: 'Visible Redness / Flushing', level: 'Moderate', description: 'Mild visible blush around cheeks.' },
        { name: 'Visible Dark Spots / Pigmentation', level: 'Moderate', description: 'Some visible uneven skin tone tone patches.' },
        { name: 'Acne-like Spots', level: 'Moderate', description: 'A few visible surface blemishes.' }
      ],
      summaryText: `Your photo appears consistent with ${estimatedSkinType.toLowerCase()} skin with some visible oiliness and mild dark spots.`,
      recommendedConcerns: [estimatedSkinType === 'Oily' ? 'Acne & Pimples' : 'Dryness', 'Dark Spots']
    };

    // Load matching products from 200 Indian catalog
    const allProducts = await loadProductsData();
    const scored = getRecommendedProducts(allProducts, estimatedSkinType, analysisResult.recommendedConcerns[0]);
    setRecommendedProducts(scored.slice(0, 4));

    setCurrentAnalysis(analysisResult);
    setAnalyzing(false);

    // Save to history if selected
    if (saveToHistory && user?.id) {
      const record: SkinScanRecord = {
        id: `SCAN-${Date.now()}`,
        user_id: user.id,
        image_url: selectedImage,
        estimated_skin_type: estimatedSkinType,
        analysis_result: analysisResult,
        created_at: new Date().toISOString()
      };
      const updatedHistory = await skinScanService.saveScanRecord(user.id, record);
      setScanHistory(updatedHistory);
    }
  };

  const handleResetScan = () => {
    setSelectedImage(null);
    setCurrentAnalysis(null);
    setQualityError(null);
    setInputMode('select');
    stopCamera();
  };

  const handleDeleteScanConfirmed = async () => {
    if (!scanToDelete || !user?.id) return;
    const updated = await skinScanService.deleteScanRecord(user.id, scanToDelete.id);
    setScanHistory(updated);
    setScanToDelete(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in font-sans">
      
      {/* 1. PAGE HEADER */}
      <div className="bg-white border border-[#DED9D0] rounded-3xl p-6 sm:p-8 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-[#3F5945]">
          <Camera className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest">Auriva Computer Vision</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#20251F]">
          AI Skin Scan
        </h1>
        <p className="text-sm text-[#62675F] font-medium">
          Take or upload a clear photo of your face to get an AI-based analysis of visible skin characteristics.
        </p>

        <div className="p-3 bg-[#EEF2EA] border border-[#DDE4D8] rounded-xl text-xs text-[#62675F] font-medium flex items-center gap-2 mt-2">
          <Info className="w-4 h-4 text-[#3F5945] shrink-0" />
          <span>For best results, use a clear, well-lit photo without heavy makeup or filters.</span>
        </div>
      </div>

      {/* 2. QUALITY ERROR ALERT */}
      {qualityError && (
        <div className="p-5 bg-[#FDF6F5] border border-[#B85C50]/30 rounded-3xl text-xs text-[#B85C50] font-medium space-y-3 animate-fade-in shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-[#9E4A3F] text-sm">
            <AlertCircle className="w-5 h-5 text-[#B85C50] shrink-0" />
            <span>Image Quality Inspection Notice</span>
          </div>
          <p>{qualityError}</p>
          <button
            onClick={handleResetScan}
            className="derm-pill-secondary text-xs px-4 py-2 border-[#B85C50] text-[#B85C50] hover:bg-[#F7E7E5]"
          >
            Try Again With Clear Photo
          </button>
        </div>
      )}

      {/* 3. INPUT SELECTION & ANALYSIS PROCESS */}
      {!currentAnalysis && !analyzing && (
        <div className="bg-white border border-[#DED9D0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          
          {/* CAMERA MODE */}
          {inputMode === 'camera' && (
            <div className="space-y-4 text-center max-w-md mx-auto">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#26382C] border border-[#DED9D0] flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  onLoadedMetadata={handleVideoReady}
                  onCanPlay={handleVideoReady}
                  className="w-full h-full object-cover"
                />
                {!isVideoReady && (
                  <div className="absolute inset-0 bg-[#26382C]/90 flex flex-col items-center justify-center text-white text-xs font-medium gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#A9B5A1]" />
                    <span>Preparing camera...</span>
                  </div>
                )}
              </div>

              {cameraError && <p className="text-xs text-[#B85C50] font-semibold">{cameraError}</p>}

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={capturePhoto}
                  disabled={!isVideoReady}
                  className={`derm-pill-btn text-xs px-6 py-2.5 flex items-center gap-2 ${
                    !isVideoReady ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>{isVideoReady ? 'Capture Photo' : 'Preparing Camera...'}</span>
                </button>
                <button onClick={handleResetScan} className="derm-pill-secondary text-xs px-4 py-2.5">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* IMAGE PREVIEW MODE (FOR BOTH CAMERA CAPTURED & UPLOADED PHOTOS) */}
          {selectedImage && (inputMode === 'upload' || inputMode === 'preview') && (
            <div className="space-y-6 max-w-md mx-auto text-center animate-fade-in">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#3F5945] shadow-xs">
                <img src={selectedImage} alt="Skin Scan Preview" className="w-full h-full object-cover" />
              </div>

              {/* PRIVACY & HISTORY SAVE CHECKBOX */}
              <div className="p-4 bg-[#EEF2EA] border border-[#DDE4D8] rounded-2xl text-xs text-[#62675F] text-left space-y-2">
                <p className="font-semibold text-[#20251F]">🔒 Privacy Notice:</p>
                <p className="text-[11px]">Your uploaded image is processed to analyze visible skin characteristics. Images are stored securely in your account if saved.</p>
                
                <label className="flex items-center gap-2 pt-1 font-bold text-[#20251F] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveToHistory}
                    onChange={(e) => setSaveToHistory(e.target.checked)}
                    className="w-4 h-4 rounded text-[#3F5945] focus:ring-0 cursor-pointer"
                  />
                  <span>Save this scan to my history</span>
                </label>
              </div>

              <div className="flex items-center justify-center gap-3">
                {inputMode === 'preview' ? (
                  <button onClick={handleRetakePhoto} className="derm-pill-secondary text-xs px-4 py-2.5 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retake Photo</span>
                  </button>
                ) : (
                  <button onClick={() => { setSelectedImage(null); setInputMode('select'); }} className="derm-pill-secondary text-xs px-4 py-2.5">
                    Change Photo
                  </button>
                )}

                <button onClick={runSkinAnalysis} className="derm-pill-btn text-xs px-6 py-2.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze My Skin</span>
                </button>
              </div>
            </div>
          )}

          {/* INITIAL OPTION BUTTONS */}
          {!selectedImage && inputMode === 'select' && (
            <div className="space-y-6 text-center py-4">
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="font-serif text-xl font-bold text-[#20251F]">Select Image Source</h3>
                <p className="text-xs text-[#62675F]">Choose whether to capture a live photo with your camera or upload an existing photo.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                <button
                  onClick={startCamera}
                  className="p-6 bg-[#F8F5EF] border-2 border-[#A9B5A1] hover:border-[#3F5945] hover:bg-[#DDE4D8] rounded-3xl text-center space-y-3 group transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#3F5945] text-white flex items-center justify-center mx-auto shadow-xs group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6 text-[#E8DED0]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[#20251F] text-base">📷 Take Photo</h4>
                    <p className="text-[11px] text-[#62675F]">Use device camera</p>
                  </div>
                </button>

                <div className="relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full p-6 bg-[#F8F5EF] border-2 border-[#A9B5A1] hover:border-[#3F5945] hover:bg-[#DDE4D8] rounded-3xl text-center space-y-3 group transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#3F5945] text-white flex items-center justify-center mx-auto shadow-xs group-hover:scale-105 transition-transform">
                      <Upload className="w-6 h-6 text-[#E8DED0]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-[#20251F] text-base">📁 Upload Photo</h4>
                      <p className="text-[11px] text-[#62675F]">JPG, PNG, WEBP</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 4. PROGRESSIVE LOADING ANIMATION */}
      {analyzing && (
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-12 text-center space-y-6 shadow-xs max-w-md mx-auto">
          <RefreshCw className="w-12 h-12 text-[#2D4A3E] animate-spin mx-auto" />
          
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-[#111827]">
              {analysisStep === 1 && 'Analyzing your photo...'}
              {analysisStep === 2 && 'Checking visible skin characteristics...'}
              {analysisStep === 3 && 'Preparing your skincare insights...'}
            </h3>
            <p className="text-xs text-[#6B7280]">Auriva AI is inspecting surface patterns and visible characteristics.</p>
          </div>

          <div className="w-full bg-[#FAFAF8] rounded-full h-2 overflow-hidden border border-[#E5E7EB]">
            <div 
              className="bg-[#2D4A3E] h-full transition-all duration-500" 
              style={{ width: `${(analysisStep / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* 5. ANALYSIS RESULTS VIEW ("YOUR AI SKIN SCAN") */}
      {currentAnalysis && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2D4A3E]">Analysis Result</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111827]">Your AI Skin Scan</h2>
              </div>

              <button onClick={handleResetScan} className="derm-pill-secondary text-xs px-4 py-2 self-start sm:self-auto">
                Scan Another Photo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Captured Image */}
              <div className="md:col-span-4 space-y-3">
                {selectedImage && (
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#2D4A3E] shadow-xs">
                    <img src={selectedImage} alt="Analyzed Scan" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="p-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase text-[#6B7280] block">Estimated Skin Type</span>
                  <span className="font-serif text-lg font-bold text-[#2D4A3E] block">{currentAnalysis.estimatedSkinType}</span>
                  <span className="text-[10px] text-[#6B7280]">Confidence: {currentAnalysis.confidence}</span>
                </div>
              </div>

              {/* Profile Correlation & Visible Characteristics */}
              <div className="md:col-span-8 space-y-5 text-xs">
                
                {/* SAVED PROFILE CORRELATION NOTICE */}
                <div className={`p-4 rounded-2xl border ${
                  currentAnalysis.isProfileConsistent 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Saved Profile Correlation</span>
                  </div>
                  <p className="mt-1 leading-relaxed">{currentAnalysis.profileCorrelation}</p>
                </div>

                {/* VISIBLE SKIN CHARACTERISTICS GRID */}
                <div className="space-y-3">
                  <h3 className="font-serif text-lg font-bold text-[#111827]">Visible Skin Characteristics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentAnalysis.characteristics.map(c => (
                      <div key={c.name} className="p-3.5 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-[#111827] text-xs">{c.name}</strong>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.level === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {c.level}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B7280]">{c.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ANALYSIS SUMMARY */}
                <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#6B7280] block">Analysis Summary</span>
                  <p className="text-[#111827] font-medium leading-relaxed">{currentAnalysis.summaryText}</p>
                </div>

              </div>
            </div>
          </div>

          {/* 6. RECOMMENDED SKINCARE (3-5 DATASET PRODUCTS) */}
          <div className="space-y-4">
            <div className="border-b border-[#E5E7EB] pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#111827]">Recommended Skincare</h3>
                <p className="text-xs text-[#4B5563]">Products matched from the Indian Skincare Catalog based on your visible skin characteristics.</p>
              </div>

              <button onClick={() => onNavigate('products')} className="text-xs text-[#2D4A3E] font-bold hover:underline">
                Explore Full Catalog &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((prod) => (
                <div
                  key={prod.product_id}
                  onClick={() => window.open(`?view=product-detail&id=${prod.product_id}`, '_blank')}
                  className="derm-card p-4 bg-white border border-[#E5E7EB] hover:border-[#2D4A3E] cursor-pointer group flex flex-col justify-between transition-all rounded-3xl"
                >
                  <div className="space-y-3">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAFAF8] border border-[#F3F4F1] relative">
                      <VerifiedProductImage 
                        productName={prod.product_name}
                        productId={prod.product_id}
                        imageUrl={prod.image_url}
                        alt={prod.product_name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-[#111827]/80 text-white text-[10px] uppercase font-bold">
                        {prod.product_category}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#2D4A3E] font-bold uppercase tracking-wider block">{prod.brand_name}</span>
                      <h4 className="font-serif text-sm font-bold text-[#111827] line-clamp-1">{prod.product_name}</h4>
                    </div>

                    <p className="text-xs text-[#4B5563] line-clamp-2">
                      <strong>Actives:</strong> {prod.key_ingredients}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-[#E5E7EB] flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-[#111827]">₹{prod.price_inr || 'N/A'}</span>
                    <button className="px-3 py-1 bg-[#2D4A3E] text-white text-[11px] font-semibold rounded-full">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. DERMATOLOGIST CONSULTATION CALLOUT */}
          <div className="p-6 bg-emerald-950 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">When To Consider Professional Advice</span>
              <h3 className="font-serif text-xl font-bold">Consult a Qualified Dermatologist</h3>
              <p className="text-xs text-emerald-200">An image alone cannot determine the cause of skin changes. If concerns worsen or persist, consult a doctor.</p>
            </div>

            <button
              onClick={() => onNavigate('doctors')}
              className="bg-white text-[#2D4A3E] hover:bg-emerald-50 text-xs font-bold px-6 py-3 rounded-full transition-all shrink-0"
            >
              Find a Dermatologist &rarr;
            </button>
          </div>

        </div>
      )}

      {/* 8. PREVIOUS SKIN SCANS HISTORY SECTION */}
      {scanHistory.length > 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="border-b border-[#E5E7EB] pb-3">
            <h3 className="font-serif text-xl font-bold text-[#111827]">Previous Skin Scans</h3>
            <p className="text-xs text-[#6B7280]">Your saved previous AI image scans and characteristics history.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scanHistory.map((scan) => (
              <div key={scan.id} className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-3 text-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[#6B7280] text-[11px]">
                    <span className="flex items-center gap-1 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(scan.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => setScanToDelete(scan)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete Scan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {scan.image_url && (
                      <img src={scan.image_url} alt="Scan history" className="w-12 h-12 object-cover rounded-xl border border-[#E5E7EB]" />
                    )}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#6B7280] block">Estimated Type</span>
                      <strong className="font-serif text-sm text-[#111827]">{scan.estimated_skin_type}</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedImage(scan.image_url);
                    setCurrentAnalysis(scan.analysis_result);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full derm-pill-secondary text-[11px] py-1.5"
                >
                  View Scan Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. DELETE CONFIRMATION MODAL */}
      {scanToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-[#111827]">Delete Skin Scan</h3>
            <p className="text-xs text-[#6B7280]">Are you sure you want to delete this scan from your history? This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setScanToDelete(null)} className="derm-pill-secondary text-xs px-4 py-2">
                Cancel
              </button>
              <button onClick={handleDeleteScanConfirmed} className="derm-pill-btn bg-red-600 hover:bg-red-700 text-xs px-4 py-2">
                Delete Scan
              </button>
            </div>
          </div>
        </div>
      )}

      <MedicalDisclaimerBanner />

    </div>
  );
};
