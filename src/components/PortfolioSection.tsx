import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUpRight, ArrowRight, Eye, Video, Film } from 'lucide-react';
import { STUDIO_PROJECTS, ProjectItem, PortfolioCategory } from '../data/studioData';
import { getPublishedProjects, ProjectRecord } from '../firebase/projectsService';

interface PortfolioSectionProps {
  onOpenProjectModal: (project: ProjectItem) => void;
}

type FilterCategory = 'All' | PortfolioCategory;

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onOpenProjectModal }) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const [showAllProjects, setShowAllProjects] = useState<boolean>(false);
  const [projects, setProjects] = useState<ProjectRecord[]>(
    STUDIO_PROJECTS.map((p) => ({ ...p, status: 'published' as const }))
  );

  useEffect(() => {
    let isMounted = true;
    async function loadLive() {
      try {
        const live = await getPublishedProjects();
        if (isMounted && live && live.length > 0) {
          setProjects(live);
        }
      } catch (err) {
        console.warn('Failed to load projects for home portfolio:', err);
      }
    }
    loadLive();
    return () => {
      isMounted = false;
    };
  }, []);

  const filterCategories: FilterCategory[] = [
    'All',
    'Graphic Design',
    'Video Editing',
    'Photography',
    'Videography',
    'Web Development',
    'Software Development',
    'Social Media Management',
    'IT Support',
  ];

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') {
      return projects;
    }
    return projects.filter((p) => p.filterCategory === activeFilter);
  }, [activeFilter, projects]);

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
        {/* Section Header with Heading and Filter Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
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
              Explore a selection of creative and digital work across design, development, photography, videography, and digital solutions.
            </p>
          </div>

          {/* Category Filter Buttons - Fully responsive & scrollable */}
          <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-[#121727]/90 backdrop-blur-sm p-1.5 rounded-2xl border border-[#282D40] min-w-max">
              {filterCategories.map((cat) => {
                const isActive = activeFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveFilter(cat);
                      setShowAllProjects(true);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 focus:outline-none whitespace-nowrap cursor-pointer ${
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
        </div>

        {/* Four-Column Desktop Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProjects.map((project) => (
            <div
              key={project.id}
              onClick={() =>
                onOpenProjectModal({
                  id: project.id,
                  slug: project.slug,
                  title: project.title,
                  category: project.category,
                  filterCategory: project.filterCategory,
                  description: project.description,
                  fullOverview: project.fullOverview,
                  image: project.image,
                  videoUrl: project.videoUrl,
                  projectLink: project.projectLink,
                  deliverables: project.deliverables || [],
                  clientScope: project.clientScope,
                  year: project.year,
                })
              }
              className="group cursor-pointer rounded-2xl bg-[#121727] border border-[#282D40] hover:border-[#FFA500]/60 overflow-hidden transition-all duration-300 shadow-lg hover:shadow-[0_12px_30px_rgba(255,165,0,0.12)] hover:-translate-y-1 flex flex-col"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenProjectModal({
                    id: project.id,
                    slug: project.slug,
                    title: project.title,
                    category: project.category,
                    filterCategory: project.filterCategory,
                    description: project.description,
                    fullOverview: project.fullOverview,
                    image: project.image,
                    videoUrl: project.videoUrl,
                    projectLink: project.projectLink,
                    deliverables: project.deliverables || [],
                    clientScope: project.clientScope,
                    year: project.year,
                  });
                }
              }}
              aria-label={`View project details for ${project.title}`}
            >
              {/* Visual Thumbnail or Video Thumbnail */}
              <div className="relative aspect-[16/11] w-full bg-[#080A14] overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    loading="lazy"
                  />
                ) : project.videoUrl ? (
                  <div className="w-full h-full flex items-center justify-center bg-[#0D111E] text-[#FFA500]">
                    <Film className="w-12 h-12 opacity-40" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#0D111E] text-[#858DA2]">
                    <span className="text-xs">KC NEXUS Project</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121727] via-transparent to-transparent opacity-60" />

                {/* Video Media Badge if this is a video asset */}
                {project.videoUrl && (
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-[#080A14]/80 backdrop-blur-sm border border-[#FFA500]/40 text-[#FFA500] text-[10px] font-semibold flex items-center gap-1 shadow">
                    <Video className="w-3 h-3" />
                    <span>Video</span>
                  </div>
                )}

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
                <div className="min-w-0 pr-2">
                  <span className="text-[11px] font-semibold text-[#FFA500] tracking-wider uppercase block truncate">
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
        {activeFilter === 'All' && !showAllProjects && projects.length > 4 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAllProjects(true)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] hover:border-[#FFA500] text-white font-semibold text-sm transition-all duration-200 shadow-md group cursor-pointer"
            >
              <span>View More Projects ({projects.length})</span>
              <ArrowRight className="w-4 h-4 text-[#FFA500] transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}

        {/* If filtered list has no results */}
        {displayedProjects.length === 0 && (
          <div className="text-center py-16 text-[#858DA2]">
            <p className="text-sm">No projects currently listed in this category.</p>
            <button
              onClick={() => setActiveFilter('All')}
              className="mt-3 text-xs text-[#FFA500] underline cursor-pointer"
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
