import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  Scale, 
  ShoppingCart, 
  Bell, 
  Share2, 
  Car, 
  Wrench,
  ThumbsUp,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';
import { Part, Review } from '../types';

interface ProductDetailModalProps {
  part: Part | null;
  onClose: () => void;
  onAddToCart: (part: Part) => void;
  onToggleCompare: (part: Part) => void;
  isCompared: boolean;
  onSubscribeStockAlert: (partId: string, phone: string) => Promise<string>;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  part,
  onClose,
  onAddToCart,
  onToggleCompare,
  isCompared,
  onSubscribeStockAlert
}) => {
  if (!part) return null;

  const [activeTab, setActiveTab] = useState<'specs' | 'compatibility' | 'reviews'>('specs');
  const [stockAlertPhone, setStockAlertPhone] = useState('');
  const [stockAlertLoading, setStockAlertLoading] = useState(false);
  const [stockAlertSuccess, setStockAlertSuccess] = useState<string | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'r1',
      partId: part.id,
      author: 'رضا مرادی (مکانیک و تیونر)',
      carModel: part.compatibleCars[0] || 'پژو 206',
      rating: 5,
      date: '۱۴۰۳/۰۶/۱۸',
      comment: 'کیفیت قطعه فوق‌العاده است. از بسته‌بندی پلمپ و هولوگرام مشخص بود که کاملاً اورجینال هست. بعد از نصب هیچ صدای اضافی یا لرزشی مشاهده نشد.',
      isVerifiedBuyer: true
    },
    {
      id: 'r2',
      partId: part.id,
      author: 'امیرحسین عباسی',
      carModel: part.compatibleCars[1] || 'دنا پلاس',
      rating: 4,
      date: '۱۴۰۳/۰۶/۱۰',
      comment: 'به موقع به دستم رسید. ارسال با تیپاکس سریع بود و فاکتور آنلاین هم صادر شده بود. فقط ای کاش دفترچه راهنمای فارسی هم در جعبه بود.',
      isVerifiedBuyer: true
    }
  ]);

  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCar, setNewReviewCar] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleStockAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockAlertPhone || stockAlertPhone.length < 10) return;
    setStockAlertLoading(true);
    const msg = await onSubscribeStockAlert(part.id, stockAlertPhone);
    setStockAlertLoading(false);
    setStockAlertSuccess(msg);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewComment) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      partId: part.id,
      author: newReviewAuthor,
      carModel: newReviewCar || part.compatibleCars[0] || 'خودروی عمومی',
      rating: newReviewRating,
      date: 'امروز',
      comment: newReviewComment,
      isVerifiedBuyer: true
    };

    setReviews([newRev, ...reviews]);
    setNewReviewAuthor('');
    setNewReviewCar('');
    setNewReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const discountPercent = part.originalPrice 
    ? Math.round(((part.originalPrice - part.price) / part.originalPrice) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">کد اختصاصی فنی:</span>
            <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
              {part.oemCode}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left/Top Image & Badges (md:col-span-5) */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-square flex items-center justify-center group">
                <img 
                  src={part.image} 
                  alt={part.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                {discountPercent > 0 && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-lg">
                    %{discountPercent} تخفیف ویژه
                  </div>
                )}
                {part.isOriginal && (
                  <div className="absolute bottom-3 right-3 bg-emerald-900/90 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ضمانت اصالت ۱۰۰٪</span>
                  </div>
                )}
              </div>

              {/* Quick specs pill chips */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                  <div className="text-[10px] text-slate-500">برند تولیدکننده:</div>
                  <div className="font-bold text-slate-200 mt-0.5 truncate">{part.brand}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                  <div className="text-[10px] text-slate-500">کشور سازنده:</div>
                  <div className="font-bold text-slate-200 mt-0.5">{part.countryOfOrigin}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                  <div className="text-[10px] text-slate-500">مدت گارانتی:</div>
                  <div className="font-bold text-amber-400 mt-0.5">{part.warrantyMonths} ماه ضمانت شرکتی</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                  <div className="text-[10px] text-slate-500">موجودی انبار:</div>
                  <div className={`font-bold mt-0.5 ${part.inStock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {part.inStock > 0 ? `${part.inStock} عدد آماده ارسال` : 'ناموجود (در حال سفارش)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right details & action (md:col-span-7) */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                    {part.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold font-mono">{part.rating}</span>
                    <span className="text-slate-500 text-[11px]">({part.reviewsCount} نظر)</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {part.name}
                </h2>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {part.description}
                </p>

                {/* Pricing Box */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">قیمت با احتساب تخفیف:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-amber-400 font-mono">
                        {part.price.toLocaleString('fa-IR')}
                      </span>
                      <span className="text-xs text-slate-400">تومان</span>
                    </div>
                  </div>
                  {part.originalPrice && part.originalPrice > part.price && (
                    <div className="text-left">
                      <span className="text-xs line-through text-slate-500 font-mono block">
                        {part.originalPrice.toLocaleString('fa-IR')} تومان
                      </span>
                      <span className="text-xs text-emerald-400 font-bold">
                        سود شما: {(part.originalPrice - part.price).toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  )}
                </div>

                {/* Primary Actions */}
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-2.5">
                  {part.inStock > 0 ? (
                    <button
                      onClick={() => {
                        onAddToCart(part);
                      }}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>افزودن به سبد خرید و صدور فاکتور</span>
                    </button>
                  ) : (
                    <div className="w-full p-3 rounded-xl bg-rose-950/40 border border-rose-800/60">
                      <div className="flex items-center gap-2 text-rose-300 text-xs font-bold mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>این کالا در حال حاضر ناموجود است. با ثبت شماره تماس، به محض موجود شدن با پیامک مطلع شوید:</span>
                      </div>
                      {stockAlertSuccess ? (
                        <div className="text-xs text-emerald-400 font-bold bg-emerald-950/60 p-2 rounded-lg">
                          {stockAlertSuccess}
                        </div>
                      ) : (
                        <form onSubmit={handleStockAlertSubmit} className="flex gap-2">
                          <input
                            type="tel"
                            placeholder="شماره موبایل (مثلا 09123456789)"
                            value={stockAlertPhone}
                            onChange={(e) => setStockAlertPhone(e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                            dir="ltr"
                          />
                          <button
                            type="submit"
                            disabled={stockAlertLoading}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 shrink-0"
                          >
                            <Bell className="w-3.5 h-3.5" />
                            <span>خبرم کن</span>
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => onToggleCompare(part)}
                    className={`w-full sm:w-auto py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      isCompared
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Scale className="w-4 h-4" />
                    <span>{isCompared ? 'حذف از مقایسه' : 'افزودن به مقایسه'}</span>
                  </button>
                </div>
              </div>

              {/* Trust micro-banner */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  تحویل ۳ ساعته در تهران
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  امکان عودت تا ۷ روز
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  تضمین تطبیق شاسی
                </span>
              </div>
            </div>

          </div>

          {/* Tabbed Content: Specs / Compatibility / Reviews */}
          <div className="mt-8 border-t border-slate-800 pt-6">
            <div className="flex border-b border-slate-800 gap-6 text-sm font-bold">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'specs' 
                    ? 'border-amber-500 text-amber-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>مشخصات فنی و استانداردها</span>
              </button>

              <button
                onClick={() => setActiveTab('compatibility')}
                className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'compatibility' 
                    ? 'border-amber-500 text-amber-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>خودروهای سازگار ({part.compatibleCars.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'reviews' 
                    ? 'border-amber-500 text-amber-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>نظرات و تجربیات خریداران ({reviews.length})</span>
              </button>
            </div>

            {/* TAB 1: Specs */}
            {activeTab === 'specs' && (
              <div className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(part.technicalSpecs || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                      <span className="text-slate-400">{key}</span>
                      <span className="font-semibold text-slate-200">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Compatibility */}
            {activeTab === 'compatibility' && (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-slate-400">
                  این قطعه توسط مهندسین فنی یدک‌پلاس بر روی خودروهای زیر تست شده و ۱۰۰٪ ضمانت نصب بدون دستکاری دارد:
                </p>
                <div className="flex flex-wrap gap-2">
                  {part.compatibleCars.map((car, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
                    >
                      <Car className="w-3.5 h-3.5 text-amber-400" />
                      {car}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Reviews */}
            {activeTab === 'reviews' && (
              <div className="mt-4 space-y-6">
                
                {/* Submit review form */}
                <form onSubmit={handleAddReview} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    ثبت نظر و تجربه استفاده از این قطعه
                  </h4>
                  {reviewSubmitted && (
                    <div className="p-2.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs">
                      نظر شما با موفقیت ثبت شد و پس از بررسی تایید گردید.
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">نام و نام خانوادگی:</label>
                      <input 
                        type="text"
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder="مثال: علی رضایی"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">مدل خودروی شما:</label>
                      <input 
                        type="text"
                        value={newReviewCar}
                        onChange={(e) => setNewReviewCar(e.target.value)}
                        placeholder="مثال: پژو ۲۰۶ تیپ ۵"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">امتیاز شما:</label>
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (عالی - ۵ از ۵)</option>
                        <option value={4}>⭐⭐⭐⭐ (خوب - ۴ از ۵)</option>
                        <option value={3}>⭐⭐⭐ (متوسط - ۳ از ۵)</option>
                        <option value={2}>⭐⭐ (ضعیف - ۲ از ۵)</option>
                        <option value={1}>⭐ (خیلی ضعیف - ۱ از ۵)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 text-xs">متن نظر و تجربه فنی:</label>
                    <textarea 
                      rows={2}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="کیفیت ترمزگیری، نرمی، دوام و شرایط نصب قطعه را بنویسید..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                  >
                    ارسال نظر
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{rev.author}</span>
                          {rev.isVerifiedBuyer && (
                            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.2 rounded-full font-medium">
                              خریدار تایید شده
                            </span>
                          )}
                          <span className="text-slate-500">| خودرو: {rev.carModel}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                          <span className="text-slate-500 text-[11px] mr-2">{rev.date}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
