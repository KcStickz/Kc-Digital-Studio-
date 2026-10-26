import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Play, Sparkles, Code, Palette, Film, Camera, Terminal, ShieldCheck, ArrowRight, MapPin, Mail, Phone } from 'lucide-react';
import { CONTACT_INFO, aboutWorkspaceImg, heroCompositionImg } from '../data/studioData';

interface OutletContextType {
  onOpenShowreel: () => void;
}

export const AboutPage: React.FC = () => {
  const { onOpenShowreel } = useOutletContext<OutletContextType>();

  const capabilities = [
    {
      title: 'Digital Systems & Web Development',
      icon: Code,
      desc: 'Building responsive, modern, and accessible web solutions using React, TypeScript, and modern component frameworks.',
    },
    {
      title: 'Graphic Design & Brand Architecture',
      icon: Palette,
      desc: 'Creating visual identity systems, promotional collateral, logos, and digital campaign assets tailored for clear communication.',
    },
    {
      title: 'Cinematography & Video Production',
      icon: Film,
      desc: 'On-set camera operations, lighting setup, audio capture, and dynamic visual storytelling for events and brand profiles.',
    },
    {
      title: 'Video Editing & Post-Production',
      icon: Terminal,
      desc: 'Precision timeline workflows, pacing, color grading, sound enhancement, and vertical short-form reels mastering.',
    },
    {
      title: 'Studio & Commercial Photography',
      icon: Camera,
      desc: 'Capturing people, products, and environmental scenes with controlled lighting and composition focus.',
    },
    {
      title: 'IT Infrastructure & Support',
      icon: ShieldCheck,
      desc: 'Workstation maintenance, operating system deployment, hardware diagnostics, and secure network troubleshooting.',
    },
  ];

  return (
    <div className="pt-28 pb-20">
      {/* Page Header */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#FFA500]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121727] border border-[#FFA500]/40 text-[#FFA500] text-xs font-semibold tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Director &amp; Multidisciplinary Practitioner</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              About <span className="text-[#FFA500]">{CONTACT_INFO.founderName}</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#B8BDCA] leading-relaxed">
              Founder of <strong className="text-white">KC NEXUS</strong> — bridging contemporary digital design, practical web engineering, and cinematic visual media from Port Harcourt, Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Main Biography & Direction */}
      <section className="py-12 bg-[#080A14] border-t border-[#282D40]/60">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Studio Workspace Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-[#282D40] bg-[#121727] shadow-xl group">
                <img
                  src={aboutWorkspaceImg}
                  alt="OKO-OBENI KELECHI SALVATION Workspace"
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <button
                  type="button"
                  onClick={onOpenShowreel}
                  className="absolute bottom-5 left-5 z-20 flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#080A14]/90 backdrop-blur-md border border-[#FFA500]/60 text-white hover:bg-[#FFA500] hover:text-black transition-all text-xs font-bold"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Studio Introduction</span>
                </button>
              </div>

              {/* Founder Location Pill */}
              <div className="mt-4 p-4 rounded-xl bg-[#121727] border border-[#282D40] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#080A14] flex items-center justify-center text-[#FFA500] shrink-0 border border-[#282D40]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="text-[#858DA2] block">Current Base &amp; Operations</span>
                  <span className="text-white font-medium">{CONTACT_INFO.location}</span>
                </div>
              </div>
            </div>

            {/* Profile Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4 text-sm sm:text-base text-[#B8BDCA] leading-relaxed">
                <p>
                  I am <strong className="text-white">OKO-OBENI KELECHI SALVATION</strong>, a multidisciplinary digital creative, web developer, and media producer based in Port Harcourt, Rivers State, Nigeria. Through <strong className="text-white">KC NEXUS</strong>, I partner with businesses, organizations, brands, and individuals to translate ambitious ideas into tangible digital realities.
                </p>

                <h3 className="text-lg font-bold text-white pt-2">
                  Creative Interests &amp; Philosophy
                </h3>
                <p>
                  My work is driven by the belief that digital presence should never be generic or merely decorative. A brand's website, video storytelling, and visual identity should communicate purpose instantly, function reliably, and respect the viewer's attention.
                </p>
                <p>
                  Whether composing a cinema camera shot, mastering sound transitions in post-production, or architecting a responsive TypeScript web application, I emphasize attention to detail, clean typography, performance, and honest communication.
                </p>

                <h3 className="text-lg font-bold text-white pt-2">
                  Professional Direction
                </h3>
                <p>
                  KC NEXUS is oriented towards providing direct, client-focused service without corporate bloat. Clients collaborate directly with me across the full project lifecycle — from initial concept consultation and wireframing through to final delivery, deployment, and ongoing technical support.
                </p>
              </div>

              {/* Direct Reach Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFA500] hover:bg-[#FFB52E] text-black font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#FFA500]/25"
                >
                  <span>Connect With Me</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] text-white font-semibold text-xs sm:text-sm transition-colors"
                >
                  <span>View Project Portfolio</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-16 bg-[#080A14] border-t border-[#282D40]/60">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs uppercase tracking-widest text-[#FFA500] font-bold block mb-2">
              Areas of Competence
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Disciplines &amp; Hands-On Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#121727] border border-[#282D40] hover:border-[#FFA500]/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#080A14] border border-[#282D40] flex items-center justify-center text-[#FFA500] mb-4">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{cap.title}</h3>
                    <p className="text-xs sm:text-sm text-[#B8BDCA] leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#282D40]/50 text-[11px] text-[#FFA500] font-semibold">
                    KC NEXUS Capability
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
