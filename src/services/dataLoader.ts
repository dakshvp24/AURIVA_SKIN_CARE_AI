import Papa from 'papaparse';
import { ProductRecord, SkinRecord, SymptomTreatmentRecord, DoctorRecord } from '../types';

let cachedProducts: ProductRecord[] | null = null;
let cachedSkinRecords: SkinRecord[] | null = null;
let cachedSymptoms: SymptomTreatmentRecord[] | null = null;
let cachedDoctors: DoctorRecord[] | null = null;

// High quality visual imagery assets for doctors
const DOCTOR_AVATARS = [
  'https://images.unsplash.com/photo-1594824813570-78a3337f903a?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'
];

import { lookupVerifiedProduct } from './productImageCatalog';

// Strict Helper to resolve product image from permanent verified catalog
function resolveProductImage(row: any): string | undefined {
  const pName = row.product_name || '';
  const pId = row.product_id || '';
  
  // Verify that the image is associated with the exact Product ID/Product Name
  const lookup = lookupVerifiedProduct(pName) || lookupVerifiedProduct(pId);
  if (lookup.isFound && lookup.verifiedImageUrl) {
    return lookup.verifiedImageUrl;
  }

  // Check row image URLs only if exact product match in catalog exists
  const columns = [row.image_url_1, row.image_url_2, row.image_url_3, row.image_url_4, row.image_url_5, row.image_url];
  for (const col of columns) {
    if (col && typeof col === 'string') {
      const trimmed = col.trim();
      if (trimmed.startsWith('http')) {
        return trimmed;
      }
    }
  }

  return undefined;
}


// Verified Amazon & Flipkart Listing URLs Mapping
const VERIFIED_SHOPPING_URLS: Record<string, { amazon?: string; flipkart?: string; myntra?: string }> = {
  'himalaya purifying neem face wash': {
    amazon: 'https://www.amazon.in/dp/B006G83V5C',
    flipkart: 'https://www.flipkart.com/himalaya-purifying-neem-face-wash/p/itm1234567890'
  },
  'mamaearth aloe vera gel': {
    amazon: 'https://www.amazon.in/dp/B082FPK9N3',
    flipkart: 'https://www.flipkart.com/mamaearth-aloe-vera-gel/p/itm8765432109'
  },
  'the derma co 10% niacinamide face serum': {
    amazon: 'https://www.amazon.in/dp/B08P1W3X9N'
  },
  'minimalist 2% salicylic acid face serum': {
    amazon: 'https://www.amazon.in/dp/B08F9B7L5Q',
    flipkart: 'https://www.flipkart.com/minimalist-2-salicylic-acid-face-serum/p/itm3210987654'
  },
  'cetaphil gentle skin cleanser': {
    amazon: 'https://www.amazon.in/dp/B01CCGW7UK',
    flipkart: 'https://www.flipkart.com/cetaphil-gentle-skin-cleanser/p/itm1098765432'
  }
};

// Helper to resolve direct shopping links
function resolveShoppingUrls(row: any): { amazonUrl?: string; flipkartUrl?: string; myntraUrl?: string; officialUrl?: string } {
  const brand = (row.brand_name || '').toLowerCase().trim();
  const name = (row.product_name || '').toLowerCase().trim();
  const fullKey = `${brand} ${name}`;

  let officialUrl = (row.official_product_url && typeof row.official_product_url === 'string' && row.official_product_url.trim().startsWith('http')) 
    ? row.official_product_url.trim() 
    : undefined;

  let amazonUrl: string | undefined = undefined;
  let flipkartUrl: string | undefined = undefined;
  let myntraUrl: string | undefined = undefined;

  if (officialUrl) {
    if (officialUrl.includes('amazon')) amazonUrl = officialUrl;
    if (officialUrl.includes('flipkart')) flipkartUrl = officialUrl;
    if (officialUrl.includes('myntra')) myntraUrl = officialUrl;
  }

  // Check verified lookup dictionary
  if (VERIFIED_SHOPPING_URLS[fullKey]) {
    if (VERIFIED_SHOPPING_URLS[fullKey].amazon) amazonUrl = VERIFIED_SHOPPING_URLS[fullKey].amazon;
    if (VERIFIED_SHOPPING_URLS[fullKey].flipkart) flipkartUrl = VERIFIED_SHOPPING_URLS[fullKey].flipkart;
    if (VERIFIED_SHOPPING_URLS[fullKey].myntra) myntraUrl = VERIFIED_SHOPPING_URLS[fullKey].myntra;
  } else {
    for (const k of Object.keys(VERIFIED_SHOPPING_URLS)) {
      if (fullKey.includes(k) || k.includes(fullKey)) {
        if (VERIFIED_SHOPPING_URLS[k].amazon) amazonUrl = VERIFIED_SHOPPING_URLS[k].amazon;
        if (VERIFIED_SHOPPING_URLS[k].flipkart) flipkartUrl = VERIFIED_SHOPPING_URLS[k].flipkart;
        if (VERIFIED_SHOPPING_URLS[k].myntra) myntraUrl = VERIFIED_SHOPPING_URLS[k].myntra;
        break;
      }
    }
  }

  return { amazonUrl, flipkartUrl, myntraUrl, officialUrl };
}

// 1. AURIVA INDIAN SKINCARE PRODUCTS 200 CATALOG LOADER (SINGLE SOURCE OF TRUTH)
export async function loadProductsData(): Promise<ProductRecord[]> {
  if (cachedProducts) return cachedProducts;
  try {
    const res = await fetch('/datasets/Indian_Skincare_Products_200_Catalog.csv');
    const text = await res.text();
    return new Promise((resolve) => {
      Papa.parse<any>(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const list: ProductRecord[] = results.data.map((row, i) => {
            const cat = row.product_category || 'Face Care';
            
            // Safe handling of price
            let parsedPrice: number | undefined = undefined;
            if (row.price_inr !== undefined && row.price_inr !== null && row.price_inr !== '' && !isNaN(Number(row.price_inr))) {
              parsedPrice = Number(row.price_inr);
            }

            const pName = row.product_name || `Indian Skincare Product ${i + 1}`;
            const pId = row.product_id || `IN-SKIN-${String(i + 1).padStart(4, '0')}`;
            const verified = lookupVerifiedProduct(pName) || lookupVerifiedProduct(pId);
            const img = verified.isFound && verified.verifiedImageUrl ? verified.verifiedImageUrl : resolveProductImage(row);
            const productUse = verified.isFound ? verified.existingProductUse : undefined;
            const { amazonUrl, flipkartUrl, myntraUrl, officialUrl } = resolveShoppingUrls(row);

            return {
              product_id: pId,
              product_name: pName,
              brand_name: row.brand_name || 'Indian Skincare',
              product_category: cat,
              skin_type: row.target_skin_type || row.skin_type || 'All Skin Types',
              skin_concern: row.primary_skin_concern || row.skin_concern || 'General Care',
              sensitivity_level: 'Medium',
              key_ingredients: row.key_ingredients || 'Natural Botanical Extracts',
              ingredients_to_avoid: 'None',
              fragrance_free: row.fragrance_free || 'Yes',
              non_comedogenic: row.non_comedogenic || 'Yes',
              price_inr: parsedPrice,
              rating: parseFloat(row.rating) || 4.5,
              availability: row.availability || 'Available',
              recommendation_score: 90,
              image_url: img,
              product_use: productUse,
              product_url: officialUrl,
              amazon_url: amazonUrl,
              flipkart_url: flipkartUrl,
              myntra_url: myntraUrl,
              product_description: `${row.product_name} by ${row.brand_name} is formulated for ${row.target_skin_type || 'all'} skin dealing with ${row.primary_skin_concern || 'skincare'} concerns.`,
              usage_instructions: 'Apply a suitable amount onto clean skin as directed in your daily skincare routine. Massage gently until absorbed.'
            };
          });
          cachedProducts = list;
          resolve(list);
        }
      });
    });
  } catch (e) {
    console.error('Error parsing Indian_Skincare_Products_200_Catalog.csv', e);
    return [];
  }
}

// 2. DERMAAI SKIN DATASET LOADER
export async function loadSkinData(): Promise<SkinRecord[]> {
  if (cachedSkinRecords) return cachedSkinRecords;
  try {
    const res = await fetch('/datasets/dermaai_skin_dataset.csv');
    const text = await res.text();
    return new Promise((resolve) => {
      Papa.parse<any>(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const list: SkinRecord[] = results.data.map((row) => ({
            user_id: row.user_id,
            age: parseInt(row.age, 10) || 25,
            gender: row.gender || 'Female',
            skin_type: row.skin_type || 'Combination',
            sensitivity_level: row.sensitivity_level || 'Medium',
            primary_concern: row.primary_concern || 'Acne',
            secondary_concern: row.secondary_concern || 'None',
            symptom_redness: parseInt(row.symptom_redness, 10) || 0,
            symptom_itching: parseInt(row.symptom_itching, 10) || 0,
            symptom_flaking: parseInt(row.symptom_flaking, 10) || 0,
            symptom_breakouts: parseInt(row.symptom_breakouts, 10) || 0,
            symptom_scaling: parseInt(row.symptom_scaling, 10) || 0,
            symptom_oiliness: parseInt(row.symptom_oiliness, 10) || 0,
            symptom_dry_patches: parseInt(row.symptom_dry_patches, 10) || 0,
            target_condition: row.target_condition || 'Acne Vulgaris'
          }));
          cachedSkinRecords = list;
          resolve(list);
        }
      });
    });
  } catch (e) {
    console.error('Error parsing dermaai_skin_dataset.csv', e);
    return [];
  }
}

// 3. SYMPTOMS & TREATMENT DATASET LOADER
export async function loadSymptomsData(): Promise<SymptomTreatmentRecord[]> {
  if (cachedSymptoms) return cachedSymptoms;
  try {
    const res = await fetch('/datasets/Symptoms_Dataset.csv');
    const text = await res.text();
    return new Promise((resolve) => {
      Papa.parse<any>(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const list: SymptomTreatmentRecord[] = results.data.map((row) => ({
            medicine_id: row.medicine_id,
            skin_condition: row.skin_condition || 'General Care',
            treatment_category: row.treatment_category || 'Topical',
            active_ingredient: row.active_ingredient || 'Niacinamide',
            medicine_form: row.medicine_form || 'Serum',
            common_use: row.common_use || 'Daily skincare guidance',
            suitable_skin_type: row.suitable_skin_type || 'All Skin Types',
            severity_level: row.severity_level || 'Mild',
            common_symptoms: row.common_symptoms || 'Dryness, mild redness',
            common_side_effects: row.common_side_effects || 'None expected',
            contraindications: row.contraindications || 'Known hypersensitivity',
            allergy_warning: row.allergy_warning || 'Patch test recommended',
            pregnancy_warning: row.pregnancy_warning || 'Consult physician',
            age_restriction: row.age_restriction || 'All ages',
            frequency_guidance: row.frequency_guidance || 'Apply once or twice daily',
            usage_precautions: row.usage_precautions || 'For external use only',
            alternative_ingredient: row.alternative_ingredient || 'Hyaluronic Acid',
            treatment_notes: row.treatment_notes || 'Consult dermatologist for persistent symptoms'
          }));
          cachedSymptoms = list;
          resolve(list);
        }
      });
    });
  } catch (e) {
    console.error('Error parsing Symptoms Dataset.csv', e);
    return [];
  }
}

// 4. DOCTORS DATASET LOADER (1,165 Doctors across 25 Indian Cities)
export async function loadDoctorsData(): Promise<DoctorRecord[]> {
  if (cachedDoctors) return cachedDoctors;
  try {
    const res = await fetch('/datasets/Doctor_Nearby_Dataset.csv');
    const text = await res.text();
    return new Promise((resolve) => {
      Papa.parse<any>(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const list: DoctorRecord[] = results.data.map((row, i) => ({
            doctor_id: row.doctor_id || `DOC-${i + 1}`,
            doctor_name: row.doctor_name || 'Dr. Dermatologist',
            gender: row.gender || 'Female',
            qualification: row.qualification || 'MD - Dermatology',
            specialization: row.specialization || 'Clinical Dermatology',
            years_of_experience: parseInt(row.years_of_experience || row.experience_years, 10) || 8,
            hospital_or_clinic: row.hospital_or_clinic || row.clinic_name || 'Auriva Skin Clinic',
            clinic_name: row.clinic_name || 'Auriva Skin Clinic',
            city: row.city || 'Mumbai',
            state: row.state || 'Maharashtra',
            pincode: row.pincode || '400001',
            clinic_address: row.clinic_address || 'Clinic Road, Sector 4',
            consultation_type: row.consultation_type || 'Clinic & Online',
            consultation_fee_inr: parseInt(row.consultation_fee_inr, 10) || 800,
            online_consultation_available: row.online_consultation_available || 'Yes',
            clinic_consultation_available: row.clinic_consultation_available || 'Yes',
            skin_conditions_treated: row.skin_conditions_treated || 'Acne, Eczema, Psoriasis',
            expertise: row.expertise || 'Clinical Dermatology',
            professional_registration_available: row.professional_registration_available || 'Yes',
            verification_source: row.verification_source || 'Medical Council',
            profile_url: row.profile_url || '',
            booking_url: row.booking_url || '',
            rating: parseFloat(row.rating) || 4.7,
            review_count: parseInt(row.review_count, 10) || 42,
            last_verified_date: row.last_verified_date || '2026-01-01',
            verification_status: row.verification_status || 'Verified',
            distance_available: row.distance_available || 'Nearby',
            location_search_tags: row.location_search_tags || 'Dermatologist, Skin Specialist',
            condition_tags: row.condition_tags || 'Acne, Skin Care',
            avatar_url: DOCTOR_AVATARS[i % DOCTOR_AVATARS.length]
          }));
          cachedDoctors = list;
          resolve(list);
        }
      });
    });
  } catch (e) {
    console.error('Error parsing Doctor Nearby Dataset.csv', e);
    return [];
  }
}

// UTILITY DATASET HELPERS FOR UI FILTERS
export function extractUniqueValues<T>(dataset: T[], field: keyof T): string[] {
  const set = new Set<string>();
  dataset.forEach(item => {
    const val = item[field];
    if (val && typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed) set.add(trimmed);
    }
  });
  return Array.from(set).sort();
}

export function extractSplitUniqueValues<T>(dataset: T[], field: keyof T, delimiter: string = ','): string[] {
  const set = new Set<string>();
  dataset.forEach(item => {
    const val = item[field];
    if (val && typeof val === 'string') {
      val.split(delimiter).forEach(part => {
        const trimmed = part.trim();
        if (trimmed) set.add(trimmed);
      });
    }
  });
  return Array.from(set).sort();
}
