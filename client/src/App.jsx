import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Programs from './pages/Programs';
import CourseDetails from './pages/CourseDetails';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PaymentStatus from './pages/PaymentStatus';
import CalorieCalculator from './pages/CalorieCalculator';
import TermsAndConditions from './pages/TermsAndConditions';

import { CartProvider } from './context/CartContext';
import ScrollToTop from './components/ScrollToTop';
import AnalyticsLoader from './components/AnalyticsLoader';

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <AnalyticsLoader />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calorie-calculator" element={<CalorieCalculator />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
}

export default App;
