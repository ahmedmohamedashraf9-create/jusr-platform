document.addEventListener("DOMContentLoaded", async () => {
    const serviceForm = document.getElementById("requestForm");
    const serviceSelect = document.getElementById("serviceType");
    const directionSelect = document.getElementById("direction");
    const serviceGrid = document.getElementById("serviceGrid");
    const backPublicBtn = document.getElementById("backPublic");
    const adminSection = document.getElementById("admin");
    const publicView = document.getElementById("publicView") || document.querySelector("main");
    const trackForm = document.getElementById("trackForm");
    const trackInput = document.getElementById("trackInput");
    const trackResult = document.getElementById("trackResult");
    const heroStartBtn = document.getElementById("heroStartBtn");
    const navRequestBtn = document.getElementById("navRequestBtn");
    const langToggleBtn = document.getElementById("langToggle");

    // 🔗 رابط جوجل شيت السحابي الخاص بك:
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz8Eurs4yZOPws9YLHEIPWmEpYZ_vKyL7Wa7Q2XduMR7EkFKmI_Au7L06hYmoofbtlhuA/exec";

    // اللغة الحالية (الافتراضي عربي ويحفظ اختيار الزائر)
    let currentLang = localStorage.getItem("jusr_lang") || "ar";

    // قاموس الترجمة الكامل (عربي ⇄ إنجليزي)
    const translations = {
        ar: {
            topMessage: "منصة جسر مصر للعالم 🌍 — بوابتك للدراسة وعقود العمل والخدمات الدولية",
            langBtn: "🌐 English",
            brandTitle: "جسر مصر للعالم",
            brandSub: " | خدمات الدراسة وعقود العمل الدولية",
            navServices: "الخدمات",
            navRequest: "اطلب خدمة",
            navTrack: "متابعة طلب",
            navAdmin: "لوحة الإدارة",
            requestBtn: "اطلب خدمة",
            eyebrow: "روسيا • بيلاروسيا • رومانيا • قيرغيزستان • أوزبكستان",
            heroTitle: "جسر مصر للعالم،<br>مشوارك للدراسة والعمل بالخارج أسهل وأوضح.",
            heroDesc: "من القبولات الجامعية والخدمات الدراسية إلى عقود العمل الموثقة، التأشيرات، حجز الطيران والسكن في (روسيا، بيلاروسيا، رومانيا، قيرغيزستان، وأوزبكستان) — أرسل طلبك وتابعه خطوة بخطوة مع فريقنا.",
            startRequest: "ابدأ طلبك الآن ←",
            browseServices: "استعرض الخدمات الأساسية",
            trackOrderBtn: "تابع حالة طلبك",
            egypt: "مصر",
            world: "العالم",
            heroNote: "عقود عمل • خدمات دراسية • متابعة بالرقم المرجعي",
            trust1: "خطوات وشروط واضحة",
            trust1d: "نوضح لك المتطلبات والإجراءات قبل البدء",
            trust2: "متابعة فورية للطلب",
            trust2d: "رقم مرجعي خاص لمتابعة حالة طلبك",
            trust3: "دعم عربي وإنجليزي",
            trust3d: "تغطية دولية لروسيا، بيلاروسيا، رومانيا، قيرغيزستان، وأوزبكستان",
            statsHeading: "📊 مؤشرات إنجاز الطلبات عبر منصة جسر مصر للعالم",
            statsSub: "تحديث مباشر لحركة الطلبات والخدمات الدراسية وعقود العمل الدولية لحظة بلحظة",
            statTotalLabel: "إجمالي الطلبات",
            statNewLabel: "طلبات جديدة",
            statProgLabel: "قيد التنفيذ",
            statDoneLabel: "طلبات مكتملة",
            servicesTitle: "الخدمات الأساسية عبر جسر مصر للعالم",
            servicesSub: "اختر الخدمة المناسبة (دراسة، عقود عمل، تأشيرات، وغيرها) واضغط لملء نموذج الطلب مباشرة.",
            availBadge: "متاح للطلب",
            orderServiceBtn: "اطلب هذه الخدمة",
            disclaimerTitle: "⚠️ تنبيه مهم حول الشروط وتوفر الخدمات:",
            disclaimerText: "هذه القائمة تمثل الخدمات التي تستقبل المنصة طلبات الاستفسار والتقديم بشأنها، ولا تُعد ضمانًا لتوفر كل خدمة في كل وقت أو قبول أي طلب تلقائيًا إلا بعد المراجعة الرسمية.",
            requestEyebrow: "نموذج طلب خدمة دولية",
            requestTitle: "أرسل تفاصيل طلبك،<br>وفريقنا يرتب معك الخطوة القادمة.",
            requestDesc: "املأ بيانات التواصل الضرورية واختر الدولة والخدمة المطلوبة. لا ترسل كلمات مرور أو أرقام بطاقات بنكية في هذا النموذج الأولي.",
            info1: "يحصل طلبك فورًا على رقم مرجعي فريد يمكنك نسخُه ومتابعته.",
            info2: "يراجع المدير الطلب ويعيّن المختص للتواصل معك عبر واتساب.",
            nameLabel: "الاسم الكامل *",
            namePlaceholder: "الاسم بالكامل",
            phoneLabel: "رقم واتساب للتواصل *",
            serviceLabel: "الخدمة المطلوبة *",
            selectServiceDefault: "اختر الخدمة المطلوبة",
            directionLabel: "الوجهة / الدولة المستهدفة *",
            detailsLabel: "تفاصيل الطلب أو الاستفسار (اختياري)",
            detailsPlaceholder: "اكتب التخصص الدراسي المطلوب أو نوع عقد العمل أو أي تفاصيل إضافية...",
            submitRequest: "إرسال الطلب الآن",
            clearForm: "مسح الحقول",
            privacyNote: "تُحفظ الطلبات وتُتابَع بأمان عبر النظام السحابي لمنصة جسر مصر للعالم.",
            trackTitle: "متابعة حالة طلبك",
            trackSub: "أدخل الرقم المرجعي للطلب لمعرفة حالته الحالية.",
            trackBtn: "بحث عن الطلب",
            modalTitle: "تم إرسال طلبك بنجاح!",
            modalSub: "احتفظ برقم طلبك المرجعي أدناه لمتابعة حالته في أي وقت:",
            copyBtn: "📋 نسخ رقم الطلب",
            copiedBtn: "✅ تم النسخ بنجاح!",
            closeBtn: "إغلاق",
            footerBrand: "جسر مصر للعالم 🌍 | خدمات الدراسة وعقود العمل الدولية",
            footerDesc: "منصة متكاملة لاستقبال ومتابعة طلبات الخدمات الدراسية وعقود العمل والتأشيرات (قيرغيزستان، بيلاروسيا، رومانيا، أوزبكستان، وروسيا).",
            ownerLabel: "صاحب المؤسسة:",
            ownerName: "دكتور محمد القصيري",
            managerLabel: "مدير المؤسسة:",
            managerName: "مهندس أحمد أبوإمام",
            mobileAdminBtn: "🔐 الإدارة"
        },
        en: {
            topMessage: "Jusr Egypt to the World 🌍 — Your Gateway to Study, Work Contracts & Global Services",
            langBtn: "🌐 العربية",
            brandTitle: "Jusr Egypt to the World",
            brandSub: " | Study & Global Work Contracts",
            navServices: "Services",
            navRequest: "Request Service",
            navTrack: "Track Order",
            navAdmin: "Admin Panel",
            requestBtn: "Request Now",
            eyebrow: "Russia • Belarus • Romania • Kyrgyzstan • Uzbekistan",
            heroTitle: "Jusr Egypt to the World,<br>Your Journey to Study & Work Abroad Made Easy.",
            heroDesc: "From university admissions & educational services to official work contracts, visas, flights, and housing in (Russia, Belarus, Romania, Kyrgyzstan, and Uzbekistan) — Submit and track your request step by step.",
            startRequest: "Start Your Request →",
            browseServices: "Explore Services",
            trackOrderBtn: "Track Your Request",
            egypt: "Egypt",
            world: "World",
            heroNote: "Work Contracts • Study Abroad • Reference Tracking",
            trust1: "Clear Steps & Terms",
            trust1d: "We explain all requirements before starting",
            trust2: "Instant Order Tracking",
            trust2d: "Unique reference ID to track your request status",
            trust3: "Arabic & English Support",
            trust3d: "Covering Russia, Belarus, Romania, Kyrgyzstan & Uzbekistan",
            statsHeading: "📊 Live Order Metrics — Jusr Egypt to the World",
            statsSub: "Real-time updates for study services and international work contract requests",
            statTotalLabel: "Total Requests",
            statNewLabel: "New Requests",
            statProgLabel: "In Progress",
            statDoneLabel: "Completed",
            servicesTitle: "Core Services via Jusr Platform",
            servicesSub: "Choose the right service (Study, Work Contracts, Visas, etc.) and click to fill the form directly.",
            availBadge: "Available",
            orderServiceBtn: "Request This Service",
            disclaimerTitle: "⚠️ Important Notice Regarding Terms & Availability:",
            disclaimerText: "This list represents services open for inquiry and application. Submitting a form does not guarantee automatic acceptance until official review is completed.",
            requestEyebrow: "International Service Request Form",
            requestTitle: "Submit Your Request Details,<br>And Our Team Will Arrange the Next Step.",
            requestDesc: "Fill in your contact details and choose your target country and service. Do not send passwords or bank card numbers in this initial form.",
            info1: "Your request immediately receives a unique reference number to copy and track.",
            info2: "Our specialist reviews your request and contacts you directly via WhatsApp.",
            nameLabel: "Full Name *",
            namePlaceholder: "Enter your full name",
            phoneLabel: "WhatsApp Number *",
            serviceLabel: "Required Service *",
            selectServiceDefault: "Select Required Service",
            directionLabel: "Target Country / Destination *",
            detailsLabel: "Request Details or Inquiry (Optional)",
            detailsPlaceholder: "Write the desired study major, work contract type, or any additional details...",
            submitRequest: "Submit Request Now",
            clearForm: "Clear Fields",
            privacyNote: "Requests are securely saved and tracked via Jusr Cloud System.",
            trackTitle: "Track Your Request Status",
            trackSub: "Enter your order reference number to check its current status.",
            trackBtn: "Search Request",
            modalTitle: "Request Submitted Successfully!",
            modalSub: "Save your reference number below to track your status anytime:",
            copyBtn: "📋 Copy Reference ID",
            copiedBtn: "✅ Copied Successfully!",
            closeBtn: "Close",
            footerBrand: "Jusr Egypt to the World 🌍 | Study & International Work Services",
            footerDesc: "Integrated platform for educational services, work contracts, and visas (Kyrgyzstan, Belarus, Romania, Uzbekistan, and Russia).",
            ownerLabel: "Founder & Owner:",
            ownerName: "Dr. Mohamed El-Kosairy",
            managerLabel: "Managing Director:",
            managerName: "Eng. Ahmed Abo-Emam",
            mobileAdminBtn: "🔐 Admin"
        }
    };

    // قائمة الدول/الاتجاهات باللغتين
    const directionsList = [
        { value: "مصر ← قيرغيزستان", ar: "مصر ← قيرغيزستان 🇰🇬", en: "Egypt ➔ Kyrgyzstan 🇰🇬" },
        { value: "مصر ← بيلاروسيا", ar: "مصر ← بيلاروسيا 🇧🇾", en: "Egypt ➔ Belarus 🇧🇾" },
        { value: "مصر ← رومانيا", ar: "مصر ← رومانيا 🇷🇴", en: "Egypt ➔ Romania 🇷🇴" },
        { value: "مصر ← أوزبكستان", ar: "مصر ← أوزبكستان 🇺🇿", en: "Egypt ➔ Uzbekistan 🇺🇿" },
        { value: "مصر ← روسيا", ar: "مصر ← روسيا 🇷🇺", en: "Egypt ➔ Russia 🇷🇺" },
        { value: "من الخارج ← مصر", ar: "من الخارج ← مصر 🇪🇬", en: "Abroad ➔ Egypt 🇪🇬" },
        { value: "دولة أخرى / استفسار عام", ar: "دولة أخرى / استفسار عام 🌍", en: "Other Country / General Inquiry 🌍" }
    ];

    // 1. القائمة الكاملة للـ 15 خدمة (عربي + إنجليزي)
    const allServices = [
        { 
            id: "study", category: "education", icon: "🎓", sortOrder: 1, 
            titleAr: "القبول الجامعي والخدمات الدراسية الدولية", 
            titleEn: "University Admissions & Study Abroad", 
            descAr: "تأمين القبولات الجامعية والمنح والسنة التحضيرية في (قيرغيزستان، بيلاروسيا، رومانيا، أوزبكستان، وروسيا) بالجامعات المعتمدة.", 
            descEn: "Securing university admissions, scholarships, and preparatory year in Kyrgyzstan, Belarus, Romania, Uzbekistan, and Russia." 
        },
        { 
            id: "work", category: "business", icon: "👷‍♂️", sortOrder: 2, 
            titleAr: "عقود العمل والتوظيف الخارجي", 
            titleEn: "Work Contracts & Overseas Employment", 
            descAr: "توفير عقود عمل موثقة ورسمية وفرص توظيف في (قيرغيزستان، بيلاروسيا، رومانيا، أوزبكستان، وروسيا) مع إنهاء كافة الإجراءات.", 
            descEn: "Providing official verified work contracts and job opportunities in Kyrgyzstan, Belarus, Romania, Uzbekistan, and Russia." 
        },
        { 
            id: "visa", category: "travel", icon: "🛂", sortOrder: 3, 
            titleAr: "تأشيرات الدخول والدعوات الرسمية", 
            titleEn: "Entry Visas & Official Invitations", 
            descAr: "استخراج الدعوات الدراسية ودعوات العمل والسياحة وتخليص إجراءات التأشيرات لجميع الدول المستهدفة.", 
            descEn: "Issuing study, work, and tourist invitations and completing visa procedures for all target countries." 
        },
        { 
            id: "housing", category: "living", icon: "🏠", sortOrder: 4, 
            titleAr: "السكن الطلابي والمعيشة والاستقبال", 
            titleEn: "Student Housing, Airport Pickup & Living", 
            descAr: "توفير السكن الجامعي أو الخاص وترتيب استقبال المطار وإنهاء إجراءات الإقامة فور الوصول.", 
            descEn: "Arranging university dorms or private accommodation, airport pickup, and residency registration upon arrival." 
        },
        { 
            id: "equivalence", category: "education", icon: "📜", sortOrder: 5, 
            titleAr: "معادلة الشهادات والدبلومات", 
            titleEn: "Certificate & Diploma Equivalence", 
            descAr: "إجراءات توثيق ومعادلة الشهادات الدراسية والجامعية بين مصر ومختلف الدول.", 
            descEn: "Authentication and equivalence procedures for academic and university certificates internationally." 
        },
        { 
            id: "language", category: "education", icon: "🗣️", sortOrder: 6, 
            titleAr: "دورات اللغات والتأهيل الدولي", 
            titleEn: "Language Courses & International Prep", 
            descAr: "كورسات مكثفة لتأهيل الطلاب والمسافرين للعمل والدراسة بالخارج لغوياً.", 
            descEn: "Intensive language courses to prepare students and travelers for studying and working abroad." 
        },
        { 
            id: "flights", category: "travel", icon: "✈️", sortOrder: 7, 
            titleAr: "تذاكر الطيران والترانزيت", 
            titleEn: "Flight Tickets & Transit Booking", 
            descAr: "حجز أفضل خطوط الطيران المباشر والترانزيت بأفضل الأسعار لجميع الوجهات الدولية.", 
            descEn: "Booking the best direct and transit flights at competitive prices to all international destinations." 
        },
        { 
            id: "tourism", category: "travel", icon: "🏛️", sortOrder: 8, 
            titleAr: "البرامج السياحية والثقافية", 
            titleEn: "Tourism & Cultural Programs", 
            descAr: "رحلات سياحية وبرامج استكشافية متكاملة بين مصر ومختلف العواصم والمدن العالمية.", 
            descEn: "Comprehensive tourist trips and exploratory programs between Egypt and international capitals." 
        },
        { 
            id: "legal", category: "business", icon: "⚖️", sortOrder: 9, 
            titleAr: "الاستشارات القانونية وتوثيق العقود", 
            titleEn: "Legal Consultations & Document Attestation", 
            descAr: "توثيق عقود العمل والدراسة والمستندات الرسمية والتخليص القانوني.", 
            descEn: "Notarizing work/study contracts, official documents, and providing legal clearance." 
        },
        { 
            id: "translation", category: "business", icon: "📝", sortOrder: 10, 
            titleAr: "الترجمة المعتمدة للمستندات", 
            titleEn: "Certified Document Translation", 
            descAr: "ترجمة رسمية معتمدة للشهادات والأوراق الرسمية للسفارات والجهات الحكومية.", 
            descEn: "Official certified translation for certificates, passports, and documents for embassies and universities." 
        },
        { 
            id: "trade", category: "business", icon: "💼", sortOrder: 11, 
            titleAr: "تأسيس الشركات والأعمال التجارية", 
            titleEn: "Company Formation & Business Setup", 
            descAr: "استشارات الاستثمار وتأسيس الشركات وربط الأسواق التجارية الدولية.", 
            descEn: "Investment consulting, company registration, and connecting international trade markets." 
        },
        { 
            id: "money", category: "general", icon: "💳", sortOrder: 12, 
            titleAr: "استشارات تحويل الأموال والقنوات الرسمية", 
            titleEn: "Official Money Transfer Consultations", 
            descAr: "توضيح القنوات الرسمية والآمنة للتحويل المالي وسداد المصروفات بالخارج.", 
            descEn: "Guidance on safe, official channels for tuition payment and international money transfers." 
        },
        { 
            id: "health", category: "general", icon: "🏥", sortOrder: 13, 
            titleAr: "التأمين الصحي والرعاية الطبية", 
            titleEn: "Health Insurance & Medical Care", 
            descAr: "ترتيب التأمين الصحي الدولي والمتابعة الطبية للطلاب والعاملين بالخارج.", 
            descEn: "Issuing international medical insurance and healthcare follow-up for students and workers abroad." 
        },
        { 
            id: "shipping", category: "general", icon: "📦", sortOrder: 14, 
            titleAr: "الشحن الدولي السريع", 
            titleEn: "Express International Shipping", 
            descAr: "خدمات شحن الطرود والأوراق والمستندات الشخصية والتجارية بسرعة وأمان.", 
            descEn: "Fast and secure international shipping for original documents, personal packages, and commercial parcels." 
        },
        { 
            id: "other", category: "general", icon: "🤝", sortOrder: 15, 
            titleAr: "خدمات الاستشارات العامة والأخرى", 
            titleEn: "General Consultations & Custom Services", 
            descAr: "استشارات مخصصة وحلول شاملة لكافة استفسارات السفر والدراسة والعمل بالخارج.", 
            descEn: "Tailored consultations and complete solutions for all travel, study, and work inquiries abroad." 
        }
    ];

    let adminRequestsList = JSON.parse(localStorage.getItem("jusr_requests") || "[]");

    function saveRequests() {
        localStorage.setItem("jusr_requests", JSON.stringify(adminRequestsList));
    }

    function getStatusLabel(status) {
        const s = String(status || '').toLowerCase().trim();
        if (currentLang === "en") {
            const labelsEn = { 'new': 'New', 'in_progress': 'In Progress', 'inprogress': 'In Progress', 'completed': 'Completed', 'rejected': 'Rejected' };
            return labelsEn[s] || status;
        }
        const labelsAr = { 'new': 'جديد', 'in_progress': 'قيد التنفيذ', 'inprogress': 'قيد التنفيذ', 'completed': 'مكتمل', 'rejected': 'مرفوض' };
        return labelsAr[s] || status;
    }

    function getServiceTitle(serviceId) {
        const found = allServices.find(s => s.id === serviceId);
        if (!found) return serviceId;
        return currentLang === "en" ? found.titleEn : found.titleAr;
    }

    // دالة بناء كروت الخدمات والقوائم المنسدلة حسب اللغة الحالية
    function renderServicesAndSelects() {
        const t = translations[currentLang];

        if (serviceSelect) {
            const prevVal = serviceSelect.value;
            serviceSelect.innerHTML = `<option value="" disabled selected>${t.selectServiceDefault}</option>`;
            allServices.forEach(s => {
                const opt = document.createElement("option");
                opt.value = s.id;
                opt.textContent = currentLang === "en" ? s.titleEn : s.titleAr;
                serviceSelect.appendChild(opt);
            });
            if (prevVal) serviceSelect.value = prevVal;
        }

        if (directionSelect) {
            const prevDir = directionSelect.value;
            directionSelect.innerHTML = "";
            directionsList.forEach(d => {
                const opt = document.createElement("option");
                opt.value = d.value;
                opt.textContent = currentLang === "en" ? d.en : d.ar;
                directionSelect.appendChild(opt);
            });
            if (prevDir) directionSelect.value = prevDir;
        }

        if (serviceGrid) {
            serviceGrid.innerHTML = "";
            allServices.forEach(s => {
                const card = document.createElement("div");
                card.className = "service";
                const title = currentLang === "en" ? s.titleEn : s.titleAr;
                const desc = currentLang === "en" ? s.descEn : s.descAr;
                card.innerHTML = `
                    <div class="service-top">
                        <div class="emoji">${s.icon || '📌'}</div>
                        <span class="avail-badge">${t.availBadge}</span>
                    </div>
                    <h3>${title}</h3>
                    <p>${desc}</p>
                    <button class="btn btn-outline" type="button" onclick="selectServiceForRequest('${s.id}')">${t.orderServiceBtn}</button>
                `;
                serviceGrid.appendChild(card);
            });
        }
    }

    // دالة تطبيق اللغة على كل الموقع
    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem("jusr_lang", lang);
        const t = translations[lang];

        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "en" ? "ltr" : "rtl";

        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (t[key]) {
                if (key === "heroTitle" || key === "requestTitle") {
                    el.innerHTML = t[key];
                } else {
                    el.textContent = t[key];
                }
            }
        });

        if (langToggleBtn) langToggleBtn.textContent = t.langBtn;

        const nameInput = document.getElementById("customerName");
        const detailsInput = document.getElementById("details");
        if (nameInput) nameInput.placeholder = t.namePlaceholder;
        if (detailsInput) detailsInput.placeholder = t.detailsPlaceholder;

        if (mobileAdminBtn) mobileAdminBtn.innerHTML = t.mobileAdminBtn;

        renderServicesAndSelects();
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener("click", () => {
            applyLanguage(currentLang === "ar" ? "en" : "ar");
        });
    }

    async function syncFromGoogleSheets() {
        try {
            const res = await fetch(GOOGLE_SCRIPT_URL + "?t=" + Date.now());
            if (res.ok) {
                const cloudData = await res.json();
                if (Array.isArray(cloudData)) {
                    adminRequestsList = cloudData;
                    saveRequests();
                    refreshCounters();
                }
            }
        } catch (err) {
            console.warn("جاري العمل بالذاكرة المحلية مؤقتاً:", err);
        }
    }

    function refreshCounters() {
        const totalCount = adminRequestsList.length;
        const newCount = adminRequestsList.filter(r => {
            const s = String(r.status || 'new').toLowerCase().trim();
            return s === 'new' || s === 'جديد';
        }).length;
        const progressCount = adminRequestsList.filter(r => {
            const s = String(r.status || '').toLowerCase().trim();
            return s === 'in_progress' || s === 'inprogress' || s === 'قيد التنفيذ';
        }).length;
        const doneCount = adminRequestsList.filter(r => {
            const s = String(r.status || '').toLowerCase().trim();
            return s === 'completed' || s === 'مكتمل';
        }).length;

        document.querySelectorAll("#statAll, #publicStatAll, .js-stat-all").forEach(el => el.textContent = totalCount);
        document.querySelectorAll("#statNew, #publicStatNew, .js-stat-new").forEach(el => el.textContent = newCount);
        document.querySelectorAll("#statProgress, #publicStatProgress, .js-stat-progress").forEach(el => el.textContent = progressCount);
        document.querySelectorAll("#statDone, #publicStatDone, .js-stat-done").forEach(el => el.textContent = doneCount);
    }

    [heroStartBtn, navRequestBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener("click", () => {
                const reqSec = document.getElementById("request");
                if (reqSec) reqSec.scrollIntoView({ behavior: "smooth" });
            });
        }
    });

    const copyOrderIdBtn = document.getElementById("copyOrderIdBtn");
    if (copyOrderIdBtn) {
        copyOrderIdBtn.addEventListener("click", () => {
            const orderIdText = document.getElementById("modalOrderId").textContent;
            navigator.clipboard.writeText(orderIdText).then(() => {
                copyOrderIdBtn.textContent = translations[currentLang].copiedBtn;
                setTimeout(() => {
                    copyOrderIdBtn.textContent = translations[currentLang].copyBtn;
                }, 2000);
            });
        });
    }

    const closeModalBtn = document.getElementById("closeModalBtn");
    const successModal = document.getElementById("successModal");
    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener("click", () => {
            successModal.style.display = "none";
        });
    }

    // زر عائم للإدارة على الموبايل
    const mobileAdminBtn = document.createElement("button");
    mobileAdminBtn.style.cssText = "position:fixed; bottom:18px; left:18px; z-index:9999; background:#0f2942; color:#fff; border:none; border-radius:50px; padding:10px 16px; font-family:inherit; font-size:13px; font-weight:bold; box-shadow:0 4px 14px rgba(0,0,0,0.25); cursor:pointer;";
    document.body.appendChild(mobileAdminBtn);

    // تهيئة اللغة والخدمات عند فتح الموقع
    applyLanguage(currentLang);
    refreshCounters();
    await syncFromGoogleSheets();

    window.selectServiceForRequest = function(serviceId) {
        if (serviceSelect) {
            serviceSelect.value = serviceId;
        }
        const requestSection = document.getElementById("request");
        if (requestSection) {
            requestSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // 2. إرسال طلب جديد وحفظه في Google Sheets
    if (serviceForm) {
        serviceForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const submitBtn = serviceForm.querySelector("button[type='submit']");
            const oldBtnText = submitBtn ? submitBtn.textContent : "";

            const formData = {
                name: document.getElementById("customerName").value.trim(),
                phone: document.getElementById("customerPhone").value.trim(),
                service: serviceSelect.value,
                direction: directionSelect ? directionSelect.value : "other",
                details: document.getElementById("details").value.trim()
            };

            if (!formData.service) {
                alert(currentLang === "en" ? "❌ Please select the required service." : "❌ برجاء اختيار الخدمة المطلوبة.");
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = currentLang === "en" ? "⏳ Sending Request..." : "⏳ جاري إرسال الطلب للسحابة...";
            }

            const newOrderId = "MR-" + Date.now().toString().slice(-6);
            const nowStr = new Date().toLocaleString('ar-EG');

            const newRequest = {
                id: newOrderId,
                customerName: formData.name,
                customerPhone: formData.phone,
                serviceId: formData.service,
                direction: formData.direction || "other",
                details: formData.details,
                status: 'new',
                createdAt: nowStr
            };

            adminRequestsList.unshift(newRequest);
            saveRequests();
            refreshCounters();

            try {
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify(newRequest)
                });
            } catch (err) {
                console.error("Cloud sync error:", err);
            }

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = oldBtnText;
            }

            serviceForm.reset();

            if (successModal) {
                const modalOrderId = document.getElementById("modalOrderId");
                if (modalOrderId) {
                    modalOrderId.textContent = newOrderId;
                }
                successModal.style.display = "flex";
            } else {
                alert(`✅ ${ newOrderId }`);
            }
        });
    }

    // 3. تتبع الطلب من السحابة مباشرة
    if (trackForm && trackInput) {
        trackForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const orderId = trackInput.value.trim().toUpperCase();
            if (!orderId) return;

            trackResult.classList.remove("hidden");
            trackResult.style.display = "block";
            trackResult.innerHTML = currentLang === "en" ? "⏳ Searching for request status..." : "⏳ جاري البحث عن حالة الطلب...";

            await syncFromGoogleSheets();

            const found = adminRequestsList.find(r => String(r.id).toUpperCase() === orderId);

            if (found) {
                if (currentLang === "en") {
                    trackResult.innerHTML = `📋 Order Status <b>${found.id}</b>: <span class="status-badge status-${found.status}">${getStatusLabel(found.status)}</span><br><b>Name:</b> ${found.customerName}<br><b>Service:</b> ${getServiceTitle(found.serviceId)}<br><b>Destination:</b> ${found.direction}<br><b>Date:</b> ${found.createdAt}`;
                } else {
                    trackResult.innerHTML = `📋 حالة الطلب <b>${found.id}</b>: <span class="status-badge status-${found.status}">${getStatusLabel(found.status)}</span><br><b>الاسم:</b> ${found.customerName}<br><b>الخدمة:</b> ${getServiceTitle(found.serviceId)}<br><b>الوجهة:</b> ${found.direction}<br><b>التاريخ:</b> ${found.createdAt}`;
                }
            } else {
                trackResult.innerHTML = currentLang === "en"
                    ? `<span style="color:red; font-weight:bold;">❌ Request not found. Please check your reference ID.</span>`
                    : `<span style="color:red; font-weight:bold;">❌ الطلب غير موجود</span>`;
            }
        });
    }

    // 4. تفعيل قائمة الموبايل + فتح لوحة الإدارة
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            navLinks.classList.toggle("show");
            if (navLinks.style.display === "flex" || navLinks.style.display === "block") {
                navLinks.style.display = "";
            } else {
                navLinks.style.display = "flex";
                navLinks.style.flexDirection = "column";
            }
        });
    }

    function triggerAdminLogin(e) {
        if (e) e.preventDefault();
        const passcode = prompt("🔐 لوحة الإدارة محمية.\nأدخل كلمة مرور المدير للوصول:");
        const adminSecret = "Qwe321Hgyi#%÷/][%^&*£#="; 

        if (passcode === adminSecret) {
            if (publicView) publicView.style.display = "none";
            if (adminSection) {
                adminSection.classList.add("active");
                adminSection.style.display = "block";
                window.scrollTo(0, 0);
                loadAdminRequests();
            }
        } else if (passcode !== null) {
            alert("❌ كلمة المرور غير صحيحة! هذه اللوحة مخصصة لمدير المنصة فقط.");
        }
    }

    document.querySelectorAll("#adminNav, a[href='#admin'], .admin-link").forEach(btn => {
        btn.addEventListener("click", triggerAdminLogin);
    });
    mobileAdminBtn.addEventListener("click", triggerAdminLogin);

    if (backPublicBtn) {
        backPublicBtn.addEventListener("click", () => {
            if (adminSection) {
                adminSection.classList.remove("active");
                adminSection.style.display = "none";
            }
            if (publicView) publicView.style.display = "block";
            refreshCounters();
        });
    }

    // 5. تحميل وعرض الطلبات في لوحة الإدارة
    window.loadAdminRequests = async function() {
        const requestList = document.getElementById("requestList");
        if (!requestList) return;

        requestList.innerHTML = "<p style='text-align:center; padding: 25px; font-weight:bold;'>⏳ جاري جلب الطلبات من السحابة...</p>";

        await syncFromGoogleSheets();

        requestList.innerHTML = "";
        refreshCounters();

        if (adminRequestsList.length === 0) {
            requestList.innerHTML = "<p class='empty' style='text-align:center; padding: 30px; color: #666;'>لا توجد طلبات مسجلة حتى الآن.</p>";
            return;
        }

        adminRequestsList.forEach(req => {
            const cleanPhone = String(req.customerPhone || "").replace(/[^0-9]/g, "");
            const item = document.createElement("div");
            item.className = "request-item";
            item.innerHTML = `
                <div>
                    <h4>رقم الطلب: ${req.id} <span id="badge-${req.id}" class="status-badge status-${req.status}">${getStatusLabel(req.status)}</span></h4>
                    <p><b>الاسم:</b> ${req.customerName} | <b>الهاتف:</b> <a href="https://wa.me/${cleanPhone}" target="_blank" style="color:#0d9488;font-weight:bold;text-decoration:none;">${req.customerPhone} 💬 واتساب</a></p>
                    <p><b>الخدمة:</b> ${getServiceTitle(req.serviceId)} | <b>الوجهة:</b> ${req.direction}</p>
                    <p><b>التفاصيل:</b> ${req.details || "لا توجد تفاصيل إضافية"}</p>
                    <p style="font-size: 11.5px; color: #888;">تاريخ الإرسال: ${req.createdAt}</p>
                </div>
                <div class="request-actions">
                    <select onchange="updateRequestStatus('${req.id}', this.value)" style="padding: 8px 12px; border-radius: 8px; border: 1px solid #d5e0e4; background: #fff; font-weight: 700; cursor: pointer;">
                        <option value="new" ${req.status === 'new' ? 'selected' : ''}>جديد (new)</option>
                        <option value="in_progress" ${req.status === 'in_progress' ? 'selected' : ''}>قيد التنفيذ (in_progress)</option>
                        <option value="completed" ${req.status === 'completed' ? 'selected' : ''}>مكتمل (completed)</option>
                        <option value="rejected" ${req.status === 'rejected' ? 'selected' : ''}>مرفوض (rejected)</option>
                    </select>
                </div>
            `;
            requestList.appendChild(item);
        });
    };

    // 6. تحديث حالة الطلب في لوحة الإدارة وفي جوجل شيت فوراً
    window.updateRequestStatus = async function(id, newStatus) {
        const targetReq = adminRequestsList.find(r => String(r.id) === String(id));
        if (targetReq) {
            targetReq.status = newStatus;
            saveRequests();
            refreshCounters();
            const badge = document.getElementById(`badge-${id}`);
            if (badge) {
                badge.textContent = getStatusLabel(newStatus);
                badge.className = `status-badge status-${newStatus}`;
            }
        }

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({ action: "updateStatus", id: id, status: newStatus })
            });
        } catch (err) {
            console.error("Cloud status update error:", err);
        }
    };
});