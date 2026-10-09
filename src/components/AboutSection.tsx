import React from 'react';
import { Play, Globe, Palette, Film, CheckCircle2 } from 'lucide-react';
import { aboutWorkspaceImg } from '../data/studioData';

interface AboutSectionProps {
  onOpenShowreel: () => void;
  onSelectService?: (serviceName: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenShowreel, onSelectService }) => {
  const serviceHighlights = [
    {
      title: 'Web & Digital Solutions',
      icon: Globe,
      serviceName: 'Web Development',
    },
    {
      title: 'Creative Design',
      icon: Palette,
      serviceName: 'Graphic Design',
    },
    {
      title: 'Media Production',
      icon: Film,
      serviceName: 'Videography',
    },
  ];

  return (
    <section id="about" className="relative py-16 sm:py-24 bg-[#080A14] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-[#FFA500]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT COLUMN: Large Landscape Creative Workspace Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#282D40] bg-[#121727] shadow-xl group">
              <div className="aspect-[16/10] w-full relative">
                <img
                  src={aboutWorkspaceImg}
                  alt="KC Digital Studio Modern Workspace and Creative Production Suite"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Real Functional Circular Play-Style Visual Control */}
                <button
                  type="button"
                  onClick={onOpenShowreel}
                  className="absolute bottom-6 left-6 z-20 flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#080A14]/90 backdrop-blur-md border border-[#FFA500]/60 text-white hover:bg-[#FFA500] hover:text-black transition-all duration-300 shadow-xl group/btn focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                  aria-label="Open KC Digital Studio Introduction Showreel"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FFA500] text-black flex items-center justify-center group-hover/btn:bg-black group-hover/btn:text-[#FFA500] transition-colors">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold leading-tight tracking-wide">
                      Watch Studio Reel
                    </span>
                    <span className="text-[10px] text-[#B8BDCA] group-hover/btn:text-black/80 font-mono">
                      Preview Capabilities
                    </span>
                  </div>
                </button>

                {/* Decorative script overlay corner (matching reference style) */}
                <div className="absolute top-4 right-4 pointer-events-none select-none">
                  <span className="font-script text-2xl text-[#FFA500]/80 drop-shadow">
                    Good Design. Good Mood.
                  </span>
                </div>
              </div>
            </div>

            {/* Subtle decorative geometric border shape */}
            <div className="absolute -bottom-3 -right-3 w-28 h-28 border-r-2 border-b-2 border-[#FFA500]/30 rounded-br-2xl pointer-events-none hidden sm:block" />
          </div>

          {/* RIGHT COLUMN: About Information & Service Highlights */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
            {/* Small Section Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121727] border border-[#282D40] text-[#FFA500] text-xs font-bold tracking-widest uppercase">
              About KC Digital Studio
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Turning Ideas Into{' '}
              <span className="text-[#FFA500]">Digital Experiences</span>
            </h2>

            {/* Supporting Text */}
            <div className="space-y-4 text-sm sm:text-base text-[#B8BDCA] leading-relaxed">
              <p>
                KC Digital Studio is a multidisciplinary digital creative studio combining
                technology, design, and visual storytelling.
              </p>
              <p>
                We help businesses, brands, organizations, and individuals present
                themselves professionally through website development, graphic design,
                photography, videography, video editing, social media management,
                and IT support.
              </p>
              <p className="text-xs sm:text-sm text-[#858DA2]">
                Our approach combines creativity, attention to detail, practical problem-solving,
                and an understanding of digital communication.
              </p>
            </div>

            {/* Three Compact Service Highlights with Orange Icons and White Labels */}
            <div className="w-full pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {serviceHighlights.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (onSelectService) onSelectService(item.serviceName);
                        const servicesEl = document.getElementById('services');
                        servicesEl?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] hover:border-[#FFA500]/40 transition-all cursor-pointer group shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#080A14] flex items-center justify-center text-[#FFA500] shrink-0 border border-[#282D40] group-hover:border-[#FFA500]/50 transition-colors">
                        <Icon className="w-4 h-4 stroke-[2]" />
                      </div>
                      <span className="text-xs font-semibold text-white group-hover:text-[#FFA500] transition-colors leading-tight">
                        {item.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
