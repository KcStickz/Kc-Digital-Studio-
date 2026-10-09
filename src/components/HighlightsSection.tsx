import React from 'react';
import { PenTool, Laptop, Camera, Share2 } from 'lucide-react';

interface HighlightsSectionProps {
  onSelectService?: (serviceName: string) => void;
}

export const HighlightsSection: React.FC<HighlightsSectionProps> = ({ onSelectService }) => {
  const cards = [
    {
      icon: PenTool,
      title: 'Graphic Design',
      description: 'Creative visuals and brand communication.',
      serviceTarget: 'Graphic Design',
    },
    {
      icon: Laptop,
      title: 'Digital Development',
      description: 'Websites and practical digital solutions.',
      serviceTarget: 'Web Development',
    },
    {
      icon: Camera,
      title: 'Visual Production',
      description: 'Photography, videography, and video editing.',
      serviceTarget: 'Photography',
    },
    {
      icon: Share2,
      title: 'Social Media',
      description: 'Content creation and digital brand management.',
      serviceTarget: 'Social Media Management',
    },
  ];

  const handleCardClick = (serviceTarget: string) => {
    if (onSelectService) {
      onSelectService(serviceTarget);
    }
    const servicesSection = document.getElementById('services');
    servicesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-8 sm:py-12" aria-label="Core Capabilities">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={() => handleCardClick(card.serviceTarget)}
                className="group relative bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] hover:border-[#FFA500]/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-[0_8px_25px_rgba(255,165,0,0.08)] hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4">
                  {/* Dark rounded icon container with orange line icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#080A14] border border-[#282D40] group-hover:border-[#FFA500]/50 flex items-center justify-center text-[#FFA500] shrink-0 transition-colors shadow-inner">
                    <Icon className="w-6 h-6 stroke-[1.75] transition-transform group-hover:scale-110" />
                  </div>

                  {/* Title and Short Description */}
                  <div className="flex flex-col">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#FFA500] transition-colors leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#B8BDCA] mt-1 line-clamp-2 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Subtle indicator bar */}
                <div className="mt-4 pt-3 border-t border-[#282D40]/50 flex items-center justify-between text-[11px] text-[#858DA2] group-hover:text-[#FFA500] transition-colors font-medium">
                  <span>Explore discipline</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
