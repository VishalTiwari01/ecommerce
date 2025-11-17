// Order.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, CreditCard } from 'lucide-react';
import { getUserOrders } from '../APi/api.js';

// Inline SVG placeholder (no external network call)
const INLINE_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
     <rect width='100%' height='100%' fill='#f3f4f6'/>
     <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial' font-size='18'>No Image</text>
   </svg>`
)}`;

const Order = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders(userId);
        console.debug('[getUserOrders] raw response:', data);

        let normalized = [];

        if (Array.isArray(data)) normalized = data;
        else if (data && typeof data === 'object') {
          if (Array.isArray(data.orders)) normalized = data.orders;
          else if (data._id || data.orderId || data.orderNumber) normalized = [data];
          else {
            const maybeArray = Object.values(data).find(v => Array.isArray(v));
            if (Array.isArray(maybeArray)) normalized = maybeArray;
          }
        }

        if (!Array.isArray(normalized) || normalized.length === 0) {
          setError('No orders found.');
          setOrders([]);
          return;
        }

        const mapped = normalized.map((order) => {
          // If items exist, normalize variantImage for each item
          if (Array.isArray(order.items) && order.items.length > 0) {
            const normalizedItems = order.items.map(it => {
              const variantObj = it.variantId || it.variant || {};
              const variantImage = extractImageFromVariantObject(variantObj);
              return { ...it, variantImage };
            });
            return { ...order, items: normalizedItems };
          }

          // Fallback: build items using productId + variantId pattern
          const fallbackItems = [];
          if (order.productId) {
            const prod = order.productId;
            const variant = order.variantId || order.variant || {};
            const qty = order.quantity ?? 1;
            const unitPrice = order.unitPrice ?? order.priceAdjustment ?? (order.subtotal ?? 0);
            const variantImage = extractImageFromVariantObject(variant);

            fallbackItems.push({
              productId: typeof prod === 'object' ? prod._id : prod,
              productName: prod?.name ?? prod?.title ?? 'Product',
              description: prod?.description ?? '',
              imageUrl: prod?.imageUrl ?? prod?.images ?? order.imageUrl ?? null,
              variantId: variant?._id ?? variant?.id ?? null,
              variantType: variant?.variantType ?? order.variantType ?? variant?.type ?? null,
              variantValue: variant?.variantValue ?? order.variantValue ?? variant?.value ?? null,
              variantImage, // prioritized variant image
              quantity: qty,
              unitPrice,
              totalPrice: order.totalPrice ?? order.subtotal ?? unitPrice * qty,
              rawOrderRef: order,
            });
          }

          return { ...order, items: fallbackItems };
        });

        // Sort newest first
        const sorted = mapped.sort((a, b) => new Date(b.createdAt || b.registrationDate || 0) - new Date(a.createdAt || a.registrationDate || 0));
        setOrders(sorted);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // helper: extract an image url from a variant-like object (handles array/object/string shapes)
  function extractImageFromVariantObject(variant) {
    if (!variant) return null;

    // variant.imageUrl could be:
    // - an array of objects [{ imageUrl: '...' }, ...]
    // - an array of strings ['url1', 'url2']
    // - a string 'https://...'
    // - object { imageUrl: '...' }
    try {
      if (Array.isArray(variant.imageUrl) && variant.imageUrl.length > 0) {
        const first = variant.imageUrl[0];
        if (typeof first === 'string') return first;
        if (first?.imageUrl) return first.imageUrl;
        if (first?.url) return first.url;
      }
      if (typeof variant.imageUrl === 'string' && variant.imageUrl) return variant.imageUrl;
      if (Array.isArray(variant.images) && variant.images.length > 0) {
        const f = variant.images[0];
        if (typeof f === 'string') return f;
        if (f?.imageUrl) return f.imageUrl;
      }
      if (typeof variant.image === 'string' && variant.image) return variant.image;
      if (variant?.imageUrl?.imageUrl) return variant.imageUrl.imageUrl;
    } catch (e) {
      return null;
    }
    return null;
  }

  const getStatusIcon = (status) => {
    switch ((status || '').toString().toLowerCase()) {
      case 'order placed':
      case 'placed':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'shipped':
      case 'out for delivery':
        return <Truck className="w-5 h-5 text-yellow-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-400" />;
    }
  };

  // Final resolver: PRIORITY -> item.variantImage (from variantId) -> item.imageUrl / productId.imageUrl -> placeholder
  const getItemImage = (item) => {
    if (!item) return INLINE_PLACEHOLDER;

    // 1) Priority: variantImage (normalized property)
    if (item.variantImage) {
      if (Array.isArray(item.variantImage) && item.variantImage.length > 0) {
        const first = item.variantImage[0];
        if (typeof first === 'string') return first;
        if (first?.imageUrl) return first.imageUrl;
        if (first?.url) return first.url;
      }
      if (typeof item.variantImage === 'string') return item.variantImage;
      if (item.variantImage?.imageUrl) return item.variantImage.imageUrl;
    }

    // 2) item-level image fields
    if (typeof item.image === 'string' && item.image) return item.image;
    if (typeof item.imageUrl === 'string' && item.imageUrl) return item.imageUrl;
    if (Array.isArray(item.imageUrl) && item.imageUrl.length > 0) {
      const first = item.imageUrl[0];
      return typeof first === 'string' ? first : first?.url ?? INLINE_PLACEHOLDER;
    }

    // 3) product object images
    if (item.productId && typeof item.productId === 'object') {
      const p = item.productId;
      if (Array.isArray(p.imageUrl) && p.imageUrl.length > 0) {
        const f = p.imageUrl[0];
        return typeof f === 'string' ? f : f?.imageUrl ?? f?.url ?? INLINE_PLACEHOLDER;
      }
      if (typeof p.imageUrl === 'string' && p.imageUrl) return p.imageUrl;
      if (Array.isArray(p.images) && p.images.length > 0) {
        const f = p.images[0];
        return typeof f === 'string' ? f : f?.imageUrl ?? f?.url ?? INLINE_PLACEHOLDER;
      }
      if (typeof p.image === 'string' && p.image) return p.image;
    }

    return INLINE_PLACEHOLDER;
  };

  const formatCurrency = (v) => {
    const num = Number(v ?? 0);
    return num.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-xl">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">Your Orders</h1>

      <div className="space-y-6">
        {orders.length === 0 && <p className="text-center text-gray-500">No orders to display.</p>}

        {orders.map((order, index) => (
          <motion.div
            key={order._id || order.orderId || index}
            className="border rounded-md shadow-sm p-6 bg-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-800">Order #{order?.orderNumber ?? order?.orderId ?? '—'}</h2>
                <p className="text-sm text-gray-500">Status: {order?.status ?? order?.paymentStatus ?? '—'}</p>
                <p className="text-xs text-gray-400">Ordered on: {new Date(order.createdAt ?? order.registrationDate ?? Date.now()).toLocaleString()}</p>
              </div>
              {getStatusIcon(order?.status ?? order?.orderStatus)}
            </div>

            <div className="border-t pt-4 space-y-4">
              {Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item, i) => {
                  const variantType = item.variantType ?? item.variant?.variantType ?? item.variantId?.variantType ?? item.variant?.type;
                  const variantValue = item.variantValue ?? item.variant?.variantValue ?? item.variantId?.variantValue ?? item.selectedColor ?? item.variant?.value;
                  const imageSrc = getItemImage(item);
                  const isColor = typeof variantType === 'string' && variantType.toLowerCase().includes('color');

                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={imageSrc}
                          alt={item.productName ?? item.name ?? item.productId?.name ?? 'product'}
                          onError={(e) => { e.currentTarget.src = INLINE_PLACEHOLDER; }}
                          className="w-14 h-14 object-cover rounded border"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            {item.productName ?? item.name ?? item.productId?.name ?? 'Product'}
                          </p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity ?? 1}</p>

                          {/* show variant label/value */}
                          {variantValue && !isColor && (
                            <p className="text-xs text-gray-500 mt-1">
                              {variantType ? `${variantType}: ` : ''}{variantValue}
                            </p>
                          )}

                          {/* show color swatch */}
                          {isColor && variantValue && (
                            <div className="mt-1 flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: variantValue }}
                                title={variantValue}
                              />
                              <span className="text-xs text-gray-500">{variantValue}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-sm font-semibold text-gray-800">
                        ₹{formatCurrency(item.totalPrice ?? item.unitPrice ?? item.price ?? order.subtotal ?? 0)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">No items found in this order.</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm text-gray-700">
              <div className="space-y-1">
                <p className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{formatCurrency(order.subtotal ?? 0)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{formatCurrency(order.taxAmount ?? 0)}</span>
                </p>
                {(order.discountAmount ?? 0) > 0 && (
                  <p className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₹{formatCurrency(order.discountAmount)}</span>
                  </p>
                )}
                <p className="flex justify-between font-semibold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>₹{formatCurrency(order.totalAmount ?? (order.subtotal ?? 0) + (order.taxAmount ?? 0) - (order.discountAmount ?? 0))}</span>
                </p>
                <p className="flex items-center gap-1 text-gray-500 mt-2">
                  <CreditCard size={16} /> {order.paymentMethod ?? order.paymentType ?? '—'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Shipping</h4>
                <div className="text-sm text-gray-600">
                  <p>{order.shippingAddress?.name ?? order.addresses?.[0]?.name ?? '—'}</p>
                  <p>{order.shippingAddress?.addressLine1 ?? order.addresses?.[0]?.addressLine1 ?? ''} {order.shippingAddress?.addressLine2 ?? ''}</p>
                  <p>{order.shippingAddress?.city ?? order.addresses?.[0]?.city ?? ''}, {order.shippingAddress?.state ?? order.addresses?.[0]?.state ?? ''} {order.shippingAddress?.postalCode ?? order.addresses?.[0]?.postalCode ?? ''}</p>
                  <p>{order.shippingAddress?.phone ?? order.addresses?.[0]?.phone ?? ''}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link to="/" className="text-blue-600 hover:underline font-medium">← Continue Shopping</Link>
      </div>
    </div>
  );
};

export default Order;
