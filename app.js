/* 
========================================================================
   सूर्यपुरा ग्राम विकास पोर्टल - INTERACTIVE JAVASCRIPT SYSTEM
   Developed by Antigravity
========================================================================
*/

// --- Global App State ---
let currentLang = 'hi';
let dairyRecords = [];
let grievances = [];
let certificates = [];
let activeGrievanceId = null;

// Default Seed Data if LocalStorage is empty
const defaultGrievances = [
    {
        id: 101,
        name: "रमेश कुमार",
        type: "खराब स्ट्रीटलाइट",
        desc: "वार्ड 3 के मुख्य मार्ग पर बिजली का खंभा नंबर 12 पिछले 5 दिनों से बंद है, जिससे रात में अंधेरा रहता है।",
        date: "2026-05-18",
        votes: 14,
        status: "Inspected", // Submitted, Inspected, In Progress, Completed
        statusVal: 40
    },
    {
        id: 102,
        name: "सुनीता देवी",
        type: "पेयजल पाइपलाइन लीक",
        desc: "राजकीय स्कूल के पास मुख्य पेयजल पाइपलाइन से भारी रिसाव हो रहा है, जिससे सड़क पर पानी जमा है।",
        date: "2026-05-19",
        votes: 28,
        status: "In Progress",
        statusVal: 75
    }
];

const defaultCertificates = [
    {
        id: "CERT-74892",
        type: "निवास प्रमाण पत्र (Domicile)",
        name: "राजेश गुर्जर",
        status: "issued", // pending, verified, issued
        statusVal: 100,
        date: "2026-05-12"
    },
    {
        id: "CERT-82910",
        type: "जाति प्रमाण पत्र (Caste)",
        name: "कमला मीणा",
        status: "pending",
        statusVal: 30,
        date: "2026-05-20"
    }
];

// --- Translation Dictionary ---
const translations = {
    hi: {
        tickerBadge: "नवीनतम समाचार",
        tickerText: "🌾 रबी फसल पंजीकरण की अंतिम तिथि 25 मई है! | 🏫 राजकीय विद्यालय में नए स्मार्ट-क्लास रूम का उद्घाटन कल! | 🥛 आज का दूध खरीद मूल्य रिकॉर्ड ₹54 प्रति लीटर पहुंचा! | 🛣️ वार्ड 4 में नया ग्राम संपर्क मार्ग बनकर तैयार!",
        weatherVal: "सूर्यपुरा: 32°C - सुहावना मौसम ☀️",
        navHome: "मुख्य पृष्ठ",
        navDairy: "कृषि एवं डेयरी",
        navEducation: "विद्या ज्योति",
        navInfra: "ग्राम संपर्क",
        navPanchayat: "ई-पंचायत",
        btnLogin: "नागरिक लॉगिन",
        badgePromoText: "प्रगति की नई पहचान",
        heroTitle: "सूर्यपुरा: जहाँ परंपरा और तकनीक मिलते हैं",
        heroSubtitle: "सशक्त किसान, उन्नत शिक्षा, और आपकी अपनी डिजिटल पंचायत। गाँव का समग्र विकास अब आपके हाथों में।",
        btnExplore: "योजनाएं एक्सप्लोर करें",
        btnCreateId: "डिजिटल-ID बनाएं",
        statCitizens: "1,250+",
        statCitizensLabel: "डिजिटल नागरिक ID",
        statMilk: "450+",
        statMilkLabel: "टन दूध उत्पादन (वार्षिक)",
        statEdu: "100%",
        statEduLabel: "स्मार्ट स्कूल उपस्थिति",
        statRoads: "95%",
        statRoadsLabel: "ग्राम सड़क कनेक्टिविटी",
        serviceSecTitle: "प्रमुख नागरिक सेवाएँ",
        serviceSecSub: "एक क्लिक में गाँव की हर सुविधा आपके फोन पर",
        cardAgriTitle: "कृषि एवं डेयरी",
        cardAgriText: "फसल सलाह, खाद इन्वेंट्री और रोज़ाना दूध बिक्री का सीधा रिकॉर्ड।",
        cardAgriBtn: "रिकॉर्ड देखें",
        cardEduTitle: "विद्या ज्योति",
        cardEduText: "गांव के स्कूलों का लाइव स्टेटस, स्कॉलरशिप और ई-लर्निंग रिसोर्स।",
        cardEduBtn: "स्कूल पोर्टल",
        cardInfraTitle: "ग्राम संपर्क",
        cardInfraText: "नई सड़कों, पुलों और इंफ्रास्ट्रक्चर प्रोजेक्ट्स का लाइव ट्रैकिंग मैप।",
        cardInfraBtn: "नक्शा देखें",
        cardEpTitle: "ई-पंचायत",
        cardEpText: "प्रमाण पत्र और सरकारी योजनाओं के लिए सिंगल-विंडो डिजिटल पहचान।",
        cardEpBtn: "पंचायत सेवाएँ",
        visionBadge: "हमारा विज़न",
        visionTitle: "तकनीक से सशक्त होता हर ग्रामीण परिवार",
        visionQuote: `"हमारा लक्ष्य सिर्फ कंक्रीट की सड़कें बनाना नहीं है, बल्कि हर किसान, युवा और परिवार को डिजिटल हाईवे से जोड़कर आर्थिक रूप से सशक्त बनाना है।"`,
        visionAuthor: "- राम सिंह, सरपंच एवं विकास दूत",
        visionSub: "सूर्यपुरा ग्राम पंचायत",
        
        // Dairy Tab
        dairyTitle: "🥛 कृषि एवं डेयरी डैशबोर्ड",
        dairySubtitle: "अपने दैनिक दूध वितरण का रिकॉर्ड दर्ज करें एवं रीयल-टाइम आय देखें",
        dairyLiveVal: "दर: ₹40 - ₹62 / लीटर",
        milkLogTitle: "दूध वितरण दर्ज करें",
        lblMilkDate: "दिनांक",
        lblMilkShift: "पाली (Shift)",
        optMorning: "सुबह (Morning)",
        optEvening: "शाम (Evening)",
        lblMilkQty: "मात्रा (लीटर)",
        lblMilkFat: "वसा (Fat %)",
        btnSaveRecord: "दर्ज करें",
        statMilkTotalLbl: "कुल दूध दर्ज",
        statFatAvgLbl: "औसत वसा (Fat)",
        statEarnLbl: "कुल कमाई (अनुमानित)",
        chartCardTitle: "📈 साप्ताहिक दूध आपूर्ति चार्ट",
        chartEmptyMsg: "रिकॉर्ड दर्ज करते ही चार्ट यहाँ दिखाई देगा",
        stockTitle: "🛒 सहकारी समिति खाद भंडार (Live Inventory)",
        thItem: "सामग्री",
        thStock: "उपलब्ध स्टॉक",
        thPrice: "सरकारी दर",
        thAction: "क्रिया (Action)",
        btnBookUrea: "बुक करें",
        btnBookDap: "बुक करें",
        btnBookOrg: "बुक करें",
        advisoryTitle: "🌾 आज की कृषि व पशुपालन सलाह",
        adv1Title: "फसल सुरक्षा - रबी अनाज कटाई",
        adv1Desc: "कटी हुई गेहूं की फसल को सुरक्षित सूखे स्थान पर रखें। नमी से बचाने के लिए तिरपाल का उपयोग करें।",
        adv2Title: "पशु स्वास्थ्य - ग्रीष्मकालीन रखरखाव",
        adv2Desc: "तेज़ धूप में मवेशियों को छांव में रखें। पीने के पानी में थोड़ा नमक मिलाकर दिन में 3 बार पिलाएं।",
        dairyHistoryTitle: "📜 वितरण इतिहास (Distribution Records)",
        btnClearDairy: "सभी हटाएं",
        thHDate: "दिनांक",
        thHShift: "पाली",
        thHQty: "मात्रा (लीटर)",
        thHFat: "वसा (Fat %)",
        thHRate: "दर (₹/लीटर)",
        thHTotal: "कुल कमाई",
        thHAct: "क्रिया",

        // Education Tab
        eduTitle: "🏫 विद्या ज्योति - ग्राम शिक्षा मंच",
        eduSub: "डिजिटल संसाधन, लाइव उपस्थिति ट्रैकर और सरकारी छात्रवृत्ति पोर्टल",
        eduSchoolName: "राजकीय माध्यमिक विद्यालय, सूर्यपुरा",
        eduAttTitle: "आज की लाइव उपस्थिति",
        eduAttSub: "कुल नामांकित छात्र: 245 | अनुपस्थित: 5",
        eduSmartTitle: "स्मार्ट क्लासरूम स्टेटस",
        eduSmartVal: "सक्रिय",
        eduSmartDesc: "सभी 3 प्रोजेक्टर और कंप्यूटर लैब कार्यरत हैं। सोलर ग्रिड 100% पावर्ड।",
        eduNetTitle: "हाई-स्पीड इंटरनेट",
        scholarTitle: "🎓 छात्रवृत्ति योजनाएं (Scholarships)",
        schFAll: "सभी कक्षाएं",
        schFPri: "कक्षा 1-5 (Primary)",
        schFMid: "कक्षा 6-8 (Middle)",
        schFHigh: "कक्षा 9-12 (High)",
        sch1Title: "मेधावी छात्रा प्रोत्साहन योजना",
        sch1Desc: "कक्षा 1 से 5 की छात्राओं के लिए ₹1,500 वार्षिक सहायता।",
        sch2Title: "साइकिल वितरण छात्रवृत्ति सहायता",
        sch2Desc: "कक्षा 6-8 के दूर-दराज से आने वाले छात्रों के लिए साइकिल क्रय हेतु ₹3,000 सहायता।",
        sch3Title: "माध्यमिक शिक्षा बोर्ड छात्रवृत्ति",
        sch3Desc: "कक्षा 9-10 के गरीब एवं मेधावी छात्रों के लिए ₹5,000 वार्षिक छात्रवृत्ति।",
        elTitle: "📚 विद्या ज्योति ई-लर्निंग हब",
        el1Title: "कक्षा 1 से 8 एनसीईआरटी डिजिटल पुस्तकें",
        el1Desc: "हिंदी और गणित की इंटरैक्टिव ई-बुक्स डाउनलोड करें।",
        el1Btn: "डाउनलोड करें",
        el2Title: "गणित सीखें - मजेदार क्विज गेम",
        el2Desc: "कक्षा 5-8 के विद्यार्थियों के लिए मनोरंजक पहाड़े और क्विज।",
        el2Btn: "क्विज खेलें",
        btnApplySch1: "लागू करें",
        btnApplySch2: "लागू करें",
        btnApplySch3: "लागू करें",

        // Infrastructure Tab
        infraTitle: "🛣️ ग्राम संपर्क - इंफ्रास्ट्रक्चर एवं ट्रैकर",
        infraSub: "गाँव के सड़कों, स्ट्रीटलाइट्स और नल जल परियोजनाओं का रीयल-टाइम प्रोग्रेस नक्शा एवं शिकायत केंद्र",
        infraBudgetLbl: "कुल विकास बजट 2026: ₹45,50,000",
        mapSecTitle: "🗺️ सूर्यपुरा ग्राम विकास लाइव मैप",
        mapSecDesc: "नीचे दिए गए मुख्य बिंदुओं (Nodes) पर क्लिक करके चालू विकास परियोजनाओं की स्थिति देखें:",
        mapProjName: "परियोजना का नाम",
        mapLblStatus: "स्थिति:",
        mapLblBudget: "स्वीकृत बजट:",
        timelineSecTitle: "📋 चालू योजनाएं (Projects List)",
        gFormTitle: "📢 ग्राम समस्या निवारण (Grievance Portal)",
        gFormSub: "सड़क गड्ढे, खराब स्ट्रीटलाइट या जलभराव से जुड़ी समस्या की शिकायत करें।",
        lblGName: "आपका नाम",
        lblGType: "समस्या का प्रकार",
        lblGDesc: "समस्या का विवरण",
        btnSubmitG: "शिकायत दर्ज करें",
        gBoardTitle: "💬 नागरिक शिकायतें एवं निवारण बोर्ड",

        // Panchayat Tab
        idSecTitle: "🪪 सूर्यपुरा डिजिटल नागरिक ID कार्ड जनरेटर",
        lblIdName: "पूरा नाम (Full Name)",
        lblIdFather: "पिता का नाम (Father Name)",
        lblIdAadhaar: "आधार संख्या (अंतिम 4 अंक)",
        lblIdWard: "वार्ड नंबर (Ward No.)",
        lblIdRole: "व्यवसाय / श्रेणी",
        lblIdPic: "फोटो अपलोड करें (Photo)",
        lblCName: "नाम:",
        lblCFather: "पिता:",
        lblCWard: "वार्ड सं.:",
        lblCRole: "श्रेणी:",
        lblCNo: "नागरिक पहचान संख्या",
        lblCSig: "राम सिंह",
        lblCDes: "सरपंच, सूर्यपुरा",
        btnDownloadCard: "डाउनलोड करें (PNG)",
        btnPrintCard: "प्रिंट करें",
        certFormTitle: "📑 प्रमाण पत्र ऑनलाइन आवेदन",
        certFormSub: "विभिन्न सरकारी प्रमाण पत्रों के लिए त्वरित डिजिटल आवेदन पत्र।",
        lblCertType: "प्रमाण पत्र का प्रकार",
        lblCertName: "आवेदक का नाम",
        lblCertPurpose: "आवेदन का कारण (Purpose)",
        btnSubmitCert: "आवेदन सबमिट करें",
        certTrackerTitle: "📋 डिजिटल प्रमाण-पत्र ट्रैकर",
        certTrackerSub: "आपके द्वारा सबमिट किए गए आवेदनों की लाइव स्थिति। (डेमो के लिए आवेदन दर्ज करने के 30 सेकंड बाद 'issued' हो जायेगा, जांचें!)",
        thCId: "आवेदन ID",
        thCType: "प्रकार",
        thCName: "नाम",
        thCStatus: "प्रगति",
        thCAction: "दस्तावेज",
        footerCopy: "© 2026 सूर्यपुरा ग्राम विकास डिजिटल पोर्टल. सुरक्षित, उन्नत एवं सशक्त भारत.",
        footerSub: "विकसित भारत - डिजिटल ग्राम पहल | ग्राम पंचायत सूर्यपुरा, राजस्थान",

        // Mobile Nav labels
        mLblHome: "होम",
        mLblDairy: "डेयरी/कृषि",
        mLblEdu: "शिक्षा",
        mLblInfra: "ग्राम मार्ग",
        mLblEp: "ई-पंचायत"
    },
    en: {
        tickerBadge: "LATEST NEWS",
        tickerText: "🌾 Rabi crop registration final date extended to May 25! | 🏫 State School to inaugurate new Smart-classroom tomorrow! | 🥛 Milk procurement rate hits record ₹54 per liter! | 🛣️ Ward 4 brand new connectivity road completed!",
        weatherVal: "Suryapura: 32°C - Pleasant Sun ☀️",
        navHome: "Home",
        navDairy: "Agriculture & Dairy",
        navEducation: "Vidya Jyoti",
        navInfra: "Gram Sampark",
        navPanchayat: "E-Panchayat",
        btnLogin: "Citizen Login",
        badgePromoText: "The Emblem of Progress",
        heroTitle: "Suryapura: Where Tradition Meets Technology",
        heroSubtitle: "Empowered Farmers, Quality Education, and Your Personal Digital Panchayat. Comprehensive Village Development, Now in Your Hands.",
        btnExplore: "Explore Schemes",
        btnCreateId: "Create Digital-ID",
        statCitizens: "1,250+",
        statCitizensLabel: "Digital Citizen IDs",
        statMilk: "450+",
        statMilkLabel: "Tons Milk/Year",
        statEdu: "100%",
        statEduLabel: "Smart School Attendance",
        statRoads: "95%",
        statRoadsLabel: "Village Road Connectivity",
        serviceSecTitle: "Major Citizen Services",
        serviceSecSub: "Access every village utility instantly from your phone",
        cardAgriTitle: "Agri & Dairy Hub",
        cardAgriText: "Farming weather advisory, fertilizer stock updates, and daily milk sale diary.",
        cardAgriBtn: "View Ledger",
        cardEduTitle: "Vidya Jyoti",
        cardEduText: "Live status of local schools, scholarship finder, and dynamic e-learning vault.",
        cardEduBtn: "School Portal",
        cardInfraTitle: "Gram Sampark",
        cardInfraText: "Interactive progress map for roads, pipeline systems, and community centers.",
        cardInfraBtn: "View Map",
        cardEpTitle: "E-Panchayat",
        cardEpText: "Single-window portal to generate smart IDs and request digital certificates.",
        cardEpBtn: "Panchayat Services",
        visionBadge: "OUR VISION",
        visionTitle: "Empowering Every Rural Family with Technology",
        visionQuote: `"Our goal is not just building concrete roads, but linking every farmer, student, and family to the digital highway to facilitate financial stability."`,
        visionAuthor: "- Ram Singh, Sarpanch & Progress Ambassador",
        visionSub: "Suryapura Gram Panchayat",

        // Dairy Tab
        dairyTitle: "🥛 Agriculture & Dairy Dashboard",
        dairySubtitle: "Log daily milk distribution, check real-time rate multipliers, and monitor total savings",
        dairyLiveVal: "Rate: ₹40 - ₹62 / Liter",
        milkLogTitle: "Log Daily Milk Delivery",
        lblMilkDate: "Delivery Date",
        lblMilkShift: "Shift Timing",
        optMorning: "Morning",
        optEvening: "Evening",
        lblMilkQty: "Quantity (Liters)",
        lblMilkFat: "Fat Content (Fat %)",
        btnSaveRecord: "Save Entry",
        statMilkTotalLbl: "Total Milk Logged",
        statFatAvgLbl: "Average Fat Value",
        statEarnLbl: "Total Earnings (Est.)",
        chartCardTitle: "📈 Weekly Supply Tracker Chart",
        chartEmptyMsg: "Chart will be populated once records are logged",
        stockTitle: "🛒 Cooperative Fertilizers Live Inventory",
        thItem: "Item Name",
        thStock: "Available Stock",
        thPrice: "Govt Price Rate",
        thAction: "Action",
        btnBookUrea: "Reserve Now",
        btnBookDap: "Reserve Now",
        btnBookOrg: "Reserve Now",
        advisoryTitle: "🌾 Daily Agri & Cattle Advice",
        adv1Title: "Crop Protection - Rabi Harvesting",
        adv1Desc: "Keep harvested wheat in dry places. Use high-grade tarpaulin cover to protect from moisture.",
        adv2Title: "Livestock - Summer Management",
        adv2Desc: "Keep cattle under shelters. Mix mineral salt in water and feed three times a day to avoid heatstroke.",
        dairyHistoryTitle: "📜 Distribution Ledger Records",
        btnClearDairy: "Clear All Logs",
        thHDate: "Date",
        thHShift: "Shift",
        thHQty: "Qty (L)",
        thHFat: "Fat %",
        thHRate: "Rate (₹/L)",
        thHTotal: "Total Earning",
        thHAct: "Action",

        // Education Tab
        eduTitle: "🏫 Vidya Jyoti - Village Education Hub",
        eduSub: "Digital library resources, live school attendance metrics, and scholarship portal",
        eduSchoolName: "State Secondary School, Suryapura",
        eduAttTitle: "Live School Attendance",
        eduAttSub: "Total Students: 245 | Absent today: 5",
        eduSmartTitle: "Smart Classroom Status",
        eduSmartVal: "ACTIVE",
        eduSmartDesc: "All 3 projectors and computer lab systems are online. 100% solar powered.",
        eduNetTitle: "High-Speed Internet Corridor",
        scholarTitle: "🎓 Active Scholarship Programs",
        schFAll: "All Classes",
        schFPri: "Primary (Class 1-5)",
        schFMid: "Middle (Class 6-8)",
        schFHigh: "High School (Class 9-12)",
        sch1Title: "Girls Meritorious Incentives Scheme",
        sch1Desc: "Annual financial grant of ₹1,500 for girl students in grades 1 through 5.",
        sch2Title: "Bicycle Distribution Grant Assistance",
        sch2Desc: "₹3,000 cash grant for grades 6-8 students to buy bicycles for long commute.",
        sch3Title: "Secondary Board Academic Scholarship",
        sch3Desc: "Yearly academic fellowship of ₹5,000 for secondary grade high-achievers.",
        elTitle: "📚 Vidya Jyoti E-Learning Portal",
        el1Title: "NCERT Digital Textbooks Class 1-8",
        el1Desc: "Download Interactive Hindi and Math e-books directly.",
        el1Btn: "Download PDF",
        el2Title: "Play & Learn - Mathematics Quiz Game",
        el2Desc: "Engaging multiplication table and math logic puzzles for grades 5-8.",
        el2Btn: "Play Quiz",
        btnApplySch1: "Apply Online",
        btnApplySch2: "Apply Online",
        btnApplySch3: "Apply Online",

        // Infrastructure Tab
        infraTitle: "🛣️ Gram Sampark - Infrastructure Map",
        infraSub: "Live tracking dashboard for roads, streetlights, and sanitation projects, and public grievance desk",
        infraBudgetLbl: "Total Development Budget 2026: ₹45,50,000",
        mapSecTitle: "🗺️ Suryapura Village Live Interactive Map",
        mapSecDesc: "Click the main project nodes on the map below to check real-time execution parameters:",
        mapProjName: "Project Description Name",
        mapLblStatus: "Execution Status:",
        mapLblBudget: "Approved Fund Allocation:",
        timelineSecTitle: "📋 Ongoing Projects List",
        gFormTitle: "📢 Citizen Grievance Redressal Desk",
        gFormSub: "Report damaged roads, broken streetlights, or sewage issues.",
        lblGName: "Full Name",
        lblGType: "Grievance Category",
        lblGDesc: "Issue Description Details",
        btnSubmitG: "Register Grievance",
        gBoardTitle: "💬 Citizen Complaints & Resolution Feed",

        // Panchayat Tab
        idSecTitle: "🪪 Smart Citizen Card ID Generator",
        lblIdName: "Full Name",
        lblIdFather: "Father's Name",
        lblIdAadhaar: "Aadhaar Card No. (Last 4 Digits)",
        lblIdWard: "Ward Location No.",
        lblIdRole: "Occupation / Group Category",
        lblIdPic: "Choose Profile Image",
        lblCName: "Name:",
        lblCFather: "Father:",
        lblCWard: "Ward No.:",
        lblCRole: "Category:",
        lblCNo: "Citizen Identity Number",
        lblCSig: "Ram Singh",
        lblCDes: "Sarpanch, Suryapura",
        btnDownloadCard: "Download Card (PNG)",
        btnPrintCard: "Print Card",
        certFormTitle: "📑 Apply for Digital Certificates",
        certFormSub: "Single-window online registration forms for official documents.",
        lblCertType: "Select Document Type",
        lblCertName: "Applicant's Full Name",
        lblCertPurpose: "Purpose of Application",
        btnSubmitCert: "Submit Request",
        certTrackerTitle: "📋 Digital Certificates Tracker",
        certTrackerSub: "Real-time track list of your applications. (For demo, approvals take 30s. Tap to test!)",
        thCId: "App ID",
        thCType: "Doc Type",
        thCName: "Name",
        thCStatus: "Progress Status",
        thCAction: "Document Link",
        footerCopy: "© 2026 Suryapura Gram Vikas Portal. Protected, Digitized & Self-Reliant Village.",
        footerSub: "Viksit Bharat - Smart Village Campaign | Gram Panchayat Suryapura, Rajasthan",

        // Mobile Nav labels
        mLblHome: "Home",
        mLblDairy: "Dairy/Agri",
        mLblEdu: "Education",
        mLblInfra: "Road Map",
        mLblEp: "E-Panchayat"
    }
};

// --- Initialization & Event Listeners ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial Router & URL Hash check
    const currentHash = window.location.hash.substring(1) || 'home';
    switchTab(currentHash);

    // 2. Load Dairy records, grievances and certificate queues from LocalStorage
    loadDairyData();
    loadGrievanceData();
    loadCertificateData();

    // Set Default Date field value in forms
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('milk-date')) {
        document.getElementById('milk-date').value = today;
    }

    // Citizen ID generator starting setup
    updateDigitalID();

    // Language buttons styling highlight
    updateLanguageUIButtons();
});

// --- SPA Tab Switcher Router ---
function switchTab(tabId) {
    // Hide all sections, show target
    const sections = document.querySelectorAll(".tab-section");
    sections.forEach(sec => {
        sec.classList.remove("active");
    });
    
    const targetSection = document.getElementById(`tab-${tabId}`);
    if (targetSection) {
        targetSection.classList.add("active");
    }

    // Sync Desktop Navbar highlight
    const navLinks = document.querySelectorAll(".navbar-custom .nav-link");
    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.id === `nav-${tabId}`) {
            link.classList.add("active");
        }
    });

    // Sync Mobile Nav Footer highlight
    const mobNavLinks = document.querySelectorAll(".mobile-bottom-nav .mobile-nav-item");
    mobNavLinks.forEach(link => {
        link.classList.remove("active");
        if (link.id === `m-nav-${tabId}`) {
            link.classList.add("active");
        }
    });

    // Set address bar hash smoothly without page jump
    if (window.location.hash.substring(1) !== tabId) {
        window.history.pushState(null, null, `#${tabId}`);
    }

    // Scroll back to top
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Manage hash changes (browser back/forward button clicks)
window.addEventListener("hashchange", () => {
    const hash = window.location.hash.substring(1) || 'home';
    switchTab(hash);
});

// --- Dark Mode Controller ---
function toggleDarkMode() {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("dark-mode", isDark ? "true" : "false");
    
    // Sync Moon/Sun Icons
    const iconDesk = document.getElementById("theme-icon-desk");
    const iconMob = document.getElementById("theme-icon-mob");
    
    if (isDark) {
        iconDesk.className = "fa-solid fa-sun text-warning";
        iconMob.className = "fa-solid fa-sun text-warning";
    } else {
        iconDesk.className = "fa-solid fa-moon";
        iconMob.className = "fa-solid fa-moon";
    }
}

// Load Dark Mode configuration if present
(function() {
    const isDarkStored = localStorage.getItem("dark-mode") === "true";
    if (isDarkStored) {
        document.body.classList.add("dark-mode");
        document.addEventListener("DOMContentLoaded", () => {
            const iconDesk = document.getElementById("theme-icon-desk");
            const iconMob = document.getElementById("theme-icon-mob");
            if (iconDesk) iconDesk.className = "fa-solid fa-sun text-warning";
            if (iconMob) iconMob.className = "fa-solid fa-sun text-warning";
        });
    }
})();

// --- Dynamic Bilingual Translation Controller ---
function toggleLanguage() {
    currentLang = currentLang === 'hi' ? 'en' : 'hi';
    localStorage.setItem("app-lang", currentLang);
    applyTranslations();
}

function applyTranslations() {
    const trans = translations[currentLang];
    
    // Iterate dictionary keys and update corresponding IDs in DOM
    for (const key in trans) {
        const element = document.getElementById(key.replace(/([A-Z])/g, "-$1").toLowerCase());
        if (element) {
            if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                // Apply placeholders
                element.placeholder = trans[key];
            } else {
                element.innerHTML = trans[key];
            }
        }
    }

    // Refresh dynamically loaded components
    updateLanguageUIButtons();
    renderDairyHistory();
    renderGrievancesBoard();
    renderCertificatesBoard();
}

function updateLanguageUIButtons() {
    const btnDesk = document.getElementById("lang-btn-desk");
    const btnMob = document.getElementById("lang-btn-mob");
    if (btnDesk) btnDesk.innerText = currentLang === 'hi' ? 'English' : 'हिन्दी';
    if (btnMob) btnMob.innerText = currentLang === 'hi' ? 'EN' : 'HI';
}

// Initial Lang settings
(function() {
    const storedLang = localStorage.getItem("app-lang");
    if (storedLang) {
        currentLang = storedLang;
        document.addEventListener("DOMContentLoaded", () => {
            applyTranslations();
        });
    }
})();


// --- 1. Module: Dairy & Milk Sales Tracker ---
function loadDairyData() {
    const saved = localStorage.getItem("dairy-records");
    if (saved) {
        dairyRecords = JSON.parse(saved);
    } else {
        dairyRecords = [];
    }
    updateDairyAnalytics();
    renderDairyHistory();
}

function saveMilkRecord(e) {
    e.preventDefault();
    
    const dateVal = document.getElementById("milk-date").value;
    const shiftVal = document.getElementById("milk-shift").value;
    const qtyVal = parseFloat(document.getElementById("milk-liters").value);
    const fatVal = parseFloat(document.getElementById("milk-fat").value);
    
    if (isNaN(qtyVal) || qtyVal <= 0 || isNaN(fatVal) || fatVal < 3.0 || fatVal > 10.0) {
        alert(currentLang === 'hi' ? 'कृपया सही मूल्य दर्ज करें।' : 'Please enter valid values.');
        return;
    }
    
    // Rate Formula: Base ₹40 + (Fat % - 3.5) * 8. Limit between ₹40 and ₹70.
    let rate = 40 + (fatVal - 3.5) * 8;
    rate = Math.max(40, Math.min(70, rate));
    const totalEarning = qtyVal * rate;

    const record = {
        id: Date.now(),
        date: dateVal,
        shift: shiftVal,
        qty: qtyVal,
        fat: fatVal,
        rate: parseFloat(rate.toFixed(2)),
        total: parseFloat(totalEarning.toFixed(2))
    };

    dairyRecords.unshift(record); // Add to beginning
    localStorage.setItem("dairy-records", JSON.stringify(dairyRecords));
    
    // Clear Input quantity/fat fields
    document.getElementById("milk-liters").value = "";
    document.getElementById("milk-fat").value = "";

    // Show Success Alerts
    alert(currentLang === 'hi' ? 'दूध रिकॉर्ड सफलतापूर्वक सहेजा गया!' : 'Milk record logged successfully!');
    
    updateDairyAnalytics();
    renderDairyHistory();
}

function deleteDairyRecord(id) {
    dairyRecords = dairyRecords.filter(rec => rec.id !== id);
    localStorage.setItem("dairy-records", JSON.stringify(dairyRecords));
    updateDairyAnalytics();
    renderDairyHistory();
}

function clearDairyRecords() {
    if (confirm(currentLang === 'hi' ? 'क्या आप सचमुच सभी रिकॉर्ड हटाना चाहते हैं?' : 'Are you sure you want to clear all records?')) {
        dairyRecords = [];
        localStorage.removeItem("dairy-records");
        updateDairyAnalytics();
        renderDairyHistory();
    }
}

function updateDairyAnalytics() {
    let totalLiters = 0;
    let sumFatWeight = 0;
    let totalEarnings = 0;

    dairyRecords.forEach(rec => {
        totalLiters += rec.qty;
        sumFatWeight += rec.fat * rec.qty;
        totalEarnings += rec.total;
    });

    const avgFat = totalLiters > 0 ? (sumFatWeight / totalLiters) : 0;

    // Render Metrics
    document.getElementById("dairy-total-liters").innerText = totalLiters.toFixed(1);
    document.getElementById("dairy-avg-fat").innerText = avgFat.toFixed(1);
    document.getElementById("dairy-total-earnings").innerText = `₹${totalEarnings.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    // Render SVG bar chart representation of the last 7 entries
    renderMilkSVGChart();
}

function renderDairyHistory() {
    const container = document.getElementById("dairy-history-rows");
    if (!container) return;

    if (dairyRecords.length === 0) {
        container.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">${currentLang === 'hi' ? 'कोई वितरण रिकॉर्ड उपलब्ध नहीं है।' : 'No distribution records available.'}</td></tr>`;
        return;
    }

    container.innerHTML = dairyRecords.map(rec => `
        <tr class="numbers-font">
            <td>${rec.date}</td>
            <td class="font-heading">${currentLang === 'hi' ? rec.shift : (rec.shift === 'सुबह' ? 'Morning' : 'Evening')}</td>
            <td class="fw-bold text-success">${rec.qty.toFixed(1)} L</td>
            <td>${rec.fat.toFixed(1)}%</td>
            <td>₹${rec.rate.toFixed(2)}</td>
            <td class="fw-bold text-dark">₹${rec.total.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger border-0 p-1" onclick="deleteDairyRecord(${rec.id})" title="Delete">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Generate animated custom SVG bar chart dynamically
function renderMilkSVGChart() {
    const chartContainer = document.getElementById("milk-supply-chart");
    if (!chartContainer) return;

    if (dairyRecords.length === 0) {
        chartContainer.innerHTML = `<div class="w-100 text-center text-muted py-5" id="chart-empty-msg">${currentLang === 'hi' ? 'रिकॉर्ड दर्ज करते ही चार्ट यहाँ दिखाई देगा' : 'Chart will populate once records are logged'}</div>`;
        return;
    }

    // Take last 7 records in chronological order
    const records = dairyRecords.slice(0, 7).reverse();
    const maxQty = Math.max(...records.map(r => r.qty), 5); // Fallback to 5 to avoid flat charts

    const svgWidth = 600;
    const svgHeight = 220;
    const padding = 40;
    const chartWidth = svgWidth - 2 * padding;
    const chartHeight = svgHeight - 2 * padding;
    
    // Draw columns
    const barWidth = 35;
    const spacing = (chartWidth - (records.length * barWidth)) / (records.length + 1);

    let barsMarkup = '';
    let axesMarkup = '';

    // Draw horizontal grid lines
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight * i / 4);
        const qtyVal = (maxQty * (4 - i) / 4).toFixed(1);
        axesMarkup += `
            <line x1="${padding}" y1="${y}" x2="${svgWidth - padding}" y2="${y}" class="chart-grid-line" />
            <text x="${padding - 10}" y="${y + 4}" fill="#64748b" font-size="10" text-anchor="end" class="numbers-font">${qtyVal}L</text>
        `;
    }

    records.forEach((rec, idx) => {
        const x = padding + spacing + (idx * (barWidth + spacing));
        const valHeight = (rec.qty / maxQty) * chartHeight;
        const y = svgHeight - padding - valHeight;

        // Animate heights beautifully using SVG `<animate>` tag!
        barsMarkup += `
            <g class="chart-bar-group" style="cursor: pointer;">
                <rect x="${x}" y="${svgHeight - padding}" width="${barWidth}" height="0" fill="url(#greenGradient)" rx="4">
                    <animate attributeName="y" from="${svgHeight - padding}" to="${y}" dur="0.8s" fill="freeze" />
                    <animate attributeName="height" from="0" to="${valHeight}" dur="0.8s" fill="freeze" />
                </rect>
                <!-- Tooltip values hover text -->
                <text x="${x + barWidth/2}" y="${y - 8}" fill="var(--primary-green-dark)" font-size="10" font-weight="bold" text-anchor="middle" class="numbers-font">${rec.qty.toFixed(1)}L</text>
                <!-- Dates label -->
                <text x="${x + barWidth/2}" y="${svgHeight - padding + 16}" fill="#64748b" font-size="9" text-anchor="middle" class="numbers-font">${rec.date.substring(5)}</text>
            </g>
        `;
    });

    chartContainer.innerHTML = `
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="100%">
            <defs>
                <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="var(--primary-green)" />
                    <stop offset="100%" stop-color="var(--primary-green-dark)" />
                </linearGradient>
            </defs>
            ${axesMarkup}
            ${barsMarkup}
            <!-- X-axis baseline -->
            <line x1="${padding}" y1="${svgHeight - padding}" x2="${svgWidth - padding}" y2="${svgHeight - padding}" stroke="#94a3b8" stroke-width="2" />
        </svg>
    `;
}

// Cooperative fertilizer reserve simulation
function bookInventory(itemName) {
    const stockElement = document.getElementById(itemName === 'यूरिया' ? 'urea-stock' : (itemName === 'DAP' ? 'dap-stock' : 'org-stock'));
    if (!stockElement) return;

    let currentStock = parseInt(stockElement.innerText);
    if (currentStock <= 0) {
        alert(currentLang === 'hi' ? 'क्षमा करें, स्टॉक समाप्त हो चुका है।' : 'Sorry, item out of stock.');
        return;
    }

    currentStock -= 1;
    stockElement.innerText = `${currentStock} बोरी`;

    alert(currentLang === 'hi' 
        ? `बधाई हो! आपकी 1 बोरी ${itemName} सफलतापूर्वक आरक्षित (Booked) कर ली गई है। समिति से कूपन प्राप्त करें।` 
        : `Congratulations! Your 1 bag of ${itemName} has been reserved. Collect your coupon from cooperative.`
    );
}


// --- 2. Module: Education & Scholarship Finder ---
function filterScholarships() {
    const filterVal = document.getElementById("scholarship-filter").value;
    const rows = document.querySelectorAll("#scholarship-list .scholarship-row");
    
    rows.forEach(row => {
        const grade = row.getAttribute("data-grade");
        if (filterVal === 'all' || grade === filterVal) {
            row.style.display = "block";
        } else {
            row.style.display = "none";
        }
    });
}

function simulateScholarshipApply(name) {
    alert(currentLang === 'hi' 
        ? `आवेदन स्वीकृत! "${name}" के लिए आपका प्राथमिक सत्यापन पूर्ण हो गया है। ई-पंचायत में स्थिति की जाँच करें।`
        : `Application Logged! Your primary eligibility check for "${name}" is complete. Track status in E-Panchayat.`
    );

    // Dynamic addition to E-Panchayat certificate list as a demo!
    const newCert = {
        id: `SCH-${Math.floor(10000 + Math.random() * 90000)}`,
        type: `छात्रवृत्ति: ${name}`,
        name: currentLang === 'hi' ? "रमेश कुमार" : "Ramesh Kumar",
        status: "pending",
        statusVal: 30,
        date: new Date().toISOString().split('T')[0]
    };
    
    certificates.unshift(newCert);
    localStorage.setItem("certificate-applications", JSON.stringify(certificates));
    renderCertificatesBoard();
}

// Interactive educational mathematics quiz minigame
function startMathQuiz() {
    let q1 = prompt("विद्या ज्योति क्विज - प्रश्न 1:\n7 x 8 कितना होता है?", "");
    if (q1 === null) return;
    if (parseInt(q1.trim()) !== 56) {
        alert(currentLang === 'hi' ? "गलत उत्तर! कोशिश करते रहें। 😞" : "Wrong answer! Keep learning. 😞");
        return;
    }

    let q2 = prompt("विद्या ज्योति क्विज - प्रश्न 2:\n35 + 47 कितना होता है?", "");
    if (q2 === null) return;
    if (parseInt(q2.trim()) !== 82) {
        alert(currentLang === 'hi' ? "गलत उत्तर! कोशिश करते रहें। 😞" : "Wrong answer! Keep learning. 😞");
        return;
    }

    let q3 = prompt("विद्या ज्योति क्विज - अंतिम प्रश्न:\n120 - 45 कितना होता है?", "");
    if (q3 === null) return;
    if (parseInt(q3.trim()) !== 75) {
        alert(currentLang === 'hi' ? "गलत उत्तर! कोशिश करते रहें। 😞" : "Wrong answer! Keep learning. 😞");
        return;
    }

    alert(currentLang === 'hi' 
        ? "🏆 अद्भुत! आपने सभी 3 प्रश्नों का सही उत्तर दिया। आप सूर्यपुरा के गौरव हैं!" 
        : "🏆 Outstanding! You answered all 3 questions correctly. You are the pride of Suryapura!"
    );
}


// --- 3. Module: Gram Sampark Infrastructure & Grievances ---
function loadGrievanceData() {
    const saved = localStorage.getItem("grievance-tickets");
    if (saved) {
        grievances = JSON.parse(saved);
    } else {
        grievances = [...defaultGrievances];
        localStorage.setItem("grievance-tickets", JSON.stringify(grievances));
    }
    renderGrievancesBoard();
}

function submitGrievance(e) {
    e.preventDefault();

    const nameVal = document.getElementById("g-name").value;
    const typeVal = document.getElementById("g-type").value;
    const descVal = document.getElementById("g-desc").value;

    const ticket = {
        id: Date.now(),
        name: nameVal,
        type: typeVal,
        desc: descVal,
        date: new Date().toISOString().split('T')[0],
        votes: 1,
        status: "Submitted",
        statusVal: 10
    };

    grievances.unshift(ticket);
    localStorage.setItem("grievance-tickets", JSON.stringify(grievances));

    // Reset inputs
    document.getElementById("g-name").value = "";
    document.getElementById("g-desc").value = "";

    alert(currentLang === 'hi' 
        ? "आपकी शिकायत पंजीकृत कर ली गई है! इसे सार्वजनिक समाधान बोर्ड में जोड़ा गया है।" 
        : "Grievance submitted successfully! Added to public verification feed."
    );

    renderGrievancesBoard();
}

function voteGrievance(id) {
    const ticket = grievances.find(t => t.id === id);
    if (ticket) {
        ticket.votes += 1;
        // Increment progress status bar slightly as interest increases
        if (ticket.status === 'Submitted' && ticket.votes >= 5) {
            ticket.status = 'Inspected';
            ticket.statusVal = 40;
        } else if (ticket.status === 'Inspected' && ticket.votes >= 12) {
            ticket.status = 'In Progress';
            ticket.statusVal = 70;
        }
        
        localStorage.setItem("grievance-tickets", JSON.stringify(grievances));
        renderGrievancesBoard();
    }
}

function renderGrievancesBoard() {
    const feed = document.getElementById("grievance-feed");
    if (!feed) return;

    if (grievances.length === 0) {
        feed.innerHTML = `<div class="text-center text-muted py-4">${currentLang === 'hi' ? 'कोई सक्रिय शिकायत उपलब्ध नहीं है।' : 'No active grievances.'}</div>`;
        return;
    }

    feed.innerHTML = grievances.map(t => {
        let statusBadge = '';
        let translatedStatus = t.status;
        
        if (t.status === 'Submitted') {
            statusBadge = 'bg-secondary';
            if (currentLang === 'en') translatedStatus = 'Submitted';
            else translatedStatus = 'पंजीकृत (Submitted)';
        } else if (t.status === 'Inspected') {
            statusBadge = 'bg-info text-dark';
            if (currentLang === 'en') translatedStatus = 'Inspected';
            else translatedStatus = 'निरीक्षण पूर्ण (Inspected)';
        } else if (t.status === 'In Progress') {
            statusBadge = 'bg-warning text-dark';
            if (currentLang === 'en') translatedStatus = 'Under Repair';
            else translatedStatus = 'कार्य चालू (In Progress)';
        } else if (t.status === 'Completed') {
            statusBadge = 'bg-success';
            if (currentLang === 'en') translatedStatus = 'Resolved';
            else translatedStatus = 'समाधान पूर्ण (Resolved)';
        }

        return `
            <div class="grievance-ticket">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h6 class="fw-bold mb-0 text-dark font-heading">${t.type}</h6>
                        <small class="text-muted text-uppercase numbers-font" style="font-size: 0.65rem;">${currentLang === 'hi' ? 'आवेदक' : 'By'}: ${t.name} | Date: ${t.date}</small>
                    </div>
                    <span class="badge ${statusBadge} font-heading" style="font-size:0.7rem;">${translatedStatus}</span>
                </div>
                <p class="small text-muted mb-2">${t.desc}</p>
                
                <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <!-- Progress Bar -->
                    <div style="flex-grow:1; max-width: 250px;">
                        <div class="progress-bar-custom" style="height: 5px; margin-top:0;">
                            <div class="progress-fill" style="width: ${t.statusVal}%;"></div>
                        </div>
                    </div>
                    
                    <!-- Upvote Action -->
                    <div class="d-flex align-items-center gap-2">
                        <span class="small numbers-font text-dark fw-bold"><i class="fa-solid fa-thumbs-up text-success me-1"></i>${t.votes}</span>
                        <button class="btn btn-xs btn-outline-custom rounded-pill py-1 px-2.5" style="font-size:0.7rem;" onclick="voteGrievance(${t.id})">
                            ${currentLang === 'hi' ? 'समर्थन करें (+1)' : 'Upvote (+1)'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Show project overlay details when clicking node on SVG Map
function showMapProjectDetails(id, name, status, budget, progressPercent) {
    const card = document.getElementById("map-info-box");
    if (!card) return;

    document.getElementById("map-proj-name").innerText = name;
    document.getElementById("map-proj-status").innerText = status;
    document.getElementById("map-proj-budget").innerText = budget;
    
    const progressFill = document.getElementById("map-proj-progress");
    progressFill.style.width = progressPercent;

    // Show Card Overlay
    card.style.display = "block";

    // Auto-hide details after 10 seconds
    if (window.mapOverlayTimeout) clearTimeout(window.mapOverlayTimeout);
    window.mapOverlayTimeout = setTimeout(() => {
        card.style.display = "none";
    }, 10000);
}


// --- 4. Module: E-Panchayat Portal & Citizen ID Card Generator ---
function loadCertificateData() {
    const saved = localStorage.getItem("certificate-applications");
    if (saved) {
        certificates = JSON.parse(saved);
    } else {
        certificates = [...defaultCertificates];
        localStorage.setItem("certificate-applications", JSON.stringify(certificates));
    }
    renderCertificatesBoard();

    // Start auto approval simulator thread (Runs every 30s)
    if (!window.approvalInterval) {
        window.approvalInterval = setInterval(simulateCertificateApproval, 30000);
    }
}

// Update the Digital ID live preview
function updateDigitalID() {
    const name = document.getElementById("id-input-name").value || (currentLang === 'hi' ? "रमेश कुमार" : "Ramesh Kumar");
    const father = document.getElementById("id-input-father").value || (currentLang === 'hi' ? "राम सिंह" : "Ram Singh");
    const aadhaar = document.getElementById("id-input-aadhaar").value || "9876";
    const ward = document.getElementById("id-input-ward").value;
    const role = document.getElementById("id-input-role").value || (currentLang === 'hi' ? "किसान एवं पशुपालक" : "Farmer & Dairy");

    // Map to Card preview elements
    document.getElementById("card-name").innerText = name;
    document.getElementById("card-father").innerText = father;
    document.getElementById("card-ward").innerText = ward;
    document.getElementById("card-role").innerText = role;

    // Signature label
    document.getElementById("lbl-c-sig").innerText = name;

    // Holographic card digit derivation
    document.getElementById("card-id-number").innerText = `SP-${aadhaar}-026`;
}

// Custom photo loader using FileReader
function loadCitizenPhoto(e) {
    const reader = new FileReader();
    reader.onload = function() {
        const photoEl = document.getElementById("card-photo");
        const placeholderEl = document.getElementById("card-photo-placeholder");
        
        photoEl.src = reader.result;
        photoEl.style.display = "block";
        placeholderEl.style.display = "none";
    };
    if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
    }
}

function downloadCitizenIDCard() {
    alert(currentLang === 'hi' 
        ? "स्मार्ट नागरिक कार्ड (PNG) एक्सपोर्ट हो रहा है! मुद्रण पूर्ण होने तक प्रतीक्षा करें।" 
        : "Exporting Smart Citizen ID as PNG! Wait for document compression."
    );
    
    // Quick custom alert simulation for high-fidelity feel
    setTimeout(() => {
        alert(currentLang === 'hi' ? "कार्ड गैलरी में सहेज लिया गया!" : "Card saved to device gallery!");
    }, 1500);
}

function printCitizenIDCard() {
    // Generate clean print layout styles locally
    const printContent = document.getElementById("visual-id-card").outerHTML;
    const printWindow = window.open('', '', 'height=500,width=800');
    
    printWindow.document.write(`
        <html>
        <head>
            <title>Suryapura Citizen Card</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: #f1f5f9;
                }
                ${document.querySelector('style') ? document.querySelector('style').innerHTML : ''}
                .digital-id-card-view {
                    width: 450px !important;
                    height: 285px !important;
                    background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #004d40 100%) !important;
                    color: white !important;
                    border-radius: 20px !important;
                    padding: 20px !important;
                    box-shadow: none !important;
                    border: 2px solid #2e7d32 !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .id-photo-frame {
                    width: 85px;
                    height: 105px;
                    border: 2px solid rgba(255,255,255,0.5);
                    background: rgba(255,255,255,0.15) !important;
                    border-radius: 8px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .id-label { color: rgba(255,255,255,0.7) !important; }
                .id-number { color: #ffb300 !important; }
                .id-sig-image { border-bottom: 1px solid rgba(255,255,255,0.3) !important; }
            </style>
        </head>
        <body>
            ${printContent}
            <script>
                window.onload = function() {
                    window.print();
                    window.close();
                }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Certificate Application Submission
function submitCertificateRequest(e) {
    e.preventDefault();

    const typeVal = document.getElementById("cert-type").value;
    const nameVal = document.getElementById("cert-citizen-name").value;
    const purposeVal = document.getElementById("cert-purpose").value;

    const newApplication = {
        id: `CERT-${Math.floor(10000 + Math.random() * 90000)}`,
        type: typeVal,
        name: nameVal,
        status: "pending",
        statusVal: 30,
        date: new Date().toISOString().split('T')[0]
    };

    certificates.unshift(newApplication);
    localStorage.setItem("certificate-applications", JSON.stringify(certificates));

    // Reset fields
    document.getElementById("cert-citizen-name").value = "";
    document.getElementById("cert-purpose").value = "";

    alert(currentLang === 'hi'
        ? `आवेदन दर्ज! आपका आवेदन ID ${newApplication.id} है। 30 सेकंड में स्थिति स्वीकृत होने की प्रतीक्षा करें।`
        : `Request Submitted! Application reference ID is ${newApplication.id}. Wait 30 seconds for verification approval.`
    );

    renderCertificatesBoard();
}

// Simulates real-time certificate review by local government
function simulateCertificateApproval() {
    let stateChanged = false;
    
    certificates.forEach(c => {
        if (c.status === 'pending') {
            c.status = 'verified';
            c.statusVal = 70;
            stateChanged = true;
        } else if (c.status === 'verified') {
            c.status = 'issued';
            c.statusVal = 100;
            stateChanged = true;
        }
    });

    if (stateChanged) {
        localStorage.setItem("certificate-applications", JSON.stringify(certificates));
        renderCertificatesBoard();
    }
}

function renderCertificatesBoard() {
    const container = document.getElementById("certificate-tracker-rows");
    if (!container) return;

    if (certificates.length === 0) {
        container.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">${currentLang === 'hi' ? 'कोई सक्रिय आवेदन उपलब्ध नहीं है।' : 'No active requests logged.'}</td></tr>`;
        return;
    }

    container.innerHTML = certificates.map(c => {
        let labelClass = 'bg-secondary';
        let translatedStatus = c.status;
        let actionBtn = `<span class="text-muted small">${currentLang === 'hi' ? 'प्रतीक्षा करें' : 'Processing'}</span>`;

        if (c.status === 'pending') {
            labelClass = 'bg-secondary';
            translatedStatus = currentLang === 'hi' ? 'समीक्षा अधीन (Under Review)' : 'Under Review';
        } else if (c.status === 'verified') {
            labelClass = 'bg-info text-dark';
            translatedStatus = currentLang === 'hi' ? 'जांच पूर्ण (Verified)' : 'Verified';
        } else if (c.status === 'issued') {
            labelClass = 'bg-success';
            translatedStatus = currentLang === 'hi' ? 'जारी (Approved & Issued)' : 'Issued';
            
            // Render Download/Print Action once status is Issued
            actionBtn = `
                <button class="btn btn-xs btn-success rounded-pill px-2.5 py-1" style="font-size:0.7rem;" onclick="simulateDocumentDownload('${c.id}', '${c.type}', '${c.name}')">
                    <i class="fa-solid fa-file-pdf me-1"></i> ${currentLang === 'hi' ? 'डाउनलोड' : 'Download'}
                </button>
            `;
        }

        return `
            <tr class="numbers-font">
                <td class="fw-bold text-dark">${c.id}</td>
                <td class="font-heading">${c.type}</td>
                <td class="font-heading">${c.name}</td>
                <td>
                    <span class="badge ${labelClass} font-heading" style="font-size: 0.7rem; display:block; text-align:center;">${translatedStatus}</span>
                    <div class="progress-bar-custom mt-2" style="height: 4px;">
                        <div class="progress-fill" style="width: ${c.statusVal}%;"></div>
                    </div>
                </td>
                <td class="text-center font-heading">${actionBtn}</td>
            </tr>
        `;
    }).join('');
}

function simulateDocumentDownload(id, type, name) {
    alert(currentLang === 'hi' 
        ? `सत्यापन पूर्ण! दस्तावेज़ [${id} - ${type}] डिजिटल रूप से सरपंच के हस्ताक्षर के साथ सहेज लिया गया।`
        : `Verification Complete! Document [${id} - ${type}] saved on device with digital seal authorization.`
    );
}

// --- 5. Citizen Login & Modal simulation ---
const loginModalElement = document.getElementById('loginModal');
let bootstrapLoginModal = null;

function showLoginModal() {
    if (loginModalElement) {
        if (!bootstrapLoginModal) {
            bootstrapLoginModal = new bootstrap.Modal(loginModalElement);
        }
        bootstrapLoginModal.show();
    }
}

function handleCitizenLogin(e) {
    e.preventDefault();
    
    const idVal = document.getElementById("login-id").value;
    const pinVal = document.getElementById("login-pin").value;

    if (idVal.trim() && pinVal.length === 4) {
        if (bootstrapLoginModal) {
            bootstrapLoginModal.hide();
        }
        alert(currentLang === 'hi' 
            ? `नागरिक लॉगिन सफल! स्वागत है, रमेश कुमार। आपकी डिजिटल पंचायत प्रोफाइल लोड हो गई है।`
            : `Login successful! Welcome, Ramesh Kumar. Loaded smart dashboard profile.`
        );

        // Auto redirect directly to Panchayat Tab to see generated card
        switchTab('panchayat');
    }
}
