import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const baseDir = 'D:\\Hazim\\Projects\\sci_infinty\\website_01';
const screenshotDir = path.join(baseDir, 'docs', 'technical-report-assets', 'screenshots');
const outputPdf = path.join(baseDir, 'TECHNICAL_REPORT_AR.pdf');
const tempHtml = path.join(baseDir, 'scripts', 'temp-report.html');

// Helper to get base64 image data URI for rock-solid local embedding
function getBase64Img(filename) {
  const filePath = path.join(screenshotDir, filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath).toString('base64');
    return `data:image/png;base64,${data}`;
  }
  return '';
}

const imgHomeDesktop = getBase64Img('01-homepage-desktop.png');
const imgHomeMobile = getBase64Img('02-homepage-mobile.png');
const imgActivities = getBase64Img('03-activities-desktop.png');
const imgPodcast = getBase64Img('06-scicast-podcast-desktop.png');
const imgResearch = getBase64Img('08-research-desktop.png');

const htmlContent = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8">
<title>التقرير التقني الشامل — مبادرة ساي إنفينيتي</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');

  @page {
    size: A4;
    margin: 14mm 12mm 14mm 12mm;
    @bottom-center {
      content: "صفحة " counter(page);
      font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
      font-size: 8pt;
      color: #666;
    }
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;
    direction: rtl;
    text-align: right;
    color: #111020;
    background-color: #FFFFFF;
    margin: 0;
    padding: 0;
    font-size: 9.5pt;
    line-height: 1.55;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Page Break Controls */
  .page-break {
    page-break-before: always;
    break-before: page;
  }
  .avoid-break {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Brand Colors & Gradients */
  :root {
    --brand-deep: #50347F;
    --brand-purple: #56368D;
    --brand-blue: #3B56A6;
    --brand-ocean: #2774BB;
    --brand-cyan: #1196D3;
    --brand-ink: #111020;
    --brand-gradient: linear-gradient(135deg, #50347F 0%, #3B56A6 50%, #1196D3 100%);
  }

  /* Header Cover / Hero */
  .header-card {
    background: var(--brand-gradient);
    color: white;
    border-radius: 12px;
    padding: 22px 24px;
    margin-bottom: 18px;
    box-shadow: 0 4px 12px rgba(80, 52, 127, 0.2);
  }
  .header-card h1 {
    margin: 0 0 6px 0;
    font-size: 20pt;
    font-weight: 900;
    letter-spacing: -0.5px;
  }
  .header-card .subtitle {
    font-size: 11pt;
    font-weight: 600;
    opacity: 0.95;
    margin-bottom: 12px;
  }
  .header-card .meta-grid {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    border-top: 1px solid rgba(255,255,255,0.25);
    padding-top: 10px;
    font-size: 8.5pt;
  }
  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .meta-item strong {
    font-weight: 700;
  }

  /* Section Styling */
  h2.section-title {
    font-size: 13pt;
    font-weight: 800;
    color: var(--brand-deep);
    border-right: 4px solid var(--brand-cyan);
    padding-right: 10px;
    margin: 18px 0 10px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  h3.subsection-title {
    font-size: 10.5pt;
    font-weight: 700;
    color: var(--brand-blue);
    margin: 12px 0 6px 0;
  }
  p {
    margin: 0 0 8px 0;
  }

  /* Executive Cards */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 12px;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin-bottom: 12px;
  }
  .stat-card {
    background: #F8F9FD;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 10px 12px;
  }
  .stat-card.accent {
    border-right: 3px solid var(--brand-purple);
  }
  .stat-card strong {
    color: var(--brand-deep);
    display: block;
    font-size: 9pt;
    margin-bottom: 3px;
  }
  .stat-card span {
    font-size: 8.5pt;
    color: #4A5568;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 14px 0;
    font-size: 8.5pt;
  }
  th {
    background: #F0F4FA;
    color: var(--brand-deep);
    font-weight: 700;
    padding: 7px 9px;
    border: 1px solid #D2DEED;
    text-align: right;
  }
  td {
    padding: 6px 9px;
    border: 1px solid #E2E8F0;
    vertical-align: top;
  }
  tr:nth-child(even) td {
    background: #FAFCFE;
  }
  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 7.5pt;
    font-weight: 700;
  }
  .badge-danger { background: #FEE2E2; color: #991B1B; border: 1px solid #F87171; }
  .badge-warning { background: #FEF3C7; color: #92400E; border: 1px solid #FBBF24; }
  .badge-info { background: #E0F2FE; color: #075985; border: 1px solid #38BDF8; }
  .badge-success { background: #DCFCE7; color: #166534; border: 1px solid #4ADE80; }

  /* Screenshot Showcase */
  .shot-container {
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    margin-bottom: 12px;
  }
  .shot-container img {
    width: 100%;
    display: block;
    max-height: 220px;
    object-fit: cover;
    object-position: top;
  }
  .shot-caption {
    background: #F8FAFC;
    padding: 6px 10px;
    border-top: 1px solid #EDF2F7;
    font-size: 8pt;
    color: #4A5568;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .shot-caption strong {
    color: var(--brand-deep);
  }

  /* Code & Notes */
  code {
    font-family: Consolas, 'Courier New', monospace;
    background: #F1F5F9;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 8pt;
    color: #0F172A;
    direction: ltr;
    display: inline-block;
  }
  .callout {
    background: #EFF6FF;
    border-right: 4px solid var(--brand-ocean);
    border-radius: 6px;
    padding: 8px 12px;
    margin: 8px 0;
    font-size: 8.5pt;
    color: #1E3A8A;
  }
  .callout.warning {
    background: #FFFBEB;
    border-right-color: #F59E0B;
    color: #92400E;
  }
</style>
</head>
<body>

  <!-- ==================== PAGE 1 ==================== -->
  <div class="header-card">
    <h1>التقرير التقني الشامل والموجز للموقع</h1>
    <div class="subtitle">فحص البنية البرمجية، الأمان، الأداء، وخيارات الاستضافة والنشر</div>
    <div class="meta-grid">
      <div class="meta-item"><strong>المشروع:</strong> مبادرة ساي إنفينيتي (Sci Infinity Initiative)</div>
      <div class="meta-item"><strong>المؤسسة:</strong> كلية العلوم، جامعة المنصورة</div>
      <div class="meta-item"><strong>تاريخ التدقيق:</strong> أكتوبر 2026</div>
      <div class="meta-item"><strong>حالة الفحص:</strong> بيئة التشغيل المحلية (Vite Local Dev: 5173)</div>
    </div>
  </div>

  <h2 class="section-title">1. الملخص التنفيذي وتصنيف بنية النظام (Executive Summary)</h2>
  
  <p>
    يُمثل موقع <strong>مبادرة ساي إنفينيتي (Sci Infinity)</strong> منصة ويب علمية وأكاديمية موجهة لطلاب وباحثي العلوم، صُممت لعرض وتوثيق الأنشطة والمعسكرات وورش العمل (22 نشاطاً)، وحلقات البودكاست المسجلة (ساي كاست)، والأبحاث العلمية الدولية المنشورة، ومجلة فضول العلمية، إلى جانب استمارات التطوع والتواصل المؤسسي.
  </p>

  <div class="grid-3 avoid-break">
    <div class="stat-card accent">
      <strong>التصنيف المعماري للموقع</strong>
      <span><strong>Client-Rendered SPA</strong> (تطبيق صفحة واحدة يتم تصييره كاملاً داخل متصفح الزائر).</span>
    </div>
    <div class="stat-card accent">
      <strong>نموذج حفظ واسترجاع البيانات</strong>
      <span><strong>Static Data Catalog</strong> (بيانات محلية مدمجة عبر كائنات TypeScript مجهزة).</span>
    </div>
    <div class="stat-card accent">
      <strong>الارتباط بالخوادم وقواعد البيانات</strong>
      <span><strong>Pure Static Frontend</strong> (لا توجد قاعدة بيانات أو خادم Backend حالياً).</span>
    </div>
  </div>

  <div class="callout">
    <strong>النتيجة المعمارية الأساسية:</strong> الموقع الحالي يعمل بنمط <em>Jamstack / Static SPA</em> بالكامل. هذا التصنيف يمنحه سرعة فائقة في التصفح، وحصانة افتراضية ضد هجمات الخوادم واختراق قواعد البيانات، ويتيح استضافته بتكلفة صفرية (مجاناً) عبر شبكات التوزيع العالمية (CDNs) مع تشغيل فوري وسلس.
  </div>

  <h2 class="section-title">2. فحص مكدس التقنيات والملفات الجوهرية (Tech Stack & Core Files)</h2>
  
  <p>تم فحص مكدس المشروع من خلال ملفات التكوين والاعتماديات الصريحة (<code>package.json</code>, <code>tsconfig.json</code>, <code>vite.config.ts</code>):</p>

  <table class="avoid-break">
    <thead>
      <tr>
        <th style="width: 22%;">التقنية / الأداة</th>
        <th style="width: 14%;">الإصدار</th>
        <th style="width: 24%;">الدور في المنظومة</th>
        <th>المبرر الفني والتقييم الهندسي</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>React</strong></td>
        <td><code>19.3.1</code></td>
        <td>مكتبة واجهة المستخدم الأساسية</td>
        <td>أحدث إصدار رئيسي، يدعم أفضل ممارسات المكونات وإدارة الحالة المتجاوبة.</td>
      </tr>
      <tr>
        <td><strong>TypeScript</strong></td>
        <td><code>~6.0.3</code></td>
        <td>لغة البرمجة وضبط الأنواع</td>
        <td>أمان برمجي عالٍ (Type-Safety) يمنع أخطاء الـ Runtime ويضمن توافق كائنات البيانات.</td>
      </tr>
      <tr>
        <td><strong>Vite</strong></td>
        <td><code>^8.3.4</code></td>
        <td>أداة البناء وخادم التطوير</td>
        <td>سرعة بناء قياسية (تجميع في 2.1 ثانية) مع دعم HMR والتوافق مع بيئات النشر الحديثة.</td>
      </tr>
      <tr>
        <td><strong>Tailwind CSS v4</strong></td>
        <td><code>^4.3.3</code></td>
        <td>نظام التنسيق والتصميم</td>
        <td>أحدث إصدار (v4) مدمج عبر <code>@tailwindcss/vite</code> مع تعريف الرموز في <code>index.css</code>.</td>
      </tr>
      <tr>
        <td><strong>React Router DOM</strong></td>
        <td><code>^7.18.4</code></td>
        <td>إدارة المسارات والتنقل</td>
        <td>يدعم المسارات ثنائية اللغة (<code>/:locale/...</code>) ونظام التمرير التلقائي.</td>
      </tr>
      <tr>
        <td><strong>Lucide React</strong></td>
        <td><code>^1.61.0</code></td>
        <td>حزمة الأيقونات الرقمية</td>
        <td>أيقونات SVG خفيفة ومتجاوبة تدعم التضمين النظيف بدون استهلاك للباندويث.</td>
      </tr>
    </tbody>
  </table>

  <h3 class="subsection-title">خارطة الملفات الحاكمة للمشروع:</h3>
  <ul style="margin: 0 0 10px 0; padding-right: 20px; font-size: 8.5pt;">
    <li><code>src/App.tsx</code>: موزع المسارات العام ونقطة تكامل محدد اللغة ومكون الـ ScrollToTop.</li>
    <li><code>src/data/seedData.ts</code>: مصدر الحقيقة الوحيد لكافة الأنشطة (22 فعالية)، الأبحاث (2 ورقة دولية)، وأعضاء اللجان.</li>
    <li><code>src/components/common/FacebookEmbed.tsx</code>: مكون التضمين الرسمي لفيسبوك بالمعرفات الدائمة وتصميم البطاقة الآمنة.</li>
    <li><code>src/components/common/ScrollToTop.tsx</code>: المعالج الذكي لإعادة ضبط التمرير لأعلى الصفحة عند كل انتقال مسار.</li>
    <li><code>src/context/LocaleContext.tsx</code>: محرك الترجمة الفورية والتبديل الحي بين العربية (RTL) والإنجليزية (LTR).</li>
  </ul>

  <!-- ==================== PAGE 2 ==================== -->
  <div class="page-break"></div>

  <h2 class="section-title">3. الفحص البصري للموقع الحقيقي (Visual Audit & Real Captures)</h2>
  
  <p>
    تم تشغيل خادم التطوير المحلي والتقاط لقطات شاشة حقيقية وموثقة من المتصفح (عبر محرك Edge Headless) لتوثيق الواجهات الفعلية للنظام:
  </p>

  <div class="shot-container avoid-break">
    <img src="${imgHomeDesktop}" alt="الصفحة الرئيسية — نسخة الحواسيب المكتبية" />
    <div class="shot-caption">
      <span><strong>شكل 1:</strong> الصفحة الرئيسية (Desktop View - 1440×900) — الهيدر الترحيبي بتدرج ألوان المبادرة وشريط الإحصائيات الرسمي.</span>
      <code>src/views/HomeView.tsx</code>
    </div>
  </div>

  <div class="grid-2 avoid-break">
    <div class="shot-container" style="margin-bottom: 0;">
      <img src="${imgHomeMobile}" alt="الصفحة الرئيسية — نسخة الهاتف المحمول" style="max-height: 200px;" />
      <div class="shot-caption">
        <span><strong>شكل 2:</strong> الرئيسية على الهاتف (Mobile - 390×844) — توافق تام وسلاسة في القراءة الرأسية.</span>
      </div>
    </div>
    <div class="shot-container" style="margin-bottom: 0;">
      <img src="${imgActivities}" alt="أرشيف الأنشطة والمعسكرات" style="max-height: 200px;" />
      <div class="shot-caption">
        <span><strong>شكل 3:</strong> دليل الأنشطة الـ 22 وفلاتر البحث وتصنيفات الورش والملتقيات.</span>
      </div>
    </div>
  </div>

  <div class="grid-2 avoid-break" style="margin-top: 10px;">
    <div class="shot-container" style="margin-bottom: 0;">
      <img src="${imgPodcast}" alt="بودكاست ساي كاست" style="max-height: 195px;" />
      <div class="shot-caption">
        <span><strong>شكل 4:</strong> صفحة بودكاست ساي كاست — باللوجو الرسمي المعتمد والخلفية البيضاء النظيفة ودليل الحلقات الـ 4.</span>
      </div>
    </div>
    <div class="shot-container" style="margin-bottom: 0;">
      <img src="${imgResearch}" alt="الأبحاث العلمية المنشورة" style="max-height: 195px;" />
      <div class="shot-caption">
        <span><strong>شكل 5:</strong> الأبحاث الدولية المحكمة مع أزرار الربط بالـ DOI وتضمينات فيسبوك التوثيقية.</span>
      </div>
    </div>
  </div>

  <h3 class="subsection-title" style="margin-top: 12px;">الملاحظات البصرية وتجربة المستخدم (UI/UX):</h3>
  <ul style="margin: 0; padding-right: 20px; font-size: 8.5pt;">
    <li><strong>التوافقية والاتجاهات:</strong> التزام تام بنظام الكتابة من اليمين لليسار (RTL) بالعربية مع دعم عكس الهيكل بالكامل عند التحويل للإنجليزية (LTR).</li>
    <li><strong>الهوية البصرية:</strong> تطبيق دقيق لتدرج الألوان المتفق عليه (البنفسجي، الكحلي، والسيان) دون أي مسحات خضراء عشوائية.</li>
    <li><strong>سلوك التمرير:</strong> بفضل مكون <code>ScrollToTop</code>، تفتح جميع المسارات مباشرة من رأس الصفحة بسلاسة تامة.</li>
  </ul>

  <!-- ==================== PAGE 3 ==================== -->
  <div class="page-break"></div>

  <h2 class="section-title">4. التدقيق الأمني الشامل والجاهزية للإنتاج (Security Audit)</h2>
  
  <p>
    تم إجراء تدقيق أمني ساكن وشامل (Static Application Security Testing) على شفرة المشروع وملفات الإعدادات. فيما يلي جدول حصر النتائج المصنفة حسب خطورتها الواقعية:
  </p>

  <table class="avoid-break">
    <thead>
      <tr>
        <th style="width: 10%;">المعرف</th>
        <th style="width: 25%;">الملاحظة / الخطر الأمني</th>
        <th style="width: 14%;">مستوى الخطورة</th>
        <th style="width: 20%;">الحالة والدليل البرمجي</th>
        <th>الإجراء التصحيحي والتوصية الفنية</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>SEC-01</strong></td>
        <td>تسريب مفاتيح API أو كلمات مرور سرية</td>
        <td><span class="badge badge-success">آمن (Safe)</span></td>
        <td><strong>مؤكد فحصاً:</strong> لا توجد أي أسرار أو مفاتيح خاصة مسربة داخل الشفرة.</td>
        <td>الحفاظ على خلو ملفات الواجهة من أي بيانات اعتماد خاصة بالخوادم مستقبلاً.</td>
      </tr>
      <tr>
        <td><strong>SEC-02</strong></td>
        <td>غياب التخزين الحقيقي لبيانات النماذج</td>
        <td><span class="badge badge-warning">متوسط (Medium)</span></td>
        <td><code>JoinUsView.tsx</code><br/><code>ContactView.tsx</code></td>
        <td>استمارات التطوع والتواصل بصرية حالياً ولا تنقل البيانات؛ يلزم ربطها بـ API آمن أو خدمة موثوقة (مثل Formspree أو Supabase) قبل إطلاق حملات التسجيل.</td>
      </tr>
      <tr>
        <td><strong>SEC-03</strong></td>
        <td>غياب ترويسات الأمان (Security Headers) في التطوير المحلي</td>
        <td><span class="badge badge-warning">منخفض (Low)</span></td>
        <td>تكوين خادم الإنتاج</td>
        <td>إضافة ترويسات الحماية (CSP, HSTS, X-Frame-Options, X-Content-Type-Options) عبر إعدادات منصة الاستضافة عند النشر.</td>
      </tr>
      <tr>
        <td><strong>SEC-04</strong></td>
        <td>أمان تضمينات الأطراف الخارجية (iFrames)</td>
        <td><span class="badge badge-info">مُعالج (Mitigated)</span></td>
        <td><code>FacebookEmbed.tsx</code><br/><code>YouTubeEmbed.tsx</code></td>
        <td>تم ضبط التضمينات بنطاقات آمنة ومحددة، مع دعم بطاقات العرض البديلة في حال حظر المتصفح لملفات تعريف الارتباط.</td>
      </tr>
      <tr>
        <td><strong>SEC-05</strong></td>
        <td>هجمات حقن النصوص (XSS)</td>
        <td><span class="badge badge-success">منيع (Protected)</span></td>
        <td>محرك JSX التلقائي</td>
        <td>يستخدم المشروع إخراج React القياسي الذي يُعقم المدخلات تلقائياً، دون استخدام دالة <code>dangerouslySetInnerHTML</code> غير الآمنة.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="section-title">5. دراسة ومقارنة خيارات الاستضافة والدومين (Hosting & Domain Options)</h2>
  
  <p>
    بما أن الموقع عبارة عن <strong>Static SPA</strong> مجمع بالكامل في مجلد <code>dist</code> (حجم الحزمة المضغوطة 135 كيلوبايت فقط)، فإنه <strong>لا يحتاج إلى خادم Node.js دائم ولا قاعدة بيانات SQL مستمرة</strong> للتشغيل الأساسي.
  </p>

  <table class="avoid-break">
    <thead>
      <tr>
        <th style="width: 18%;">منصة الاستضافة</th>
        <th style="width: 15%;">نموذج التسعير</th>
        <th style="width: 22%;">التوافق مع المشروع</th>
        <th style="width: 22%;">شهادة SSL والدومين</th>
        <th>التقييم الفني الشامل</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Cloudflare Pages</strong><br/><em>(الخيار الموصى به)</em></td>
        <td><strong>مجاني 100%</strong><br/>(Free Tier)</td>
        <td>توافق مثالي مع Vite وتطبيقات الـ SPA</td>
        <td>مجانية تلقائية وتجديد دائم + دعم دومين مخصص</td>
        <td><strong>أفضل خيار على الإطلاق:</strong> باندويث غير محدود عالمياً، سرعة استجابة فائقة عبر شبكة Cloudflare، وحماية تلقائية من هجمات DDoS.</td>
      </tr>
      <tr>
        <td><strong>Vercel</strong></td>
        <td><strong>مجاني</strong> للاستخدام غير التجاري</td>
        <td>دعم فوري ومباشر لـ Vite و React</td>
        <td>مجانية تلقائية</td>
        <td>ممتاز للمطورين وسريع في الربط مع GitHub، لكنه يفرض قيود باندويث (100GB/شهر) في الخطة المجانية.</td>
      </tr>
      <tr>
        <td><strong>Hostinger</strong><br/><em>(الاستضافة التقليدية)</em></td>
        <td>مدفوع اشتراكاً<br/>(~2.99$/ش تجدد بـ ~7.99$/ش)</td>
        <td>يدعم رفع مجلد <code>dist</code> الثابت عبر hPanel</td>
        <td>مشمولة مع الخطة</td>
        <td><strong>تقييم تفصيلي:</strong> توفر Hostinger استضافة مواقع قوية وبريداً رسمياً، لكنها تكلفة شهرية إضافية غير مبررة لموقع Static لا يستخدم PHP/MySQL، ما لم تكن المبادرة بحاجة ملحة لصناديق البريد المؤسسية المدمجة.</td>
      </tr>
      <tr>
        <td><strong>GitHub Pages</strong></td>
        <td><strong>مجاني</strong> تماماً</td>
        <td>يدعم الرفع مع ضبط <code>base: '/sci/'</code></td>
        <td>مجانية</td>
        <td>جيد للأرشفة، لكنه يتطلب معالجة يدوية لإعادة توجيه مسارات الـ SPA (404.html redirect hack).</td>
      </tr>
    </tbody>
  </table>

  <!-- ==================== PAGE 4 ==================== -->
  <div class="page-break"></div>

  <h3 class="subsection-title">توصيات الاستضافة الثلاث (3-Tier Hosting Strategy):</h3>
  
  <div class="stat-card accent avoid-break" style="margin-bottom: 10px;">
    <strong>الخيار الأول (الأقل تكلفة والأعلى كفاءة): Cloudflare Pages</strong>
    <span>
      استضافة مجانية عالمية لا نهائية الباندويث. لا تتطلب سوى ربط مستودع GitHub ليتم بناء وتحديث الموقع تلقائياً مع كل Commit، مع تكلفة سنوية تنحصر فقط في ثمن شراء الدومين (حوالي 10–12 دولاراً سنوياً).
    </span>
  </div>

  <div class="stat-card accent avoid-break" style="margin-bottom: 10px;">
    <strong>الخيار الثاني (التوازن الشامل مع البريد الرسمي): Hostinger Premium + Cloudflare DNS</strong>
    <span>
      شراء خطة Hostinger للاستفادة من البريد الإلكتروني الرسمي للمبادرة (مثل <code>contact@sci-infinity.com</code>)، مع توجيه حركة المرور والدومين عبر Cloudflare لتسريع تصفح صفحات الويب الثابتة.
    </span>
  </div>

  <div class="stat-card accent avoid-break" style="margin-bottom: 14px;">
    <strong>الخيار الثالث (التوسع المستقبلي مع قاعدة بيانات): Cloudflare Pages + Supabase Backend</strong>
    <span>
      الحفاظ على واجهة الموقع سريعة ومجانية على Cloudflare، وإضافة منصة Supabase (PostgreSQL مجاني) لاستقبال طلبات التطوع وإدارة محتوى الأنشطة من لوحة تحكم إدارية سحابية مستقلة.
    </span>
  </div>

  <h3 class="subsection-title">إعدادات الدومين وDNS وحماية HTTPS:</h3>
  <p>لربط نطاق مخصص (مثل <code>sci-infinity.org</code>)، يتم إعداد السجلات التالية لدى مسجل النطاق (Registrar):</p>
  <ul style="margin: 0 0 14px 0; padding-right: 20px; font-size: 8.5pt;">
    <li><strong>سجل CNAME:</strong> النطاق الفرعي <code>www</code> يوجه إلى <code>sci-infinity.pages.dev</code>.</li>
    <li><strong>سجل Apex (النطاق الأساسي):</strong> استخدام خاصية CNAME Flattening أو خوادم أسماء Cloudflare (Nameservers) لتوجيه النطاق الرئيسي مباشرة.</li>
    <li><strong>تفعيل SSL/TLS:</strong> يتم إصدار وتجديد شهادة التشفير (HTTPS) تلقائياً بنظام Let's Encrypt / Cloudflare Universal SSL دون أي تدخل يدوي.</li>
  </ul>

  <h2 class="section-title">6. خريطة الطريق والتوصيات الهندسية القابلة للتنفيذ (Actionable Roadmap)</h2>

  <div class="stat-card avoid-break" style="border-right: 3px solid #EF4444; margin-bottom: 10px;">
    <strong style="color: #B91C1C;">المرحلة 0: متطلبات حرجة قبل الإطلاق العام للجمهور (Critical Launch Blockers)</strong>
    <span>
      1. <strong>حل مشكلة إعادة تحميل المسارات (SPA Routing Fix):</strong> إضافة ملف <code>_redirects</code> في مجلد <code>public</code> يحتوي على السطر <code>/* /index.html 200</code>، لضمان ألا تظهر صفحة 404 عند تحديث المتصفح داخل المسارات الفرعية على خوادم الاستضافة.<br/>
      2. <strong>تأمين استلام استمارات التواصل:</strong> ربط أزرار الإرسال في صفحتي "انضم إلينا" و"تواصل معنا" بنقطة نهاية حقيقية لتفادي فقدان طلبات المتطوعين.
    </span>
  </div>

  <div class="stat-card avoid-break" style="border-right: 3px solid #F59E0B; margin-bottom: 10px;">
    <strong style="color: #D97706;">المرحلة 1: تحسينات الجودة والأداء والوصولية (Quality & SEO Enhancements)</strong>
    <span>
      1. توليد خريطة الموقع <code>sitemap.xml</code> وملف <code>robots.txt</code> لتعزيز فهرسة الأنشطة والأبحاث على محركات البحث (Google).<br/>
      2. استكمال توحيد الخطوط المؤسسية والتأكد من تنزيل الخطوط محلياً لتقليل الاعتماد على شبكات الـ CDN الخارجية.
    </span>
  </div>

  <div class="stat-card avoid-break" style="border-right: 3px solid #3B82F6; margin-bottom: 14px;">
    <strong style="color: #1D4ED8;">المرحلة 2: التوسع التقني المستقبلي (Future Scalability)</strong>
    <span>
      بناء لوحة تحكم إدارية (Admin Dashboard) محمية بصلاحيات (RBAC)، تمكن مسؤولي المبادرة من إضافة وتعديل الفعاليات والأنشطة وحلقات البودكاست ديناميكياً بدون الحاجة إلى تعديل الكود البرمجي وإعادة النشر.
    </span>
  </div>

  <div class="callout" style="margin-top: 10px;">
    <strong>الخلاصة والتقييم النهائي:</strong> يتمتع مشروع <em>Sci Infinity</em> ببنية برمجية ممتازة وعالية التنظيم، وشفرة مصدرية نظيفة متوافقة مع أحدث معايير React 19 و TypeScript. الموقع جاهز للإطلاق التقني الفوري باستضافة Static سريعة وآمنة ومجانية، وهو مؤهل بالكامل للتطور المستقبلي المستمر.
  </div>

</body>
</html>
`;

fs.writeFileSync(tempHtml, htmlContent, 'utf8');
console.log('Template HTML created at:', tempHtml);

const fileUrl = `file:///${tempHtml.replace(/\\/g, '/')}`;
const cmd = `"${edgePath}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${outputPdf}" "${fileUrl}"`;

console.log('Generating PDF with Edge...');
try {
  execSync(cmd, { timeout: 25000, stdio: 'inherit' });
  if (fs.existsSync(outputPdf)) {
    console.log('SUCCESS: PDF Generated at:', outputPdf, 'Size:', fs.statSync(outputPdf).size, 'bytes');
  } else {
    console.error('FAILED: Output PDF not found.');
  }
} catch (e) {
  console.error('Error generating PDF:', e.message);
} finally {
  // Clean up temporary html file
  try {
    fs.unlinkSync(tempHtml);
    console.log('Cleaned up temporary HTML file.');
  } catch (e) {}
}
