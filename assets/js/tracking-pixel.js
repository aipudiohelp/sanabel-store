// assets/js/tracking-pixel.js
window.SanabelTracking = {
  trackViewProduct(product) {
    if (typeof fbq === 'function') {
      fbq('track', 'ViewContent', {
        content_name: product.title,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'EGP'
      });
    }
  },

  trackAddToCart(product) {
    if (typeof fbq === 'function') {
      fbq('track', 'AddToCart', {
        content_name: product.title,
        content_ids: [product.id],
        value: product.price,
        currency: 'EGP'
      });
    }
  },

  trackPurchase(order) {
    if (typeof fbq === 'function') {
      fbq('track', 'Purchase', {
        value: order.total,
        currency: 'EGP',
        num_items: order.items.length
      });
    }
  }
};
