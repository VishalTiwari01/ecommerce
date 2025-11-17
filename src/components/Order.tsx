import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, CreditCard } from 'lucide-react';
import { getUserOrders } from '../APi/api.js';

const Order = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders(userId);
        // DEBUG: always log raw response so you can inspect shape
        console.debug('[getUserOrders] raw response:', data);

        // Normalize: data might already be an array, or a single order, or an object with "orders" prop.
        let normalized = [];

        if (Array.isArray(data)) {
          normalized = data;
        } else if (data && typeof data === 'object') {
          // if API returned an object with orders property
          if (Array.isArray(data.orders)) {
            normalized = data.orders;
          } else if (data._id || data.orderId || data.orderNumber) {
            // single order object
            normalized = [data];
          } else {
            // unknown shape: try to find array values inside object
            const maybeArray = Object.values(data).find(v => Array.isArray(v));
            if (Array.isArray(maybeArray)) normalized = maybeArray;
          }
        }

        // If nothing found -> empty
        if (!Array.isArray(normalized) || normalized.length === 0) {
          setError('No orders found.');
          setOrders([]);
          return;
        }

        // Normalize each order: ensure order.items exists as array
        const mapped = normalized.map((order) => {
          // If items array exists, use it
          if (Array.isArray(order.items) && order.items.length > 0) {
            return order;
          }

          // Otherwise try to build items array from productId + variantId fields (based on your sample)
          const fallbackItems = [];
          if (order.productId) {
            const prod = order.productId;
            const variant = order.variantId || order.variant || {};
            // quantity might be at root or inside
            const qty = order.quantity ?? (order.items?.[0]?.quantity) ?? 1;
            // unitPrice or totalPrice
            const unitPrice = order.unitPrice ?? order.priceAdjustment ?? (order.subtotal ?? 0);
            fallbackItems.push({
              productId: typeof prod === 'object' ? prod._id : prod,
              productName: prod?.name ?? prod?.title ?? 'Product',
              description: prod?.description ?? '',
              imageUrl: prod?.imageUrl ?? prod?.images ?? order.imageUrl,
              variantId: variant?._id ?? variant?.id,
              variantType: variant?.variantType ?? order.variantType ?? variant?.type,
              variantValue: variant?.variantValue ?? order.variantValue ?? variant?.value,
              quantity: qty,
              unitPrice,
              totalPrice: order.totalPrice ?? order.subtotal ?? unitPrice * qty,
              rawOrderRef: order, // keep reference if needed
            });
          } else {
            // No productId: keep items empty
          }

          return {
            ...order,
            items: fallbackItems,
          };
        });

        // Sort by createdAt desc if available
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'Shipped':
      case 'Out for Delivery':
        return <Truck className="w-5 h-5 text-yellow-500" />;
      case 'Delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-400" />;
    }
  };

  const getItemImage = (item) => {
    if (!item) return 'https://via.placeholder.com/150?text=No+Image';
    if (typeof item.image === 'string' && item.image) return item.image;
    if (typeof item.imageUrl === 'string' && item.imageUrl) return item.imageUrl;
    if (Array.isArray(item.imageUrl) && item.imageUrl.length > 0) {
      const first = item.imageUrl[0];
      return typeof first === 'string' ? first : first?.url ?? 'https://via.placeholder.com/150?text=No+Image';
    }
    // try product object images
    if (item.productId && typeof item.productId === 'object') {
      const p = item.productId;
      if (typeof p.imageUrl === 'string') return p.imageUrl;
      if (Array.isArray(p.imageUrl) && p.imageUrl[0]) return p.imageUrl[0];
      if (Array.isArray(p.images) && p.images[0]) return typeof p.images[0] === 'string' ? p.images[0] : p.images[0]?.url;
    }
    return 'https://via.placeholder.com/150?text=No+Image';
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
                  const variantType = item.variantType ?? item.variant?.variantType ?? item.variantId?.variantType;
                  const variantValue = item.variantValue ?? item.variant?.variantValue ?? item.variantId?.variantValue ?? item.selectedColor ?? item.variantValue;
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={getItemImage(item)} alt={item.productName ?? 'product'} className="w-14 h-14 object-cover rounded border" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            {item.productName ?? item.name ?? item.productId?.name ?? 'Product'}
                          </p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity ?? 1}</p>

                          {/* show color swatch only if variantType indicates color and we have a value */}
                          {variantType && variantType.toLowerCase?.().includes('color') && variantValue && (
                            <div className="mt-1 flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: variantValue }} title={variantValue} />
                              <span className="text-xs text-gray-500">{variantValue}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-sm font-semibold text-gray-800">
                        ₹{((item.totalPrice ?? item.unitPrice ?? item.price ?? order.subtotal ?? 0)).toFixed(2)}
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
                  <span>₹{(order.subtotal ?? 0).toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{(order.taxAmount ?? 0).toFixed(2)}</span>
                </p>
                {order.discountAmount > 0 && (
                  <p className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₹{order.discountAmount.toFixed(2)}</span>
                  </p>
                )}
                <p className="flex justify-between font-semibold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>₹{(order.totalAmount ?? 0).toFixed(2)}</span>
                </p>
                <p className="flex items-center gap-1 text-gray-500 mt-2">
                  <CreditCard size={16} /> {order.paymentMethod ?? order.paymentType ?? '—'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Shipping</h4>
                <div className="text-sm text-gray-600">
                  <p>{order.shippingAddress?.name ?? '—'}</p>
                  <p>{order.shippingAddress?.addressLine1 ?? ''} {order.shippingAddress?.addressLine2 ?? ''}</p>
                  <p>{order.shippingAddress?.city ?? ''}, {order.shippingAddress?.state ?? ''} {order.shippingAddress?.postalCode ?? ''}</p>
                  <p>{order.shippingAddress?.phone ?? ''}</p>
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
