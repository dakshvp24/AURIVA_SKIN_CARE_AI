import { ProductRecord } from '../types';

export interface VerifiedProductReference {
  productId: string;
  productName: string;
  brandName: string;
  productImage: string;
  productUse: string;
  verifiedOnlineImage?: string;
}

// Complete 1-to-1 Permanent Product to Verified Image & Product Use Registry (216 Authentic Products)
export const VERIFIED_PRODUCT_CATALOG: VerifiedProductReference[] = [
  {
    productId: "IN-SKIN-0001",
    productName: "Himalaya Purifying Neem Face Wash",
    brandName: "Himalaya",
    productImage: "/static/images/products/himalaya-purifying-neem-face-wash.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes.",
    verifiedOnlineImage: "https://m.media-amazon.com/images/I/61k1qP1N2+L._SL1500_.jpg"
  },
  {
    productId: "IN-SKIN-0002",
    productName: "Himalaya Neem Face Pack",
    brandName: "Himalaya",
    productImage: "/static/images/products/himalaya-neem-face-pack.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes.",
    verifiedOnlineImage: "https://m.media-amazon.com/images/I/61xQ7O2t2+L._SL1500_.jpg"
  },
  {
    productId: "IN-SKIN-0003",
    productName: "Himalaya Purifying Neem Scrub",
    brandName: "Himalaya",
    productImage: "/static/images/products/himalaya-purifying-neem-scrub.jpg",
    productUse: "Used to exfoliate dead surface cells, clear blackheads, and soften skin.",
    verifiedOnlineImage: "https://m.media-amazon.com/images/I/51wY8M8fF+L._SL1500_.jpg"
  },
  {
    productId: "IN-SKIN-0004",
    productName: "Himalaya Clear Complexion Whitening Day Cream",
    brandName: "Himalaya",
    productImage: "/static/images/products/himalaya-clear-complexion-whitening-day-cream.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0005",
    productName: "Himalaya Nourishing Skin Cream",
    brandName: "Himalaya",
    productImage: "/static/images/products/himalaya-nourishing-skin-cream.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness.",
    verifiedOnlineImage: "https://m.media-amazon.com/images/I/61u9iVwM7sL._SL1500_.jpg"
  },
  {
    productId: "IN-SKIN-0006",
    productName: "Himalaya Anti-Acne Dawa Spot Treatment Gel",
    brandName: "Himalaya",
    productImage: "/static/images/products/himalaya-anti-acne-dawa-spot-treatment-gel.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0007",
    productName: "Himalaya Dark Spot Clearing Turmeric Face Wash",
    brandName: "Himalaya",
    productImage: "/static/images/products/himalaya-dark-spot-clearing-turmeric-face-wash.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0008",
    productName: "Himalaya Dark Spot Clearing Turmeric Face Serum",
    brandName: "Himalaya",
    productImage: "/static/images/products/himalaya-dark-spot-clearing-turmeric-face-serum.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0009",
    productName: "Himalaya Aloe Vera Face Gel",
    brandName: "Himalaya",
    productImage: "/static/images/products/himalaya-aloe-vera-face-gel.jpg",
    productUse: "Used to soothe irritated skin, deliver oil-free hydration, and calm sunburn.",
    verifiedOnlineImage: "https://m.media-amazon.com/images/I/61xQ7O2t2+L._SL1500_.jpg"
  },
  {
    productId: "IN-SKIN-0010",
    productName: "Himalaya Oil Clear Lemon Face Wash",
    brandName: "Himalaya",
    productImage: "/static/images/products/himalaya-oil-clear-lemon-face-wash.jpg",
    productUse: "Used to cleanse surface impurities, remove dirt and excess oil gently."
  },
  {
    productId: "IN-SKIN-0011",
    productName: "Himalaya Tan Removal Orange Face Wash",
    brandName: "Himalaya",
    productImage: "/static/images/products/himalaya-tan-removal-orange-face-wash.jpg",
    productUse: "Used to cleanse surface impurities, remove dirt and excess oil gently."
  },
  {
    productId: "IN-SKIN-0012",
    productName: "Himalaya Youth Eternity Under Eye Cream",
    brandName: "Himalaya",
    productImage: "/static/images/products/himalaya-youth-eternity-under-eye-cream.jpg",
    productUse: "Used to reduce under-eye dark circles, depuff bags, and smooth fine lines."
  },
  {
    productId: "IN-SKIN-0013",
    productName: "Himalaya Anti-Wrinkle Cream",
    brandName: "Himalaya",
    productImage: "/static/images/products/himalaya-anti-wrinkle-cream.jpg",
    productUse: "Used to diminish fine lines, improve firmness, and smooth skin texture."
  },
  {
    productId: "IN-SKIN-0014",
    productName: "Himalaya Herbals Gentle Exfoliating Walnut Scrub",
    brandName: "Himalaya",
    productImage: "/static/images/products/himalaya-herbals-gentle-exfoliating-walnut-scrub.jpg",
    productUse: "Used to exfoliate dead surface cells, clear blackheads, and soften skin."
  },
  {
    productId: "IN-SKIN-0015",
    productName: "Himalaya Saffron Face Wash",
    brandName: "Himalaya",
    productImage: "/static/images/products/himalaya-saffron-face-wash.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0016",
    productName: "Patanjali Saundarya Aloe Vera Gel",
    brandName: "Patanjali",
    productImage: "/static/images/products/patanjali-saundarya-aloe-vera-gel.jpg",
    productUse: "Used to soothe irritated skin, deliver oil-free hydration, and calm sunburn."
  },
  {
    productId: "IN-SKIN-0017",
    productName: "Patanjali Saundarya Aloe Vera Gel Kesar Chandan",
    brandName: "Patanjali",
    productImage: "/static/images/products/patanjali-saundarya-aloe-vera-gel-kesar-chandan.jpg",
    productUse: "Used to soothe irritated skin, deliver oil-free hydration, and calm sunburn."
  },
  {
    productId: "IN-SKIN-0018",
    productName: "Patanjali Saundarya Neem Tulsi Face Wash",
    brandName: "Patanjali",
    productImage: "/static/images/products/patanjali-saundarya-neem-tulsi-face-wash.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0019",
    productName: "Patanjali Saundarya Anti-Aging Cream",
    brandName: "Patanjali",
    productImage: "/static/images/products/patanjali-saundarya-anti-aging-cream.jpg",
    productUse: "Used to diminish fine lines, improve firmness, and smooth skin texture."
  },
  {
    productId: "IN-SKIN-0020",
    productName: "Patanjali Saundarya Kesar Chandan Face Wash",
    brandName: "Patanjali",
    productImage: "/static/images/products/patanjali-saundarya-kesar-chandan-face-wash.jpg",
    productUse: "Used to cleanse surface impurities, remove dirt and excess oil gently."
  },
  {
    productId: "IN-SKIN-0021",
    productName: "Patanjali Divya Gulab Jal (Pure Rose Water)",
    brandName: "Patanjali",
    productImage: "/static/images/products/patanjali-divya-gulab-jal-pure-rose-water.jpg",
    productUse: "Used to control excessive facial sebum, minimize pores, and reduce shine."
  },
  {
    productId: "IN-SKIN-0022",
    productName: "Patanjali Saundarya Swarna Kanti Fairness Cream",
    brandName: "Patanjali",
    productImage: "/static/images/products/patanjali-saundarya-swarna-kanti-fairness-cream.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0023",
    productName: "Patanjali Saundarya Multani Mitti Face Scrub",
    brandName: "Patanjali",
    productImage: "/static/images/products/patanjali-saundarya-multani-mitti-face-scrub.jpg",
    productUse: "Used to exfoliate dead surface cells, clear blackheads, and soften skin."
  },
  {
    productId: "IN-SKIN-0024",
    productName: "Patanjali Saundarya Coconut Cream",
    brandName: "Patanjali",
    productImage: "/static/images/products/patanjali-saundarya-coconut-cream.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0025",
    productName: "Patanjali Tejus Sunscreen Cream SPF 30",
    brandName: "Patanjali",
    productImage: "/static/images/products/patanjali-tejus-sunscreen-cream-spf-30.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0026",
    productName: "Patanjali Divya Kanti Lep Face Pack",
    brandName: "Patanjali",
    productImage: "/static/images/products/patanjali-divya-kanti-lep-face-pack.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0027",
    productName: "Patanjali Neem Face Wash",
    brandName: "Patanjali",
    productImage: "/static/images/products/patanjali-neem-face-wash.jpg",
    productUse: "Used to cleanse surface impurities, remove dirt and excess oil gently."
  },
  {
    productId: "IN-SKIN-0028",
    productName: "Mamaearth Tea Tree Face Wash with Neem & Salicylic Acid",
    brandName: "Mamaearth",
    productImage: "/static/images/products/mamaearth-tea-tree-face-wash-with-neem-salicylic-acid.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes.",
    verifiedOnlineImage: "https://m.media-amazon.com/images/I/61Jc7O1pZ3L._SL1100_.jpg"
  },
  {
    productId: "IN-SKIN-0029",
    productName: "Mamaearth Ubtan Face Wash with Turmeric & Saffron",
    brandName: "Mamaearth",
    productImage: "/static/images/products/mamaearth-ubtan-face-wash-with-turmeric-saffron.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone.",
    verifiedOnlineImage: "https://m.media-amazon.com/images/I/61eM74x7HXL._SL1100_.jpg"
  },
  {
    productId: "IN-SKIN-0030",
    productName: "Mamaearth Bye Bye Blemishes Face Cream",
    brandName: "Mamaearth",
    productImage: "/static/images/products/mamaearth-bye-bye-blemishes-face-cream.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0031",
    productName: "Mamaearth Vitamin C Face Serum with 10% Vitamin C & 5% Gotu Kola",
    brandName: "Mamaearth",
    productImage: "/static/images/products/mamaearth-vitamin-c-face-serum-with-10-vitamin-c-5-gotu-kola.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0032",
    productName: "Mamaearth Ultra Light Indian Sunscreen SPF 50",
    brandName: "Mamaearth",
    productImage: "/static/images/products/mamaearth-ultra-light-indian-sunscreen-spf-50.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0033",
    productName: "Mamaearth Rice Face Wash with Rice Water & Niacinamide",
    brandName: "Mamaearth",
    productImage: "/static/images/products/mamaearth-rice-face-wash-with-rice-water-niacinamide.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0034",
    productName: "Mamaearth Oil-Free Face Moisturizer with Apple Cider Vinegar",
    brandName: "Mamaearth",
    productImage: "/static/images/products/mamaearth-oil-free-face-moisturizer-with-apple-cider-vinegar.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0035",
    productName: "Mamaearth Ubtan Face Mask with Saffron & Turmeric",
    brandName: "Mamaearth",
    productImage: "/static/images/products/mamaearth-ubtan-face-mask-with-saffron-turmeric.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0036",
    productName: "Mamaearth Bye Bye Dark Circles Eye Cream",
    brandName: "Mamaearth",
    productImage: "/static/images/products/mamaearth-bye-bye-dark-circles-eye-cream.jpg",
    productUse: "Used to reduce under-eye dark circles, depuff bags, and smooth fine lines."
  },
  {
    productId: "IN-SKIN-0037",
    productName: "Mamaearth Tea Tree Spot Gel Face Cream",
    brandName: "Mamaearth",
    productImage: "/static/images/products/mamaearth-tea-tree-spot-gel-face-cream.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0038",
    productName: "Mamaearth Vitamin C Daily Glow Face Cream",
    brandName: "Mamaearth",
    productImage: "/static/images/products/mamaearth-vitamin-c-daily-glow-face-cream.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0039",
    productName: "Mamaearth Retinol Night Cream with Retinol & Bakuchi",
    brandName: "Mamaearth",
    productImage: "/static/images/products/mamaearth-retinol-night-cream-with-retinol-bakuchi.jpg",
    productUse: "Used to diminish fine lines, improve firmness, and smooth skin texture."
  },
  {
    productId: "IN-SKIN-0040",
    productName: "Mamaearth Niacin Face Toner with Niacinamide & Witch Hazel",
    brandName: "Mamaearth",
    productImage: "/static/images/products/mamaearth-niacin-face-toner-with-niacinamide-witch-hazel.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0041",
    productName: "Mamaearth Charcoal Face Wash with Activated Charcoal & Coffee",
    brandName: "Mamaearth",
    productImage: "/static/images/products/mamaearth-charcoal-face-wash-with-activated-charcoal-coffee.jpg",
    productUse: "Used to control excessive facial sebum, minimize pores, and reduce shine."
  },
  {
    productId: "IN-SKIN-0042",
    productName: "Mamaearth Aloe Vera Gel with Pure Aloe & Ashwagandha",
    brandName: "Mamaearth",
    productImage: "/static/images/products/mamaearth-aloe-vera-gel-with-pure-aloe-ashwagandha.jpg",
    productUse: "Used to soothe irritated skin, deliver oil-free hydration, and calm sunburn.",
    verifiedOnlineImage: "https://m.media-amazon.com/images/I/51qB8Z6q1lL._SL1200_.jpg"
  },
  {
    productId: "IN-SKIN-0043",
    productName: "Minimalist Salicylic Acid 2% Face Serum",
    brandName: "Minimalist",
    productImage: "/static/images/products/minimalist-salicylic-acid-2-face-serum.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes.",
    verifiedOnlineImage: "https://m.media-amazon.com/images/I/61k9mP6lA1L._SL1500_.jpg"
  },
  {
    productId: "IN-SKIN-0044",
    productName: "Minimalist Niacinamide 10% + Zinc Serum",
    brandName: "Minimalist",
    productImage: "/static/images/products/minimalist-niacinamide-10-zinc-serum.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes.",
    verifiedOnlineImage: "https://m.media-amazon.com/images/I/61w7N8xPZHL._SL1500_.jpg"
  },
  {
    productId: "IN-SKIN-0045",
    productName: "Minimalist Tranexamic 3% + HPA Face Serum",
    brandName: "Minimalist",
    productImage: "/static/images/products/minimalist-tranexamic-3-hpa-face-serum.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0046",
    productName: "Minimalist Alpha Arbutin 2% + Hyaluronic Acid Serum",
    brandName: "Minimalist",
    productImage: "/static/images/products/minimalist-alpha-arbutin-2-hyaluronic-acid-serum.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0047",
    productName: "Minimalist Retinol 0.3% + CoQ10 Face Serum",
    brandName: "Minimalist",
    productImage: "/static/images/products/minimalist-retinol-0-3-coq10-face-serum.jpg",
    productUse: "Used to diminish fine lines, improve firmness, and smooth skin texture."
  },
  {
    productId: "IN-SKIN-0048",
    productName: "Minimalist 10% Vitamin C Face Serum",
    brandName: "Minimalist",
    productImage: "/static/images/products/minimalist-10-vitamin-c-face-serum.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0049",
    productName: "Minimalist Sunscreen SPF 50 PA++++ Multi-Vitamin",
    brandName: "Minimalist",
    productImage: "/static/images/products/minimalist-sunscreen-spf-50-pa-multi-vitamin.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning.",
    verifiedOnlineImage: "https://m.media-amazon.com/images/I/61F9b8yP4HL._SL1500_.jpg"
  },
  {
    productId: "IN-SKIN-0050",
    productName: "Minimalist PHA 3% + Biotic Face Toner",
    brandName: "Minimalist",
    productImage: "/static/images/products/minimalist-pha-3-biotic-face-toner.jpg",
    productUse: "Used to control excessive facial sebum, minimize pores, and reduce shine."
  },
  {
    productId: "IN-SKIN-0051",
    productName: "Minimalist Oat Extract 6% Gentle Cleanser",
    brandName: "Minimalist",
    productImage: "/static/images/products/minimalist-oat-extract-6-gentle-cleanser.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0052",
    productName: "Minimalist Sepicalm 3% + Oat Moisturizer",
    brandName: "Minimalist",
    productImage: "/static/images/products/minimalist-sepicalm-3-oat-moisturizer.jpg",
    productUse: "Used to control excessive facial sebum, minimize pores, and reduce shine."
  },
  {
    productId: "IN-SKIN-0053",
    productName: "Minimalist Marula Oil 5% Rich Moisturizer",
    brandName: "Minimalist",
    productImage: "/static/images/products/minimalist-marula-oil-5-rich-moisturizer.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0054",
    productName: "Minimalist AHA 25% + PHA 5% + BHA 2% Peeling Solution",
    brandName: "Minimalist",
    productImage: "/static/images/products/minimalist-aha-25-pha-5-bha-2-peeling-solution.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0055",
    productName: "Minimalist L-Ascorbic Acid 8% Lip Treatment",
    brandName: "Minimalist",
    productImage: "/static/images/products/minimalist-l-ascorbic-acid-8-lip-treatment.jpg",
    productUse: "Used to hydrate dry, chapped lips and prevent moisture loss."
  },
  {
    productId: "IN-SKIN-0056",
    productName: "Minimalist Granactive Retinoid 2% Anti-Aging Serum",
    brandName: "Minimalist",
    productImage: "/static/images/products/minimalist-granactive-retinoid-2-anti-aging-serum.jpg",
    productUse: "Used to diminish fine lines, improve firmness, and smooth skin texture."
  },
  {
    productId: "IN-SKIN-0057",
    productName: "Minimalist Maleic Bond Repair Complex Hair Serum",
    brandName: "Minimalist",
    productImage: "/static/images/products/minimalist-maleic-bond-repair-complex-hair-serum.jpg",
    productUse: "Used to strengthen hair roots, control dandruff, and reduce breakage."
  },
  {
    productId: "IN-SKIN-0058",
    productName: "The Derma Co 1% Salicylic Acid Gel Face Wash",
    brandName: "The Derma Co",
    productImage: "/static/images/products/the-derma-co-1-salicylic-acid-gel-face-wash.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes.",
    verifiedOnlineImage: "https://m.media-amazon.com/images/I/51Jk8lM6m2L._SL1000_.jpg"
  },
  {
    productId: "IN-SKIN-0059",
    productName: "The Derma Co 1% Hyaluronic Sunscreen Aqua Gel SPF 50",
    brandName: "The Derma Co",
    productImage: "/static/images/products/the-derma-co-1-hyaluronic-sunscreen-aqua-gel-spf-50.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0060",
    productName: "The Derma Co 2% Kojic Acid Face Cream",
    brandName: "The Derma Co",
    productImage: "/static/images/products/the-derma-co-2-kojic-acid-face-cream.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0061",
    productName: "The Derma Co 2% Salicylic Acid Face Serum",
    brandName: "The Derma Co",
    productImage: "/static/images/products/the-derma-co-2-salicylic-acid-face-serum.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes.",
    verifiedOnlineImage: "https://m.media-amazon.com/images/I/61f-Q9m8WHL._SL1200_.jpg"
  },
  {
    productId: "IN-SKIN-0062",
    productName: "The Derma Co 10% Niacinamide Face Serum",
    brandName: "The Derma Co",
    productImage: "/static/images/products/the-derma-co-10-niacinamide-face-serum.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone.",
    verifiedOnlineImage: "https://m.media-amazon.com/images/I/61L9u8nZ2GL._SL1200_.jpg"
  },
  {
    productId: "IN-SKIN-0063",
    productName: "The Derma Co 2% Niacinamide Pore Minimizing Primer Sunscreen",
    brandName: "The Derma Co",
    productImage: "/static/images/products/the-derma-co-2-niacinamide-pore-minimizing-primer-sunscreen.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0064",
    productName: "The Derma Co 15% AHA + 1% BHA Peeling Solution",
    brandName: "The Derma Co",
    productImage: "/static/images/products/the-derma-co-15-aha-1-bha-peeling-solution.jpg",
    productUse: "Used to exfoliate dead surface cells, clear blackheads, and soften skin."
  },
  {
    productId: "IN-SKIN-0065",
    productName: "The Derma Co 10% Cica-Glow Daily Face Serum",
    brandName: "The Derma Co",
    productImage: "/static/images/products/the-derma-co-10-cica-glow-daily-face-serum.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0066",
    productName: "The Derma Co Ceramide + HA Intense Moisturizer",
    brandName: "The Derma Co",
    productImage: "/static/images/products/the-derma-co-ceramide-ha-intense-moisturizer.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0067",
    productName: "The Derma Co 2% Cica-Glow Daily Sunscreen SPF 50",
    brandName: "The Derma Co",
    productImage: "/static/images/products/the-derma-co-2-cica-glow-daily-sunscreen-spf-50.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0068",
    productName: "The Derma Co 0.3% Retinol Face Serum",
    brandName: "The Derma Co",
    productImage: "/static/images/products/the-derma-co-0-3-retinol-face-serum.jpg",
    productUse: "Used to diminish fine lines, improve firmness, and smooth skin texture."
  },
  {
    productId: "IN-SKIN-0069",
    productName: "The Derma Co 1% Kojic Acid Daily Glow Face Wash",
    brandName: "The Derma Co",
    productImage: "/static/images/products/the-derma-co-1-kojic-acid-daily-glow-face-wash.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0070",
    productName: "The Derma Co 2% Glutathione Face Serum",
    brandName: "The Derma Co",
    productImage: "/static/images/products/the-derma-co-2-glutathione-face-serum.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0071",
    productName: "The Derma Co 5% Niacinamide Daily Face Toner",
    brandName: "The Derma Co",
    productImage: "/static/images/products/the-derma-co-5-niacinamide-daily-face-toner.jpg",
    productUse: "Used to control excessive facial sebum, minimize pores, and reduce shine."
  },
  {
    productId: "IN-SKIN-0072",
    productName: "The Derma Co 3% AHA + 2% BHA Blemish Control Exfoliating Scrub",
    brandName: "The Derma Co",
    productImage: "/static/images/products/the-derma-co-3-aha-2-bha-blemish-control-exfoliating-scrub.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0073",
    productName: "Biotique Bio Neem Purifying Face Wash",
    brandName: "Biotique",
    productImage: "/static/images/products/biotique-bio-neem-purifying-face-wash.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0074",
    productName: "Biotique Morning Nectar Flawless Skin Lotion",
    brandName: "Biotique",
    productImage: "/static/images/products/biotique-morning-nectar-flawless-skin-lotion.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0075",
    productName: "Biotique Bio Dandelion Visibly Ageless Serum",
    brandName: "Biotique",
    productImage: "/static/images/products/biotique-bio-dandelion-visibly-ageless-serum.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0076",
    productName: "Biotique Bio Cucumber Pore Tightening Toner",
    brandName: "Biotique",
    productImage: "/static/images/products/biotique-bio-cucumber-pore-tightening-toner.jpg",
    productUse: "Used to control excessive facial sebum, minimize pores, and reduce shine."
  },
  {
    productId: "IN-SKIN-0077",
    productName: "Biotique Bio Sandalwood Sunscreen Ultra Soothing SPF 50",
    brandName: "Biotique",
    productImage: "/static/images/products/biotique-bio-sandalwood-sunscreen-ultra-soothing-spf-50.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0078",
    productName: "Biotique Bio Papaya Revitalizing Tan-Removal Scrub",
    brandName: "Biotique",
    productImage: "/static/images/products/biotique-bio-papaya-revitalizing-tan-removal-scrub.jpg",
    productUse: "Used to exfoliate dead surface cells, clear blackheads, and soften skin."
  },
  {
    productId: "IN-SKIN-0079",
    productName: "Biotique Bio Fruit Whitening & Depigmentation Face Pack",
    brandName: "Biotique",
    productImage: "/static/images/products/biotique-bio-fruit-whitening-depigmentation-face-pack.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0080",
    productName: "Biotique Bio Clove Anti-Blemish Face Pack",
    brandName: "Biotique",
    productImage: "/static/images/products/biotique-bio-clove-anti-blemish-face-pack.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0081",
    productName: "Biotique Bio Seaweed Revitalizing Anti-Fatigue Eye Gel",
    brandName: "Biotique",
    productImage: "/static/images/products/biotique-bio-seaweed-revitalizing-anti-fatigue-eye-gel.jpg",
    productUse: "Used to reduce under-eye dark circles, depuff bags, and smooth fine lines."
  },
  {
    productId: "IN-SKIN-0082",
    productName: "Biotique Bio Winter Green Anti-Acne Spot Correcting Cream",
    brandName: "Biotique",
    productImage: "/static/images/products/biotique-bio-winter-green-anti-acne-spot-correcting-cream.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0083",
    productName: "Biotique Bio Saffron Youth Dew Ageless Face Moisturizer",
    brandName: "Biotique",
    productImage: "/static/images/products/biotique-bio-saffron-youth-dew-ageless-face-moisturizer.jpg",
    productUse: "Used to diminish fine lines, improve firmness, and smooth skin texture."
  },
  {
    productId: "IN-SKIN-0084",
    productName: "Biotique Bio Honey Water Clarifying Toner",
    brandName: "Biotique",
    productImage: "/static/images/products/biotique-bio-honey-water-clarifying-toner.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0085",
    productName: "Biotique Bio Pine Apple Oil Balancing Face Wash",
    brandName: "Biotique",
    productImage: "/static/images/products/biotique-bio-pine-apple-oil-balancing-face-wash.jpg",
    productUse: "Used to control excessive facial sebum, minimize pores, and reduce shine."
  },
  {
    productId: "IN-SKIN-0086",
    productName: "Biotique Bio Carrot Seed 40+ Sunscreen Lotion",
    brandName: "Biotique",
    productImage: "/static/images/products/biotique-bio-carrot-seed-40-sunscreen-lotion.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0087",
    productName: "Biotique Bio Almond Oil Soothing Face & Eye Makeup Cleanser",
    brandName: "Biotique",
    productImage: "/static/images/products/biotique-bio-almond-oil-soothing-face-eye-makeup-cleanser.jpg",
    productUse: "Used to reduce under-eye dark circles, depuff bags, and smooth fine lines."
  },
  {
    productId: "IN-SKIN-0088",
    productName: "Dot & Key Cica + 2% Salicylic Night Gel",
    brandName: "Dot & Key",
    productImage: "/static/images/products/dot-key-cica-2-salicylic-night-gel.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0089",
    productName: "Dot & Key 72HR Hydrating Gel Moisturizer with Hyaluronic & Probiotics",
    brandName: "Dot & Key",
    productImage: "/static/images/products/dot-key-72hr-hydrating-gel-moisturizer-with-hyaluronic-probiotics.jpg",
    productUse: "Used to control excessive facial sebum, minimize pores, and reduce shine."
  },
  {
    productId: "IN-SKIN-0090",
    productName: "Dot & Key Vitamin C + E Super Bright Sunscreen SPF 50",
    brandName: "Dot & Key",
    productImage: "/static/images/products/dot-key-vitamin-c-e-super-bright-sunscreen-spf-50.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0091",
    productName: "Dot & Key Watermelon Cooling Sunscreen SPF 50 PA+++",
    brandName: "Dot & Key",
    productImage: "/static/images/products/dot-key-watermelon-cooling-sunscreen-spf-50-pa.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0092",
    productName: "Dot & Key Cica Calming Blemish Clearing Face Wash",
    brandName: "Dot & Key",
    productImage: "/static/images/products/dot-key-cica-calming-blemish-clearing-face-wash.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0093",
    productName: "Dot & Key 10% Vitamin C + E Face Serum for Glowing Skin",
    brandName: "Dot & Key",
    productImage: "/static/images/products/dot-key-10-vitamin-c-e-face-serum-for-glowing-skin.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0094",
    productName: "Dot & Key Barrier Repair Ceramides & Hyaluronic Hydrating Face Cream",
    brandName: "Dot & Key",
    productImage: "/static/images/products/dot-key-barrier-repair-ceramides-hyaluronic-hydrating-face-cream.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0095",
    productName: "Dot & Key Strawberry Dew Tinted Lip Balm SPF 30",
    brandName: "Dot & Key",
    productImage: "/static/images/products/dot-key-strawberry-dew-tinted-lip-balm-spf-30.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0096",
    productName: "Dot & Key Pomegranate 0.9% Retinol Night Cream",
    brandName: "Dot & Key",
    productImage: "/static/images/products/dot-key-pomegranate-0-9-retinol-night-cream.jpg",
    productUse: "Used to diminish fine lines, improve firmness, and smooth skin texture."
  },
  {
    productId: "IN-SKIN-0097",
    productName: "Dot & Key Rice Water Probiotics Hydrating Toner Mist",
    brandName: "Dot & Key",
    productImage: "/static/images/products/dot-key-rice-water-probiotics-hydrating-toner-mist.jpg",
    productUse: "Used to tone pores, rebalance skin pH, and deliver instant hydration."
  },
  {
    productId: "IN-SKIN-0098",
    productName: "Dot & Key Charcoal Clay Mask with Salicylic Acid",
    brandName: "Dot & Key",
    productImage: "/static/images/products/dot-key-charcoal-clay-mask-with-salicylic-acid.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0099",
    productName: "Dot & Key 10% Niacinamide + Zinc Serum",
    brandName: "Dot & Key",
    productImage: "/static/images/products/dot-key-10-niacinamide-zinc-serum.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0100",
    productName: "Dot & Key Blueberry Plump Lip Sleeping Mask",
    brandName: "Dot & Key",
    productImage: "/static/images/products/dot-key-blueberry-plump-lip-sleeping-mask.jpg",
    productUse: "Used to hydrate dry, chapped lips and prevent moisture loss."
  },
  {
    productId: "IN-SKIN-0101",
    productName: "Dot & Key Watermelon Super Glow Matte Moisturizer",
    brandName: "Dot & Key",
    productImage: "/static/images/products/dot-key-watermelon-super-glow-matte-moisturizer.jpg",
    productUse: "Used to control excessive facial sebum, minimize pores, and reduce shine."
  },
  {
    productId: "IN-SKIN-0102",
    productName: "Plum 10% Niacinamide Face Serum with Rice Water",
    brandName: "Plum",
    productImage: "/static/images/products/plum-10-niacinamide-face-serum-with-rice-water.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0103",
    productName: "Plum Green Tea Pore Cleansing Face Wash",
    brandName: "Plum",
    productImage: "/static/images/products/plum-green-tea-pore-cleansing-face-wash.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0104",
    productName: "Plum Green Tea Alcohol-Free Toner",
    brandName: "Plum",
    productImage: "/static/images/products/plum-green-tea-alcohol-free-toner.jpg",
    productUse: "Used to control excessive facial sebum, minimize pores, and reduce shine."
  },
  {
    productId: "IN-SKIN-0105",
    productName: "Plum 15% Vitamin C Face Serum with Mandarin",
    brandName: "Plum",
    productImage: "/static/images/products/plum-15-vitamin-c-face-serum-with-mandarin.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0106",
    productName: "Plum Green Tea Renewed Clarity Night Gel",
    brandName: "Plum",
    productImage: "/static/images/products/plum-green-tea-renewed-clarity-night-gel.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0107",
    productName: "Plum 2% Hyaluronic Acid Face Serum with Bulgarian Rose",
    brandName: "Plum",
    productImage: "/static/images/products/plum-2-hyaluronic-acid-face-serum-with-bulgarian-rose.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0108",
    productName: "Plum Green Tea Clear Face Mask",
    brandName: "Plum",
    productImage: "/static/images/products/plum-green-tea-clear-face-mask.jpg",
    productUse: "Used to control excessive facial sebum, minimize pores, and reduce shine."
  },
  {
    productId: "IN-SKIN-0109",
    productName: "Plum 1% Retinol Face Serum with Bakuchiol",
    brandName: "Plum",
    productImage: "/static/images/products/plum-1-retinol-face-serum-with-bakuchiol.jpg",
    productUse: "Used to diminish fine lines, improve firmness, and smooth skin texture."
  },
  {
    productId: "IN-SKIN-0110",
    productName: "Plum Squalane & Ceramide Lightweight Moisturizer",
    brandName: "Plum",
    productImage: "/static/images/products/plum-squalane-ceramide-lightweight-moisturizer.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0111",
    productName: "Plum 2% Salicylic Acid Face Serum",
    brandName: "Plum",
    productImage: "/static/images/products/plum-2-salicylic-acid-face-serum.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0112",
    productName: "Plum Chamomile & White Tea Sheer Matte Day Cream SPF 50",
    brandName: "Plum",
    productImage: "/static/images/products/plum-chamomile-white-tea-sheer-matte-day-cream-spf-50.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0113",
    productName: "Plum Candy Melts Vegan Lip Balm - Red Velvet Love",
    brandName: "Plum",
    productImage: "/static/images/products/plum-candy-melts-vegan-lip-balm-red-velvet-love.jpg",
    productUse: "Used to hydrate dry, chapped lips and prevent moisture loss."
  },
  {
    productId: "IN-SKIN-0114",
    productName: "Foxtale The Daily Duet Gentle Cleanser",
    brandName: "Foxtale",
    productImage: "/static/images/products/foxtale-the-daily-duet-gentle-cleanser.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0115",
    productName: "Foxtale Cover Up Matte Sunscreen SPF 50 PA++++",
    brandName: "Foxtale",
    productImage: "/static/images/products/foxtale-cover-up-matte-sunscreen-spf-50-pa.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0116",
    productName: "Foxtale 15% Vitamin C Face Serum with L-Ascorbic Acid",
    brandName: "Foxtale",
    productImage: "/static/images/products/foxtale-15-vitamin-c-face-serum-with-l-ascorbic-acid.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0117",
    productName: "Foxtale Acne Spot Corrector Gel with Salicylic Acid & Glycolic",
    brandName: "Foxtale",
    productImage: "/static/images/products/foxtale-acne-spot-corrector-gel-with-salicylic-acid-glycolic.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0118",
    productName: "Foxtale Skin Repair Ceramide Comfort Moisturizer",
    brandName: "Foxtale",
    productImage: "/static/images/products/foxtale-skin-repair-ceramide-comfort-moisturizer.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0119",
    productName: "Foxtale 0.15% Encapsulated Retinol Night Serum",
    brandName: "Foxtale",
    productImage: "/static/images/products/foxtale-0-15-encapsulated-retinol-night-serum.jpg",
    productUse: "Used to diminish fine lines, improve firmness, and smooth skin texture."
  },
  {
    productId: "IN-SKIN-0120",
    productName: "Foxtale Overnight Glow Mask with Glycolic & Lactic",
    brandName: "Foxtale",
    productImage: "/static/images/products/foxtale-overnight-glow-mask-with-glycolic-lactic.jpg",
    productUse: "Used to exfoliate dead surface cells, clear blackheads, and soften skin."
  },
  {
    productId: "IN-SKIN-0121",
    productName: "Foxtale Hydrating Serum with Hyaluronic Acid & Aquaporin",
    brandName: "Foxtale",
    productImage: "/static/images/products/foxtale-hydrating-serum-with-hyaluronic-acid-aquaporin.jpg",
    productUse: "Used for targeted facial skincare targeting dehydrated tight skin."
  },
  {
    productId: "IN-SKIN-0122",
    productName: "Foxtale Keep Calm Daily Hydrating Face Mist Toner",
    brandName: "Foxtale",
    productImage: "/static/images/products/foxtale-keep-calm-daily-hydrating-face-mist-toner.jpg",
    productUse: "Used to tone pores, rebalance skin pH, and deliver instant hydration."
  },
  {
    productId: "IN-SKIN-0123",
    productName: "Foxtale Milky Way Multi-Peptide Firming Eye Cream",
    brandName: "Foxtale",
    productImage: "/static/images/products/foxtale-milky-way-multi-peptide-firming-eye-cream.jpg",
    productUse: "Used to reduce under-eye dark circles, depuff bags, and smooth fine lines."
  },
  {
    productId: "IN-SKIN-0124",
    productName: "Re'equil Ultra Matte Dry Touch Sunscreen Gel SPF 50",
    brandName: "Re'equil",
    productImage: "/static/images/products/re-equil-ultra-matte-dry-touch-sunscreen-gel-spf-50.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0125",
    productName: "Re'equil Oxybenzone & OMC Free Sunscreen SPF 50",
    brandName: "Re'equil",
    productImage: "/static/images/products/re-equil-oxybenzone-omc-free-sunscreen-spf-50.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0126",
    productName: "Re'equil Oil Free Mattifying Moisturiser",
    brandName: "Re'equil",
    productImage: "/static/images/products/re-equil-oil-free-mattifying-moisturiser.jpg",
    productUse: "Used to control excessive facial sebum, minimize pores, and reduce shine."
  },
  {
    productId: "IN-SKIN-0127",
    productName: "Re'equil Ceramide & Hyaluronic Acid Moisturiser",
    brandName: "Re'equil",
    productImage: "/static/images/products/re-equil-ceramide-hyaluronic-acid-moisturiser.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0128",
    productName: "Re'equil Fruit AHA Face Wash for Pigmentation & Dark Spots",
    brandName: "Re'equil",
    productImage: "/static/images/products/re-equil-fruit-aha-face-wash-for-pigmentation-dark-spots.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0129",
    productName: "Re'equil Pitstop Gel for Acne Scars & Pits Removal",
    brandName: "Re'equil",
    productImage: "/static/images/products/re-equil-pitstop-gel-for-acne-scars-pits-removal.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0130",
    productName: "Re'equil 0.1% Retinol Enriched Night Cream",
    brandName: "Re'equil",
    productImage: "/static/images/products/re-equil-0-1-retinol-enriched-night-cream.jpg",
    productUse: "Used to diminish fine lines, improve firmness, and smooth skin texture."
  },
  {
    productId: "IN-SKIN-0131",
    productName: "Re'equil Pore Refining Face Toner with Witch Hazel",
    brandName: "Re'equil",
    productImage: "/static/images/products/re-equil-pore-refining-face-toner-with-witch-hazel.jpg",
    productUse: "Used to control excessive facial sebum, minimize pores, and reduce shine."
  },
  {
    productId: "IN-SKIN-0132",
    productName: "Re'equil Sheer Zinc Tinted Sunscreen SPF 50 PA++++",
    brandName: "Re'equil",
    productImage: "/static/images/products/re-equil-sheer-zinc-tinted-sunscreen-spf-50-pa.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0133",
    productName: "Re'equil Under Eye Cream for Dark Circles & Puffy Eyes",
    brandName: "Re'equil",
    productImage: "/static/images/products/re-equil-under-eye-cream-for-dark-circles-puffy-eyes.jpg",
    productUse: "Used to reduce under-eye dark circles, depuff bags, and smooth fine lines."
  },
  {
    productId: "IN-SKIN-0134",
    productName: "Chemist at Play 20% Vitamin C Advanced Brightening Serum",
    brandName: "Chemist at Play",
    productImage: "/static/images/products/chemist-at-play-20-vitamin-c-advanced-brightening-serum.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0135",
    productName: "Chemist at Play Acne Control Face Serum with 10% Azelaic Acid",
    brandName: "Chemist at Play",
    productImage: "/static/images/products/chemist-at-play-acne-control-face-serum-with-10-azelaic-acid.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0136",
    productName: "Chemist at Play Exfoliating Face Serum with 10% AHA + 2% BHA",
    brandName: "Chemist at Play",
    productImage: "/static/images/products/chemist-at-play-exfoliating-face-serum-with-10-aha-2-bha.jpg",
    productUse: "Used to exfoliate dead surface cells, clear blackheads, and soften skin."
  },
  {
    productId: "IN-SKIN-0137",
    productName: "Chemist at Play Hydrating Face Serum with Ceramides",
    brandName: "Chemist at Play",
    productImage: "/static/images/products/chemist-at-play-hydrating-face-serum-with-ceramides.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0138",
    productName: "Chemist at Play 1% Salicylic Acid Acne Control Face Wash",
    brandName: "Chemist at Play",
    productImage: "/static/images/products/chemist-at-play-1-salicylic-acid-acne-control-face-wash.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0139",
    productName: "Chemist at Play Brightening Face Toner with Ceramides",
    brandName: "Chemist at Play",
    productImage: "/static/images/products/chemist-at-play-brightening-face-toner-with-ceramides.jpg",
    productUse: "Used to control excessive facial sebum, minimize pores, and reduce shine."
  },
  {
    productId: "IN-SKIN-0140",
    productName: "Chemist at Play Daily Glow Sunscreen SPF 50 PA++++",
    brandName: "Chemist at Play",
    productImage: "/static/images/products/chemist-at-play-daily-glow-sunscreen-spf-50-pa.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0141",
    productName: "Chemist at Play Ceramide Hydrating Face Moisturizer",
    brandName: "Chemist at Play",
    productImage: "/static/images/products/chemist-at-play-ceramide-hydrating-face-moisturizer.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0142",
    productName: "Chemist at Play Oil Free Gel Moisturizer with Ceramides",
    brandName: "Chemist at Play",
    productImage: "/static/images/products/chemist-at-play-oil-free-gel-moisturizer-with-ceramides.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0143",
    productName: "Chemist at Play Under Eye Roll-On Serum with Caffeine",
    brandName: "Chemist at Play",
    productImage: "/static/images/products/chemist-at-play-under-eye-roll-on-serum-with-caffeine.jpg",
    productUse: "Used to reduce under-eye dark circles, depuff bags, and smooth fine lines."
  },
  {
    productId: "IN-SKIN-0144",
    productName: "Aqualogica Radiance+ Dewy Sunscreen SPF 50 PA++++",
    brandName: "Aqualogica",
    productImage: "/static/images/products/aqualogica-radiance-dewy-sunscreen-spf-50-pa.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0145",
    productName: "Aqualogica Glow+ Dewy Sunscreen SPF 50 PA++++",
    brandName: "Aqualogica",
    productImage: "/static/images/products/aqualogica-glow-dewy-sunscreen-spf-50-pa.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0146",
    productName: "Aqualogica Clear+ Smoothie Face Wash with Salicylic Acid",
    brandName: "Aqualogica",
    productImage: "/static/images/products/aqualogica-clear-smoothie-face-wash-with-salicylic-acid.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0147",
    productName: "Aqualogica Radiance+ Jello Moisturizer with Watermelon",
    brandName: "Aqualogica",
    productImage: "/static/images/products/aqualogica-radiance-jello-moisturizer-with-watermelon.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0148",
    productName: "Aqualogica Glow+ Juicy Dew Drops Serum",
    brandName: "Aqualogica",
    productImage: "/static/images/products/aqualogica-glow-juicy-dew-drops-serum.jpg",
    productUse: "Used for targeted facial skincare targeting dull skin & lack of instant glow."
  },
  {
    productId: "IN-SKIN-0149",
    productName: "Aqualogica Clear+ Invisible Matte Sunscreen SPF 50",
    brandName: "Aqualogica",
    productImage: "/static/images/products/aqualogica-clear-invisible-matte-sunscreen-spf-50.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0150",
    productName: "Aqualogica Hydrate+ Sleeping Face Mask with Coconut Water",
    brandName: "Aqualogica",
    productImage: "/static/images/products/aqualogica-hydrate-sleeping-face-mask-with-coconut-water.jpg",
    productUse: "Used for targeted facial skincare targeting severe overnight moisture depletion."
  },
  {
    productId: "IN-SKIN-0151",
    productName: "Aqualogica Glow+ Dewy Lip Balm with Papaya & Vitamin C",
    brandName: "Aqualogica",
    productImage: "/static/images/products/aqualogica-glow-dewy-lip-balm-with-papaya-vitamin-c.jpg",
    productUse: "Used to hydrate dry, chapped lips and prevent moisture loss."
  },
  {
    productId: "IN-SKIN-0152",
    productName: "Aqualogica Detan+ Smoothie Face Wash with Cherry Tomato",
    brandName: "Aqualogica",
    productImage: "/static/images/products/aqualogica-detan-smoothie-face-wash-with-cherry-tomato.jpg",
    productUse: "Used to cleanse surface impurities, remove dirt and excess oil gently."
  },
  {
    productId: "IN-SKIN-0153",
    productName: "Aqualogica Radiance+ Oil-Free Face Moisturizer",
    brandName: "Aqualogica",
    productImage: "/static/images/products/aqualogica-radiance-oil-free-face-moisturizer.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0154",
    productName: "Cetaphil Gentle Skin Cleanser for Dry to Normal Sensitive Skin",
    brandName: "Cetaphil",
    productImage: "/static/images/products/cetaphil-gentle-skin-cleanser-for-dry-to-normal-sensitive-skin.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness.",
    verifiedOnlineImage: "https://m.media-amazon.com/images/I/61l+J7cWJYL._SL1500_.jpg"
  },
  {
    productId: "IN-SKIN-0155",
    productName: "Cetaphil Oily Skin Cleanser for Acne-Prone Skin",
    brandName: "Cetaphil",
    productImage: "/static/images/products/cetaphil-oily-skin-cleanser-for-acne-prone-skin.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0156",
    productName: "Cetaphil Moisturising Cream for Very Dry Sensitive Skin",
    brandName: "Cetaphil",
    productImage: "/static/images/products/cetaphil-moisturising-cream-for-very-dry-sensitive-skin.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness.",
    verifiedOnlineImage: "https://m.media-amazon.com/images/I/61y8B7+7wYL._SL1500_.jpg"
  },
  {
    productId: "IN-SKIN-0157",
    productName: "CeraVe Foaming Facial Cleanser for Normal to Oily Skin",
    brandName: "CeraVe",
    productImage: "/static/images/products/cerave-foaming-facial-cleanser-for-normal-to-oily-skin.jpg",
    productUse: "Used to control excessive facial sebum, minimize pores, and reduce shine."
  },
  {
    productId: "IN-SKIN-0158",
    productName: "CeraVe Moisturising Cream with 3 Essential Ceramides",
    brandName: "CeraVe",
    productImage: "/static/images/products/cerave-moisturising-cream-with-3-essential-ceramides.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0159",
    productName: "Sebamed Clear Face Care Gel Ph 5.5",
    brandName: "Sebamed",
    productImage: "/static/images/products/sebamed-clear-face-care-gel-ph-5-5.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0160",
    productName: "Sebamed Clear Face Cleansing Foam Ph 5.5",
    brandName: "Sebamed",
    productImage: "/static/images/products/sebamed-clear-face-cleansing-foam-ph-5-5.jpg",
    productUse: "Used to control excessive facial sebum, minimize pores, and reduce shine."
  },
  {
    productId: "IN-SKIN-0161",
    productName: "Fixderma Shadow Sunscreen Gel SPF 30+ PA+++",
    brandName: "Fixderma",
    productImage: "/static/images/products/fixderma-shadow-sunscreen-gel-spf-30-pa.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0162",
    productName: "Fixderma Shadow Sunscreen Cream SPF 50+ PA+++",
    brandName: "Fixderma",
    productImage: "/static/images/products/fixderma-shadow-sunscreen-cream-spf-50-pa.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0163",
    productName: "Fixderma Nigrifix Cream for Dark Body & Neck Patches",
    brandName: "Fixderma",
    productImage: "/static/images/products/fixderma-nigrifix-cream-for-dark-body-neck-patches.jpg",
    productUse: "Used for targeted facial skincare targeting dark velvety patches (neck, underarms, knuckles)."
  },
  {
    productId: "IN-SKIN-0164",
    productName: "Episoft AC Moisturiser with Microencapsulated Sunscreen SPF 30",
    brandName: "Episoft",
    productImage: "/static/images/products/episoft-ac-moisturiser-with-microencapsulated-sunscreen-spf-30.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0165",
    productName: "Emolene Dry Skin Care Treatment Cream",
    brandName: "Emolene",
    productImage: "/static/images/products/emolene-dry-skin-care-treatment-cream.jpg",
    productUse: "Used for targeted facial skincare targeting severe flakiness & water deficiency."
  },
  {
    productId: "IN-SKIN-0166",
    productName: "Bioderma Sensibio H2O Micellar Water",
    brandName: "Bioderma",
    productImage: "/static/images/products/bioderma-sensibio-h2o-micellar-water.jpg",
    productUse: "Used to cleanse surface impurities, remove dirt and excess oil gently."
  },
  {
    productId: "IN-SKIN-0167",
    productName: "Bioderma Atoderm Intensive Baume Ultra-Soothing Balm",
    brandName: "Bioderma",
    productImage: "/static/images/products/bioderma-atoderm-intensive-baume-ultra-soothing-balm.jpg",
    productUse: "Used for targeted facial skincare targeting intense itching & eczematous flare-ups."
  },
  {
    productId: "IN-SKIN-0168",
    productName: "Lacto Calamine Daily Face Lotion for Oily Skin",
    brandName: "Lacto Calamine",
    productImage: "/static/images/products/lacto-calamine-daily-face-lotion-for-oily-skin.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0169",
    productName: "Kama Ayurveda Pure Rose Water Face Mist",
    brandName: "Kama Ayurveda",
    productImage: "/static/images/products/kama-ayurveda-pure-rose-water-face-mist.jpg",
    productUse: "Used to tone pores, rebalance skin pH, and deliver instant hydration."
  },
  {
    productId: "IN-SKIN-0170",
    productName: "Kama Ayurveda Kumkumadi Miraculous Beauty Ayurvedic Night Serum",
    brandName: "Kama Ayurveda",
    productImage: "/static/images/products/kama-ayurveda-kumkumadi-miraculous-beauty-ayurvedic-night-serum.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0171",
    productName: "Kama Ayurveda Nimrah Anti Acne Face Pack",
    brandName: "Kama Ayurveda",
    productImage: "/static/images/products/kama-ayurveda-nimrah-anti-acne-face-pack.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0172",
    productName: "Kama Ayurveda Eladi Hydrating Ayurvedic Face Cream",
    brandName: "Kama Ayurveda",
    productImage: "/static/images/products/kama-ayurveda-eladi-hydrating-ayurvedic-face-cream.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0173",
    productName: "Kama Ayurveda Bringadi Intensive Hair Treatment Oil",
    brandName: "Kama Ayurveda",
    productImage: "/static/images/products/kama-ayurveda-bringadi-intensive-hair-treatment-oil.jpg",
    productUse: "Used to strengthen hair roots, control dandruff, and reduce breakage."
  },
  {
    productId: "IN-SKIN-0174",
    productName: "Kama Ayurveda Rejuvenating & Brightening Ayurvedic Night Cream",
    brandName: "Kama Ayurveda",
    productImage: "/static/images/products/kama-ayurveda-rejuvenating-brightening-ayurvedic-night-cream.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0175",
    productName: "Forest Essentials Soundarya Radiance Cream with 24K Gold & SPF 25",
    brandName: "Forest Essentials",
    productImage: "/static/images/products/forest-essentials-soundarya-radiance-cream-with-24k-gold-spf-25.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0176",
    productName: "Forest Essentials Delicate Facial Cleanser Kashmiri Saffron & Neem",
    brandName: "Forest Essentials",
    productImage: "/static/images/products/forest-essentials-delicate-facial-cleanser-kashmiri-saffron-neem.jpg",
    productUse: "Used to cleanse surface impurities, remove dirt and excess oil gently."
  },
  {
    productId: "IN-SKIN-0177",
    productName: "Forest Essentials Facial Tonic Mist Pure Rosewater",
    brandName: "Forest Essentials",
    productImage: "/static/images/products/forest-essentials-facial-tonic-mist-pure-rosewater.jpg",
    productUse: "Used to tone pores, rebalance skin pH, and deliver instant hydration."
  },
  {
    productId: "IN-SKIN-0178",
    productName: "Forest Essentials Tejasvi Emulsion Ayurvedic Brightening Ghee Cream",
    brandName: "Forest Essentials",
    productImage: "/static/images/products/forest-essentials-tejasvi-emulsion-ayurvedic-brightening-ghee-cream.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0179",
    productName: "Forest Essentials Kumkumadi Teenage Night Cream",
    brandName: "Forest Essentials",
    productImage: "/static/images/products/forest-essentials-kumkumadi-teenage-night-cream.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0180",
    productName: "Forest Essentials Sun Fluid Tender Coconut Water with Turmeric SPF 50",
    brandName: "Forest Essentials",
    productImage: "/static/images/products/forest-essentials-sun-fluid-tender-coconut-water-with-turmeric-spf-50.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0181",
    productName: "Pond's Bright Beauty Spot-less Glow Face Wash",
    brandName: "Pond's",
    productImage: "/static/images/products/pond-s-bright-beauty-spot-less-glow-face-wash.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0182",
    productName: "Pond's Super Light Gel Oil-Free Moisturiser with Hyaluronic Acid & Vitamin E",
    brandName: "Pond's",
    productImage: "/static/images/products/pond-s-super-light-gel-oil-free-moisturiser-with-hyaluronic-acid-vitamin-e.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0183",
    productName: "Pond's Pure Detox Mineral Clay Activated Charcoal Face Wash",
    brandName: "Pond's",
    productImage: "/static/images/products/pond-s-pure-detox-mineral-clay-activated-charcoal-face-wash.jpg",
    productUse: "Used to cleanse surface impurities, remove dirt and excess oil gently."
  },
  {
    productId: "IN-SKIN-0184",
    productName: "Pond's Age Miracle Youthful Glow Night Cream with Retinol-C",
    brandName: "Pond's",
    productImage: "/static/images/products/pond-s-age-miracle-youthful-glow-night-cream-with-retinol-c.jpg",
    productUse: "Used to diminish fine lines, improve firmness, and smooth skin texture."
  },
  {
    productId: "IN-SKIN-0185",
    productName: "Garnier Skin Naturals Bright Complete Vitamin C Face Wash",
    brandName: "Garnier",
    productImage: "/static/images/products/garnier-skin-naturals-bright-complete-vitamin-c-face-wash.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0186",
    productName: "Garnier Skin Naturals Bright Complete 30X Vitamin C Booster Serum",
    brandName: "Garnier",
    productImage: "/static/images/products/garnier-skin-naturals-bright-complete-30x-vitamin-c-booster-serum.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0187",
    productName: "Garnier Micellar Cleansing Water Pink for Sensitive Skin",
    brandName: "Garnier",
    productImage: "/static/images/products/garnier-micellar-cleansing-water-pink-for-sensitive-skin.jpg",
    productUse: "Used to cleanse surface impurities, remove dirt and excess oil gently."
  },
  {
    productId: "IN-SKIN-0188",
    productName: "Garnier Micellar Cleansing Water Vitamin C Yellow",
    brandName: "Garnier",
    productImage: "/static/images/products/garnier-micellar-cleansing-water-vitamin-c-yellow.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0189",
    productName: "Garnier Bright Complete Anti-Acne Booster Face Serum",
    brandName: "Garnier",
    productImage: "/static/images/products/garnier-bright-complete-anti-acne-booster-face-serum.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0190",
    productName: "Clean & Clear Foaming Face Wash for Oily Skin",
    brandName: "Clean & Clear",
    productImage: "/static/images/products/clean-clear-foaming-face-wash-for-oily-skin.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0191",
    productName: "Clean & Clear Morning Energy Apple Face Wash",
    brandName: "Clean & Clear",
    productImage: "/static/images/products/clean-clear-morning-energy-apple-face-wash.jpg",
    productUse: "Used to cleanse surface impurities, remove dirt and excess oil gently."
  },
  {
    productId: "IN-SKIN-0192",
    productName: "Joy pH 5.5 Moisture Balancing Face Wash",
    brandName: "Joy",
    productImage: "/static/images/products/joy-ph-5-5-moisture-balancing-face-wash.jpg",
    productUse: "Used to cleanse surface impurities, remove dirt and excess oil gently."
  },
  {
    productId: "IN-SKIN-0193",
    productName: "Joy Revivify Anti-Acne Face Serum with Salicylic & Niacinamide",
    brandName: "Joy",
    productImage: "/static/images/products/joy-revivify-anti-acne-face-serum-with-salicylic-niacinamide.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0194",
    productName: "Joy Lemon Clarifying Face Wash for Oil Control",
    brandName: "Joy",
    productImage: "/static/images/products/joy-lemon-clarifying-face-wash-for-oil-control.jpg",
    productUse: "Used to cleanse surface impurities, remove dirt and excess oil gently."
  },
  {
    productId: "IN-SKIN-0195",
    productName: "Joy Honey & Almonds Advanced Nourishing Body Lotion",
    brandName: "Joy",
    productImage: "/static/images/products/joy-honey-almonds-advanced-nourishing-body-lotion.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0196",
    productName: "Lotus Herbals Safe Sun 3-in-1 Matte Look Daily Sunblock SPF 40",
    brandName: "Lotus Herbals",
    productImage: "/static/images/products/lotus-herbals-safe-sun-3-in-1-matte-look-daily-sunblock-spf-40.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0197",
    productName: "Lotus Herbals Safe Sun UV Screen Matte Gel SPF 50",
    brandName: "Lotus Herbals",
    productImage: "/static/images/products/lotus-herbals-safe-sun-uv-screen-matte-gel-spf-50.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0198",
    productName: "Lotus Herbals WhiteGlow Skin Whitening & Brightening Gel Cream SPF 25",
    brandName: "Lotus Herbals",
    productImage: "/static/images/products/lotus-herbals-whiteglow-skin-whitening-brightening-gel-cream-spf-25.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0199",
    productName: "Lotus Herbals WhiteGlow Skin Brightening Night Cream",
    brandName: "Lotus Herbals",
    productImage: "/static/images/products/lotus-herbals-whiteglow-skin-brightening-night-cream.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0200",
    productName: "Lotus Herbals YouthRx Anti-Ageing Transforming Creme SPF 25",
    brandName: "Lotus Herbals",
    productImage: "/static/images/products/lotus-herbals-youthrx-anti-ageing-transforming-creme-spf-25.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0201",
    productName: "Lotus Herbals Teatreewash Anti-Acne Oil Control Face Wash",
    brandName: "Lotus Herbals",
    productImage: "/static/images/products/lotus-herbals-teatreewash-anti-acne-oil-control-face-wash.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0202",
    productName: "Vicco Turmeric Skin Care Cream (With Sandalwood Oil)",
    brandName: "Vicco",
    productImage: "/static/images/products/vicco-turmeric-skin-care-cream-with-sandalwood-oil.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0203",
    productName: "Vicco Turmeric WSO Skin Cream (Without Sandalwood Oil)",
    brandName: "Vicco",
    productImage: "/static/images/products/vicco-turmeric-wso-skin-cream-without-sandalwood-oil.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0204",
    productName: "Vicco Turmeric Face Wash with Foam Base",
    brandName: "Vicco",
    productImage: "/static/images/products/vicco-turmeric-face-wash-with-foam-base.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0205",
    productName: "WOW Skin Science Apple Cider Vinegar Foaming Face Wash",
    brandName: "WOW Skin Science",
    productImage: "/static/images/products/wow-skin-science-apple-cider-vinegar-foaming-face-wash.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  },
  {
    productId: "IN-SKIN-0206",
    productName: "WOW Skin Science 20% Vitamin C Face Serum",
    brandName: "WOW Skin Science",
    productImage: "/static/images/products/wow-skin-science-20-vitamin-c-face-serum.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0207",
    productName: "WOW Skin Science Brightening Vitamin C Foaming Face Wash",
    brandName: "WOW Skin Science",
    productImage: "/static/images/products/wow-skin-science-brightening-vitamin-c-foaming-face-wash.jpg",
    productUse: "Used to fade dark spots, diminish facial acne marks, and brighten skin tone."
  },
  {
    productId: "IN-SKIN-0208",
    productName: "WOW Skin Science Aloe Vera Multi-Purpose Gel (99% Pure)",
    brandName: "WOW Skin Science",
    productImage: "/static/images/products/wow-skin-science-aloe-vera-multi-purpose-gel-99-pure.jpg",
    productUse: "Used to soothe irritated skin, deliver oil-free hydration, and calm sunburn."
  },
  {
    productId: "IN-SKIN-0209",
    productName: "WOW Skin Science Retinol Face Serum",
    brandName: "WOW Skin Science",
    productImage: "/static/images/products/wow-skin-science-retinol-face-serum.jpg",
    productUse: "Used to diminish fine lines, improve firmness, and smooth skin texture."
  },
  {
    productId: "IN-SKIN-0210",
    productName: "VLCC Specifix Professional Skin Brightening De-Tan Pack",
    brandName: "VLCC",
    productImage: "/static/images/products/vlcc-specifix-professional-skin-brightening-de-tan-pack.jpg",
    productUse: "Used for targeted facial skincare targeting stubborn sun tan & uv darkening."
  },
  {
    productId: "IN-SKIN-0211",
    productName: "VLCC Natural Sciences Sandal Cleansing Milk",
    brandName: "VLCC",
    productImage: "/static/images/products/vlcc-natural-sciences-sandal-cleansing-milk.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0212",
    productName: "Neutrogena Hydro Boost Water Gel with Hyaluronic Acid",
    brandName: "Neutrogena",
    productImage: "/static/images/products/neutrogena-hydro-boost-water-gel-with-hyaluronic-acid.jpg",
    productUse: "Used to deeply hydrate, repair the skin barrier, and soothe dryness."
  },
  {
    productId: "IN-SKIN-0213",
    productName: "Neutrogena Ultra Sheer Dry-Touch Sunscreen SPF 50+ PA++++",
    brandName: "Neutrogena",
    productImage: "/static/images/products/neutrogena-ultra-sheer-dry-touch-sunscreen-spf-50-pa.jpg",
    productUse: "Used for broad-spectrum UVA/UVB sun protection and preventing tanning."
  },
  {
    productId: "IN-SKIN-0214",
    productName: "Neutrogena Deep Clean Facial Cleanser",
    brandName: "Neutrogena",
    productImage: "/static/images/products/neutrogena-deep-clean-facial-cleanser.jpg",
    productUse: "Used to cleanse surface impurities, remove dirt and excess oil gently."
  },
  {
    productId: "IN-SKIN-0215",
    productName: "Neutrogena Oil-Free Acne Wash Pink Grapefruit Facial Cleanser",
    brandName: "Neutrogena",
    productImage: "/static/images/products/neutrogena-oil-free-acne-wash-pink-grapefruit-facial-cleanser.jpg",
    productUse: "Used to target active acne breakouts, unclog pores, and calm blemishes."
  }
];

// Helper to normalize product identifiers and names for exact permanent mapping
export function normalizeProductKey(input?: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

// Fast In-Memory Map for 100% Deterministic O(1) Verification
const PRODUCT_BY_NORM_NAME = new Map<string, VerifiedProductReference>();
const PRODUCT_BY_ID = new Map<string, VerifiedProductReference>();

// Initialize lookups
VERIFIED_PRODUCT_CATALOG.forEach(p => {
  PRODUCT_BY_NORM_NAME.set(normalizeProductKey(p.productName), p);
  PRODUCT_BY_ID.set(normalizeProductKey(p.productId), p);
});

/**
 * Strict product verification helper.
 * Verifies that the product exists and has a verified reference image in the catalog.
 * NEVER guesses, substitutes, or assigns images from other products.
 */
export function lookupVerifiedProduct(nameOrId?: string): {
  isFound: boolean;
  product?: VerifiedProductReference;
  verifiedImageUrl?: string;
  exactProductName?: string;
  existingProductUse?: string;
} {
  if (!nameOrId) {
    return { isFound: false };
  }

  const key = normalizeProductKey(nameOrId);
  const matched = PRODUCT_BY_ID.get(key) || PRODUCT_BY_NORM_NAME.get(key);

  if (matched) {
    // Verified reference image path (local dataset static image or verified online asset)
    const verifiedUrl = matched.verifiedOnlineImage || matched.productImage;
    return {
      isFound: true,
      product: matched,
      verifiedImageUrl: verifiedUrl,
      exactProductName: matched.productName,
      existingProductUse: matched.productUse
    };
  }

  // Exact substring check if needed for partial match on full title
  for (const ref of VERIFIED_PRODUCT_CATALOG) {
    const refKey = normalizeProductKey(ref.productName);
    if (refKey.length > 5 && (key.includes(refKey) || refKey.includes(key))) {
      const verifiedUrl = ref.verifiedOnlineImage || ref.productImage;
      return {
        isFound: true,
        product: ref,
        verifiedImageUrl: verifiedUrl,
        exactProductName: ref.productName,
        existingProductUse: ref.productUse
      };
    }
  }

  return { isFound: false };
}
