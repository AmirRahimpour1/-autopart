import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Car, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  ShoppingCart, 
  Eye, 
  Send,
  HelpCircle,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { POPULAR_CAR_BRANDS } from '../data/cars';
import { Part } from '../types';

interface AiAdvisorViewProps {
  catalogParts: Part[];
  onSelectPart: (part: Part) => void;
  onAddToCart: (part: Part) => void;
}

export const AiAdvisorView: React.FC<AiAdvisorViewProps> = ({
  catalogParts,
  onSelectPart,
  onAddToCart
}) => {
  const [selectedBrand, setSelectedBrand] = useState('ایران خودرو (IKCO)');
  const [selectedModel, setSelectedModel] = useState('پژو 206 تیپ 5');
  const [year, setYear] = useState('1398');
  const [engine, setEngine] = useState('TU5 1.6L 16V');
  const [symptomText, setSymptomText] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [poweredBy, setPoweredBy] = useState<string>('');

  const quickSymptoms = [
    'صدای سوت ممتد هنگام ترمزگیری و کاهش قدرت توقف',
    'رسیدن به کارکرد ۶۰ هزار کیلومتر و نیاز به تعویض تسمه تایم',
    'لرزش شدید اتاق و کوبش در دست‌اندازهای تند',
    'ریپ زدن در شتاب اولیه و افزایش غیرعادی مصرف بنزین',
    'بالا رفتن سریع آمپر آب و فن زدن مداوم رادیاتور',
    'سفت شدن پدال کلاچ و بکسوات در سرپایینی و سربالایی'
  ];

  const currentBrandData = POPULAR_CAR_BRANDS.find(b => b.brand === selectedBrand);

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText.trim()) return;

    setLoading(true);
    setDiagnosisResult(null);

    try {
      const response = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carBrand: selectedBrand,
          carModel: selectedModel,
          year,
          engine,
          symptoms: symptomText
        })
      });
      const data = await response.json();
      if (data.success) {
        setDiagnosisResult(data.data);
        setPoweredBy(data.poweredBy || 'هوش مصنوعی Gemini');
      }
    } catch (err) {
      console.error("AI diagnosis fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Find matching catalog parts if returned
  const matchedCatalogParts = (diagnosisResult?.compatibleCatalogPartIds && Array.isArray(diagnosisResult.compatibleCatalogPartIds))
    ? (catalogParts || []).filter(p => diagnosisResult.compatibleCatalogPartIds.includes(p.id))
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Hero AI Advisor Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 p-6 sm:p-10 shadow-2xl mb-10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-4">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>متصل به مدل هوش مصنوعی Gemini 3.8 Flash</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            دستیار هوشمند عیب‌یابی و پیشنهاد قطعات یدکی خودرو
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
            مدل خودرو و علائم خرابی، صدای غیرعادی یا کیلومتر کارکرد را وارد کنید تا هوش مصنوعی بلافاصله نقص فنی را تحلیل، کدهای فنی استاندارد (OEM) را استخراج و قطعات اورجینال متناسب را پیشنهاد دهد.
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Grid: Input Form & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column (lg:col-span-5) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 sticky top-28">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Car className="w-4 h-4 text-amber-400" />
              <span>مشخصات خودرو و علائم مشکل</span>
            </h3>

            <form onSubmit={handleDiagnose} className="space-y-4 text-xs">
              
              {/* Brand Selector */}
              <div>
                <label className="block text-slate-400 font-bold mb-1.5">سازنده / برند خودرو:</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    const b = e.target.value;
                    setSelectedBrand(b);
                    const bData = POPULAR_CAR_BRANDS.find(item => item.brand === b);
                    if (bData && bData.models.length > 0) {
                      setSelectedModel(bData.models[0].name);
                      setEngine(bData.models[0].engines[0] || '');
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-medium focus:border-amber-500 focus:outline-none"
                >
                  {POPULAR_CAR_BRANDS.map(b => (
                    <option key={b.brand} value={b.brand}>{b.brand}</option>
                  ))}
                </select>
              </div>

              {/* Model Selector */}
              <div>
                <label className="block text-slate-400 font-bold mb-1.5">مدل دقیق خودرو:</label>
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    const m = e.target.value;
                    setSelectedModel(m);
                    const mData = currentBrandData?.models.find(item => item.name === m);
                    if (mData && mData.engines.length > 0) {
                      setEngine(mData.engines[0]);
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-medium focus:border-amber-500 focus:outline-none"
                >
                  {currentBrandData?.models.map(m => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Engine & Year row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5">تیپ / کد موتور:</label>
                  <input
                    type="text"
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    placeholder="مثال: TU5 یا EF7"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5">سال ساخت / کارکرد:</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="مثال: 1399 یا 75000km"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Symptom Input */}
              <div>
                <label className="block text-slate-400 font-bold mb-1.5">علائم خرابی، صدای غیرعادی یا عیب خودرو:</label>
                <textarea
                  rows={3}
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  placeholder="مثلا: هنگام ترمز در سرعت‌های بالا لرزش پدال دارم و چرخ جلو سوت می‌کشد..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-amber-500 focus:outline-none leading-relaxed"
                  required
                />
              </div>

              {/* Quick Suggestion Chips */}
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block mb-2">انتخاب سریع مشکلات متداول:</span>
                <div className="flex flex-wrap gap-1.5">
                  {quickSymptoms.map((qs, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setSymptomText(qs)}
                      className="text-[10px] bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700/80 rounded-lg px-2.5 py-1 transition-colors text-right"
                    >
                      {qs}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !symptomText.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin text-slate-950" />
                    <span>دستیار هوش مصنوعی در حال تحلیل فنی...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>تحلیل نقص و پیشنهاد قطعه با هوش مصنوعی</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* Result Column (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {!diagnosisResult && !loading && (
            <div className="h-full min-h-[420px] rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Wrench className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">هنوز تحلیلی انجام نشده است</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                مشخصات خودرو و علائم نقص فنی را در فرم سمت راست وارد کنید و دکمه تحلیل را بزنید تا خروجی هوش مصنوعی در اینجا نمایش داده شود.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[420px] rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin"></div>
                <Cpu className="w-8 h-8 text-amber-400 absolute inset-0 m-auto" />
              </div>
              <h3 className="text-base font-bold text-white">پردازش هوشمند کدهای دیاگ و قطعات...</h3>
              <p className="text-xs text-slate-400 max-w-md">
                هوش مصنوعی در حال بررسی کدهای سازگاری فنی برای خودروی {selectedModel} با مشخصات {engine} می‌باشد...
              </p>
            </div>
          )}

          {diagnosisResult && !loading && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Diagnosis Summary Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <h2 className="text-base font-black text-white">نتیجه تشخیص کارشناسی و عیب‌یابی</h2>
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    اولویت تعویض: {diagnosisResult.urgency}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  {diagnosisResult.diagnosisSummary}
                </div>

                {/* Recommended parts list */}
                <div>
                  <h4 className="text-xs font-bold text-amber-400 mb-3 flex items-center gap-1.5">
                    <Wrench className="w-4 h-4" />
                    <span>قطعات یدکی پیشنهادی جهت رفع کامل مشکل:</span>
                  </h4>
                  <div className="space-y-2.5">
                    {diagnosisResult.recommendedParts?.map((partItem: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{partItem.name}</span>
                            {partItem.oemCode && (
                              <span className="font-mono text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700">
                                OEM: {partItem.oemCode}
                              </span>
                            )}
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              partItem.priority === 'اصلی' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {partItem.priority}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{partItem.reason}</p>
                        </div>
                        <div className="text-left font-mono font-bold text-amber-400 shrink-0 text-xs">
                          {partItem.estimatedCost}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mechanic Tips */}
                {diagnosisResult.mechanicTips && (
                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
                    <h5 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>نکات تخصصی نصب و سرویس مکانیک:</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside leading-relaxed">
                      {diagnosisResult.mechanicTips.map((tip: string, i: number) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-[10px] text-slate-500 text-left pt-2 border-t border-slate-800/60">
                  تولید شده توسط: {poweredBy}
                </div>
              </div>

              {/* Matching Catalog Parts Ready to Buy */}
              {matchedCatalogParts.length > 0 && (
                <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>قطعات اورجینال موجود در انبار مطابق با تشخیص بالا</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        این قطعات با ضمانت ۱۰۰٪ سازگاری با {selectedModel} آماده ارسال فوری هستند:
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {matchedCatalogParts.map(part => (
                      <div key={part.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={part.image} 
                            alt={part.name} 
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0" 
                          />
                          <div>
                            <span className="text-[10px] font-mono text-amber-400 font-bold block">{part.oemCode}</span>
                            <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">{part.name}</h4>
                            <div className="text-xs font-black text-amber-400 font-mono mt-1">
                              {part.price.toLocaleString('fa-IR')} تومان
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                          <button
                            onClick={() => onSelectPart(part)}
                            className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>مشخصات فنی</span>
                          </button>
                          <button
                            onClick={() => onAddToCart(part)}
                            disabled={part.inStock === 0}
                            className="flex-1 py-1.5 px-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center justify-center gap-1"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>خرید فوری</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
