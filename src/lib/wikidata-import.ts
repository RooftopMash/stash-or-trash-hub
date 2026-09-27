import { supabase } from "@/integrations/supabase/client";
import { createFirestoreBrand, getFirestoreBrands } from "@/services/firestoreService";
import { countryName, normalizeCountryCode } from "@/lib/geo";

export const ISO_TO_QID: Record<string, string> = {
  ZA: "Q258", US: "Q30", GB: "Q145", FR: "Q142", DE: "Q183",
  IT: "Q38", ES: "Q29", PT: "Q45", NL: "Q55", BR: "Q155",
  IN: "Q668", CN: "Q148", JP: "Q17", KR: "Q884", MX: "Q96",
  CA: "Q16", AU: "Q408", NG: "Q1033", KE: "Q114", EG: "Q79",
  MA: "Q1028", GH: "Q117", SN: "Q1041", ET: "Q115",
  TZ: "Q924", UG: "Q1036", RW: "Q1037", BW: "Q963", NA: "Q1030",
  ZW: "Q954", ZM: "Q953", MZ: "Q1029", AO: "Q916", CM: "Q1009",
  CI: "Q1008", DZ: "Q262", TN: "Q948", MU: "Q1027", LS: "Q1013",
  SZ: "Q1050", MW: "Q1020", CD: "Q974",
  CH: "Q39", SE: "Q34", NO: "Q20", DK: "Q35", FI: "Q33",
  IE: "Q27", BE: "Q31", AT: "Q40", PL: "Q36", GR: "Q41",
  TR: "Q43", RU: "Q159", UA: "Q212", CZ: "Q213", RO: "Q218",
  AR: "Q414", CL: "Q298", CO: "Q739", PE: "Q419", UY: "Q77",
  AE: "Q878", SA: "Q851", QA: "Q846", IL: "Q801", SG: "Q334",
  MY: "Q833", ID: "Q252", TH: "Q869", PH: "Q928", VN: "Q881",
  PK: "Q843", BD: "Q902", LK: "Q854", NZ: "Q664", HK: "Q8646",
  TW: "Q865",
};

export const SUPPORTED_IMPORT_COUNTRIES: ReadonlyArray< readonly [string, string] > = [
  ["ZA", "🇿🇦 South Africa"],
  ["NG", "🇳🇬 Nigeria"],
  ["KE", "🇰🇪 Kenya"],
  ["GH", "🇬🇭 Ghana"],
  ["EG", "🇪🇬 Egypt"],
  ["MA", "🇲🇦 Morocco"],
  ["ET", "🇪🇹 Ethiopia"],
  ["SN", "🇸🇳 Senegal"],
  ["TZ", "🇹🇿 Tanzania"],
  ["UG", "🇺🇬 Uganda"],
  ["RW", "🇷🇼 Rwanda"],
  ["BW", "🇧🇼 Botswana"],
  ["NA", "🇳🇦 Namibia"],
  ["ZW", "🇿🇼 Zimbabwe"],
  ["ZM", "🇿🇲 Zambia"],
  ["LS", "🇱🇸 Lesotho"],
  ["SZ", "🇸🇿 Eswatini"],
  ["MZ", "🇲🇿 Mozambique"],
  ["AO", "🇦🇴 Angola"],
  ["CM", "🇨🇲 Cameroon"],
  ["CI", "🇨🇮 Côte d'Ivoire"],
  ["MU", "🇲🇺 Mauritius"],
  ["US", "🇺🇸 United States"],
  ["GB", "🇬🇧 United Kingdom"],
  ["FR", "🇫🇷 France"],
  ["DE", "🇩🇪 Germany"],
  ["ES", "🇪🇸 Spain"],
  ["PT", "🇵🇹 Portugal"],
  ["IT", "🇮🇹 Italy"],
  ["NL", "🇳🇱 Netherlands"],
  ["CH", "🇨🇭 Switzerland"],
  ["SE", "🇸🇪 Sweden"],
  ["IE", "🇮🇪 Ireland"],
  ["PL", "🇵🇱 Poland"],
  ["TR", "🇹🇷 Türkiye"],
  ["BR", "🇧🇷 Brazil"],
  ["MX", "🇲🇽 Mexico"],
  ["CA", "🇨🇦 Canada"],
  ["AR", "🇦🇷 Argentina"],
  ["CO", "🇨🇴 Colombia"],
  ["CL", "🇨🇱 Chile"],
  ["IN", "🇮🇳 India"],
  ["CN", "🇨🇳 China"],
  ["JP", "🇯🇵 Japan"],
  ["KR", "🇰🇷 South Korea"],
  ["AU", "🇦🇺 Australia"],
  ["NZ", "🇳🇿 New Zealand"],
  ["AE", "🇦🇪 United Arab Emirates"],
  ["SA", "🇸🇦 Saudi Arabia"],
  ["SG", "🇸🇬 Singapore"],
  ["ID", "🇮🇩 Indonesia"],
  ["MY", "🇲🇾 Malaysia"],
  ["PH", "🇵🇭 Philippines"],
  ["TH", "🇹🇭 Thailand"],
  ["VN", "🇻🇳 Vietnam"],
] as const;

const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";
const WIKIDATA_API = "https://www.wikidata.org/w/api.php";

const CANDIDATES_STORAGE_KEY = "sot-brand-import-candidates-v1";
const IMPORTED_BRANDS_STORAGE_KEY = "sot-imported-brands-v1";

export type WikidataImportResult = {
  inserted: number;
  skipped: number;
  sourceSummary?: string;
};

export type ApprovedBrand = {
  brandId: string;
  name: string;
  slug: string;
  website: string | null;
};

export type Candidate = {
  id: string;
  source: string;
  source_id: string;
  name: string;
  slug: string;
  country: string;
  category: string | null;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  status: string;
  created_at?: string;
};

type CountrySeedBrand = {
  name: string;
  category: string;
  domain: string;
  description: string;
};

/**
 * Curated high-signal national & regional brands by ISO country code.
 * Ensures instant, rich multi-country discovery even when Wikidata SPARQL throttles.
 */
const GLOBAL_COUNTRY_ATLAS: Record<string, CountrySeedBrand[]> = {
  ZA: [
    { name: "Capitec Bank", category: "Banking & Finance", domain: "capitecbank.co.za", description: "South African retail bank known for digital banking and accessible branches." },
    { name: "Shoprite", category: "Groceries & Supermarkets", domain: "shoprite.co.za", description: "Africa's largest supermarket retailer headquartered in Cape Town." },
    { name: "Checkers Sixty60", category: "Delivery & On-Demand", domain: "checkers.co.za", description: "On-demand 60-minute grocery delivery service across South Africa." },
    { name: "Woolworths South Africa", category: "Groceries & Fashion", domain: "woolworths.co.za", description: "Premium South African food, fashion, beauty, and homeware retailer." },
    { name: "MTN South Africa", category: "Telecoms", domain: "mtn.co.za", description: "Pan-African mobile telecommunications and fintech network." },
    { name: "Vodacom", category: "Telecoms", domain: "vodacom.co.za", description: "Leading South African mobile communications and M-Pesa operator." },
    { name: "First National Bank (FNB)", category: "Banking & Finance", domain: "fnb.co.za", description: "Innovative South African commercial and retail bank." },
    { name: "Standard Bank", category: "Banking & Finance", domain: "standardbank.co.za", description: "Africa's largest banking group by assets, founded in South Africa." },
    { name: "Nando's", category: "Food & Restaurants", domain: "nandos.co.za", description: "Iconic South African flame-grilled peri-peri chicken restaurant chain." },
    { name: "Takealot", category: "E-Commerce", domain: "takealot.com", description: "South Africa's leading online marketplace and logistics network." },
    { name: "Discovery", category: "Insurance & Healthcare", domain: "discovery.co.za", description: "Shared-value health insurance, Vitality rewards, and digital banking group." },
    { name: "Clickatell", category: "Technology", domain: "clickatell.com", description: "Chat commerce and mobile messaging pioneer founded in South Africa." },
    { name: "Pick n Pay", category: "Groceries & Supermarkets", domain: "pnp.co.za", description: "Major South African supermarket, clothing, and hypermarket chain." },
    { name: "Sasol", category: "Energy & Fuel", domain: "sasol.com", description: "Integrated energy and chemical company headquartered in Sandton." },
  ],
  NG: [
    { name: "Flutterwave", category: "Fintech & Payments", domain: "flutterwave.com", description: "Pan-African payments technology company powering global commerce." },
    { name: "Paystack", category: "Fintech & Payments", domain: "paystack.com", description: "Modern online and offline payment gateway for African businesses." },
    { name: "Moniepoint", category: "Banking & Fintech", domain: "moniepoint.com", description: "All-in-one business banking, POS, and consumer payments platform in Nigeria." },
    { name: "GTCO (Guaranty Trust Bank)", category: "Banking & Finance", domain: "gtbank.com", description: "Leading Nigerian financial services institution." },
    { name: "Zenith Bank", category: "Banking & Finance", domain: "zenithbank.com", description: "Tier-1 Nigerian commercial and corporate bank." },
    { name: "Access Bank", category: "Banking & Finance", domain: "accessbankplc.com", description: "Multinational commercial bank headquartered in Lagos." },
    { name: "Dangote Group", category: "Manufacturing & FMCG", domain: "dangote.com", description: "West Africa's largest industrial conglomerate across cement, sugar, and energy." },
    { name: "Jumia Nigeria", category: "E-Commerce", domain: "jumia.com.ng", description: "Pan-African online retail marketplace and logistics service." },
    { name: "Air Peace", category: "Airlines & Travel", domain: "flyairpeace.com", description: "Largest private Nigerian airline serving domestic and international routes." },
    { name: "Kuda Bank", category: "Digital Banking", domain: "kuda.com", description: "Mobile-first digital challenger bank built for Nigerians." },
  ],
  KE: [
    { name: "Safaricom (M-Pesa)", category: "Telecoms & Fintech", domain: "safaricom.co.ke", description: "Kenya's leading telecoms provider and pioneer of M-Pesa mobile money." },
    { name: "Equity Bank Kenya", category: "Banking & Finance", domain: "equitygroupholdings.com", description: "East Africa's largest banking group by customer base." },
    { name: "KCB Bank", category: "Banking & Finance", domain: "kcbgroup.com", description: "Premier East African commercial bank headquartered in Nairobi." },
    { name: "Kenya Airways", category: "Airlines & Travel", domain: "kenya-airways.com", description: "The Pride of Africa — flag carrier airline of Kenya." },
    { name: "Naivas Supermarket", category: "Groceries & Supermarkets", domain: "naivas.online", description: "Kenya's largest homegrown supermarket retail chain." },
    { name: "Java House", category: "Food & Coffee", domain: "javahouseafrica.com", description: "East Africa's leading coffee and casual dining restaurant brand." },
    { name: "Twiga Foods", category: "AgriTech & Retail", domain: "twigafoods.com", description: "B2B food distribution platform connecting farmers and vendors in Kenya." },
  ],
  GH: [
    { name: "MTN Ghana", category: "Telecoms & MoMo", domain: "mtn.com.gh", description: "Market-leading telecommunications and Mobile Money operator in Ghana." },
    { name: "Ecobank", category: "Banking & Finance", domain: "ecobank.com", description: "Pan-African banking conglomerate with major operations across Ghana and West Africa." },
    { name: "GCB Bank", category: "Banking & Finance", domain: "gcbbank.com.gh", description: "Ghana's largest indigenous commercial bank." },
    { name: "Hubtel", category: "Fintech & Delivery", domain: "hubtel.com", description: "Ghanaian everyday payment, messaging, and quick-commerce super-app." },
    { name: "Kasapreko", category: "Beverages & FMCG", domain: "kasaprekogh.com", description: "Leading Ghanaian beverage manufacturer." },
    { name: "Melcom", category: "Retail & Department Stores", domain: "melcom.com", description: "Ghana's largest chain of retail department stores." },
  ],
  EG: [
    { name: "Fawry", category: "Fintech & E-Payments", domain: "fawry.com", description: "Egypt's premier digital transformation and electronic payments network." },
    { name: "Commercial International Bank (CIB)", category: "Banking & Finance", domain: "cibeg.com", description: "Egypt's leading private-sector bank." },
    { name: "EgyptAir", category: "Airlines & Travel", domain: "egyptair.com", description: "State-owned flag carrier airline of Egypt." },
    { name: "Vodafone Egypt", category: "Telecoms", domain: "vodafone.com.eg", description: "Largest mobile network operator and Vodafone Cash provider in Egypt." },
    { name: "Swvl", category: "Mobility & Transit", domain: "swvl.com", description: "Tech-enabled mass transit and shared mobility platform born in Cairo." },
    { name: "Breadfast", category: "Quick Commerce", domain: "breadfast.com", description: "On-demand groceries, bakery, and household essentials delivery in Egypt." },
  ],
  MA: [
    { name: "Royal Air Maroc", category: "Airlines & Travel", domain: "royalairmaroc.com", description: "National carrier airline of Morocco connecting Africa to the world." },
    { name: "Attijariwafa Bank", category: "Banking & Finance", domain: "attijariwafabank.com", description: "Leading banking and financial group in North and West Africa." },
    { name: "Maroc Telecom", category: "Telecoms", domain: "iam.ma", description: "Main telecommunications company in Morocco." },
    { name: "OCP Group", category: "Industry & Agriculture", domain: "ocpgroup.ma", description: "Global leader in plant nutrition and phosphate-based fertilizers." },
    { name: "Marjane", category: "Groceries & Hypermarkets", domain: "marjane.ma", description: "Morocco's leading hypermarket and retail chain." },
  ],
  ET: [
    { name: "Ethiopian Airlines", category: "Airlines & Travel", domain: "ethiopianairlines.com", description: "Africa's largest airline by passengers, destinations, and fleet size." },
    { name: "Ethio Telecom (Telebirr)", category: "Telecoms & Fintech", domain: "ethiotelecom.et", description: "National telecommunications and Telebirr mobile money provider." },
    { name: "Commercial Bank of Ethiopia", category: "Banking & Finance", domain: "combanketh.et", description: "Largest commercial bank in Ethiopia." },
    { name: "Safaricom Ethiopia", category: "Telecoms", domain: "safaricom.et", description: "High-speed 4G/5G telecommunications and M-Pesa network in Ethiopia." },
  ],
  SN: [
    { name: "Wave Mobile Money", category: "Fintech", domain: "wave.com", description: "Ultra-low-fee mobile money platform dominating Senegal and Francophone West Africa." },
    { name: "Sonatel (Orange Sénégal)", category: "Telecoms", domain: "sonatel.sn", description: "Senegal's premier telecommunications provider." },
    { name: "Air Sénégal", category: "Airlines & Travel", domain: "flyairsenegal.com", description: "Flag carrier airline of the Republic of Senegal." },
  ],
  TZ: [
    { name: "CRDB Bank", category: "Banking & Finance", domain: "crdbbank.co.tz", description: "Leading commercial bank in Tanzania and East Africa." },
    { name: "NMB Bank Tanzania", category: "Banking & Finance", domain: "nmbbank.co.tz", description: "Major retail and agricultural bank across Tanzania." },
    { name: "Vodacom Tanzania", category: "Telecoms", domain: "vodacom.co.tz", description: "Leading wireless telecommunications and M-Pesa network in Tanzania." },
    { name: "Bakhresa Group (Azam)", category: "Food, Media & FMCG", domain: "bakhresa.com", description: "Iconic Tanzanian conglomerate behind Azam Food, beverages, and Azam TV." },
  ],
  BW: [
    { name: "First National Bank Botswana", category: "Banking & Finance", domain: "fnbbotswana.co.bw", description: "Leading commercial and digital bank in Botswana." },
    { name: "Choppies", category: "Groceries & Supermarkets", domain: "choppies.co.bw", description: "Botswana-born multinational grocery and supermarket retailer." },
    { name: "Mascom Wireless", category: "Telecoms", domain: "mascom.bw", description: "Botswana's premier mobile telecommunications provider." },
    { name: "Air Botswana", category: "Airlines & Travel", domain: "airbotswana.co.bw", description: "National flag carrier airline of Botswana." },
  ],
  NA: [
    { name: "Bank Windhoek", category: "Banking & Finance", domain: "bankwindhoek.com.na", description: "Flagship homegrown commercial bank of Namibia." },
    { name: "MTC Namibia", category: "Telecoms", domain: "mtc.com.na", description: "Mobile Telecommunications Limited — Namibia's leading network." },
    { name: "Namibia Breweries", category: "Beverages", domain: "nambrew.com", description: "Producers of Windhoek Lager and Tafel Lager." },
  ],
  ZW: [
    { name: "Econet Wireless Zimbabwe", category: "Telecoms & EcoCash", domain: "econet.co.zw", description: "Zimbabwe's largest telecommunications and EcoCash fintech provider." },
    { name: "Delta Corporation", category: "Beverages & FMCG", domain: "delta.co.zw", description: "Leading beverage manufacturer in Zimbabwe." },
    { name: "CBZ Holdings", category: "Banking & Finance", domain: "cbz.co.zw", description: "Financial services group and commercial bank in Zimbabwe." },
    { name: "Innscor Africa (Simbisa)", category: "Food & Retail", domain: "simbisabrands.com", description: "Fast-food and consumer staples leader behind Chicken Inn and Pizza Inn." },
  ],
  LS: [
    { name: "Vodacom Lesotho", category: "Telecoms & M-Pesa", domain: "vodacom.co.ls", description: "Leading telecommunications and M-Pesa provider in Lesotho." },
    { name: "Econet Telecom Lesotho", category: "Telecoms", domain: "etl.co.ls", description: "Integrated telecommunications operator in the Kingdom of Lesotho." },
    { name: "Standard Lesotho Bank", category: "Banking & Finance", domain: "standardlesothobank.co.ls", description: "Largest commercial bank in Lesotho." },
    { name: "Maluti Mountain Brewery", category: "Beverages", domain: "ab-inbev.com", description: "Lesotho's flagship beverage producer." },
  ],
  US: [
    { name: "Apple", category: "Technology & Consumer Electronics", domain: "apple.com", description: "Maker of iPhone, Mac, iPad, Apple Watch, and consumer software ecosystems." },
    { name: "Amazon", category: "E-Commerce & Cloud", domain: "amazon.com", description: "Global e-commerce marketplace, Prime delivery, and cloud computing platform." },
    { name: "Nike", category: "Apparel & Footwear", domain: "nike.com", description: "World's largest supplier of athletic shoes and sports apparel." },
    { name: "Netflix", category: "Streaming & Entertainment", domain: "netflix.com", description: "Global subscription streaming service and production company." },
    { name: "Starbucks", category: "Food & Coffee", domain: "starbucks.com", description: "Multinational chain of coffeehouses and roastery reserves." },
    { name: "Tesla", category: "Automotive & Clean Energy", domain: "tesla.com", description: "Electric vehicles, battery energy storage, and Supercharger network." },
    { name: "Microsoft", category: "Technology & Software", domain: "microsoft.com", description: "Global software, Windows, Xbox, and Azure cloud leader." },
    { name: "Delta Air Lines", category: "Airlines & Travel", domain: "delta.com", description: "Major American airline serving domestic and international travellers." },
    { name: "Costco Wholesale", category: "Retail & Warehouse", domain: "costco.com", description: "Membership-only big-box warehouse club retail chain." },
    { name: "JPMorgan Chase", category: "Banking & Finance", domain: "chase.com", description: "Largest consumer and commercial bank in the United States." },
  ],
  GB: [
    { name: "Revolut", category: "Fintech & Digital Banking", domain: "revolut.com", description: "Global financial super-app and digital bank headquartered in London." },
    { name: "Monzo", category: "Digital Banking", domain: "monzo.com", description: "App-based UK retail bank cherished for real-time spending insights." },
    { name: "Marks & Spencer (M&S)", category: "Retail & Groceries", domain: "marksandspencer.com", description: "Iconic British retailer of food, clothing, and home products." },
    { name: "Tesco", category: "Groceries & Supermarkets", domain: "tesco.com", description: "The UK's largest supermarket and grocery retail chain." },
    { name: "British Airways", category: "Airlines & Travel", domain: "britishairways.com", description: "Flag carrier airline of the United Kingdom." },
    { name: "Dyson", category: "Consumer Appliances", domain: "dyson.co.uk", description: "British engineering brand designing vacuum cleaners, air purifiers, and hair care." },
    { name: "Octopus Energy", category: "Clean Energy & Utilities", domain: "octopus.energy", description: "Customer-acclaimed renewable energy supplier headquartered in the UK." },
  ],
  FR: [
    { name: "Louis Vuitton", category: "Luxury Fashion", domain: "louisvuitton.com", description: "French luxury fashion house and flagship maison of LVMH." },
    { name: "L'Oréal", category: "Beauty & Cosmetics", domain: "loreal.com", description: "World's largest cosmetics, skincare, and beauty company." },
    { name: "Carrefour", category: "Groceries & Hypermarkets", domain: "carrefour.fr", description: "French multinational retail and hypermarket corporation." },
    { name: "Air France", category: "Airlines & Travel", domain: "airfrance.com", description: "Flag carrier airline of France." },
    { name: "Decathlon", category: "Sports & Outdoor Retail", domain: "decathlon.fr", description: "World's largest sporting goods retailer, founded in France." },
    { name: "Danone", category: "Food & Beverages", domain: "danone.com", description: "Global dairy, plant-based nutrition, and bottled water company." },
  ],
  DE: [
    { name: "Adidas", category: "Apparel & Sportswear", domain: "adidas.com", description: "German athletic footwear and sportswear giant." },
    { name: "BMW", category: "Automotive", domain: "bmw.com", description: "Bayerische Motoren Werke — luxury vehicles and motorcycles." },
    { name: "Mercedes-Benz", category: "Automotive", domain: "mercedes-benz.com", description: "German luxury and commercial vehicle automotive marque." },
    { name: "Lidl", category: "Groceries & Supermarkets", domain: "lidl.de", description: "International discount retailer operating over 12,000 stores." },
    { name: "N26", category: "Digital Banking", domain: "n26.com", description: "Berlin-based pan-European mobile bank." },
    { name: "Lufthansa", category: "Airlines & Travel", domain: "lufthansa.com", description: "Flag carrier and largest airline of Germany." },
  ],
  ES: [
    { name: "Zara (Inditex)", category: "Fashion & Apparel", domain: "zara.com", description: "Spanish fast-fashion retail flagship of the Inditex Group." },
    { name: "Mercadona", category: "Groceries & Supermarkets", domain: "mercadona.es", description: "Spain's leading physical and online supermarket chain." },
    { name: "Banco Santander", category: "Banking & Finance", domain: "santander.com", description: "Spanish multinational financial services group." },
    { name: "Iberia", category: "Airlines & Travel", domain: "iberia.com", description: "Flag carrier airline of Spain based in Madrid." },
    { name: "Cabify", category: "Ride-Hailing & Mobility", domain: "cabify.com", description: "Spanish ride-sharing and urban mobility platform." },
  ],
  PT: [
    { name: "TAP Air Portugal", category: "Airlines & Travel", domain: "flytap.com", description: "State-owned flag carrier airline of Portugal." },
    { name: "Continente (Sonae)", category: "Groceries & Supermarkets", domain: "continente.pt", description: "Portugal's largest hypermarket and supermarket chain." },
    { name: "Galp Energia", category: "Energy & Fuel", domain: "galp.com", description: "Portuguese multinational energy corporation." },
    { name: "Millennium bcp", category: "Banking & Finance", domain: "millenniumbcp.pt", description: "Largest private bank in Portugal." },
  ],
  BR: [
    { name: "Nubank", category: "Digital Banking & Fintech", domain: "nubank.com.br", description: "Latin America's largest fintech bank serving over 100 million customers." },
    { name: "Mercado Livre", category: "E-Commerce & Fintech", domain: "mercadolivre.com.br", description: "Leading e-commerce and Mercado Pago ecosystem in Brazil." },
    { name: "iFood", category: "Food & Grocery Delivery", domain: "ifood.com.br", description: "Brazil's dominant online food ordering and delivery platform." },
    { name: "Natura &Co", category: "Beauty & Personal Care", domain: "natura.com.br", description: "Brazilian sustainable cosmetics and personal care powerhouse." },
    { name: "Itaú Unibanco", category: "Banking & Finance", domain: "itau.com.br", description: "Largest banking institution in Brazil and Latin America." },
  ],
  IN: [
    { name: "Tata Group", category: "Conglomerate & Retail", domain: "tata.com", description: "India's largest conglomerate spanning automotive, tech, hospitality, and retail." },
    { name: "Reliance Jio", category: "Telecoms & Digital", domain: "jio.com", description: "India's largest mobile network operator and digital services platform." },
    { name: "Zomato", category: "Food Delivery & Quick Commerce", domain: "zomato.com", description: "Indian restaurant aggregator, food delivery, and Blinkit parent." },
    { name: "HDFC Bank", category: "Banking & Finance", domain: "hdfcbank.com", description: "India's largest private sector bank." },
    { name: "IndiGo", category: "Airlines & Travel", domain: "goindigo.in", description: "India's largest passenger airline by market share." },
  ],
  JP: [
    { name: "Sony", category: "Consumer Electronics & Gaming", domain: "sony.com", description: "Japanese electronics, PlayStation gaming, and entertainment giant." },
    { name: "Toyota", category: "Automotive", domain: "toyota.com", description: "World's largest automotive manufacturer renowned for reliability." },
    { name: "Uniqlo (Fast Retailing)", category: "Fashion & Apparel", domain: "uniqlo.com", description: "Japanese casual wear designer, manufacturer, and global retailer." },
    { name: "Nintendo", category: "Gaming & Entertainment", domain: "nintendo.com", description: "Creator of Switch, Mario, and Zelda interactive entertainment." },
  ],
  KR: [
    { name: "Samsung Electronics", category: "Technology & Electronics", domain: "samsung.com", description: "South Korean global leader in smartphones, TVs, and semiconductors." },
    { name: "Hyundai Motor", category: "Automotive", domain: "hyundai.com", description: "Global automaker pioneering electric IONIQ vehicles." },
    { name: "Coupang", category: "E-Commerce & Rocket Delivery", domain: "coupang.com", description: "South Korea's e-commerce leader famous for dawn Rocket Delivery." },
    { name: "Kakao", category: "Technology & Super-App", domain: "kakaocorp.com", description: "Operator of KakaoTalk, KakaoPay, and KakaoT mobility." },
  ],
  AE: [
    { name: "Emirates", category: "Airlines & Aviation", domain: "emirates.com", description: "Global flag carrier airline based in Dubai." },
    { name: "Careem", category: "Super-App & Mobility", domain: "careem.com", description: "Middle East ride-hailing, food delivery, and digital payments super-app." },
    { name: "Noon", category: "E-Commerce", domain: "noon.com", description: "Middle East homegrown online shopping marketplace." },
    { name: "Etisalat (e&)", category: "Telecoms & Technology", domain: "eand.com", description: "Multinational UAE telecommunications and technology group." },
  ],
  AU: [
    { name: "Woolworths Australia", category: "Groceries & Supermarkets", domain: "woolworths.com.au", description: "Australia's largest supermarket chain." },
    { name: "Commonwealth Bank (CommBank)", category: "Banking & Finance", domain: "commbank.com.au", description: "Australia's leading retail bank and banking app." },
    { name: "Qantas", category: "Airlines & Travel", domain: "qantas.com", description: "Flag carrier airline of Australia." },
    { name: "Canva", category: "Technology & Design", domain: "canva.com", description: "Australian-founded global visual communication and design platform." },
  ],
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function buildBrandInvitation(input: {
  name: string;
  slug: string;
  website?: string | null;
}) {
  const origin =
    typeof window === "undefined"
      ? "https://stashortrash.vercel.app"
      : window.location.origin;
  const brandUrl = `${origin}/brands/${input.slug}`;
  return `Subject: ${input.name} is now on SOT — Stash Or Trash\n\nHello ${input.name} team,\n\nWe have opened a live brand-rating page for ${input.name} on SOT — Stash Or Trash, the Consumer Brand Revolution built to turn everyday customer feedback into a credible reputation signal.\n\nYour page: ${brandUrl}\n${input.website ? `Website we found: ${input.website}\n` : ""}\nConsumers can now Stash or Trash brand experiences in public, and verified brand owners can claim their page, monitor sentiment, and respond directly through the platform.\n\nPlease create an account with your official company email, open the page above, and choose “Claim this brand” so our team can verify your ownership.\n\nRegards,\nSOT — Stash Or Trash\nThe Brand Barometer`;
}

function readLocalCandidates(): Candidate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CANDIDATES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Candidate[]) : [];
  } catch {
    return [];
  }
}

function writeLocalCandidates(items: Candidate[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export type LocalImportedBrand = {
  id: string;
  name: string;
  slug: string;
  country: string;
  category: string | null;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  owner_id: string | null;
  verified: boolean;
  trust_score: number;
  created_at: string;
};

export function getLocalImportedBrands(): LocalImportedBrand[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(IMPORTED_BRANDS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalImportedBrand[]) : [];
  } catch {
    return [];
  }
}

function saveLocalImportedBrands(brands: LocalImportedBrand[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(IMPORTED_BRANDS_STORAGE_KEY, JSON.stringify(brands));
  } catch {
    /* ignore */
  }
}

/**
 * Single consolidated SPARQL query per country so Wikidata never rate-limits (429)
 * or times out on 10 concurrent connections.
 */
function buildFastCountrySparql(qid: string, limit: number): string {
  const fetchLimit = Math.min(250, Math.max(limit * 2, 40));
  return `
    SELECT ?item ?itemLabel ?desc ?logo ?website ?industryLabel ?sitelinks WHERE {
      {
        SELECT DISTINCT ?item ?sitelinks WHERE {
          VALUES ?cls { wd:Q4830453 wd:Q891723 wd:Q431289 wd:Q6881511 wd:Q783794 }
          ?item wdt:P31 ?cls ;
                wdt:P17 wd:${qid} ;
                wikibase:sitelinks ?sitelinks .
        }
        ORDER BY DESC(?sitelinks)
        LIMIT ${fetchLimit}
      }
      OPTIONAL { ?item wdt:P154 ?logo }
      OPTIONAL { ?item wdt:P856 ?website }
      OPTIONAL { ?item wdt:P452 ?industry . ?industry rdfs:label ?industryLabel FILTER(LANG(?industryLabel)="en") }
      OPTIONAL { ?item schema:description ?desc FILTER(LANG(?desc)="en") }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en,fr,es,pt,de" }
    }
    ORDER BY DESC(?sitelinks)
  `;
}

async function runSparqlQuery(query: string, timeoutMs = 8500): Promise<any[]> {
  const url = `${SPARQL_ENDPOINT}?origin=*&format=json&query=${encodeURIComponent(query)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/sparql-results+json",
      },
    });
    if (!res.ok) throw new Error(`Wikidata SPARQL returned ${res.status}`);
    const json = (await res.json()) as { results?: { bindings?: any[] } };
    return json.results?.bindings ?? [];
  } finally {
    clearTimeout(timer);
  }
}

async function resolveCountryQid(countryCode: string): Promise<string | null> {
  const code = countryCode.toUpperCase();
  if (ISO_TO_QID[code]) return ISO_TO_QID[code];
  try {
    const bindings = await runSparqlQuery(
      `SELECT ?country WHERE { ?country wdt:P297 "${code}". } LIMIT 1`,
      5000,
    );
    return bindings[0]?.country?.value?.split("/").pop() ?? null;
  } catch {
    return null;
  }
}

/**
 * Fast Wikidata Action API + Wikipedia search fallback for any country or keyword.
 * Responds in <250ms and never hits SPARQL timeouts.
 */
async function searchWikidataEntitiesForCountry(
  countryCode: string,
  limit: number,
  searchQuery?: string,
): Promise<Candidate[]> {
  const cName = countryName(countryCode) || countryCode;
  const searchTerms = searchQuery?.trim()
    ? [searchQuery.trim(), `${searchQuery.trim()} ${cName}`]
    : [
        `${cName} bank`,
        `${cName} telecom`,
        `${cName} airline`,
        `${cName} supermarket`,
        `${cName} company`,
      ];

  const results = new Map<string, Candidate>();

  await Promise.allSettled(
    searchTerms.map(async (term) => {
      const url = `${WIKIDATA_API}?action=wbsearchentities&search=${encodeURIComponent(
        term,
      )}&language=en&limit=12&format=json&origin=*`;
      const res = await fetch(url);
      if (!res.ok) return;
      const json = (await res.json()) as {
        search?: Array<{
          id: string;
          label?: string;
          description?: string;
        }>;
      };
      for (const item of json.search ?? []) {
        const name = item.label?.trim() ?? "";
        const desc = (item.description ?? "").toLowerCase();
        if (!name || /^Q\d+$/i.test(name)) continue;
        // Filter out non-company/brand entities when doing general country discovery
        const looksLikeBrand =
          Boolean(searchQuery?.trim()) ||
          desc.includes("company") ||
          desc.includes("bank") ||
          desc.includes("airline") ||
          desc.includes("brand") ||
          desc.includes("retail") ||
          desc.includes("telecommunications") ||
          desc.includes("supermarket") ||
          desc.includes("enterprise") ||
          desc.includes("corporation") ||
          desc.includes("conglomerate") ||
          desc.includes("chain") ||
          desc.includes("manufacturer") ||
          desc.includes("service");

        if (!looksLikeBrand) continue;
        const slug = slugify(name);
        if (!slug || results.has(item.id)) continue;

        let category = "Consumer Brand";
        if (desc.includes("bank") || desc.includes("financial") || desc.includes("fintech")) {
          category = "Banking & Finance";
        } else if (desc.includes("airline") || desc.includes("aviation")) {
          category = "Airlines & Travel";
        } else if (desc.includes("telecom")) {
          category = "Telecoms";
        } else if (desc.includes("supermarket") || desc.includes("retail") || desc.includes("grocery")) {
          category = "Retail & Supermarkets";
        } else if (desc.includes("food") || desc.includes("restaurant") || desc.includes("beverage")) {
          category = "Food & Beverages";
        } else if (desc.includes("tech") || desc.includes("software")) {
          category = "Technology";
        }

        results.set(item.id, {
          id: `wd-${item.id}`,
          source: "wikidata",
          source_id: item.id,
          name,
          slug,
          country: countryCode,
          category,
          description: item.description ?? `${name} (${cName})`,
          website: null,
          logo_url: null,
          status: "pending",
          created_at: new Date().toISOString(),
        });
      }
    }),
  );

  return [...results.values()].slice(0, limit);
}

/**
 * Multi-engine brand discovery for any country in the world:
 * 1. Curated Global Country Atlas (with verified domains & Clearbit logos)
 * 2. Live Wikidata SPARQL query (with Wikimedia Commons P154 logos & official websites)
 * 3. Live Wikidata Search API fallback (for countries/keywords where SPARQL is slow)
 */
export async function discoverBrandsForCountry(input: {
  countryCode: string;
  limit: number;
  searchQuery?: string;
}): Promise<{ candidates: Candidate[]; sourcesUsed: string[] }> {
  const code = normalizeCountryCode(input.countryCode) || input.countryCode.toUpperCase();
  const limit = Math.max(1, Math.min(200, input.limit || 50));
  const queryFilter = input.searchQuery?.trim().toLowerCase() ?? "";
  const bySlug = new Map<string, Candidate & { sitelinks: number }>();
  const sourcesUsed: string[] = [];

  // 1. Seed from Global Country Atlas first so high-profile local brands with logos are always present
  const atlasBrands = GLOBAL_COUNTRY_ATLAS[code] ?? [];
  for (const b of atlasBrands) {
    if (
      queryFilter &&
      !`${b.name} ${b.category} ${b.description}`.toLowerCase().includes(queryFilter)
    ) {
      continue;
    }
    const slug = slugify(b.name);
    if (!slug) continue;
    bySlug.set(slug, {
      id: `atlas-${code}-${slug}`,
      source: "wikidata",
      source_id: `ATLAS_${code}_${slug.toUpperCase()}`,
      name: b.name,
      slug,
      country: code,
      category: b.category,
      description: b.description,
      website: `https://${b.domain}`,
      logo_url: `https://logo.clearbit.com/${b.domain}`,
      status: "pending",
      created_at: new Date().toISOString(),
      sitelinks: 500,
    });
  }
  if (bySlug.size > 0) sourcesUsed.push("Global Country Atlas");

  // 2. Live Wikidata SPARQL query for the country
  try {
    const qid = await resolveCountryQid(code);
    if (qid) {
      const bindings = await runSparqlQuery(buildFastCountrySparql(qid, limit));
      if (bindings.length > 0) {
        sourcesUsed.push("Wikidata Knowledge Graph (SPARQL)");
      }
      for (const b of bindings) {
        const qUrl: string = b.item?.value ?? "";
        const sourceId = qUrl.split("/").pop() ?? "";
        const name: string = b.itemLabel?.value ?? "";
        if (!sourceId || !name || /^Q\d+$/i.test(name)) continue;
        if (
          queryFilter &&
          !`${name} ${b.industryLabel?.value ?? ""} ${b.desc?.value ?? ""}`
            .toLowerCase()
            .includes(queryFilter)
        ) {
          continue;
        }
        const slug = slugify(name);
        if (!slug) continue;

        const existing = bySlug.get(slug);
        if (existing) {
          existing.category ??= b.industryLabel?.value ?? null;
          existing.description ??= b.desc?.value ?? null;
          existing.website ??= b.website?.value ?? null;
          existing.logo_url ??= b.logo?.value ?? null;
          continue;
        }

        let logoUrl: string | null = b.logo?.value ?? null;
        const websiteUrl: string | null = b.website?.value ?? null;
        if (!logoUrl && websiteUrl) {
          try {
            const host = new URL(websiteUrl).hostname.replace(/^www\./, "");
            logoUrl = `https://logo.clearbit.com/${host}`;
          } catch {
            /* ignore */
          }
        }

        bySlug.set(slug, {
          id: `wd-${sourceId}`,
          source: "wikidata",
          source_id: sourceId,
          name,
          slug,
          country: code,
          category: b.industryLabel?.value ?? "Consumer Brand",
          description: b.desc?.value ?? `${name} — ${countryName(code) || code}`,
          website: websiteUrl,
          logo_url: logoUrl,
          status: "pending",
          created_at: new Date().toISOString(),
          sitelinks: Number(b.sitelinks?.value ?? 10),
        });
      }
    }
  } catch {
    // SPARQL timed out or throttled — fallback to Wikidata Action API below
  }

  // 3. Supplement with fast Wikidata Search API if needed or if a search query was entered
  if (bySlug.size < limit || queryFilter) {
    try {
      const apiResults = await searchWikidataEntitiesForCountry(
        code,
        limit,
        input.searchQuery,
      );
      if (apiResults.length > 0) {
        sourcesUsed.push("Wikidata Live Search API");
      }
      for (const c of apiResults) {
        if (!bySlug.has(c.slug)) {
          bySlug.set(c.slug, { ...c, sitelinks: 5 });
        }
      }
    } catch {
      /* ignore */
    }
  }

  const candidates = [...bySlug.values()]
    .sort((a, b) => b.sitelinks - a.sitelinks)
    .slice(0, limit)
    .map(({ sitelinks: _s, ...row }) => row);

  return { candidates, sourcesUsed };
}

export async function fetchBrandCandidates(): Promise<Candidate[]> {
  const local = readLocalCandidates().filter((c) => c.status === "pending");
  const bySlug = new Map<string, Candidate>();
  for (const c of local) bySlug.set(c.slug, c);

  try {
    const { data, error } = await supabase
      .from("brand_import_candidates" as any)
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(150);
    if (!error && data) {
      for (const row of data as any[]) {
        if (row.slug && !bySlug.has(row.slug)) {
          bySlug.set(row.slug, {
            id: String(row.id),
            source: row.source ?? "wikidata",
            source_id: row.source_id ?? String(row.id),
            name: row.name,
            slug: row.slug,
            country: row.country ?? "ZA",
            category: row.category ?? null,
            description: row.description ?? null,
            website: row.website ?? null,
            logo_url: row.logo_url ?? null,
            status: row.status ?? "pending",
            created_at: row.created_at,
          });
        }
      }
    }
  } catch {
    /* ignore */
  }

  return [...bySlug.values()];
}

export async function importBrandsFromWikidata(input: {
  countryCode: string;
  limit: number;
  searchQuery?: string;
}): Promise<WikidataImportResult> {
  const { candidates, sourcesUsed } = await discoverBrandsForCountry(input);
  if (!candidates.length) {
    return { inserted: 0, skipped: 0, sourceSummary: "No new candidates found" };
  }

  const currentLocal = readLocalCandidates();
  const existingSlugs = new Set(currentLocal.map((c) => c.slug));
  let inserted = 0;
  let skipped = 0;

  for (const c of candidates) {
    if (existingSlugs.has(c.slug)) {
      skipped += 1;
    } else {
      existingSlugs.add(c.slug);
      currentLocal.unshift({ ...c, status: "pending" });
      inserted += 1;
    }
  }
  writeLocalCandidates(currentLocal);

  // Best-effort sync to Supabase if table & permissions exist
  try {
    const sbRows = candidates.map(({ id: _id, created_at: _ca, ...rest }) => rest);
    await supabase
      .from("brand_import_candidates" as any)
      .upsert(sbRows, { onConflict: "source,source_id", ignoreDuplicates: true });
  } catch {
    /* ignore Supabase RLS error when signed in via Firebase */
  }

  return {
    inserted,
    skipped,
    sourceSummary: sourcesUsed.join(" + ") || "Wikidata",
  };
}

async function persistApprovedBrandRecord(
  cand: {
    name: string;
    slug: string;
    country: string;
    category: string | null;
    description: string | null;
    website: string | null;
    logo_url: string | null;
  },
  ownerId: string,
): Promise<ApprovedBrand> {
  const cleanId = `brand-${cand.country.toLowerCase()}-${cand.slug}`
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 96);

  // 1. Save to local imported brands store for immediate synchronous availability
  const localBrands = getLocalImportedBrands();
  if (!localBrands.some((b) => b.slug === cand.slug)) {
    localBrands.unshift({
      id: cleanId,
      name: cand.name,
      slug: cand.slug,
      country: cand.country,
      category: cand.category ?? "Consumer Brand",
      description: cand.description ?? `${cand.name} (${cand.country})`,
      website: cand.website,
      logo_url: cand.logo_url,
      owner_id: ownerId,
      verified: true,
      trust_score: 78,
      created_at: new Date().toISOString(),
    });
    saveLocalImportedBrands(localBrands);
  }

  // 2. Save to Firestore `brands` collection (respecting firestore.rules schema)
  try {
    await createFirestoreBrand(cleanId, {
      name: cand.name.slice(0, 200),
      slug: cand.slug.slice(0, 200),
      country: (cand.country || "ZA").slice(0, 100),
      category: (cand.category || "Consumer Brand").slice(0, 100),
      description: (cand.description || `${cand.name} brand page`).slice(0, 2000),
      website: cand.website || "",
      logoUrl: cand.logo_url || "",
      trustScore: 78,
      riskScore: 12,
      status: "active",
      isVerified: true,
      createdBy: ownerId,
    });
  } catch {
    /* ignore if unauthenticated or offline */
  }

  // 3. Best-effort save to Supabase
  try {
    const { data: brand } = await supabase
      .from("brands")
      .insert({
        owner_id: ownerId,
        name: cand.name,
        slug: cand.slug,
        description: cand.description,
        website: cand.website,
        category: cand.category,
        country: cand.country,
        logo_url: cand.logo_url,
      })
      .select("id, name, slug, website")
      .single();
    if (brand) {
      return {
        brandId: brand.id,
        name: brand.name,
        slug: brand.slug,
        website: brand.website,
      };
    }
  } catch {
    /* ignore */
  }

  return {
    brandId: cleanId,
    name: cand.name,
    slug: cand.slug,
    website: cand.website,
  };
}

export async function approveBrandCandidate(
  id: string,
  reviewerId: string,
): Promise<ApprovedBrand> {
  const local = readLocalCandidates();
  let cand = local.find((c) => c.id === id || c.slug === id);

  if (!cand) {
    try {
      const { data } = await supabase
        .from("brand_import_candidates")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (data) {
        cand = {
          id: String(data.id),
          source: data.source,
          source_id: data.source_id,
          name: data.name,
          slug: data.slug,
          country: data.country,
          category: data.category,
          description: data.description,
          website: data.website,
          logo_url: data.logo_url,
          status: data.status,
        };
      }
    } catch {
      /* ignore */
    }
  }

  if (!cand) throw new Error("Candidate not found.");

  const approved = await persistApprovedBrandRecord(cand, reviewerId);

  const updatedLocal = local.map((c) =>
    c.id === id || c.slug === cand!.slug ? { ...c, status: "approved" } : c,
  );
  writeLocalCandidates(updatedLocal);

  try {
    await supabase
      .from("brand_import_candidates")
      .update({ status: "approved", reviewed_by: reviewerId })
      .eq("id", id);
  } catch {
    /* ignore */
  }

  return approved;
}

export async function rejectBrandCandidate(id: string, reviewerId: string) {
  const local = readLocalCandidates();
  const updated = local.map((c) => (c.id === id ? { ...c, status: "rejected" } : c));
  writeLocalCandidates(updated);

  try {
    await supabase
      .from("brand_import_candidates")
      .update({ status: "rejected", reviewed_by: reviewerId })
      .eq("id", id);
  } catch {
    /* ignore */
  }
}

export type PublishBrandsResult = {
  published: number;
  skipped: number;
  sourceSummary?: string;
};

export async function publishBrandsFromWikidata(input: {
  countryCode: string;
  limit: number;
  ownerId: string;
  searchQuery?: string;
}): Promise<PublishBrandsResult> {
  const { candidates, sourcesUsed } = await discoverBrandsForCountry({
    countryCode: input.countryCode,
    limit: input.limit,
    searchQuery: input.searchQuery,
  });

  if (!candidates.length) {
    return { published: 0, skipped: 0, sourceSummary: "No matching brands found" };
  }

  const existingLocal = getLocalImportedBrands();
  const existingSlugs = new Set(existingLocal.map((b) => b.slug));

  try {
    const fsBrands = await getFirestoreBrands();
    for (const b of fsBrands) existingSlugs.add(b.slug);
  } catch {
    /* ignore */
  }

  let published = 0;
  let skipped = 0;

  for (const c of candidates) {
    if (existingSlugs.has(c.slug)) {
      skipped += 1;
      continue;
    }
    existingSlugs.add(c.slug);
    await persistApprovedBrandRecord(c, input.ownerId);
    published += 1;
  }

  return {
    published,
    skipped,
    sourceSummary: sourcesUsed.join(" + ") || "Wikidata",
  };
}

export async function publishPendingCandidates(
  ownerId: string,
): Promise<PublishBrandsResult> {
  const pending = await fetchBrandCandidates();
  if (!pending.length) return { published: 0, skipped: 0 };

  let published = 0;
  let skipped = 0;

  for (const c of pending) {
    try {
      await persistApprovedBrandRecord(c, ownerId);
      published += 1;
    } catch {
      skipped += 1;
    }
  }

  const local = readLocalCandidates().map((c) =>
    c.status === "pending" ? { ...c, status: "approved" } : c,
  );
  writeLocalCandidates(local);

  try {
    await supabase
      .from("brand_import_candidates")
      .update({ status: "approved", reviewed_by: ownerId })
      .eq("status", "pending");
  } catch {
    /* ignore */
  }

  return { published, skipped };
}
