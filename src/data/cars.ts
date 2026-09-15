export interface CarBrandGroup {
  brand: string;
  country: string;
  models: {
    name: string;
    engines: string[];
    years: string;
  }[];
}

export const POPULAR_CAR_BRANDS: CarBrandGroup[] = [
  {
    brand: "ایران خودرو (IKCO)",
    country: "ایران",
    models: [
      { name: "پژو 206 تیپ 5", engines: ["TU5 1.6L 16V"], years: "1385 - 1401" },
      { name: "پژو 207i دنده‌ای و پانوراما", engines: ["TU5", "TU5P"], years: "1396 - 1403" },
      { name: "پژو پارس TU5 و سال", engines: ["TU5", "XU7P", "XU7"], years: "1388 - 1402" },
      { name: "دنا و دنا پلاس توربو اتوماتیک", engines: ["EF7", "EF7 Turbo"], years: "1394 - 1403" },
      { name: "تارا دنده‌ای و اتوماتیک", engines: ["TU5P 16V"], years: "1400 - 1403" },
      { name: "سمند LX و سورن پلاس", engines: ["EF7", "XU7"], years: "1390 - 1403" }
    ]
  },
  {
    brand: "سایپا (Saipa)",
    country: "ایران",
    models: [
      { name: "کوییک دنده‌ای و S", engines: ["M15 1.5L 8V"], years: "1397 - 1403" },
      { name: "شاهین G و اتوماتیک", engines: ["M15TC Turbo"], years: "1400 - 1403" },
      { name: "ساینا S و دنده‌ای", engines: ["M15 1.5L"], years: "1396 - 1403" },
      { name: "تیبا 1 و تیبا 2", engines: ["M15 1.5L"], years: "1390 - 1401" },
      { name: "پراید 131 و صبا", engines: ["M13 فابریک"], years: "1382 - 1399" }
    ]
  },
  {
    brand: "هیوندای (Hyundai)",
    country: "کره جنوبی",
    models: [
      { name: "هیوندای سوناتا YF و LF", engines: ["2.4L Theta II", "GDI"], years: "2011 - 2018" },
      { name: "هیوندای سانتافه DM", engines: ["2.4L MPI", "2.4L GDI"], years: "2014 - 2018" },
      { name: "هیوندای النترا MD و AD", engines: ["1.8L", "2.0L Nu"], years: "2013 - 2018" }
    ]
  },
  {
    brand: "کیا (Kia)",
    country: "کره جنوبی",
    models: [
      { name: "کیا سراتو مونتاژ سایپا و وارداتی", engines: ["1.6L", "2.0L DOHC"], years: "2010 - 2018" },
      { name: "کیا اپتیما TF و JF", engines: ["2.4L Theta II"], years: "2012 - 2018" },
      { name: "کیا اسپورتیج SL و QL", engines: ["2.4L MPI/GDI"], years: "2012 - 2018" }
    ]
  },
  {
    brand: "مدیران خودرو و کرمان موتور",
    country: "چینی / مونتاژ",
    models: [
      { name: "جک S5 توربو", engines: ["2.0L Turbo", "1.5L TGDI"], years: "1394 - 1402" },
      { name: "چری تیگو 7 و 8 پرو", engines: ["1.5L Turbo", "1.6L TGDI"], years: "1397 - 1403" },
      { name: "ام‌وی‌ام X22 و X33", engines: ["1.5L", "2.0L"], years: "1396 - 1402" }
    ]
  }
];

export const PART_CATEGORIES = [
  { id: 'brake', name: 'سیستم ترمز و دیسک' },
  { id: 'engine', name: 'کیت تسمه و قطعات موتور' },
  { id: 'suspension', name: 'جلوبندی و سیستم تعلیق' },
  { id: 'cooling', name: 'رادیاتور و سیستم خنک‌کاری' },
  { id: 'electrical', name: 'برق، سنسورها و انژکتور' },
  { id: 'filter', name: 'فیلترها و سرویس دوره‌ای' },
  { id: 'body', name: 'دیسک، صفحه و بدنه' }
];

