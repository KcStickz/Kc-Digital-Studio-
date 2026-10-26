import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2, Eye, Video, Film, ArrowUpRight } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import HighlightsSection from '../components/HighlightsSection';
import { STUDIO_PROJECTS, STUDIO_SERVICES, STUDIO_PRINCIPLES, CONTACT_INFO, ProjectItem, aboutWorkspaceImg } from '../data/studioData';
import { ProjectDetailModal } from '../components/ProjectDetailModal';

interface OutletContextType {
  onOpenShowreel: () => void;
  onOpenFeedback: () => void;
  userReviews: any[];
}

export const HomePage: React.FC = () => {
  const { onOpenShowreel } = useOutletContext<OutletContextType>();
  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);

  // Featured 4 projects for home page
  const featuredProjects = STUDIO_PROJECTS.slice(0, 4);

  return (
    <div>
      {/* 1. Cinematic Hero Section */}
      <HeroSection />

      {/* 2. Four Horizontal Capability Highlights */}
      <HighlightsSection />

      {/* 3. Personal Introduction & About Preview */}
      <section className="py-16 sm:py-20 bg-[#080A14] border-t border-[#282D40]/60 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-[#FFA500]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Workspace & Showreel image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-[#282D40] bg-[#121727] group shadow-xl">
                <img
                  src={aboutWorkspaceImg}
                  alt="KC NEXUS Creative Suite"
                  className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <button
                  type="button"
                  onClick={onOpenShowreel}
                  className="absolute bottom-5 left-5 z-20 flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#080A14]/90 backdrop-blur-md border border-[#FFA500]/60 text-white hover:bg-[#FFA500] hover:text-black transition-all text-xs font-bold shadow-lg"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FFA500] animate-pulse" />
                  <span>Watch Studio Showreel</span>
                </button>
              </div>
            </div>

            {/* Introduction Copy */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121727] border border-[#282D40] text-[#FFA500] text-xs font-bold tracking-widest uppercase">
                Director &amp; Creative Lead
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Meet <span className="text-[#FFA500]">{CONTACT_INFO.founderName}</span>
              </h2>

              <p className="text-sm sm:text-base text-[#B8BDCA] leading-relaxed">
                Operating under the creative banner of <strong className="text-white">KC NEXUS</strong>, I combine contemporary design, cinematography, and software engineering to construct authoritative digital presences for forward-thinking brands and businesses.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#121727] border border-[#282D40]">
                  <span className="text-xs font-bold text-[#FFA500] block">Web Systems</span>
                  <span className="text-[11px] text-[#858DA2] mt-0.5 block">High-speed React &amp; Modern UI</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#121727] border border-[#282D40]">
                  <span className="text-xs font-bold text-[#FFA500] block">Media Production</span>
                  <span className="text-[11px] text-[#858DA2] mt-0.5 block">4K Video &amp; Still Photography</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#121727] border border-[#282D40]">
                  <span className="text-xs font-bold text-[#FFA500] block">Brand Strategy</span>
                  <span className="text-[11px] text-[#858DA2] mt-0.5 block">Graphic Design &amp; Direction</span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#FFA500] hover:text-[#FFB52E] transition-colors group"
                >
                  <span>Read Complete Background &amp; Philosophy</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Selected Projects */}
      <section className="py-16 sm:py-24 bg-[#080A14] overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121727] border border-[#282D40] text-[#FFA500] text-xs font-bold tracking-widest uppercase mb-3">
                Featured Portfolio
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Selected Creative Projects
              </h2>
              <p className="mt-2 text-sm text-[#B8BDCA] max-w-xl">
                A preview of genuine creative disciplines across web development, branding, photography, and film production.
              </p>
            </div>

            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] hover:border-[#FFA500] text-white text-xs sm:text-sm font-semibold transition-all group shrink-0"
            >
              <span>Explore All Projects</span>
              <ArrowRight className="w-4 h-4 text-[#FFA500] transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* 4 Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="group rounded-2xl bg-[#121727] border border-[#282D40] hover:border-[#FFA500]/60 overflow-hidden transition-all duration-300 shadow-lg hover:shadow-[0_12px_30px_rgba(255,165,0,0.12)] hover:-translate-y-1 flex flex-col"
              >
                <div
                  className="relative aspect-[16/11] w-full bg-[#080A14] overflow-hidden cursor-pointer"
                  onClick={() => setModalProject(project)}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121727] via-transparent to-transparent opacity-60" />

                  {project.videoUrl && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-[#080A14]/80 backdrop-blur-sm border border-[#FFA500]/40 text-[#FFA500] text-[10px] font-semibold flex items-center gap-1 shadow">
                      <Video className="w-3 h-3" />
                      <span>Video</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-[#080A14]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="px-3 py-1.5 rounded-full bg-[#FFA500] text-black text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[11px] font-semibold text-[#FFA500] tracking-wider uppercase block">
                      {project.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#FFA500] transition-colors mt-0.5 line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#B8BDCA] mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#282D40]/60 flex items-center justify-between">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="text-xs font-semibold text-[#FFA500] hover:underline flex items-center gap-1"
                    >
                      <span>Case Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setModalProject(project)}
                      className="w-7 h-7 rounded-full bg-[#080A14] border border-[#282D40] text-[#858DA2] hover:text-[#FFA500] flex items-center justify-center transition-colors"
                      aria-label="Quick view"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Services Summary Section */}
      <section className="py-16 sm:py-20 bg-[#080A14] border-t border-[#282D40]/60">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121727] border border-[#282D40] text-[#FFA500] text-xs font-bold tracking-widest uppercase mb-3">
                Capabilities
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Disciplines &amp; Solutions
              </h2>
              <p className="mt-2 text-sm text-[#B8BDCA] max-w-xl">
                Eight specialized creative, engineering, and digital media services tailored to individual and corporate goals.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] hover:border-[#FFA500] text-white text-xs sm:text-sm font-semibold transition-all group shrink-0"
            >
              <span>View All 8 Services</span>
              <ArrowRight className="w-4 h-4 text-[#FFA500] transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STUDIO_SERVICES.slice(0, 4).map((srv) => (
              <div
                key={srv.id}
                className="p-5 rounded-2xl bg-[#121727] border border-[#282D40] flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-[#FFA500] uppercase tracking-wider block">
                    {srv.name}
                  </span>
                  <p className="text-xs text-[#B8BDCA] mt-2 leading-relaxed">
                    {srv.shortDesc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#282D40]/60">
                  <Link
                    to={`/contact?service=${encodeURIComponent(srv.name)}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[#FFA500] hover:text-[#FFB52E] font-medium"
                  >
                    <span>Enquire Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Studio Principles & Contact CTA */}
      <section className="py-16 sm:py-24 bg-[#080A14] border-t border-[#282D40]/60">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#121727] border border-[#282D40] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFA500]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-xl space-y-3 relative z-10">
              <span className="text-xs uppercase tracking-widest text-[#FFA500] font-bold">
                Ready to Collaborate?
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Turn Your Creative Vision into Concrete Digital Reality.
              </h2>
              <p className="text-xs sm:text-sm text-[#B8BDCA]">
                Direct discussions with OKO-OBENI KELECHI SALVATION. Reliable execution, transparent communication, and rapid turnaround in Port Harcourt and remotely.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full sm:w-auto">
              <Link
                to="/contact"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#FFA500] hover:bg-[#FFB52E] text-black font-bold text-sm tracking-wide text-center transition-all shadow-lg shadow-[#FFA500]/25"
              >
                Start an Enquiry →
              </Link>
              <Link
                to="/studio"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#080A14] hover:bg-[#161B2D] border border-[#282D40] text-white font-semibold text-sm text-center transition-colors"
              >
                Visit Studio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Project Quick View Modal */}
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

export default HomePage;
