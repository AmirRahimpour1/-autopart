import React from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  Headphones, 
  Wrench, 
  CheckCircle2, 
  PhoneCall, 
  MapPin, 
  Mail,
  Award
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm mt-20">
      {/* 4 Pillars Trust Feature Cards */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">ضمانت ۱۰۰٪ اصالت کالا</h4>
                <p className="text-xs text-slate-400 mt-1">کلیه قطعات با هولوگرام شرکتی و کد رهگیری پیامکی</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">ارسال فوری و ردیابی SMS</h4>
                <p className="text-xs text-slate-400 mt-1">تحویل اکسپرس تهران و پست پیشتاز سراسری</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">۷ روز ضمانت بازگشت وجه</h4>
                <p className="text-xs text-slate-400 mt-1">امکان عودت قطعه در صورت عدم سازگاری فنی</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">مشاوره تخصصی و هوش مصنوعی</h4>
                <p className="text-xs text-slate-400 mt-1">پاسخگویی مکانیک‌های مجرب و دستیار هوشمند یدک‌پلاس</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white">یدک‌پلاس</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              سامانه هوشمند و مرجع تخصصی توزیع قطعات و لوازم یدکی اصلی انواع خودروهای داخلی و وارداتی. مجهز به موتور هوش مصنوعی تطبیق شماره شاسی، انبارداری مدرن و فاکتور رسمی مالیاتی.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium">
              <Award className="w-4 h-4" />
              <span>دارای نشان نماد اعتماد الکترونیکی و ستاد ساماندهی</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 border-r-2 border-amber-500 pr-2">دسته‌بندی‌های پرطرفدار</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-amber-400 transition-colors cursor-pointer">لنت و دیسک ترمز خودروهای ایرانی و چینی</li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer">کیت تسمه تایم و دینام اورجینال کنتیننتال</li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer">کمک فنر گازی و متعلقات جلوبندی ماندو</li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer">شمع‌های ایریدیوم پایه‌بلند و پایه‌کوتاه NGK</li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer">رادیاتور آب، بخاری و فن خنک‌کاری کوشش</li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer">دیسک و صفحه کلاچ والئو جعبه سبز فرانسه</li>
            </ul>
          </div>

          {/* Col 3: Customer Services */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 border-r-2 border-amber-500 pr-2">خدمات مشتریان و پیگیری</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-amber-400 transition-colors cursor-pointer">سامانه رهگیری آنلاین با کد مرسوله پستی</li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer">صدور فاکتور رسمی مالیاتی با ارزش افزوده</li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer">ثبت و رسیدگی به شکایات کاربران</li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer">درخواست اطلاع‌رسانی پیامکی موجودی کالا</li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer">راهنمای تطبیق قطعه با شماره شاسی VIN</li>
            </ul>
          </div>

          {/* Col 4: Contact & Support */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm mb-4 border-r-2 border-amber-500 pr-2">ارتباط با پشتیبانی</h4>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
              <span>شماره تماس پشتیبانی: ۰۲۱-۸۸۴۵۰۰۹۹</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>ایمیل: support@yadakplus.ir</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>تهران، خیابان امیرکبیر (چراغ برق)، مجتمع تجاری بهاران، طبقه اول، واحد ۲۱</span>
            </div>
            <div className="pt-2">
              <div className="text-[11px] text-slate-500">ساعت پاسخگویی حضوری و تلفنی:</div>
              <div className="text-xs text-slate-300 font-semibold mt-0.5">شنبه تا چهارشنبه ۹ الی ۱۹ | پنجشنبه‌ها ۹ الی ۱۴</div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} سامانه یدک‌پلاس - کلیه حقوق مادی و معنوی برای فروشگاه محفوظ است.</p>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400">شاپرک تایید شده</span>
            <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400">رمزنگاری SSL 256-Bit</span>
            <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400">پست پیشتاز</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
