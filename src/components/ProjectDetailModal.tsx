import React, { useEffect } from 'react';
import { X, ArrowRight, Check, Calendar, Tag, ExternalLink } from 'lucide-react';
import { ProjectItem } from '../data/studioData';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onEnquireProject: (serviceName: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onEnquireProject,
}) => {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div className="relative w-full max-w-3xl my-8 bg-[#0D111E] border border-[#282D40] rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#282D40] bg-[#121727]">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFA500]/15 text-[#FFA500] border border-[#FFA500]/30">
              {project.category}
            </span>
            <span className="text-xs text-[#858DA2] flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              {project.year}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#858DA2] hover:text-white hover:bg-[#282D40] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Visual Image */}
        <div className="relative aspect-video w-full bg-black overflow-hidden group">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D111E] via-transparent to-transparent opacity-90" />
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h3 id="modal-project-title" className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
              {project.title}
            </h3>
            <p className="text-sm sm:text-base text-[#B8BDCA] leading-relaxed">
              {project.fullOverview}
            </p>
          </div>

          {/* Key Deliverables */}
          <div className="p-5 rounded-xl bg-[#121727] border border-[#282D40]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFA500] mb-3 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5" />
              Deliverables & Capabilities Included
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-white/90">
                  <div className="w-4 h-4 rounded-full bg-[#FFA500]/20 flex items-center justify-center text-[#FFA500] shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scope Note */}
          <div className="text-xs text-[#858DA2] bg-[#080A14] p-3.5 rounded-lg border border-[#282D40]/60 flex items-center justify-between">
            <span>
              <strong className="text-white/80">Classification:</strong> {project.clientScope}
            </span>
            <span className="text-[#FFA500] font-medium">KC Digital Studio Portfolio</span>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#282D40]">
            <p className="text-xs text-[#858DA2]">
              Need a similar solution for your brand or business?
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  onClose();
                  onEnquireProject(project.category);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#FFA500] hover:bg-[#FFB52E] text-black font-semibold text-sm tracking-wide transition-all shadow-md shadow-[#FFA500]/20"
              >
                Start a Similar Project
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
