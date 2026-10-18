document.addEventListener("DOMContentLoaded", async () => {
    const serviceForm = document.getElementById("requestForm");
    const serviceSelect = document.getElementById("serviceType");
    const serviceGrid = document.getElementById("serviceGrid");
    const adminNav = document.getElementById("adminNav");
    const backPublicBtn = document.getElementById("backPublic");
    const adminSection = document.getElementById("admin");
    const publicView = document.getElementById("publicView") || document.querySelector("main");
    const trackForm = document.getElementById("trackForm");
    const trackInput = document.getElementById("trackInput");
    const trackResult = document.getElementById("trackResult");
    const heroStartBtn = document.getElementById("heroStartBtn");
    const navRequestBtn = document.getElementById("navRequestBtn");

    // 🔗 رابط جوجل شيت السحابي الخاص بك (مربوط وجاهز):
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz8Eurs4yZOPws9YLHEIPWmEpYZ_vKyL7Wa7Q2XduMR7EkFKmI_Au7L06hYmoofbtlhuA/exec";

    // القائمة الكاملة للـ 14 خدمة الأصلية لمنصة جسر
    const allServices = [
        { id: "study", category: "education", icon: "🎓", sortOrder: 1, titleAr: "القبول الجامعي والدراسة", titleRu: "Учёба", descAr: "تأمين القبولات والمنح والسنة التحضيرية بالجامعات الروسية والمصرية المعتمدة.", descRu: "Поступление." },
        { id: "housing", category: "living", icon: "🏠", sortOrder: 2, titleAr: "السكن الطلابي والمعيشة", titleRu: "Жилье", descAr: "توفير السكن الجامعي أو الخاص وترتيب استقبال المطار والإقامة.", descRu: "Общежитие." },
        { id: "equivalence", category: "education", icon: "📜", sortOrder: 3, titleAr: "معادلة الشهادات والدبلومات", titleRu: "Нострификация", descAr: "إجراءات توثيق ومعادلة الشهادات الدراسية بين البلدين.", descRu: "Диплом." },
        { id: "language", category: "education", icon: "🗣️", sortOrder: 4, titleAr: "دورات اللغة (روسي / عربي)", titleRu: "Языковые курсы", descAr: "كورسات مكثفة لتأهيل الطلاب والمغتربين لغويًا.", descRu: "Язык." },
        { id: "flights", category: "travel", icon: "✈️", sortOrder: 5, titleAr: "تذاكر الطيران والترانزيت", titleRu: "Авиабилеты", descAr: "حجز أفضل خطوط الطيران بين المطارات المصرية والروسية.", descRu: "Билеты." },
        { id: "visa", category: "travel", icon: "🛂", sortOrder: 6, titleAr: "تأشيرات الدخول والدعوات", titleRu: "Визы", descAr: "استخراج الدعوات الرسمية وتخليص إجراءات التأشيرات.", descRu: "Виза." },
        { id: "tourism", category: "travel", icon: "🏛️", sortOrder: 7, titleAr: "البرامج السياحية والثقافية", titleRu: "Туризм", descAr: "رحلات سياحية وبرامج استكشافية بين موسكو، القاهرة، وباقي المدن.", descRu: "Туризм." },
        { id: "legal", category: "business", icon: "⚖️", sortOrder: 8, titleAr: "الاستشارات القانونية والتوثيق", titleRu: "Юристы", descAr: "توثيق العقود والترجمة المعتمدة والتخليص القانوني.", descRu: "Юрист." },
        { id: "translation", category: "business", icon: "📝", sortOrder: 9, titleAr: "الترجمة المعتمدة للمستندات", titleRu: "Перевод", descAr: "ترجمة رسمية معتمدة للسفارات والجهات الحكومية.", descRu: "Перевод." },
        { id: "trade", category: "business", icon: "💼", sortOrder: 10, titleAr: "تأسيس الشركات والأعمال التجارية", titleRu: "Бизнес", descAr: "استشارات الاستثمار وتأسيس الشركات وربط الأسواق.", descRu: "Бизнес." },
        { id: "money", category: "general", icon: "💳", sortOrder: 11, titleAr: "استشارات تحويل الأموال والقنوات الرسمية", titleRu: "Переводы", descAr: "توضيح القنوات الرسمية والآمنة للتحويل المالي بين البلدين.", descRu: "Финансы." },
        { id: "health", category: "general", icon: "🏥", sortOrder: 12, titleAr: "التأمين الصحي والرعاية الطبية", titleRu: "Медицина", descAr: "ترتيب التأمين الصحي الشخصي والمتابعة الطبية للطلاب.", descRu: "Медицина." },
        { id: "shipping", category: "general", icon: "📦", sortOrder: 13, titleAr: "الشحن الدولي السريع", titleRu: "Доставка", descAr: "خدمات شحن الطرود والأوراق الشخصية والتجارية.", descRu: "Доставка." },
        { id: "other", category: "general", icon: "🤝", sortOrder: 14, titleAr: "خدمات الاستشارات العامة والأخرى", titleRu: "Другие", descAr: "استشارات مخصصة وحلول استفسارات التنقل والخدمات الخاصة.", descRu: "Общие." }
    ];

    // جلب الطلبات المحفوظة مؤقتاً
    let adminRequestsList = JSON.parse(localStorage.getItem("jusr_requests") || "[]");

    function saveRequests() {
        localStorage.setItem("jusr_requests", JSON.stringify(adminRequestsList));
    }

    function getStatusLabel(status) {
        const labels = {
            'new': 'جديد',
            'in_progress': 'قيد التنفيذ',
            'completed': 'مكتمل',
            'rejected': 'مرفوض'
        };
        return labels[status] || status;
    }

    function getServiceTitle(serviceId) {
        const found = allServices.find(s => s.id === serviceId);
        return found ? found.titleAr : serviceId;
    }

    // دالة جلب أحدث الطلبات من جوجل شيت سحابياً
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

    // تحديث العدادات في الموقع من الخارج وفي لوحة الإدارة في نفس اللحظة
    function refreshCounters() {
        const totalCount = adminRequestsList.length;
        const newCount = adminRequestsList.filter(r => (r.status || 'new').toLowerCase() === 'new').length;
        const progressCount = adminRequestsList.filter(r => ['in_progress', 'inprogress'].includes((r.status || '').toLowerCase())).length;
        const doneCount = adminRequestsList.filter(r => (r.status || '').toLowerCase() === 'completed').length;

        document.querySelectorAll("#statAll, #publicStatAll, .js-stat-all").forEach(el => el.textContent = totalCount);
        document.querySelectorAll("#statNew, #publicStatNew, .js-stat-new").forEach(el => el.textContent = newCount);
        document.querySelectorAll("#statProgress, #publicStatProgress, .js-stat-progress").forEach(el => el.textContent = progressCount);
        document.querySelectorAll("#statDone, #publicStatDone, .js-stat-done").forEach(el => el.textContent = doneCount);
    }

    // أزرار الانتقال السريع لنموذج الطلب
    [heroStartBtn, navRequestBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener("click", () => {
                const reqSec = document.getElementById("request");
                if (reqSec) reqSec.scrollIntoView({ behavior: "smooth" });
            });
        }
    });

    // تفعيل زر نسخ رقم الطلب
    const copyOrderIdBtn = document.getElementById("copyOrderIdBtn");
    if (copyOrderIdBtn) {
        copyOrderIdBtn.addEventListener("click", () => {
            const orderIdText = document.getElementById("modalOrderId").textContent;
            navigator.clipboard.writeText(orderIdText).then(() => {
                copyOrderIdBtn.textContent = "✅ تم النسخ بنجاح!";
                setTimeout(() => {
                    copyOrderIdBtn.textContent = "📋 نسخ رقم الطلب";
                }, 2000);
            });
        });
    }

    // تفعيل زر إغلاق الصندوق المنبثق
    const closeModalBtn = document.getElementById("closeModalBtn");
    const successModal = document.getElementById("successModal");
    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener("click", () => {
            successModal.style.display = "none";
        });
    }

    // تهيئة القائمة المنسدلة للخدمات
    if (serviceSelect) {
        serviceSelect.innerHTML = '<option value="" disabled selected>اختر الخدمة المطلوبة</option>';
        allServices.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s.id;
            opt.textContent = s.titleAr;
            serviceSelect.appendChild(opt);
        });
    }

    // عرض الـ 14 خدمة في الشبكة الرئيسية
    let targetGrid = document.getElementById("serviceGrid") 
                  || document.getElementById("servicesGrid") 
                  || document.querySelector(".service-grid") 
                  || document.querySelector(".services-grid");

    if (targetGrid) {
        targetGrid.innerHTML = "";
        allServices.forEach(s => {
            const card = document.createElement("div");
            card.className = "service";
            card.innerHTML = `
                <div class="service-top">
                    <div class="emoji">${s.icon || '📌'}</div>
                    <span class="avail-badge">متاح للطلب</span>
                </div>
                <h3>${s.titleAr}</h3>
                <p>${s.descAr}</p>
                <button class="btn btn-outline" type="button" onclick="selectServiceForRequest('${s.id}')">اطلب هذه الخدمة</button>
            `;
            targetGrid.appendChild(card);
        });
    }

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

    // 2. إرسال طلب جديد وحفظه في Google Sheets وفي اللحظة يظهر على كل الأجهزة
    if (serviceForm) {
        serviceForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const submitBtn = serviceForm.querySelector("button[type='submit']");
            const oldBtnText = submitBtn ? submitBtn.textContent : "";

            const formData = {
                name: document.getElementById("customerName").value.trim(),
                phone: document.getElementById("customerPhone").value.trim(),
                service: serviceSelect.value,
                direction: document.getElementById("direction").value,
                details: document.getElementById("details").value.trim()
            };

            if (!formData.service) {
                alert("❌ برجاء اختيار الخدمة المطلوبة.");
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "⏳ جاري إرسال الطلب للسحابة...";
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

            // الإرسال الفوري لـ Google Sheets
            try {
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify(newRequest)
                });
            } catch (err) {
                console.error("خطأ في الإرسال للسحابة:", err);
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
                alert(`✅ تم إرسال الطلب بنجاح!\nرقم الطلب: ${newOrderId}`);
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
            trackResult.innerHTML = "⏳ جاري البحث عن حالة الطلب...";

            await syncFromGoogleSheets();

            const found = adminRequestsList.find(r => String(r.id).toUpperCase() === orderId);

            if (found) {
                trackResult.innerHTML = `📋 حالة الطلب <b>${found.id}</b>: <span class="status-badge status-${found.status}">${getStatusLabel(found.status)}</span><br><b>الاسم:</b> ${found.customerName}<br><b>الخدمة:</b> ${getServiceTitle(found.serviceId)}<br><b>التاريخ:</b> ${found.createdAt}`;
            } else {
                trackResult.innerHTML = `<span style="color:red; font-weight:bold;">❌ الطلب غير موجود</span>`;
            }
        });
    }

    // 4. تفعيل قائمة الموبايل + فتح لوحة الإدارة من أي جهاز (موبايل أو لابتوب)
    const menuToggle = document.querySelector(".menu-toggle, #menuToggle, .nav-toggle, button[aria-label*='menu']");
    const navLinks = document.querySelector(".nav-links, #navLinks, nav ul, .navbar-menu");
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

    // ربط أزرار الإدارة الأصلية
    document.querySelectorAll("#adminNav, a[href='#admin'], .admin-link").forEach(btn => {
        btn.addEventListener("click", triggerAdminLogin);
    });

    // إضافة زر عائم للإدارة خاص بالموبايل يضمن ظهورها في أي وقت
    const mobileAdminBtn = document.createElement("button");
    mobileAdminBtn.innerHTML = "🔐 الإدارة";
    mobileAdminBtn.style.cssText = "position:fixed; bottom:18px; left:18px; z-index:9999; background:#0f2942; color:#fff; border:none; border-radius:50px; padding:10px 16px; font-family:inherit; font-size:13px; font-weight:bold; box-shadow:0 4px 14px rgba(0,0,0,0.25); cursor:pointer;";
    mobileAdminBtn.addEventListener("click", triggerAdminLogin);
    document.body.appendChild(mobileAdminBtn);

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

    // 5. تحميل وعرض الطلبات في لوحة الإدارة من Google Sheets
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
                    <p><b>الخدمة:</b> ${getServiceTitle(req.serviceId)} | <b>الاتجاه:</b> ${req.direction}</p>
                    <p><b>التفاصيل:</b> ${req.details || "لا توجد تفاصيل إضافية"}</p>
                    <p style="font-size: 11.5px; color: #888;">تاريخ الإرسال: ${req.createdAt}</p>
                </div>
                <div class="request-actions">
                    <select onchange="updateRequestStatus('${req.id}', this.value)" style="padding: 8px 12px; border-radius: 8px; border: 1px solid #d5e0e4; background: #fff; font-weight: 700; cursor: pointer;">
                        <option value="new" ${req.status === 'new' ? 'selected' : ''}>جديد</option>
                        <option value="in_progress" ${req.status === 'in_progress' ? 'selected' : ''}>قيد التنفيذ</option>
                        <option value="completed" ${req.status === 'completed' ? 'selected' : ''}>مكتمل</option>
                        <option value="rejected" ${req.status === 'rejected' ? 'selected' : ''}>مرفوض</option>
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
            console.error("خطأ في تحديث الحالة على السحابة:", err);
        }
    };
});