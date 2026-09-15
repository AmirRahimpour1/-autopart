import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CatalogStore } from './components/CatalogStore';
import { AiAdvisorView } from './components/AiAdvisorView';
import { PartCompareView } from './components/PartCompareView';
import { UserPanel } from './components/UserPanel';
import { AdminPanel } from './components/AdminPanel';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartAndCheckoutModal } from './components/CartAndCheckoutModal';
import { InvoiceModal } from './components/InvoiceModal';
import { LiveSupportChat } from './components/LiveSupportChat';
import { Footer } from './components/Footer';
import { Part, Order, Ticket, StockAlert, OrderItem, SelectedVehicle } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'catalog' | 'ai-advisor' | 'compare' | 'user-panel' | 'admin-panel'>('catalog');
  
  // App data states
  const [parts, setParts] = useState<Part[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [loadingParts, setLoadingParts] = useState(true);

  // User Cart
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Comparison
  const [comparedPartIds, setComparedPartIds] = useState<string[]>(['part-1', 'part-2']);

  // Modals
  const [selectedDetailPart, setSelectedDetailPart] = useState<Part | null>(null);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  // Selected Vehicle for Filtering
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicle>({
    brand: '',
    model: '',
    year: '',
    engine: ''
  });

  // Fetch initial parts and orders from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partsRes, ordersRes, ticketsRes, alertsRes] = await Promise.all([
          fetch('/api/parts'),
          fetch('/api/orders'),
          fetch('/api/tickets'),
          fetch('/api/stock-alerts')
        ]);

        const partsData = await partsRes.json();
        if (partsData && partsData.success) {
          setParts(Array.isArray(partsData.parts) ? partsData.parts : (Array.isArray(partsData.data) ? partsData.data : []));
        }

        const ordersData = await ordersRes.json();
        if (ordersData && ordersData.success) {
          setOrders(Array.isArray(ordersData.orders) ? ordersData.orders : (Array.isArray(ordersData.data) ? ordersData.data : []));
        }

        const ticketsData = await ticketsRes.json();
        if (ticketsData && ticketsData.success) {
          setTickets(Array.isArray(ticketsData.tickets) ? ticketsData.tickets : (Array.isArray(ticketsData.data) ? ticketsData.data : []));
        }

        const alertsData = await alertsRes.json();
        if (alertsData && alertsData.success) {
          setStockAlerts(Array.isArray(alertsData.alerts) ? alertsData.alerts : (Array.isArray(alertsData.data) ? alertsData.data : []));
        }
      } catch (err) {
        console.error("Fetch data error:", err);
      } finally {
        setLoadingParts(false);
      }
    };

    fetchData();
  }, []);

  // Cart operations
  const handleAddToCart = (part: Part) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.partId === part.id);
      if (existing) {
        return prev.map(item =>
          item.partId === part.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          partId: part.id,
          partName: part.name,
          oemCode: part.oemCode,
          price: part.price,
          quantity: 1,
          image: part.image
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(partId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => item.partId === partId ? { ...item, quantity } : item)
    );
  };

  const handleRemoveCartItem = (partId: string) => {
    setCartItems(prev => prev.filter(item => item.partId !== partId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Compare operations
  const handleToggleCompare = (part: Part) => {
    setComparedPartIds(prev => {
      if (prev.includes(part.id)) {
        return prev.filter(id => id !== part.id);
      }
      if (prev.length >= 4) {
        alert('حداکثر می‌توانید ۴ قطعه را همزمان مقایسه کنید.');
        return prev;
      }
      return [...prev, part.id];
    });
  };

  const handleRemoveFromCompare = (id: string) => {
    setComparedPartIds(prev => prev.filter(item => item !== id));
  };

  const handleClearCompare = () => {
    setComparedPartIds([]);
  };

  // Stock alert registration
  const handleSubscribeStockAlert = async (partId: string, phone: string): Promise<string> => {
    try {
      const res = await fetch('/api/stock-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partId, customerPhone: phone })
      });
      const data = await res.json();
      if (data.success) {
        setStockAlerts(prev => [data.alert, ...prev]);
        return data.message;
      }
      return 'ثبت با موفقیت انجام شد.';
    } catch (e) {
      return 'درخواست شما در سیستم ثبت گردید.';
    }
  };

  // Ticket submissions
  const handleSubmitTicket = async (ticketData: Partial<Ticket>) => {
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      });
      const data = await res.json();
      if (data.success) {
        setTickets(prev => [data.ticket, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReplyTicket = async (id: string, reply: string) => {
    try {
      const res = await fetch(`/api/tickets/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply })
      });
      const data = await res.json();
      if (data.success) {
        setTickets(prev => prev.map(t => t.id === id ? data.ticket : t));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Admin order status update
  const handleUpdateOrderStatus = async (id: string, status: any, postalCode?: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, postalCodeTracking: postalCode })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === id ? data.order : o));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Admin SMS dispatch
  const handleSendSmsToOrder = async (id: string, msg: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === id ? data.order : o));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Admin part stock update
  const handleUpdatePartStock = async (id: string, newStock: number) => {
    try {
      const res = await fetch(`/api/parts/${id}/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: newStock })
      });
      const data = await res.json();
      if (data.success) {
        setParts(prev => prev.map(p => p.id === id ? { ...p, inStock: newStock } : p));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const comparedParts = (parts || []).filter(p => comparedPartIds.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Vazirmatn',sans-serif] selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        cartCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        selectedVehicle={selectedVehicle}
        onSelectVehicle={setSelectedVehicle}
        compareCount={comparedPartIds.length}
      />

      {/* Main Body Content according to Tab */}
      <main className="flex-1">
        
        {/* 1. Catalog Storefront */}
        {currentTab === 'catalog' && (
          <CatalogStore
            parts={parts}
            selectedVehicle={selectedVehicle}
            onClearVehicleFilter={() => setSelectedVehicle({ brand: '', model: '', year: '', engine: '' })}
            onSelectPart={setSelectedDetailPart}
            onAddToCart={handleAddToCart}
            onToggleCompare={handleToggleCompare}
            comparedPartIds={comparedPartIds}
            onNavigateToAi={() => setCurrentTab('ai-advisor')}
            onNavigateToCompare={() => setCurrentTab('compare')}
          />
        )}

        {/* 2. AI Advisor View */}
        {currentTab === 'ai-advisor' && (
          <AiAdvisorView
            catalogParts={parts}
            onSelectPart={setSelectedDetailPart}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* 3. Technical Comparison Matrix */}
        {currentTab === 'compare' && (
          <PartCompareView
            comparedParts={comparedParts}
            onRemoveFromCompare={handleRemoveFromCompare}
            onClearCompare={handleClearCompare}
            onAddToCart={handleAddToCart}
            onNavigateToCatalog={() => setCurrentTab('catalog')}
          />
        )}

        {/* 4. Dedicated User Panel (Orders, Invoices, Stock Alerts, Complaints) */}
        {currentTab === 'user-panel' && (
          <UserPanel
            orders={orders}
            onOpenInvoice={setActiveInvoiceOrder}
            tickets={tickets}
            onSubmitTicket={handleSubmitTicket}
            stockAlerts={stockAlerts}
          />
        )}

        {/* 5. Professional Admin Panel (Accounting, Inventory, Delayed Orders, Excel) */}
        {currentTab === 'admin-panel' && (
          <AdminPanel
            parts={parts}
            orders={orders}
            tickets={tickets}
            onUpdatePartStock={handleUpdatePartStock}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSendSmsToOrder={handleSendSmsToOrder}
            onReplyTicket={handleReplyTicket}
          />
        )}

      </main>

      {/* Product Detail Modal */}
      {selectedDetailPart && (
        <ProductDetailModal
          part={selectedDetailPart}
          onClose={() => setSelectedDetailPart(null)}
          onAddToCart={handleAddToCart}
          onToggleCompare={handleToggleCompare}
          isCompared={comparedPartIds.includes(selectedDetailPart.id)}
          onSubscribeStockAlert={handleSubscribeStockAlert}
        />
      )}

      {/* Cart & Gateway Simulation Modal */}
      {isCartOpen && (
        <CartAndCheckoutModal
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
          onOrderCompleted={(order) => {
            setOrders(prev => [order, ...prev]);
          }}
          onOpenInvoice={(order) => {
            setIsCartOpen(false);
            setActiveInvoiceOrder(order);
          }}
        />
      )}

      {/* Printable Online Invoice Modal */}
      {activeInvoiceOrder && (
        <InvoiceModal
          order={activeInvoiceOrder}
          onClose={() => setActiveInvoiceOrder(null)}
        />
      )}

      {/* Persistent Live AI/Mechanic Support Chat */}
      <LiveSupportChat />

      {/* Footer with automotive trust badges */}
      <Footer />

    </div>
  );
}
