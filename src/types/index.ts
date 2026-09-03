// Types strictly driven by the 4 datasets

export interface ProductRecord {
  product_id: string;
  product_name: string;
  brand_name: string;
  product_category: string;
  skin_type: string;
  skin_concern: string;
  sensitivity_level: string;
  key_ingredients: string;
  ingredients_to_avoid: string;
  fragrance_free: string;
  non_comedogenic: string;
  price_inr?: number;
  rating: number;
  availability: string;
  recommendation_score: number;
  image_url?: string;
  product_use?: string;
  product_url?: string;
  amazon_url?: string;
  flipkart_url?: string;
  myntra_url?: string;
  product_description?: string;
  usage_instructions?: string;
}

export type Product = ProductRecord;
export type SkinType = string;
export type SeverityLevel = string;

export interface SkinRecord {
  user_id: string;
  age: number;
  gender: string;
  skin_type: string;
  sensitivity_level: string;
  primary_concern: string;
  secondary_concern: string;
  symptom_redness: number;
  symptom_itching: number;
  symptom_flaking: number;
  symptom_breakouts: number;
  symptom_scaling: number;
  symptom_oiliness: number;
  symptom_dry_patches: number;
  target_condition: string;
}

export interface SymptomTreatmentRecord {
  medicine_id: string;
  skin_condition: string;
  treatment_category: string;
  active_ingredient: string;
  medicine_form: string;
  common_use: string;
  suitable_skin_type: string;
  severity_level: string;
  common_symptoms: string;
  common_side_effects: string;
  contraindications: string;
  allergy_warning: string;
  pregnancy_warning: string;
  age_restriction: string;
  frequency_guidance: string;
  usage_precautions: string;
  alternative_ingredient: string;
  treatment_notes: string;
}

export interface DoctorRecord {
  doctor_id: string;
  doctor_name: string;
  gender: string;
  qualification: string;
  specialization: string;
  years_of_experience: number;
  hospital_or_clinic: string;
  city: string;
  state: string;
  pincode: number | string;
  clinic_address: string;
  consultation_type: string;
  consultation_fee_inr: number;
  online_consultation_available: string;
  clinic_consultation_available: string;
  skin_conditions_treated: string;
  expertise: string;
  professional_registration_available: string;
  verification_source: string;
  profile_url: string;
  booking_url: string;
  rating: number;
  review_count: number;
  last_verified_date: string;
  verification_status: string;
  distance_available: string;
  location_search_tags: string;
  condition_tags: string;
  avatar_url?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  address?: string;
  skinType?: string;
  avatarUrl?: string;
  ageRange?: string;
  gender?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SkinProfile {
  skinType: string;
  oiliness: string;
  dryness: string;
  sensitivity: string;
  allergies: string[];
  mainConcerns: string[];
  profileCompleted: boolean;
  updatedAt: string;
}

export interface AssessmentInput {
  skinType: string;
  symptoms: string[];
  duration?: string;
  severity?: string;
  sensitivity?: string;
  location?: string;
  characteristics?: {
    oiliness: string;
    dryness: string;
    sensitivity: string;
  };
}

export type AssessmentRequest = AssessmentInput;

export interface AssessmentResult {
  id: string;
  createdAt: string;
  completedAt?: string;
  request: AssessmentInput;
  possibleConcern: string;
  confidenceScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  explanation: string;
  suggestedIngredients: string[];
  ingredientsToAvoid: string[];
  generalGuidance?: string[];
  matchingTreatments?: SymptomTreatmentRecord[];
  matchingProducts?: ProductRecord[];
  allergyWarnings?: string[];
  isMLPending?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isDisclaimer?: boolean;
}

export interface RoutineTrackerDay {
  day: 'Su' | 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa';
  dateLabel: string;
  productUsed: boolean;
  productName?: string;
  skinDiaryEntry?: string;
  progressLevel: number;
}

export interface MLModelMetrics {
  accuracy: number;
  f1_score: number;
  precision: number;
  recall: number;
  confusion_matrix: number[][];
  classes: string[];
  total_samples: number;
}

export interface VisibleCharacteristicScore {
  name: string;
  level: 'Low' | 'Moderate' | 'High';
  description: string;
}

export interface SkinScanAnalysisResult {
  estimatedSkinType: 'Oily' | 'Dry' | 'Combination' | 'Normal' | 'Sensitive Appearance';
  confidence: 'Moderate' | 'High';
  profileCorrelation: string;
  isProfileConsistent: boolean;
  characteristics: VisibleCharacteristicScore[];
  summaryText: string;
  recommendedConcerns: string[];
}

export interface SkinScanRecord {
  id: string;
  user_id: string;
  image_url: string;
  estimated_skin_type: string;
  analysis_result: SkinScanAnalysisResult;
  created_at: string;
}
