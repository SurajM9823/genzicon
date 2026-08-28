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
  Image as ImageIcon
} from 'lucide-react';
import { Project, Language } from '../../types';
import { apiCreateProject, apiDeleteProject } from '../../services/api';

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

  // Form State
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    titleNp: '',
    category: 'Clothes Bank Nepal',
    categoryNp: 'कपडा बैंक नेपाल',
    categoryType: 'relief',
    description: '',
    descriptionNp: '',
    fullDescription: '',
    location: 'Kathmandu & Terai Districts',
    locationNp: 'काठमाडौँ तथा मधेस प्रदेश',
    beneficiaries: '1,000 Families',
    beneficiariesNp: '१,००० परिवार',
    goalAmountNpr: 1000000,
    raisedAmountNpr: 250000,
    goalAmountUsd: 7500,
    raisedAmountUsd: 1900,
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Genzicon field program Nepal'
  });

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      titleNp: '',
      category: 'Clothes Bank Nepal',
      categoryNp: 'कपडा बैंक नेपाल',
      categoryType: 'relief',
      description: '',
      descriptionNp: '',
      fullDescription: '',
      location: 'Kathmandu & Terai',
      beneficiaries: '1,000 Citizens',
      goalAmountNpr: 1000000,
      raisedAmountNpr: 0,
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

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      const updated = projects.filter(p => p.id !== id);
      onSaveProjects(updated);
      apiDeleteProject(id).catch(console.warn);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const goalNpr = Number(formData.goalAmountNpr) || 100000;
    const raisedNpr = Number(formData.raisedAmountNpr) || 0;
    const fundedPct = Math.min(100, Math.round((raisedNpr / goalNpr) * 100));

    if (editingProject) {
      // Update
      const updatedList = projects.map(p => {
        if (p.id === editingProject.id) {
          return {
            ...p,
            ...formData,
            goalAmountNpr: goalNpr,
            raisedAmountNpr: raisedNpr,
            fundedPercentage: fundedPct
          } as Project;
        }
        return p;
      });
      onSaveProjects(updatedList);
    } else {
      // Create new
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        title: formData.title || 'Untitled Program',
        titleNp: formData.titleNp || formData.title,
        category: formData.category || 'Grassroots Relief',
        categoryNp: formData.categoryNp || formData.category,
        categoryType: formData.categoryType || 'relief',
        description: formData.description || 'Genzicon community initiative.',
        descriptionNp: formData.descriptionNp || formData.description,
        fullDescription: formData.fullDescription || formData.description,
        status: formData.status || 'Active',
        fundedPercentage: fundedPct,
        goalAmountNpr: goalNpr,
        raisedAmountNpr: raisedNpr,
        goalAmountUsd: Number(formData.goalAmountUsd) || Math.round(goalNpr / 133),
        raisedAmountUsd: Number(formData.raisedAmountUsd) || Math.round(raisedNpr / 133),
        location: formData.location || 'Nepal',
        locationNp: formData.locationNp || formData.location,
        beneficiaries: formData.beneficiaries || '500+ Citizens',
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
    }
    handleCloseModal();
  };

  // Quick Fund Booster
  const handleQuickAddFunds = (id: string, amountToAdd: number) => {
    const updated = projects.map(p => {
      if (p.id === id) {
        const newRaised = p.raisedAmountNpr + amountToAdd;
        const newPct = Math.min(100, Math.round((newRaised / p.goalAmountNpr) * 100));
        return {
          ...p,
          raisedAmountNpr: newRaised,
          fundedPercentage: newPct
        };
      }
      return p;
    });
    onSaveProjects(updated);
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
      {/* Header Bar */}
      <div className="bg-white p-4 sm:p-5 border border-[#d8e3fb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#111c2d] font-heading">
            {isNp ? 'सक्रिय ग्राउन्ड कार्यक्रमहरू (Active Ground Programs)' : 'Active Ground Programs Management'}
          </h2>
          <p className="text-xs text-[#737784]">
            Add, update, or close active field projects shown across the homepage and initiatives portal.
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
            <option value="skill">Skills & Livelihood</option>
            <option value="water">Clean Water</option>
            <option value="education">Education</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="completed">Completed Only</option>
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
                    project.status === 'Active' ? 'bg-[#00743a] text-white' : 'bg-slate-700 text-white'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-[11px] text-[#737784]">
                  <MapPin className="w-3.5 h-3.5 text-[#00743a] shrink-0" />
                  <span>{project.location}</span>
                </div>

                <h3 className="text-sm font-bold text-[#111c2d] font-heading line-clamp-2">
                  {project.title}
                </h3>

                <p className="text-xs text-[#434653] line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Progress Bar & Values */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-[#003c90]">{project.fundedPercentage}% Funded</span>
                    <span className="text-[#737784]">
                      रू {project.raisedAmountNpr.toLocaleString()} / रू {project.goalAmountNpr.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#e7eeff] overflow-hidden">
                    <div
                      className="h-full bg-[#003c90] transition-all"
                      style={{ width: `${Math.min(100, project.fundedPercentage)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[#434653] pt-1">
                  <Users className="w-3.5 h-3.5 text-[#003c90]" />
                  <span>Impact: <strong>{project.beneficiaries}</strong></span>
                </div>
              </div>
            </div>

            {/* Program Action Toolbar */}
            <div className="p-3 bg-[#f9f9ff] border-t border-[#d8e3fb] flex items-center justify-between gap-2">
              {/* Quick fund increment button */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleQuickAddFunds(project.id, 50000)}
                  className="px-2 py-1 bg-white hover:bg-[#e7eeff] text-[#003c90] text-[10px] font-bold border border-[#d8e3fb] transition-colors"
                  title="Add NPR 50,000 verified offline donation to progress"
                >
                  +50k NPR
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(project)}
                  className="px-2.5 py-1 bg-white hover:bg-[#f0f3ff] text-[#003c90] text-xs font-bold border border-[#d8e3fb] flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-1 text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Program Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#d8e3fb] shadow-xl p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#d8e3fb]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111c2d] font-heading flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-[#003c90]" />
                <span>{editingProject ? 'Edit Ground Program' : 'Create New Ground Program'}</span>
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
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Winter Warmth & Clothes Relief Drive"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Program Title (नेपाली)
                  </label>
                  <input
                    type="text"
                    value={formData.titleNp || ''}
                    onChange={(e) => setFormData({ ...formData, titleNp: e.target.value })}
                    placeholder="e.g. जाडो न्यानो कपडा वितरण अभियान"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Pillar / Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  >
                    <option value="Clothes Bank Nepal">Clothes Bank Nepal (जनसेवा)</option>
                    <option value="Clean Nepal, Green Nepal">Clean Nepal, Green Nepal (हरित)</option>
                    <option value="Skills & Livelihood">Skills & Business Development (सीप)</option>
                    <option value="Clean Water & WASH">Clean Water & WASH</option>
                    <option value="Disaster Relief">Disaster Relief</option>
                    <option value="Child Education">Child Education</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Location / Districts
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Dhanusha, Mahottari"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Target Beneficiaries
                  </label>
                  <input
                    type="text"
                    value={formData.beneficiaries}
                    onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
                    placeholder="e.g. 5,000 Families"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Goal Amount (NPR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.goalAmountNpr}
                    onChange={(e) => setFormData({ ...formData, goalAmountNpr: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Raised Amount (NPR)
                  </label>
                  <input
                    type="number"
                    value={formData.raisedAmountNpr}
                    onChange={(e) => setFormData({ ...formData, raisedAmountNpr: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  >
                    <option value="Active">Active (Ongoing on Ground)</option>
                    <option value="Completed">Completed (100% Goal Met)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Program Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Short Summary Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Clear 1-2 sentence description for project cards..."
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Detailed Field Implementation Story (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.fullDescription || ''}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="In-depth details of communities served, distribution schedules, logistics..."
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                />
              </div>

              <div className="pt-3 border-t border-[#d8e3fb] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-[#f9f9ff] hover:bg-[#f0f3ff] text-[#434653] text-xs font-bold border border-[#d8e3fb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00743a] hover:bg-[#005227] text-white text-xs font-bold uppercase tracking-wider shadow-xs"
                >
                  {editingProject ? 'Update Program' : 'Publish Ground Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
