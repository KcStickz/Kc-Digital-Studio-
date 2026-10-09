import React from 'react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import { CONTACT_INFO, STUDIO_SERVICES } from '../data/studioData';

interface FooterProps {
  onOpenPrivacyModal: () => void;
  onSelectService?: (serviceName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacyModal, onSelectService }) => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const navHeight = 70;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleServiceClick = (serviceName: string) => {
    if (onSelectService) {
      onSelectService(serviceName);
    }
    const servicesEl = document.getElementById('services');
    servicesEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#080A14] border-t border-[#282D40] pt-16 pb-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-[#FFA500]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#282D40]">
          {/* COLUMN 1: BRAND (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-4">
            <Logo size={36} />

            <p className="text-sm font-semibold text-[#FFA500] italic">
              "{CONTACT_INFO.tagline}"
            </p>

            <p className="text-xs sm:text-sm text-[#858DA2] leading-relaxed max-w-sm">
              Creative design, digital development, visual storytelling, and practical technology solutions.
            </p>

            {/* Availability Indicator */}
            <div className="pt-2 flex items-center gap-2 text-xs text-[#B8BDCA]">
              <span className="w-2 h-2 rounded-full bg-[#FFA500] animate-pulse" />
              <span>Studio based in Port Harcourt, Nigeria</span>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS (2 Cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-xs text-[#B8BDCA] hover:text-[#FFA500] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: OUR SERVICES (3 Cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Our Services
            </h4>
            <ul className="grid grid-cols-1 gap-2">
              {STUDIO_SERVICES.map((srv) => (
                <li key={srv.id}>
                  <button
                    type="button"
                    onClick={() => handleServiceClick(srv.name)}
                    className="text-xs text-[#B8BDCA] hover:text-[#FFA500] transition-colors text-left"
                  >
                    {srv.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: CONTACT (3 Cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <div className="space-y-3 text-xs text-[#B8BDCA]">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#FFA500] shrink-0 mt-0.5" />
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="hover:text-[#FFA500] transition-colors break-all"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#FFA500] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 font-mono">
                  <a
                    href={`tel:${CONTACT_INFO.phone1.replace(/\s+/g, '')}`}
                    className="hover:text-[#FFA500] transition-colors"
                  >
                    {CONTACT_INFO.phone1}
                  </a>
                  <a
                    href={`tel:${CONTACT_INFO.phone2.replace(/\s+/g, '')}`}
                    className="hover:text-[#FFA500] transition-colors"
                  >
                    {CONTACT_INFO.phone2}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFA500] shrink-0 mt-0.5" />
                <span>{CONTACT_INFO.location}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#282D40]/50">
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:underline font-semibold"
              >
                <span>Direct WhatsApp Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#858DA2]">
          <p>© 2026 KC Digital Studio. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenPrivacyModal}
              className="hover:text-[#FFA500] transition-colors underline focus:outline-none"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <span>Port Harcourt, Rivers State, Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
