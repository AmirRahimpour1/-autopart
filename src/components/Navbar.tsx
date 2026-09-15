import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  ShoppingCart, 
  User, 
  Cpu, 
  Scale, 
  ShieldCheck, 
  SlidersHorizontal,
  Car,
  Bell,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { POPULAR_CAR_BRANDS } from '../data/cars';

interface NavbarProps {
  currentTab: string;
  setCurrentTab?: (tab: any) => void;
  onSelectTab?: (tab: any) => void;
  cartCount: number;
  openCart?: () => void;
  onOpenCart?: () => void;
  selectedCar?: string;
  setSelectedCar?: (car: string) => void;
  selectedVehicle?: { brand: string; model: string; year?: string; engine?: string };
  onSelectVehicle?: (v: any) => void;
  compareCount: number;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onSelectTab,
  cartCount,
  openCart,
  onOpenCart,
  selectedCar,
  setSelectedCar,
  selectedVehicle,
  onSelectVehicle,
  compareCount,
  searchQuery = '',
  setSearchQuery,
  onOpenSearch
}) => {
  const [showCarDropdown, setShowCarDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSelectTab = (tab: any) => {
    const targetTab = tab === 'storefront' ? 'catalog' : tab;
    if (onSelectTab) onSelectTab(targetTab);
    else if (setCurrentTab) setCurrentTab(targetTab);
  };

  const handleOpenCart = () => {
    if (onOpenCart) onOpenCart();
    else if (openCart) openCart();
  };

  const currentCarLabel = selectedCar || selectedVehicle?.model || selectedVehicle?.brand || '';

  const handleSelectCar = (carModel: string, carBrand?: string) => {
    if (onSelectVehicle) {
      onSelectVehicle({ brand: carBrand || '', model: carModel, year: '', engine: '' });
    }
    if (setSelectedCar) {
      setSelectedCar(carModel);
    }
  };

  const handleSearchChange = (val: string) => {
    setLocalSearch(val);
    if (setSearchQuery) {
      setSearchQuery(val);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-all duration-300">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>ضمانت ۱۰۰٪ اصالت فیزیکی و بازگشت وجه تا ۷ روز</span>
        </div>
        <div className="w-full sm:w-auto text-center">
          <span>ارسال فوق سریع سفارشات به سراسر کشور | پشتیبانی هوشمند و آنلاین قطعات</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <span>تلفن پشتیبانی: ۰۲۱-۸۸۴۵۰۰۹۹</span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => handleSelectTab('catalog')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <Wrench className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white">یدک‌پلاس</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">PRO</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">سامانه هوشمند قطعات خودرو</p>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2 relative">
            <div className="relative w-full">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSelectTab('catalog');
                  }
                }}
                placeholder="جستجوی نام قطعه، کد فنی (OEM) یا شماره شاسی..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-2.5 pr-10 pl-24 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              <button
                onClick={() => {
                  handleSelectTab('catalog');
                }}
                className="absolute left-1.5 top-1.5 bottom-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
              >
                جستجو
              </button>
            </div>
          </div>

          {/* Vehicle Selector Badge */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowCarDropdown(!showCarDropdown)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-sm font-medium text-slate-200 transition-colors"
            >
              <Car className="w-4 h-4 text-amber-400" />
              <div className="text-right">
                <div className="text-[10px] text-slate-400 leading-none">خودروی انتخابی:</div>
                <div className="text-xs font-bold text-amber-300 mt-0.5 max-w-[140px] truncate">
                  {currentCarLabel || "همه خودروها"}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
            </button>

            {/* Dropdown for car selection */}
            {showCarDropdown && (
              <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-xs font-bold text-slate-400 px-3 py-1.5 border-b border-slate-800 flex justify-between items-center">
                  <span>فیلتر سازگاری قطعه</span>
                  <button 
                    onClick={() => { handleSelectCar('', ''); setShowCarDropdown(false); }}
                    className="text-amber-400 hover:underline text-[11px]"
                  >
                    نمایش همه
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto py-1 space-y-1">
                  {POPULAR_CAR_BRANDS.map(brand => (
                    <div key={brand.brand} className="pt-1">
                      <div className="text-[11px] font-bold text-slate-500 px-2.5 py-0.5">{brand.brand}</div>
                      {brand.models.map(m => (
                        <button
                          key={m.name}
                          onClick={() => {
                            handleSelectCar(m.name, brand.brand);
                            setShowCarDropdown(false);
                            handleSelectTab('catalog');
                          }}
                          className={`w-full text-right px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between ${
                            currentCarLabel === m.name 
                              ? 'bg-amber-500/20 text-amber-300 font-bold' 
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>{m.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{m.years}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Compare, Cart, User / Admin */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Compare Tool Button */}
            <button
              onClick={() => handleSelectTab('compare')}
              className={`relative p-2.5 rounded-xl border transition-colors ${
                currentTab === 'compare'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="مقایسه فنی قطعات"
            >
              <Scale className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-slate-950 rounded-full text-[11px] font-black flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={handleOpenCart}
              className="relative p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="سبد خرید و تسویه حساب"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full text-[11px] font-black flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Panel Button */}
            <button
              onClick={() => handleSelectTab('user-panel')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                currentTab === 'user-panel'
                  ? 'bg-amber-500 text-slate-950 border-amber-500'
                  : 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">پیگیری و فاکتور</span>
            </button>

            {/* Admin Switcher */}
            <button
              onClick={() => handleSelectTab('admin-panel')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                currentTab === 'admin-panel'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300 hover:bg-emerald-900/40'
              }`}
              title="پنل مدیریت، انبارداری و حسابداری"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden md:inline">پنل مدیریت</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Secondary Navigation Row (Desktop) */}
        <nav className="hidden lg:flex items-center justify-between pt-3 border-t border-slate-800/80 mt-3 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleSelectTab('catalog')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'catalog' 
                  ? 'bg-slate-800 text-amber-400 font-bold shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              ویترین قطعات
            </button>

            <button
              onClick={() => handleSelectTab('ai-advisor')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'ai-advisor' 
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' 
                  : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              مشاوره و عیب‌یابی هوش مصنوعی
              <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full mr-1">هوشمند</span>
            </button>

            <button
              onClick={() => handleSelectTab('compare')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'compare' 
                  ? 'bg-slate-800 text-amber-400 font-bold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              مقایسه فنی قطعات
              {compareCount > 0 && <span className="bg-slate-700 px-1.5 py-0.2 rounded-full text-[10px]">{compareCount}</span>}
            </button>

            <button
              onClick={() => handleSelectTab('user-panel')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'user-panel' 
                  ? 'bg-slate-800 text-amber-400 font-bold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              رهگیری مرسولات و فاکتور آنلاین
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              پشتیبانی ۲۴ ساعته و ارسال روزانه
            </span>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 space-y-2 pb-2">
            <div className="mb-3">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSelectTab('catalog');
                    setMobileMenuOpen(false);
                  }
                }}
                placeholder="جستجوی قطعه یا کد فنی..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 placeholder-slate-500"
              />
            </div>
            <button
              onClick={() => { handleSelectTab('catalog'); setMobileMenuOpen(false); }}
              className={`w-full text-right px-3 py-2 rounded-lg text-xs font-semibold ${
                currentTab === 'catalog' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              ویترین و کاتالوگ قطعات
            </button>
            <button
              onClick={() => { handleSelectTab('ai-advisor'); setMobileMenuOpen(false); }}
              className={`w-full text-right px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between ${
                currentTab === 'ai-advisor' ? 'bg-amber-500 text-slate-950' : 'text-amber-300 hover:bg-slate-800'
              }`}
            >
              <span>مشاوره هوش مصنوعی و عیب‌یابی</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded">هوشمند</span>
            </button>
            <button
              onClick={() => { handleSelectTab('compare'); setMobileMenuOpen(false); }}
              className={`w-full text-right px-3 py-2 rounded-lg text-xs font-semibold ${
                currentTab === 'compare' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              مقایسه مشخصات فنی ({compareCount})
            </button>
            <button
              onClick={() => { handleSelectTab('user-panel'); setMobileMenuOpen(false); }}
              className={`w-full text-right px-3 py-2 rounded-lg text-xs font-semibold ${
                currentTab === 'user-panel' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              پنل کاربری و رهگیری سفارشات
            </button>
            <button
              onClick={() => { handleSelectTab('admin-panel'); setMobileMenuOpen(false); }}
              className={`w-full text-right px-3 py-2 rounded-lg text-xs font-semibold ${
                currentTab === 'admin-panel' ? 'bg-emerald-500 text-slate-950' : 'text-emerald-400 hover:bg-slate-800'
              }`}
            >
              پنل مدیریت و حسابداری
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
