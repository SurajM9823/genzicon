import React from 'react';
import { X, MapPin, Users, Heart, CheckCircle2, Sparkles } from 'lucide-react';
import { Project, Language } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  language?: Language;
  onClose: () => void;
  onDonate: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  language = 'en',
  onClose,
  onDonate
}) => {
  if (!project) return null;
  const isNp = language === 'np';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-none sm:rounded-xs max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-[#d8e3fb] relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="h-52 sm:h-60 relative shrink-0">
          <img
            src={project.imageUrl}
            alt={project.imageAlt}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 bg-white/90 hover:bg-white text-[#111c2d] rounded-none flex items-center justify-center shadow-xs transition-colors text-xs font-bold"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="bg-[#003c90] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none shadow-xs">
              {isNp && project.categoryNp ? project.categoryNp : project.category}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none shadow-xs ${
                project.status === 'Completed' ? 'bg-[#83fba5] text-[#00210c]' : 'bg-white text-[#003c90]'
              }`}
            >
              {project.status}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 flex flex-col">
          <h2
            className="text-lg sm:text-xl font-bold text-[#111c2d] mb-2 font-heading"
          >
            {isNp && project.titleNp ? project.titleNp : project.title}
          </h2>

          <div className="flex flex-wrap gap-2 text-xs text-[#434653] mb-3">
            <div className="flex items-center gap-1 bg-[#f0f3ff] px-2 py-0.5 rounded-none">
              <MapPin className="w-3.5 h-3.5 text-[#003c90]" />
              <span className="font-semibold">{isNp && project.locationNp ? project.locationNp : project.location}</span>
            </div>
            <div className="flex items-center gap-1 bg-[#f0f3ff] px-2 py-0.5 rounded-none">
              <Users className="w-3.5 h-3.5 text-[#00743a]" />
              <span className="font-semibold">{isNp && project.beneficiariesNp ? project.beneficiariesNp : project.beneficiaries}</span>
            </div>
          </div>

          <p className="text-xs text-[#434653] leading-relaxed mb-4">
            {isNp && project.descriptionNp ? project.descriptionNp : project.fullDescription || project.description}
          </p>

          {/* Funding Progress Bar */}
          <div className="bg-[#f9f9ff] p-3.5 rounded-none border border-[#d8e3fb] mb-4">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-1.5">
              <span className="text-[#434653]">{isNp ? 'संकलन प्रगति' : 'Funding Progress'}</span>
              <span className="text-[#00743a] font-bold">{project.fundedPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-[#e7eeff] rounded-none overflow-hidden mb-2">
              <div
                className="h-full bg-[#00743a] rounded-none transition-all duration-500"
                style={{ width: `${project.fundedPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#737784]">
              <span>{isNp ? 'संकलित:' : 'Raised:'} <strong>रू {project.raisedAmountNpr.toLocaleString()} (${project.raisedAmountUsd.toLocaleString()})</strong></span>
              <span>{isNp ? 'लक्ष्य:' : 'Target:'} <strong>रू {project.goalAmountNpr.toLocaleString()} (${project.goalAmountUsd.toLocaleString()})</strong></span>
            </div>
          </div>

          {/* Recent Milestones / Updates */}
          {project.updates && project.updates.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#111c2d] mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#003c90]" />
                <span>{isNp ? 'फिल्ड प्रगति' : 'Field Milestones'}</span>
              </h3>
              <div className="space-y-1.5">
                {project.updates.map((u, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-[#f0f3ff] rounded-none text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00743a] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#003c90] mr-1.5">[{u.date}]</span>
                      <strong className="text-[#111c2d]">{isNp && u.titleNp ? u.titleNp : u.title}: </strong>
                      <span className="text-[#434653]">{isNp && u.descriptionNp ? u.descriptionNp : u.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-auto pt-3 border-t border-[#e7eeff] flex flex-row gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#c3c6d5] text-[#434653] rounded-none sm:rounded-xs text-xs font-bold uppercase tracking-wider hover:bg-[#f9f9ff]"
            >
              {isNp ? 'बन्द' : 'Close'}
            </button>
            <button
              onClick={() => {
                onClose();
                onDonate(project);
              }}
              className="px-5 py-2 bg-[#00743a] text-white rounded-none sm:rounded-xs text-xs font-bold uppercase tracking-wider hover:bg-[#005227] transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>{isNp ? 'सहयोग गर्नुहोस्' : 'Donate to Project'}</span>
              <Heart className="w-3.5 h-3.5 fill-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
