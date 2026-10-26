import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ArrowRight, Video, ArrowUpRight, Sparkles } from 'lucide-react';
import { STUDIO_PROJECTS, ProjectItem, PortfolioCategory } from '../data/studioData';
import { ProjectDetailModal } from '../components/ProjectDetailModal';
import { getPublishedProjects, ProjectRecord } from '../supabase/projectsService';

type FilterCategory = 'All' | PortfolioCategory;

export const PortfolioPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);
  const [projects, setProjects] = useState<ProjectRecord[]>(
    STUDIO_PROJECTS.map((p) => ({ ...p, status: 'published' as const }))
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadLiveProjects() {
      try {
        const live = await getPublishedProjects();
        if (isMounted && live && live.length > 0) {
          setProjects(live);
        }
      } catch (err) {
        console.warn('Error retrieving live projects:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadLiveProjects();
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

  return (
    <div className="pt-28 pb-20">
      {/* Header Banner */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FFA500]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121727] border border-[#FFA500]/40 text-[#FFA500] text-xs font-semibold tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Showcase</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Creative &amp; Technical Portfolio
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#B8BDCA] leading-relaxed">
              Explore authentic work samples and digital systems across design, software, video production, photography, and social communication.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="mt-10 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-2 bg-[#121727]/90 backdrop-blur-sm p-1.5 rounded-2xl border border-[#282D40] min-w-max">
              {filterCategories.map((cat) => {
                const isActive = activeFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 focus:outline-none whitespace-nowrap cursor-pointer ${
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
      </section>

      {/* Projects Grid */}
      <section className="py-6 bg-[#080A14]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group rounded-2xl bg-[#121727] border border-[#282D40] hover:border-[#FFA500]/60 overflow-hidden transition-all duration-300 shadow-lg hover:shadow-[0_12px_30px_rgba(255,165,0,0.12)] hover:-translate-y-1 flex flex-col"
              >
                {/* Visual Thumbnail */}
                <div
                  className="relative aspect-[16/11] w-full bg-[#080A14] overflow-hidden cursor-pointer"
                  onClick={() =>
                    setModalProject({
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
                >
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center bg-[#0D111E] text-gray-500 -z-10 absolute inset-0">
                    <span className="text-xs font-mono tracking-wider text-gray-600">KC NEXUS</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121727] via-transparent to-transparent opacity-60 pointer-events-none" />

                  {project.videoUrl && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-[#080A14]/80 backdrop-blur-sm border border-[#FFA500]/40 text-[#FFA500] text-[10px] font-semibold flex items-center gap-1 shadow">
                      <Video className="w-3 h-3" />
                      <span>Video</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-[#080A14]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="px-3.5 py-1.5 rounded-full bg-[#FFA500] text-black text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick Preview</span>
                    </div>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[11px] font-semibold text-[#FFA500] tracking-wider uppercase block">
                      {project.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#FFA500] transition-colors mt-0.5 line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#B8BDCA] mt-1.5 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#282D40]/60 flex items-center justify-between">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="text-xs font-semibold text-[#FFA500] hover:text-[#FFB52E] flex items-center gap-1 transition-colors"
                    >
                      <span>Full Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        setModalProject({
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
                      className="w-8 h-8 rounded-full bg-[#080A14] border border-[#282D40] text-[#858DA2] hover:text-[#FFA500] flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Quick View"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20 text-[#858DA2]">
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

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={modalProject}
        onClose={() => setModalProject(null)}
        onEnquireProject={(serviceName) => {
          setModalProject(null);
          window.location.href = `/contact?service=${encodeURIComponent(serviceName)}`;
        }}
      />
    </div>
  );
};

export default PortfolioPage;
