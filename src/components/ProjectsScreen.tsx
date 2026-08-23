import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Users, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  Heart,
  ChevronRight
} from 'lucide-react';
import { PROJECTS_DATA } from '../data/mockData';
import { Project, NavTab, Language, Currency } from '../types';

interface ProjectsScreenProps {
  language: Language;
  onOpenProjectDetail: (project: Project) => void;
  onQuickDonateProject: (project: Project) => void;
  onSelectTab: (tab: NavTab) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  language,
  onOpenProjectDetail,
  onQuickDonateProject,
  onSelectTab
}) => {
  const isNp = language === 'np';
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Active' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>('NPR');

  const categories = [
    { id: 'All', labelEn: 'All Projects', labelNp: 'सबै' },
    { id: 'Clean Energy & Education', labelEn: 'Solar & Energy', labelNp: 'सौर्य ऊर्जा' },
    { id: 'Clean Water', labelEn: 'Clean Water', labelNp: 'शुद्ध खानेपानी' },
    { id: 'Healthcare', labelEn: 'Healthcare', labelNp: 'स्वास्थ्य' },
    { id: 'Education & Youth', labelEn: 'Education', labelNp: 'शिक्षा' },
    { id: 'Disaster Relief', labelEn: 'Relief', labelNp: 'राहत' },
    { id: 'Environment & Agriculture', labelEn: 'Chure & Agro', labelNp: 'कृषि तथा चुरे' }
  ];

  const filteredProjects = PROJECTS_DATA.filter((project) => {
    const matchesCategory = selectedCategory === 'All' || project.category.includes(selectedCategory) || (selectedCategory === 'Clean Energy & Education' && project.categoryType === 'clean-energy');
    const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.titleNp && project.titleNp.includes(searchQuery)) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div id="projects-screen" className="w-full pt-16 pb-12 bg-[#f9f9ff]">
      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-6">
        <div className="border-b border-[#d8e3fb] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#003c90] block mb-0.5">
                {isNp ? 'प्रत्यक्ष सामाजिक कार्य' : 'Community Initiatives'}
              </span>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111c2d]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {isNp ? 'नेपालका सामाजिक परियोजनाहरू' : 'Field Projects Across Nepal'}
              </h1>
            </div>
            <p className="text-xs text-[#434653] max-w-md">
              {isNp
                ? 'गाउँपालिका सम्झौता, पारदर्शी बजेट र प्रमाणित प्रगति विवरणसहित सञ्चालित कार्यक्रमहरू।'
                : 'Verified projects with itemized budgets, village council approval, and on-ground milestones.'}
            </p>
          </div>
        </div>

        {/* Search & Filter Controls: Compact, Sharp Rectangles */}
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#737784] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isNp ? 'परियोजना वा जिल्ला खोज्नुहोस्...' : 'Search by district or project...'}
              className="w-full pl-9 pr-3 py-2 bg-white rounded-none sm:rounded-xs border border-[#d8e3fb] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {/* Status Filter */}
            <div className="inline-flex bg-white border border-[#d8e3fb] rounded-none sm:rounded-xs">
              {(['All', 'Active', 'Completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1.5 text-xs font-bold transition-all ${
                    selectedStatus === status
                      ? 'bg-[#003c90] text-white'
                      : 'text-[#434653] hover:text-[#003c90]'
                  }`}
                >
                  {status === 'All' ? (isNp ? 'सबै' : 'All') : status === 'Active' ? (isNp ? 'सक्रिय' : 'Active') : (isNp ? 'सम्पन्न' : 'Completed')}
                </button>
              ))}
            </div>

            {/* Currency Toggle */}
            <div className="inline-flex bg-white border border-[#d8e3fb] rounded-none sm:rounded-xs">
              <button
                onClick={() => setCurrency('NPR')}
                className={`px-3 py-1.5 text-xs font-bold transition-all ${
                  currency === 'NPR' ? 'bg-[#00743a] text-white' : 'text-[#434653]'
                }`}
              >
                NPR (रू)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 text-xs font-bold transition-all ${
                  currency === 'USD' ? 'bg-[#00743a] text-white' : 'text-[#434653]'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs: Crisp rectangular bar */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors rounded-none sm:rounded-xs ${
                selectedCategory === cat.id
                  ? 'bg-[#003c90] text-white'
                  : 'bg-white text-[#434653] border border-[#d8e3fb] hover:border-[#003c90]'
              }`}
            >
              {isNp ? cat.labelNp : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid: Sharp minimal cards, low gaps */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {filteredProjects.length === 0 ? (
          <div className="p-10 bg-white border border-[#d8e3fb] rounded-none text-center text-xs text-[#737784]">
            {isNp ? 'कुनै परियोजना फेला परेन।' : 'No matching projects found.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredProjects.map((project) => {
              const raised = currency === 'NPR' ? `रू ${project.raisedAmountNpr.toLocaleString()}` : `$${project.raisedAmountUsd.toLocaleString()}`;
              const goal = currency === 'NPR' ? `रू ${project.goalAmountNpr.toLocaleString()}` : `$${project.goalAmountUsd.toLocaleString()}`;

              return (
                <div
                  key={project.id}
                  onClick={() => onOpenProjectDetail(project)}
                  className="bg-white border border-[#d8e3fb] rounded-none sm:rounded-xs overflow-hidden flex flex-col group cursor-pointer hover:border-[#003c90] transition-colors"
                >
                  {/* Image */}
                  <div className="h-44 overflow-hidden relative bg-slate-100">
                    <img
                      src={project.imageUrl}
                      alt={project.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-none flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{isNp && project.locationNp ? project.locationNp : project.location}</span>
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-white text-[#003c90] text-[10px] font-bold px-2 py-0.5 rounded-none shadow-xs">
                      {project.status}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#003c90] block mb-1">
                        {isNp && project.categoryNp ? project.categoryNp : project.category}
                      </span>
                      <h3
                        className="text-sm font-bold text-[#111c2d] mb-1.5 line-clamp-1 group-hover:text-[#003c90] transition-colors"
                      >
                        {isNp && project.titleNp ? project.titleNp : project.title}
                      </h3>
                      <p className="text-xs text-[#434653] line-clamp-2 mb-3 leading-relaxed">
                        {isNp && project.descriptionNp ? project.descriptionNp : project.description}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-[#737784] mb-3">
                        <Users className="w-3.5 h-3.5 text-[#00743a]" />
                        <span>{isNp && project.beneficiariesNp ? project.beneficiariesNp : project.beneficiaries}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-2.5 border-t border-[#f0f3ff]">
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-[#434653] mb-1">
                        <span>{isNp ? 'प्रगति' : 'Funded'}</span>
                        <span className="text-[#00743a] font-bold">{project.fundedPercentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#e7eeff] rounded-none overflow-hidden mb-2">
                        <div
                          className="h-full bg-[#00743a] transition-all duration-500"
                          style={{ width: `${project.fundedPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-[#737784] mb-2.5">
                        <span>{isNp ? 'संकलित:' : 'Raised:'} <strong>{raised}</strong></span>
                        <span>{isNp ? 'लक्ष्य:' : 'Target:'} <strong>{goal}</strong></span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenProjectDetail(project);
                          }}
                          className="flex-1 py-1.5 bg-[#f0f3ff] hover:bg-[#e7eeff] text-[#003c90] text-xs font-bold uppercase tracking-wider rounded-none sm:rounded-xs transition-colors text-center"
                        >
                          {isNp ? 'विवरण' : 'Details'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickDonateProject(project);
                          }}
                          className="flex-1 py-1.5 bg-[#00743a] hover:bg-[#005227] text-white text-xs font-bold uppercase tracking-wider rounded-none sm:rounded-xs transition-colors text-center"
                        >
                          {isNp ? 'सहयोग' : 'Donate'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
