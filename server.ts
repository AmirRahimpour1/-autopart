import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI client:", e);
    }
  }
  return aiClient;
}

// Initial In-Memory Seed Data (Persists during server lifecycle)
let initialParts = [
  {
    id: "p1",
    name: "لنت ترمز جلو سرامیکی تکستار (Textar)",
    oemCode: "TXT-206-FRB",
    brand: "Textar آلمان",
    category: "brake",
    categoryLabel: "سیستم ترمز",
    price: 1850000,
    originalPrice: 2100000,
    inStock: 24,
    minStockThreshold: 5,
    isOriginal: true,
    warrantyMonths: 12,
    compatibleCars: ["پژو 206 تیپ 2 و 5", "پژو 207i", "رانا پلاس", "دانگ‌فنگ H30 کراس"],
    countryOfOrigin: "آلمان",
    rating: 4.8,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1600790142055-619df03207e6?w=600&auto=format&fit=crop&q=80",
    description: "لنت ترمز سرامیکی با ضریب اصطکاک بالا، بدون بو و دوده، مناسب ترمزگیری پرقدرت در سرعت‌های بالا و ترافیک شهری.",
    technicalSpecs: {
      "نوع لنت": "سرامیکی بدون آزبست",
      "محل نصب": "چرخ جلو (هر دو سمت)",
      "سازگاری با دیسک": "دیسک‌های خنک‌شونده 266mm",
      "مقاومت حرارتی": "تا 650 درجه سانتی‌گراد",
      "استاندارد": "ECE R90 اروپا"
    },
    syncPlatforms: { "دیجی‌کالا": true, "ترب": true, "باسلام": false }
  },
  {
    id: "p2",
    name: "کیت تسمه تایم کنتیننتال با بلبرینگ اصل",
    oemCode: "CT-1049-K1",
    brand: "Continental آلمان",
    category: "engine",
    categoryLabel: "موتور و گیربکس",
    price: 2950000,
    originalPrice: 3300000,
    inStock: 14,
    minStockThreshold: 4,
    isOriginal: true,
    warrantyMonths: 24,
    compatibleCars: ["پژو 206 تیپ 5 (موتور TU5)", "پژو 207i دنده‌ای و اتومات", "پژو پارس TU5", "رانا"],
    countryOfOrigin: "رومانی (تاییدیه آلمان)",
    rating: 4.9,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
    description: "کیت کامل تسمه تایم شامل تسمه 134 دندانه تقویت شده با الیاف کولار، هرزگرد ثابت و تسمه سفت‌کن بلبرینگی اصل INA.",
    technicalSpecs: {
      "تعداد دندانه": "134 دندانه",
      "عمر مفید کارکرد": "70,000 کیلومتر یا 3 سال",
      "شامل قطعات": "تسمه تایم + ۲ عدد هرزگرد و سفت‌کن",
      "کد فنی موتور": "TU5 / N6A"
    },
    syncPlatforms: { "دیجی‌کالا": true, "ترب": true, "باسلام": true }
  },
  {
    id: "p3",
    name: "کمک فنر جلو روغنی-گازی ماندو (Mando)",
    oemCode: "MND-SAM-502",
    brand: "Mando کره جنوبی",
    category: "suspension",
    categoryLabel: "جلوبندی و تعلیق",
    price: 3400000,
    originalPrice: 3800000,
    inStock: 8,
    minStockThreshold: 3,
    isOriginal: true,
    warrantyMonths: 18,
    compatibleCars: ["سمند LX و سورن", "دنا و دنا پلاس توربو", "پژو پارس سال", "پژو 405 GLX"],
    countryOfOrigin: "کره جنوبی",
    rating: 4.7,
    reviewsCount: 31,
    image: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600&auto=format&fit=crop&q=80",
    description: "کمک فنر دو جداره هیدرولیک گازی نیتروژن‌دار جهت حذف کامل ضربات جاده، ارتعاشات دست‌انداز و پایداری در پیچ‌ها.",
    technicalSpecs: {
      "نوع کارکرد": "گازی-روغنی دو جداره",
      "جنس پیستون": "فولاد آبکاری کروم سخت",
      "قطر میل کمک": "22 میلی‌متر",
      "گارانتی تعویض": "18 ماه بی‌قید و شرط"
    },
    syncPlatforms: { "دیجی‌کالا": true, "ترب": false, "باسلام": true }
  },
  {
    id: "p4",
    name: "شمع سوزنی ایریدیوم NGK لیزر اصل ژاپن",
    oemCode: "NGK-ILZKR7B11",
    brand: "NGK ژاپن",
    category: "electrical",
    categoryLabel: "برق و احتراق",
    price: 1980000,
    originalPrice: 2250000,
    inStock: 3, // Low stock for inventory alerts
    minStockThreshold: 6,
    isOriginal: true,
    warrantyMonths: 12,
    compatibleCars: ["دنا پلاس توربو شارژ", "تارا دنده‌ای و اتوماتیک", "شاهین G توربو", "پژو 2008", "جک S5"],
    countryOfOrigin: "ژاپن",
    rating: 4.95,
    reviewsCount: 115,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80",
    description: "شمع ۴ عددی ایریدیوم پایه‌بلند با سرسوزن ۰.۶ میلی‌متری و جوش لیزری، شتاب انفجاری، کاهش چشمگیر ناک و کاهش ۱۰ درصدی مصرف سوخت.",
    technicalSpecs: {
      "آلیاژ مرکزی": "ایریدیوم فوق خالص لیزری",
      "پایه شمع": "پایه‌بلند ۲۶.۵ میلی‌متری (آچار ۱۶)",
      "عمر مفید کارکرد": "100,000 کیلومتر",
      "گپ فابریک": "1.1 میلی‌متر"
    },
    syncPlatforms: { "دیجی‌کالا": true, "ترب": true, "باسلام": true }
  },
  {
    id: "p5",
    name: "رادیاتور آب دولول آلومینیومی کوشش رادیاتور",
    oemCode: "KSH-RAD-PRD-2L",
    brand: "کوشش رادیاتور",
    category: "cooling",
    categoryLabel: "خنک‌کاری و رادیاتور",
    price: 1420000,
    originalPrice: 1650000,
    inStock: 19,
    minStockThreshold: 5,
    isOriginal: true,
    warrantyMonths: 12,
    compatibleCars: ["پراید صبا و 131", "تیبا 1 و 2", "کوییک دنده‌ای و اتومات", "ساینا S"],
    countryOfOrigin: "ایران (استاندارد ملی)",
    rating: 4.6,
    reviewsCount: 56,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80",
    description: "شبکه دولول آلومینیومی با جوش بریزینگ و لوله‌های اکسترود شده مقاوم در برابر زنگ‌زدگی و رسوب، خنک‌کنندگی عالی در دمای بالای تابستان.",
    technicalSpecs: {
      "طراحی رادیاتور": "دو لول پربازده",
      "متریال": "آلومینیوم با خلوص ۹۹٪",
      "تحمل فشار": "تا ۲.۵ بار",
      "مخازن جانبی": "پلی‌آمید تقویت شده با الیاف شیشه"
    },
    syncPlatforms: { "دیجی‌کالا": false, "ترب": true, "باسلام": true }
  },
  {
    id: "p6",
    name: "فیلتر روغن و فیلتر هوای اسپرت مان فیلتر (Mann-Filter)",
    oemCode: "MANN-HU-711/51",
    brand: "Mann-Filter آلمان",
    category: "filter",
    categoryLabel: "فیلترها و سرویس دوره‌ای",
    price: 890000,
    originalPrice: 980000,
    inStock: 45,
    minStockThreshold: 10,
    isOriginal: true,
    warrantyMonths: 6,
    compatibleCars: ["هیوندای سوناتا YF و LF", "کیا اپتیما", "هیوندای سانتافه 2400", "کیا اسپورتیج"],
    countryOfOrigin: "آلمان",
    rating: 4.85,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=80",
    description: "کاغذ فیلتر میکرو سلولزی با قدرت جذب ذرات ریز تا ۵ میکرون، جلوگیری از سایش میل‌لنگ و افزایش طول عمر توربوشارژر و یاتاقان‌ها.",
    technicalSpecs: {
      "راندمان تصفیه": "99.2% در ذرات بزرگتر از 8 میکرون",
      "جنس آب‌بندی": "اورینگ سیلیکونی مقاوم به روغن داغ",
      "استاندارد": "OEM اختصاصی کیا و هیوندای"
    },
    syncPlatforms: { "دیجی‌کالا": true, "ترب": true, "باسلام": false }
  },
  {
    id: "p7",
    name: "دیسک و صفحه کلاچ والئو پریدمپر اصل جعبه سبز فرانسه",
    oemCode: "VAL-826359-FR",
    brand: "Valeo فرانسه",
    category: "engine",
    categoryLabel: "موتور و گیربکس",
    price: 4600000,
    originalPrice: 5200000,
    inStock: 6,
    minStockThreshold: 2,
    isOriginal: true,
    warrantyMonths: 12,
    compatibleCars: ["پژو 206 تیپ 5", "پژو 207i دنده‌ای", "رانا پلاس", "پژو پارس LX"],
    countryOfOrigin: "فرانسه",
    rating: 4.9,
    reviewsCount: 77,
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&auto=format&fit=crop&q=80",
    description: "کیت کلاچ ۳ تکه شامل دیسک، صفحه پریدمپر (۴ فنره دوبل نرم) و بلبرینگ کلاچ اصلی والئو فرانسه. پدال بسیار نرم و بدون لرزش در نیم‌کلاچ.",
    technicalSpecs: {
      "سیستم فنربندی": "پریدمپر دوبل نرم",
      "قطر صفحه کلاچ": "200 میلی‌متر",
      "بلبرینگ همراه": "بلبرینگ تقویت شده فولادی",
      "لیبل امنیتی": "کد اصالت پیامکی و هولوگرام هرینگتون"
    },
    syncPlatforms: { "دیجی‌کالا": true, "ترب": true, "باسلام": true }
  },
  {
    id: "p8",
    name: "دیسک ترمز چرخ جلو شیاردار سوراخ‌دار برمبو (Brembo)",
    oemCode: "BRM-09.8695.14",
    brand: "Brembo ایتالیا",
    category: "brake",
    categoryLabel: "سیستم ترمز",
    price: 3850000,
    originalPrice: 4300000,
    inStock: 0, // Out of stock to test notify me
    minStockThreshold: 4,
    isOriginal: true,
    warrantyMonths: 24,
    compatibleCars: ["دنا پلاس توربو اتوماتیک", "پژو 2008", "سیتروئن C3", "تارا"],
    countryOfOrigin: "ایتالیا",
    rating: 4.95,
    reviewsCount: 53,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80",
    description: "دیسک چرخ سوراخ‌دار و شیاردار اسپرت جهت تخلیه فوری گازهای ترمز و آب، بدون تاب برداشتن در ترمزهای پیاپی و تند در گردنه‌ها.",
    technicalSpecs: {
      "قطر دیسک": "283 میلی‌متر خنک‌شونده",
      "طراحی سطح": "شیاردار منحنی و سوراخ‌کاری شده",
      "پوشش ضد زنگ": "UV Coating ضد خوردگی",
      "توازن مکانیکی": "تراش CNC با بالانس میکروگرمی"
    },
    syncPlatforms: { "دیجی‌کالا": false, "ترب": false, "باسلام": false }
  }
];

let initialOrders = [
  {
    id: "ord-1001",
    trackingCode: "YDK-894210",
    postalCodeTracking: "984210041209384711",
    customerName: "مهندس علیرضا رحیم‌پور",
    customerPhone: "09123456789",
    customerAddress: "تهران، خیابان سهروردی شمالی، کوچه تقوی، پلاک ۲۴، واحد ۶",
    items: [
      {
        partId: "p1",
        partName: "لنت ترمز جلو سرامیکی تکستار (Textar)",
        oemCode: "TXT-206-FRB",
        price: 1850000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1600790142055-619df03207e6?w=600&auto=format&fit=crop&q=80"
      },
      {
        partId: "p4",
        partName: "شمع سوزنی ایریدیوم NGK لیزر اصل ژاپن",
        oemCode: "NGK-ILZKR7B11",
        price: 1980000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80"
      }
    ],
    totalAmount: 3830000,
    taxAmount: 344700,
    shippingFee: 85000,
    finalAmount: 4259700,
    paymentMethod: "online",
    paymentStatus: "paid",
    orderStatus: "shipped",
    createdAt: "1403/06/20 - 14:30",
    estimatedDelivery: "1403/06/23",
    notes: "کالای حساس شکستنی، با بسته‌بندی ویژه ضربه‌گیر ارسال شود.",
    smsNotificationsSent: [
      "سفارش شما با موفقیت ثبت شد و فاکتور صادر گردید.",
      "سفارش با کد رهگیری پستی 984210041209384711 تحویل پست پیشتاز شد."
    ]
  },
  {
    id: "ord-1002",
    trackingCode: "YDK-762901",
    postalCodeTracking: "762901039821456100",
    customerName: "سعید کریمی",
    customerPhone: "09198765432",
    customerAddress: "اصفهان، خیابان چهارباغ بالا، مجتمع تجاری کوثر، طبقه ۳",
    items: [
      {
        partId: "p2",
        partName: "کیت تسمه تایم کنتیننتال با بلبرینگ اصل",
        oemCode: "CT-1049-K1",
        price: 2950000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80"
      }
    ],
    totalAmount: 2950000,
    taxAmount: 265500,
    shippingFee: 70000,
    finalAmount: 3285500,
    paymentMethod: "online",
    paymentStatus: "paid",
    orderStatus: "delayed", // delayed order for overdue smart alert feature!
    createdAt: "1403/06/15 - 11:15",
    estimatedDelivery: "1403/06/18",
    notes: "تأخیر به دلیل بررسی بارنامه جدید در مرکز توزیع اصفهان",
    smsNotificationsSent: [
      "سفارش شما ثبت شد.",
      "پیامک یادآوری هوشمند به انباردار: سفارش معوقه جهت پیگیری سریع ارسال شد."
    ]
  },
  {
    id: "ord-1003",
    trackingCode: "YDK-551029",
    postalCodeTracking: "551029983748291044",
    customerName: "مریم ناصری",
    customerPhone: "09351234567",
    customerAddress: "شیراز، بلوار ارم، کوچه ۱۲، پلاک ۸",
    items: [
      {
        partId: "p5",
        partName: "رادیاتور آب دولول آلومینیومی کوشش رادیاتور",
        oemCode: "KSH-RAD-PRD-2L",
        price: 1420000,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80"
      }
    ],
    totalAmount: 2840000,
    taxAmount: 255600,
    shippingFee: 110000,
    finalAmount: 3205600,
    paymentMethod: "online",
    paymentStatus: "paid",
    orderStatus: "delivered",
    createdAt: "1403/06/10 - 09:40",
    estimatedDelivery: "1403/06/13",
    notes: "تحویل مشتری شد و امضا دیجیتال ثبت گردید.",
    smsNotificationsSent: [
      "سفارش تحویل شد. از خرید شما از یدک‌پلاس سپاسگزاریم."
    ]
  }
];

let initialTickets = [
  {
    id: "tkt-1",
    customerName: "علیرضا رحیم‌پور",
    customerPhone: "09123456789",
    type: "support",
    title: "استعلام سازگاری لنت ترمز تکستار با دیسک سورن پلاس",
    message: "سلام خسته نباشید، آیا لنت ترمز تکستار کد TXT-206-FRB روی کالیپر ترمز بوش دنا و سورن پلاس موتور EF7 هم سوار میشه یا باید مدل بزرگتری سفارش بدم؟",
    status: "resolved",
    createdAt: "1403/06/21 - 10:20",
    reply: "سلام و درود، سیستم ترمز دنا و سورن پلاس دارای کالیپر سایز بزرگ‌تر (۲۸۳ میلی‌متری) است. برای آن خودروها باید لنت کد TXT-405-BIG یا لنت اختصاصی موتور ملی EF7 سفارش داده شود."
  },
  {
    id: "tkt-2",
    customerName: "سعید کریمی",
    customerPhone: "09198765432",
    type: "complaint",
    title: "تأخیر در تحویل بسته کد سفارش YDK-762901",
    message: "سلام، طبق زمان تخمینی قرار بود بسته من دیروز برسه ولی وضعیت مرسوله هنوز در پست معلق هست. لطفا پیگیری کنید.",
    status: "in_progress",
    createdAt: "1403/06/22 - 08:45",
    reply: "درود بر شما، مراتب از طریق سرپرستی منطقه پستی اصفهان با اولویت ویژه پیگیری شد و پیامک آخرین وضعیت تا ظهر برای شما ارسال خواهد شد."
  }
];

let initialStockAlerts = [
  {
    id: "sa-1",
    partId: "p8",
    partName: "دیسک ترمز چرخ جلو شیاردار سوراخ‌دار برمبو (Brembo)",
    customerPhone: "09123456789",
    requestedAt: "1403/06/22 - 12:30",
    isNotified: false
  }
];

let initialAccountingTransactions = [
  {
    id: "acc-101",
    type: "sale",
    title: "فروش آنلاین سفارش YDK-894210",
    amount: 4259700,
    date: "1403/06/20",
    referenceNumber: "TRX-994821",
    party: "درگاه پرداخت شاپرک / زرین‌پال",
    category: "درآمد",
    invoiceId: "INV-894210"
  },
  {
    id: "acc-102",
    type: "sale",
    title: "فروش آنلاین سفارش YDK-762901",
    amount: 3285500,
    date: "1403/06/15",
    referenceNumber: "TRX-883104",
    party: "درگاه پرداخت شاپرک / سداد",
    category: "درآمد",
    invoiceId: "INV-762901"
  },
  {
    id: "acc-103",
    type: "purchase",
    title: "خرید عمده لنت تکستار از بازرگانی فدک",
    amount: 28500000,
    date: "1403/06/14",
    referenceNumber: "CHK-002914",
    party: "بازرگانی قطعات خودرو فدک",
    category: "هزینه",
    invoiceId: "PUR-1403-09"
  },
  {
    id: "acc-104",
    type: "shipping",
    title: "هزینه ارسال محموله پست پیشتاز مرکزی",
    amount: 1450000,
    date: "1403/06/12",
    referenceNumber: "POST-8819",
    party: "شرکت ملی پست ایران",
    category: "هزینه"
  },
  {
    id: "acc-105",
    type: "tax",
    title: "واریز علی‌الحساب ارزش افزوده سه ماهه تابستان",
    amount: 5200000,
    date: "1403/06/05",
    referenceNumber: "TAX-1403-Q2",
    party: "سازمان امور مالیاتی کشور",
    category: "هزینه"
  },
  {
    id: "acc-106",
    type: "sale",
    title: "فروش آنلاین سفارش YDK-551029",
    amount: 3205600,
    date: "1403/06/10",
    referenceNumber: "TRX-774019",
    party: "درگاه پرداخت شاپرک / بهپرداخت",
    category: "درآمد",
    invoiceId: "INV-551029"
  }
];

// ---------------- API ROUTES ----------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "YadakPlus Auto Spare Parts API",
    geminiEnabled: !!process.env.GEMINI_API_KEY,
    partsCount: initialParts.length,
    ordersCount: initialOrders.length
  });
});

// 1. PARTS CATALOG
app.get("/api/parts", (req, res) => {
  const { query, category, car, inStockOnly } = req.query;
  let list = [...initialParts];

  if (query && typeof query === "string") {
    const q = query.trim().toLowerCase();
    list = list.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.oemCode.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.compatibleCars.some(c => c.toLowerCase().includes(q))
    );
  }

  if (category && typeof category === "string" && category !== "all") {
    list = list.filter(p => p.category === category);
  }

  if (car && typeof car === "string" && car !== "all") {
    list = list.filter(p => p.compatibleCars.some(c => c.includes(car)));
  }

  if (inStockOnly === "true") {
    list = list.filter(p => p.inStock > 0);
  }

  res.json({ success: true, count: list.length, parts: list, data: list });
});

// Update part stock or details (Admin)
app.patch("/api/parts/:id", (req, res) => {
  const { id } = req.params;
  const index = initialParts.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "قطعه یافت نشد." });
  }

  const prevStock = initialParts[index].inStock;
  initialParts[index] = { ...initialParts[index], ...req.body };

  // Check if stock went from 0 to > 0 to trigger automatic notification
  if (prevStock === 0 && initialParts[index].inStock > 0) {
    const alertsToNotify = initialStockAlerts.filter(a => a.partId === id && !a.isNotified);
    alertsToNotify.forEach(alert => {
      alert.isNotified = true;
    });
  }

  res.json({ success: true, part: initialParts[index] });
});

// Sync part across marketplaces
app.post("/api/parts/:id/sync", (req, res) => {
  const { id } = req.params;
  const { platform } = req.body;
  const part = initialParts.find(p => p.id === id);
  if (!part) {
    return res.status(404).json({ success: false, error: "قطعه یافت نشد." });
  }

  if (!part.syncPlatforms) {
    part.syncPlatforms = { 'دیجی‌کالا': false, 'ترب': false, 'باسلام': false };
  }
  (part.syncPlatforms as any)[platform] = !(part.syncPlatforms as any)[platform];

  res.json({
    success: true,
    message: `همگام‌سازی کالا با پلتفرم ${platform} با موفقیت به‌روزرسانی شد.`,
    syncPlatforms: part.syncPlatforms
  });
});

// 2. ORDERS MANAGEMENT
app.get("/api/orders", (req, res) => {
  const { phone, status } = req.query;
  let list = [...initialOrders];

  if (phone && typeof phone === "string") {
    list = list.filter(o => o.customerPhone.includes(phone.trim()));
  }

  if (status && typeof status === "string" && status !== "all") {
    list = list.filter(o => o.orderStatus === status);
  }

  res.json({ success: true, orders: list, data: list });
});

// Create new order (Client checkout)
app.post("/api/orders", (req, res) => {
  const { customerName, customerPhone, customerAddress, items, paymentMethod } = req.body;

  if (!customerPhone || !items || !items.length) {
    return res.status(400).json({ success: false, error: "اطلاعات سفارش ناقص است." });
  }

  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  const trackingCode = `YDK-${randomDigits}`;
  const postalCodeTracking = `984${Math.floor(100000000000000 + Math.random() * 900000000000000)}`;

  let totalAmount = 0;
  items.forEach((item: any) => {
    totalAmount += (item.price || 0) * (item.quantity || 1);
    // reduce stock
    const part = initialParts.find(p => p.id === item.partId);
    if (part) {
      part.inStock = Math.max(0, part.inStock - (item.quantity || 1));
    }
  });

  const taxAmount = Math.round(totalAmount * 0.09);
  const shippingFee = 85000;
  const finalAmount = totalAmount + taxAmount + shippingFee;

  const now = new Date();
  const dateStr = `1403/06/22 - ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newOrder = {
    id: `ord-${Date.now()}`,
    trackingCode,
    postalCodeTracking,
    customerName: customerName || "مشتری محترم",
    customerPhone,
    customerAddress: customerAddress || "تهران - آدرس پیش‌فرض",
    items,
    totalAmount,
    taxAmount,
    shippingFee,
    finalAmount,
    paymentMethod: paymentMethod || "online",
    paymentStatus: "paid",
    orderStatus: "registered",
    createdAt: dateStr,
    estimatedDelivery: "۳ تا ۴ روز کاری",
    notes: req.body.notes || "",
    smsNotificationsSent: [
      `سفارش شما با کد ${trackingCode} با موفقیت ثبت و فاکتور آنلاین صادر شد.`
    ]
  };

  initialOrders.unshift(newOrder);

  // Auto record in Accounting Ledger
  initialAccountingTransactions.unshift({
    id: `acc-${Date.now()}`,
    type: "sale",
    title: `فروش آنلاین سفارش ${trackingCode}`,
    amount: finalAmount,
    date: "1403/06/22",
    referenceNumber: `TRX-${randomDigits}`,
    party: "درگاه پرداخت امن شاپرک",
    category: "درآمد",
    invoiceId: `INV-${trackingCode}`
  });

  res.json({ success: true, order: newOrder });
});

// Update order status & send smart notifications
app.patch("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { orderStatus, postalCodeTracking, note } = req.body;
  const order = initialOrders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, error: "سفارش یافت نشد." });
  }

  if (orderStatus) order.orderStatus = orderStatus;
  if (postalCodeTracking) order.postalCodeTracking = postalCodeTracking;
  if (note) order.notes = note;

  // Add notification log
  let smsMsg = "";
  if (orderStatus === "shipped") {
    smsMsg = `مرسوله شما تحویل پست شد. کد رهگیری پستی: ${order.postalCodeTracking || "ثبت شده"}`;
  } else if (orderStatus === "delivered") {
    smsMsg = `سفارش ${order.trackingCode} تحویل داده شد. سپاس از اعتماد شما به یدک‌پلاس.`;
  } else if (orderStatus === "delayed") {
    smsMsg = `اعلان هوشمند: سفارش ${order.trackingCode} جهت تحویل سریع‌تر اولویت‌بندی گردید.`;
  }

  if (smsMsg && !order.smsNotificationsSent.includes(smsMsg)) {
    order.smsNotificationsSent.push(smsMsg);
  }

  res.json({ success: true, order });
});

// Send custom SMS for order
app.post("/api/orders/:id/sms", (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const order = initialOrders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, error: "سفارش یافت نشد." });
  }

  order.smsNotificationsSent.push(message || "اطلاع‌رسانی وضعیت مرسوله");
  res.json({
    success: true,
    message: `پیامک به شماره ${order.customerPhone} با موفقیت ارسال و در پرونده ثبت شد.`
  });
});

// 3. STOCK ALERTS ("خبرم کن")
app.post("/api/stock-alerts", (req, res) => {
  const { partId, customerPhone } = req.body;
  const part = initialParts.find(p => p.id === partId);
  if (!part) {
    return res.status(404).json({ success: false, error: "قطعه یافت نشد." });
  }

  const existing = initialStockAlerts.find(
    a => a.partId === partId && a.customerPhone === customerPhone
  );
  if (existing) {
    return res.json({
      success: true,
      message: "شماره شما پیش از این در لیست انتظار این کالا ثبت شده است."
    });
  }

  const newAlert = {
    id: `sa-${Date.now()}`,
    partId,
    partName: part.name,
    customerPhone,
    requestedAt: "1403/06/22 - 14:00",
    isNotified: false
  };
  initialStockAlerts.push(newAlert);

  res.json({
    success: true,
    message: `درخواست شما ثبت شد. به محض موجود شدن کالا، پیامک فوری به شماره ${customerPhone} ارسال می‌شود.`
  });
});

app.get("/api/stock-alerts", (req, res) => {
  res.json({ success: true, alerts: initialStockAlerts, data: initialStockAlerts });
});

// 4. TICKETS & USER COMPLAINTS
app.get("/api/tickets", (req, res) => {
  res.json({ success: true, tickets: initialTickets, data: initialTickets });
});

app.post("/api/tickets", (req, res) => {
  const { customerName, customerPhone, type, title, message } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, error: "عنوان و متن پیام الزامی است." });
  }

  const newTicket = {
    id: `tkt-${Date.now()}`,
    customerName: customerName || "کاربر سایت",
    customerPhone: customerPhone || "09xxxxxxxxx",
    type: type || "support",
    title,
    message,
    status: "open",
    createdAt: "1403/06/22 - 15:30",
    reply: ""
  };

  initialTickets.unshift(newTicket);
  res.json({ success: true, ticket: newTicket });
});

app.all("/api/tickets/:id/reply", (req, res) => {
  const { id } = req.params;
  const { reply, status } = req.body;
  const ticket = initialTickets.find(t => t.id === id);
  if (!ticket) {
    return res.status(404).json({ success: false, error: "تیکت یافت نشد." });
  }

  ticket.reply = reply;
  ticket.status = status || "resolved";
  res.json({ success: true, ticket });
});

// 5. ACCOUNTING & FINANCIAL REPORTS
app.get("/api/accounting", (req, res) => {
  let totalRevenue = 0;
  let totalExpenses = 0;

  initialAccountingTransactions.forEach(t => {
    if (t.category === "درآمد") totalRevenue += t.amount;
    else if (t.category === "هزینه") totalExpenses += t.amount;
  });

  const grossProfit = totalRevenue;
  const netProfit = totalRevenue - totalExpenses;
  const vatPayable = Math.round(totalRevenue * 0.09);
  const accountsReceivable = 18500000; // بدهکاران تجاری / مبالغ درگاه
  const accountsPayable = 24000000; // چک‌های صادره به تأمین‌کنندگان قطعات
  const cashInGateway = 12450000;

  res.json({
    success: true,
    summary: {
      totalRevenue,
      totalExpenses,
      grossProfit,
      netProfit,
      vatPayable,
      accountsReceivable,
      accountsPayable,
      cashInGateway,
      monthlyComparison: [
        { month: "فروردین", sales: 48000000, expenses: 31000000, profit: 17000000 },
        { month: "اردیبهشت", sales: 62000000, expenses: 40000000, profit: 22000000 },
        { month: "خرداد", sales: 71000000, expenses: 45000000, profit: 26000000 },
        { month: "تیر", sales: 85000000, expenses: 54000000, profit: 31000000 },
        { month: "مرداد", sales: 94000000, expenses: 59000000, profit: 35000000 },
        { month: "شهریور (جاری)", sales: 112000000, expenses: 68000000, profit: 44000000 }
      ]
    },
    transactions: initialAccountingTransactions
  });
});

app.post("/api/accounting/transactions", (req, res) => {
  const { type, title, amount, party, category, referenceNumber } = req.body;
  const newTx = {
    id: `acc-${Date.now()}`,
    type: type || "expense",
    title,
    amount: Number(amount) || 0,
    date: "1403/06/22",
    referenceNumber: referenceNumber || `REF-${Math.floor(10000 + Math.random() * 90000)}`,
    party: party || "طرف حساب عمومی",
    category: category || "هزینه"
  };
  initialAccountingTransactions.unshift(newTx);
  res.json({ success: true, transaction: newTx });
});

// 6. AI AUTO PARTS RECOMMENDATION & DIAGNOSTIC (Gemini API)
app.post("/api/ai/diagnose", async (req, res) => {
  const { carBrand, carModel, year, engine, symptoms, userQuery } = req.body;

  const prompt = `شما به عنوان یک مهندس ارشد مکانیک خودرو و متخصص قطعات یدکی و کدینگ قطعات اورجینال هستید.
اطلاعات خودروی کاربر:
- برند خودرو: ${carBrand || "نامشخص"}
- مدل خودرو: ${carModel || "عمومی"}
- سال ساخت / کارکرد: ${year || "مشخص نشده"}
- نوع موتور یا تیپ: ${engine || "فابریک"}
- علائم خرابی، صدا یا نقص فنی مطرح شده: ${symptoms || userQuery || "درخواست مشاوره قطعه"}

لطفا یک پاسخ تخصصی و ساختاریافته به زبان فارسی بازگردانید.
خروجی باید یک شیء JSON معتبر (بدون تگ‌های markdown اضافی و فقط متن json خام) با فیلدهای زیر باشد:
{
  "diagnosisSummary": "تحلیل کوتاه و دقیق فنی درباره علت بروز این صدا یا مشکل در این خودرو",
  "urgency": "فوری" یا "متوسط" یا "سرویس دوره‌ای",
  "recommendedParts": [
    {
      "name": "نام دقیق و استاندارد قطعه یدکی",
      "oemCode": "کد فنی پیشنهادی یا OEM فابریک",
      "estimatedCost": "بازه قیمت تقریبی به تومان",
      "reason": "چرا این قطعه باید بررسی یا تعویض شود",
      "priority": "اصلی" یا "مکمل"
    }
  ],
  "mechanicTips": ["نکته ۱ برای افزایش طول عمر قطعه یا هنگام تعویض", "نکته ۲", "نکته ۳"],
  "compatibleCatalogPartIds": ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"] (آی‌دی‌های مرتبط از کاتالوگ فروشگاه در صورت ارتباط)
}`;

  const ai = getAI();

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an automotive master technician and spare parts specialist. Provide accurate JSON output in Persian for auto repair diagnosis and part OEM recommendations.",
          responseMimeType: "application/json"
        }
      });

      const text = response.text || "{}";
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, poweredBy: "Gemini 3.8 Flash AI" });
      } catch (parseErr) {
        console.warn("Could not parse Gemini JSON response directly, falling back:", parseErr);
      }
    } catch (apiErr) {
      console.warn("Gemini API call failed, using intelligent fallback rules:", apiErr);
    }
  }

  // Intelligent Fallback Rule Engine when API key is pending or network is unreachable
  let matchedIds: string[] = [];
  let summary = `بر اساس علائم ثبت شده برای ${carModel || "خودرو"}، احتمالا نقصی در سیستم اصطکاکی یا دوره‌ای رخ داده است.`;
  let partsList = [];

  const symLower = (symptoms || "").toLowerCase();
  if (symLower.includes("ترمز") || symLower.includes("سوت") || symLower.includes("صدا") || symLower.includes("لنت")) {
    matchedIds = ["p1", "p8"];
    summary = `صدای سوت کشیدن یا کاهش توان توقف در ${carModel || "خودرو"} معمولاً ناشی از اتمام گوشت لنت ترمز، شیشه‌ای شدن سطح لنت یا لبه زدن دیسک ترمز است.`;
    partsList = [
      {
        name: "لنت ترمز جلو سرامیکی اصلی",
        oemCode: "TXT-206-FRB",
        estimatedCost: "۱,۸۵۰,۰۰۰ تومان",
        reason: "بهبود ۴۰ درصدی چسبندگی و ترمزگیری نرم بدون سوت و بوی سوختگی",
        priority: "اصلی"
      },
      {
        name: "دیسک ترمز چرخ جلو شیاردار اسپرت",
        oemCode: "BRM-09.8695.14",
        estimatedCost: "۳,۸۵۰,۰۰۰ تومان",
        reason: "جلوگیری از لرزش پدال و خنک‌کاری سریع در ترمزهای ناگهانی",
        priority: "مکمل"
      }
    ];
  } else if (symLower.includes("تسمه") || symLower.includes("موتور") || symLower.includes("تایم") || symLower.includes("کیلومتر")) {
    matchedIds = ["p2", "p7"];
    summary = `سرویس تسمه تایم و بلبرینگ سفت‌کن در کارکردهای بالای ۶۰ هزار کیلومتر برای موتور ${engine || "خودرو"} حیاتی است تا از کج شدن سوپاپ‌ها جلوگیری شود.`;
    partsList = [
      {
        name: "کیت کامل تسمه تایم با هرزگرد و سفت‌کن بلبرینگی",
        oemCode: "CT-1049-K1",
        estimatedCost: "۲,۹۵۰,۰۰۰ تومان",
        reason: "پیشگیری از پاره شدن تسمه و خسارت میلیونی به سرسیلندر",
        priority: "اصلی"
      },
      {
        name: "کیت دیسک و صفحه کلاچ پریدمپر",
        oemCode: "VAL-826359-FR",
        estimatedCost: "۴,۶۰۰,۰۰۰ تومان",
        reason: "انتقال حداکثر گشتاور و نرمی پدال کلاچ هنگام تعویض دنده‌ها",
        priority: "مکمل"
      }
    ];
  } else if (symLower.includes("لرزش") || symLower.includes("دست‌انداز") || symLower.includes("کوبش") || symLower.includes("کمک")) {
    matchedIds = ["p3"];
    summary = `کوبش خودرو در دست‌اندازها و گیج زدن در پیچ‌ها نشان‌دهنده خالی شدن روغن کمک‌فنر یا فرسایش گردگیر و توپی سر کمک است.`;
    partsList = [
      {
        name: "کمک فنر جلو دو جداره گازی-روغنی",
        oemCode: "MND-SAM-502",
        estimatedCost: "۳,۴۰۰,۰۰۰ تومان",
        reason: "جذب ۱۰۰٪ ارتعاشات دست‌انداز و پایداری عالی خودرو در سرعت",
        priority: "اصلی"
      }
    ];
  } else {
    matchedIds = ["p4", "p6"];
    summary = `برای بهبود راندمان، کاهش مصرف بنزین و رفع ریپ زدن در شتاب اولیه، بررسی شمع‌های احتراق و فیلتراسیون در اولویت قرار دارد.`;
    partsList = [
      {
        name: "شمع سوزنی ایریدیوم پایه‌بلند لیزری",
        oemCode: "NGK-ILZKR7B11",
        estimatedCost: "۱,۹۸۰,۰۰۰ تومان",
        reason: "جرقه پرقدرت پایدار، حذف ناک موتور و کاهش مصرف سوخت",
        priority: "اصلی"
      },
      {
        name: "کیت فیلتر هوا و روغن استاندارد با جذب میکرونی",
        oemCode: "MANN-HU-711/51",
        estimatedCost: "۸۹۰,۰۰۰ تومان",
        reason: "محافظت از یاتاقان‌ها و تنفس روان پیشرانه",
        priority: "مکمل"
      }
    ];
  }

  res.json({
    success: true,
    data: {
      diagnosisSummary: summary,
      urgency: "متوسط",
      recommendedParts: partsList,
      mechanicTips: [
        "همواره قبل از تعویض قطعه، سلامت اتصالات و گشتاور بستن پیچ‌ها را با آچار ترکمتر بررسی نمایید.",
        "از سلامت سیم‌کشی، سنسورهای مجاور و عدم وجود نشتی روغن اطمینان حاصل کنید.",
        "پس از تعویض لنت یا دیسک ترمز، تا ۲۰۰ کیلومتر اول از ترمزگیری‌های شدید و ناگهانی پرهیز نمایید تا لنت‌ها به‌خوبی آب‌بندی شوند."
      ],
      compatibleCatalogPartIds: matchedIds
    },
    poweredBy: "موتور تخصصی عیب‌یابی و پیشنهاد قطعه یدک‌پلاس"
  });
});

// AI Interactive Live Chat Support
app.post("/api/ai/chat", async (req, res) => {
  const { message, history } = req.body;
  const userMsg = message || "";

  const ai = getAI();
  if (ai) {
    try {
      const chat = ai.chats.create({
        model: "gemini-3.8-flash",
        config: {
          systemInstruction: "شما پشتیبان هوشمند، کارشناس قطعات یدکی و مکانیک حرفه‌ای در فروشگاه یدک‌پلاس هستید. به سوالات فنی، قطعه‌شناسی، قیمت، نحوه ارسال و اصالت قطعات با لحنی محترمانه، راهنما و کاملا فارسی پاسخ دهید."
        }
      });
      const response = await chat.sendMessage({ message: userMsg });
      return res.json({
        success: true,
        reply: response.text,
        sender: "ai"
      });
    } catch (err) {
      console.warn("AI chat error:", err);
    }
  }

  // Fallback interactive replies
  let reply = "درود بر شما! کارشناس هوشمند یدک‌پلاس در خدمت شماست. در صورت تمایل مدل دقیق خودرو و قطعه مد نظرتان را بفرمایید تا اصالت کالا و کد فنی دقیق را خدمتتان تقدیم کنم.";
  if (userMsg.includes("قیمت") || userMsg.includes("هزینه")) {
    reply = "تمامی قیمت‌های درج شده در سایت به‌صورت روزانه و با احتساب تخفیف شرکتی به‌روزرسانی می‌شوند. همچنین ارسال سفارش‌های بالای ۳ میلیون تومان کاملاً رایگان است.";
  } else if (userMsg.includes("اصالت") || userMsg.includes("گارانتی") || userMsg.includes("اصل")) {
    reply = "کلیه قطعات ارائه شده در یدک‌پلاس دارای ضمانت اصالت ۱۰۰٪، هولوگرام رسمی شرکتی و گارانتی تعویض بین ۶ تا ۲۴ ماه هستند.";
  } else if (userMsg.includes("ارسال") || userMsg.includes("پست") || userMsg.includes("تحویل")) {
    reply = "سفارشات شهر تهران ظرف کمتر از ۳ ساعت با پیک موتوری ویژه و برای کلیه شهرستان‌ها ظرف ۲ الی ۳ روز کاری از طریق پست پیشتاز یا تیپاکس تحویل می‌شوند و پیامک کد رهگیری بلافاصله ارسال می‌گردد.";
  }

  res.json({
    success: true,
    reply,
    sender: "ai"
  });
});

// ---------------- VITE MIDDLEWARE SETUP ----------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Auto Spare Parts Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
