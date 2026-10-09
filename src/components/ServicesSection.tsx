import React, { useState } from 'react';
import {
  Globe,
  Terminal,
  PenTool,
  Camera,
  Video,
  Film,
  Share2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { STUDIO_SERVICES, ServiceItem } from '../data/studioData';

interface ServicesSectionProps {
  onSelectServiceForContact: (serviceName: string) => void;
  selectedFilterService?: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForContact,
  selectedFilterService,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return Globe;
      case 'Terminal':
        return Terminal;
      case 'PenTool':
        return PenTool;
      case 'Camera':
        return Camera;
      case 'Video':
        return Video;
      case 'Film':
        return Film;
      case 'Share2':
        return Share2;
      case 'ShieldCheck':
        return ShieldCheck;
      default:
        return Globe;
    }
  };

  const handleEnquiry = (service: ServiceItem) => {
    onSelectServiceForContact(service.name);
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

  return (
    <section id="services" className="relative py-16 sm:py-24 bg-[#080A14] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#FFA500]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            {/* Small Section Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121727] border border-[#282D40] text-[#FFA500] text-xs font-bold tracking-widest uppercase mb-3">
              Our Services
            </div>
            {/* Bold Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              What We Do
            </h2>
            {/* Supporting Text */}
            <p className="mt-3 text-sm sm:text-base text-[#B8BDCA] leading-relaxed">
              Creative and technical solutions designed to help brands communicate, connect, and grow.
            </p>
          </div>

          {/* Top-Right "View All Services →" Button */}
          <div className="shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById('services-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] hover:border-[#FFA500]/60 text-white text-xs sm:text-sm font-semibold transition-all group shadow-sm"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4 text-[#FFA500] transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* 8 Services Grid: 4 columns on desktop (2 rows of 4), 2 on tablet, 1-2 on mobile */}
        <div id="services-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STUDIO_SERVICES.map((service) => {
            const Icon = getServiceIcon(service.icon);
            const isHighlighted = selectedFilterService === service.name;
            const isExpanded = expandedId === service.id;

            return (
              <div
                key={service.id}
                className={`group relative bg-[#121727] hover:bg-[#161B2D] border ${
                  isHighlighted ? 'border-[#FFA500] shadow-[0_0_20px_rgba(255,165,0,0.2)]' : 'border-[#282D40]'
                } hover:border-[#FFA500]/60 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[0_10px_30px_rgba(255,165,0,0.1)] hover:-translate-y-1`}
              >
                <div>
                  {/* Orange Icon inside dark container */}
                  <div className="w-12 h-12 rounded-xl bg-[#080A14] border border-[#282D40] group-hover:border-[#FFA500]/60 flex items-center justify-center text-[#FFA500] mb-5 shadow-inner transition-colors">
                    <Icon className="w-6 h-6 stroke-[1.8] transition-transform group-hover:scale-110" />
                  </div>

                  {/* Service Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FFA500] transition-colors leading-snug">
                    {service.name}
                  </h3>

                  {/* Short Description */}
                  <p className="mt-2 text-xs text-[#B8BDCA] leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Feature Tags / Items */}
                  <ul className="mt-4 space-y-1.5 pt-3 border-t border-[#282D40]/60">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-[11px] text-[#858DA2] group-hover:text-white/80 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFA500]/70 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Expandable Overview details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-[#282D40] text-[11px] text-[#B8BDCA] leading-relaxed animate-fade-in">
                      {service.fullDesc}
                    </div>
                  )}
                </div>

                {/* Bottom Action: Service Enquiry Button */}
                <div className="mt-6 pt-4 border-t border-[#282D40]/80 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : service.id)}
                    className="text-[11px] text-[#858DA2] hover:text-white transition-colors"
                  >
                    {isExpanded ? 'Less details' : 'More info'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEnquiry(service)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFA500]/15 hover:bg-[#FFA500] text-[#FFA500] hover:text-black text-xs font-semibold border border-[#FFA500]/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                    aria-label={`Enquire about ${service.name}`}
                  >
                    <span>Enquire</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
