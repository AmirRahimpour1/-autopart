export interface CarModel {
  id: string;
  brand: string;
  model: string;
  years: string;
  engine: string;
}

export interface Part {
  id: string;
  name: string;
  oemCode: string;
  brand: string;
  category: 'engine' | 'brake' | 'suspension' | 'electrical' | 'cooling' | 'filter' | 'body';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  inStock: number;
  minStockThreshold: number;
  isOriginal: boolean;
  warrantyMonths: number;
  compatibleCars: string[]; // e.g. ["پژو 206 تیپ 5", "پژو 207", "رانا"]
  countryOfOrigin: string;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  technicalSpecs: { [key: string]: string };
  syncPlatforms?: { [platform: string]: boolean };
}

export interface Review {
  id: string;
  partId: string;
  author: string;
  carModel: string;
  rating: number;
  date: string;
  comment: string;
  isVerifiedBuyer: boolean;
}

export interface OrderItem {
  partId: string;
  partName: string;
  oemCode: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  trackingCode: string;
  postalCodeTracking?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  taxAmount: number;
  shippingFee: number;
  finalAmount: number;
  paymentMethod: 'online' | 'card_to_card' | 'wallet';
  paymentStatus: 'paid' | 'pending' | 'failed';
  orderStatus: 'registered' | 'processing' | 'shipped' | 'delivered' | 'delayed';
  createdAt: string;
  estimatedDelivery: string;
  notes?: string;
  smsNotificationsSent: string[];
}

export interface StockAlert {
  id: string;
  partId: string;
  partName: string;
  customerPhone: string;
  requestedAt: string;
  isNotified: boolean;
}

export interface Ticket {
  id: string;
  customerName: string;
  customerPhone: string;
  type: 'support' | 'complaint' | 'inquiry' | 'return';
  title: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  reply?: string;
}

export interface SelectedVehicle {
  brand: string;
  model: string;
  year?: string;
  engine?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'support' | 'ai' | 'agent';
  text: string;
  timestamp: string;
  suggestedParts?: Partial<Part>[];
}

export interface AccountingTransaction {
  id: string;
  type: 'sale' | 'purchase' | 'salary' | 'shipping' | 'tax' | 'refund';
  title: string;
  amount: number;
  date: string;
  referenceNumber: string;
  party: string;
  category: 'درآمد' | 'هزینه' | 'بدهکار' | 'بستانکار';
  invoiceId?: string;
}

export interface AccountingSummary {
  totalRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
  vatPayable: number;
  accountsReceivable: number;
  accountsPayable: number;
  cashInGateway: number;
  monthlyComparison: { month: string; sales: number; expenses: number; profit: number }[];
}
