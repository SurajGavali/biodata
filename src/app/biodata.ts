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
  occupation: BiodataSection;
  horoscope: BiodataSection;
  contact: BiodataSection;
};

export const biodata: MarriageBiodata = {
  name: {
    en: "Suraj Gavali",
    mr: "सुरज गवळी",
  },
  headline: {
    en: "Software Engineer at Mastercard · Pune",
    mr: "मास्टरकार्ड येथे सॉफ्टवेअर इंजिनिअर · पुणे",
  },
  introduction: {
    en: "B.Tech graduate in Computer Science and Engineering, currently working as a Software Engineer at Mastercard in Pune.",
    mr: "बी.टेक. कम्प्युटर सायन्स अँड इंजिनिअरिंग पदवीधर. सध्या पुणे येथे मास्टरकार्डमध्ये सॉफ्टवेअर इंजिनिअर म्हणून कार्यरत.",
  },
  personal: {
    title: {
      en: "Personal details",
      mr: "वैयक्तिक माहिती",
    },
    details: [
      {
        label: { en: "Date of birth", mr: "जन्मतारीख" },
        value: { en: "16 January 2001", mr: "१६ जानेवारी २००१" },
      },
      {
        label: { en: "Birth time", mr: "जन्मवेळ" },
        value: { en: "8:40", mr: "८ वाजून ४० मिनिटे" },
      },
      {
        label: { en: "Birth place", mr: "जन्मस्थळ" },
        value: { en: "Kolhapur", mr: "कोल्हापूर" },
      },
      {
        label: { en: "Height", mr: "उंची" },
        value: { en: "5 ft 5 in", mr: "५ फूट ५ इंच" },
      },
      {
        label: { en: "Weight", mr: "वजन" },
        value: { en: "68 kg", mr: "६८ किलो" },
      },
      {
        label: { en: "Complexion", mr: "वर्ण" },
        value: { en: "Fair", mr: "गोरा" },
      },
      {
        label: { en: "Blood group", mr: "रक्तगट" },
        value: { en: "O negative", mr: "O निगेटिव्ह" },
      },
    ],
  },
  education: {
    title: {
      en: "Education & career",
      mr: "शिक्षण व नोकरी",
    },
    details: [
      {
        label: { en: "Education", mr: "शिक्षण" },
        value: {
          en: "B.Tech, Computer Science and Engineering",
          mr: "बी.टेक. कम्प्युटर सायन्स अँड इंजिनिअरिंग",
        },
      },
      {
        label: { en: "College", mr: "महाविद्यालय" },
        value: {
          en: "College of Engineering, Pune",
          mr: "कॉलेज ऑफ इंजिनिअरिंग, पुणे",
        },
      },
      {
        label: { en: "Profession", mr: "नोकरी" },
        value: {
          en: "Software Engineer",
          mr: "सॉफ्टवेअर इंजिनिअर",
        },
      },
      {
        label: { en: "Employer", mr: "कंपनी" },
        value: { en: "Mastercard", mr: "मास्टरकार्ड" },
      },
      {
        label: { en: "Work location", mr: "नोकरीचे ठिकाण" },
        value: { en: "Pune", mr: "पुणे" },
      },
    ],
  },
  horoscope: {
    title: {
      en: "Traditional details",
      mr: "पारंपरिक माहिती",
    },
    details: [
      {
        label: { en: "Religion", mr: "धर्म" },
        value: { en: "Hindu", mr: "हिंदू" },
      },
      {
        label: { en: "Community", mr: "जात" },
        value: { en: "Chambhar", mr: "चांभार" },
      },
      {
        label: { en: "Rashi", mr: "रास" },
        value: { en: "Libra (Tula)", mr: "तूळ" },
      },
      {
        label: { en: "Navras name", mr: "नावरस नाव" },
        value: { en: "Ritesh", mr: "रितेश" },
      },
      {
        label: { en: "Family deity", mr: "कुलदैवत" },
        value: { en: "Narasimha", mr: "नरसिंह" },
      },
    ],
  },
  family: {
    title: {
      en: "Family and relatives",
      mr: "कुटुंब व नातेवाईक",
    },
    details: [
      {
        label: { en: "Father", mr: "वडील" },
        value: {
          en: "Maruti Shamrao Gavali",
          mr: "श्री. मारुती शामराव गवळी",
        },
      },
      {
        label: { en: "Mother", mr: "आई" },
        value: {
          en: "Anandi Maruti Gavali",
          mr: "सौ. आनंदी मारुती गवळी",
        },
      },
      {
        label: { en: "Brother", mr: "भाऊ" },
        value: {
          en: "Dheeraj Maruti Gavali (Unmarried)",
          mr: "कु. धीरज मारुती गवळी (अविवाहित)",
        },
      },
      {
        label: { en: "Maternal uncle", mr: "मामा" },
        value: {
          en: "Late Shankar Maruti Jadhav",
          mr: "कै. शंकर मारुती जाधव",
        },
      },
      {
        label: { en: "Uncle", mr: "चुलते" },
        value: {
          en: "Balkrishna Shamrao Gavali",
          mr: "श्री. बाळकृष्ण शामराव गवळी",
        },
      },
      {
        label: { en: "Uncle", mr: "काका" },
        value: {
          en: "Kerba Dhondiram Chougule",
          mr: "श्री. केरबा धोंडीराम चौगुले",
        },
      },
    ],
  },
  occupation: {
    title: {
      en: "Family occupations",
      mr: "कुटुंबीयांचा व्यवसाय",
    },
    details: [
      {
        label: { en: "Mother", mr: "आई" },
        value: { en: "Housewife", mr: "गृहिणी" },
      },
      {
        label: { en: "Father", mr: "वडील" },
        value: { en: "Business", mr: "व्यवसाय" },
      },
      {
        label: { en: "Brother", mr: "भाऊ" },
        value: { en: "Business", mr: "व्यवसाय" },
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
        label: { en: "Suraj's mobile", mr: "सुरजचा मोबाईल" },
        value: { en: "8408878186", mr: "८४०८८७८१८६" },
      },
      {
        label: { en: "Address", mr: "पत्ता" },
        value: {
          en: "Sant Rohidas Society, Subhash Nagar, Kolhapur",
          mr: "संत रोहिदास सोसायटी, सुभाषनगर, कोल्हापूर",
        },
      },
      {
        label: { en: "Father's mobile", mr: "वडिलांचा मोबाईल" },
        value: { en: "8408012121", mr: "८४०८०१२१२१" },
      },
      {
        label: { en: "Mother's mobile", mr: "आईचा मोबाईल" },
        value: { en: "9730927098", mr: "९७३०९२७०९८" },
      },
      {
        label: { en: "Brother's mobile", mr: "भावाचा मोबाईल" },
        value: { en: "7058525310", mr: "७०५८५२५३१०" },
      },
      {
        label: { en: "Relations", mr: "इतर पाहुणे" },
        value: {
          en: "Gavali, Chougule, Jadhav, Nangare, Chavan, Kamble, Chougale, Bamane, Patil, Lokare, Doiphode",
          mr: "गवळी, चौगुले, जाधव, नांगरे, चव्हाण, कांबळे, चौगले, बामणे, पाटील, लोकरे, डोईफोडे",
        },
      },
    ],
  },
};

export const profileFacts = {
  username: "@suraj.gavali",
  birthDate: "2001-01-16",
  born: {
    en: "16 January 2001 | Kolhapur",
    mr: "१६ जानेवारी २००१ | कोल्हापूर",
  },
  height: {
    en: "5′5″",
    mr: "५′५″",
  },
  location: {
    en: "Pune",
    mr: "पुणे",
  },
  weight: {
    en: "68 kg",
    mr: "६८ किलो",
  },
  salary: {
    en: "Private",
    mr: "गोपनीय",
  },
} satisfies {
  username: string;
  birthDate: string;
  born: LocalizedText;
  height: LocalizedText;
  location: LocalizedText;
  weight: LocalizedText;
  salary: LocalizedText;
};

export const uiCopy = {
  en: {
    language: "Language",
    english: "English",
    marathi: "मराठी",
    download: "Download",
    chooseFormat: "Choose download format",
    imageFormat: "High-resolution image",
    documentFormat: "A4 document",
    generatingPdf: "Preparing PDF…",
    generatingPng: "Preparing PNG…",
    downloadError: "The download could not be created. Please try again.",
    footerNotice: "Suraj Gavali · Marriage biodata",
    about: "Profile",
  },
  mr: {
    language: "भाषा",
    english: "English",
    marathi: "मराठी",
    download: "डाउनलोड",
    chooseFormat: "डाउनलोड स्वरूप निवडा",
    imageFormat: "उच्च दर्जाची प्रतिमा",
    documentFormat: "A4 दस्तऐवज",
    generatingPdf: "PDF तयार होत आहे…",
    generatingPng: "PNG तयार होत आहे…",
    downloadError: "डाउनलोड तयार करता आले नाही. कृपया पुन्हा प्रयत्न करा.",
    footerNotice: "सुरज गवळी · विवाह परिचयपत्र",
    about: "परिचय",
  },
} satisfies Record<Locale, Record<string, string>>;
