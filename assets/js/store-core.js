// assets/js/store-core.js
const SanabelStore = {
  // مفتاح التخزين المحلي
  STORAGE_KEY: 'sanabel_cart_v1',
  FREE_SHIPPING_THRESHOLD: 1200, // حد الشحن المجاني بالجنيه
  SHIPPING_FEE: 45,

  // جلب السلة الحالية
  getCart() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // حفظ السلة وتحديث الواجهات
  saveCart(cart) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    this.updateUI();
  },

  // إضافة منتج للسلة
  addItem(product) {
    let cart = this.getCart();
    const existingIndex = cart.findIndex(item => 
      item.id === product.id && item.color === product.color && item.size === product.size
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += (product.quantity || 1);
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        color: product.color || 'أساسي',
        size: product.size || 'موحد',
        quantity: product.quantity || 1
      });
    }

    this.saveCart(cart);
    
    // إطلاق حدث التتبع Meta Pixel
    if (window.SanabelTracking) {
      window.SanabelTracking.trackAddToCart(product);
    }
  },

  // حذف منتج
  removeItem(index) {
    let cart = this.getCart();
    cart.splice(index, 1);
    this.saveCart(cart);
  },

  // حساب الإجماليات
  getTotals() {
    const cart = this.getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const isFreeShipping = subtotal >= this.FREE_SHIPPING_THRESHOLD;
    const shipping = subtotal === 0 ? 0 : (isFreeShipping ? 0 : this.SHIPPING_FEE);
    const total = subtotal + shipping;

    return { subtotal, count, shipping, total, isFreeShipping, remainingForFree: Math.max(0, this.FREE_SHIPPING_THRESHOLD - subtotal) };
  },

  // تحديث عدادات السلة في كامل الموقع
  updateUI() {
    const totals = this.getTotals();
    
    // تحديث أيقونة السلة العلوية
    document.querySelectorAll('.cart-badge-count').forEach(el => {
      el.textContent = totals.count;
      el.style.display = totals.count > 0 ? 'flex' : 'none';
    });

    // تحديث أسعار البار الثابت السفلي
    document.querySelectorAll('.cart-dynamic-subtotal').forEach(el => {
      el.textContent = `${totals.subtotal} ج.م`;
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  SanabelStore.updateUI();
});
