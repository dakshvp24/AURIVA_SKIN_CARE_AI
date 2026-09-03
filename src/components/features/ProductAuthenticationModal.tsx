import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, ShieldAlert, AlertCircle, Camera, Upload, RefreshCw, X, 
  CheckCircle2, Info, ShoppingBag, ArrowRight, ExternalLink 
} from 'lucide-react';
import { ProductRecord } from '../../types';
import { authenticateProductImage, ProductAuthResult } from '../../services/productAuthenticationService';
import { lookupVerifiedProduct } from '../../services/productImageCatalog';
import { VerifiedProductImage } from '../common/VerifiedProductImage';

interface ProductAuthenticationModalProps {
  product?: ProductRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductAuthenticationModal: React.FC<ProductAuthenticationModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [authResult, setAuthResult] = useState<ProductAuthResult | null>(null);
  const [selectedProductName, setSelectedProductName] = useState<string>(product?.product_name || '');
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  if (!isOpen) return null;

  const currentProductName = product?.product_name || selectedProductName;
  const verifiedLookup = lookupVerifiedProduct(currentProductName);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setAuthResult(null);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.warn('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 480;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setUploadedImage(canvas.toDataURL('image/jpeg', 0.92));
      setAuthResult(null);
      stopCamera();
    }
  };

  const handleRunAuthentication = async () => {
    if (!currentProductName) return;
    setIsVerifying(true);
    
    // Simulate realistic AI inspection
    await new Promise(r => setTimeout(r, 900));

    const result = await authenticateProductImage(currentProductName, uploadedImage);
    setAuthResult(result);
    setIsVerifying(false);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setAuthResult(null);
    stopCamera();
  };

  const handleClose = () => {
    stopCamera();
    handleReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
      <div className="bg-white border border-[#E5E7EB] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* MODAL HEADER */}
        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2D4A3E] text-white flex items-center justify-center font-serif font-bold text-lg">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D4A3E]">AURIVA VERIFICATION SUITE</span>
              <h2 className="font-serif text-xl font-bold text-[#111827]">Product Authenticity Check</h2>
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="p-2 rounded-full text-[#6B7280] hover:bg-[#F3F4F1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          
          {/* PRODUCT REFERENCE BANNER */}
          <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Target Product</span>
              {verifiedLookup.isFound ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified in Dataset
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Unverified Reference
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#E5E7EB]">
                <VerifiedProductImage 
                  productName={currentProductName} 
                  productId={product?.product_id}
                  imageUrl={product?.image_url}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-base font-bold text-[#111827]">{currentProductName}</h3>
                <p className="text-xs text-[#4B5563] line-clamp-2">
                  <strong>Use:</strong> {verifiedLookup.existingProductUse || product?.product_use || 'Skincare application and care.'}
                </p>
              </div>
            </div>
          </div>

          {/* CAMERA / UPLOAD PHOTO SECTION */}
          {!authResult && (
            <div className="space-y-4">
              <div className="border-b border-[#E5E7EB] pb-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111827]">Upload Packaging Photo</span>
                <span className="text-[11px] text-[#6B7280]">Compare your physical product against reference</span>
              </div>

              {cameraActive ? (
                <div className="space-y-3 text-center">
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-[#E5E7EB]">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  </div>
                  <div className="flex justify-center gap-3">
                    <button onClick={capturePhoto} className="derm-pill-btn text-xs px-6 py-2.5">
                      Capture Photo
                    </button>
                    <button onClick={stopCamera} className="derm-pill-secondary text-xs px-4 py-2.5">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : uploadedImage ? (
                <div className="space-y-4 text-center">
                  <div className="max-w-xs mx-auto aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#2D4A3E] shadow-sm">
                    <img src={uploadedImage} alt="Uploaded sample" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex justify-center gap-3">
                    <button onClick={handleReset} className="derm-pill-secondary text-xs px-4 py-2">
                      Change Photo
                    </button>
                    <button 
                      onClick={handleRunAuthentication}
                      disabled={isVerifying}
                      className="derm-pill-btn text-xs px-6 py-2 flex items-center gap-2"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Comparing Pixels...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Authenticate Product</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={startCamera}
                    className="p-5 bg-[#FAFAF8] border border-[#E5E7EB] hover:border-[#2D4A3E] rounded-2xl text-center space-y-2 group transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#2D4A3E] text-white flex items-center justify-center mx-auto">
                      <Camera className="w-5 h-5 text-emerald-300" />
                    </div>
                    <strong className="text-xs text-[#111827] block">Use Camera</strong>
                    <span className="text-[10px] text-[#6B7280]">Snap live packaging</span>
                  </button>

                  <div className="relative">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-full p-5 bg-[#FAFAF8] border border-[#E5E7EB] hover:border-[#2D4A3E] rounded-2xl text-center space-y-2 group transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#2D4A3E] text-white flex items-center justify-center mx-auto">
                        <Upload className="w-5 h-5 text-emerald-300" />
                      </div>
                      <strong className="text-xs text-[#111827] block">Upload Photo</strong>
                      <span className="text-[10px] text-[#6B7280]">JPG, PNG, WEBP</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AUTHENTICATION RESULT DISPLAY */}
          {authResult && (
            <div className="space-y-5 animate-fade-in">
              
              {/* CASE 1: AUTHENTICATED */}
              {authResult.status === 'AUTHENTICATED' && (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3 text-emerald-900">
                    <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold">{authResult.statusTitle}</h4>
                      <p className="text-xs text-emerald-800">{authResult.statusMessage}</p>
                    </div>
                  </div>

                  {/* DISPLAY EXACT THREE REQUIRED ATTRIBUTES */}
                  <div className="bg-white border border-emerald-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-4 w-full aspect-square rounded-lg overflow-hidden border border-[#E5E7EB]">
                      <VerifiedProductImage 
                        productName={authResult.productName}
                        imageUrl={authResult.referenceImageUrl}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="sm:col-span-8 space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#6B7280] block">Exact Product Name</span>
                        <strong className="text-sm font-bold text-[#111827]">{authResult.productName}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#6B7280] block">Existing Product Use</span>
                        <p className="text-[#374151] font-medium leading-relaxed">{authResult.productUse}</p>
                      </div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Match Confidence: {authResult.matchScore}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* CASE 2: REFERENCE UNAVAILABLE (Missing reference image != Product Not Authenticated) */}
              {authResult.status === 'REFERENCE_UNAVAILABLE' && (
                <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                  <div className="flex items-start gap-3 text-amber-950">
                    <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-serif text-base font-bold">{authResult.statusTitle}</h4>
                      <p className="text-xs leading-relaxed">{authResult.statusMessage}</p>
                      <div className="p-2.5 bg-white/80 border border-amber-200 rounded-lg text-[11px] text-amber-900 mt-2 font-medium">
                        ℹ️ <strong>Important Notice:</strong> Missing reference image does NOT mean the product is unauthenticated. No comparison was performed because the dataset reference image is unavailable.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CASE 3: NOT AUTHENTICATED (When actual comparison was performed and failed) */}
              {authResult.status === 'NOT_AUTHENTICATED' && (
                <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                  <div className="flex items-start gap-3 text-rose-950">
                    <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-serif text-base font-bold">{authResult.statusTitle}</h4>
                      <p className="text-xs leading-relaxed">{authResult.statusMessage}</p>
                      <p className="text-[11px] text-rose-800 pt-1 font-medium">{authResult.guidance}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs">
                    <div className="p-3 bg-white border border-rose-200 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-[#6B7280] block">Uploaded Photo</span>
                      {uploadedImage && <img src={uploadedImage} alt="Uploaded" className="w-full h-24 object-cover rounded-md" />}
                    </div>
                    <div className="p-3 bg-white border border-rose-200 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-[#6B7280] block">Verified Reference</span>
                      <VerifiedProductImage productName={authResult.productName} className="w-full h-24 object-cover rounded-md" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={handleReset} className="derm-pill-secondary text-xs px-5 py-2.5">
                  Verify Another Image
                </button>
                <button onClick={handleClose} className="derm-pill-btn text-xs px-6 py-2.5">
                  Done
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
