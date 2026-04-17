/*
Gym Management Application - Main App Component
Handles routing, authentication, and overall application structure
Provides public and protected routes for gym members and administrators
*/

import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AdminRoute from './components/AdminRoute/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import LoadingSpinner from './components/UI/LoadingSpinner';

const Home = lazy(() => import('./pages/Home/Home'));
const About = lazy(() => import('./pages/About/About'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Login = lazy(() => import('./pages/Login/Login'));
const Signup = lazy(() => import('./pages/Signup/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword/ForgotPassword'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const SuccessStories = lazy(() => import('./pages/Transformations/Transformations'));
const DietPlan = lazy(() => import('./pages/DietPlan/DietPlan'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard/AdminDashboard'));
const AdminTransformations = lazy(() => import('./pages/AdminTransformations/AdminTransformations'));

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
          <Suspense fallback={<LoadingSpinner overlay text="Loading..." />}>
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
          </Suspense>
        </ConfigProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
