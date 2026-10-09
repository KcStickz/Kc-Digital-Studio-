import React, { useState, useMemo } from 'react';
import { ArrowUpRight, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { STUDIO_PROJECTS, ProjectItem } from '../data/studioData';

interface PortfolioSectionProps {
  onOpenProjectModal: (project: ProjectItem) => void;
}

type FilterCategory = 'All' | 'Branding' | 'Web Design' | 'Graphics' | 'Photography' | 'Video' | 'Social Media';

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onOpenProjectModal }) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const [showAllProjects, setShowAllProjects] = useState<boolean>(false);

  const filterCategories: FilterCategory[] = [
    'All',
    'Branding',
    'Web Design',
    'Graphics',
    'Photography',
    'Video',
    'Social Media',
  ];

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') {
      return STUDIO_PROJECTS;
    }
    return STUDIO_PROJECTS.filter((p) => p.filterCategory === activeFilter);
  }, [activeFilter]);

  // Display initial 4 cards on desktop (first row) unless "View More Projects" is clicked or a specific filter is chosen
  const displayedProjects = useMemo(() => {
    if (showAllProjects || activeFilter !== 'All') {
      return filteredProjects;
    }
    return filteredProjects.slice(0, 4);
  }, [filteredProjects, showAllProjects, activeFilter]);

  return (
    <section id="portfolio" className="relative py-16 sm:py-24 bg-[#080A14] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFA500]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Heading and Filter Buttons on Top-Right */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <div className="max-w-xl">
            {/* Section Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121727] border border-[#282D40] text-[#FFA500] text-xs font-bold tracking-widest uppercase mb-3">
              Our Portfolio
            </div>
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Selected Creative Projects
            </h2>
            {/* Supporting Text */}
            <p className="mt-3 text-sm sm:text-base text-[#B8BDCA] leading-relaxed">
              Explore a selection of creative and digital work across design, development, photography, and video production.
            </p>
          </div>

          {/* Top-Right Category Filter Buttons */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 bg-[#121727]/80 backdrop-blur-sm p-1.5 rounded-2xl border border-[#282D40] self-start lg:self-end">
            {filterCategories.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveFilter(cat);
                    setShowAllProjects(true); // reset show all on filter click
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 focus:outline-none ${
                    isActive
                      ? 'bg-[#FFA500] text-black font-bold shadow-md shadow-[#FFA500]/25'
                      : 'text-[#B8BDCA] hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  aria-pressed={isActive}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Four-Column Desktop Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onOpenProjectModal(project)}
              className="group cursor-pointer rounded-2xl bg-[#121727] border border-[#282D40] hover:border-[#FFA500]/60 overflow-hidden transition-all duration-300 shadow-lg hover:shadow-[0_12px_30px_rgba(255,165,0,0.12)] hover:-translate-y-1 flex flex-col"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenProjectModal(project);
                }
              }}
              aria-label={`View project details for ${project.title}`}
            >
              {/* Visual Thumbnail with Hover Zoom */}
              <div className="relative aspect-[16/11] w-full bg-[#080A14] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121727] via-transparent to-transparent opacity-60" />

                {/* View Overlay Indicator */}
                <div className="absolute inset-0 bg-[#080A14]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="px-3.5 py-1.5 rounded-full bg-[#FFA500] text-black text-xs font-bold flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Showcase</span>
                  </div>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 flex items-center justify-between mt-auto">
                <div>
                  <span className="text-[11px] font-semibold text-[#FFA500] tracking-wider uppercase block">
                    {project.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#FFA500] transition-colors mt-0.5 line-clamp-1">
                    {project.title}
                  </h3>
                </div>

                {/* Small Arrow Icon */}
                <div className="w-8 h-8 rounded-full bg-[#080A14] border border-[#282D40] group-hover:border-[#FFA500] text-[#858DA2] group-hover:text-[#FFA500] flex items-center justify-center shrink-0 transition-colors">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Centered Button Below the Grid */}
        {activeFilter === 'All' && !showAllProjects && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAllProjects(true)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] hover:border-[#FFA500] text-white font-semibold text-sm transition-all duration-200 shadow-md group"
            >
              <span>View More Projects</span>
              <ArrowRight className="w-4 h-4 text-[#FFA500] transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}

        {/* If filtered list has no results */}
        {displayedProjects.length === 0 && (
          <div className="text-center py-16 text-[#858DA2]">
            <p className="text-sm">No sample projects match the selected category.</p>
            <button
              onClick={() => setActiveFilter('All')}
              className="mt-3 text-xs text-[#FFA500] underline"
            >
              Reset to all projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;
