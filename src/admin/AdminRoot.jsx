import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AdminLayout from './AdminLayout';
import Login from './Login';
import Dashboard from './pages/Dashboard';
import Inquiries from './pages/Inquiries';
import Testimonials from './pages/Testimonials';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import BlogEditor from './pages/BlogEditor';
import Seo from './pages/Seo';
import Newsletter from './pages/Newsletter';
import Settings from './pages/Settings';

function Guard({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route
        element={
          <Guard>
            <AdminLayout />
          </Guard>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard"    element={<Dashboard />} />
        <Route path="inquiries"    element={<Inquiries />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="services"     element={<Services />} />
        <Route path="portfolio"    element={<Portfolio />} />
        <Route path="blog"         element={<Blog />} />
        <Route path="blog/new"     element={<BlogEditor />} />
        <Route path="blog/:id/edit" element={<BlogEditor />} />
        <Route path="seo"          element={<Seo />} />
        <Route path="newsletter"   element={<Newsletter />} />
        <Route path="settings"     element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default function AdminRoot() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}
