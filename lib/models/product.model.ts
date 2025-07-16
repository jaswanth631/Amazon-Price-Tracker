import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  asin: { type: String, required: true, unique: true },
  productUrl: { type: String, required: true },
  imageUrl: { type: String, required: true },
  isAvailable: { type: Boolean, required: true },
  sellerType: { type: String, enum: ['Amazon', 'ThirdPartyNew', 'ThirdPartyUsed'], required: true },
  marketplace: { type: String, required: true },
  priceHistory: [
    {
      price: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now },
      sellerType: { type: String, enum: ['Amazon', 'ThirdPartyNew', 'ThirdPartyUsed'], required: true },
      condition: { type: String, required: true },
    },
  ],
  alerts: [
    {
      targetPrice: { type: Number, required: true },
      alertType: { type: String, enum: ['priceDrop', 'availability'], required: true },
      notificationChannel: { type: String, enum: ['email', 'pushNotification'], required: true },
      isActive: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  currency: { type: String, required: true },
  title: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  lowestPrice: { type: Number },
  highestPrice: { type: Number },
  discountRate: { type: Number },
  isOutOfStock: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;