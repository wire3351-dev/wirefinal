import { Toaster } from "@/components/ui/toaster";
import { Toaster as AppToaster } from "@/components/ui/toaster";
import { SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OwnerAuthProvider } from "@/context/OwnerAuthContext";
import { UserAuthProvider } from "@/context/UserAuthContext";
import SiteHeader from "@/components/layout/SiteHeader";
import Index from "./pages/Index";
import Inquiry from "./pages/Inquiry";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerLogin from "./pages/OwnerLogin";
import AboutUs from "./pages/AboutUs";
import ReturnShippingPolicy from "./pages/ReturnShippingPolicy";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppToaster />
      <SonnerToaster />
      <OwnerAuthProvider>
        <UserAuthProvider>
          <BrowserRouter>
            <SiteHeader />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/inquiry" element={<Inquiry />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/return-shipping-policy" element={<ReturnShippingPolicy />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/owner/login" element={<OwnerLogin />} />
              <Route path="/owner" element={<OwnerDashboard />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </UserAuthProvider>
      </OwnerAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
