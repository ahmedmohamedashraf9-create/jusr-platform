const express = require("express");
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// قاعدة البيانات SQLite
const db = new Database("dev.db");

// إنشاء جداول الطلبات والخدمات
db.prepare(`
  CREATE TABLE IF NOT EXISTS requests (
    id TEXT PRIMARY KEY,
    customerName TEXT,
    customerPhone TEXT,
    serviceId TEXT,
    direction TEXT,
    details TEXT,
    status TEXT DEFAULT 'new',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    category TEXT,
    icon TEXT,
    sortOrder INTEGER,
    titleAr TEXT,
    titleRu TEXT,
    descAr TEXT,
    descRu TEXT
  )
`).run();

// إعادة تعيين وتحديث جدول الخدمات تلقائياً للـ 14 خدمة
db.prepare("DELETE FROM services").run();

const insertService = db.prepare(`
  INSERT INTO services (id, category, icon, sortOrder, titleAr, titleRu, descAr, descRu)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const initialServices = [
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

for (const s of initialServices) {
  insertService.run(s.id, s.category, s.icon, s.sortOrder, s.titleAr, s.titleRu, s.descAr, s.descRu);
}

// الـ APIs
app.get("/api/init", (req, res) => {
  const services = db.prepare("SELECT * FROM services ORDER BY sortOrder ASC").all();
  const requests = db.prepare("SELECT status FROM requests").all();
  res.json({ services, requests });
});

app.post("/api/requests", (req, res) => {
  try {
    const { name, phone, service, direction, details } = req.body;
    const id = "MR-" + Date.now().toString().slice(-6);
    
    const insert = db.prepare(`
      INSERT INTO requests (id, customerName, customerPhone, serviceId, direction, details, status)
      VALUES (?, ?, ?, ?, ?, ?, 'new')
    `);
    
    insert.run(id, name, phone, service, direction || "other", details);
    res.status(201).json({ id, message: "تم إرسال الطلب بنجاح" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "خطأ في حفظ الطلب بالسيرفر" });
  }
});

app.get("/api/requests/:id", (req, res) => {
  try {
    const reqData = db.prepare("SELECT * FROM requests WHERE id = ?").get(req.params.id);
    if (!reqData) {
      return res.status(404).json({ error: "الطلب غير موجود" });
    }
    res.json(reqData);
  } catch (e) {
    res.status(500).json({ error: "خطأ في البحث" });
  }
});

app.get("/api/admin/requests", (req, res) => {
  try {
    const requests = db.prepare("SELECT * FROM requests ORDER BY createdAt DESC").all();
    res.json(requests);
  } catch (e) {
    res.status(500).json({ error: "خطأ في جلب بيانات الإدارة" });
  }
});

// مسار موحد ومضمون لتحديث الحالة (يقبل رقم الطلب في الـ Body)
app.post("/api/admin/update-status", (req, res) => {
  try {
    const { id, status } = req.body;
    db.prepare("UPDATE requests SET status = ? WHERE id = ?").run(status, id);
    res.status(200).json({ success: true });
  } catch (e) {
    console.error("Database update error:", e);
    res.status(500).json({ error: e.message });
  }
});

// دعم المسار القديم أيضاً سواء POST أو PATCH لمنع أي خطأ 404 نهائياً
app.all("/api/admin/requests/:id/status", (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    db.prepare("UPDATE requests SET status = ? WHERE id = ?").run(status, id);
    res.status(200).json({ success: true });
  } catch (e) {
    console.error("Database update error:", e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 السيرفر شغال ورايق على http://localhost:${PORT}`);
});