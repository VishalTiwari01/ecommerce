import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, CreditCard } from 'lucide-react';
import { getUserOrders } from '../APi/api.js'; // Adjust path as needed

const Order = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  const fetchOrders = async () => {
    try {
      const data = await getUserOrders(userId);

      if (Array.isArray(data) && data.length > 0) {
        const sortedOrders = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } else {
        setError('No orders found.');
      }
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

  // helper to pick image for item
  const getItemImage = (item) => {
    // Prefer explicit image field saved on order item
    if (item.image && typeof item.image === 'string' && item.image.trim().length > 0) {
      return item.image;
    }
    // fallback common fields
    if (item.imageUrl && typeof item.imageUrl === 'string' && item.imageUrl.trim().length > 0) {
      return item.imageUrl;
    }
    // placeholder
    return 'https://via.placeholder.com/150?text=No+Image';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order, index) => (
          <motion.div
            key={order._id || index}
            className="border rounded-md shadow-sm p-6 bg-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-800">Order #{order?.orderNumber}</h2>
                <p className="text-sm text-gray-500">Status: {order?.status ?? order?.orderStatus ?? '—'}</p>
              </div>
              {getStatusIcon(order?.status ?? order?.orderStatus)}
            </div>

            <div className="border-t pt-4 space-y-4">
              {order?.items?.length > 0 ? (
                order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={getItemImage(item)}
                        alt={item.productName || 'product'}
                        className="w-14 h-14 object-cover rounded border"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{item.productName}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>

                        {/* optional: show selected color if present */}
                        {(item.selectedColor || item.selectedColorHex) && (
                          <div className="mt-1 flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: item.selectedColorHex ?? item.selectedColor }}
                            />
                            <span className="text-xs text-gray-500">
                              {item.selectedColor ?? item.selectedColorHex}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      ₹{order.subtotal?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No items found in this order.</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm text-gray-700">
              {/* Order Summary */}
              <div className="space-y-1">
                <p className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{order.subtotal?.toFixed(2) || '0.00'}</span>
                </p>
                <p className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{order.taxAmount?.toFixed(2) || '0.00'}</span>
                </p>
                {/* <p className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{order.shippingAmount?.toFixed(2) || '0.00'}</span>
                </p> */}
                {order.discountAmount > 0 && (
                  <p className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₹{order.discountAmount.toFixed(2)}</span>
                  </p>
                )}
                <p className="flex justify-between font-semibold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>₹{order.totalAmount?.toFixed(2) || '0.00'}</span>
                </p>
                <p className="flex items-center gap-1 text-gray-500 mt-2">
                  <CreditCard size={16} /> {order.paymentMethod}
                </p>
              </div>

              {/* optional: shipping address / meta */}
              <div>
                <h4 className="font-semibold mb-2">Shipping</h4>
                <div className="text-sm text-gray-600">
                  <p>{order.shippingAddress?.name ?? '—'}</p>
                  <p>
                    {order.shippingAddress?.addressLine1 ?? ''} {order.shippingAddress?.addressLine2 ?? ''}
                  </p>
                  <p>
                    {order.shippingAddress?.city ?? ''}, {order.shippingAddress?.state ?? ''}{' '}
                    {order.shippingAddress?.postalCode ?? ''}
                  </p>
                  <p>{order.shippingAddress?.phone ?? ''}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link to="/" className="text-blue-600 hover:underline font-medium">
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Order;
