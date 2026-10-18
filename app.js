document.addEventListener("DOMContentLoaded", () => {
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

    // 1. قائمة الخدمات الأساسية لمنصة جسر (ثابتة وجاهزة للعمل دائماً بدون سيرفر)
    const allServices = [
        {
            id: "study-admissions",
            icon: "🎓",
            titleAr: "القبولات الجامعية والمنح الدراسية",
            descAr: "تأمين القبولات في الجامعات الروسية والمصرية، التقديم على المنح، ومعادلة الشهادات."
        },
        {
            id: "visa-invitations",
            icon: "🛂",
            titleAr: "الدعوات وتخليص التأشيرات",
            descAr: "استخراج الدعوات الدراسية والسياحية وتجارية وتسهيل إجراءات التأشيرة بين مصر وروسيا."
        },
        {
            id: "translation-attestation",
            icon: "📄",
            titleAr: "الترجمة المعتمدة وتوثيق الأوراق",
            descAr: "ترجمة وتوثيق كافة المستندات الرسمية والشهادات في القنصليات ووزارات الخارجية."
        },
        {
            id: "flights-housing",
            icon: "✈️",
            titleAr: "حجز الطيران وتوفير السكن",
            descAr: "حجوزات طيران بأسعار مناسبة، استقبال في المطار، وتوفير سكن جامعي أو خاص آمن."
        },
        {
            id: "money-transfer",
            icon: "💳",
            titleAr: "الخدمات المالية والتحويلات",
            descAr: "مساعدة الطلاب والمسافرين في سداد الرسوم الدراسية وتنسيق التحويلات والخدمات البنكية."
        },
        {
            id: "shipping-documents",
            icon: "📦",
            titleAr: "شحن الأوراق والمستلزمات",
            descAr: "إرسال واستقبال المستندات الأصلية والطرود الشخصية بسرعة وأمان في الاتجاهين."
        }
    ];

    // جلب الطلبات المحفوظة أو إنشاء مصفوفة فارغة
    let adminRequestsList = JSON.parse(localStorage.getItem("jusr_requests") || "[]");

    function saveRequests() {
        localStorage.setItem("jusr_requests", JSON.stringify(adminRequestsList));
    }

    // ترجمة حالة الطلب للعرض بشكل أنيق
    function getStatusLabel(status) {
        const labels = {
            'new': 'جديد',
            'in_progress': 'قيد التنفيذ',
            'completed': 'مكتمل',
            'rejected': 'مرفوض'
        };
        return labels[status] || status;
    }

    // الحصول على اسم الخدمة بالعربي من الكود الخاص بها
    function getServiceTitle(serviceId) {
        const found = allServices.find(s => s.id === serviceId);
        return found ? found.titleAr : serviceId;
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

    // تهيئة وعرض الخدمات في القائمة المنسدلة وفي الشبكة الرئيسية
    if (serviceSelect) {
        serviceSelect.innerHTML = '<option value="" disabled selected>اختر الخدمة المطلوبة</option>';
        allServices.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s.id;
            opt.textContent = s.titleAr;
            serviceSelect.appendChild(opt);
        });
    }

    if (serviceGrid) {
        renderServices(allServices);
    }

    refreshCounters();

    function renderServices(servicesToRender) {
        if (!serviceGrid) return;
        serviceGrid.innerHTML = "";
        
        servicesToRender.forEach(s => {
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
            serviceGrid.appendChild(card);
        });
    }

    window.selectServiceForRequest = function(serviceId) {
        if (serviceSelect) {
            serviceSelect.value = serviceId;
        }
        const requestSection = document.getElementById("request");
        if (requestSection) {
            requestSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // 2. إرسال طلب جديد + إظهار الصندوق المنبثق برقم الطلب للنسخ + تحديث العدادات
    if (serviceForm) {
        serviceForm.addEventListener("submit", (e) => {
            e.preventDefault();

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

            // توليد رقم مرجعي مميز للطلب
            const randomNum = Math.floor(100000 + Math.random() * 900000);
            const newOrderId = `JSR-${randomNum}`;
            const nowStr = new Date().toLocaleString('ar-EG');

            const newRequest = {
                id: newOrderId,
                customerName: formData.name,
                customerPhone: formData.phone,
                serviceId: formData.service,
                direction: formData.direction,
                details: formData.details,
                status: 'new',
                createdAt: nowStr
            };

            adminRequestsList.unshift(newRequest);
            saveRequests();
            refreshCounters();
            serviceForm.reset();

            // إظهار صندوق نجاح الطلب مع رقم الطلب القابل للنسخ
            if (successModal) {
                const modalOrderId = document.getElementById("modalOrderId");
                if (modalOrderId) {
                    modalOrderId.textContent = newOrderId;
                }
                successModal.style.display = "flex";
            } else {
                alert(`✅ تم إرسال طلبك بنجاح!\nرقم الطلب للمتابعة: ${newOrderId}`);
            }
        });
    }

    // 3. تتبع الطلب بالرقم المرجعي
    if (trackForm && trackInput) {
        trackForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const orderId = trackInput.value.trim().toUpperCase();
            if (!orderId) return;

            const found = adminRequestsList.find(r => r.id.toUpperCase() === orderId);
            trackResult.classList.remove("hidden");
            trackResult.style.display = "block";

            if (found) {
                trackResult.innerHTML = `
                    📋 حالة الطلب <b>${found.id}</b>: <span class="status-badge status-${found.status}">${getStatusLabel(found.status)}</span><br>
                    <b>الاسم:</b> ${found.customerName}<br>
                    <b>الخدمة:</b> ${getServiceTitle(found.serviceId)}<br>
                    <b>التاريخ:</b> ${found.createdAt}
                `;
            } else {
                trackResult.innerHTML = `<span style="color:red; font-weight:bold;">❌ الطلب غير موجود، تأكد من كتابة الرمز المرجعي بشكل صحيح (مثال: JSR-123456).</span>`;
            }
        });
    }

    // 4. فتح لوحة الإدارة بكلمة المرور
    if (adminNav) {
        adminNav.addEventListener("click", (e) => {
            e.preventDefault();
            const passcode = prompt("🔐 لوحة الإدارة محمية.\nأدخل كلمة مرور المدير للوصول:");
            const adminSecret = "Qwe321Hgyi#%÷/][%^&*£#="; 

            if (passcode === adminSecret) {
                if (publicView) publicView.style.display = "none";
                if (adminSection) {
                    adminSection.classList.add("active");
                    adminSection.style.display = "block";
                    loadAdminRequests();
                }
            } else if (passcode !== null) {
                alert("❌ كلمة المرور غير صحيحة! هذه اللوحة مخصصة لمدير المنصة فقط.");
            }
        });
    }

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

    // 5. تحميل وعرض الطلبات والعدادات في لوحة الإدارة
    window.loadAdminRequests = function() {
        const requestList = document.getElementById("requestList");
        if (!requestList) return;

        adminRequestsList = JSON.parse(localStorage.getItem("jusr_requests") || "[]");
        requestList.innerHTML = "";
        refreshCounters();

        if (adminRequestsList.length === 0) {
            requestList.innerHTML = "<p class='empty' style='text-align:center; padding: 30px; color: #666;'>لا توجد طلبات مسجلة حتى الآن.</p>";
            return;
        }

        adminRequestsList.forEach(req => {
            const item = document.createElement("div");
            item.className = "request-item";
            item.innerHTML = `
                <div>
                    <h4>رقم الطلب: ${req.id} <span id="badge-${req.id}" class="status-badge status-${req.status}">${getStatusLabel(req.status)}</span></h4>
                    <p><b>الاسم:</b> ${req.customerName} | <b>الهاتف:</b> ${req.customerPhone}</p>
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

    // 6. دالة تحديث حالة الطلب والعدادات فوراً
    window.updateRequestStatus = function(id, newStatus) {
        const targetReq = adminRequestsList.find(r => r.id === id);
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
    };
});