// Additional native translations for launch languages:
// Setswana (tn), Hausa (ha), Yorùbá (yo), Igbo (ig), Amharic (am), Sepedi (nso),
// Hebrew (he), Persian/Farsi (fa), Urdu (ur), Bengali (bn), Tamil (ta), Telugu (te),
// Marathi (mr), Gujarati (gu), Punjabi (pa), Thai (th), Vietnamese (vi), Malay (ms),
// Filipino (fil), Romanian (ro), Swedish (sv), Norwegian (no), Danish (da), Finnish (fi),
// Czech (cs), Slovak (sk), Hungarian (hu), Greek (el), Ukrainian (uk), Bulgarian (bg).

export const extraTranslations: Record<string, Record<string, any>> = {
  tn: { // Setswana
    nav: { feed: "Ditiro", brands: "Mabokgoni", messages: "Melaetsa", awards: "Dikhumagadi", dashboard: "Letlapa", admin: "Molaodi", profile: "Poeletso", post: "Poso", signIn: "Tsena", signOut: "Tswa" },
    vote: { stash: "Boloka", trash: "Latlha", noVotes: "Ga gona ditlhopho", signInPrompt: "Tsena go romela katlholo ya gago.", stashCount: "{{count}} boloka", trashCount: "{{count}} latlha" },
    auth: { signIn: "Tsena", signUp: "Ikwadise", email: "Imeile", password: "Khunololo", displayName: "Leina la gago", createAccount: "Bopa akhaonto", continueGoogle: "Tswelela ka Google", welcome: "Re a go amogela gape!" },
    brand: { title: "Mabokgoni", subtitle: "Mabokgoni a a netefaditsweng le ditshwetso tsa setshaba.", verified: "Netefaditswe", trustScore: "Tekanyetso ya tshepo", searchPlaceholder: "Batla mabokgoni..." },
    awards: { title: "Dikhumagadi tsa SOT", tagline: "Sekala sa Tshepo sa Mabokgoni", leaderboard: "Ba ba eteletseng pele" }
  },
  ha: { // Hausa
    nav: { feed: "Labarai", brands: "Kamfanoni", messages: "Saƙonni", awards: "Kyaututtuka", dashboard: "Allon Sarauta", admin: "Gudanarwa", profile: "Bayanai", post: "Aika", signIn: "Shiga", signOut: "Fita" },
    vote: { stash: "Ajiye", trash: "Zubar", noVotes: "Babu ƙuri'u tukuna", signInPrompt: "Shiga don bayar da ra'ayinka.", stashCount: "{{count}} an ajiye", trashCount: "{{count}} an zubar" },
    auth: { signIn: "Shiga", signUp: "Yi Rajista", email: "Imel", password: "Kalmar sirri", displayName: "Sunan nuni", createAccount: "Ƙirƙiri asusu", continueGoogle: "Ci gaba da Google", welcome: "Barka da dawowa!" },
    brand: { title: "Kamfanoni", subtitle: "Tantanceccen kamfanoni da ra'ayoyin jama'a kai tsaye.", verified: "An tabbatar", trustScore: "Makin amana", searchPlaceholder: "Nemi kamfani..." },
    awards: { title: "Kyaututtukan SOT", tagline: "Mizanin Amincewa da Alamar Kasuwanci", leaderboard: "Jagororin Shekara" }
  },
  yo: { // Yorùbá
    nav: { feed: "Àfikún", brands: "Àwọn Ilé-iṣẹ́", messages: "Àwọn Ifiranṣẹ", awards: "Àwọn Àmì-ẹ̀yẹ", dashboard: "Pẹpẹ Iṣẹ́", admin: "Alákoso", profile: "Profaili", post: "Firanṣẹ", signIn: "Wọlé", signOut: "Jáde" },
    vote: { stash: "Tọ́jú", trash: "Dà nù", noVotes: "Kò tíì sí ìbò", signInPrompt: "Wọlé láti sọ èrò rẹ.", stashCount: "{{count}} tọ́jú", trashCount: "{{count}} dà nù" },
    auth: { signIn: "Wọlé", signUp: "Forúkọsílẹ̀", email: "Imeeli", password: "Ọrọ̀ aṣínà", displayName: "Orukọ rẹ", createAccount: "Ṣẹ̀dá àkọọ́lẹ̀", continueGoogle: "Tẹ̀síwájú pẹ̀lú Google", welcome: "Ẹ káàbọ̀ padà!" },
    brand: { title: "Àwọn Ilé-iṣẹ́", subtitle: "Àwọn ilé-iṣẹ́ tí a fọwọ́sí àti ìdájọ́ àwùjọ lórí wọn.", verified: "Fọwọ́sí", trustScore: "Iye ìgbẹ́kẹ̀lé", searchPlaceholder: "Wa àwọn ilé-iṣẹ́..." },
    awards: { title: "Àwọn Àmì-ẹ̀yẹ SOT", tagline: "Iwọn Ìgbẹ́kẹ̀lé Ilé-iṣẹ́", leaderboard: "Àtẹ Àwọn Asiwaju" }
  },
  ig: { // Igbo
    nav: { feed: "Ihe ọhụrụ", brands: "Ụdị Ngwaahịa", messages: "Ozi", awards: "Ihe nrite", dashboard: "Mpempe akwụkwọ", admin: "Onye nlekọta", profile: "Profaịlụ", post: "Zipu", signIn: "Banye", signOut: "Pụọ" },
    vote: { stash: "Chekwaa", trash: "Tụfuo", noVotes: "Enweghị ntuli aka", signInPrompt: "Banye ka ikpebie.", stashCount: "{{count}} chekwaa", trashCount: "{{count}} tụfuo" },
    auth: { signIn: "Banye", signUp: "Debanye aha", email: "Ozi email", password: "Okwu nzuzo", displayName: "Aha ngosi", createAccount: "Mepụta akaụntụ", continueGoogle: "Gaa n'ihu na Google", welcome: "Nnọọ ọzọ!" },
    brand: { title: "Ụdị Ngwaahịa", subtitle: "Ụdị ngwaahịa kwadoro na mkpebi ndị mmadụ.", verified: "Kwadoro", trustScore: "Akara ntụkwasị obi", searchPlaceholder: "Chọọ ụdị..." },
    awards: { title: "Ihe nrite SOT", tagline: "Tebụl Ntụkwasị Obi Ụdị Ngwaahịa", leaderboard: "Ndị kachasị n'elu" }
  },
  am: { // Amharic
    nav: { feed: "ምግቦች", brands: "ብራንዶች", messages: "መልዕክቶች", awards: "ሽልማቶች", dashboard: "ዳሽቦርድ", admin: "አስተዳዳሪ", profile: "መገለጫ", post: "ለጥፍ", signIn: "ግባ", signOut: "ውጣ" },
    vote: { stash: "አስቀምጥ", trash: "ጣለው", noVotes: "እስካሁን ድምጽ የለም", signInPrompt: "ውሳኔዎን ለመስጠት ይግቡ።", stashCount: "{{count}} አስቀምጥ", trashCount: "{{count}} ጣለው" },
    auth: { signIn: "ግባ", signUp: "ይመዝገቡ", email: "ኢሜይል", password: "የይለፍ ቃል", displayName: "የማሳያ ስም", createAccount: "መለያ ፍጠር", continueGoogle: "በGoogle ቀጥል", welcome: "እንኳን ደህና መጡ!" },
    brand: { title: "ብራንዶች", subtitle: "የተረጋገጡ ብራንዶች እና የቀጥታ ማህበረሰብ ውሳኔዎች።", verified: "የተረጋገጠ", trustScore: "የእምነት ደረጃ", searchPlaceholder: "ብራንዶችን ፈልግ..." },
    awards: { title: "የSOT ሽልማቶች", tagline: "የብራንድ እምነት መለኪያ", leaderboard: "የደረጃ ሰንጠረዥ" }
  },
  nso: { // Sepedi / Northern Sotho
    nav: { feed: "Dikagare", brands: "Mabrande", messages: "Melaetsa", awards: "Difoka", dashboard: "Dashboto", admin: "Molaodi", profile: "Boitsebišo", post: "Pasa", signIn: "Tsena", signOut: "Tšwa" },
    vote: { stash: "Boloka", trash: "Lahla", noVotes: "Ga go dikgetho tša bjale", signInPrompt: "Tsena go fana ka kahlolo ya gago.", stashCount: "{{count}} boloka", trashCount: "{{count}} lahla" },
    auth: { signIn: "Tsena", signUp: "Ingwadiše", email: "Imeile", password: "Phasewete", displayName: "Leina la go bonala", createAccount: "Hlama akhaonto", continueGoogle: "Tšwela pele ka Google", welcome: "O amogetšwe gape!" },
    brand: { title: "Mabrande", subtitle: "Mabrande a a netefaditšwego le dikahlolo tša setšhaba.", verified: "Netefaditšwe", trustScore: "Tekanyetšo ya tshepo", searchPlaceholder: "Nyaka mabrande..." },
    awards: { title: "Difoka tša SOT", tagline: "Tekanyetšo ya Tshepo ya Brand", leaderboard: "Baetapele ba Ngwaga" }
  },
  he: { // Hebrew (RTL)
    nav: { feed: "פיד", brands: "מותגים", messages: "הודעות", awards: "פרסים", dashboard: "לוח בקרה", admin: "ניהול", profile: "פרופיל", post: "פרסם", signIn: "התחבר", signOut: "התנתק" },
    vote: { stash: "לשמור", trash: "לזרוק", noVotes: "אין עדיין קולות", signInPrompt: "התחבר כדי לתת את פסק הדין שלך.", stashCount: "{{count}} שמרו", trashCount: "{{count}} זרקו" },
    auth: { signIn: "התחבר", signUp: "הרשם", email: "דוא״ל", password: "סיסמה", displayName: "שם תצוגה", createAccount: "צור חשבון", continueGoogle: "המשך עם Google", welcome: "ברוך שובך!" },
    brand: { title: "מותגים", subtitle: "מותגים מאומתים ופסקי הדין של הקהילה בזמן אמת.", verified: "מאומת", trustScore: "מדד אמון", searchPlaceholder: "חפש מותגים..." },
    awards: { title: "פרסי SOT", tagline: "ברומטר אמון המותגים", leaderboard: "טבלת המובילים" }
  },
  fa: { // Persian (RTL)
    nav: { feed: "فید", brands: "برندها", messages: "پیام‌ها", awards: "جوایز", dashboard: "داشبورد", admin: "مدیریت", profile: "پروفایل", post: "ارسال", signIn: "ورود", signOut: "خروج" },
    vote: { stash: "نگه‌داری", trash: "رد کردن", noVotes: "هنوز رأیی ثبت نشده", signInPrompt: "برای ثبت رأی خود وارد شوید.", stashCount: "{{count}} نگه‌داری", trashCount: "{{count}} رد کردن" },
    auth: { signIn: "ورود", signUp: "ثبت‌نام", email: "ایمیل", password: "رمز عبور", displayName: "نام نمایشی", createAccount: "ایجاد حساب", continueGoogle: "ادامه با گوگل", welcome: "خوش آمدید!" },
    brand: { title: "برندها", subtitle: "برندهای تأیید شده و قضاوت‌های زنده جامعه.", verified: "تأیید شده", trustScore: "امتیاز اعتماد", searchPlaceholder: "جستجوی برندها..." },
    awards: { title: "جوایز SOT", tagline: "فشارسنج اعتماد به برند", leaderboard: "جدول پیشتازان" }
  },
  ur: { // Urdu (RTL)
    nav: { feed: "فیڈ", brands: "برانڈز", messages: "پیغامات", awards: "ایوارڈز", dashboard: "ڈیش بورڈ", admin: "ایڈمن", profile: "پروفائل", post: "پوسٹ", signIn: "لاگ ان", signOut: "لاگ آؤٹ" },
    vote: { stash: "رکھیں", trash: "مسترد", noVotes: "ابھی تک کوئی ووٹ نہیں", signInPrompt: "اپنا فیصلہ دینے کے لیے لاگ ان کریں۔", stashCount: "{{count}} رکھیں", trashCount: "{{count}} مسترد" },
    auth: { signIn: "لاگ ان", signUp: "سائن اپ", email: "ای میل", password: "پاس ورڈ", displayName: "نام", createAccount: "اکاؤنٹ بنائیں", continueGoogle: "گوگل کے ساتھ جاری رکھیں", welcome: "خوش آمدید!" },
    brand: { title: "برانڈز", subtitle: "تصدیق شدہ برانڈز اور عوام کا براہ راست فیصلہ۔", verified: "تصدیق شدہ", trustScore: "اعتماد کا اسکور", searchPlaceholder: "برانڈ تلاش کریں..." },
    awards: { title: "ایس او ٹی ایوارڈز", tagline: "برانڈ پر عوام کے اعتماد کا پیمانہ", leaderboard: "لیڈر بورڈ" }
  },
  bn: { // Bengali
    nav: { feed: "ফিড", brands: "ব্র্যান্ডস", messages: "বার্তা", awards: "পুরস্কার", dashboard: "ড্যাশবোর্ড", admin: "অ্যাডমিন", profile: "প্রোফাইল", post: "পোস্ট", signIn: "সাইন ইন", signOut: "সাইন আউট" },
    vote: { stash: "রাখুন", trash: "বাতিল", noVotes: "এখনও কোন ভোট নেই", signInPrompt: "আপনার রায় জানাতে সাইন ইন করুন।", stashCount: "{{count}} রাখুন", trashCount: "{{count}} বাতিল" },
    auth: { signIn: "সাইন ইন", signUp: "সাইন আপ", email: "ইমেল", password: "পাসওয়ার্ড", displayName: "নাম", createAccount: "অ্যাকাউন্ট তৈরি করুন", continueGoogle: "Google দিয়ে চালিয়ে যান", welcome: "স্বাগতম!" },
    brand: { title: "ব্র্যান্ডস", subtitle: "যাচাইকৃত ব্র্যান্ড এবং তাদের ওপর জনসাধারণের সরাসরি রায়।", verified: "যাচাইকৃত", trustScore: "আস্থার স্কোর", searchPlaceholder: "ব্র্যান্ড খুঁজুন..." },
    awards: { title: "SOT পুরস্কার", tagline: "ব্র্যান্ড আস্থার ব্যারোমিটার", leaderboard: "শীর্ষ তালিকা" }
  },
  ta: { // Tamil
    nav: { feed: "பதிவுகள்", brands: "பிராண்டுகள்", messages: "செய்திகள்", awards: "விருதுகள்", dashboard: "முகப்பு பலகை", admin: "நிர்வாகி", profile: "சுயவிவரம்", post: "பதிவிடு", signIn: "உள்நுழைக", signOut: "வெளியேறுக" },
    vote: { stash: "சேமி", trash: "நிராகரி", noVotes: "வாக்குகள் இல்லை", signInPrompt: "உங்கள் தீர்ப்பை வழங்க உள்நுழைக.", stashCount: "{{count}} சேமி", trashCount: "{{count}} நிராகரி" },
    auth: { signIn: "உள்நுழைக", signUp: "பதிவு செய்க", email: "மின்னஞ்சல்", password: "கடவுச்சொல்", displayName: "பெயர்", createAccount: "கணக்கை உருவாக்குக", continueGoogle: "Google உடன் தொடர்க", welcome: "மீண்டும் வருக!" },
    brand: { title: "பிராண்டுகள்", subtitle: "சரிபார்க்கப்பட்ட பிராண்டுகள் மற்றும் மக்களின் நேரடித் தீர்ப்பு.", verified: "சரிபார்க்கப்பட்டது", trustScore: "நம்பகத்தன்மை மதிப்பெண்", searchPlaceholder: "பிராண்டைத் தேடுக..." },
    awards: { title: "SOT விருதுகள்", tagline: "பிராண்ட் நம்பிக்கையின் அளவுமானி", leaderboard: "முன்னணி பட்டியல்" }
  },
  te: { // Telugu
    nav: { feed: "ఫీడ్", brands: "బ్రాండ్‌లు", messages: "సందేశాలు", awards: "అవార్డులు", dashboard: "డ్యాష్‌బోర్డ్", admin: "అడ్మిన్", profile: "ప్రొఫైల్", post: "పోస్ట్", signIn: "సైన్ ఇన్", signOut: "సైన్ అవుట్" },
    vote: { stash: "ఉంచు", trash: "వద్దు", noVotes: "ఇంకా ఓట్లు లేవు", signInPrompt: "మీ తీర్పు చెప్పడానికి సైన్ ఇన్ చేయండి.", stashCount: "{{count}} ఉంచు", trashCount: "{{count}} వద్దు" },
    auth: { signIn: "సైన్ ఇన్", signUp: "సైన్ అప్", email: "ఈమెయిల్", password: "పాస్‌వర్డ్", displayName: "పేరు", createAccount: "ఖాతాను సృష్టించండి", continueGoogle: "Googleతో కొనసాగించండి", welcome: "స్వాగతం!" },
    brand: { title: "బ్రాండ్‌లు", subtitle: "ధృవీకరించబడిన బ్రాండ్‌లు మరియు ప్రజల ప్రత్యక్ష తీర్పులు.", verified: "ధృవీకరించబడింది", trustScore: "విశ్వసనీయత స్కోర్", searchPlaceholder: "బ్రాండ్‌లను శోధించండి..." },
    awards: { title: "SOT అవార్డులు", tagline: "బ్రాండ్ విశ్వసనీయత బేరోమీటర్", leaderboard: "లీడర్‌బోర్డ్" }
  },
  mr: { // Marathi
    nav: { feed: "फीड", brands: "ब्रँड्स", messages: "संदेश", awards: "पुरस्कार", dashboard: "डॅशबोर्ड", admin: "प्रशासक", profile: "प्रोफाइल", post: "पोस्ट", signIn: "साइन इन", signOut: "बाहेर पडा" },
    vote: { stash: "ठेवा", trash: "नको", noVotes: "अद्याप मते नाहीत", signInPrompt: "आपला निर्णय देण्यासाठी साइन इन करा.", stashCount: "{{count}} ठेवा", trashCount: "{{count}} नको" },
    auth: { signIn: "साइन इन", signUp: "नोंदणी करा", email: "ईमेल", password: "पासवर्ड", displayName: "नाव", createAccount: "खाते तयार करा", continueGoogle: "Google सह पुढे जा", welcome: "स्वागत आहे!" },
    brand: { title: "ब्रँड्स", subtitle: "प्रमाणित ब्रँड्स आणि लोकांचे थेट अभिप्राय.", verified: "प्रमाणित", trustScore: "विश्वासार्हता धावसंख्या", searchPlaceholder: "ब्रँड शोधा..." },
    awards: { title: "SOT पुरस्कार", tagline: "ब्रँड विश्वासाचे मोजमाप", leaderboard: "अव्वल यादी" }
  },
  gu: { // Gujarati
    nav: { feed: "ફીડ", brands: "બ્રાન્ડ્સ", messages: "સંદેશાઓ", awards: "એવોર્ડ્સ", dashboard: "ડેશબોર્ડ", admin: "એડમિન", profile: "પ્રોફાઇલ", post: "પોસ્ટ", signIn: "સાઇન ઇન", signOut: "સાઇન આઉટ" },
    vote: { stash: "સાચવો", trash: "નકારો", noVotes: "હજી સુધી કોઈ મત નથી", signInPrompt: "તમારો નિર્ણય આપવા માટે સાઇન ઇન કરો.", stashCount: "{{count}} સાચવો", trashCount: "{{count}} નકારો" },
    auth: { signIn: "સાઇન ઇન", signUp: "સાઇન અપ", email: "ઇમેઇલ", password: "પાસવર્ડ", displayName: "નામ", createAccount: "એકાઉન્ટ બનાવો", continueGoogle: "Google સાથે ચાલુ રાખો", welcome: "સ્વાગત છે!" },
    brand: { title: "બ્રાન્ડ્સ", subtitle: "ચકાસાયેલ બ્રાન્ડ્સ અને જનતાના નિર્ણયો.", verified: "ચકાસાયેલ", trustScore: "વિશ્વાસ સ્કોર", searchPlaceholder: "બ્રાન્ડ શોધો..." },
    awards: { title: "SOT એવોર્ડ્સ", tagline: "બ્રાન્ડ વિશ્વાસનું માપદંડ", leaderboard: "લીડરબોર્ડ" }
  },
  pa: { // Punjabi
    nav: { feed: "ਫੀਡ", brands: "ਬ੍ਰਾਂਡ", messages: "ਸੁਨੇਹੇ", awards: "ਇਨਾਮ", dashboard: "ਡੈਸ਼ਬੋਰਡ", admin: "ਐਡਮਿਨ", profile: "ਪ੍ਰੋਫਾਈਲ", post: "ਪੋਸਟ", signIn: "ਸਾਈਨ ਇਨ", signOut: "ਸਾਈਨ ਆਊਟ" },
    vote: { stash: "ਰੱਖੋ", trash: "ਰੱਦ", noVotes: "ਕੋਈ ਵੋਟ ਨਹੀਂ", signInPrompt: "ਆਪਣਾ ਫੈਸਲਾ ਦੇਣ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ।", stashCount: "{{count}} ਰੱਖੋ", trashCount: "{{count}} ਰੱਦ" },
    auth: { signIn: "ਸਾਈਨ ਇਨ", signUp: "ਸਾਈਨ ਅੱਪ", email: "ਈਮੇਲ", password: "ਪਾਸਵਰਡ", displayName: "ਨਾਮ", createAccount: "ਖਾਤਾ ਬਣਾਓ", continueGoogle: "Google ਨਾਲ ਜਾਰੀ ਰੱਖੋ", welcome: "ਜੀ ਆਇਆਂ ਨੂੰ!" },
    brand: { title: "ਬ੍ਰਾਂਡ", subtitle: "ਪ੍ਰਮਾਣਿਤ ਬ੍ਰਾਂਡ ਅਤੇ ਲੋਕਾਂ ਦਾ ਫੈਸਲਾ।", verified: "ਪ੍ਰਮਾਣਿਤ", trustScore: "ਭਰੋਸਾ ਸਕੋਰ", searchPlaceholder: "ਬ੍ਰਾਂਡ ਖੋਜੋ..." },
    awards: { title: "SOT ਇਨਾਮ", tagline: "ਬ੍ਰਾਂਡ ਭਰੋਸੇ ਦਾ ਪੈਮਾਨਾ", leaderboard: "ਲੀਡਰਬੋਰਡ" }
  },
  th: { // Thai
    nav: { feed: "ฟีด", brands: "แบรนด์", messages: "ข้อความ", awards: "รางวัล", dashboard: "แดชบอร์ด", admin: "ผู้ดูแลระบบ", profile: "โปรไฟล์", post: "โพสต์", signIn: "เข้าสู่ระบบ", signOut: "ออกจากระบบ" },
    vote: { stash: "เก็บไว้", trash: "ทิ้งไป", noVotes: "ยังไม่มีคะแนน", signInPrompt: "เข้าสู่ระบบเพื่อตัดสิน", stashCount: "{{count}} เก็บไว้", trashCount: "{{count}} ทิ้งไป" },
    auth: { signIn: "เข้าสู่ระบบ", signUp: "ลงทะเบียน", email: "อีเมล", password: "รหัสผ่าน", displayName: "ชื่อที่แสดง", createAccount: "สร้างบัญชี", continueGoogle: "ดำเนินการต่อด้วย Google", welcome: "ยินดีต้อนรับกลับ!" },
    brand: { title: "แบรนด์", subtitle: "แบรนด์ที่ผ่านการยืนยันและผลการตัดสินสดจากชุมชน", verified: "ยืนยันแล้ว", trustScore: "คะแนนความน่าเชื่อถือ", searchPlaceholder: "ค้นหาแบรนด์..." },
    awards: { title: "รางวัล SOT", tagline: "มาตรวัดความไว้วางใจในแบรนด์", leaderboard: "กระดานผู้นำ" }
  },
  vi: { // Vietnamese
    nav: { feed: "Bảng tin", brands: "Thương hiệu", messages: "Tin nhắn", awards: "Giải thưởng", dashboard: "Bảng điều khiển", admin: "Quản trị", profile: "Hồ sơ", post: "Đăng", signIn: "Đăng nhập", signOut: "Đăng xuất" },
    vote: { stash: "Giữ lại", trash: "Loại bỏ", noVotes: "Chưa có bình chọn", signInPrompt: "Đăng nhập để đưa ra phán quyết của bạn.", stashCount: "{{count}} giữ lại", trashCount: "{{count}} loại bỏ" },
    auth: { signIn: "Đăng nhập", signUp: "Đăng ký", email: "Email", password: "Mật khẩu", displayName: "Tên hiển thị", createAccount: "Tạo tài khoản", continueGoogle: "Tiếp tục với Google", welcome: "Chào mừng trở lại!" },
    brand: { title: "Thương hiệu", subtitle: "Thương hiệu đã xác minh và phán quyết thực tế từ cộng đồng.", verified: "Đã xác minh", trustScore: "Điểm tin cậy", searchPlaceholder: "Tìm kiếm thương hiệu..." },
    awards: { title: "Giải thưởng SOT", tagline: "Thước Đo Niềm Tin Thương Hiệu", leaderboard: "Bảng xếp hạng" }
  },
  ms: { // Malay
    nav: { feed: "Suapan", brands: "Jenama", messages: "Mesej", awards: "Anugerah", dashboard: "Papan Pemuka", admin: "Pentadbir", profile: "Profil", post: "Siarkan", signIn: "Log masuk", signOut: "Log keluar" },
    vote: { stash: "Simpan", trash: "Buang", noVotes: "Belum ada undian", signInPrompt: "Log masuk untuk memberikan keputusan anda.", stashCount: "{{count}} simpan", trashCount: "{{count}} buang" },
    auth: { signIn: "Log masuk", signUp: "Daftar", email: "E-mel", password: "Kata laluan", displayName: "Nama paparan", createAccount: "Cipta akaun", continueGoogle: "Teruskan dengan Google", welcome: "Selamat kembali!" },
    brand: { title: "Jenama", subtitle: "Jenama disahkan dan keputusan komuniti secara langsung.", verified: "Disahkan", trustScore: "Skor kepercayaan", searchPlaceholder: "Cari jenama..." },
    awards: { title: "Anugerah SOT", tagline: "Barometer Kepercayaan Jenama", leaderboard: "Papan Pendahulu" }
  },
  fil: { // Filipino
    nav: { feed: "Feed", brands: "Mga Brand", messages: "Mensahe", awards: "Mga Parangal", dashboard: "Dashboard", admin: "Admin", profile: "Profile", post: "Mag-post", signIn: "Mag-sign in", signOut: "Mag-sign out" },
    vote: { stash: "Itago", trash: "Itapon", noVotes: "Wala pang boto", signInPrompt: "Mag-sign in para magbigay ng iyong hatol.", stashCount: "{{count}} itago", trashCount: "{{count}} itapon" },
    auth: { signIn: "Mag-sign in", signUp: "Mag-sign up", email: "Email", password: "Password", displayName: "Pangalan", createAccount: "Gumawa ng account", continueGoogle: "Magpatuloy sa Google", welcome: "Maligayang pagbabalik!" },
    brand: { title: "Mga Brand", subtitle: "Mga beripikadong brand at live na hatol ng komunidad.", verified: "Beripikado", trustScore: "Marka ng tiwala", searchPlaceholder: "Maghanap ng brand..." },
    awards: { title: "Mga Parangal ng SOT", tagline: "Ang Barometro ng Tiwala sa Brand", leaderboard: "Leaderboard" }
  },
  ro: { // Romanian
    nav: { feed: "Flux", brands: "Branduri", messages: "Mesaje", awards: "Premii", dashboard: "Panou de control", admin: "Admin", profile: "Profil", post: "Postează", signIn: "Conectare", signOut: "Deconectare" },
    vote: { stash: "Păstrează", trash: "Aruncă", noVotes: "Fără voturi încă", signInPrompt: "Conectează-te pentru a vota.", stashCount: "{{count}} păstrează", trashCount: "{{count}} aruncă" },
    auth: { signIn: "Conectare", signUp: "Înregistrare", email: "Email", password: "Parolă", displayName: "Nume afișat", createAccount: "Creează cont", continueGoogle: "Continuă cu Google", welcome: "Bine ai revenit!" },
    brand: { title: "Branduri", subtitle: "Branduri verificate și verdictul comunității în direct.", verified: "Verificat", trustScore: "Scor de încredere", searchPlaceholder: "Caută branduri..." },
    awards: { title: "Premiile SOT", tagline: "Barometrul Încrederii în Branduri", leaderboard: "Clasament" }
  },
  sv: { // Swedish
    nav: { feed: "Flöde", brands: "Varumärken", messages: "Meddelanden", awards: "Utmärkelser", dashboard: "Översikt", admin: "Admin", profile: "Profil", post: "Inlägg", signIn: "Logga in", signOut: "Logga ut" },
    vote: { stash: "Behåll", trash: "Kasta", noVotes: "Inga röster än", signInPrompt: "Logga in för att avge ditt omdöme.", stashCount: "{{count}} behåll", trashCount: "{{count}} kasta" },
    auth: { signIn: "Logga in", signUp: "Skapa konto", email: "E-post", password: "Lösenord", displayName: "Visningsnamn", createAccount: "Skapa konto", continueGoogle: "Fortsätt med Google", welcome: "Välkommen tillbaka!" },
    brand: { title: "Varumärken", subtitle: "Verifierade varumärken och communityns direkta omdömen.", verified: "Verifierad", trustScore: "Förtroendepoäng", searchPlaceholder: "Sök varumärken..." },
    awards: { title: "SOT Awards", tagline: "Varumärkens Förtroendebarometer", leaderboard: "Topplista" }
  },
  no: { // Norwegian
    nav: { feed: "Strøm", brands: "Merkevarer", messages: "Meldinger", awards: "Priser", dashboard: "Dashbord", admin: "Admin", profile: "Profil", post: "Publiser", signIn: "Logg inn", signOut: "Logg ut" },
    vote: { stash: "Behold", trash: "Kast", noVotes: "Ingen stemmer ennå", signInPrompt: "Logg inn for å stemme.", stashCount: "{{count}} behold", trashCount: "{{count}} kast" },
    auth: { signIn: "Logg inn", signUp: "Registrer deg", email: "E-post", password: "Passord", displayName: "Visningsnavn", createAccount: "Opprett konto", continueGoogle: "Fortsett med Google", welcome: "Velkommen tilbake!" },
    brand: { title: "Merkevarer", subtitle: "Verifiserte merkevarer og folkets sanntidsdom.", verified: "Verifisert", trustScore: "Tillitsscore", searchPlaceholder: "Søk etter merkevarer..." },
    awards: { title: "SOT Awards", tagline: "Folkets Dom over Merkevarer", leaderboard: "Ledertavle" }
  },
  da: { // Danish
    nav: { feed: "Feed", brands: "Brands", messages: "Beskeder", awards: "Priser", dashboard: "Kontrolpanel", admin: "Admin", profile: "Profil", post: "Opret opslag", signIn: "Log ind", signOut: "Log ud" },
    vote: { stash: "Gem", trash: "Kassér", noVotes: "Ingen stemmer endnu", signInPrompt: "Log ind for at afgive din dom.", stashCount: "{{count}} gem", trashCount: "{{count}} kassér" },
    auth: { signIn: "Log ind", signUp: "Opret konto", email: "E-mail", password: "Adgangskode", displayName: "Vist navn", createAccount: "Opret konto", continueGoogle: "Fortsæt med Google", welcome: "Velkommen tilbage!" },
    brand: { title: "Brands", subtitle: "Verificerede brands og fællesskabets live-vurdering.", verified: "Verificeret", trustScore: "Tillidsscore", searchPlaceholder: "Søg efter brands..." },
    awards: { title: "SOT Awards", tagline: "Barometret for Brand-tillid", leaderboard: "Rangliste" }
  },
  fi: { // Finnish
    nav: { feed: "Syöte", brands: "Brändit", messages: "Viestit", awards: "Palkinnot", dashboard: "Kojelauta", admin: "Ylläpito", profile: "Profiili", post: "Julkaise", signIn: "Kirjaudu sisään", signOut: "Kirjaudu ulos" },
    vote: { stash: "Säilytä", trash: "Hylkää", noVotes: "Ei ääniä vielä", signInPrompt: "Kirjaudu sisään antaaksesi tuomiosi.", stashCount: "{{count}} säilytä", trashCount: "{{count}} hylkää" },
    auth: { signIn: "Kirjaudu sisään", signUp: "Rekisteröidy", email: "Sähköposti", password: "Salasana", displayName: "Nimimerkki", createAccount: "Luo tili", continueGoogle: "Jatka Googlella", welcome: "Tervetuloa takaisin!" },
    brand: { title: "Brändit", subtitle: "Vahvistetut brändit ja yhteisön suora tuomio.", verified: "Vahvistettu", trustScore: "Luottamusindeksi", searchPlaceholder: "Etsi brändejä..." },
    awards: { title: "SOT Awards", tagline: "Brändien Luottamusbarometri", leaderboard: "Kärkitaulukko" }
  },
  cs: { // Czech
    nav: { feed: "Příspěvky", brands: "Značky", messages: "Zprávy", awards: "Ocenění", dashboard: "Přehled", admin: "Správa", profile: "Profil", post: "Vložit", signIn: "Přihlásit se", signOut: "Odhlásit se" },
    vote: { stash: "Nechat", trash: "Zahodit", noVotes: "Zatím žádné hlasy", signInPrompt: "Přihlaste se a vyjádřete svůj verdikt.", stashCount: "{{count}} nechat", trashCount: "{{count}} zahodit" },
    auth: { signIn: "Přihlásit se", signUp: "Registrovat", email: "E-mail", password: "Heslo", displayName: "Zobrazované jméno", createAccount: "Vytvořit účet", continueGoogle: "Pokračovat přes Google", welcome: "Vítejte zpět!" },
    brand: { title: "Značky", subtitle: "Ověřené značky a živý verdikt komunity.", verified: "Ověřeno", trustScore: "Skóre důvěry", searchPlaceholder: "Hledat značky..." },
    awards: { title: "Ceny SOT", tagline: "Barometr důvěry ve značky", leaderboard: "Žebříček" }
  },
  sk: { // Slovak
    nav: { feed: "Príspevky", brands: "Značky", messages: "Správy", awards: "Ocenenia", dashboard: "Prehľad", admin: "Správca", profile: "Profil", post: "Pridať", signIn: "Prihlásiť sa", signOut: "Odhlásiť sa" },
    vote: { stash: "Nechať", trash: "Zahodiť", noVotes: "Zatiaľ žiadne hlasy", signInPrompt: "Prihláste sa a vyjadrite svoj verdikt.", stashCount: "{{count}} nechať", trashCount: "{{count}} zahodiť" },
    auth: { signIn: "Prihlásiť sa", signUp: "Registrovať sa", email: "E-mail", password: "Heslo", displayName: "Zobrazované meno", createAccount: "Vytvoriť účet", continueGoogle: "Pokračovať cez Google", welcome: "Vitajte späť!" },
    brand: { title: "Značky", subtitle: "Overené značky a živý verdikt komunity.", verified: "Overené", trustScore: "Skóre dôvery", searchPlaceholder: "Hľadať značky..." },
    awards: { title: "Ceny SOT", tagline: "Barometer dôvery v značky", leaderboard: "Rebríček" }
  },
  hu: { // Hungarian
    nav: { feed: "Hírcsatorna", brands: "Márkák", messages: "Üzenetek", awards: "Díjak", dashboard: "Irányítópult", admin: "Admin", profile: "Profil", post: "Közzététel", signIn: "Bejelentkezés", signOut: "Kijelentkezés" },
    vote: { stash: "Megtartás", trash: "Kuka", noVotes: "Még nincs szavazat", signInPrompt: "Jelentkezz be a véleményed leadásához.", stashCount: "{{count}} megtartás", trashCount: "{{count}} kuka" },
    auth: { signIn: "Bejelentkezés", signUp: "Regisztráció", email: "E-mail", password: "Jelszó", displayName: "Megjelenített név", createAccount: "Fiók létrehozása", continueGoogle: "Folytatás Google-lal", welcome: "Üdv újra itt!" },
    brand: { title: "Márkák", subtitle: "Hitelesített márkák és a közösség élő ítélete.", verified: "Hitelesített", trustScore: "Bizalmi pontszám", searchPlaceholder: "Márkák keresése..." },
    awards: { title: "SOT Díjak", tagline: "A Márkabizalom Barométere", leaderboard: "Rangsor" }
  },
  el: { // Greek
    nav: { feed: "Ροή", brands: "Μάρκες", messages: "Μηνύματα", awards: "Βραβεία", dashboard: "Πίνακας Ελέγχου", admin: "Διαχείριση", profile: "Προφίλ", post: "Δημοσίευση", signIn: "Σύνδεση", signOut: "Αποσύνδεση" },
    vote: { stash: "Κράτα", trash: "Πέτα", noVotes: "Δεν υπάρχουν ψήφοι ακόμη", signInPrompt: "Συνδεθείτε για να ψηφίσετε.", stashCount: "{{count}} κράτα", trashCount: "{{count}} πέτα" },
    auth: { signIn: "Σύνδεση", signUp: "Εγγραφή", email: "Email", password: "Κωδικός", displayName: "Όνομα εμφάνισης", createAccount: "Δημιουργία λογαριασμού", continueGoogle: "Συνέχεια με Google", welcome: "Καλώς ήρθατε πίσω!" },
    brand: { title: "Μάρκες", subtitle: "Επαληθευμένες μάρκες και ζωντανή ετυμηγορία της κοινότητας.", verified: "Επαληθευμένο", trustScore: "Δείκτης εμπιστοσύνης", searchPlaceholder: "Αναζήτηση μαρκών..." },
    awards: { title: "Βραβεία SOT", tagline: "Το Βαρόμετρο Εμπιστοσύνης στις Μάρκες", leaderboard: "Πίνακας Κατάταξης" }
  },
  uk: { // Ukrainian
    nav: { feed: "Стрічка", brands: "Бренди", messages: "Повідомлення", awards: "Нагороди", dashboard: "Панель", admin: "Адмін", profile: "Профіль", post: "Опублікувати", signIn: "Увійти", signOut: "Вийти" },
    vote: { stash: "Залишити", trash: "Викинути", noVotes: "Ще немає голосів", signInPrompt: "Увійдіть, щоб винести свій вердикт.", stashCount: "{{count}} залишити", trashCount: "{{count}} викинути" },
    auth: { signIn: "Увійти", signUp: "Зареєструватися", email: "Ел. пошта", password: "Пароль", displayName: "Ім'я", createAccount: "Створити обліковий запис", continueGoogle: "Продовжити через Google", welcome: "З поверненням!" },
    brand: { title: "Бренди", subtitle: "Перевірені бренди та живий вердикт спільноти.", verified: "Перевірено", trustScore: "Рейтинг довіри", searchPlaceholder: "Пошук брендів..." },
    awards: { title: "Премії SOT", tagline: "Барометр Довіри до Брендів", leaderboard: "Таблиця лідерів" }
  },
  bg: { // Bulgarian
    nav: { feed: "Поток", brands: "Брандове", messages: "Съобщения", awards: "Награди", dashboard: "Табло", admin: "Администратор", profile: "Профил", post: "Публикувай", signIn: "Вход", signOut: "Изход" },
    vote: { stash: "Запази", trash: "Изхвърли", noVotes: "Все още няма гласове", signInPrompt: "Влезте, за да дадете своята присъда.", stashCount: "{{count}} запази", trashCount: "{{count}} изхвърли" },
    auth: { signIn: "Вход", signUp: "Регистрация", email: "Имейл", password: "Парола", displayName: "Име", createAccount: "Създаване на профил", continueGoogle: "Продължи с Google", welcome: "Добре дошли отново!" },
    brand: { title: "Брандове", subtitle: "Проверени брандове и присъдата на общността в реално време.", verified: "Проверен", trustScore: "Оценка на доверие", searchPlaceholder: "Търсене на брандове..." },
    awards: { title: "Награди SOT", tagline: "Барометър на Доверието в Брандовете", leaderboard: "Класация" }
  }
};
