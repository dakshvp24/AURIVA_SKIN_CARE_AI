import React, { useState } from 'react';
import { ImageOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { lookupVerifiedProduct } from '../../services/productImageCatalog';

interface VerifiedProductImageProps {
  productName: string;
  productId?: string;
  imageUrl?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  showBadge?: boolean;
}

export const VerifiedProductImage: React.FC<VerifiedProductImageProps> = ({
  productName,
  productId,
  imageUrl: propImageUrl,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'w-full h-full',
  showBadge = false
}) => {
  const [hasError, setHasError] = useState<boolean>(false);

  // 1. Verify that the product is mapped to its exact reference image
  const lookup = lookupVerifiedProduct(productId || productName);
  
  // Strict resolution: Prioritize verified catalog image or propImageUrl if verified
  const verifiedSrc = lookup.verifiedImageUrl || propImageUrl;
  const isImageValid = Boolean(verifiedSrc && !hasError);

  if (!isImageValid) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl p-4 text-center space-y-1.5 select-none ${containerClassName}`}
        role="region"
        aria-label="Product image unavailable"
      >
        <div className="w-9 h-9 rounded-xl bg-[#F3F4F1] flex items-center justify-center text-[#9CA3AF]">
          <ImageOff className="w-5 h-5 text-[#9CA3AF]" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-[#374151]">Product image unavailable</p>
          <p className="text-[10px] text-[#6B7280] leading-tight max-w-[180px] mx-auto">
            We couldn't find a verified reference image for this product. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#FAFAF8] ${containerClassName}`}>
      <img
        src={verifiedSrc}
        alt={alt || lookup.exactProductName || productName}
        className={className}
        loading="lazy"
        onError={() => setHasError(true)}
      />
      {showBadge && lookup.isFound && (
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#2D4A3E]/90 backdrop-blur-xs text-white text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-2xs">
          <ShieldCheck className="w-3 h-3 text-emerald-300" />
          <span>Verified Reference</span>
        </div>
      )}
    </div>
  );
};
