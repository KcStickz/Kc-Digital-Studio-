/**
 * KC DIGITAL STUDIO
 * Official Creative & Digital Agency Website
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HighlightsSection from './components/HighlightsSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import PortfolioSection from './components/PortfolioSection';
import TestimonialsOrPrinciplesSection from './components/TestimonialsOrPrinciplesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { ShowreelModal } from './components/ShowreelModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { FeedbackModal } from './components/FeedbackModal';
import { ProjectItem } from './data/studioData';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState('Web Development');
  const [userReviews, setUserReviews] = useState<
    { clientName: string; projectType: string; comment: string; rating: number }[]
  >([]);

  // Intersection Observer to update active navigation tab based on scroll position
  useEffect(() => {
    const sectionIds = ['home', 'about', 'services', 'portfolio', 'contact'];
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop - offset <= scrollY) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectServiceForContact = (serviceName: string) => {
    setPreselectedService(serviceName);
  };

  const handleEnquireFromProject = (serviceName: string) => {
    setPreselectedService(serviceName);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      const navHeight = 70;
      const elementPosition = contactEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleAddFeedback = (feedback: {
    clientName: string;
    projectType: string;
    comment: string;
    rating: number;
  }) => {
    setUserReviews((prev) => [feedback, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#080A14] text-white flex flex-col font-sans selection:bg-[#FFA500] selection:text-black">
      {/* Top Navigation Bar */}
      <Navbar activeSection={activeSection} />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Four Horizontal Highlight Cards */}
        <HighlightsSection onSelectService={handleSelectServiceForContact} />

        {/* Two-Column About Section */}
        <AboutSection
          onOpenShowreel={() => setShowreelOpen(true)}
          onSelectService={handleSelectServiceForContact}
        />

        {/* Services Section with 8 Detailed Service Cards */}
        <ServicesSection
          onSelectServiceForContact={handleSelectServiceForContact}
          selectedFilterService={preselectedService}
        />

        {/* Portfolio Section with Category Filters & Four-Column Grid */}
        <PortfolioSection
          onOpenProjectModal={(proj) => setSelectedProject(proj)}
        />

        {/* Studio Principles / Testimonials Section */}
        <TestimonialsOrPrinciplesSection
          onOpenFeedbackModal={() => setFeedbackOpen(true)}
          userReviews={userReviews}
        />

        {/* Two-Column Contact Section with Authentic Nigerian Details & Form */}
        <ContactSection preselectedService={preselectedService} />
      </main>

      {/* Multi-Column Footer */}
      <Footer
        onOpenPrivacyModal={() => setPrivacyOpen(true)}
        onSelectService={handleSelectServiceForContact}
      />

      {/* Interactive Modals */}
      <ShowreelModal
        isOpen={showreelOpen}
        onClose={() => setShowreelOpen(false)}
        onSelectService={handleSelectServiceForContact}
      />

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onEnquireProject={handleEnquireFromProject}
      />

      <PrivacyPolicyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />

      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        onSubmitFeedback={handleAddFeedback}
      />
    </div>
  );
}
