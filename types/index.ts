export type PriceHistoryItem = {
  price: number;
};

export type User = {
  email: string;
};

export type Product = {
  _id?: string;
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: PriceHistoryItem[] | [];
  highestPrice: number;
  lowestPrice: number;
  averagePrice: number;
  discountRate: number;
  description: string;
  category: string;
  reviewsCount: number;
  stars: number;
  isOutOfStock: Boolean;
  users?: User[];
};

export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  url: string;
};

// Seller type enum
export enum SellerType {
  Amazon = 'Amazon',
  ThirdPartyNew = 'ThirdPartyNew',
  ThirdPartyUsed = 'ThirdPartyUsed',
}

// Alert type enum
export enum AlertType {
  PriceDrop = 'priceDrop',
  Availability = 'availability',
}

// Notification channel enum
export enum NotificationChannel {
  Email = 'email',
  PushNotification = 'pushNotification',
}

// Price record with seller type and condition
export interface IPriceRecord {
  price: number;
  timestamp: Date;
  sellerType: SellerType;
  condition: string; // e.g., 'New', 'Used - Like New', etc.
}

// Alert preference
export interface IAlert {
  targetPrice: number;
  alertType: AlertType;
  notificationChannel: NotificationChannel;
  isActive: boolean;
  createdAt: Date;
}

// Tracked product interface
export interface ITrackedProduct {
  asin: string;
  title: string;
  currentPrice: number;
  currency: string;
  imageUrl: string;
  productUrl: string;
  lowestPriceEver: number;
  highestPriceEver: number;
  lastUpdated: Date;
  isAvailable: boolean;
  sellerType: SellerType;
  priceHistory: IPriceRecord[];
  marketplace: string; // e.g., 'amazon.com', 'amazon.co.uk'
  alerts: IAlert[];
  predictedOptimalBuyPrice?: number;
  predictedDropDate?: Date;
}

// User type with tracked products and alerts
export interface IUser {
  email: string;
  passwordHash: string;
  trackedProducts: string[]; // Array of ASINs
  alerts: IAlert[];
}
