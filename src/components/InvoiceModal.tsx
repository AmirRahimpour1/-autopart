import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import { Order } from '../types';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Actions */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">صورت‌حساب رسمی و فاکتور فروش آنلاین</span>
            <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
              {order.trackingCode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>چاپ / ذخیره PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Invoice Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          <div id="printable-invoice" className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm text-xs font-['Vazirmatn',sans-serif]">
            
            {/* Header / Brand */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-4">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-950">فروشگاه مرکزی قطعات خودرو یدک‌پلاس</h2>
                <p className="text-[11px] text-slate-600">صورت‌حساب الکترونیکی فروش کالا و خدمات (فاکتور رسمی)</p>
                <div className="text-[10px] text-slate-500">شماره ثبت: ۵۸۴۲۱۰ | شناسه ملی: ۱۰۱۰۳۹۲۸۱۷۴ | کد اقتصادی: ۴۱۱۵-۸۹۲۳</div>
              </div>
              <div className="text-left space-y-1">
                <div><span className="font-bold">شماره فاکتور:</span> <span className="font-mono font-bold">{order.trackingCode}</span></div>
                <div><span className="font-bold">تاریخ صدور:</span> <span className="font-mono">{order.createdAt}</span></div>
                <div><span className="font-bold">کد رهگیری پستی:</span> <span className="font-mono">{order.postalCodeTracking || "در انتظار ارسال"}</span></div>
              </div>
            </div>

            {/* Parties Info Grid */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-[11px]">
              <div>
                <span className="font-bold text-slate-900 block mb-1">مشخصات خریدار:</span>
                <div>نام: <span className="font-semibold text-slate-800">{order.customerName}</span></div>
                <div>شماره تماس: <span className="font-mono">{order.customerPhone}</span></div>
                <div className="truncate">نشانی: {order.customerAddress}</div>
              </div>
              <div>
                <span className="font-bold text-slate-900 block mb-1">روش پرداخت و تسویه:</span>
                <div>نوع پرداخت: <span className="font-semibold text-slate-800">درگاه پرداخت الکترونیکی شاپرک (شتاب)</span></div>
                <div>وضعیت: <span className="font-bold text-emerald-700">پرداخت با موفقیت انجام شد</span></div>
                <div>وضعیت سفارش: <span className="font-semibold">{order.orderStatus === 'delivered' ? 'تحویل شده' : order.orderStatus === 'shipped' ? 'ارسال شده' : 'در حال پردازش'}</span></div>
              </div>
            </div>

            {/* Table of Items */}
            <table className="w-full border-collapse border border-slate-300 text-right mb-6 text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-bold">
                  <th className="border border-slate-300 p-2 text-center w-8">ردیف</th>
                  <th className="border border-slate-300 p-2">شرح کالا / خدمات</th>
                  <th className="border border-slate-300 p-2 text-center">کد فنی (OEM)</th>
                  <th className="border border-slate-300 p-2 text-center w-14">تعداد</th>
                  <th className="border border-slate-300 p-2 text-left">مبلغ واحد (تومان)</th>
                  <th className="border border-slate-300 p-2 text-left">مبلغ کل (تومان)</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="border border-slate-300 p-2 text-center font-mono">{idx + 1}</td>
                    <td className="border border-slate-300 p-2 font-medium">{item.partName}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono text-slate-600">{item.oemCode}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono font-bold">{item.quantity}</td>
                    <td className="border border-slate-300 p-2 text-left font-mono">{item.price.toLocaleString('fa-IR')}</td>
                    <td className="border border-slate-300 p-2 text-left font-mono font-bold">{(item.price * item.quantity).toLocaleString('fa-IR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations & Totals */}
            <div className="flex justify-between items-start gap-6 border-t border-slate-300 pt-4">
              <div className="text-[10px] text-slate-500 max-w-sm space-y-1">
                <p>• این صورت‌حساب به صورت مکانیزه توسط سامانه ابری یدک‌پلاس صادر شده و دارای اعتبار قانونی جهت ارائه به شرکت‌های بیمه و مراجع مالیاتی می‌باشد.</p>
                <p>• قطعات دارای هولوگرام شرکتی و ضمانت اصالت ۱۰۰٪ فیزیکی هستند.</p>
              </div>

              <div className="w-64 space-y-1.5 text-xs text-slate-800">
                <div className="flex justify-between">
                  <span>جمع کل اقلام:</span>
                  <span className="font-mono">{order.totalAmount.toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>مالیات بر ارزش افزوده (۹٪):</span>
                  <span className="font-mono">{order.taxAmount.toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>هزینه بسته‌بندی و ارسال:</span>
                  <span className="font-mono">{order.shippingFee.toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-950 border-t-2 border-slate-900 pt-2">
                  <span>مبلغ قابل پرداخت:</span>
                  <span className="font-mono text-emerald-700">{order.finalAmount.toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="mt-8 pt-4 border-t border-dashed border-slate-300 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 border border-slate-300 rounded flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-slate-700" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">تاییدیه پرداخت شاپرک</div>
                  <div className="text-[9px]">کد امنیتی: {order.trackingCode}-OK</div>
                </div>
              </div>

              <div className="text-center">
                <div className="font-bold text-slate-800">امضا و مهر دیجیتال فروشنده:</div>
                <div className="mt-1 text-[10px] text-emerald-600 font-bold border border-emerald-500/50 px-2 py-0.5 rounded">
                  تایید شده توسط خزانه یدک‌پلاس
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
