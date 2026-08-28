import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';
import { 
  ClothesDonationRequest, 
  ClothesAssistanceRequest, 
  Language 
} from '../../types';

interface AdminClothesTabProps {
  language: Language;
  clothesDonations: ClothesDonationRequest[];
  onSaveClothesDonations: (updated: ClothesDonationRequest[]) => void;
  clothesAssistance: ClothesAssistanceRequest[];
  onSaveClothesAssistance: (updated: ClothesAssistanceRequest[]) => void;
}

export const AdminClothesTab: React.FC<AdminClothesTabProps> = ({
  language,
  clothesDonations,
  onSaveClothesDonations,
  clothesAssistance,
  onSaveClothesAssistance
}) => {
  const isNp = language === 'np';
  const [activeSubTab, setActiveSubTab] = useState<'donations' | 'assistance'>('donations');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<string>('all');

  // Manual Add Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDonation, setNewDonation] = useState<Partial<ClothesDonationRequest>>({
    donorName: '',
    phone: '',
    email: '',
    province: 'Bagmati Province',
    district: 'Kathmandu',
    city: 'Kathmandu',
    address: '',
    clothesType: 'winter',
    approxItemsCount: 20,
    donationMode: 'doorstep_pickup',
    pickupDate: new Date().toISOString().split('T')[0],
    notes: '',
    status: 'Pending'
  });

  const handleUpdateStatus = (id: string, newStatus: ClothesDonationRequest['status']) => {
    const updated = clothesDonations.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    onSaveClothesDonations(updated);
  };

  const handleUpdateAssistanceStatus = (id: string, newStatus: ClothesAssistanceRequest['status']) => {
    const updated = clothesAssistance.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    onSaveClothesAssistance(updated);
  };

  const handleDeleteDonation = (id: string) => {
    if (confirm('Delete this clothes donation entry?')) {
      onSaveClothesDonations(clothesDonations.filter(item => item.id !== id));
    }
  };

  const handleDeleteAssistance = (id: string) => {
    if (confirm('Delete this clothes assistance request?')) {
      onSaveClothesAssistance(clothesAssistance.filter(item => item.id !== id));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: ClothesDonationRequest = {
      id: `CBN-MANUAL-${Math.floor(1000 + Math.random() * 9000)}`,
      donorName: newDonation.donorName || 'Anonymous Donor',
      phone: newDonation.phone || '9800000000',
      email: newDonation.email || '',
      province: newDonation.province || 'Bagmati Province',
      district: newDonation.district || 'Kathmandu',
      city: newDonation.city || 'Kathmandu',
      address: newDonation.address || 'Drop-off center',
      clothesType: newDonation.clothesType || 'winter',
      approxItemsCount: Number(newDonation.approxItemsCount) || 15,
      donationMode: newDonation.donationMode || 'doorstep_pickup',
      pickupDate: newDonation.pickupDate || new Date().toISOString().split('T')[0],
      notes: newDonation.notes || 'Recorded by admin',
      date: new Date().toISOString().split('T')[0],
      status: (newDonation.status as any) || 'Pending'
    };

    onSaveClothesDonations([entry, ...clothesDonations]);
    setShowAddModal(false);
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeSubTab === 'donations') {
      csvContent += "ID,Donor Name,Phone,Email,Province,District,City,Address,Clothes Type,Pieces,Mode,Pickup Date,Status,Date\n";
      clothesDonations.forEach(c => {
        csvContent += `"${c.id}","${c.donorName}","${c.phone}","${c.email || ''}","${c.province}","${c.district}","${c.city}","${c.address.replace(/"/g, '""')}","${c.clothesType}",${c.approxItemsCount},"${c.donationMode}","${c.pickupDate || ''}","${c.status}","${c.date}"\n`;
      });
    } else {
      csvContent += "ID,Applicant Name,Organization,Phone,Province,District,Beneficiary Count,Urgency,Status,Date\n";
      clothesAssistance.forEach(a => {
        csvContent += `"${a.id}","${a.applicantName}","${a.organization || ''}","${a.phone}","${a.province}","${a.district}",${a.beneficiaryCount},"${a.urgencyReason}","${a.status}","${a.date}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `genzicon_clothes_${activeSubTab}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered lists
  const filteredDonations = clothesDonations.filter(c => {
    const matchesSearch = c.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesMode = filterMode === 'all' || c.donationMode === filterMode;
    return matchesSearch && matchesStatus && matchesMode;
  });

  const totalPieces = clothesDonations.reduce((a, b) => a + (b.approxItemsCount || 0), 0);
  const pendingCount = clothesDonations.filter(c => c.status === 'Pending').length;
  const scheduledCount = clothesDonations.filter(c => c.status === 'Scheduled').length;
  const collectedCount = clothesDonations.filter(c => c.status === 'Collected' || c.status === 'Distributed').length;

  return (
    <div className="space-y-4">
      {/* Top Banner & KPI metrics */}
      <div className="bg-white p-3.5 sm:p-4 border border-[#d8e3fb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Shirt className="w-4 h-4 text-[#003c90]" />
          <div>
            <h2 className="text-sm font-bold text-[#111c2d]">
              Clothes Bank Management
            </h2>
            <p className="text-[11px] text-[#737784]">
              Track pickups, drop-offs, and community assistance requests
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-2.5 py-1.5 bg-[#f0f3ff] hover:bg-[#e0e8ff] text-[#003c90] text-xs font-semibold border border-blue-100 flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-[#00743a] hover:bg-[#005227] text-white text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Log Batch</span>
          </button>
        </div>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 bg-white border border-[#d8e3fb]">
          <span className="text-[9px] uppercase font-bold text-[#737784] block">Total Logged</span>
          <span className="text-base font-bold text-[#003c90] font-mono">{totalPieces.toLocaleString()} pcs</span>
        </div>
        <div className="p-2.5 bg-white border border-[#d8e3fb]">
          <span className="text-[9px] uppercase font-bold text-[#737784] block">Pending</span>
          <span className="text-base font-bold text-amber-700 font-mono">{pendingCount}</span>
        </div>
        <div className="p-2.5 bg-white border border-[#d8e3fb]">
          <span className="text-[9px] uppercase font-bold text-[#737784] block">Scheduled</span>
          <span className="text-base font-bold text-blue-700 font-mono">{scheduledCount}</span>
        </div>
        <div className="p-2.5 bg-white border border-[#d8e3fb]">
          <span className="text-[9px] uppercase font-bold text-[#737784] block">Completed</span>
          <span className="text-base font-bold text-emerald-700 font-mono">{collectedCount}</span>
        </div>
      </div>

      {/* Subtabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[#d8e3fb] pb-0.5">
        <button
          onClick={() => setActiveSubTab('donations')}
          className={`px-3 py-1.5 text-xs font-semibold transition-colors border-b-2 ${
            activeSubTab === 'donations'
              ? 'border-[#003c90] text-[#003c90] bg-white'
              : 'border-transparent text-[#737784] hover:text-[#111c2d]'
          }`}
        >
          Donor Pickups ({clothesDonations.length})
        </button>

        <button
          onClick={() => setActiveSubTab('assistance')}
          className={`px-3 py-1.5 text-xs font-semibold transition-colors border-b-2 ${
            activeSubTab === 'assistance'
              ? 'border-[#003c90] text-[#003c90] bg-white'
              : 'border-transparent text-[#737784] hover:text-[#111c2d]'
          }`}
        >
          Assistance Requests ({clothesAssistance.length})
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-3 border border-[#d8e3fb] shadow-xs flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-[#737784] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, city, or ID..."
            className="w-full pl-8 pr-3 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="collected">Collected</option>
            <option value="distributed">Distributed</option>
          </select>

          {activeSubTab === 'donations' && (
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
            >
              <option value="all">All Modes</option>
              <option value="doorstep_pickup">Doorstep Pickup</option>
              <option value="dropoff_center">Dropoff Hub</option>
            </select>
          )}
        </div>
      </div>

      {/* Table & Mobile Cards Section */}
      {activeSubTab === 'donations' ? (
        <div>
          {/* Mobile Card List (Visible on mobile screens) */}
          <div className="block md:hidden space-y-3">
            {filteredDonations.map((item) => (
              <div key={item.id} className="bg-white p-4 border border-[#d8e3fb] shadow-xs space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-[#003c90] text-xs block">{item.id}</span>
                    <span className="font-bold text-[#111c2d] text-sm">{item.donorName}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteDonation(item.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-1.5 border-y border-[#f0f3ff]">
                  <div>
                    <span className="text-[10px] text-[#737784] uppercase font-bold block">Phone:</span>
                    <a href={`tel:${item.phone}`} className="font-mono font-bold text-[#00743a] hover:underline">
                      {item.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#737784] uppercase font-bold block">Volume:</span>
                    <span className="font-bold text-[#111c2d]">~{item.approxItemsCount} pcs ({item.clothesType})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#737784] uppercase font-bold block">Mode:</span>
                    <span className="font-semibold text-[#003c90]">
                      {item.donationMode === 'doorstep_pickup' ? '🚐 Doorstep' : '🏢 Hub Drop'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#737784] uppercase font-bold block">Pickup Date:</span>
                    <span className="font-semibold text-[#111c2d]">{item.pickupDate || item.date}</span>
                  </div>
                </div>

                <div className="text-xs">
                  <span className="text-[10px] text-[#737784] uppercase font-bold block">Address:</span>
                  <span className="text-[#434653]">{item.address}, {item.city || item.district}</span>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold text-[#737784]">Workflow:</span>
                  <select
                    value={item.status}
                    onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
                    className={`flex-1 px-2.5 py-2 text-xs font-bold border min-h-[40px] ${
                      item.status === 'Pending' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                      item.status === 'Scheduled' ? 'bg-blue-50 text-blue-900 border-blue-300' :
                      item.status === 'Collected' ? 'bg-purple-50 text-purple-900 border-purple-300' :
                      'bg-emerald-50 text-emerald-900 border-emerald-300'
                    }`}
                  >
                    <option value="Pending">⏳ Pending</option>
                    <option value="Scheduled">🚐 Scheduled (Van Assigned)</option>
                    <option value="Collected">📦 Collected (In Warehouse)</option>
                    <option value="Distributed">✅ Distributed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white border border-[#d8e3fb] shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f0f4ff] text-[#003c90] uppercase font-bold border-b border-[#d8e3fb] text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Ref ID & Date</th>
                  <th className="p-3">Donor Name & Contact</th>
                  <th className="p-3">Location & Address</th>
                  <th className="p-3">Clothes Type & Volume</th>
                  <th className="p-3">Mode & Pickup Date</th>
                  <th className="p-3">Workflow Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3ff]">
                {filteredDonations.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fcfdff] transition-colors">
                    <td className="p-3 align-top">
                      <span className="font-mono font-bold text-[#003c90] block">{item.id}</span>
                      <span className="text-[10px] text-[#737784]">{item.date}</span>
                    </td>

                    <td className="p-3 align-top">
                      <span className="font-bold text-[#111c2d] block">{item.donorName}</span>
                      <span className="font-mono text-[11px] text-[#434653] block">{item.phone}</span>
                      {item.email && <span className="text-[10px] text-[#737784]">{item.email}</span>}
                    </td>

                    <td className="p-3 align-top">
                      <span className="font-semibold text-[#111c2d] block">{item.city || item.district}</span>
                      <span className="text-[11px] text-[#434653] block max-w-xs">{item.address}</span>
                      <span className="text-[10px] text-[#737784]">{item.province}</span>
                    </td>

                    <td className="p-3 align-top">
                      <span className="font-bold text-[#003c90] uppercase text-[11px] block">
                        {item.clothesType}
                      </span>
                      <span className="font-bold text-[#111c2d] block font-mono">
                        ~{item.approxItemsCount} pieces
                      </span>
                      {item.notes && (
                        <span className="text-[10px] text-[#737784] italic block max-w-xs line-clamp-2">
                          "{item.notes}"
                        </span>
                      )}
                    </td>

                    <td className="p-3 align-top">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase inline-block mb-1 ${
                        item.donationMode === 'doorstep_pickup' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {item.donationMode === 'doorstep_pickup' ? '🚐 Doorstep Pickup' : '🏢 Drop-off Center'}
                      </span>
                      {item.pickupDate && (
                        <span className="text-[11px] text-[#111c2d] block font-semibold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#737784]" />
                          {item.pickupDate}
                        </span>
                      )}
                      {item.dropoffHub && (
                        <span className="text-[10px] text-[#737784] block">{item.dropoffHub}</span>
                      )}
                    </td>

                    <td className="p-3 align-top">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
                        className={`px-2 py-1 text-[11px] font-bold border ${
                          item.status === 'Pending' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                          item.status === 'Scheduled' ? 'bg-blue-50 text-blue-900 border-blue-300' :
                          item.status === 'Collected' ? 'bg-purple-50 text-purple-900 border-purple-300' :
                          'bg-emerald-50 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        <option value="Pending">⏳ Pending</option>
                        <option value="Scheduled">🚐 Scheduled (Van Assigned)</option>
                        <option value="Collected">📦 Collected (In Warehouse)</option>
                        <option value="Distributed">✅ Distributed (Delivered)</option>
                      </select>
                    </td>

                    <td className="p-3 align-top text-right">
                      <button
                        onClick={() => handleDeleteDonation(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Assistance Requests Table */
        <div>
          {/* Mobile Card List for Assistance */}
          <div className="block md:hidden space-y-3">
            {clothesAssistance.map((item) => (
              <div key={item.id} className="bg-white p-4 border border-[#d8e3fb] shadow-xs space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-[#003c90] text-xs block">{item.id}</span>
                    <span className="font-bold text-[#111c2d] text-sm">{item.applicantName}</span>
                    {item.organization && <span className="text-xs text-[#003c90] font-semibold block">{item.organization}</span>}
                  </div>
                  <button
                    onClick={() => handleDeleteAssistance(item.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-1.5 border-y border-[#f0f3ff]">
                  <div>
                    <span className="text-[10px] text-[#737784] uppercase font-bold block">Phone:</span>
                    <a href={`tel:${item.phone}`} className="font-mono font-bold text-[#00743a]">
                      {item.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#737784] uppercase font-bold block">Beneficiaries:</span>
                    <span className="font-bold text-[#111c2d] font-mono">{item.beneficiaryCount} people</span>
                  </div>
                </div>

                <div className="text-xs">
                  <span className="text-[10px] text-[#737784] uppercase font-bold block">Location:</span>
                  <span className="text-[#434653]">{item.locationDetails}, {item.district}</span>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold text-[#737784]">Status:</span>
                  <select
                    value={item.status}
                    onChange={(e) => handleUpdateAssistanceStatus(item.id, e.target.value as any)}
                    className="flex-1 px-2.5 py-2 text-xs font-bold border border-[#d8e3fb] bg-white min-h-[40px]"
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block bg-white border border-[#d8e3fb] shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f0f4ff] text-[#003c90] uppercase font-bold border-b border-[#d8e3fb] text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Request ID & Date</th>
                  <th className="p-3">Applicant / Organization</th>
                  <th className="p-3">Location Details</th>
                  <th className="p-3">Beneficiaries</th>
                  <th className="p-3">Urgency Reason</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3ff]">
                {clothesAssistance.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fcfdff]">
                    <td className="p-3 align-top font-mono font-bold text-[#003c90]">
                      {item.id}
                      <span className="text-[10px] text-[#737784] block font-sans font-normal">{item.date}</span>
                    </td>

                    <td className="p-3 align-top">
                      <span className="font-bold text-[#111c2d] block">{item.applicantName}</span>
                      {item.organization && <span className="text-[11px] text-[#003c90] block">{item.organization}</span>}
                      <span className="font-mono text-[11px] text-[#434653] block">{item.phone}</span>
                    </td>

                    <td className="p-3 align-top">
                      <span className="font-semibold text-[#111c2d] block">{item.district}, {item.province}</span>
                      <span className="text-[11px] text-[#434653] block max-w-xs">{item.locationDetails}</span>
                    </td>

                    <td className="p-3 align-top font-bold text-[#111c2d] font-mono">
                      {item.beneficiaryCount} people
                    </td>

                    <td className="p-3 align-top">
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold uppercase inline-block mb-1">
                        {item.urgencyReason.replace('_', ' ')}
                      </span>
                      {item.notes && <p className="text-[11px] text-[#737784] italic line-clamp-2">"{item.notes}"</p>}
                    </td>

                    <td className="p-3 align-top">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateAssistanceStatus(item.id, e.target.value as any)}
                        className="px-2 py-1 text-[11px] font-bold border border-[#d8e3fb] bg-white"
                      >
                        <option value="Pending">Pending Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    <td className="p-3 align-top text-right">
                      <button
                        onClick={() => handleDeleteAssistance(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Log Manual Batch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 border border-[#d8e3fb] shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#d8e3fb]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111c2d] font-heading">
                Log New Clothes Batch / Phone Booking
              </h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-4 h-4 text-[#737784]" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#111c2d] uppercase mb-1">Donor Full Name *</label>
                <input
                  type="text"
                  required
                  value={newDonation.donorName}
                  onChange={(e) => setNewDonation({ ...newDonation, donorName: e.target.value })}
                  placeholder="e.g. Saroj Adhikari"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#111c2d] uppercase mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newDonation.phone}
                    onChange={(e) => setNewDonation({ ...newDonation, phone: e.target.value })}
                    placeholder="98XXXXXXXX"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#111c2d] uppercase mb-1">City / Tole *</label>
                  <input
                    type="text"
                    required
                    value={newDonation.city}
                    onChange={(e) => setNewDonation({ ...newDonation, city: e.target.value })}
                    placeholder="e.g. Kathmandu"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111c2d] uppercase mb-1">Detailed Street Address</label>
                <input
                  type="text"
                  value={newDonation.address}
                  onChange={(e) => setNewDonation({ ...newDonation, address: e.target.value })}
                  placeholder="Ward No., Landmark, House No."
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#111c2d] uppercase mb-1">Clothes Category</label>
                  <select
                    value={newDonation.clothesType}
                    onChange={(e) => setNewDonation({ ...newDonation, clothesType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff]"
                  >
                    <option value="winter">Winter Warm Wear</option>
                    <option value="blankets">Blankets & Quilts</option>
                    <option value="kids">Kids & Uniforms</option>
                    <option value="summer">Summer Wear</option>
                    <option value="mixed">Mixed Lot</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#111c2d] uppercase mb-1">Piece Count</label>
                  <input
                    type="number"
                    value={newDonation.approxItemsCount}
                    onChange={(e) => setNewDonation({ ...newDonation, approxItemsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111c2d] uppercase mb-1">Pickup Date</label>
                <input
                  type="date"
                  value={newDonation.pickupDate}
                  onChange={(e) => setNewDonation({ ...newDonation, pickupDate: e.target.value })}
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff]"
                />
              </div>

              <div className="pt-3 border-t border-[#d8e3fb] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-[#434653] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00743a] text-white font-bold uppercase"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
