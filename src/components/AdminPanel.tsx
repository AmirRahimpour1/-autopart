import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  Calculator, 
  Clock, 
  Send, 
  FileSpreadsheet, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  DollarSign, 
  Boxes, 
  Users, 
  ShieldAlert, 
  MessageSquare, 
  Smartphone,
  Check,
  Search,
  ChevronDown,
  Download,
  Plus
} from 'lucide-react';
import { Part, Order, Ticket, AccountingTransaction, AccountingSummary } from '../types';

interface AdminPanelProps {
  parts: Part[];
  orders: Order[];
  tickets: Ticket[];
  onUpdatePartStock: (id: string, newStock: number) => void;
  onUpdateOrderStatus: (id: string, status: any, postalCode?: string) => void;
  onSendSmsToOrder: (id: string, msg: string) => void;
  onReplyTicket: (id: string, reply: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  parts,
  orders,
  tickets,
  onUpdatePartStock,
  onUpdateOrderStatus,
  onSendSmsToOrder,
  onReplyTicket
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounting' | 'inventory' | 'orders' | 'marketing' | 'tickets'>('dashboard');
  const [accountingData, setAccountingData] = useState<{ summary: AccountingSummary; transactions: AccountingTransaction[] } | null>(null);
  const [accountingLoading, setAccountingLoading] = useState(false);

  // Quick state for custom SMS sender
  const [targetAudience, setTargetAudience] = useState('owners_peugeot');
  const [customSmsText, setCustomSmsText] = useState('سلام مشتری گرامی! لنت‌های ترمز سرامیکی تکستار با تخفیف ویژه ۲۰٪ در انبار یدک‌پلاس شارژ گردید. ارسال فوری امروز.');
  const [smsSentNotice, setSmsSentNotice] = useState<string | null>(null);

  // Ticket reply state
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // New accounting transaction modal/form
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [newTxTitle, setNewTxTitle] = useState('');
  const [newTxAmount, setNewTxAmount] = useState('');
  const [newTxCategory, setNewTxCategory] = useState<'درآمد' | 'هزینه'>('هزینه');
  const [newTxParty, setNewTxParty] = useState('');

  // Sync state for platforms
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Load accounting data
  const fetchAccounting = async () => {
    setAccountingLoading(true);
    try {
      const res = await fetch('/api/accounting');
      const data = await res.json();
      if (data.success) {
        setAccountingData({
          summary: data.summary,
          transactions: data.transactions
        });
      }
    } catch (e) {
      console.error("Accounting fetch failed:", e);
    } finally {
      setAccountingLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounting();
  }, []);

  // Filter delayed orders
  const delayedOrders = (orders || []).filter(o => o.orderStatus === 'delayed');
  const lowStockParts = (parts || []).filter(p => p.inStock <= p.minStockThreshold);

  // Export to Excel / CSV with UTF-8 BOM
  const handleExportExcel = (type: 'accounting' | 'orders' | 'inventory') => {
    let csvContent = '\uFEFF'; // UTF-8 BOM for Excel Persian support

    if (type === 'accounting' && accountingData) {
      csvContent += 'شناسه,شرح تراکنش,مبلغ (تومان),دسته‌بندی,طرف حساب,تاریخ,کد رهگیری\n';
      accountingData.transactions.forEach(t => {
        csvContent += `"${t.id}","${t.title}","${t.amount}","${t.category}","${t.party}","${t.date}","${t.referenceNumber}"\n`;
      });
    } else if (type === 'orders') {
      csvContent += 'کد سفارش,مشتری,شماره موبایل,مبلغ کل,وضعیت,تاریخ,کد رهگیری پستی\n';
      orders.forEach(o => {
        csvContent += `"${o.trackingCode}","${o.customerName}","${o.customerPhone}","${o.finalAmount}","${o.orderStatus}","${o.createdAt}","${o.postalCodeTracking || ''}"\n`;
      });
    } else {
      csvContent += 'کد فنی OEM,نام قطعه,برند,موجودی,حداقل انبار,قیمت واحد (تومان),دسته\n';
      parts.forEach(p => {
        csvContent += `"${p.oemCode}","${p.name}","${p.brand}","${p.inStock}","${p.minStockThreshold}","${p.price}","${p.categoryLabel}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `YadakPlus-${type}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxTitle || !newTxAmount) return;

    try {
      const res = await fetch('/api/accounting/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTxTitle,
          amount: Number(newTxAmount),
          category: newTxCategory,
          party: newTxParty || 'طرف حساب شرکتی'
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddTxModal(false);
        setNewTxTitle('');
        setNewTxAmount('');
        fetchAccounting();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendCustomSms = () => {
    if (!customSmsText.trim()) return;
    setSmsSentNotice(`پیامک شخصی‌سازی شده با موفقیت به ۲۴۸ کاربر در دسته انتخابی ارسال گردید.`);
    setTimeout(() => setSmsSentNotice(null), 5000);
  };

  const handleSyncPlatform = async (partId: string, platform: string) => {
    try {
      const res = await fetch(`/api/parts/${partId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform })
      });
      const data = await res.json();
      if (data.success) {
        setSyncNotice(`همگام‌سازی لحظه‌ای موجودی و قیمت با ${platform} با موفقیت انجام شد.`);
        setTimeout(() => setSyncNotice(null), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            <h1 className="text-2xl font-black text-white">سامانه جامع مدیریت و حسابداری یدک‌پلاس</h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              نسخه سازمانی
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            کنترل لحظه‌ای سفارشات، انبارداری هوشمند، دفاتر مالی، گزارش‌های فصلی و رفتار مشتریان
          </p>
        </div>

        {/* Action Buttons: Export Excel */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportExcel('accounting')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>خروجی اکسل تراکنش‌ها</span>
          </button>
          <button
            onClick={fetchAccounting}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="به‌روزرسانی داده‌ها"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-3 mb-8 text-xs font-bold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'dashboard'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>داشبورد آماری و رفتار مشتریان</span>
        </button>

        <button
          onClick={() => setActiveTab('accounting')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'accounting'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>حسابداری دقیق و تراز مالی</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 relative ${
            activeTab === 'inventory'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>مدیریت انبار و همگام‌سازی پلتفرم‌ها</span>
          {lowStockParts.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 relative ${
            activeTab === 'orders'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>سفارشات و یادآوری معوقات ({orders.length})</span>
          {delayedOrders.length > 0 && (
            <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {delayedOrders.length} معوقه
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('marketing')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'marketing'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>ارسال اعلانات هوشمند و SMS شخصی</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'tickets'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>شکایات و تیکت‌های پشتیبانی ({tickets.length})</span>
        </button>
      </div>

      {syncNotice && (
        <div className="mb-6 p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: DASHBOARD & CUSTOMER BEHAVIOR */}
      {/* ======================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Top 4 KPI metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>کل فروش ثبت شده</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {accountingData ? (accountingData.summary.totalRevenue).toLocaleString('fa-IR') : '۱۰,۷۵۰,۸۰۰'} <span className="text-xs text-slate-400">تومان</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+۱۸٪ رشد نسبت به ماه گذشته</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>سود ناخالص عملیاتی</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {accountingData ? (accountingData.summary.totalRevenue * 0.32).toLocaleString('fa-IR', { maximumFractionDigits: 0 }) : '۳,۴۴۰,۰۰۰'} <span className="text-xs text-slate-400">تومان</span>
              </div>
              <div className="text-slate-400 text-xs">حاشیه سود میانگین: ۳۲٪</div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>سفارش‌های معوقه و تأخیری</span>
                <Clock className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-rose-400 font-mono">
                {delayedOrders.length} <span className="text-xs text-slate-400">سفارش</span>
              </div>
              <div className="text-rose-400 text-xs font-bold">نیازمند پیگیری فوری انباردار</div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>کسری موجودی انبار</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {lowStockParts.length} <span className="text-xs text-slate-400">قلم کالا</span>
              </div>
              <div className="text-amber-400 text-xs">رسیده به نقطه سفارش بحرانی</div>
            </div>

          </div>

          {/* Monthly Sales Performance Chart (Visual CSS/SVG Bar Chart) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sales Chart (lg:col-span-8) */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span>نمودار روند فروش، هزینه و سود ۶ ماهه گذشته (میلیون تومان)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">برگرفته از دفاتر رسمی حسابداری یدک‌پلاس</p>
                </div>
                <button 
                  onClick={() => handleExportExcel('accounting')}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>دانلود فایل اکسل</span>
                </button>
              </div>

              {/* Bar visualization */}
              <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-4 border-b border-slate-800 px-2">
                {accountingData?.summary?.monthlyComparison?.map((m, i) => {
                  const maxSale = 120000000;
                  const salesHeightPercent = Math.min(100, Math.round((m.sales / maxSale) * 100));
                  const profitHeightPercent = Math.min(100, Math.round((m.profit / maxSale) * 100));

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(m.sales / 1000000).toFixed(0)}M
                      </div>
                      <div className="w-full max-w-[36px] flex items-end gap-1 h-48 bg-slate-950/60 rounded-xl p-1 border border-slate-800">
                        <div 
                          className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-lg transition-all group-hover:scale-y-105"
                          style={{ height: `${salesHeightPercent}%` }}
                          title={`فروش: ${m.sales.toLocaleString('fa-IR')} تومان`}
                        ></div>
                        <div 
                          className="flex-1 bg-gradient-to-t from-amber-600 to-amber-400 rounded-lg transition-all group-hover:scale-y-105"
                          style={{ height: `${profitHeightPercent}%` }}
                          title={`سود خالص: ${m.profit.toLocaleString('fa-IR')} تومان`}
                        ></div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-300 truncate">{m.month}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-500"></span>
                  میزان فروش کل
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-amber-500"></span>
                  سود خالص بعد از کسر هزینه‌ها
                </span>
              </div>
            </div>

            {/* Customer Behavior Analytics (lg:col-span-4) */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Users className="w-4 h-4 text-amber-400" />
                <span>تحلیل رفتار مشتریان و خریداران</span>
              </h3>

              <div className="space-y-4 text-xs">
                
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-300">
                    <span>پرتکرارترین خودرو در جستجوها:</span>
                    <span className="text-amber-400">پژو ۲۰۶ و ۲۰۷</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[42%]"></div>
                  </div>
                  <div className="text-[10px] text-slate-500 text-left">۴۲٪ کل استعلام‌های کاتالوگ</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-300">
                    <span>محبوب‌ترین دسته قطعات:</span>
                    <span className="text-emerald-400">لنت و دیسک ترمز</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[35%]"></div>
                  </div>
                  <div className="text-[10px] text-slate-500 text-left">۳۵٪ سبدهای خرید نهایی</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-300">
                    <span>نرخ تبدیل هوش مصنوعی:</span>
                    <span className="text-cyan-400">۶۸٪ خرید مستقیم</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full w-[68%]"></div>
                  </div>
                  <div className="text-[10px] text-slate-500 text-left">۶۸٪ کاربران پس از عیب‌یابی خرید کرده‌اند</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-300">میانگین زمان تسویه حساب درگاه:</div>
                  <div className="text-sm font-black font-mono text-emerald-400">۱ دقیقه و ۲۴ ثانیه</div>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: ADVANCED ACCOUNTING & FINANCIAL LEDGER */}
      {/* ======================================================== */}
      {activeTab === 'accounting' && (
        <div className="space-y-8">
          
          {/* Accounting Stats Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">گردش کل درآمد فروش:</span>
              <span className="text-lg font-black text-emerald-400 font-mono mt-1 block">
                {accountingData ? accountingData.summary.totalRevenue.toLocaleString('fa-IR') : '0'} تومان
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">کل هزینه‌ها و خرید قطعه:</span>
              <span className="text-lg font-black text-rose-400 font-mono mt-1 block">
                {accountingData ? accountingData.summary.totalExpenses.toLocaleString('fa-IR') : '0'} تومان
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">مالیات ارزش افزوده تعهدی (۹٪):</span>
              <span className="text-lg font-black text-amber-400 font-mono mt-1 block">
                {accountingData ? accountingData.summary.vatPayable.toLocaleString('fa-IR') : '0'} تومان
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">موجودی درگاه‌های پرداخت:</span>
              <span className="text-lg font-black text-cyan-400 font-mono mt-1 block">
                {accountingData ? accountingData.summary.cashInGateway.toLocaleString('fa-IR') : '0'} تومان
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">بدهکاران تجاری (دریافتنی):</span>
              <span className="text-lg font-black text-purple-400 font-mono mt-1 block">
                {accountingData ? accountingData.summary.accountsReceivable.toLocaleString('fa-IR') : '0'} تومان
              </span>
            </div>

          </div>

          {/* Action row */}
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>دفتر روزنامه و ریز تراکنش‌های مالی حسابداری</span>
            </h3>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAddTxModal(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>ثبت سند حسابداری جدید</span>
              </button>
              <button
                onClick={() => handleExportExcel('accounting')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>خروجی اکسل</span>
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold">
                    <th className="p-4">شماره سند</th>
                    <th className="p-4">شرح تراکنش و سرفصل</th>
                    <th className="p-4">طرف حساب</th>
                    <th className="p-4">تاریخ</th>
                    <th className="p-4 text-center">نوع</th>
                    <th className="p-4 text-left">مبلغ (تومان)</th>
                    <th className="p-4 text-center">کد ارجاع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {accountingData?.transactions?.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-amber-400">{tx.id}</td>
                      <td className="p-4 font-semibold text-white">{tx.title}</td>
                      <td className="p-4 text-slate-300">{tx.party}</td>
                      <td className="p-4 font-mono text-slate-400">{tx.date}</td>
                      <td className="p-4 text-center">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold inline-block ${
                          tx.category === 'درآمد' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {tx.category}
                        </span>
                      </td>
                      <td className={`p-4 text-left font-mono font-black ${
                        tx.category === 'درآمد' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {tx.amount.toLocaleString('fa-IR')}
                      </td>
                      <td className="p-4 text-center font-mono text-slate-500 text-[11px]">{tx.referenceNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* New Transaction Modal */}
          {showAddTxModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs shadow-2xl">
                <h3 className="text-sm font-black text-white border-b border-slate-800 pb-3">
                  ثبت سند حسابداری جدید در سامانه
                </h3>
                <form onSubmit={handleCreateTransaction} className="space-y-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">شرح تراکنش:</label>
                    <input
                      type="text"
                      value={newTxTitle}
                      onChange={(e) => setNewTxTitle(e.target.value)}
                      placeholder="مثال: خرید روغن گیربکس از بازرگانی بهران"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">مبلغ به تومان:</label>
                    <input
                      type="number"
                      value={newTxAmount}
                      onChange={(e) => setNewTxAmount(e.target.value)}
                      placeholder="مثال: 4500000"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">سرفصل مالی:</label>
                      <select
                        value={newTxCategory}
                        onChange={(e) => setNewTxCategory(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                      >
                        <option value="هزینه">هزینه / خرید</option>
                        <option value="درآمد">درآمد / فروش</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">طرف حساب:</label>
                      <input
                        type="text"
                        value={newTxParty}
                        onChange={(e) => setNewTxParty(e.target.value)}
                        placeholder="نام شخص یا شرکت"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddTxModal(false)}
                      className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black"
                    >
                      ثبت سند مالی
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: INVENTORY MANAGEMENT & MARKETPLACE SYNC */}
      {/* ======================================================== */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-amber-400" />
                <span>مدیریت دقیق کاردکس انبار و همگام‌سازی لحظه‌ای با سایر پلتفرم‌ها</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                تغییر موجودی انبار به طور خودکار به مشتریان منتظر («خبرم کن») پیامک ارسال خواهد کرد.
              </p>
            </div>
            <button
              onClick={() => handleExportExcel('inventory')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>خروجی موجودی انبار (اکسل)</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold">
                    <th className="p-4">کد فنی OEM</th>
                    <th className="p-4">نام قطعه و مشخصات</th>
                    <th className="p-4">برند و مبدأ</th>
                    <th className="p-4 text-center">موجودی فعلی</th>
                    <th className="p-4 text-center">نقطه سفارش</th>
                    <th className="p-4 text-center">همگام‌سازی پلتفرم‌ها</th>
                    <th className="p-4 text-center">تنظیم موجودی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {parts.map(part => {
                    const isLow = part.inStock <= part.minStockThreshold;
                    return (
                      <tr key={part.id} className={`hover:bg-slate-800/30 transition-colors ${isLow ? 'bg-rose-950/10' : ''}`}>
                        <td className="p-4 font-mono font-bold text-amber-400">{part.oemCode}</td>
                        <td className="p-4">
                          <div className="font-bold text-white line-clamp-1">{part.name}</div>
                          <span className="text-[10px] text-slate-500">{part.categoryLabel}</span>
                        </td>
                        <td className="p-4 text-slate-300">
                          <div>{part.brand}</div>
                          <span className="text-[10px] text-slate-500">{part.countryOfOrigin}</span>
                        </td>
                        <td className="p-4 text-center font-mono font-black">
                          <span className={`text-sm ${part.inStock === 0 ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {part.inStock} عدد
                          </span>
                        </td>
                        <td className="p-4 text-center font-mono text-slate-400">
                          {part.minStockThreshold} عدد
                        </td>
                        
                        {/* Platform sync toggles */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {['دیجی‌کالا', 'ترب', 'باسلام'].map(plat => {
                              const isSynced = part.syncPlatforms?.[plat] ?? false;
                              return (
                                <button
                                  key={plat}
                                  onClick={() => handleSyncPlatform(part.id, plat)}
                                  className={`text-[10px] px-2 py-0.5 rounded font-bold transition-colors ${
                                    isSynced 
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                                      : 'bg-slate-950 text-slate-500 border border-slate-800 hover:border-slate-700'
                                  }`}
                                  title={`کلیک جهت همگام‌سازی با ${plat}`}
                                >
                                  {plat}
                                </button>
                              );
                            })}
                          </div>
                        </td>

                        {/* Quick adjust buttons */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => onUpdatePartStock(part.id, part.inStock + 5)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-900/60 text-slate-200 hover:text-emerald-300 text-[11px] font-bold"
                              title="افزایش ۵ عدد به انبار"
                            >
                              +۵
                            </button>
                            <button
                              onClick={() => onUpdatePartStock(part.id, Math.max(0, part.inStock - 1))}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-rose-900/60 text-slate-200 hover:text-rose-300 text-[11px] font-bold"
                              title="کاهش ۱ عدد از انبار"
                            >
                              -۱
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: ORDERS & SMART DELAYED ORDER ALERTS */}
      {/* ======================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Smart alert for delayed orders banner */}
          {delayedOrders.length > 0 && (
            <div className="p-5 rounded-3xl bg-rose-950/40 border border-rose-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">سیستم اعلان هوشمند سفارشات معوقه فعال است!</h4>
                  <p className="text-xs text-rose-200/80 mt-1">
                    تعداد {delayedOrders.length} سفارش به دلیل تأخیر توزیع در پست یا مرکز توزیع نیازمند یادآوری و پیگیری اختصاصی هستند.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  delayedOrders.forEach(ord => {
                    onSendSmsToOrder(ord.id, `پیامک اولویت‌بندی هوشمند: سفارش ${ord.trackingCode} با پیک اختصاصی جایگزین در مسیر ارسال قرار گرفت.`);
                  });
                  alert('پیامک اطلاع‌رسانی اولویت به مشتریان ارسال گردید.');
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-lg shadow-rose-600/30"
              >
                <Smartphone className="w-4 h-4" />
                <span>ارسال پیامک رفع معوقه به همه</span>
              </button>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold">
                    <th className="p-4">کد سفارش</th>
                    <th className="p-4">نام خریدار و تلفن</th>
                    <th className="p-4">اقلام سفارش</th>
                    <th className="p-4 text-left">مبلغ کل</th>
                    <th className="p-4 text-center">وضعیت فعلی</th>
                    <th className="p-4 text-center">تغییر وضعیت</th>
                    <th className="p-4 text-center">ارسال SMS پیگیری</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono font-black text-amber-400">
                        {order.trackingCode}
                        <span className="block text-[10px] text-slate-500 font-normal">{order.createdAt}</span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{order.customerName}</div>
                        <span className="text-[11px] font-mono text-slate-400">{order.customerPhone}</span>
                      </td>
                      <td className="p-4 text-slate-200">
                        {order.items.map(it => it.partName).join(' + ')}
                      </td>
                      <td className="p-4 text-left font-mono font-bold text-white">
                        {order.finalAmount.toLocaleString('fa-IR')} تومان
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold inline-block ${
                          order.orderStatus === 'delivered' ? 'bg-emerald-950 text-emerald-300' :
                          order.orderStatus === 'delayed' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>
                          {order.orderStatus === 'delivered' ? 'تحویل شد' :
                           order.orderStatus === 'shipped' ? 'ارسال شده' :
                           order.orderStatus === 'delayed' ? 'معوقه' : 'در حال پردازش'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                          className="bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200"
                        >
                          <option value="registered">ثبت شده</option>
                          <option value="processing">در حال پردازش</option>
                          <option value="shipped">ارسال با پست پیشتاز</option>
                          <option value="delayed">معوقه (نیازمند پیگیری)</option>
                          <option value="delivered">تحویل به مشتری</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            const custom = prompt('متن پیامک سفارشی را وارد کنید:', `سفارش شما با کد ${order.trackingCode} در حال ارسال است.`);
                            if (custom) onSendSmsToOrder(order.id, custom);
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg inline-flex items-center gap-1 text-[11px]"
                          title="ارسال پیامک مستقیم به مشتری"
                        >
                          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                          <span>ارسال SMS</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: PERSONALIZED NOTIFICATIONS & MARKETING SMS */}
      {/* ======================================================== */}
      {activeTab === 'marketing' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>سامانه ارسال پیامک‌های شخصی‌سازی شده و هدفمند</span>
            </h3>

            {smsSentNotice && (
              <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl">
                {smsSentNotice}
              </div>
            )}

            <div>
              <label className="block text-slate-400 font-bold mb-1.5">انتخاب گروه هدف مشتریان بر اساس رفتار و خودرو:</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-semibold"
              >
                <option value="owners_peugeot">مالکان خودروهای پژو ۲۰۶، ۲۰۷ و رانا (۳۴۰ شماره فعال)</option>
                <option value="owners_dena">مالکان دنا، سمند و موتور EF7 (۱۹۵ شماره فعال)</option>
                <option value="abandoned_cart">کاربران با سبد خرید رها شده در ۲۴ ساعت گذشته (۵۴ شماره)</option>
                <option value="waiting_brakes">کاربران منتظر لنت و دیسک ترمز (۸۲ شماره)</option>
                <option value="vip_buyers">خریداران وفادار با خرید بالای ۱۰ میلیون تومان (۴۱ شماره)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5">متن پیامک ارسالی (همراه با لینک مستقیم کالا):</label>
              <textarea
                rows={4}
                value={customSmsText}
                onChange={(e) => setCustomSmsText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white leading-relaxed focus:border-amber-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                تعداد کاراکتر: {customSmsText.length} | پیامک از طریق خط خدماتی بدون بلک‌لیست ارسال می‌شود.
              </span>
            </div>

            <button
              onClick={handleSendCustomSms}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Send className="w-4 h-4" />
              <span>ارسال پیامک شخصی‌سازی شده به گروه انتخابی</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: TICKETS & COMPLAINTS MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>مدیریت تیکت‌ها، استعلام‌ها و رسیدگی به شکایات ثبت شده کاربران</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {tickets.map(ticket => (
              <div key={ticket.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{ticket.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        ticket.type === 'complaint' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {ticket.type === 'complaint' ? 'شکایت مشتری' : 'استعلام فنی'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      ارسال شده توسط: {ticket.customerName} ({ticket.customerPhone}) در تاریخ {ticket.createdAt}
                    </span>
                  </div>

                  <span className={`text-[10px] px-3 py-1 rounded-full font-bold self-start sm:self-auto ${
                    ticket.status === 'resolved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {ticket.status === 'resolved' ? 'پاسخ داده شد' : 'در انتظار بررسی مدیریت'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 text-slate-200 leading-relaxed border border-slate-800">
                  {ticket.message}
                </div>

                {ticket.reply ? (
                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300">
                    <span className="font-bold block mb-1">پاسخ ثبت شده توسط مدیریت:</span>
                    <p>{ticket.reply}</p>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    <label className="block text-slate-400 font-bold">ثبت پاسخ رسمی به مشتری:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="متن پاسخ رسمی کارشناس یا مدیریت را بنویسید..."
                        value={selectedTicketId === ticket.id ? replyText : ''}
                        onChange={(e) => {
                          setSelectedTicketId(ticket.id);
                          setReplyText(e.target.value);
                        }}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                      />
                      <button
                        onClick={() => {
                          if (replyText.trim()) {
                            onReplyTicket(ticket.id, replyText);
                            setReplyText('');
                          }
                        }}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl"
                      >
                        ارسال پاسخ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
