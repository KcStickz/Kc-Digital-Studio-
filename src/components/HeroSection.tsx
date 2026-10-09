import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { heroCompositionImg } from '../data/studioData';

export const HeroSection: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="home" className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 overflow-hidden">
      {/* Background Ambient Radial Glows (matching dark navy and warm orange subtle aura) */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFA500]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#161B2D]/80 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-24 bg-gradient-to-r from-transparent via-[#FFA500]/5 to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT COLUMN: Hero Content & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Small rounded orange badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121727] border border-[#FFA500]/40 text-[#FFA500] text-xs font-semibold tracking-wider uppercase shadow-[0_0_15px_rgba(255,165,0,0.1)]">
              <Sparkles className="w-3.5 h-3.5 text-[#FFA500]" />
              <span>Creative Digital Studio</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight text-white leading-[1.12]">
              Creativity Meets{' '}
              <span className="text-[#FFA500] drop-shadow-[0_0_25px_rgba(255,165,0,0.3)]">
                Digital Excellence.
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-sm sm:text-base text-[#B8BDCA] leading-relaxed max-w-xl">
              Kc Digital Studio brings ideas to life through web development,
              graphic design, photography, videography, video editing,
              social media management, and digital solutions. We combine creativity
              and technology to help businesses build their online presence,
              communicate their message, and stand out in an increasingly digital world.
            </p>

            {/* Buttons: Primary & Secondary */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <button
                onClick={() => scrollTo('portfolio')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#FFA500] hover:bg-[#FFB52E] text-black font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-[#FFA500]/25 hover:shadow-[0_0_20px_rgba(255,165,0,0.4)] group"
              >
                <span>Explore Our Work</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => scrollTo('contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#121727] hover:bg-[#161B2D] text-white font-semibold text-sm border border-[#282D40] hover:border-[#FFA500]/50 transition-all duration-200"
              >
                <span>Let's Work Together</span>
              </button>
            </div>

            {/* Availability Indicator */}
            <div className="flex items-center gap-2.5 pt-2 text-xs text-[#858DA2] font-medium">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFA500] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFA500]" />
              </span>
              <span>Available for Projects &amp; Collaborations</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Cinematic Composition Inspired by Reference */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Backing layered glow block */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#FFA500]/30 via-transparent to-[#FFA500]/20 rounded-3xl blur-xl opacity-70" />

              {/* Geometric floating accent back-card (matching reference's layered cards) */}
              <div className="absolute -top-3 -right-3 w-full h-full rounded-2xl border border-[#FFA500]/25 bg-[#0D111E]/40 pointer-events-none hidden sm:block" />

              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden border border-[#282D40] bg-[#121727] shadow-2xl">
                <div className="aspect-[4/4.5] w-full relative">
                  <img
                    src={heroCompositionImg}
                    alt="KC Digital Studio - Creative Production & Digital Workspace"
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                  {/* Subtle rim light overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A14] via-transparent to-transparent opacity-60" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />

                  {/* Tasteful Handwritten script phrase near the image */}
                  <div className="absolute top-6 right-6 z-20 pointer-events-none select-none">
                    <div className="font-script text-3xl sm:text-4xl text-[#FFA500]/90 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-right rotate-3">
                      Design.<br />
                      Create.<br />
                      Grow.
                    </div>
                  </div>

                  {/* Bottom Image Tag Pill */}
                  <div className="absolute bottom-4 left-4 z-20">
                    <div className="px-3 py-1 rounded-lg bg-[#080A14]/80 backdrop-blur-md border border-[#282D40] text-[11px] font-medium text-[#B8BDCA] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFA500]" />
                      Studio Production Suite
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle small corner geometric accent */}
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#FFA500]/60 rounded-bl-lg pointer-events-none" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#FFA500]/60 rounded-tr-lg pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
