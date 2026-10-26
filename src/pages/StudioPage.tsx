import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Play, Sparkles, Target, Users, CheckCircle, ArrowRight, MessageSquarePlus, Star, Camera, Monitor, Video, ShieldCheck } from 'lucide-react';
import { STUDIO_PRINCIPLES, CONTACT_INFO, heroCompositionImg, aboutWorkspaceImg } from '../data/studioData';

interface OutletContextType {
  onOpenShowreel: () => void;
  onOpenFeedback: () => void;
  userReviews: any[];
}

export const StudioPage: React.FC = () => {
  const { onOpenShowreel, onOpenFeedback, userReviews } = useOutletContext<OutletContextType>();

  const getPrincipleIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return Sparkles;
      case 'Target':
        return Target;
      case 'Users':
        return Users;
      default:
        return Sparkles;
    }
  };

  const studioFacilities = [
    {
      title: 'Cinematography Suite',
      icon: Camera,
      description: 'Cinema-grade camera rigs, gimbal stabilization, on-location audio microphones, and balanced continuous lighting softboxes.',
    },
    {
      title: 'Digital Engineering Lab',
      icon: Monitor,
      description: 'Modern development workstations optimizing responsive web applications, interface architectures, and custom workflows.',
    },
    {
      title: 'Post-Production & Grading',
      icon: Video,
      description: 'Dual color-calibrated displays, audio mastering consoles, and optimized timelines for rapid 4K rendering and vertical cuts.',
    },
    {
      title: 'Hardware & IT Diagnostics',
      icon: ShieldCheck,
      description: 'Dedicated testing environments for hardware integrity, Windows installations, operating system recovery, and secure local networks.',
    },
  ];

  return (
    <div className="pt-28 pb-20">
      {/* Page Header */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFA500]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121727] border border-[#FFA500]/40 text-[#FFA500] text-xs font-semibold tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Philosophy &amp; Standards</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              The <span className="text-[#FFA500]">KC NEXUS</span> Studio
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#B8BDCA] leading-relaxed">
              Where creativity and engineering intersect. A deliberate environment built for meticulous digital production, transparent collaboration, and tangible business outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Ethos & Showreel Hero */}
      <section className="py-12 bg-[#080A14] border-t border-[#282D40]/60">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold text-[#FFA500] uppercase tracking-wider block">
                Brand Core &amp; Identity
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                "Creativity Meets Digital Excellence"
              </h2>
              <p className="text-sm sm:text-base text-[#B8BDCA] leading-relaxed">
                <strong className="text-white">KC NEXUS</strong> represents the focal point where artistic vision connects with functional precision. Founded by <strong className="text-white">OKO-OBENI KELECHI SALVATION</strong>, the studio was born out of a desire to eliminate the divide between aesthetic visual design and robust technical implementation.
              </p>
              <p className="text-xs sm:text-sm text-[#858DA2] leading-relaxed">
                Rather than treating web development, cinematography, graphic design, and IT support as isolated services, we treat them as unified facets of a single modern brand strategy.
              </p>

              <div className="pt-2 flex items-center gap-4">
                <button
                  type="button"
                  onClick={onOpenShowreel}
                  className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#FFA500] hover:bg-[#FFB52E] text-black font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#FFA500]/25"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Studio Showreel</span>
                </button>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] text-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  <span>Start a Dialogue</span>
                </Link>
              </div>
            </div>

            {/* Visual Production Suite */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-[#282D40] bg-[#121727] shadow-xl group">
                <img
                  src={heroCompositionImg}
                  alt="KC NEXUS Studio Production Suite"
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs text-[#B8BDCA]">
                  <span className="font-semibold text-white">Production Suite</span>
                  <span className="font-mono text-[#FFA500]">Port Harcourt, Nigeria</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Principles Section */}
      <section className="py-16 bg-[#080A14] border-t border-[#282D40]/60">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#FFA500] font-bold block mb-2">
                Our Standards
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                The Three Studio Principles
              </h2>
            </div>

            <button
              onClick={onOpenFeedback}
              className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] hover:border-[#FFA500]/60 text-white text-xs font-semibold transition-all group shrink-0"
            >
              <MessageSquarePlus className="w-4 h-4 text-[#FFA500]" />
              <span>Submit Client Feedback</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STUDIO_PRINCIPLES.map((principle, idx) => {
              const Icon = getPrincipleIcon(principle.icon);
              return (
                <div
                  key={principle.id}
                  className="p-6 rounded-2xl bg-[#121727] border border-[#282D40] hover:border-[#FFA500]/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#080A14] border border-[#282D40] flex items-center justify-center text-[#FFA500] mb-5">
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{principle.title}</h3>
                    <p className="text-sm text-[#FFA500]/90 font-medium leading-relaxed mb-3">
                      "{principle.description}"
                    </p>
                    <p className="text-xs text-[#B8BDCA] leading-relaxed">
                      {principle.detail}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#282D40]/60 flex items-center justify-between text-xs text-[#858DA2]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-[#FFA500]" />
                      Verified Principle
                    </span>
                    <span className="font-mono text-[#FFA500]">0{idx + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* User Reviews if submitted */}
          {userReviews && userReviews.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[#282D40]/80">
              <h4 className="text-sm font-bold text-[#FFA500] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 fill-[#FFA500]" />
                Client Testimonials &amp; Submissions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userReviews.map((rev, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-[#161B2D] border border-[#FFA500]/30 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white">{rev.clientName}</span>
                      <div className="flex items-center gap-1 text-[#FFA500]">
                        {Array.from({ length: rev.rating }).map((_, sIdx) => (
                          <Star key={sIdx} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <span className="text-[11px] text-[#FFA500] block mb-2 font-mono">{rev.projectType}</span>
                    <p className="text-xs text-[#B8BDCA] italic leading-relaxed">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Facilities & Setup */}
      <section className="py-16 bg-[#080A14] border-t border-[#282D40]/60">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs uppercase tracking-widest text-[#FFA500] font-bold block mb-2">
              Infrastructure
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Studio Setup &amp; Workstations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {studioFacilities.map((fac, idx) => {
              const Icon = fac.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-[#121727] border border-[#282D40]">
                  <div className="w-10 h-10 rounded-xl bg-[#080A14] border border-[#282D40] flex items-center justify-center text-[#FFA500] mb-3">
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1.5">{fac.title}</h4>
                  <p className="text-xs text-[#B8BDCA] leading-relaxed">{fac.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudioPage;
