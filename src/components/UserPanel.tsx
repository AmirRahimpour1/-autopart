import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  FileText, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Bell, 
  MessageSquare, 
  Send, 
  ShieldAlert, 
  ChevronRight,
  Smartphone,
  Eye
} from 'lucide-react';
import { Order, Ticket, StockAlert } from '../types';

interface UserPanelProps {
  orders: Order[];
  onOpenInvoice: (order: Order) => void;
  tickets: Ticket[];
  onSubmitTicket: (ticket: Partial<Ticket>) => void;
  stockAlerts: StockAlert[];
}

export const UserPanel: React.FC<UserPanelProps> = ({
  orders,
  onOpenInvoice,
  tickets,
  onSubmitTicket,
  stockAlerts
}) => {
  const [activeTab, setActiveTab] = useState<'track' | 'history' | 'alerts' | 'tickets'>('track');
  const [searchTrackingCode, setSearchTrackingCode] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');

  // Ticket form
  const [ticketType, setTicketType] = useState<'support' | 'complaint' | 'inquiry' | 'return'>('support');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketPhone, setTicketPhone] = useState('09123456789');
  const [ticketName, setTicketName] = useState('علیرضا رحیم‌پور');
  const [ticketSentSuccess, setTicketSentSuccess] = useState(false);

  // Filtered order for direct tracking
  const trackedOrder = searchTrackingCode
    ? orders.find(o => o.trackingCode.toLowerCase().includes(searchTrackingCode.trim().toLowerCase()) || o.postalCodeTracking?.includes(searchTrackingCode.trim()))
    : orders[0];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle || !ticketMessage) return;

    onSubmitTicket({
      customerName: ticketName,
      customerPhone: ticketPhone,
      type: ticketType,
      title: ticketTitle,
      message: ticketMessage
    });

    setTicketTitle('');
    setTicketMessage('');
    setTicketSentSuccess(true);
    setTimeout(() => setTicketSentSuccess(false), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-400" />
            <span>پنل اختصاصی مشتریان | پیگیری، فاکتور و پشتیبانی</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            مدیریت لحظه‌ای مرسولات، سوابق فاکتورهای رسمی، هشدارهای پیامکی موجودی کالا و ثبت شکایات
          </p>
        </div>

        {/* User Badges */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-slate-300 font-bold">مهندس علیرضا رحیم‌پور</span>
          <span className="text-slate-500 font-mono text-[11px]">۰۹۱۲۳۴۵۶۷۸۹</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-3 mb-8 text-xs font-bold">
        <button
          onClick={() => setActiveTab('track')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'track'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>پیگیری لحظه‌ای مرسوله پستی</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>تاریخچه خریدها و صدور فاکتور ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'alerts'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>کالاهای در انتظار موجودی ({stockAlerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'tickets'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>پشتیبانی و ثبت شکایات ({tickets.length})</span>
        </button>
      </div>

      {/* TAB 1: REAL-TIME TRACKING */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          
          {/* Quick Search Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchTrackingCode}
                onChange={(e) => setSearchTrackingCode(e.target.value)}
                placeholder="کد پیگیری سفارش (مثلا YDK-894210) یا کد مرسوله پستی را وارد کنید..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pr-10 pl-4 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
            <span className="text-[11px] text-slate-500">یا انتخاب از سفارشات فعال پایین</span>
          </div>

          {trackedOrder ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">سفارش شماره:</span>
                    <span className="font-mono text-sm font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                      {trackedOrder.trackingCode}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                      trackedOrder.orderStatus === 'delivered' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      trackedOrder.orderStatus === 'delayed' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {trackedOrder.orderStatus === 'delivered' ? 'تحویل شده به خریدار' :
                       trackedOrder.orderStatus === 'shipped' ? 'ارسال شده با پست پیشتاز' :
                       trackedOrder.orderStatus === 'delayed' ? 'سفارش معوقه (در حال تسریع)' : 'در حال پردازش در انبار'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    ثبت شده در تاریخ: {trackedOrder.createdAt} | تحویل‌گیرنده: {trackedOrder.customerName}
                  </div>
                </div>

                <button
                  onClick={() => onOpenInvoice(trackedOrder)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>مشاهده و چاپ فاکتور آنلاین</span>
                </button>
              </div>

              {/* Visual Multi-step Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>مراحل فیزیکی آماده‌سازی و ارسال مرسوله:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-1 relative">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>۱. ثبت و پرداخت فاکتور</span>
                    </div>
                    <div className="text-[10px] text-slate-400">تراکنش درگاه شاپرک تایید شد</div>
                  </div>

                  {/* Step 2 */}
                  <div className={`p-3.5 rounded-2xl bg-slate-950 border space-y-1 ${
                    trackedOrder.orderStatus !== 'registered' ? 'border-emerald-500/40' : 'border-slate-800'
                  }`}>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                      <CheckCircle2 className={`w-4 h-4 ${trackedOrder.orderStatus !== 'registered' ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span>۲. بسته‌بندی انبار مرکزی</span>
                    </div>
                    <div className="text-[10px] text-slate-400">بررسی اصالت و هولوگرام قطعات</div>
                  </div>

                  {/* Step 3 */}
                  <div className={`p-3.5 rounded-2xl bg-slate-950 border space-y-1 ${
                    trackedOrder.orderStatus === 'shipped' || trackedOrder.orderStatus === 'delivered'
                      ? 'border-emerald-500/40'
                      : trackedOrder.orderStatus === 'delayed'
                      ? 'border-rose-500/50 bg-rose-950/20'
                      : 'border-slate-800'
                  }`}>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                      <Truck className={`w-4 h-4 ${
                        trackedOrder.orderStatus === 'shipped' || trackedOrder.orderStatus === 'delivered' ? 'text-emerald-400' : 'text-slate-600'
                      }`} />
                      <span>۳. تحویل به پست پیشتاز</span>
                    </div>
                    <div className="text-[10px] font-mono text-amber-400 truncate">
                      {trackedOrder.postalCodeTracking || "در حال صدور بارنامه"}
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className={`p-3.5 rounded-2xl bg-slate-950 border space-y-1 ${
                    trackedOrder.orderStatus === 'delivered' ? 'border-emerald-500/40' : 'border-slate-800'
                  }`}>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                      <CheckCircle2 className={`w-4 h-4 ${trackedOrder.orderStatus === 'delivered' ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span>۴. تحویل نهایی به مشتری</span>
                    </div>
                    <div className="text-[10px] text-slate-400">تحویل درب آدرس ثبت شده</div>
                  </div>

                </div>
              </div>

              {/* Items in this order */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300">اقلام این سفارش ({trackedOrder.items.length} قلم):</h4>
                <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-2xl bg-slate-950/60 p-2">
                  {trackedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.partName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-800"
                        />
                        <div>
                          <span className="text-[10px] font-mono text-amber-400 font-bold block">{item.oemCode}</span>
                          <span className="font-bold text-white block">{item.partName}</span>
                          <span className="text-[10px] text-slate-400">تعداد: {item.quantity} عدد</span>
                        </div>
                      </div>
                      <div className="text-left font-mono font-bold text-amber-400">
                        {(item.price * item.quantity).toLocaleString('fa-IR')} تومان
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SMS Notification History for this order */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <Smartphone className="w-4 h-4" />
                    <span>تاریخچه پیامک‌های ارسال شده به شماره {trackedOrder.customerPhone}:</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">SMS Gateway Active</span>
                </div>

                <div className="space-y-2">
                  {trackedOrder.smsNotificationsSent.map((sms, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{sms}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-slate-900 rounded-3xl border border-slate-800">
              سفارشی با این کد رهگیری یافت نشد.
            </div>
          )}

        </div>
      )}

      {/* TAB 2: ORDER HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold">
                    <th className="p-4">کد سفارش</th>
                    <th className="p-4">تاریخ ثبت</th>
                    <th className="p-4">اقلام</th>
                    <th className="p-4 text-left">مبلغ کل فاکتور</th>
                    <th className="p-4 text-center">وضعیت سفارش</th>
                    <th className="p-4 text-center">فاکتور رسمی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono font-black text-amber-400">{ord.trackingCode}</td>
                      <td className="p-4 text-slate-400 font-mono">{ord.createdAt}</td>
                      <td className="p-4 text-slate-200">
                        {ord.items.map(it => it.partName).join(' + ')}
                      </td>
                      <td className="p-4 text-left font-mono font-bold text-white">
                        {ord.finalAmount.toLocaleString('fa-IR')} تومان
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold inline-block ${
                          ord.orderStatus === 'delivered' ? 'bg-emerald-950 text-emerald-300' :
                          ord.orderStatus === 'delayed' ? 'bg-rose-950 text-rose-300' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>
                          {ord.orderStatus === 'delivered' ? 'تحویل شد' :
                           ord.orderStatus === 'shipped' ? 'ارسال شده' :
                           ord.orderStatus === 'delayed' ? 'معوقه' : 'در حال پردازش'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => onOpenInvoice(ord)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold inline-flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>چاپ فاکتور</span>
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

      {/* TAB 3: STOCK ALERTS ("خبرم کن") */}
      {activeTab === 'alerts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>لیست انتظار پیامکی موجودی کالاها («خبرم کن»)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                به محض ورود قطعات ناموجود به انبار مرکزی، پیامک فوری به شماره ثبت شده ارسال می‌شود.
              </p>
            </div>
          </div>

          {stockAlerts.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              هیچ کالایی در لیست انتظار پیامکی شما نیست.
            </div>
          ) : (
            <div className="space-y-3">
              {stockAlerts.map((alert) => (
                <div key={alert.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{alert.partName}</h4>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      درخواست ثبت شده در: {alert.requestedAt} | شماره پیامک: {alert.customerPhone}
                    </span>
                  </div>
                  <div>
                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold ${
                      alert.isNotified ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {alert.isNotified ? 'پیامک موجودی ارسال شد' : 'در انتظار شارژ انبار'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TICKETS & COMPLAINTS */}
      {activeTab === 'tickets' && (
        <div className="space-y-8">
          
          {/* New ticket form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-black text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>ثبت تیکت پشتیبانی، استعلام فنی یا پیگیری شکایات</span>
            </h3>

            {ticketSentSuccess && (
              <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs mb-4">
                درخواست شما با موفقیت ثبت شد و کد رهگیری تیکت صادر گردید. کارشناسان پشتیبانی ظرف حداکثر ۲ ساعت کاری پاسخ خواهند داد.
              </div>
            )}

            <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">نوع درخواست:</label>
                  <select
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <option value="support">پشتیبانی فنی و استعلام قطعه</option>
                    <option value="complaint">ثبت شکایت از تأخیر یا مرسوله</option>
                    <option value="inquiry">استعلام زمان تحویل بار</option>
                    <option value="return">درخواست مرجوعی یا تعویض کالا</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">نام متقاضی:</label>
                  <input
                    type="text"
                    value={ticketName}
                    onChange={(e) => setTicketName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">شماره همراه تماس:</label>
                  <input
                    type="tel"
                    value={ticketPhone}
                    onChange={(e) => setTicketPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">موضوع تیکت:</label>
                <input
                  type="text"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  placeholder="مثال: پیگیری علت تأخیر در ارسال سفارش کد YDK-762901"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">شرح کامل درخواست یا شکایت:</label>
                <textarea
                  rows={3}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="توضیحات تکمیلی، شماره سفارش، علائم مشکل فنی یا دلیل شکایت را درج نمایید..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ثبت نهایی درخواست و ارسال به کارشناس</span>
              </button>
            </form>
          </div>

          {/* Existing Tickets List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300">درخواست‌ها و شکایات قبلی شما:</h4>
            {tickets.map(ticket => (
              <div key={ticket.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{ticket.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      ticket.type === 'complaint' ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {ticket.type === 'complaint' ? 'شکایت ثبت شده' : 'پشتیبانی فنی'}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                    ticket.status === 'resolved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {ticket.status === 'resolved' ? 'پاسخ داده شد' : 'در حال بررسی توسط مدیریت'}
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {ticket.message}
                </p>

                {ticket.reply && (
                  <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                    <div className="text-[11px] font-bold text-amber-400">پاسخ رسمی پشتیبانی یدک‌پلاس:</div>
                    <div className="text-xs text-slate-200 leading-relaxed">{ticket.reply}</div>
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
