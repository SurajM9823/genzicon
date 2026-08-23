import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  HeartHandshake, 
  Newspaper, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Download, 
  Trash2, 
  Edit3, 
  Eye, 
  Search, 
  Save, 
  FileText,
  DollarSign,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { 
  Project, 
  VolunteerRecord, 
  DonationRecord, 
  NewsArticle, 
  GalleryMedia, 
  TeamMember,
  Language 
} from '../types';
import { 
  PROJECTS_DATA, 
  INITIAL_VOLUNTEER_RECORDS, 
  INITIAL_DONATION_RECORDS, 
  NEWS_ARTICLES_DATA, 
  GALLERY_ITEMS_DATA, 
  TEAM_MEMBERS 
} from '../data/mockData';

interface AdminScreenProps {
  language: Language;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ language }) => {
  const isNp = language === 'np';

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('genzicon_admin_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin Section
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'volunteers' | 'donations' | 'news' | 'gallery' | 'team' | 'seo'>('dashboard');

  // Dynamic Data States (backed by localStorage or initial mock data)
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('genzicon_admin_projects');
    return saved ? JSON.parse(saved) : PROJECTS_DATA;
  });

  const [volunteers, setVolunteers] = useState<VolunteerRecord[]>(() => {
    const saved = localStorage.getItem('genzicon_admin_volunteers');
    return saved ? JSON.parse(saved) : INITIAL_VOLUNTEER_RECORDS;
  });

  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    const saved = localStorage.getItem('genzicon_admin_donations');
    return saved ? JSON.parse(saved) : INITIAL_DONATION_RECORDS;
  });

  const [news, setNews] = useState<NewsArticle[]>(() => {
    const saved = localStorage.getItem('genzicon_admin_news');
    return saved ? JSON.parse(saved) : NEWS_ARTICLES_DATA;
  });

  const [gallery, setGallery] = useState<GalleryMedia[]>(() => {
    const saved = localStorage.getItem('genzicon_admin_gallery');
    return saved ? JSON.parse(saved) : GALLERY_ITEMS_DATA;
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('genzicon_admin_team');
    return saved ? JSON.parse(saved) : TEAM_MEMBERS;
  });

  // Modal / Form States
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    category: 'Clean Water',
    categoryType: 'water',
    description: '',
    location: 'Dhanusha, Nepal',
    beneficiaries: '5,000 Residents',
    goalAmountNpr: 1000000,
    raisedAmountNpr: 0,
    goalAmountUsd: 7500,
    raisedAmountUsd: 0,
    status: 'Active',
    fundedPercentage: 0,
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'New community project Nepal'
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('genzicon_admin_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('genzicon_admin_volunteers', JSON.stringify(volunteers));
  }, [volunteers]);

  useEffect(() => {
    localStorage.setItem('genzicon_admin_donations', JSON.stringify(donations));
  }, [donations]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((username === 'admin' || username === 'admin@genzicon.com' || username === 'suman') && (password === 'admin123' || password === 'genzicon2024' || password === 'admin')) {
      setIsAuthenticated(true);
      localStorage.setItem('genzicon_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Please use admin / admin123 or click Quick Demo Fill.');
    }
  };

  const handleQuickDemoFill = () => {
    setUsername('admin@genzicon.com');
    setPassword('admin123');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('genzicon_admin_auth');
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Project = {
      id: `proj-${Date.now()}`,
      title: newProject.title || 'Untitled Community Project',
      category: newProject.category || 'Education',
      categoryType: (newProject.categoryType as any) || 'education',
      description: newProject.description || 'Community initiative in Nepal.',
      status: (newProject.status as any) || 'Active',
      fundedPercentage: Math.round(((newProject.raisedAmountNpr || 0) / (newProject.goalAmountNpr || 1)) * 100),
      goalAmountNpr: Number(newProject.goalAmountNpr) || 1000000,
      raisedAmountNpr: Number(newProject.raisedAmountNpr) || 0,
      goalAmountUsd: Number(newProject.goalAmountUsd) || 7500,
      raisedAmountUsd: Number(newProject.raisedAmountUsd) || 0,
      location: newProject.location || 'Nepal',
      beneficiaries: newProject.beneficiaries || '1,000 Citizens',
      imageUrl: newProject.imageUrl || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      imageAlt: 'Project photo'
    };

    setProjects([created, ...projects]);
    setShowAddProjectModal(false);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleUpdateVolunteerStatus = (id: string, newStatus: 'Pending' | 'Approved' | 'Contacted') => {
    setVolunteers(volunteers.map(v => v.id === id ? { ...v, status: newStatus } : v));
  };

  const handleExportCSV = (type: string) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (type === 'volunteers') {
      csvContent += "ID,Name,Email,Phone,Province,District,Interest,Status\n";
      volunteers.forEach(v => {
        csvContent += `"${v.volunteerId}","${v.fullName}","${v.email}","${v.phone}","${v.province}","${v.district}","${v.interest}","${v.status}"\n`;
      });
    } else {
      csvContent += "Receipt,Donor Name,Email,Amount,Currency,Payment Method,Project,Date,Status\n";
      donations.forEach(d => {
        csvContent += `"${d.receiptNumber}","${d.donorName}","${d.donorEmail}",${d.amount},"${d.currency}","${d.paymentMethod}","${d.projectName}","${d.date}","${d.status}"\n`;
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `genzicon_${type}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div id="admin-login-screen" className="w-full min-h-screen pt-20 pb-16 flex items-center justify-center px-4 sm:px-6 bg-[#f9f9ff]">
        <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-none sm:rounded-xs border border-[#d8e3fb] shadow-md">
          <div className="w-10 h-10 rounded-none bg-[#003c90]/10 text-[#003c90] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5" />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#111c2d] mb-1 font-heading">
              {isNp ? 'प्रशासकीय लगइन' : 'Genzicon Admin Portal'}
            </h2>
            <p className="text-xs text-[#737784]">
              {isNp ? 'परियोजना, स्वयंसेवक तथा आर्थिक व्यवस्थापन प्रणाली' : 'Secure CMS & NGO Management System'}
            </p>
          </div>

          {loginError && (
            <div className="p-2.5 mb-4 rounded-none bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                Username / Email
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@genzicon.com"
                className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#003c90] text-white rounded-none sm:rounded-xs text-xs font-bold uppercase tracking-wider hover:bg-[#002660] transition-colors shadow-xs"
            >
              {isNp ? 'लगइन गर्नुहोस्' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* 1-Click Demo Fill button */}
          <div className="mt-4 pt-4 border-t border-[#f0f3ff] text-center">
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="w-full py-2 px-3 bg-[#e7eeff] hover:bg-[#d8e3fb] text-[#003c90] rounded-none sm:rounded-xs text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Click for 1-Click Demo Credentials</span>
            </button>
            <p className="text-[10px] text-[#737784] mt-1.5">Default: admin@genzicon.com / admin123</p>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div id="admin-dashboard-screen" className="w-full pt-16 pb-12 bg-[#f4f7fc] min-h-screen">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Top Control Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-none sm:rounded-xs border border-[#d8e3fb] shadow-xs mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-none bg-[#003c90] text-white flex items-center justify-center font-bold text-base shadow-xs">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-[#111c2d] font-heading">
                  Genzicon CMS & Admin Console
                </h1>
                <span className="px-2 py-0.5 rounded-none text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                  Super Admin
                </span>
              </div>
              <p className="text-[11px] text-[#737784]">Logged in as: Suman Yadav (Executive Director)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('projects')}
              className="flex-1 md:flex-none px-3 py-1.5 bg-[#00743a] text-white rounded-none sm:rounded-xs text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#005227] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-none sm:rounded-xs text-xs font-bold flex items-center gap-1 transition-colors border border-red-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {[
            { id: 'dashboard', label: 'Overview Analytics', icon: LayoutDashboard },
            { id: 'projects', label: `Projects (${projects.length})`, icon: FolderKanban },
            { id: 'volunteers', label: `Volunteers (${volunteers.length})`, icon: Users },
            { id: 'donations', label: `Donations (${donations.length})`, icon: HeartHandshake },
            { id: 'news', label: `News & Events (${news.length})`, icon: Newspaper },
            { id: 'gallery', label: 'Media Gallery', icon: ImageIcon },
            { id: 'team', label: 'Team & Advisors', icon: Users },
            { id: 'seo', label: 'SEO & Site Config', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#003c90] text-white shadow-sm'
                    : 'bg-white text-[#434653] border border-[#d8e3fb] hover:border-[#003c90] hover:text-[#003c90]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#d8e3fb] shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#737784] uppercase">Total Raised (NPR)</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    रू
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#111c2d]">रू 85,420,000</h3>
                <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +18.4% this quarter
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#d8e3fb] shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#737784] uppercase">Registered Volunteers</span>
                  <div className="w-9 h-9 rounded-xl bg-[#003c90]/10 text-[#003c90] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#111c2d]">5,842</h3>
                <p className="text-xs text-[#003c90] font-semibold mt-1">Across 77 Nepal Districts</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#d8e3fb] shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#737784] uppercase">Active Field Projects</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#111c2d]">{projects.filter(p => p.status === 'Active').length} Active</h3>
                <p className="text-xs text-[#737784] mt-1">{projects.filter(p => p.status === 'Completed').length} Completed</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#d8e3fb] shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#737784] uppercase">Audit & Compliance</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#111c2d]">AAA Certified</h3>
                <p className="text-xs text-purple-700 font-semibold mt-1">SWC Reg: 54128</p>
              </div>
            </div>

            {/* Quick tables: Recent Volunteers & Recent Donations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Volunteers */}
              <div className="bg-white p-6 rounded-3xl border border-[#d8e3fb] shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#111c2d] font-heading">Recent Volunteer Applications</h3>
                  <button
                    onClick={() => setActiveTab('volunteers')}
                    className="text-xs font-bold text-[#003c90] hover:underline"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {volunteers.slice(0, 4).map((v) => (
                    <div key={v.id} className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#d8e3fb] flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#111c2d]">{v.fullName}</h4>
                        <p className="text-[11px] text-[#737784]">{v.district} • {v.interest}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        v.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {v.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Donations */}
              <div className="bg-white p-6 rounded-3xl border border-[#d8e3fb] shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#111c2d] font-heading">Recent Charity Donations</h3>
                  <button
                    onClick={() => setActiveTab('donations')}
                    className="text-xs font-bold text-[#003c90] hover:underline"
                  >
                    View Ledger →
                  </button>
                </div>
                <div className="space-y-3">
                  {donations.slice(0, 4).map((d) => (
                    <div key={d.id} className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#d8e3fb] flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#111c2d]">{d.donorName}</h4>
                        <p className="text-[11px] text-[#737784]">{d.paymentMethod.toUpperCase()} • {d.projectName}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#00743a]">
                          {d.currency === 'NPR' ? `रू ${d.amount.toLocaleString()}` : `$${d.amount}`}
                        </span>
                        <p className="text-[10px] text-[#737784]">{d.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS MANAGEMENT */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-[#d8e3fb] shadow-soft flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#111c2d] font-heading">Manage Community Projects</h2>
                <p className="text-xs text-[#737784]">Add, edit budgets, change statuses and milestones</p>
              </div>
              <button
                onClick={() => setShowAddProjectModal(true)}
                className="px-5 py-2.5 bg-[#003c90] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#002660] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-white rounded-2xl border border-[#d8e3fb] overflow-hidden shadow-soft flex flex-col justify-between">
                  <div className="relative h-44 w-full bg-slate-100">
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        proj.status === 'Active' ? 'bg-[#00743a] text-white' : 'bg-slate-700 text-white'
                      }`}>
                        {proj.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#003c90] uppercase">{proj.category}</span>
                      <h3 className="text-base font-bold text-[#111c2d] mt-0.5 mb-2 font-heading">{proj.title}</h3>
                      <p className="text-xs text-[#737784] mb-3 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#00743a]" />
                        <span>{proj.location}</span>
                      </p>

                      {/* Progress bar */}
                      <div className="space-y-1 mb-4">
                        <div className="flex justify-between text-xs font-bold">
                          <span>Progress</span>
                          <span>{proj.fundedPercentage}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#e7eeff] overflow-hidden">
                          <div className="h-full bg-[#00743a]" style={{ width: `${proj.fundedPercentage}%` }} />
                        </div>
                        <div className="flex justify-between text-[11px] text-[#737784]">
                          <span>Raised: रू {proj.raisedAmountNpr.toLocaleString()}</span>
                          <span>Goal: रू {proj.goalAmountNpr.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#f0f3ff] flex items-center justify-between">
                      <button
                        onClick={() => {
                          const newStatus = proj.status === 'Active' ? 'Completed' : 'Active';
                          setProjects(projects.map(p => p.id === proj.id ? { ...p, status: newStatus } : p));
                        }}
                        className="text-xs font-bold text-[#003c90] hover:underline"
                      >
                        Toggle Status ({proj.status})
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VOLUNTEERS */}
        {activeTab === 'volunteers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-[#d8e3fb] shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#111c2d] font-heading">Volunteer Registrations</h2>
                <p className="text-xs text-[#737784]">Review applications, update approval status, and export database</p>
              </div>
              <button
                onClick={() => handleExportCSV('volunteers')}
                className="px-4 py-2.5 bg-[#00743a] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#005227] transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV List</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#d8e3fb] overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#f0f3ff] text-[#003c90] font-bold uppercase tracking-wider border-b border-[#d8e3fb]">
                      <th className="py-3.5 px-4">Volunteer ID</th>
                      <th className="py-3.5 px-4">Full Name</th>
                      <th className="py-3.5 px-4">Contact Info</th>
                      <th className="py-3.5 px-4">Province / District</th>
                      <th className="py-3.5 px-4">Interest Area</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d8e3fb]">
                    {volunteers.map((vol) => (
                      <tr key={vol.id} className="hover:bg-[#f9f9ff] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#003c90]">{vol.volunteerId}</td>
                        <td className="py-3.5 px-4 font-bold text-[#111c2d]">{vol.fullName}</td>
                        <td className="py-3.5 px-4">
                          <div>{vol.email}</div>
                          <div className="text-[#737784] font-medium">{vol.phone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div>{vol.province}</div>
                          <div className="text-[#737784]">{vol.district}</div>
                        </td>
                        <td className="py-3.5 px-4">{vol.interest}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            vol.status === 'Approved' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : vol.status === 'Contacted' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {vol.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={vol.status}
                            onChange={(e) => handleUpdateVolunteerStatus(vol.id, e.target.value as any)}
                            className="px-2 py-1 bg-white border border-[#d8e3fb] rounded-lg text-xs font-semibold focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approve</option>
                            <option value="Contacted">Contacted</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DONATIONS */}
        {activeTab === 'donations' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-[#d8e3fb] shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#111c2d] font-heading">Donations & Charity Ledger</h2>
                <p className="text-xs text-[#737784]">Track incoming funds from eSewa, Khalti, Fonepay QR, Bank & Cards</p>
              </div>
              <button
                onClick={() => handleExportCSV('donations')}
                className="px-4 py-2.5 bg-[#00743a] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#005227] transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Tax Ledger CSV</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#d8e3fb] overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#f0f3ff] text-[#003c90] font-bold uppercase tracking-wider border-b border-[#d8e3fb]">
                      <th className="py-3.5 px-4">Receipt No.</th>
                      <th className="py-3.5 px-4">Donor Name</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Payment Method</th>
                      <th className="py-3.5 px-4">Allocated Project</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d8e3fb]">
                    {donations.map((don) => (
                      <tr key={don.id} className="hover:bg-[#f9f9ff] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#003c90]">{don.receiptNumber}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#111c2d]">{don.donorName}</div>
                          <div className="text-[11px] text-[#737784]">{don.donorEmail}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#00743a]">
                          {don.currency === 'NPR' ? `रू ${don.amount.toLocaleString()}` : `$${don.amount}`}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                            {don.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-[200px] truncate">{don.projectName}</td>
                        <td className="py-3.5 px-4 text-[#737784]">{don.date}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            {don.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SEO & SITE CONFIG */}
        {activeTab === 'seo' && (
          <div className="bg-white p-8 rounded-3xl border border-[#d8e3fb] shadow-soft max-w-2xl space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-[#111c2d] font-heading">Website SEO & Organization Metadata</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111c2d] uppercase mb-1">Organization Title</label>
                <input
                  type="text"
                  defaultValue="Genzicon Foundation Nepal - Transparent Social Impact"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d8e3fb] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111c2d] uppercase mb-1">Meta Description (SEO)</label>
                <textarea
                  rows={3}
                  defaultValue="Genzicon Foundation is a registered non-profit organization in Nepal empowering remote communities through solar classrooms, clean water boreholes, rural healthcare, and youth volunteerism."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d8e3fb] text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111c2d] uppercase mb-1">SWC Affiliation No.</label>
                  <input
                    type="text"
                    defaultValue="54128"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d8e3fb] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111c2d] uppercase mb-1">PAN Number</label>
                  <input
                    type="text"
                    defaultValue="609823451"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d8e3fb] text-sm"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('SEO Metadata saved successfully!')}
                className="px-6 py-3 bg-[#003c90] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#002660] transition-colors"
              >
                Save SEO Metadata
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-[#d8e3fb] shadow-2xl">
            <h3 className="text-xl font-bold text-[#111c2d] mb-4 font-heading">Add New Community Project</h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111c2d] uppercase mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g. Solar Drinking Water in Rautahat"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d8e3fb] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111c2d] uppercase mb-1">Category</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d8e3fb] text-sm"
                  >
                    <option value="Clean Water">Clean Water</option>
                    <option value="Clean Energy">Clean Energy</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Disaster Relief">Disaster Relief</option>
                    <option value="Agriculture">Agriculture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111c2d] uppercase mb-1">Location in Nepal</label>
                  <input
                    type="text"
                    value={newProject.location}
                    onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                    placeholder="e.g. Dhanusha, Nepal"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d8e3fb] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111c2d] uppercase mb-1">Budget Goal (NPR)</label>
                  <input
                    type="number"
                    value={newProject.goalAmountNpr}
                    onChange={(e) => setNewProject({ ...newProject, goalAmountNpr: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d8e3fb] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111c2d] uppercase mb-1">Beneficiaries</label>
                  <input
                    type="text"
                    value={newProject.beneficiaries}
                    onChange={(e) => setNewProject({ ...newProject, beneficiaries: e.target.value })}
                    placeholder="e.g. 3,500 Villagers"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d8e3fb] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111c2d] uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Describe the problem, on-ground intervention, and community impact..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d8e3fb] text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#f0f3ff]">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#003c90] hover:bg-[#002660] text-white rounded-xl text-xs font-bold"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
