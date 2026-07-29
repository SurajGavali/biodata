export type Locale = "en" | "mr";

export type LocalizedText = Record<Locale, string>;

export type Detail = {
  label: LocalizedText;
  value: LocalizedText;
};

export type BiodataSection = {
  title: LocalizedText;
  details: Detail[];
};

export type MarriageBiodata = {
  name: LocalizedText;
  headline: LocalizedText;
  introduction: LocalizedText;
  personal: BiodataSection;
  education: BiodataSection;
  family: BiodataSection;
  horoscope: BiodataSection;
  lifestyle: BiodataSection;
  contact: BiodataSection;
  expectations: {
    title: LocalizedText;
    text: LocalizedText;
  };
};

export const biodata: MarriageBiodata = {
  name: {
    en: "Aarav Deshmukh",
    mr: "आरव देशमुख",
  },
  headline: {
    en: "Software Engineer · Pune",
    mr: "सॉफ्टवेअर अभियंता · पुणे",
  },
  introduction: {
    en: "Thoughtful, family-oriented and grounded. I value honest communication, curiosity and building a warm life together.",
    mr: "समंजस, कुटुंबवत्सल आणि साध्या विचारांचा. प्रामाणिक संवाद, जिज्ञासा आणि एकत्र सुंदर आयुष्य घडवण्यावर माझा विश्वास आहे.",
  },
  personal: {
    title: {
      en: "Personal details",
      mr: "वैयक्तिक माहिती",
    },
    details: [
      {
        label: { en: "Date of birth", mr: "जन्मतारीख" },
        value: { en: "15 August 1995", mr: "१५ ऑगस्ट १९९५" },
      },
      {
        label: { en: "Birth time", mr: "जन्मवेळ" },
        value: { en: "10:30 AM", mr: "सकाळी १०:३०" },
      },
      {
        label: { en: "Birth place", mr: "जन्मस्थळ" },
        value: { en: "Pune, Maharashtra", mr: "पुणे, महाराष्ट्र" },
      },
      {
        label: { en: "Height", mr: "उंची" },
        value: { en: "5 ft 10 in", mr: "५ फूट १० इंच" },
      },
      {
        label: { en: "Blood group", mr: "रक्तगट" },
        value: { en: "B positive", mr: "बी पॉझिटिव्ह" },
      },
      {
        label: { en: "Marital status", mr: "वैवाहिक स्थिती" },
        value: { en: "Never married", mr: "अविवाहित" },
      },
    ],
  },
  education: {
    title: {
      en: "Education & career",
      mr: "शिक्षण व करिअर",
    },
    details: [
      {
        label: { en: "Education", mr: "शिक्षण" },
        value: {
          en: "B.E. Computer Engineering",
          mr: "बी.ई. संगणक अभियांत्रिकी",
        },
      },
      {
        label: { en: "Profession", mr: "व्यवसाय" },
        value: {
          en: "Senior Software Engineer",
          mr: "वरिष्ठ सॉफ्टवेअर अभियंता",
        },
      },
      {
        label: { en: "Company", mr: "कंपनी" },
        value: {
          en: "Aster Digital, Pune",
          mr: "ॲस्टर डिजिटल, पुणे",
        },
      },
      {
        label: { en: "Annual income", mr: "वार्षिक उत्पन्न" },
        value: { en: "₹18 lakh", mr: "₹१८ लाख" },
      },
    ],
  },
  family: {
    title: {
      en: "Family",
      mr: "कौटुंबिक माहिती",
    },
    details: [
      {
        label: { en: "Father", mr: "वडील" },
        value: {
          en: "Mahesh Deshmukh · Business",
          mr: "महेश देशमुख · व्यवसाय",
        },
      },
      {
        label: { en: "Mother", mr: "आई" },
        value: {
          en: "Sunita Deshmukh · Teacher",
          mr: "सुनीता देशमुख · शिक्षिका",
        },
      },
      {
        label: { en: "Siblings", mr: "भावंडे" },
        value: {
          en: "One younger sister, married",
          mr: "एक धाकटी बहीण, विवाहित",
        },
      },
      {
        label: { en: "Native place", mr: "मूळ गाव" },
        value: {
          en: "Satara, Maharashtra",
          mr: "सातारा, महाराष्ट्र",
        },
      },
      {
        label: { en: "Family type", mr: "कुटुंब प्रकार" },
        value: {
          en: "Nuclear · Cultured",
          mr: "विभक्त · सुसंस्कृत",
        },
      },
    ],
  },
  horoscope: {
    title: {
      en: "Horoscope",
      mr: "कुंडलीविषयक माहिती",
    },
    details: [
      {
        label: { en: "Religion", mr: "धर्म" },
        value: { en: "Hindu", mr: "हिंदू" },
      },
      {
        label: { en: "Community", mr: "समाज" },
        value: { en: "Maratha", mr: "मराठा" },
      },
      {
        label: { en: "Gotra", mr: "गोत्र" },
        value: { en: "Kashyap", mr: "कश्यप" },
      },
      {
        label: { en: "Rashi", mr: "रास" },
        value: { en: "Libra (Tula)", mr: "तूळ" },
      },
      {
        label: { en: "Nakshatra", mr: "नक्षत्र" },
        value: { en: "Swati", mr: "स्वाती" },
      },
      {
        label: { en: "Gan / Nadi", mr: "गण / नाडी" },
        value: { en: "Dev / Antya", mr: "देव / अंत्य" },
      },
    ],
  },
  lifestyle: {
    title: {
      en: "Lifestyle",
      mr: "आवडी व जीवनशैली",
    },
    details: [
      {
        label: { en: "Diet", mr: "आहार" },
        value: { en: "Vegetarian", mr: "शाकाहारी" },
      },
      {
        label: { en: "Languages", mr: "भाषा" },
        value: {
          en: "Marathi, Hindi, English",
          mr: "मराठी, हिंदी, इंग्रजी",
        },
      },
      {
        label: { en: "Interests", mr: "छंद" },
        value: {
          en: "Trekking, reading, music",
          mr: "भटकंती, वाचन, संगीत",
        },
      },
    ],
  },
  contact: {
    title: {
      en: "Contact",
      mr: "संपर्क",
    },
    details: [
      {
        label: { en: "Phone", mr: "मोबाईल" },
        value: { en: "+91 98765 43210", mr: "+९१ ९८७६५ ४३२१०" },
      },
      {
        label: { en: "Email", mr: "ई-मेल" },
        value: {
          en: "aarav.sample@example.com",
          mr: "aarav.sample@example.com",
        },
      },
      {
        label: { en: "Address", mr: "पत्ता" },
        value: {
          en: "Kothrud, Pune, Maharashtra",
          mr: "कोथरूड, पुणे, महाराष्ट्र",
        },
      },
    ],
  },
  expectations: {
    title: {
      en: "Partner preference",
      mr: "जोडीदाराविषयी अपेक्षा",
    },
    text: {
      en: "Seeking a kind, well-educated and independent partner who values family, mutual respect and growing together.",
      mr: "कुटुंब, परस्पर आदर आणि एकत्र प्रगतीला महत्त्व देणारी प्रेमळ, सुशिक्षित व स्वावलंबी जोडीदार अपेक्षित.",
    },
  },
};

export const uiCopy = {
  en: {
    pageEyebrow: "Marriage biodata",
    pageTitle: "A meaningful introduction, beautifully presented.",
    pageDescription:
      "Switch languages, then download the current version as a polished PDF or high-resolution image.",
    language: "Language",
    english: "English",
    marathi: "मराठी",
    downloadPdf: "Download PDF",
    downloadPng: "Download PNG",
    generatingPdf: "Preparing PDF…",
    generatingPng: "Preparing PNG…",
    downloadError: "The download could not be created. Please try again.",
    sampleNotice: "Fictional sample profile · Replace with your details",
    about: "About me",
    attribution: "Designed with reference to Freepik",
  },
  mr: {
    pageEyebrow: "विवाह परिचयपत्र",
    pageTitle: "सुंदर मांडणीत अर्थपूर्ण परिचय.",
    pageDescription:
      "भाषा निवडा आणि सध्याची आवृत्ती आकर्षक PDF किंवा उच्च दर्जाच्या प्रतिमेत डाउनलोड करा.",
    language: "भाषा",
    english: "English",
    marathi: "मराठी",
    downloadPdf: "PDF डाउनलोड करा",
    downloadPng: "PNG डाउनलोड करा",
    generatingPdf: "PDF तयार होत आहे…",
    generatingPng: "PNG तयार होत आहे…",
    downloadError: "डाउनलोड तयार करता आले नाही. कृपया पुन्हा प्रयत्न करा.",
    sampleNotice: "काल्पनिक नमुना · तुमची माहिती येथे भरा",
    about: "माझ्याविषयी",
    attribution: "Freepik च्या संदर्भाने डिझाइन",
  },
} satisfies Record<Locale, Record<string, string>>;
