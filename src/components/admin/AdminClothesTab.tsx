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
  Send
} from 'lucide-react';
import { 
  ClothesDonationRequest, 
  ClothesDonor, 
  Language 
} from '../../types';
import { SAMPLE_CLOTHES_DONORS } from '../../data/mockData';
import { 
  apiUpdateClothesStatus, 
  apiGetClothesDonors, 
  apiCreateClothesDonor, 
  apiUpdateClothesDonor, 
  apiDeleteClothesDonor 
} from '../../services/api';

interface AdminClothesTabProps {
  language: Language;
  clothesDonations: ClothesDonationRequest[];
  onSaveClothesDonations: (updated: ClothesDonationRequest[]) => void;
}

export const AdminClothesTab: React.FC<AdminClothesTabProps> = ({
  language,
  clothesDonations,
  onSaveClothesDonations,
}) => {
  const isNp = language === 'np';
  const [activeSubTab, setActiveSubTab] = useState<'donors' | 'donations'>('donors');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

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

      {/* Sub Tabs: Donors Wall vs Dispatches */}
      <div className="flex items-center justify-between border-b border-[#d8e3fb] bg-white p-1">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setActiveSubTab('donors');
              setSearchTerm('');
            }}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
              activeSubTab === 'donors'
                ? 'bg-[#003c90] text-white'
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
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
              activeSubTab === 'donations'
                ? 'bg-[#003c90] text-white'
                : 'text-[#434653] hover:bg-[#f0f3ff]'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>{isNp ? '२. आएका संकलन / पार्सल विवरण' : '2. Incoming Dispatches'}</span>
            <span className="px-1.5 py-0.2 bg-white/20 text-[10px]">{clothesDonations.length}</span>
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

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-[#d8e3fb] hover:bg-[#f0f3ff] text-[#003c90] text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV Export</span>
          </button>
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
