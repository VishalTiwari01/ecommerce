import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import CartSidebar from "./components/CartSidebar";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import ScrollToTop from './components/ScrollToTop';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Order from "./components/Order";

// ✅ Redux Imports
import { Provider } from "react-redux";
import { store } from "./redux/store";
import CategoryPage from "./pages/CategoryPage";
import ShippingReturnPolicy from "./components/ShippingReturnPolicy";
import TermsOfUse from "./components/TermsOfUse";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Disclaimer from "./components/Disclaimer";
import ShippingPolicy from "./components/ShippingPolicy";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}> {/* ✅ Redux Provider wrapper added */}
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <CartSidebar />
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/checkout" element={<Checkout />} />
               <Route path="/order/:userId" element={<Order />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/return-policy" element={<ShippingReturnPolicy />} />
              <Route path="/terms&use" element={<TermsOfUse />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
