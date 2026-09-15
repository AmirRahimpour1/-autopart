import React from 'react';
import { Scale, Trash2, ShoppingCart, Check, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { Part } from '../types';

interface PartCompareViewProps {
  comparedParts: Part[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onAddToCart: (part: Part) => void;
  onNavigateToCatalog: () => void;
}

export const PartCompareView: React.FC<PartCompareViewProps> = ({
  comparedParts,
  onRemoveFromCompare,
  onClearCompare,
  onAddToCart,
  onNavigateToCatalog
}) => {
  if (comparedParts.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400 mb-6 shadow-xl">
          <Scale className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">لیست مقایسه فنی قطعات خالی است</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-8">
          شما می‌توانید از بخش کاتالوگ یا جزئیات هر قطعه، تا ۴ قطعه مختلف را برای مقایسه دقیق پارامترهای فنی، قیمت و اصالت انتخاب کنید.
        </p>
        <button
          onClick={onNavigateToCatalog}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all"
        >
          <span>مشاهده کاتالوگ و انتخاب قطعه</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>
    );
  }

  // Collect all unique technical spec keys
  const allSpecKeys: string[] = Array.from(
    new Set<string>(
      comparedParts.flatMap(p => Object.keys(p.technicalSpecs || {}))
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-black text-white">مقایسه فنی مشخصات قطعات یدکی</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            مقایسه رو در رو برای انتخاب دقیق‌ترین قطعه متناسب با استاندارد و بودجه شما ({comparedParts.length} کالا)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClearCompare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>پاک کردن همه</span>
          </button>
          <button
            onClick={onNavigateToCatalog}
            className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors"
          >
            افزودن قطعه دیگر
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto pb-6">
        <div className="min-w-[760px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Top Row: Part Summary & Purchase Actions */}
          <div className="grid grid-cols-12 divide-x divide-x-reverse divide-slate-800 border-b border-slate-800 bg-slate-950/60">
            <div className="col-span-3 p-5 flex flex-col justify-end">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">مشخصه اصلی</span>
            </div>
            {comparedParts.map((part) => (
              <div 
                key={part.id} 
                className={`p-5 flex flex-col justify-between ${
                  comparedParts.length === 2 ? 'col-span-4' :
                  comparedParts.length === 3 ? 'col-span-3' : 'col-span-2'
                }`}
              >
                <div className="relative mb-3">
                  <button
                    onClick={() => onRemoveFromCompare(part.id)}
                    className="absolute -top-1 -right-1 p-1 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
                    title="حذف از مقایسه"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <img
                    src={part.image}
                    alt={part.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-32 object-cover rounded-xl bg-slate-950 border border-slate-800"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 block mb-1">{part.oemCode}</span>
                  <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug mb-2">{part.name}</h3>
                  <div className="text-sm font-black text-amber-400 font-mono mb-3">
                    {part.price.toLocaleString('fa-IR')} <span className="text-[10px] text-slate-400">تومان</span>
                  </div>
                </div>

                <button
                  onClick={() => onAddToCart(part)}
                  disabled={part.inStock === 0}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    part.inStock > 0
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{part.inStock > 0 ? 'افزودن به سبد' : 'ناموجود'}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Standard Rows */}
          <div className="divide-y divide-slate-800/80 text-xs">
            
            {/* Brand */}
            <div className="grid grid-cols-12 divide-x divide-x-reverse divide-slate-800 py-3.5 px-5 items-center hover:bg-slate-800/30">
              <div className="col-span-3 font-bold text-slate-400">برند تجاری</div>
              {comparedParts.map(part => (
                <div key={part.id} className={`${comparedParts.length === 2 ? 'col-span-4' : comparedParts.length === 3 ? 'col-span-3' : 'col-span-2'} px-3 font-semibold text-slate-200`}>
                  {part.brand}
                </div>
              ))}
            </div>

            {/* Country */}
            <div className="grid grid-cols-12 divide-x divide-x-reverse divide-slate-800 py-3.5 px-5 items-center hover:bg-slate-800/30">
              <div className="col-span-3 font-bold text-slate-400">کشور مبدأ ساخت</div>
              {comparedParts.map(part => (
                <div key={part.id} className={`${comparedParts.length === 2 ? 'col-span-4' : comparedParts.length === 3 ? 'col-span-3' : 'col-span-2'} px-3 text-slate-300`}>
                  {part.countryOfOrigin}
                </div>
              ))}
            </div>

            {/* Warranty */}
            <div className="grid grid-cols-12 divide-x divide-x-reverse divide-slate-800 py-3.5 px-5 items-center hover:bg-slate-800/30">
              <div className="col-span-3 font-bold text-slate-400">گارانتی و ضمانت تعویض</div>
              {comparedParts.map(part => (
                <div key={part.id} className={`${comparedParts.length === 2 ? 'col-span-4' : comparedParts.length === 3 ? 'col-span-3' : 'col-span-2'} px-3 text-amber-400 font-bold flex items-center gap-1`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{part.warrantyMonths} ماه ضمانت</span>
                </div>
              ))}
            </div>

            {/* Stock status */}
            <div className="grid grid-cols-12 divide-x divide-x-reverse divide-slate-800 py-3.5 px-5 items-center hover:bg-slate-800/30">
              <div className="col-span-3 font-bold text-slate-400">وضعیت موجودی انبار</div>
              {comparedParts.map(part => (
                <div key={part.id} className={`${comparedParts.length === 2 ? 'col-span-4' : comparedParts.length === 3 ? 'col-span-3' : 'col-span-2'} px-3`}>
                  {part.inStock > 0 ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {part.inStock} عدد آماده ارسال
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <X className="w-3.5 h-3.5" /> ناموجود (ثبت هشدار)
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Compatible cars count */}
            <div className="grid grid-cols-12 divide-x divide-x-reverse divide-slate-800 py-3.5 px-5 items-center hover:bg-slate-800/30">
              <div className="col-span-3 font-bold text-slate-400">دامنه سازگاری خودرو</div>
              {comparedParts.map(part => (
                <div key={part.id} className={`${comparedParts.length === 2 ? 'col-span-4' : comparedParts.length === 3 ? 'col-span-3' : 'col-span-2'} px-3 text-slate-300 text-[11px]`}>
                  {part.compatibleCars.slice(0, 3).join('، ')}
                  {part.compatibleCars.length > 3 && ` و ${part.compatibleCars.length - 3} خودروی دیگر`}
                </div>
              ))}
            </div>

            {/* Dynamic Technical Specs */}
            {allSpecKeys.map((key) => (
              <div key={key} className="grid grid-cols-12 divide-x divide-x-reverse divide-slate-800 py-3.5 px-5 items-center hover:bg-slate-800/30">
                <div className="col-span-3 font-bold text-slate-400">{key}</div>
                {comparedParts.map(part => (
                  <div key={part.id} className={`${comparedParts.length === 2 ? 'col-span-4' : comparedParts.length === 3 ? 'col-span-3' : 'col-span-2'} px-3 text-slate-200 font-medium`}>
                    {part.technicalSpecs?.[key] || '—'}
                  </div>
                ))}
              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
};
