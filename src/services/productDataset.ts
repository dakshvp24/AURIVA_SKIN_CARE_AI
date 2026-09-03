import Papa from 'papaparse';
import { ProductRecord } from '../types';
import { lookupVerifiedProduct } from './productImageCatalog';

let cachedProducts: ProductRecord[] | null = null;

export async function loadProductDataset(): Promise<ProductRecord[]> {
  if (cachedProducts && cachedProducts.length > 0) {
    return cachedProducts;
  }

  try {
    const response = await fetch('/datasets/Product_Dataset.csv');
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const csvText = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse<any>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedProducts: ProductRecord[] = results.data.map((row, index) => {
            const category = row.product_category || 'Serum';
            const pName = row.product_name || `Skincare Product ${index + 1}`;
            const pId = row.product_id || `DERMA-${index + 1}`;

            // Strict 1-to-1 Verified Reference Image Lookup
            // Never randomly assign, substitute, or guess product images
            const verified = lookupVerifiedProduct(pName) || lookupVerifiedProduct(pId);
            const verifiedImg = verified.isFound ? verified.verifiedImageUrl : undefined;
            const verifiedUse = verified.isFound ? verified.existingProductUse : undefined;

            return {
              product_id: pId,
              product_name: pName,
              brand_name: row.brand_name || 'Auriva Skincare',
              product_category: category,
              skin_type: row.skin_type || 'All Skin Types',
              skin_concern: row.skin_concern || 'General Skincare',
              sensitivity_level: row.sensitivity_level || 'Medium',
              key_ingredients: row.key_ingredients || 'Botanical Extracts, Hyaluronic Acid',
              ingredients_to_avoid: row.ingredients_to_avoid || 'None',
              fragrance_free: row.fragrance_free || 'Yes',
              non_comedogenic: row.non_comedogenic || 'Yes',
              price_inr: parseFloat(row.price_inr) || 890,
              rating: parseFloat(row.rating) || 4.7,
              availability: row.availability || 'Available',
              recommendation_score: parseInt(row.recommendation_score, 10) || 92,
              image_url: verifiedImg,
              product_use: verifiedUse
            };
          });

          cachedProducts = parsedProducts;
          resolve(parsedProducts);
        },
        error: () => {
          resolve(getFallbackProducts());
        }
      });
    });
  } catch (err) {
    console.warn('Using bundled fallback products', err);
    return getFallbackProducts();
  }
}

export function getFallbackProducts(): ProductRecord[] {
  return [
    {
      product_id: 'IN-SKIN-0001',
      product_name: 'Himalaya Purifying Neem Face Wash',
      brand_name: 'Himalaya',
      product_category: 'Face Wash / Cleanser',
      skin_type: 'Oily, Acne-Prone',
      skin_concern: 'Active Acne & Pimples',
      sensitivity_level: 'Low',
      key_ingredients: 'Neem, Turmeric',
      ingredients_to_avoid: 'None',
      fragrance_free: 'Yes',
      non_comedogenic: 'Yes',
      price_inr: 180,
      rating: 4.5,
      availability: 'In Stock',
      recommendation_score: 95,
      image_url: '/static/images/products/himalaya-purifying-neem-face-wash.jpg',
      product_use: 'Used to target active acne breakouts, unclog pores, and calm blemishes.'
    },
    {
      product_id: 'IN-SKIN-0043',
      product_name: 'Minimalist Salicylic Acid 2% Face Serum',
      brand_name: 'Minimalist',
      product_category: 'Face Serum',
      skin_type: 'Oily, Acne-Prone',
      skin_concern: 'Active Acne & Blemishes',
      sensitivity_level: 'Medium',
      key_ingredients: '2% Salicylic Acid, Oligopeptide, Aloe Vera',
      ingredients_to_avoid: 'None',
      fragrance_free: 'Yes',
      non_comedogenic: 'Yes',
      price_inr: 549,
      rating: 4.8,
      availability: 'In Stock',
      recommendation_score: 98,
      image_url: '/static/images/products/minimalist-salicylic-acid-2-face-serum.jpg',
      product_use: 'Used to target active acne breakouts, unclog pores, and calm blemishes.'
    }
  ];
}
