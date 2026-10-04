import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from './components/ui/Toast';
import { useAuthStore } from './store/authStore';
import TopBar from './components/layout/TopBar';
import Header from './components/layout/Header';
import NavMenu from './components/layout/NavMenu';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import ProtectedRoute from './routes/ProtectedRoute';
import { lazy, Suspense } from 'react';
import RequireAdmin from './routes/RequireAdmin';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Policy from './pages/Policy';
import ScrollToTop from './components/ui/ScrollToTop';
import TrackOrder from './pages/TrackOrder';
import BulkOrder from './pages/BulkOrder';
import WhatsAppButton from './components/ui/WhatsAppButton';

const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const ProductList = lazy(() => import('./admin/pages/products/ProductList'));
const ProductForm = lazy(() => import('./admin/pages/products/ProductForm'));
const CategoryList = lazy(() => import('./admin/pages/categories/CategoryList'));
const CategoryForm = lazy(() => import('./admin/pages/categories/CategoryForm'));
const UserList = lazy(() => import('./admin/pages/users/UserList'));
const UserForm = lazy(() => import('./admin/pages/users/UserForm'));
const OrderList = lazy(() => import('./admin/pages/orders/OrderList'));
const OrderDetail = lazy(() => import('./admin/pages/orders/OrderDetail'));
const BulkEnquiryList = lazy(() => import('./admin/pages/bulk-enquiries/BulkEnquiryList'));

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  useEffect(() => { fetchMe(); }, [fetchMe]);

  return (
    <HelmetProvider>
      <ToastProvider>
        <ScrollToTop />
        <TopBar />
        <div className="hd-stack">
          <Header onCartClick={() => setCartOpen(true)} />
          <NavMenu />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/policy/:slug" element={<Policy />} />
          <Route path="/bulk-order" element={<BulkOrder />} />

          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<Account />} />
            <Route path="/account/orders" element={<Orders />} />
          </Route>
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<Suspense fallback={<p style={{ padding: 40 }}>Loading…</p>}><AdminLayout /></Suspense>}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id" element={<ProductForm />} />
              <Route path="categories" element={<CategoryList />} />
              <Route path="categories/new" element={<CategoryForm />} />
              <Route path="categories/:id" element={<CategoryForm />} />
              <Route path="users" element={<UserList />} />
              <Route path="users/new" element={<UserForm />} />
              <Route path="users/:id" element={<UserForm />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="bulk-enquiries" element={<BulkEnquiryList />} />
            </Route>
          </Route>
        </Routes>
        <Footer />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        <WhatsAppButton />
      </ToastProvider>
    </HelmetProvider>
  );
}