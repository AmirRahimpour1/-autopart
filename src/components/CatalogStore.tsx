import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Car, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  Scale, 
  ShoppingCart, 
  Eye, 
  ShieldCheck, 
  Sparkles, 
  Wrench, 
  X,
  SlidersHorizontal,
  Flame,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Part, SelectedVehicle } from '../types';
import { POPULAR_CAR_BRANDS, PART_CATEGORIES } from '../data/cars';

interface CatalogStoreProps {
  parts: Part[];
  selectedVehicle: SelectedVehicle;
  onClearVehicleFilter: () => void;
  onSelectPart: (part: Part) => void;
  onAddToCart: (part: Part) => void;
  onToggleCompare: (part: Part) => void;
  comparedPartIds: string[];
  onNavigateToAi: () => void;
  onNavigateToCompare: () => void;
}

const defaultVehicle: SelectedVehicle = { brand: '', model: '' };

export const CatalogStore: React.FC<CatalogStoreProps> = ({
  parts = [],
  selectedVehicle = defaultVehicle,
  onClearVehicleFilter,
  onSelectPart,
  onAddToCart,
  onToggleCompare,
  comparedPartIds = [],
  onNavigateToAi,
  onNavigateToCompare
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOriginal, setOnlyOriginal] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'priceDesc' | 'discount'>('popular');

  // Filter parts logic
  const filteredParts = useMemo(() => {
    return (parts || []).filter(part => {
      // 1. Vehicle filter
      if (selectedVehicle.brand || selectedVehicle.model) {
        const matchesCar = part.compatibleCars.some(c => {
          if (selectedVehicle.model && c.includes(selectedVehicle.model)) return true;
          if (selectedVehicle.brand && (c.includes(selectedVehicle.brand) || (selectedVehicle.brand.includes('ایران خودرو') && (c.includes('پژو') || c.includes('دنا') || c.includes('سمند') || c.includes('تارا'))))) return true;
          return false;
        });
        if (!matchesCar) return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all' && part.category !== selectedCategory) {
        return false;
      }

      // 3. Stock filter
      if (onlyInStock && part.inStock <= 0) {
        return false;
      }

      // 4. Original only
      if (onlyOriginal && !part.isOriginal) {
        return false;
      }

      // 5. Search query (search name, oem, brand, cars)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = part.name.toLowerCase().includes(q);
        const matchesOem = part.oemCode.toLowerCase().includes(q);
        const matchesBrand = part.brand.toLowerCase().includes(q);
        const matchesCar = part.compatibleCars.some(c => c.toLowerCase().includes(q));
        if (!matchesName && !matchesOem && !matchesBrand && !matchesCar) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'discount') {
        const discA = a.originalPrice ? a.originalPrice - a.price : 0;
        const discB = b.originalPrice ? b.originalPrice - b.price : 0;
        return discB - discA;
      }
      return b.rating - a.rating; // default popular
    });
  }, [parts, selectedVehicle, selectedCategory, onlyInStock, onlyOriginal, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Promotional & AI Advisor Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5" />
            <span>بزرگترین انبار قطعات یدکی شرکتی با هولوگرام اصالت</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            تامین فوری قطعات اصلی خودرو با <span className="text-amber-400">هوش مصنوعی</span> و تطبیق شماره شاسی
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            جستجوی دقیق قطعات استاندارد خودروهای ایرانی و وارداتی، صدور فاکتور رسمی مالیاتی، ارسال فوق سریع با رهگیری پیامکی و ضمانت ۱۰۰٪ اصالت فیزیکی کالا.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onNavigateToAi}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>دستیار هوش مصنوعی عیب‌یابی خودرو</span>
            </button>

            {comparedPartIds.length > 0 && (
              <button
                onClick={onNavigateToCompare}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Scale className="w-4 h-4" />
                <span>مشاهده مقایسه فنی ({comparedPartIds.length} قطعه)</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative ambient badge */}
        <div className="hidden lg:block absolute left-10 top-1/2 -translate-y-1/2">
          <div className="grid grid-cols-2 gap-3 w-72 text-center text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-xl font-black text-amber-400 font-mono">+۱۰,۰۰۰</div>
              <div className="text-[11px] text-slate-400 mt-1">قطعه فیزیکی در انبار</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-xl font-black text-emerald-400 font-mono">۱۰۰٪</div>
              <div className="text-[11px] text-slate-400 mt-1">تضمین اصالت کالا</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-xl font-black text-white font-mono">۳ ساعته</div>
              <div className="text-[11px] text-slate-400 mt-1">ارسال اکسپرس تهران</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-xl font-black text-cyan-400 font-mono">۲۴/۷</div>
              <div className="text-[11px] text-slate-400 mt-1">پاسخگویی مکانیک آنلاین</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Filter Active Chip Banner */}
      {(selectedVehicle.brand || selectedVehicle.model) && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400">فیلتر فعال قطعات متناسب با خودروی شما:</span>
              <span className="font-black text-white mr-2 text-sm">
                {selectedVehicle.brand} {selectedVehicle.model && `- ${selectedVehicle.model}`} {selectedVehicle.engine && `(${selectedVehicle.engine})`}
              </span>
            </div>
          </div>

          <button
            onClick={onClearVehicleFilter}
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-rose-400 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-900 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>حذف فیلتر خودرو</span>
          </button>
        </div>
      )}

      {/* Main Filter & Search Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        
        {/* Row 1: Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی نام قطعه، کد فنی OEM، برند یا خودروی هدف..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl py-3 pr-11 pl-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3.5 top-3.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-bold whitespace-nowrap">مرتب‌سازی:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:border-amber-500 focus:outline-none cursor-pointer"
            >
              <option value="popular">محبوب‌ترین و امتیاز خریداران</option>
              <option value="priceAsc">ارزان‌ترین قیمت</option>
              <option value="priceDesc">گران‌ترین قیمت</option>
              <option value="discount">بیشترین درصد تخفیف</option>
            </select>
          </div>
        </div>

        {/* Row 2: Categories chips */}
        <div className="flex overflow-x-auto gap-2 pb-2 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            همه قطعات ({parts.length})
          </button>

          {PART_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Row 3: Quick Toggles */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800/80 text-xs">
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500 accent-amber-500"
            />
            <span>فقط کالاهای موجود در انبار</span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyOriginal}
              onChange={(e) => setOnlyOriginal(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500 accent-amber-500"
            />
            <span>فقط قطعات با گارانتی اصالت اورجینال</span>
          </label>

          <span className="text-slate-500 mr-auto text-[11px]">
            نمایش <span className="font-bold text-white font-mono">{filteredParts.length}</span> قطعه
          </span>
        </div>

      </div>

      {/* Parts Product Grid */}
      {filteredParts.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white">قطعه‌ای مطابق با این فیلترها یافت نشد</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            لطفاً عبارت جستجو یا فیلتر دسته‌بندی را تغییر دهید یا از دستیار هوش مصنوعی برای پیدا کردن کد معادل کمک بگیرید.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setOnlyInStock(false);
              setOnlyOriginal(false);
              onClearVehicleFilter();
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            پاک کردن تمام فیلترها
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredParts.map((part) => {
            const isCompared = comparedPartIds.includes(part.id);
            const discountPercent = part.originalPrice 
              ? Math.round(((part.originalPrice - part.price) / part.originalPrice) * 100) 
              : 0;

            return (
              <div
                key={part.id}
                className="group bg-slate-900 border border-slate-800/90 hover:border-amber-500/40 rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5"
              >
                <div>
                  {/* Image container */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video mb-3.5 border border-slate-800/80 flex items-center justify-center">
                    <img
                      src={part.image}
                      alt={part.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* OEM Code tag */}
                    <span className="absolute top-2.5 right-2.5 font-mono text-[10px] font-black px-2 py-0.5 rounded-lg bg-slate-950/80 text-amber-400 border border-slate-700/80 backdrop-blur-sm">
                      {part.oemCode}
                    </span>

                    {/* Discount badge */}
                    {discountPercent > 0 && (
                      <span className="absolute top-2.5 left-2.5 bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-md">
                        %{discountPercent}
                      </span>
                    )}

                    {/* Stock Status Badge */}
                    {part.inStock === 0 && (
                      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="px-3 py-1 bg-rose-600 text-white font-bold text-xs rounded-full shadow-lg">
                          ناموجود در انبار
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Brand & Category row */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span className="font-bold text-slate-300">{part.brand}</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-mono font-bold">{part.rating}</span>
                      <span className="text-slate-500 text-[10px]">({part.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 
                    onClick={() => onSelectPart(part)}
                    className="text-xs font-bold text-white line-clamp-2 leading-relaxed cursor-pointer hover:text-amber-400 transition-colors mb-2"
                  >
                    {part.name}
                  </h3>

                  {/* Vehicle Compatibility Preview */}
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-3 truncate">
                    <Car className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">سازگار: {part.compatibleCars.slice(0, 2).join('، ')}</span>
                  </div>
                </div>

                {/* Bottom Pricing & Actions */}
                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400">قیمت:</span>
                      <div className="text-base font-black text-amber-400 font-mono">
                        {part.price.toLocaleString('fa-IR')} <span className="text-[10px] text-slate-400 font-normal">تومان</span>
                      </div>
                    </div>

                    {part.originalPrice && part.originalPrice > part.price && (
                      <span className="text-[11px] line-through text-slate-500 font-mono">
                        {part.originalPrice.toLocaleString('fa-IR')}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-12 gap-1.5">
                    <button
                      onClick={() => onAddToCart(part)}
                      disabled={part.inStock === 0}
                      className={`col-span-8 py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        part.inStock > 0
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10 active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{part.inStock > 0 ? 'افزودن به سبد' : 'ناموجود'}</span>
                    </button>

                    <button
                      onClick={() => onToggleCompare(part)}
                      className={`col-span-2 py-2 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                        isCompared 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                      title={isCompared ? 'حذف از مقایسه' : 'افزودن به مقایسه فنی'}
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onSelectPart(part)}
                      className="col-span-2 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                      title="مشاهده جزئیات و مشخصات فنی"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
