import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Sparkles,
} from 'lucide-react';
import { STUDIO_SERVICES } from '../data/studioData';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

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

  const handleEnquiry = (serviceName: string) => {
    navigate(`/contact?service=${encodeURIComponent(serviceName)}`);
  };

  return (
    <div className="pt-28 pb-20">
      {/* Page Header */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#FFA500]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121727] border border-[#FFA500]/40 text-[#FFA500] text-xs font-semibold tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Spectrum Disciplines</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Services &amp; Capabilities
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#B8BDCA] leading-relaxed">
              Tailored creative and technical solutions designed to help brands communicate with precision, operate seamlessly, and establish durable digital prominence.
            </p>
          </div>
        </div>
      </section>

      {/* 8 Services Grid */}
      <section className="py-6 bg-[#080A14]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STUDIO_SERVICES.map((srv) => {
              const Icon = getServiceIcon(srv.icon);
              return (
                <div
                  key={srv.id}
                  className="p-6 rounded-2xl bg-[#121727] border border-[#282D40] hover:border-[#FFA500]/60 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[0_10px_30px_rgba(255,165,0,0.08)] group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#080A14] border border-[#282D40] group-hover:border-[#FFA500]/60 flex items-center justify-center text-[#FFA500] mb-5 shadow-inner transition-colors">
                      <Icon className="w-6 h-6 stroke-[1.8] transition-transform group-hover:scale-110" />
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-[#FFA500] transition-colors">
                      {srv.name}
                    </h3>

                    <p className="mt-2 text-xs text-[#B8BDCA] leading-relaxed">
                      {srv.shortDesc}
                    </p>

                    <p className="mt-3 text-[11px] text-[#858DA2] leading-relaxed border-t border-[#282D40]/60 pt-3">
                      {srv.fullDesc}
                    </p>

                    <div className="mt-4 space-y-1.5 pt-3 border-t border-[#282D40]/60">
                      <span className="text-[10px] uppercase tracking-wider text-[#FFA500] font-bold block mb-1">
                        Scope Includes:
                      </span>
                      {srv.features.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-white/90">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#FFA500] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#282D40]">
                    <button
                      type="button"
                      onClick={() => handleEnquiry(srv.name)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFA500]/15 hover:bg-[#FFA500] text-[#FFA500] hover:text-black font-semibold text-xs border border-[#FFA500]/40 transition-all shadow-sm"
                    >
                      <span>Enquire This Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#080A14] border-t border-[#282D40]/60 mt-12">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Have a project combining multiple services?
          </h2>
          <p className="mt-2 text-sm text-[#B8BDCA] max-w-xl mx-auto">
            We regularly formulate integrated packages combining branding, website development, cinematography, and ongoing management.
          </p>
          <div className="mt-6">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#FFA500] hover:bg-[#FFB52E] text-black font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#FFA500]/25"
            >
              <span>Schedule a Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
