import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, Calendar, Tag, Check, Video, Film, Sparkles } from 'lucide-react';
import { STUDIO_PROJECTS, ProjectItem } from '../data/studioData';
import { getProjectBySlug, ProjectRecord } from '../supabase/projectsService';
import { isEmbedVideo, getEmbedVideoUrl } from '../utils/mediaUtils';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectRecord | null>(() => {
    const staticProj = STUDIO_PROJECTS.find((p) => p.slug === slug || p.id === slug);
    return staticProj ? { ...staticProj, status: 'published' } : null;
  });
  const [loading, setLoading] = useState<boolean>(!project);

  useEffect(() => {
    let isMounted = true;
    async function loadProj() {
      if (!slug) return;
      try {
        const result = await getProjectBySlug(slug);
        if (isMounted && result) {
          setProject(result);
        }
      } catch (err) {
        console.warn('Error loading project by slug from Firestore:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProj();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-40 pb-32 text-center max-w-xl mx-auto px-4 text-gray-400">
        <div className="w-6 h-6 border-2 border-[#FFA500] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span>Loading project details...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-40 pb-32 text-center max-w-xl mx-auto px-4">
        <h1 className="text-3xl font-black text-white mb-3">Project Not Found</h1>
        <p className="text-sm text-[#B8BDCA] mb-6">
          The project you requested does not exist or may have been relocated.
        </p>
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFA500] text-black font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>
    );
  }

  // Find other projects for "Related Work"
  const relatedProjects = STUDIO_PROJECTS.filter(
    (p) => p.id !== project.id && p.filterCategory === project.filterCategory
  ).slice(0, 3);

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#858DA2] py-4">
          <Link to="/" className="hover:text-[#FFA500] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/portfolio" className="hover:text-[#FFA500] transition-colors">Portfolio</Link>
          <span>/</span>
          <span className="text-white font-medium truncate">{project.title}</span>
        </div>

        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 text-xs text-[#FFA500] hover:text-[#FFB52E] font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Projects</span>
          </Link>
        </div>

        {/* Project Header Info */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFA500]/15 text-[#FFA500] border border-[#FFA500]/30">
              {project.category}
            </span>
            {project.year && (
              <span className="text-xs text-[#858DA2] flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                {project.year}
              </span>
            )}
            {project.clientScope && (
              <span className="text-xs text-[#858DA2] bg-[#121727] px-2.5 py-0.5 rounded-md border border-[#282D40]">
                {project.clientScope}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {project.title}
          </h1>

          <p className="mt-3 text-base sm:text-lg text-[#B8BDCA] max-w-3xl leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Media Container: High-Res Image or Playable Video */}
        <div className="rounded-2xl overflow-hidden border border-[#282D40] bg-[#121727] shadow-2xl mb-12">
          <div className="relative aspect-video w-full bg-black">
            {project.videoUrl ? (
              isEmbedVideo(project.videoUrl) ? (
                <iframe
                  src={getEmbedVideoUrl(project.videoUrl)}
                  title={project.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={project.videoUrl}
                  poster={project.image}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain bg-black"
                >
                  Your browser does not support the video tag.
                </video>
              )
            ) : project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/projects/portfolio_branding_1791501556017.jpg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#121727] text-[#858DA2]">
                <span>KC NEXUS Creative Asset</span>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Overview */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#121727] border border-[#282D40]">
              <h2 className="text-xl font-bold text-white mb-3">
                Project Overview &amp; Execution
              </h2>
              <p className="text-sm sm:text-base text-[#B8BDCA] leading-relaxed">
                {project.fullOverview || project.description}
              </p>
            </div>

            {/* Deliverables Checklist */}
            {project.deliverables && project.deliverables.length > 0 && (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#121727] border border-[#282D40]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFA500] mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Included Deliverables &amp; Output Scope
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-white/90">
                      <div className="w-4 h-4 rounded-full bg-[#FFA500]/20 flex items-center justify-center text-[#FFA500] shrink-0">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-[#121727] border border-[#282D40] space-y-4">
              <h3 className="text-base font-bold text-white">Project Actions</h3>
              <p className="text-xs text-[#858DA2] leading-relaxed">
                Interested in commissioning a similar solution for your brand, platform, or event?
              </p>

              <button
                type="button"
                onClick={() => navigate(`/contact?service=${encodeURIComponent(project.category)}`)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FFA500] hover:bg-[#FFB52E] text-black font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-[#FFA500]/20 cursor-pointer"
              >
                <span>Commission Similar Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {project.projectLink && (
                <a
                  href={project.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#080A14] hover:bg-[#161B2D] border border-[#282D40] text-white font-semibold text-xs transition-colors"
                >
                  <span>Visit Live Project Link</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#FFA500]" />
                </a>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-[#080A14] border border-[#282D40] text-xs text-[#858DA2] space-y-2">
              <div className="flex justify-between">
                <span>Studio:</span>
                <strong className="text-white">KC NEXUS</strong>
              </div>
              <div className="flex justify-between">
                <span>Discipline:</span>
                <strong className="text-white">{project.category}</strong>
              </div>
              <div className="flex justify-between">
                <span>Director:</span>
                <strong className="text-white">OKO-OBENI KELECHI SALVATION</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#282D40]/60">
            <h3 className="text-xl font-bold text-white mb-6">
              More in {project.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProjects.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/projects/${rel.slug}`}
                  className="group p-4 rounded-xl bg-[#121727] border border-[#282D40] hover:border-[#FFA500]/60 transition-all block"
                >
                  <img
                    src={rel.image}
                    alt={rel.title}
                    className="w-full aspect-video object-cover rounded-lg mb-3"
                  />
                  <span className="text-[10px] text-[#FFA500] uppercase font-bold block">{rel.category}</span>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FFA500] transition-colors">{rel.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
