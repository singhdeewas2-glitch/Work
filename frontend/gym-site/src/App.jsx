/*
Gym Management Application - Main App Component
Handles routing, authentication, and overall application structure
Provides public and protected routes for gym members and administrators
*/

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Profile from './pages/Profile/Profile';
import SuccessStories from './pages/Transformations/Transformations';
import DietPlan from './pages/DietPlan/DietPlan';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AdminRoute from './components/AdminRoute/AdminRoute';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminTransformations from './pages/AdminTransformations/AdminTransformations';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import { useLocation } from 'react-router-dom';

function RouteObserver() {
  const location = useLocation();

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, [location.pathname]);

  return null;
}

function App() {

  return (
    <Router>
      <RouteObserver />
      <AuthProvider>
        <ConfigProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/diet-plan" element={
                <PrivateRoute>
                  <DietPlan />
                </PrivateRoute>
              } />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/transformations" element={
                <AdminRoute>
                  <AdminTransformations />
                </AdminRoute>
              } />
            </Route>
          </Routes>
        </ConfigProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
