import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle, CreditCard } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const mockOrder = {
  'ORDER-123456789': {
    id: 'ORDER-123456789',
    date: 'Oct 27, 2023',
    status: 'Delivered',
    subtotal: 125.99,
    shipping: 5.00,
    tax: 10.10,
    total: 141.09,
    paymentMethod: 'Visa ending in 4242',
    shippingAddress: {
      name: 'John Doe',
      street: '123 Playful Lane',
      city: 'Toytown',
      state: 'CA',
      zip: '90210',
      country: 'USA',
    },
    products: [
      {
        id: 1,
        name: 'Magical Building Blocks',
        image: 'https://images.unsplash.com/photo-1627916528994-e3496924e23c?q=80&w=1974&auto=format&fit=crop',
        price: 49.99,
        quantity: 1,
      },
      {
        id: 2,
        name: 'Cosmic Water Bottle',
        image: 'https://images.unsplash.com/photo-1596180595150-1372a9b40090?q=80&w=1964&auto=format&fit=fit',
        price: 25.00,
        quantity: 2,
      },
      {
        id: 3,
        name: 'Dino-Mite Backpack',
        image: 'https://images.unsplash.com/photo-1632738740510-911181829e18?q=80&w=1964&auto=format&fit=fit',
        price: 25.00,
        quantity: 1,
      },
    ],
    timeline: [
      { status: 'Order Placed', date: 'Oct 27, 2023', time: '10:00 AM' },
      { status: 'Shipped', date: 'Oct 28, 2023', time: '02:30 PM' },
      { status: 'Out for Delivery', date: 'Oct 29, 2023', time: '08:00 AM' },
      { status: 'Delivered', date: 'Oct 29, 2023', time: '04:15 PM' },
    ],
  },
  'ORDER-987654321': {
    id: 'ORDER-987654321',
    date: 'Oct 25, 2023',
    status: 'Shipped',
    subtotal: 75.50,
    shipping: 5.00,
    tax: 6.04,
    total: 86.54,
    paymentMethod: 'PayPal',
    shippingAddress: {
      name: 'Jane Smith',
      street: '456 Adventure St',
      city: 'Fantasyburg',
      state: 'NY',
      zip: '10001',
      country: 'USA',
    },
    products: [
      {
        id: 4,
        name: 'Unicorn Plush Toy',
        image: 'https://images.unsplash.com/photo-1614742784795-c26645369c0d?q=80&w=1964&auto=format&fit=crop',
        price: 35.50,
        quantity: 1,
      },
      {
        id: 5,
        name: 'Superhero Cape',
        image: 'https://images.unsplash.com/photo-1608677443194-279c29d675b3?q=80&w=1974&auto=format&fit=crop',
        price: 40.00,
        quantity: 1,
      },
    ],
    timeline: [
      { status: 'Order Placed', date: 'Oct 25, 2023', time: '12:00 PM' },
      { status: 'Shipped', date: 'Oct 26, 2023', time: '05:00 PM' },
    ],
  },
};

const Order = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Simulate API fetch using the orderId from URL params
    const fetchOrder = setTimeout(() => {
      setOrder(mockOrder[orderId]);
    }, );

    return () => clearTimeout(fetchOrder);
  }, [orderId]);

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-background text-foreground">
        <motion.div
          className="text-2xl font-semibold text-primary"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5,  }}
        >
          Loading Order Details...
        </motion.div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed':
        return <Package className="w-6 h-6 text-primary" />;
      case 'Shipped':
        return <Truck className="w-6 h-6 text-yellow-500" />;
      case 'Out for Delivery':
        return <Truck className="w-6 h-6 text-yellow-500" />;
      case 'Delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Package className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const isStatusCompleted = (timelineStatus) => {
    const currentStatusIndex = order.timeline.findIndex(item => item.status === order.status);
    const timelineStatusIndex = order.timeline.findIndex(item => item.status === timelineStatus);
    return timelineStatusIndex <= currentStatusIndex;
  };

  return (
    <motion.div
      className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-64px)] bg-background text-foreground"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-card p-6 rounded-2xl shadow-playful space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 border-border">
          <motion.h1
            className="text-3xl sm:text-4xl font-extrabold text-primary"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            Order Details
          </motion.h1>
          <div className="mt-2 sm:mt-0 text-right">
            <p className="text-lg font-bold text-muted-foreground">Order #{order.id}</p>
            <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
          </div>
        </header>

        {/* Order Status Timeline */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Order Status</h2>
          <div className="relative flex justify-between items-center w-full px-2 sm:px-8">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-border transform -translate-y-1/2 mx-2 sm:mx-8"></div>
            {order.timeline.map((item, index) => (
              <div key={index} className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300
                    ${isStatusCompleted(item.status) ? 'bg-secondary' : 'bg-muted-foreground'}`}
                >
                  {getStatusIcon(item.status)}
                </div>
                <div className="text-center mt-2">
                  <p className="text-sm font-semibold text-foreground hidden sm:block">{item.status}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Product List */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Order Items</h2>
          <ul className="space-y-4">
            <AnimatePresence>
              {order.products.map((product) => (
                <motion.li
                  key={product.id}
                  className="flex flex-col sm:flex-row items-center bg-muted rounded-xl p-4 shadow-sm"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * product.id }}
                  whileHover={{ scale: 1.02, backgroundColor: 'hsl(var(--secondary))' }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 rounded-lg object-cover mr-4 mb-4 sm:mb-0"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">Quantity: {product.quantity}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-right">
                    <span className="text-lg font-bold text-primary">${(product.price * product.quantity).toFixed(2)}</span>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </section>

        {/* Order Summary & Shipping */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Order Summary</h2>
            <div className="p-6 bg-muted rounded-2xl shadow-inner space-y-2">
              <div className="flex justify-between text-foreground">
                <span className="text-sm">Subtotal:</span>
                <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span className="text-sm">Shipping:</span>
                <span className="font-semibold">${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span className="text-sm">Tax:</span>
                <span className="font-semibold">${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2 mt-4 text-muted-foreground">
                <CreditCard size={20} />
                <span className="text-sm">{order.paymentMethod}</span>
              </div>
            </div>
          </section>

          {/* Shipping Information */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Shipping Information</h2>
            <motion.div
              className="p-6 bg-muted rounded-2xl shadow-inner"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <p className="font-semibold text-lg text-foreground">{order.shippingAddress.name}</p>
              <p className="text-muted-foreground">{order.shippingAddress.street}</p>
              <p className="text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              <p className="text-muted-foreground">{order.shippingAddress.country}</p>
            </motion.div>
          </section>
        </div>

        <div className="flex justify-center pt-4">
          <Link to="/" className="text-primary hover:underline font-semibold transition-colors duration-200">
            Continue Shopping
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Order;