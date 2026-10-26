/**
 * KC NEXUS
 * Official Multi-Page Creative & Digital Application
 * Directed by OKO-OBENI KELECHI SALVATION
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import ServicesPage from './pages/ServicesPage';
import StudioPage from './pages/StudioPage';
import ContactPage from './pages/ContactPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import { AuthProvider } from './firebase/authContext';
import { SupabaseAuthProvider } from './supabase/authContext';

export default function App() {
  return (
    <AuthProvider>
      <SupabaseAuthProvider>
        <BrowserRouter>
        <Routes>
          {/* Public Routes with Global Layout (Header, Footer, Modals) */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/studio" element={<StudioPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          </Route>

          {/* Secure Administration Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SupabaseAuthProvider>
  </AuthProvider>
  );
}
