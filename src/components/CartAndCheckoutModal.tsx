import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  Truck, 
  ArrowLeft,
  Printer,
  Smartphone
} from 'lucide-react';
import { OrderItem, Order } from '../types';

interface CartAndCheckoutModalProps {
  items: OrderItem[];
  onClose: () => void;
  onUpdateQuantity: (partId: string, quantity: number) => void;
  onRemoveItem: (partId: string) => void;
  onClearCart: () => void;
  onOrderCompleted: (order: Order) => void;
  onOpenInvoice: (order: Order) => void;
}

export const CartAndCheckoutModal: React.FC<CartAndCheckoutModalProps> = ({
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCompleted,
  onOpenInvoice
}) => {
  const [step, setStep] = useState<'cart' | 'shipping' | 'gateway' | 'success'>('cart');
  const [name, setName] = useState('مهندس علیرضا رحیم‌پور');
  const [phone, setPhone] = useState('09123456789');
  const [province, setProvince] = useState('تهران');
  const [address, setAddress] = useState('تهران، خیابان سهروردی شمالی، پلاک ۲۴، واحد ۶');
  const [note, setNote] = useState('');
  const [selectedGateway, setSelectedGateway] = useState<'zarinpal' | 'mellat' | 'sadad' | 'saman'>('zarinpal');
  
  // Gateway simulator inputs
  const [cardNumber, setCardNumber] = useState('6037-9975-8841-2093');
  const [cvv2, setCvv2] = useState('482');
  const [expMonth, setExpMonth] = useState('08');
  const [expYear, setExpYear] = useState('06');
  const [dynamicOtp, setDynamicOtp] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const totalRaw = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(totalRaw * 0.09);
  const shippingFee = totalRaw > 3000000 ? 0 : 85000;
  const grandTotal = totalRaw + tax + shippingFee;

  const handleRequestOtp = () => {
    setOtpSent(true);
    setDynamicOtp(String(Math.floor(100000 + Math.random() * 900000)));
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerAddress: `${province} - ${address}`,
          items,
          paymentMethod: 'online',
          gateway: selectedGateway
        })
      });

      const data = await response.json();
      if (data.success) {
        setCreatedOrder(data.order);
        onOrderCompleted(data.order);
        onClearCart();
        setStep('success');
      }
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Steps */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-black text-white">
              {step === 'cart' && 'سبد خرید قطعات خودرو'}
              {step === 'shipping' && 'اطلاعات تحویل و گیرنده'}
              {step === 'gateway' && 'درگاه پرداخت شاپرک'}
              {step === 'success' && 'پرداخت موفق و صدور فاکتور'}
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
          
          {/* STEP 1: CART ITEMS */}
          {step === 'cart' && (
            <div>
              {items.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-bold text-white">سبد خرید شما خالی است</h3>
                  <p className="text-xs text-slate-400">قطعه مورد نیاز خودروی خود را از ویترین یا جستجو انتخاب کنید.</p>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
                  >
                    بازگشت به فروشگاه
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="divide-y divide-slate-800 max-h-72 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.partId} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.partName}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 object-cover rounded-xl bg-slate-950 border border-slate-800 shrink-0"
                          />
                          <div>
                            <span className="text-[10px] font-mono text-amber-400 font-bold block">{item.oemCode}</span>
                            <h4 className="text-xs font-bold text-white line-clamp-1">{item.partName}</h4>
                            <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                              {item.price.toLocaleString('fa-IR')} تومان
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-slate-700 bg-slate-950 rounded-lg p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.partId, item.quantity + 1)}
                              className="p-1 hover:text-amber-400"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center font-mono font-bold text-xs">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.partId, item.quantity - 1)}
                              className="p-1 hover:text-amber-400"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.partId)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>جمع اقلام:</span>
                      <span className="font-mono">{totalRaw.toLocaleString('fa-IR')} تومان</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>مالیات بر ارزش افزوده (۹٪):</span>
                      <span className="font-mono">{tax.toLocaleString('fa-IR')} تومان</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>هزینه ارسال و بیمه مرسوله:</span>
                      <span className="font-mono">
                        {shippingFee === 0 ? <span className="text-emerald-400 font-bold">رایگان</span> : `${shippingFee.toLocaleString('fa-IR')} تومان`}
                      </span>
                    </div>
                    <div className="flex justify-between text-white font-black text-sm pt-2 border-t border-slate-800">
                      <span>مبلغ نهایی فاکتور:</span>
                      <span className="font-mono text-amber-400">{grandTotal.toLocaleString('fa-IR')} تومان</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('shipping')}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <span>ادامه و ثبت آدرس تحویل</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: SHIPPING & RECIPIENT */}
          {step === 'shipping' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">نام و نام خانوادگی تحویل‌گیرنده:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">شماره موبایل (جهت دریافت پیامک رهگیری):</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:border-amber-500 focus:outline-none"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">استان و شهر:</label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">آدرس دقیق پستی، کدپستی و پلاک:</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-500 focus:outline-none leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">توضیحات و یادداشت ویژه سفارش (اختیاری):</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="مثال: تحویل به نگهبانی یا تماس قبل از حرکت"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Gateway selection */}
              <div>
                <label className="block text-slate-400 font-bold mb-2">انتخاب درگاه پرداخت الکترونیکی امن:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'zarinpal', name: 'زرین‌پال شاپرک' },
                    { id: 'mellat', name: 'به‌پرداخت ملت' },
                    { id: 'sadad', name: 'سداد بانک ملی' },
                    { id: 'saman', name: 'سامان‌کیش' }
                  ].map(gw => (
                    <button
                      type="button"
                      key={gw.id}
                      onClick={() => setSelectedGateway(gw.id as any)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-colors ${
                        selectedGateway === gw.id
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {gw.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  بازگشت
                </button>
                <button
                  type="button"
                  onClick={() => setStep('gateway')}
                  className="w-2/3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>انتقال به درگاه امن ({grandTotal.toLocaleString('fa-IR')} تومان)</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT GATEWAY SIMULATOR */}
          {step === 'gateway' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-300">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>اتصال امن به سامانه پرداخت الکترونیک شاپرک (SSL 256-Bit)</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">{grandTotal.toLocaleString('fa-IR')} تومان</span>
              </div>

              <form onSubmit={handleProcessPayment} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">شماره کارت ۱۶ رقمی شتاب:</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono tracking-widest text-center focus:border-amber-500 focus:outline-none text-sm"
                    dir="ltr"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">کد CVV2:</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cvv2}
                      onChange={(e) => setCvv2(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-mono text-center focus:border-amber-500 focus:outline-none"
                      dir="ltr"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">ماه انقضا:</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={expMonth}
                      onChange={(e) => setExpMonth(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-mono text-center focus:border-amber-500 focus:outline-none"
                      dir="ltr"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">سال انقضا:</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={expYear}
                      onChange={(e) => setExpYear(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-mono text-center focus:border-amber-500 focus:outline-none"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-400 font-bold">رمز دوم یکبار مصرف (رمز پویا):</label>
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      className="text-amber-400 hover:underline font-bold text-[11px]"
                    >
                      {otpSent ? 'ارسال مجدد رمز' : 'دریافت رمز پویا'}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={dynamicOtp}
                      onChange={(e) => setDynamicOtp(e.target.value)}
                      placeholder="رمز دریافت شده در پیامک"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-center focus:border-amber-500 focus:outline-none"
                      dir="ltr"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
                    >
                      درخواست SMS
                    </button>
                  </div>
                  {otpSent && (
                    <span className="text-[10px] text-emerald-400 block mt-1">
                      رمز پویا به شماره همراه متصل به کارت ارسال گردید (کد شبیه‌سازی: {dynamicOtp})
                    </span>
                  )}
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isPaying}
                    className="w-2/3 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    {isPaying ? (
                      <span>در حال تایید تراکنش...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تایید پرداخت و تسویه حساب</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 4: SUCCESS & ONLINE INVOICE */}
          {step === 'success' && createdOrder && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-black text-white">سفارش شما با موفقیت ثبت و پرداخت گردید!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  پیامک تایید سفارش و کد رهگیری پستی به شماره <span className="font-mono text-amber-400">{createdOrder.customerPhone}</span> ارسال شد.
                </p>
              </div>

              {/* Order Info Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-right space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">کد رهگیری سفارش:</span>
                  <span className="font-mono font-black text-amber-400">{createdOrder.trackingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">کد مرسوله پست پیشتاز:</span>
                  <span className="font-mono text-slate-200">{createdOrder.postalCodeTracking}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">مبلغ پرداخت شده:</span>
                  <span className="font-mono font-bold text-emerald-400">{createdOrder.finalAmount.toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">وضعیت فعلی:</span>
                  <span className="font-semibold text-amber-400">ثبت شده - ارسال به انبار بسته‌بندی</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => onOpenInvoice(createdOrder)}
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>مشاهده و چاپ فاکتور آنلاین</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                >
                  بستن و ادامه خرید
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
