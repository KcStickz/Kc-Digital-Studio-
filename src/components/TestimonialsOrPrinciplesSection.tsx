import React from 'react';
import { Sparkles, Target, Users, MessageSquarePlus, Star, CheckCircle } from 'lucide-react';
import { STUDIO_PRINCIPLES } from '../data/studioData';

interface ClientFeedbackItem {
  clientName: string;
  projectType: string;
  comment: string;
  rating: number;
}

interface TestimonialsOrPrinciplesSectionProps {
  onOpenFeedbackModal: () => void;
  userReviews?: ClientFeedbackItem[];
}

export const TestimonialsOrPrinciplesSection: React.FC<TestimonialsOrPrinciplesSectionProps> = ({
  onOpenFeedbackModal,
  userReviews = [],
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
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

  return (
    <section id="feedback" className="relative py-16 sm:py-24 bg-[#080A14] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-[#FFA500]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            {/* Section Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121727] border border-[#282D40] text-[#FFA500] text-xs font-bold tracking-widest uppercase mb-3">
              Client Feedback
            </div>
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              What Our Clients Say
            </h2>
            {/* Supporting Text */}
            <p className="mt-3 text-sm sm:text-base text-[#B8BDCA] leading-relaxed">
              Trust, communication, and attention to detail are important parts of every creative collaboration.
            </p>
          </div>

          {/* Feedback Submission Action */}
          <div className="shrink-0">
            <button
              onClick={onOpenFeedbackModal}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-full bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] hover:border-[#FFA500]/60 text-white text-xs sm:text-sm font-semibold transition-all group shadow-sm"
            >
              <MessageSquarePlus className="w-4 h-4 text-[#FFA500]" />
              <span>Share Client Feedback</span>
            </button>
          </div>
        </div>

        {/* Studio Principles Cards (Preserving visual footprint without fake testimonials) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STUDIO_PRINCIPLES.map((principle) => {
            const Icon = getIcon(principle.icon);
            return (
              <div
                key={principle.id}
                className="group relative bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] hover:border-[#FFA500]/60 rounded-2xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[0_10px_30px_rgba(255,165,0,0.08)] hover:-translate-y-1"
              >
                <div>
                  {/* Clean Icon Container */}
                  <div className="w-12 h-12 rounded-xl bg-[#080A14] border border-[#282D40] group-hover:border-[#FFA500]/60 flex items-center justify-center text-[#FFA500] mb-5 shadow-inner transition-colors">
                    <Icon className="w-6 h-6 stroke-[1.8] transition-transform group-hover:scale-110" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FFA500] transition-colors">
                    {principle.title}
                  </h3>

                  {/* Core Description */}
                  <p className="mt-2 text-sm text-[#FFA500]/90 font-medium leading-relaxed">
                    "{principle.description}"
                  </p>

                  {/* Elaboration */}
                  <p className="mt-3 text-xs text-[#B8BDCA] leading-relaxed">
                    {principle.detail}
                  </p>
                </div>

                {/* Footer Assurance */}
                <div className="mt-6 pt-4 border-t border-[#282D40]/60 flex items-center justify-between text-xs text-[#858DA2]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle className="w-3.5 h-3.5 text-[#FFA500]" />
                    Studio Standard
                  </span>
                  <span className="font-mono text-[10px] text-[#FFA500]">0{STUDIO_PRINCIPLES.indexOf(principle) + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real User Reviews Display if submitted */}
        {userReviews.length > 0 && (
          <div className="mt-10 pt-8 border-t border-[#282D40]/80 animate-fade-in">
            <h4 className="text-sm font-bold text-[#FFA500] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 fill-[#FFA500]" />
              Verified Client Submissions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
  );
};

export default TestimonialsOrPrinciplesSection;
