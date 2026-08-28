import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  MapPin, 
  Users, 
  X, 
  DollarSign, 
  TrendingUp,
  Image as ImageIcon,
  Heart,
  Sparkles,
  ExternalLink,
  Sliders
} from 'lucide-react';
import { Project, Language } from '../../types';
import { apiCreateProject, apiUpdateProject, apiAdjustProjectDonations, apiDeleteProject } from '../../services/api';

interface AdminProjectsTabProps {
  language: Language;
  projects: Project[];
  onSaveProjects: (updated: Project[]) => void;
  showAddModalDirectly?: boolean;
  onCloseAddModalDirectly?: () => void;
}

export const AdminProjectsTab: React.FC<AdminProjectsTabProps> = ({
  language,
  projects,
  onSaveProjects,
  showAddModalDirectly,
  onCloseAddModalDirectly
}) => {
  const isNp = language === 'np';
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(showAddModalDirectly || false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Quick Donation Adjust Modal
  const [adjustModalProject, setAdjustModalProject] = useState<Project | null>(null);
  const [adjustAmountNpr, setAdjustAmountNpr] = useState<number>(50000);
  const [adjustDonorsCount, setAdjustDonorsCount] = useState<number>(5);
  const [adjustMode, setAdjustMode] = useState<'add' | 'set'>('add');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    titleNp: '',
    slug: '',
    category: 'Clothes Bank Nepal',
    categoryNp: 'कपडा बैंक नेपाल',
    categoryType: 'relief',
    description: '',
    descriptionNp: '',
    fullDescription: '',
    fullDescriptionNp: '',
    location: 'Kathmandu & Terai Districts',
    locationNp: 'काठमाडौँ तथा मधेस प्रदेश',
    beneficiaries: '1,000 Families',
    beneficiariesNp: '१,००० परिवार',
    goalAmountNpr: 1000000,
    raisedAmountNpr: 250000,
    donorCount: 45,
    goalAmountUsd: 7500,
    raisedAmountUsd: 1900,
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Genzicon field program Nepal'
  });

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      titleNp: '',
      slug: '',
      category: 'Clothes Bank Nepal',
      categoryNp: 'कपडा बैंक नेपाल',
      categoryType: 'relief',
      description: '',
      descriptionNp: '',
      fullDescription: '',
      fullDescriptionNp: '',
      location: 'Kathmandu & Terai',
      beneficiaries: '1,000 Citizens',
      goalAmountNpr: 1000000,
      raisedAmountNpr: 0,
      donorCount: 0,
      goalAmountUsd: 7500,
      raisedAmountUsd: 0,
      status: 'Active',
      imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Genzicon program photo'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    if (onCloseAddModalDirectly) onCloseAddModalDirectly();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this program from the live website?')) {
      const updated = projects.filter(p => p.id !== id);
      onSaveProjects(updated);
      await apiDeleteProject(id);
      showNotification('Program deleted successfully.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const goalNpr = Number(formData.goalAmountNpr) || 100000;
    const raisedNpr = Number(formData.raisedAmountNpr) || 0;
    const donorCount = Number(formData.donorCount) || 0;
    const fundedPct = Math.min(100, Math.round((raisedNpr / goalNpr) * 100));

    if (editingProject) {
      // Update local state
      const updatedList = projects.map(p => {
        if (p.id === editingProject.id) {
          return {
            ...p,
            ...formData,
            goalAmountNpr: goalNpr,
            raisedAmountNpr: raisedNpr,
            donorCount: donorCount,
            fundedPercentage: fundedPct
          } as Project;
        }
        return p;
      });
      onSaveProjects(updatedList);

      // Call backend update
      await apiUpdateProject(editingProject.id, {
        ...formData,
        goalAmountNpr: goalNpr,
        raisedAmountNpr: raisedNpr,
        donorCount: donorCount,
      });
      showNotification(`Program "${formData.title}" updated successfully in database!`);
    } else {
      // Create new
      const rawSlug = formData.slug || formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `program-${Date.now()}`;
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        slug: rawSlug,
        title: formData.title || 'Untitled Program',
        titleNp: formData.titleNp || formData.title,
        category: formData.category || 'Clothes Bank Nepal',
        categoryNp: formData.categoryNp || formData.category,
        categoryType: formData.categoryType || 'relief',
        description: formData.description || 'Genzicon community initiative in Nepal.',
        descriptionNp: formData.descriptionNp || formData.description,
        fullDescription: formData.fullDescription || formData.description,
        fullDescriptionNp: formData.fullDescriptionNp || formData.descriptionNp,
        status: (formData.status as any) || 'Active',
        fundedPercentage: fundedPct,
        goalAmountNpr: goalNpr,
        raisedAmountNpr: raisedNpr,
        donorCount: donorCount,
        goalAmountUsd: Number(formData.goalAmountUsd) || Math.round(goalNpr / 133),
        raisedAmountUsd: Number(formData.raisedAmountUsd) || Math.round(raisedNpr / 133),
        location: formData.location || 'Nepal',
        locationNp: formData.locationNp || formData.location,
        beneficiaries: formData.beneficiaries || '1,000+ Citizens',
        beneficiariesNp: formData.beneficiariesNp || formData.beneficiaries,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
        imageAlt: formData.title || 'Project photo'
      };

      try {
        const created = await apiCreateProject(newProj);
        if (created?.id) {
          newProj.id = String(created.id);
        }
      } catch (err) {
        console.warn('API create project error:', err);
      }

      onSaveProjects([newProj, ...projects]);
      showNotification(`New program "${newProj.title}" published with live tracking!`);
    }
    handleCloseModal();
  };

  // Quick Fund Booster & Donor Count adjustment
  const handleOpenAdjustModal = (project: Project) => {
    setAdjustModalProject(project);
    setAdjustAmountNpr(50000);
    setAdjustDonorsCount(5);
    setAdjustMode('add');
  };

  const handleApplyDonationAdjustment = async () => {
    if (!adjustModalProject) return;

    let newRaised = adjustModalProject.raisedAmountNpr;
    let newDonors = adjustModalProject.donorCount || 0;

    if (adjustMode === 'add') {
      newRaised += Number(adjustAmountNpr);
      newDonors += Number(adjustDonorsCount);
    } else {
      newRaised = Number(adjustAmountNpr);
      newDonors = Number(adjustDonorsCount);
    }

    const newPct = Math.min(100, Math.round((newRaised / (adjustModalProject.goalAmountNpr || 1)) * 100));

    const updated = projects.map(p => {
      if (p.id === adjustModalProject.id) {
        return {
          ...p,
          raisedAmountNpr: newRaised,
          donorCount: newDonors,
          fundedPercentage: newPct
        };
      }
      return p;
    });
    onSaveProjects(updated);

    // Call API
    if (adjustMode === 'add') {
      await apiAdjustProjectDonations(adjustModalProject.id, {
        add_amount: Number(adjustAmountNpr),
        add_donors: Number(adjustDonorsCount),
      });
    } else {
      await apiAdjustProjectDonations(adjustModalProject.id, {
        set_raised: Number(adjustAmountNpr),
        set_donors: Number(adjustDonorsCount),
      });
    }

    showNotification(`Updated donation tracking for "${adjustModalProject.title}": रू ${newRaised.toLocaleString()} raised (${newDonors} donors).`);
    setAdjustModalProject(null);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category.toLowerCase().includes(filterCategory.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="p-3 bg-[#00743a] text-white text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white p-4 sm:p-5 border border-[#d8e3fb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#111c2d] font-heading flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-[#003c90]" />
            <span>{isNp ? 'फिल्ड कार्यक्रम तथा आर्थिक संकलन व्यवस्थापन' : 'Field Initiatives & Live Donation Management'}</span>
          </h2>
          <p className="text-xs text-[#737784] mt-0.5">
            Create initiatives, configure SEO friendly slugs, adjust live donation amounts/donors, and monitor field progress.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Ground Program</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 border border-[#d8e3fb] shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#737784] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search programs by title, location, category..."
            className="w-full pl-9 pr-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
          >
            <option value="all">All Categories</option>
            <option value="clothes">Clothes Bank</option>
            <option value="green">Clean & Green Nepal</option>
            <option value="skill">Skills & Enterprise</option>
            <option value="relief">Relief & Health</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
          >
            <option value="all">All Status</option>
            <option value="active">Active Campaigns</option>
            <option value="urgent">Urgent Priority</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-[#d8e3fb] flex flex-col justify-between shadow-xs hover:border-[#003c90] transition-colors"
          >
            <div>
              {/* Image & Category */}
              <div className="relative h-44 overflow-hidden group">
                <img
                  src={project.imageUrl}
                  alt={project.imageAlt || project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-[#003c90] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    {project.category}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-xs ${
                    project.status === 'Urgent' ? 'bg-rose-600 text-white' : (project.status === 'Active' ? 'bg-[#00743a] text-white' : 'bg-slate-700 text-white')
                  }`}>
                    {project.status}
                  </span>
                </div>

                <div className="absolute bottom-2.5 right-2.5 bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">
                  {project.donorCount || Math.max(1, Math.round((project.raisedAmountNpr || 0) / 4500))} Donors
                </div>
              </div>

              {/* Body Content */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-[#737784]">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00743a] shrink-0" />
                    <span>{project.location}</span>
                  </div>
                  {project.slug && (
                    <span className="text-[10px] font-mono text-[#003c90] bg-[#f0f3ff] px-1.5 py-0.5">
                      /programs/{project.slug}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-[#111c2d] font-heading line-clamp-2">
                  {project.title}
                </h3>

                <p className="text-xs text-[#434653] line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Progress Bar & Values */}
                <div className="space-y-1 p-2.5 bg-[#f9f9ff] border border-[#e7eeff]">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-[#003c90]">{project.fundedPercentage}% Funded</span>
                    <span className="text-[#111c2d] font-mono">
                      रू {(project.raisedAmountNpr || 0).toLocaleString()} / रू {(project.goalAmountNpr || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#e7eeff] overflow-hidden">
                    <div
                      className="h-full bg-[#00743a] transition-all"
                      style={{ width: `${Math.min(100, project.fundedPercentage)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#434653] pt-0.5">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#003c90]" />
                    <span>{project.beneficiaries}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#737784]">
                    ≈ ${(project.raisedAmountUsd || Math.round((project.raisedAmountNpr || 0) / 133)).toLocaleString()} USD
                  </span>
                </div>
              </div>
            </div>

            {/* Program Action Toolbar */}
            <div className="p-3 bg-[#f9f9ff] border-t border-[#d8e3fb] flex items-center justify-between gap-2">
              {/* Quick Donation Adjust Button */}
              <button
                type="button"
                onClick={() => handleOpenAdjustModal(project)}
                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#00743a] text-xs font-bold border border-emerald-300 transition-colors flex items-center gap-1"
                title="Adjust live donation amount & donor count"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Adjust Funds</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(project)}
                  className="px-2.5 py-1.5 bg-white hover:bg-[#f0f3ff] text-[#003c90] text-xs font-bold border border-[#d8e3fb] flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
                  title="Delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Adjust Live Donations & Donors Modal */}
      {adjustModalProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full border border-[#d8e3fb] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#d8e3fb]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111c2d] font-heading flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00743a]" />
                <span>Adjust Program Donations & Donors</span>
              </h3>
              <button onClick={() => setAdjustModalProject(null)} className="p-1 hover:bg-[#f0f3ff]">
                <X className="w-4 h-4 text-[#737784]" />
              </button>
            </div>

            <div className="bg-[#f9f9ff] p-3 border border-[#e7eeff] space-y-1">
              <span className="text-[10px] font-bold text-[#003c90] uppercase block">Selected Program</span>
              <h4 className="text-sm font-bold text-[#111c2d]">{adjustModalProject.title}</h4>
              <div className="text-xs text-[#737784] font-mono flex items-center gap-3 pt-1">
                <span>Current Raised: <strong>रू {(adjustModalProject.raisedAmountNpr || 0).toLocaleString()}</strong></span>
                <span>Current Donors: <strong>{adjustModalProject.donorCount || 0}</strong></span>
              </div>
            </div>

            {/* Mode Switch: Add to existing vs Set exact value */}
            <div className="flex border border-[#d8e3fb]">
              <button
                type="button"
                onClick={() => { setAdjustMode('add'); setAdjustAmountNpr(50000); setAdjustDonorsCount(5); }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  adjustMode === 'add' ? 'bg-[#003c90] text-white' : 'bg-white text-[#434653] hover:bg-[#f0f3ff]'
                }`}
              >
                + Add / Boost Amount
              </button>
              <button
                type="button"
                onClick={() => { setAdjustMode('set'); setAdjustAmountNpr(adjustModalProject.raisedAmountNpr || 0); setAdjustDonorsCount(adjustModalProject.donorCount || 0); }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  adjustMode === 'set' ? 'bg-[#003c90] text-white' : 'bg-white text-[#434653] hover:bg-[#f0f3ff]'
                }`}
              >
                Set Exact Amount
              </button>
            </div>

            {adjustMode === 'add' && (
              <div>
                <label className="block text-[11px] font-bold text-[#737784] uppercase mb-1.5">
                  Quick Amount Presets (NPR)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10000, 25000, 50000, 100000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAdjustAmountNpr(amt)}
                      className={`py-1.5 text-xs font-bold border ${
                        adjustAmountNpr === amt
                          ? 'bg-[#00743a] text-white border-[#00743a]'
                          : 'bg-white text-[#111c2d] border-[#d8e3fb] hover:bg-[#f0f3ff]'
                      }`}
                    >
                      +रू {(amt / 1000)}k
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                {adjustMode === 'add' ? 'Donation Amount to Add (NPR)' : 'New Total Raised Amount (NPR)'} *
              </label>
              <input
                type="number"
                value={adjustAmountNpr}
                onChange={(e) => setAdjustAmountNpr(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-sm font-mono text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                {adjustMode === 'add' ? 'New Donor Count to Add (+ Donors)' : 'New Exact Donor Count'}
              </label>
              <input
                type="number"
                value={adjustDonorsCount}
                onChange={(e) => setAdjustDonorsCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-sm font-mono text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#d8e3fb]">
              <button
                type="button"
                onClick={() => setAdjustModalProject(null)}
                className="px-4 py-2 border border-[#d8e3fb] text-xs font-bold uppercase text-[#434653] hover:bg-[#f0f3ff]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyDonationAdjustment}
                className="px-5 py-2 bg-[#00743a] hover:bg-[#005227] text-white text-xs font-bold uppercase tracking-wider shadow-xs"
              >
                Save & Update Live Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Program Create/Edit Full Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#d8e3fb] shadow-xl p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#d8e3fb]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111c2d] font-heading flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-[#003c90]" />
                <span>{editingProject ? 'Edit Field Initiative' : 'Create New Field Initiative'}</span>
              </h3>
              <button onClick={handleCloseModal} className="p-1 hover:bg-[#f0f3ff]">
                <X className="w-4 h-4 text-[#737784]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Program Title (English) *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Winter Clothes & Blanket Relief Drive"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Program Title (Nepali)
                  </label>
                  <input
                    type="text"
                    value={formData.titleNp}
                    onChange={(e) => setFormData({ ...formData, titleNp: e.target.value })}
                    placeholder="तराई शीतलहर न्यानो कपडा वितरण"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
              </div>

              {/* SEO Slug */}
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  SEO URL Slug (e.g. winter-clothes-terai-relief)
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-[#f0f3ff] border border-r-0 border-[#d8e3fb] text-xs text-[#737784] font-mono">
                    /programs/
                  </span>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="winter-clothes-relief-terai"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] font-mono focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  >
                    <option value="Clothes Bank Nepal">Clothes Bank Nepal</option>
                    <option value="Clean Nepal, Green Nepal">Clean Nepal, Green Nepal</option>
                    <option value="Skills & Business Development">Skills & Business Development</option>
                    <option value="Himalayan Relief">Himalayan Relief</option>
                    <option value="Education & IT">Education & IT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  >
                    <option value="Active">Active Campaign</option>
                    <option value="Urgent">Urgent Support Required</option>
                    <option value="Completed">Successfully Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Location / District *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Dhanusha, Madhesh Province"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Financials & Donors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#f9f9ff] border border-[#e7eeff]">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Target Budget (NPR) *
                  </label>
                  <input
                    type="number"
                    value={formData.goalAmountNpr}
                    onChange={(e) => setFormData({ ...formData, goalAmountNpr: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-white text-xs font-mono text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Donations Raised (NPR) *
                  </label>
                  <input
                    type="number"
                    value={formData.raisedAmountNpr}
                    onChange={(e) => setFormData({ ...formData, raisedAmountNpr: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-white text-xs font-mono text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Verified Donors Count
                  </label>
                  <input
                    type="number"
                    value={formData.donorCount || 0}
                    onChange={(e) => setFormData({ ...formData, donorCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-white text-xs font-mono text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  />
                </div>
              </div>

              {/* Beneficiaries & Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Beneficiaries Target
                  </label>
                  <input
                    type="text"
                    value={formData.beneficiaries}
                    onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
                    placeholder="18,500+ Vulnerable Citizens"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Hero Photo URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
              </div>

              {/* Short Summary */}
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Short Description (English) *
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary for cards and previews..."
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  required
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Full Story & Operational Plan (English)
                </label>
                <textarea
                  rows={3}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Detailed breakdown of how donations are utilized on the ground..."
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#d8e3fb]">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-[#d8e3fb] text-xs font-bold uppercase text-[#434653] hover:bg-[#f0f3ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold uppercase tracking-wider shadow-xs"
                >
                  {editingProject ? 'Save Changes' : 'Publish Initiative'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
