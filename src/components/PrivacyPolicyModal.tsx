import React, { useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { CONTACT_INFO } from '../data/studioData';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-[#0D111E] border border-[#282D40] rounded-2xl overflow-hidden shadow-2xl flex flex-col p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#282D40]">
          <div className="flex items-center gap-2 text-[#FFA500]">
            <ShieldCheck className="w-5 h-5" />
            <h3 id="privacy-modal-title" className="text-lg font-bold text-white">
              Privacy Policy & Client Notice
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#858DA2] hover:text-white hover:bg-[#282D40] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-4 text-xs sm:text-sm text-[#B8BDCA] leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          <p>
            <strong className="text-white">Effective Date:</strong> January 2026
          </p>
          <p>
            Welcome to {CONTACT_INFO.brandName}. We respect your privacy and are committed to protecting the confidential project information and personal contact details you share with us.
          </p>
          <h4 className="font-semibold text-white pt-2">1. Information Collection</h4>
          <p>
            When you submit a project enquiry via our contact form or contact us via WhatsApp/Email, we collect only necessary project requirements, your name, and your contact info solely to evaluate and respond to your creative and technical brief.
          </p>
          <h4 className="font-semibold text-white pt-2">2. Client Confidentiality</h4>
          <p>
            All design concepts, source code, video rushes, photography files, and business assets entrusted to {CONTACT_INFO.brandName} remain strictly confidential.
          </p>
          <h4 className="font-semibold text-white pt-2">3. Direct Contact</h4>
          <p>
            If you have questions regarding your project data or privacy, contact us directly at{' '}
            <a href={`mailto:${CONTACT_INFO.email}`} className="text-[#FFA500] hover:underline">
              {CONTACT_INFO.email}
            </a>.
          </p>
        </div>

        <div className="pt-4 border-t border-[#282D40] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#121727] hover:bg-[#282D40] text-white text-xs font-semibold border border-[#282D40] transition-colors"
          >
            Close Notice
          </button>
        </div>
      </div>
    </div>
  );
};
