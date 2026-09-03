import { ProductRecord } from '../types';
import { loadProductsData } from './dataLoader';

export interface ScoredProduct extends ProductRecord {
  matchScore: number;
  matchLevel: number; // 1 to 5
  whyRecommended: string;
}

export interface DetailedRoutineStep {
  stepNumber: number;
  stepTitle: string;
  categoryName: string;
  product: ProductRecord | null;
  usageInstruction: string;
  whySelected: string;
  keyIngredient: string;
}

export interface PersonalizedRoutine {
  morning: DetailedRoutineStep[];
  evening: DetailedRoutineStep[];
}

// 1. NORMALIZATION LAYER
export function normalizeSkinType(raw?: string): string {
  if (!raw) return 'combination';
  const clean = raw.toLowerCase().replace(/skin/g, '').replace(/[^a-z]/g, '').trim();
  if (clean.includes('oily')) return 'oily';
  if (clean.includes('dry')) return 'dry';
  if (clean.includes('combo') || clean.includes('combination')) return 'combination';
  if (clean.includes('sensitiv')) return 'sensitive';
  if (clean.includes('norm')) return 'normal';
  return clean || 'combination';
}

export function normalizeConcern(raw?: string): string {
  if (!raw) return 'general care';
  const clean = raw.toLowerCase().replace(/prone/g, '').replace(/[^a-z\s]/g, ' ').trim();
  if (clean.includes('acne') || clean.includes('pimpr') || clean.includes('blemish')) return 'acne';
  if (clean.includes('pigment') || clean.includes('dark spot') || clean.includes('uneven')) return 'hyperpigmentation';
  if (clean.includes('wrinkl') || clean.includes('aging') || clean.includes('fine line')) return 'aging';
  if (clean.includes('rosacea') || clean.includes('redness')) return 'rosacea';
  if (clean.includes('eczem') || clean.includes('dermatitis')) return 'eczema';
  if (clean.includes('dry') || clean.includes('flake') || clean.includes('dehydrat')) return 'dryness';
  if (clean.includes('dull')) return 'dullness';
  if (clean.includes('pore')) return 'pores';
  return clean || 'general care';
}

// 2. CATEGORY-SPECIFIC DYNAMIC USAGE INSTRUCTIONS
export function getProductUsageInstructions(prod: ProductRecord): string[] {
  if (prod.usage_instructions && prod.usage_instructions.trim()) {
    const raw = prod.usage_instructions.trim();
    if (raw.includes('1.') || raw.includes('\n')) {
      return raw.split('\n').map(s => s.trim()).filter(Boolean);
    }
  }

  const cat = (prod.product_category || '').toLowerCase();
  const name = (prod.product_name || '').toLowerCase();

  if (cat.includes('wash') || cat.includes('cleanser') || name.includes('wash') || name.includes('cleanser')) {
    return [
      '1. Wet your face with clean lukewarm water.',
      '2. Take a small pea-sized amount of product onto clean palms.',
      '3. Gently massage onto face in circular motions for 30–60 seconds.',
      '4. Rinse thoroughly with water.',
      '5. Gently pat skin dry with a clean soft towel.'
    ];
  }

  if (cat.includes('serum') || cat.includes('active') || name.includes('serum')) {
    return [
      '1. Cleanse your face thoroughly and pat completely dry.',
      '2. Dispense 3 to 4 drops of serum onto your fingertips.',
      '3. Gently press and spread over face and neck.',
      '4. Allow 1-2 minutes for the active formula to absorb.',
      '5. Follow with your preferred daily moisturizer.'
    ];
  }

  if (cat.includes('moisturiz') || cat.includes('cream') || cat.includes('gel') || name.includes('cream') || name.includes('gel')) {
    return [
      '1. Cleanse your face and apply active serums first.',
      '2. Dispense a suitable dime-sized amount of moisturizer.',
      '3. Smooth evenly across your face, neck, and chest.',
      '4. Gently massage in upward circular motions until fully absorbed.'
    ];
  }

  if (cat.includes('sun') || name.includes('sun') || name.includes('spf')) {
    return [
      '1. Apply as the final protective step of your morning skincare routine.',
      '2. Dispense a generous two-finger length amount of sunscreen.',
      '3. Spread evenly over all sun-exposed skin on face and neck.',
      '4. Apply 15–20 minutes before outdoor sun exposure.',
      '5. Reapply every 2 to 3 hours when outdoors or after sweating.'
    ];
  }

  if (cat.includes('spot') || cat.includes('treatment') || cat.includes('pack') || name.includes('pack')) {
    return [
      '1. Cleanse and pat dry the targeted skin area.',
      '2. Apply a thin layer directly to blemishes or target concerns.',
      '3. Allow to dry or absorb completely before layering further steps.'
    ];
  }

  return [
    '1. Cleanse skin thoroughly before application.',
    '2. Apply a suitable amount evenly onto target skin areas.',
    '3. Gently massage until fully absorbed into skin.',
    '4. Use daily as part of your consistent skincare routine.'
  ];
}

// 3. DYNAMIC NON-DIAGNOSTIC "WHY RECOMMENDED" GENERATOR
export function generateWhyRecommended(prod: ProductRecord, normSkinType: string, normConcern: string, matchLevel: number): string {
  const pType = (prod.skin_type || '').toLowerCase();
  const pConcern = (prod.skin_concern || '').toLowerCase();

  const reasons: string[] = [];

  if (pType.includes(normSkinType) || pType.includes('all')) {
    reasons.push(`listed as suitable for ${normSkinType} skin`);
  }
  if (pConcern.includes(normConcern)) {
    reasons.push(`formulated for ${normConcern} care`);
  }
  if (prod.key_ingredients && prod.key_ingredients !== 'None') {
    reasons.push(`contains ingredients (${prod.key_ingredients}) associated with your concerns`);
  }

  if (reasons.length > 0) {
    return `Recommended based on your skin profile: ${prod.product_name} is ${reasons.join(' and ')}.`;
  }

  return `Recommended as a gentle ${prod.product_category} formulation compatible with your ${normSkinType} skin routine.`;
}

// 3. 5-LEVEL MULTI-TIERED MATCHING ENGINE
export function getRecommendedProducts(
  allProducts: ProductRecord[],
  skinType?: string,
  concern?: string
): ScoredProduct[] {
  if (!allProducts || allProducts.length === 0) return [];

  const normType = normalizeSkinType(skinType);
  const normConcern = normalizeConcern(concern);

  const scoredList: ScoredProduct[] = allProducts.map((prod) => {
    const pType = (prod.skin_type || '').toLowerCase();
    const pConcern = (prod.skin_concern || '').toLowerCase();
    const pName = (prod.product_name || '').toLowerCase();
    const pIng = (prod.key_ingredients || '').toLowerCase();

    let matchLevel = 5;
    let score = 20;

    const matchesType = pType.includes(normType) || pType.includes('all');
    const matchesConcern = pConcern.includes(normConcern) || pName.includes(normConcern) || pIng.includes(normConcern);

    if (matchesType && matchesConcern) {
      matchLevel = 1;
      score = 100;
    } else if (matchesType && (prod.product_category || '').length > 0) {
      matchLevel = 2;
      score = 80;
    } else if (matchesConcern) {
      matchLevel = 3;
      score = 60;
    } else if (matchesType) {
      matchLevel = 4;
      score = 40;
    } else {
      matchLevel = 5;
      score = 20;
    }

    // Boost score if fragrance free or non-comedogenic
    if (prod.non_comedogenic === 'Yes') score += 5;
    if (prod.fragrance_free === 'Yes') score += 5;

    const whyRecommended = generateWhyRecommended(prod, normType, normConcern, matchLevel);

    return {
      ...prod,
      matchScore: score,
      matchLevel,
      whyRecommended
    };
  });

  // Sort by matchLevel ascending (Level 1 first), then matchScore descending
  scoredList.sort((a, b) => {
    if (a.matchLevel !== b.matchLevel) {
      return a.matchLevel - b.matchLevel;
    }
    return b.matchScore - a.matchScore;
  });

  // Return top 6 distinct products
  return scoredList.slice(0, 6);
}

// Support signature for SkinAssessmentForm.tsx
export async function generateDatasetRecommendations(_db: any, req: { skinType: string; symptoms: string[]; duration: string }) {
  const allProducts = await loadProductsData();
  const skinType = req.skinType;
  const concern = req.symptoms[0] || 'general care';
  const products = getRecommendedProducts(allProducts, skinType, concern);

  return {
    matchingCondition: concern,
    suggestedIngredients: ['Salicylic Acid', 'Niacinamide', 'Hyaluronic Acid'],
    ingredientsToAvoid: ['Heavy Mineral Oils', 'Artificial Fragrance'],
    guidanceNotes: ['Maintain gentle pH-balanced cleansing', 'Use non-comedogenic moisturizers'],
    matchingTreatments: [],
    matchingProducts: products,
    allergyWarnings: ['Perform patch test prior to full application']
  };
}

// 4. ACTUAL PRODUCT-INFUSED SKINCARE ROUTINE GENERATOR
export function buildPersonalizedRoutine(
  allProducts: ProductRecord[],
  skinType?: string,
  concern?: string
): PersonalizedRoutine {
  const scoredProducts = getRecommendedProducts(allProducts, skinType, concern);
  const normType = normalizeSkinType(skinType);
  const normConcern = normalizeConcern(concern);

  // Helper to find best product matching category keyword
  const findBestForCategory = (catKeywords: string[], excludeIds: Set<string> = new Set()): ProductRecord | null => {
    for (const prod of scoredProducts) {
      if (excludeIds.has(prod.product_id)) continue;
      const cat = (prod.product_category || '').toLowerCase();
      const pName = (prod.product_name || '').toLowerCase();
      if (catKeywords.some(k => cat.includes(k) || pName.includes(k))) {
        return prod;
      }
    }

    // Fallback search in allProducts
    for (const prod of allProducts) {
      if (excludeIds.has(prod.product_id)) continue;
      const cat = (prod.product_category || '').toLowerCase();
      const pName = (prod.product_name || '').toLowerCase();
      const pType = (prod.skin_type || '').toLowerCase();

      if ((pType.includes(normType) || pType.includes('all')) && catKeywords.some(k => cat.includes(k) || pName.includes(k))) {
        return prod;
      }
    }

    return null;
  };

  const usedProductIds = new Set<string>();

  // Morning Products
  const morningCleanser = findBestForCategory(['cleanser', 'wash', 'face wash'], usedProductIds);
  if (morningCleanser) usedProductIds.add(morningCleanser.product_id);

  const morningSerum = findBestForCategory(['serum', 'treatment', 'active', 'essence', 'toner'], usedProductIds);
  if (morningSerum) usedProductIds.add(morningSerum.product_id);

  const morningMoisturizer = findBestForCategory(['moisturizer', 'cream', 'lotion', 'gel'], usedProductIds);
  if (morningMoisturizer) usedProductIds.add(morningMoisturizer.product_id);

  const morningSunscreen = findBestForCategory(['sunscreen', 'spf', 'sunblock', 'defense'], usedProductIds);
  if (morningSunscreen) usedProductIds.add(morningSunscreen.product_id);

  // Evening Products
  const eveningCleanser = findBestForCategory(['cleanser', 'wash', 'face wash']) || morningCleanser;
  const eveningSerum = findBestForCategory(['night', 'serum', 'treatment', 'retinol', 'peptide'], usedProductIds) || morningSerum;
  const eveningMoisturizer = findBestForCategory(['night cream', 'cream', 'moisturizer', 'barrier'], usedProductIds) || morningMoisturizer;

  const morning: DetailedRoutineStep[] = [
    {
      stepNumber: 1,
      stepTitle: 'Gentle Morning Cleanser',
      categoryName: 'Cleanser',
      product: morningCleanser,
      usageInstruction: 'Massage a nickel-sized amount onto damp skin for 60 seconds using lukewarm water.',
      whySelected: morningCleanser ? `Selected because it is suitable for ${normType} skin and clears morning sebum.` : `Suitable gentle cleanser for ${normType} skin.`,
      keyIngredient: morningCleanser?.key_ingredients || 'pH-Balanced Actives'
    },
    {
      stepNumber: 2,
      stepTitle: 'Target Treatment Serum',
      categoryName: 'Serum / Treatment',
      product: morningSerum,
      usageInstruction: 'Apply 2-3 drops to face and neck, gently patting into skin before moisturizer.',
      whySelected: morningSerum ? `Formulated with active ingredients to target ${normConcern}.` : `Targeted active serum for ${normConcern}.`,
      keyIngredient: morningSerum?.key_ingredients || 'Active Botanical Extracts'
    },
    {
      stepNumber: 3,
      stepTitle: 'Hydrating Moisturizer',
      categoryName: 'Moisturizer',
      product: morningMoisturizer,
      usageInstruction: 'Apply evenly over face to lock in hydration and strengthen moisture barrier.',
      whySelected: morningMoisturizer ? `Selected to hydrate ${normType} skin without clogging pores.` : `Nourishing moisturizer for ${normType} skin.`,
      keyIngredient: morningMoisturizer?.key_ingredients || 'Ceramides & Hyaluronic Acid'
    },
    {
      stepNumber: 4,
      stepTitle: 'Broad-Spectrum Sunscreen',
      categoryName: 'Sunscreen (SPF 50)',
      product: morningSunscreen,
      usageInstruction: 'Apply as final morning step 15 minutes before sun exposure. Reapply as needed.',
      whySelected: morningSunscreen ? `Essential daily UV defense tailored for ${normType} skin.` : `Broad-spectrum SPF protection for daily UV defense.`,
      keyIngredient: morningSunscreen?.key_ingredients || 'Broad-Spectrum UV Filters'
    }
  ];

  const evening: DetailedRoutineStep[] = [
    {
      stepNumber: 1,
      stepTitle: 'Deep Evening Cleanser',
      categoryName: 'Cleanser',
      product: eveningCleanser,
      usageInstruction: 'Thoroughly cleanse face to remove daily sunscreen, environmental pollutants, and excess sebum.',
      whySelected: eveningCleanser ? `Purifies skin without stripping natural barrier moisture.` : `Effective evening cleanser.`,
      keyIngredient: eveningCleanser?.key_ingredients || 'Soothe & Balance Actives'
    },
    {
      stepNumber: 2,
      stepTitle: 'Night Recovery Treatment',
      categoryName: 'Night Treatment',
      product: eveningSerum,
      usageInstruction: 'Apply active treatment to clean skin for overnight cell renewal and repair.',
      whySelected: eveningSerum ? `Supports overnight recovery targeting ${normConcern}.` : `Overnight skin repair treatment.`,
      keyIngredient: eveningSerum?.key_ingredients || 'Repair Peptides & Actives'
    },
    {
      stepNumber: 3,
      stepTitle: 'Barrier Repair Cream',
      categoryName: 'Moisturizer',
      product: eveningMoisturizer,
      usageInstruction: 'Apply generous layer as final evening step to restore skin barrier overnight.',
      whySelected: eveningMoisturizer ? `Deeply hydrates and locks in overnight actives for ${normType} skin.` : `Restorative night cream.`,
      keyIngredient: eveningMoisturizer?.key_ingredients || 'Lipid & Barrier Complex'
    }
  ];

  return { morning, evening };
}
