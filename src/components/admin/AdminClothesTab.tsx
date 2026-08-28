import React, { useState, useEffect } from 'react';
import { 
  Shirt, 
  Search, 
  Download, 
  Plus, 
  MapPin, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Package, 
  Trash2, 
  X,
  FileText,
  UserCheck,
  Edit,
  Sparkles,
  Image,
  Quote,
  ShieldCheck,
  Building2,
  Send,
  Map,
  Navigation,
  ExternalLink,
  Save,
  RotateCcw,
  HelpCircle,
  Eye
} from 'lucide-react';
import { 
  ClothesDonationRequest, 
  ClothesDonor, 
  Language,
  ClothesHubConfig 
} from '../../types';
import { SAMPLE_CLOTHES_DONORS, DEFAULT_CLOTHES_HUB_CONFIG } from '../../data/mockData';
import { 
  apiUpdateClothesStatus, 
  apiGetClothesDonors, 
  apiCreateClothesDonor, 
  apiUpdateClothesDonor, 
  apiDeleteClothesDonor,
  apiSaveClothesHubConfig,
  getCleanMapEmbedUrl
} from '../../services/api';

interface AdminClothesTabProps {
  language: Language;
  clothesDonations: ClothesDonationRequest[];
  onSaveClothesDonations: (updated: ClothesDonationRequest[]) => void;
  hubConfig?: ClothesHubConfig;
  onSaveHubConfig?: (config: ClothesHubConfig) => void;
}

export const AdminClothesTab: React.FC<AdminClothesTabProps> = ({
  language,
  clothesDonations,
  onSaveClothesDonations,
  hubConfig: propHubConfig,
  onSaveHubConfig
}) => {
  const isNp = language === 'np';
  const [activeSubTab, setActiveSubTab] = useState<'donors' | 'donations' | 'hub_config'>('donors');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Hub Configuration State
  const [hubForm, setHubForm] = useState<ClothesHubConfig>(() => {
    if (propHubConfig) return propHubConfig;
    try {
      const saved = localStorage.getItem('genzicon_clothes_hub_config');
      return saved ? JSON.parse(saved) : DEFAULT_CLOTHES_HUB_CONFIG;
    } catch {
      return DEFAULT_CLOTHES_HUB_CONFIG;
    }
  });
  const [hubSaveToast, setHubSaveToast] = useState(false);

  useEffect(() => {
    if (propHubConfig) {
      setHubForm(propHubConfig);
    }
  }, [propHubConfig]);

  const handleSaveHubForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveHubConfig) {
      onSaveHubConfig(hubForm);
    } else {
      localStorage.setItem('genzicon_clothes_hub_config', JSON.stringify(hubForm));
      window.dispatchEvent(new Event('genzicon_clothes_hub_updated'));
      await apiSaveClothesHubConfig(hubForm);
    }
    setHubSaveToast(true);
    setTimeout(() => setHubSaveToast(false), 3500);
  };

  const handleResetHubForm = () => {
    if (confirm('Reset Central Hub location, phones, hours, and map to default Tinkune Hub?')) {
      setHubForm(DEFAULT_CLOTHES_HUB_CONFIG);
    }
  };

  // Clothes Donors List State
  const [donors, setDonors] = useState<ClothesDonor[]>(() => {
    const cached = localStorage.getItem('genzicon_clothes_donors');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Error parsing cached donors in admin', e);
      }
    }
    return SAMPLE_CLOTHES_DONORS;
  });

  // Fetch live donors from backend
  useEffect(() => {
    apiGetClothesDonors().then(liveDonors => {
      if (liveDonors && liveDonors.length > 0) {
        setDonors(liveDonors);
        localStorage.setItem('genzicon_clothes_donors', JSON.stringify(liveDonors));
      }
    });
  }, []);

  const saveDonors = (updated: ClothesDonor[]) => {
    setDonors(updated);
    localStorage.setItem('genzicon_clothes_donors', JSON.stringify(updated));
  };

  // Donor Modal State (Add or Edit)
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [editingDonorId, setEditingDonorId] = useState<string | null>(null);
  const [donorForm, setDonorForm] = useState<Partial<ClothesDonor>>({
    name: '',
    nameNp: '',
    location: 'Kathmandu',
    locationNp: 'काठमाडौँ',
    itemsCount: 30,
    clothesType: 'Winter Jackets & Sweaters',
    clothesTypeNp: 'जाडोको न्यानो ज्याकेट र स्विटर',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    note: '',
    noteNp: '',
    date: new Date().toISOString().split('T')[0],
    isVerified: true,
    isFeatured: true
  });

  const handleOpenAddDonor = () => {
    setEditingDonorId(null);
    setDonorForm({
      name: '',
      nameNp: '',
      location: 'Kathmandu',
      locationNp: 'काठमाडौँ',
      itemsCount: 30,
      clothesType: 'Winter Jackets & Sweaters',
      clothesTypeNp: 'जाडोको न्यानो ज्याकेट र स्विटर',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      note: '',
      noteNp: '',
      date: new Date().toISOString().split('T')[0],
      isVerified: true,
      isFeatured: true
    });
    setShowDonorModal(true);
  };

  const handleOpenEditDonor = (donor: ClothesDonor) => {
    setEditingDonorId(donor.id);
    setDonorForm({
      name: donor.name,
      nameNp: donor.nameNp || '',
      location: donor.location,
      locationNp: donor.locationNp || '',
      itemsCount: donor.itemsCount,
      clothesType: donor.clothesType,
      clothesTypeNp: donor.clothesTypeNp || '',
      imageUrl: donor.imageUrl || '',
      note: donor.note || '',
      noteNp: donor.noteNp || '',
      date: donor.date || new Date().toISOString().split('T')[0],
      isVerified: donor.isVerified ?? true,
      isFeatured: donor.isFeatured ?? true
    });
    setShowDonorModal(true);
  };

  const handleSaveDonorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorForm.name?.trim() || !donorForm.location?.trim()) {
      alert(isNp ? 'कृपया नाम र ठेगाना भर्नुहोस्।' : 'Please enter donor name and location.');
      return;
    }

    if (editingDonorId) {
      // Update existing donor
      const updatedList = donors.map(d => {
        if (d.id === editingDonorId) {
          return {
            ...d,
            name: donorForm.name!,
            nameNp: donorForm.nameNp,
            location: donorForm.location!,
            locationNp: donorForm.locationNp,
            itemsCount: Number(donorForm.itemsCount) || 1,
            clothesType: donorForm.clothesType || 'Winter Wear',
            clothesTypeNp: donorForm.clothesTypeNp,
            imageUrl: donorForm.imageUrl || '',
            note: donorForm.note,
            noteNp: donorForm.noteNp,
            date: donorForm.date,
            isVerified: donorForm.isVerified,
            isFeatured: donorForm.isFeatured
          };
        }
        return d;
      });
      saveDonors(updatedList);
      apiUpdateClothesDonor(editingDonorId, donorForm).catch(console.warn);
    } else {
      // Create new donor
      const newId = `c-donor-${Date.now()}`;
      const newDonorEntry: ClothesDonor = {
        id: newId,
        name: donorForm.name!,
        nameNp: donorForm.nameNp,
        location: donorForm.location!,
        locationNp: donorForm.locationNp,
        itemsCount: Number(donorForm.itemsCount) || 1,
        clothesType: donorForm.clothesType || 'Winter Wear',
        clothesTypeNp: donorForm.clothesTypeNp,
        imageUrl: donorForm.imageUrl || '',
        note: donorForm.note,
        noteNp: donorForm.noteNp,
        date: donorForm.date || new Date().toISOString().split('T')[0],
        isVerified: donorForm.isVerified ?? true,
        isFeatured: donorForm.isFeatured ?? true
      };
      saveDonors([newDonorEntry, ...donors]);
      apiCreateClothesDonor({
        name: donorForm.name!,
        nameNp: donorForm.nameNp,
        location: donorForm.location!,
        locationNp: donorForm.locationNp,
        itemsCount: Number(donorForm.itemsCount) || 1,
        clothesType: donorForm.clothesType || 'Winter Wear',
        clothesTypeNp: donorForm.clothesTypeNp,
        imageUrl: donorForm.imageUrl || '',
        note: donorForm.note,
        noteNp: donorForm.noteNp,
        date: donorForm.date,
        isVerified: donorForm.isVerified,
        isFeatured: donorForm.isFeatured
      }).catch(console.warn);
    }

    setShowDonorModal(false);
  };

  const handleDeleteDonor = (id: string) => {
    if (confirm(isNp ? 'के तपाईं यो दातालाई सूचीबाट हटाउन निश्चित हुनुहुन्छ?' : 'Are you sure you want to remove this donor from the Wall?')) {
      const filtered = donors.filter(d => d.id !== id);
      saveDonors(filtered);
      apiDeleteClothesDonor(id).catch(console.warn);
    }
  };

  // Submissions Handling
  const handleUpdateDonationStatus = (id: string, newStatus: ClothesDonationRequest['status']) => {
    const updated = clothesDonations.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    onSaveClothesDonations(updated);
    apiUpdateClothesStatus(id, newStatus).catch(console.warn);
  };

  const handleDeleteDonation = (id: string) => {
    if (confirm(isNp ? 'के तपाईं यो कपडा दर्ता रेकर्ड मेटाउन चाहनुहुन्छ?' : 'Delete this clothes dispatch record?')) {
      onSaveClothesDonations(clothesDonations.filter(item => item.id !== id));
    }
  };

  // Convert submission to honored donor
  const handleApproveAndAddDonor = (submission: ClothesDonationRequest) => {
    setEditingDonorId(null);
    setDonorForm({
      name: submission.donorName,
      nameNp: '',
      location: `${submission.city || submission.district}, ${submission.province.replace(' Province', '')}`,
      locationNp: '',
      itemsCount: submission.approxItemsCount || 20,
      clothesType: submission.clothesType === 'winter' ? 'Winter Jackets & Sweaters' : (submission.clothesType === 'blankets' ? 'Blankets & Quilts' : 'Family Clothes Set'),
      clothesTypeNp: '',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      note: submission.notes || 'Glad to contribute clean clothes for community warmth.',
      noteNp: '',
      date: submission.date || new Date().toISOString().split('T')[0],
      isVerified: true,
      isFeatured: true
    });
    setShowDonorModal(true);
  };

  // Filtered Donors
  const filteredDonors = donors.filter(d => {
    const matchesSearch = !searchTerm || 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.nameNp && d.nameNp.includes(searchTerm)) ||
      d.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.clothesType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Filtered Submissions
  const filteredDonations = clothesDonations.filter(c => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || 
      (c.id && c.id.toLowerCase().includes(term)) ||
      (c.donorName && c.donorName.toLowerCase().includes(term)) ||
      (c.phone && c.phone.includes(term)) ||
      (c.district && c.district.toLowerCase().includes(term)) ||
      (c.address && c.address.toLowerCase().includes(term)) ||
      (c.notes && c.notes.toLowerCase().includes(term));
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeSubTab === 'donors') {
      csvContent += "ID,Name,Name (Nepali),Location,Pieces,Clothes Type,Date,Verified,Featured,Note\n";
      donors.forEach(d => {
        csvContent += `"${d.id}","${d.name}","${d.nameNp || ''}","${d.location}",${d.itemsCount},"${d.clothesType}","${d.date}",${d.isVerified},${d.isFeatured},"${(d.note || '').replace(/"/g, '""')}"\n`;
      });
    } else {
      csvContent += "ID,Donor Name,Phone,Email,Province,District,City,Address,Clothes Type,Pieces,Mode,Date,Status,Notes\n";
      clothesDonations.forEach(c => {
        csvContent += `"${c.id}","${c.donorName}","${c.phone}","${c.email || ''}","${c.province}","${c.district}","${c.city}","${c.address.replace(/"/g, '""')}","${c.clothesType}",${c.approxItemsCount},"${c.donationMode}","${c.date}","${c.status}","${(c.notes || '').replace(/"/g, '""')}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `genzicon_clothes_${activeSubTab}_export.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const totalDonorPieces = donors.reduce((sum, d) => sum + (d.itemsCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header with Stats */}
      <div className="bg-white p-5 border border-[#d8e3fb] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#e7eeff] text-[#003c90]">
              <Shirt className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#111c2d] font-heading">
                {isNp ? 'कपडा बैंक नेपाल व्यवस्थापन' : 'Clothes Bank Nepal Management'}
              </h2>
              <p className="text-xs text-[#737784]">
                {isNp 
                  ? 'दाताहरूको प्रोफाइल, तस्बिर, स्थान तथा प्राप्त कपडा पार्सलहरूको व्यवस्थापन गर्नुहोस्।' 
                  : 'Manage the public Donors Showcase Wall, donor photos, locations, and track incoming clothes dispatches.'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="p-2.5 bg-[#f0f4fc] border border-[#d8e3fb]">
            <span className="text-[10px] uppercase font-bold text-[#737784] block">{isNp ? 'दाता संख्या' : 'Honored Donors'}</span>
            <span className="text-base font-black text-[#003c90] font-heading">{donors.length}</span>
          </div>
          <div className="p-2.5 bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">{isNp ? 'कुल कपडा थान' : 'Total Garments'}</span>
            <span className="text-base font-black text-[#00743a] font-heading">{totalDonorPieces.toLocaleString()}</span>
          </div>
          <div className="p-2.5 bg-amber-50 border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">{isNp ? 'नयाँ अनुरोध' : 'Pending Dispatches'}</span>
            <span className="text-base font-black text-amber-800 font-heading">
              {clothesDonations.filter(c => c.status === 'Pending').length}
            </span>
          </div>
        </div>
      </div>

      {/* Sub Tabs: Donors Wall vs Dispatches vs Central Hub Config */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#d8e3fb] bg-white p-1 gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => {
              setActiveSubTab('donors');
              setSearchTerm('');
            }}
            className={`px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'donors'
                ? 'bg-[#003c90] text-white shadow-xs'
                : 'text-[#434653] hover:bg-[#f0f3ff]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{isNp ? '१. कपडा दाताहरूको सूची (Donors Wall)' : '1. Honored Clothes Donors Wall'}</span>
            <span className="px-1.5 py-0.2 bg-white/20 text-[10px]">{donors.length}</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('donations');
              setSearchTerm('');
            }}
            className={`px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'donations'
                ? 'bg-[#003c90] text-white shadow-xs'
                : 'text-[#434653] hover:bg-[#f0f3ff]'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>{isNp ? '२. आएका संकलन / पार्सल विवरण' : '2. Incoming Dispatches'}</span>
            <span className="px-1.5 py-0.2 bg-white/20 text-[10px]">{clothesDonations.length}</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('hub_config');
              setSearchTerm('');
            }}
            className={`px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'hub_config'
                ? 'bg-[#00743a] text-white shadow-xs'
                : 'text-[#434653] hover:bg-[#f0f3ff]'
            }`}
          >
            <Map className="w-4 h-4 text-emerald-300" />
            <span>{isNp ? '३. मुख्य केन्द्र, फोन र गुगल म्याप (Hub & Map)' : '3. Central Hub & Google Maps Settings'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 pr-2">
          {activeSubTab === 'donors' && (
            <button
              onClick={handleOpenAddDonor}
              className="px-3 py-1.5 bg-[#00743a] hover:bg-[#00542a] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isNp ? 'नयाँ दाता थप्नुहोस्' : 'Add Clothes Donor'}</span>
            </button>
          )}

          {activeSubTab !== 'hub_config' && (
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-white border border-[#d8e3fb] hover:bg-[#f0f3ff] text-[#003c90] text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 border border-[#d8e3fb] flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#737784]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeSubTab === 'donors'
                ? (isNp ? 'दाताको नाम, स्थान वा कपडा प्रकार खोज्नुहोस्...' : 'Search by donor name, location, or clothes category...')
                : (isNp ? 'दाताको नाम, फोन वा जिल्ला खोज्नुहोस्...' : 'Search dispatches by donor, phone, address...')
            }
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#d8e3fb] bg-[#f9f9ff] text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
          />
        </div>

        {activeSubTab === 'donations' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#737784] uppercase font-bold">{isNp ? 'स्थिति:' : 'Status:'}</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs border border-[#d8e3fb] bg-[#f9f9ff] text-[#111c2d] focus:outline-none"
            >
              <option value="all">{isNp ? 'सबै' : 'All Statuses'}</option>
              <option value="Pending">Pending (प्रतीक्षारत)</option>
              <option value="Approved">Approved (स्वीकृत)</option>
              <option value="In Transit">In Transit (ढुवानीमा)</option>
              <option value="Received">Received (प्राप्त भयो)</option>
              <option value="Distributed">Distributed (वितरण सम्पन्न)</option>
            </select>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: DONORS WALL MANAGEMENT */}
      {activeSubTab === 'donors' && (
        <div className="bg-white border border-[#d8e3fb] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#111c2d]">
              <thead className="bg-[#f0f4fc] border-b border-[#d8e3fb] text-[11px] font-bold text-[#003c90] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Donor Profile / Avatar</th>
                  <th className="py-3 px-4">Location / Place</th>
                  <th className="py-3 px-4">Items / Category</th>
                  <th className="py-3 px-4">Heartfelt Message / Note</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3ff]">
                {filteredDonors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-[#737784]">
                      {isNp ? 'कुनै दाता फेला परेन।' : 'No clothes donors found.'}
                    </td>
                  </tr>
                ) : (
                  filteredDonors.map((donor, idx) => (
                    <tr key={donor.id || idx} className="hover:bg-[#f9faff] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={donor.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(donor.name)}&background=003c90&color=fff`}
                            alt={donor.name}
                            className="w-10 h-10 rounded-full object-cover border border-[#d8e3fb]"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(donor.name)}&background=003c90&color=fff`;
                            }}
                          />
                          <div>
                            <span className="font-bold text-[#111c2d] block text-xs">
                              {donor.name}
                            </span>
                            {donor.nameNp && (
                              <span className="text-[11px] text-[#737784] block font-medium">
                                {donor.nameNp}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-[#434653]">
                          <MapPin className="w-3.5 h-3.5 text-[#00743a] shrink-0" />
                          <span>{donor.location}</span>
                        </div>
                        {donor.locationNp && (
                          <span className="text-[10px] text-[#737784] block pl-5">
                            {donor.locationNp}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 bg-[#e7eeff] text-[#003c90] font-black text-xs">
                          {donor.itemsCount} Pieces
                        </span>
                        <span className="block text-[11px] text-[#434653] font-medium mt-0.5">
                          {donor.clothesType}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <p className="text-xs text-[#434653] line-clamp-2 italic">
                          "{donor.note || 'Contributed warm clothing for community relief.'}"
                        </p>
                      </td>

                      <td className="py-3 px-4 text-[11px] text-[#737784] font-mono">
                        {donor.date}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditDonor(donor)}
                            title="Edit Donor"
                            className="p-1.5 bg-[#f0f4ff] hover:bg-[#003c90] hover:text-white text-[#003c90] transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDonor(donor.id)}
                            title="Delete Donor"
                            className="p-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CLOTHES DONATIONS DISPATCHES */}
      {activeSubTab === 'donations' && (
        <div className="bg-white border border-[#d8e3fb] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#111c2d]">
              <thead className="bg-[#f0f4fc] border-b border-[#d8e3fb] text-[11px] font-bold text-[#003c90] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ref ID / Donor</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Origin / Address</th>
                  <th className="py-3 px-4">Clothes Details</th>
                  <th className="py-3 px-4">Delivery Mode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3ff]">
                {filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-[#737784]">
                      {isNp ? 'कुनै कपडा संकलन विवरण फेला परेन।' : 'No clothes donation dispatches found.'}
                    </td>
                  </tr>
                ) : (
                  filteredDonations.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f9faff] transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10px] text-[#003c90] font-bold block">
                          #{item.id}
                        </span>
                        <span className="font-bold text-xs text-[#111c2d]">
                          {item.donorName}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 font-mono text-xs text-[#111c2d]">
                          <Phone className="w-3 h-3 text-[#00743a]" />
                          <span>{item.phone}</span>
                        </div>
                        {item.email && (
                          <span className="text-[10px] text-[#737784] block truncate max-w-[140px]">
                            {item.email}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-xs text-[#434653]">
                          <strong>{item.district}</strong>, {item.province.replace(' Province', '')}
                        </div>
                        <div className="text-[10px] text-[#737784] truncate max-w-xs">
                          {item.address}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-xs text-[#003c90]">
                          {item.approxItemsCount} Pieces
                        </span>
                        <span className="text-[11px] text-[#434653] block">
                          {item.clothesType}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#f0f4fc] text-[#003c90] text-[10px] font-bold">
                          {item.donationMode}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={item.status}
                          onChange={(e) => handleUpdateDonationStatus(item.id, e.target.value as any)}
                          className={`text-[11px] font-bold px-2 py-1 border rounded-none focus:outline-none ${
                            item.status === 'Received' || item.status === 'Distributed'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : item.status === 'In Transit' || item.status === 'Approved'
                              ? 'bg-blue-50 border-blue-300 text-[#003c90]'
                              : 'bg-amber-50 border-amber-300 text-amber-800'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Received">Received</option>
                          <option value="Distributed">Distributed</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApproveAndAddDonor(item)}
                            title="Honor as Verified Donor on Wall"
                            className="px-2 py-1 bg-emerald-100 hover:bg-emerald-600 hover:text-white text-emerald-800 text-[10px] font-bold transition-colors flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Honor on Wall</span>
                          </button>
                          <button
                            onClick={() => handleDeleteDonation(item.id)}
                            title="Delete"
                            className="p-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CENTRAL CLOTHES HUB & GOOGLE MAPS CONFIGURATION */}
      {activeSubTab === 'hub_config' && (
        <form onSubmit={handleSaveHubForm} className="space-y-6">
          {/* Header Bar */}
          <div className="bg-white p-4 sm:p-5 border border-[#d8e3fb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#111c2d] font-heading flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#00743a]" />
                <span>
                  {isNp ? 'काठमाडौँ मुख्य कपडा संकलन केन्द्र, फोन र म्याप व्यवस्थापन' : 'Central Clothes Hub Location, Phones & Google Maps'}
                </span>
              </h3>
              <p className="text-xs text-[#737784] mt-0.5">
                {isNp 
                  ? 'कपडा बैंक पृष्ठको नक्सा, २ वटा मोबाइल नम्बर, खुल्ने समय र ठेगाना यहाँबाट सम्पादन गर्नुहोस्।' 
                  : 'Update the live interactive Google Map embed, hotline contact numbers (at least 2), address, and operating hours.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {hubSaveToast && (
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 border border-emerald-200 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isNp ? 'सार्वजनिक पृष्ठमा प्रकाशित भयो!' : 'Published Live!'}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleResetHubForm}
                className="px-3 py-2 bg-[#f9f9ff] hover:bg-[#f0f3ff] text-[#434653] text-xs font-bold border border-[#d8e3fb] flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isNp ? 'डिफल्ट फर्काउनुहोस्' : 'Reset Defaults'}</span>
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-[#00743a] hover:bg-[#00542a] text-white text-xs font-bold uppercase tracking-wider shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isNp ? 'सेभ र अपडेट गर्नुहोस्' : 'Save & Publish Live'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Inputs */}
            <div className="lg:col-span-7 space-y-5">
              {/* Section 1: Hub Names & Address */}
              <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#f0f3ff]">
                  <Building2 className="w-4 h-4 text-[#003c90]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                    {isNp ? '१. संकलन केन्द्रको नाम र ठेगाना (Hub Identity & Address)' : '1. Hub Identity & Drop-off Location'}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'केन्द्रको नाम (English) *' : 'Hub Name (English) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={hubForm.hubName}
                      onChange={(e) => setHubForm({ ...hubForm, hubName: e.target.value })}
                      placeholder="e.g. Genzicon Clothes Bank Nepal - Central Hub"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'केन्द्रको नाम (नेपाली)' : 'Hub Name (Nepali)'}
                    </label>
                    <input
                      type="text"
                      value={hubForm.hubNameNp}
                      onChange={(e) => setHubForm({ ...hubForm, hubNameNp: e.target.value })}
                      placeholder="जस्तै: जेन्जिकन कपडा बैंक नेपाल - मुख्य संकलन केन्द्र"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'सडक / टोल ठेगाना (English) *' : 'Street / Area Address (English) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={hubForm.address}
                      onChange={(e) => setHubForm({ ...hubForm, address: e.target.value })}
                      placeholder="e.g. Tinkune / New Baneshwor (Near Ring Road)"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'सडक / टोल ठेगाना (नेपाली)' : 'Street / Area Address (Nepali)'}
                    </label>
                    <input
                      type="text"
                      value={hubForm.addressNp}
                      onChange={(e) => setHubForm({ ...hubForm, addressNp: e.target.value })}
                      placeholder="जस्तै: तीनकुने / नयाँ बानेश्वर (रिङ रोड नजिक)"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'नजिकको चिनारी / ल्यान्डमार्क (English)' : 'Landmark & Postal Code (English)'}
                    </label>
                    <input
                      type="text"
                      value={hubForm.landmark}
                      onChange={(e) => setHubForm({ ...hubForm, landmark: e.target.value })}
                      placeholder="e.g. Opposite to Central Park, Kathmandu 44600"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'नजिकको चिनारी / ल्यान्डमार्क (नेपाली)' : 'Landmark & Postal Code (Nepali)'}
                    </label>
                    <input
                      type="text"
                      value={hubForm.landmarkNp}
                      onChange={(e) => setHubForm({ ...hubForm, landmarkNp: e.target.value })}
                      placeholder="जस्तै: सेन्ट्रल पार्क अगाडि, काठमाडौँ ४४६००"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'सहर / जिल्ला' : 'City & District'}
                    </label>
                    <input
                      type="text"
                      value={hubForm.city}
                      onChange={(e) => setHubForm({ ...hubForm, city: e.target.value, district: e.target.value })}
                      placeholder="Kathmandu"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'प्रदेश' : 'Province'}
                    </label>
                    <input
                      type="text"
                      value={hubForm.province}
                      onChange={(e) => setHubForm({ ...hubForm, province: e.target.value })}
                      placeholder="Bagmati Province"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Phone Numbers (Support at least 2 numbers) */}
              <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#f0f3ff]">
                  <Phone className="w-4 h-4 text-[#00743a]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                    {isNp ? '२. सम्पर्क फोन नम्बरहरू (At Least 2 Contact Numbers)' : '2. Contact Phone Numbers & Dispatch Hotline'}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'मुख्य हटलाइन फोन / मोबाइल १ *' : 'Primary Mobile / Hotline 1 *'}
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#00743a]" />
                      <input
                        type="text"
                        required
                        value={hubForm.phone1}
                        onChange={(e) => setHubForm({ ...hubForm, phone1: e.target.value })}
                        placeholder="e.g. 9823000000"
                        className="w-full pl-9 pr-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white font-mono font-bold"
                      />
                    </div>
                    <p className="text-[10px] text-[#737784] mt-1">
                      {isNp ? 'पठाओ, इनड्राइभ वा दाताले फोन गर्ने पहिलो नम्बर।' : 'Direct line for riders, courier parcels & donors.'}
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'सहायक फोन / ह्वाट्सएप २ *' : 'Secondary Phone / WhatsApp 2 *'}
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#003c90]" />
                      <input
                        type="text"
                        required
                        value={hubForm.phone2}
                        onChange={(e) => setHubForm({ ...hubForm, phone2: e.target.value })}
                        placeholder="e.g. 01-4240000 or 9841000000"
                        className="w-full pl-9 pr-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white font-mono font-bold"
                      />
                    </div>
                    <p className="text-[10px] text-[#737784] mt-1">
                      {isNp ? 'वैकल्पिक सम्पर्क वा कार्यालयको ल्यान्डलाइन।' : 'Alternative contact or office landline.'}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'इमेल ठेगाना' : 'Hub Email (Optional)'}
                    </label>
                    <input
                      type="email"
                      value={hubForm.email || ''}
                      onChange={(e) => setHubForm({ ...hubForm, email: e.target.value })}
                      placeholder="clothes@genzicon.com"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Operating Hours & Rider Coordination Note */}
              <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#f0f3ff]">
                  <Clock className="w-4 h-4 text-[#003c90]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                    {isNp ? '३. खुल्ने समय र ढुवानी निर्देशन' : '3. Operating Hours & Dispatch Instructions'}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'समय (English) *' : 'Operating Hours (English) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={hubForm.operatingHours}
                      onChange={(e) => setHubForm({ ...hubForm, operatingHours: e.target.value })}
                      placeholder="8:00 AM – 6:00 PM Daily (Open Saturdays)"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'समय (नेपाली)' : 'Operating Hours (Nepali)'}
                    </label>
                    <input
                      type="text"
                      value={hubForm.operatingHoursNp}
                      onChange={(e) => setHubForm({ ...hubForm, operatingHoursNp: e.target.value })}
                      placeholder="बिहान ८:०० देखि साँझ ६:०० सम्म (शनिबार पनि खुला)"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'राइडर तथा ढुवानी निर्देशन नोट (English)' : 'Rider / Delivery Instruction Note (English)'}
                    </label>
                    <textarea
                      rows={2}
                      value={hubForm.contactNote}
                      onChange={(e) => setHubForm({ ...hubForm, contactNote: e.target.value })}
                      placeholder="Direct phone contact for rider delivery (Pathao/InDrive) and cargo parcel coordination."
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'राइडर तथा ढुवानी निर्देशन नोट (नेपाली)' : 'Rider / Delivery Instruction Note (Nepali)'}
                    </label>
                    <textarea
                      rows={2}
                      value={hubForm.contactNoteNp}
                      onChange={(e) => setHubForm({ ...hubForm, contactNoteNp: e.target.value })}
                      placeholder="पठाओ, इनड्राइभ राइडर वा कुरियर पार्सल आइपुग्दा माथिको फोनमा सम्पर्क गर्न भन्नुहोला।"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Google Maps Embed Code & Directions Link */}
              <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#f0f3ff]">
                  <Map className="w-4 h-4 text-[#003c90]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                    {isNp ? '४. गुगल म्याप एम्बेड कोड तथा डाइरेक्सन लिङ्क' : '4. Google Maps iFrame Embed & Directions Link'}
                  </h4>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-[#111c2d] uppercase tracking-wider">
                        {isNp ? 'गुगल म्याप iFrame Embed कोड वा लिङ्क *' : 'Google Maps iFrame Embed Code or URL *'}
                      </label>
                      <span className="text-[11px] text-[#003c90] font-bold">
                        {isNp ? 'iFrame कोड सिधै पेस्ट गर्न सकिन्छ' : 'Accepts full <iframe ...> tag or URL'}
                      </span>
                    </div>

                    <textarea
                      rows={4}
                      required
                      value={hubForm.mapEmbedUrl}
                      onChange={(e) => setHubForm({ ...hubForm, mapEmbedUrl: e.target.value })}
                      placeholder='Paste <iframe src="https://www.google.com/maps/embed?..." ...></iframe> or direct Google Maps link'
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-mono text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                    />

                    <div className="mt-2 p-2.5 bg-[#f0f4fc] border border-[#d8e3fb] text-[11px] text-[#434653] flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-[#003c90] shrink-0 mt-0.5" />
                      <div>
                        <strong>{isNp ? 'गुगल म्याप कसरी लिने?' : 'How to get Google Maps embed code:'}</strong>
                        <p className="mt-0.5">
                          {isNp 
                            ? 'Google Maps मा आफ्नो कार्यालय खोल्नुहोस् > Share मा क्लिक गर्नुहोस् > Embed a map छान्नुहोस् > Copy HTML क्लिक गरेर यहाँ पेस्ट गर्नुहोस्।'
                            : 'Open your location in Google Maps > Click "Share" > Select "Embed a map" tab > Click "Copy HTML" and paste the code right here.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'गुगल म्याप डाइरेक्सन लिङ्क (Directions URL)' : 'Google Maps Directions URL (For navigation button)'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={hubForm.googleMapsDirectionsUrl}
                        onChange={(e) => setHubForm({ ...hubForm, googleMapsDirectionsUrl: e.target.value })}
                        placeholder="https://maps.google.com/?q=Tinkune,Kathmandu,Nepal"
                        className="flex-1 px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                      />
                      {hubForm.googleMapsDirectionsUrl && (
                        <a
                          href={hubForm.googleMapsDirectionsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 bg-[#f0f4fc] hover:bg-[#d8e3fb] text-[#003c90] font-bold text-xs flex items-center gap-1 border border-[#d8e3fb]"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Test</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Live Real-Time Interactive Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#111c2d] text-white p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>{isNp ? 'सार्वजनिक पृष्ठमा यस्तो देखिन्छ (Live Preview)' : 'Live Public Screen Preview'}</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold">
                  Interactive
                </span>
              </div>

              {/* Exact Preview Card as shown on ClothesBankScreen */}
              <div className="bg-white border-2 border-[#003c90] overflow-hidden shadow-md">
                <div className="p-4 bg-[#003c90] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      {isNp ? 'काठमाडौँ मुख्य संकलन केन्द्र (Map)' : 'Kathmandu Central Hub Location'}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold">
                    Open Daily
                  </span>
                </div>

                {/* Map View Frame */}
                <div className="relative w-full h-56 bg-slate-100 border-b border-[#d8e3fb] overflow-hidden">
                  <iframe
                    title="Live Central Hub Google Map Preview"
                    src={getCleanMapEmbedUrl(hubForm.mapEmbedUrl)}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full"
                  />
                </div>

                <div className="p-4 sm:p-5 space-y-3.5">
                  <div>
                    <h5 className="text-xs font-bold text-[#111c2d] uppercase tracking-wider">
                      {isNp ? 'केन्द्रको आधिकारिक ठेगाना:' : 'Official Receiving Station:'}
                    </h5>
                    <div className="text-xs text-[#434653] font-medium mt-1 space-y-0.5">
                      <strong className="text-[#003c90] text-sm block">
                        {isNp ? (hubForm.hubNameNp || hubForm.hubName) : hubForm.hubName}
                      </strong>
                      <div>{isNp ? (hubForm.addressNp || hubForm.address) : hubForm.address}</div>
                      {(hubForm.landmark || hubForm.landmarkNp) && (
                        <div className="text-[#737784]">
                          {isNp ? (hubForm.landmarkNp || hubForm.landmark) : hubForm.landmark}
                        </div>
                      )}
                      <div className="text-[#00743a] font-bold pt-1">
                        {isNp 
                          ? (hubForm.operatingHoursNp ? `समय: ${hubForm.operatingHoursNp}` : `समय: ${hubForm.operatingHours}`)
                          : `Hours: ${hubForm.operatingHours}`}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#f0f4fc] border border-[#d8e3fb] space-y-1.5">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#003c90]">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#00743a]" />
                        <span>{hubForm.phone1 || '9823000000'}</span>
                      </div>
                      {hubForm.phone2 && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#d8e3fb]">/</span>
                          <span>{hubForm.phone2}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-[#737784]">
                      {isNp ? (hubForm.contactNoteNp || hubForm.contactNote) : hubForm.contactNote}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (hubForm.googleMapsDirectionsUrl) {
                        window.open(hubForm.googleMapsDirectionsUrl, '_blank');
                      }
                    }}
                    className="w-full py-2.5 bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isNp ? 'गुगल म्यापमा बाटो हेर्नुहोस्' : 'Get Google Maps Directions'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{isNp ? 'स्वतः सिङ्क तथा सुरक्षित' : 'Real-time Cross-Screen Synchronization'}</span>
                </div>
                <p className="text-[11px] text-emerald-800/80">
                  {isNp
                    ? 'यहाँ सेभ गर्ने बित्तिकै सम्पूर्ण प्रयोगकर्ता र राइडरहरूले नयाँ नक्सा र फोन नम्बर तत्काल देख्नेछन्।'
                    : 'Changes saved here are instantly broadcasted to public visitor screens and synchronized with the central database.'}
                </p>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ADD / EDIT DONOR MODAL */}
      {showDonorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#d8e3fb] shadow-2xl max-w-xl w-full p-5 sm:p-6 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowDonorModal(false)}
              className="absolute right-4 top-4 text-[#737784] hover:text-[#111c2d]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-[#f0f3ff] pb-3">
              <Sparkles className="w-5 h-5 text-[#003c90]" />
              <div>
                <h3 className="text-base font-bold text-[#111c2d] font-heading">
                  {editingDonorId 
                    ? (isNp ? 'दाता विवरण सम्पादन गर्नुहोस्' : 'Edit Clothes Donor Profile')
                    : (isNp ? 'नयाँ कपडा दाता सूचीमा थप्नुहोस्' : 'Add Honored Clothes Donor to Wall')}
                </h3>
                <p className="text-xs text-[#737784]">
                  {isNp ? 'यो दाता सार्वजनिक कपडा बैंक स्लाइडरमा देखिनेछ।' : 'This donor will be highlighted on the public Sliding Donors Wall.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveDonorSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'दाताको नाम (English) *' : 'Donor Full Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={donorForm.name}
                    onChange={(e) => setDonorForm({ ...donorForm, name: e.target.value })}
                    placeholder="e.g. Suman Thapa"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'दाताको नाम (नेपाली)' : 'Donor Name (Nepali)'}
                  </label>
                  <input
                    type="text"
                    value={donorForm.nameNp}
                    onChange={(e) => setDonorForm({ ...donorForm, nameNp: e.target.value })}
                    placeholder="जस्तै: सुमन थापा"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'स्थान / ठेगाना (English) *' : 'Location / City (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={donorForm.location}
                    onChange={(e) => setDonorForm({ ...donorForm, location: e.target.value })}
                    placeholder="e.g. Baneshwor, Kathmandu"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'स्थान (नेपाली)' : 'Location (Nepali)'}
                  </label>
                  <input
                    type="text"
                    value={donorForm.locationNp}
                    onChange={(e) => setDonorForm({ ...donorForm, locationNp: e.target.value })}
                    placeholder="जस्तै: बानेश्वर, काठमाडौँ"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'कपडाको संख्या (थान) *' : 'Garments Count (Pieces) *'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={donorForm.itemsCount}
                    onChange={(e) => setDonorForm({ ...donorForm, itemsCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'मिति' : 'Date'}
                  </label>
                  <input
                    type="date"
                    value={donorForm.date}
                    onChange={(e) => setDonorForm({ ...donorForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'कपडा प्रकार (English)' : 'Clothes Category (English)'}
                  </label>
                  <input
                    type="text"
                    value={donorForm.clothesType}
                    onChange={(e) => setDonorForm({ ...donorForm, clothesType: e.target.value })}
                    placeholder="e.g. Winter Jackets & Sweaters"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'कपडा प्रकार (नेपाली)' : 'Clothes Category (Nepali)'}
                  </label>
                  <input
                    type="text"
                    value={donorForm.clothesTypeNp}
                    onChange={(e) => setDonorForm({ ...donorForm, clothesTypeNp: e.target.value })}
                    placeholder="जस्तै: जाडोको न्यानो ज्याकेट र स्विटर"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                  {isNp ? 'दाताको तस्बिर / फोटो URL' : 'Donor Photo / Avatar URL'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={donorForm.imageUrl}
                    onChange={(e) => setDonorForm({ ...donorForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  />
                  {donorForm.imageUrl && (
                    <img
                      src={donorForm.imageUrl}
                      alt="Preview"
                      className="w-8 h-8 rounded-full object-cover border border-[#d8e3fb] shrink-0"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                  {isNp ? 'दाताको भनाइ / सन्देश (English)' : 'Donor Quote / Note (English)'}
                </label>
                <textarea
                  rows={2}
                  value={donorForm.note}
                  onChange={(e) => setDonorForm({ ...donorForm, note: e.target.value })}
                  placeholder="e.g. Glad to contribute 45 warm jackets for winter relief."
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                  {isNp ? 'दाताको सन्देश (नेपाली)' : 'Donor Quote / Note (Nepali)'}
                </label>
                <textarea
                  rows={2}
                  value={donorForm.noteNp}
                  onChange={(e) => setDonorForm({ ...donorForm, noteNp: e.target.value })}
                  placeholder="जस्तै: शीतलहर पीडित परिवारलाई न्यानो कपडा सहयोग गर्न पाउँदा खुसी लागेको छ।"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={donorForm.isVerified}
                    onChange={(e) => setDonorForm({ ...donorForm, isVerified: e.target.checked })}
                    className="accent-[#00743a]"
                  />
                  <span className="font-bold text-[#111c2d]">{isNp ? 'प्रमाणित दाता (Verified)' : 'Verified Contributor Badge'}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={donorForm.isFeatured}
                    onChange={(e) => setDonorForm({ ...donorForm, isFeatured: e.target.checked })}
                    className="accent-[#003c90]"
                  />
                  <span className="font-bold text-[#111c2d]">{isNp ? 'विशेष स्थान दिने (Featured on Slider)' : 'Featured on Wall Slider'}</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#f0f3ff] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDonorModal(false)}
                  className="px-4 py-2 border border-[#d8e3fb] hover:bg-[#f0f4fc] text-[#434653] font-bold"
                >
                  {isNp ? 'रद्द गर्नुहोस्' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00743a] hover:bg-[#00542a] text-white font-bold uppercase tracking-wider"
                >
                  {editingDonorId ? (isNp ? 'अपडेट गर्नुहोस्' : 'Save Changes') : (isNp ? 'दाता थप्नुहोस्' : 'Publish Donor to Wall')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
