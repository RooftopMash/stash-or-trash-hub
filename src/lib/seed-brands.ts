import type { Brand } from "@/lib/brands";

const entries = [
  ["KOO", "Tinned Fruit", "Agriculture & Food Production"],
  ["KOO", "Tinned/Canned Beans", "Agriculture & Food Production"],
  ["KOO", "Tinned Vegetables", "Agriculture & Food Production"],
  ["Black Cat", "Peanut Butter & Spreads", "Consumer Goods"],
  ["Jungle Oats", "Breakfast Cereals & Oats", "Consumer Goods"],
  ["Doom", "Insecticides & Repellents", "Consumer Goods"],
  ["Fatti's & Moni's", "Pasta", "Agriculture & Food Production"],
  ["All Gold", "Jams & Marmalade", "Agriculture & Food Production"],
  ["Energade", "Sports Drinks", "Sports & Recreation"],
  ["Bathu", "Sneakers & Footwear", "Fashion & Apparel"],
  ["Drip Footwear", "Sneakers & Footwear", "Fashion & Apparel"],
  ["Veldskoen", "Footwear", "Fashion & Apparel"],
  ["GALXBOY", "Streetwear & Apparel", "Fashion & Apparel"],
  ["TSHEPO Denim", "Denim & Apparel", "Fashion & Apparel"],
  ["S.P.C.C", "Streetwear & Apparel", "Fashion & Apparel"],
  ["Freedom of Movement", "Apparel", "Fashion & Apparel"],
  ["Loxion Kulca", "Streetwear & Apparel", "Fashion & Apparel"],
  ["MaXhosa Africa", "High Fashion & Designer", "Luxury & Premium"],
  ["Rich Mnisi", "High Fashion & Designer", "Luxury & Premium"],
  ["Thebe Magugu", "High Fashion & Designer", "Luxury & Premium"],
  ["Pichulik", "Jewellery & Accessories", "Fashion & Apparel"],
  ["Kirsten Goss", "Jewellery & Accessories", "Fashion & Apparel"],
  ["Bellaghy Leather", "Leather Accessories", "Fashion & Apparel"],
  ["First Ascent", "Technical Outerwear & Gear", "Sports & Recreation"],
  ["Cape Union Mart", "Outdoor Gear & Lifestyle", "Retail & E-commerce"],
  ["Hi-Tec SA", "Outdoor Footwear & Gear", "Sports & Recreation"],
  ["African Nature", "Safari & Lifestyle", "Travel, Tourism & Hospitality"],
  ["Jonsson Workwear", "Workwear", "Consumer Goods"],
  ["OTG Active", "Activewear & Fitness", "Sports & Recreation"],
  ["Viva Athletics", "Activewear & Fitness", "Sports & Recreation"],
  ["Mrs Ball's", "Chutney & Pantry", "Agriculture & Food Production"],
  ["Tastic", "Rice & Pantry Staples", "Agriculture & Food Production"],
  ["Beacon", "Snacks & Sweets", "Consumer Goods"],
  ["Sally Williams", "Snacks & Sweets", "Consumer Goods"],
  ["NikNaks", "Snacks & Sweets", "Consumer Goods"],
  ["Chappies", "Confectionery", "Consumer Goods"],
  ["Clover", "Dairy & Proteins", "Agriculture & Food Production"],
  ["Fair Cape", "Dairy", "Agriculture & Food Production"],
  ["Eskort", "Meat & Proteins", "Agriculture & Food Production"],
  ["Oros", "Soft Drinks & Juices", "Agriculture & Food Production"],
  ["Ceres", "Soft Drinks & Juices", "Agriculture & Food Production"],
  ["BOS Iced Tea", "Soft Drinks & Juices", "Agriculture & Food Production"],
  ["Amarula", "Spirits & Liqueurs", "Consumer Goods"],
  ["Inverroche Gin", "Spirits & Liqueurs", "Consumer Goods"],
  ["Musgrave Gin", "Spirits & Liqueurs", "Consumer Goods"],
  ["KWV", "Wine & Spirits", "Consumer Goods"],
  ["Castle Lager", "Beer", "Consumer Goods"],
  ["Savanna Cider", "Cider", "Consumer Goods"],
  ["Devil's Peak Beer", "Craft Beer", "Consumer Goods"],
  ["Africology", "Skincare & Body", "Beauty & Personal Care"],
  ["Portia M", "Skincare & Haircare", "Beauty & Personal Care"],
  ["Woolworths Beauty", "Beauty Retail", "Beauty & Personal Care"],
  ["Inuka", "Beauty & Personal Care", "Beauty & Personal Care"],
  ["Native Child", "Haircare", "Beauty & Personal Care"],
  ["AfroBotanics", "Haircare", "Beauty & Personal Care"],
  ["Ardmore", "Decor & Textiles", "Home, Furniture & Living"],
  ["Skinny laMinx", "Decor & Textiles", "Home, Furniture & Living"],
  ["Mash T Design", "Home Design", "Home, Furniture & Living"],
  ["Rain", "Home Fragrance & Bath", "Home, Furniture & Living"],
  ["Charlotte Rhys", "Home Fragrance & Bath", "Home, Furniture & Living"],
  ["Flickering Grace", "Home Fragrance & Bath", "Home, Furniture & Living"],
] as const;

function slugifySeed(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const internationalEntries = [
  ["Dangote", "Conglomerate", "Business & Finance", "NG"], ["Jumia", "E-commerce", "Retail & E-commerce", "NG"], ["Safaricom", "Telecommunications", "Technology & Telecom", "KE"], ["M-PESA", "Mobile payments", "Technology & Telecom", "KE"], ["MTN", "Telecommunications", "Technology & Telecom", "GH"], ["Ethiopian Airlines", "Airline", "Travel, Tourism & Hospitality", "ET"], ["Emirates", "Airline", "Travel, Tourism & Hospitality", "AE"], ["Tata", "Conglomerate", "Business & Finance", "IN"], ["Infosys", "Technology services", "Technology & Telecom", "IN"], ["Toyota", "Automotive", "Automotive & Mobility", "JP"], ["Sony", "Electronics", "Technology & Telecom", "JP"], ["Samsung", "Electronics", "Technology & Telecom", "KR"], ["Alibaba", "E-commerce", "Retail & E-commerce", "CN"], ["L&apos;Oréal", "Beauty", "Beauty & Personal Care", "FR"], ["IKEA", "Furniture", "Home, Furniture & Living", "SE"], ["Adidas", "Sportswear", "Fashion & Apparel", "DE"], ["LEGO", "Toys", "Consumer Goods", "DK"], ["Spotify", "Music streaming", "Media & Entertainment", "SE"], ["Natura", "Beauty", "Beauty & Personal Care", "BR"], ["Mercado Libre", "E-commerce", "Retail & E-commerce", "AR"], ["Coca-Cola", "Beverages", "Agriculture & Food Production", "US"], ["Microsoft", "Software", "Technology & Telecom", "US"], ["Shopify", "E-commerce software", "Technology & Telecom", "CA"], ["Canva", "Design software", "Technology & Telecom", "AU"], ["Zara", "Fashion retail", "Fashion & Apparel", "ES"], ["Nestlé", "Food & Beverage", "Agriculture & Food Production", "CH"], ["LVMH", "Luxury goods", "Luxury & Premium", "FR"], ["Heineken", "Beverages", "Consumer Goods", "NL"], ["Mercadona", "Supermarkets", "Retail & E-commerce", "ES"], ["Beko", "Home appliances", "Home, Furniture & Living", "TR"],
] as const;

export const INTERNATIONAL_SEED_BRANDS: Brand[] = internationalEntries.map(([name, descriptor, category, country], index) => ({
  id: `seed-global-${index + 1}`, owner_id: "seed-catalog", name, slug: `${slugifySeed(name)}-${country.toLowerCase()}`, description: `${descriptor} brand from ${country}. Community verification is still open.`, logo_url: null, website: null, category, country, verified: false, trust_score: 0, created_at: "2026-09-09T00:00:00.000Z", signedLogoUrl: null, ownerName: "SOT catalog",
}));

export const SOUTH_AFRICAN_SEED_BRANDS: Brand[] = entries.map(
  ([name, descriptor, category], index) => ({
    id: `seed-za-${index + 1}`,
    owner_id: "seed-catalog",
    name,
    slug: `${slugifySeed(name)}-za`,
    description: `${descriptor} brand catalogued for South Africa. Community verification is still open.`,
    logo_url: null,
    website: null,
    category,
    country: "ZA",
    verified: false,
    trust_score: 0,
    created_at: "2026-09-09T00:00:00.000Z",
    signedLogoUrl: null,
    ownerName: "SOT catalog",
  }),
);
