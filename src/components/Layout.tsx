import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import { ShowreelModal } from './ShowreelModal';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { FeedbackModal } from './FeedbackModal';

export const Layout: React.FC = () => {
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [userReviews, setUserReviews] = useState<
    { clientName: string; projectType: string; comment: string; rating: number }[]
  >([]);

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
      <ScrollToTop />
      {/* Persistent Navigation */}
      <Navbar />

      {/* Dynamic Route Content */}
      <main className="flex-1">
        <Outlet
          context={{
            onOpenShowreel: () => setShowreelOpen(true),
            onOpenFeedback: () => setFeedbackOpen(true),
            userReviews,
          }}
        />
      </main>

      {/* Persistent Footer */}
      <Footer onOpenPrivacyModal={() => setPrivacyOpen(true)} />

      {/* Global Modals */}
      <ShowreelModal
        isOpen={showreelOpen}
        onClose={() => setShowreelOpen(false)}
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
};

export default Layout;
