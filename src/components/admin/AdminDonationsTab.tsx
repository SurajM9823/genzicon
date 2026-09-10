import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Search, 
  Download, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  X,
  ExternalLink,
  MapPin,
  Eye,
  Building2,
  Smartphone
} from 'lucide-react';
import { DonationRecord, Language } from '../../types';
import { apiUpdateDonationStatus } from '../../services/api';

interface AdminDonationsTabProps {
  language: Language;
  donations: DonationRecord[];
  onSaveDonations: (updated: DonationRecord[]) => void;
}

export const AdminDonationsTab: React.FC<AdminDonationsTabProps> = ({
  language,
  donations,
  onSaveDonations
}) => {
  const isNp = language === 'np';
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSlipImage, setSelectedSlipImage] = useState<string | null>(null);

  // Manual Donation Entry Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDonation, setNewDonation] = useState<Partial<DonationRecord>>({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    donorAddress: 'Kathmandu',
    amount: 5000,
    currency: 'NPR',
    paymentMethod: 'bank',
    projectName: 'General Foundation Fund / Clothes Bank',
    note: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Verified'
  });

  const handleUpdateStatus = (id: string, newStatus: DonationRecord['status']) => {
    const updated = donations.map(d => d.id === id ? { ...d, status: newStatus } : d);
    onSaveDonations(updated);
    apiUpdateDonationStatus(id, newStatus).catch(console.warn);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this donation record?')) {
      onSaveDonations(donations.filter(d => d.id !== id));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: DonationRecord = {
      id: `don-${Date.now()}`,
      donorName: newDonation.donorName || 'Anonymous Well-wisher',
      donorEmail: newDonation.donorEmail || '',
      donorPhone: newDonation.donorPhone || '',
      donorAddress: newDonation.donorAddress || 'Nepal',
      amount: Number(newDonation.amount) || 1000,
      currency: newDonation.currency || 'NPR',
      paymentMethod: (newDonation.paymentMethod as any) || 'bank',
      projectName: newDonation.projectName || 'General Foundation Fund',
      note: newDonation.note || '',
      date: newDonation.date || new Date().toISOString().split('T')[0],
      receiptNumber: `REC-GZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: (newDonation.status as any) || 'Verified',
      isPublic: true,
    };

    onSaveDonations([entry, ...donations]);
    setShowAddModal(false);
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Receipt Number,Donor Name,Email,Phone,Address,Amount,Currency,Method,Project Name,Status,Date\n";
    donations.forEach(d => {
      csvContent += `"${d.id}","${d.receiptNumber || ''}","${d.donorName}","${d.donorEmail || ''}","${d.donorPhone || ''}","${d.donorAddress || ''}",${d.amount},"${d.currency || 'NPR'}","${d.paymentMethod}","${(d.projectName || '').replace(/"/g, '""')}","${d.status}","${d.date}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `genzicon_donations_ledger_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations
  const verifiedTotalNpr = donations
    .filter(d => (d.status === 'Verified' || d.status === 'Approved') && (d.currency === 'NPR' || !d.currency))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingVerificationCount = donations.filter(d => d.status === 'Pending').length;

  const filteredDonations = donations.filter(d => {
    const matchesSearch = d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.donorEmail && d.donorEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.donorAddress && d.donorAddress.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.receiptNumber && d.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      d.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = filterMethod === 'all' || d.paymentMethod === filterMethod;
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-white p-3.5 sm:p-4 border border-[#d8e3fb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-[#003c90]" />
          <div>
            <h2 className="text-sm font-bold text-[#111c2d]">
              Donations & Payment Slips Ledger
            </h2>
            <p className="text-[11px] text-[#737784]">
              Review bank slips, verify QR payments, and manage public donors ({donations.length} total)
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
            <span>+ Record</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-2.5 sm:p-3 bg-white border border-[#d8e3fb] shadow-xs">
          <span className="text-[9px] uppercase font-bold text-[#737784] block">Verified Total</span>
          <span className="text-sm sm:text-lg font-bold text-[#00743a] font-mono truncate block">रू {verifiedTotalNpr.toLocaleString()}</span>
        </div>

        <div className="p-2.5 sm:p-3 bg-white border border-[#d8e3fb] shadow-xs">
          <span className="text-[9px] uppercase font-bold text-[#737784] block">Pending Slips</span>
          <span className="text-sm sm:text-lg font-bold text-amber-700 font-mono block">{pendingVerificationCount}</span>
        </div>

        <div className="p-2.5 sm:p-3 bg-white border border-[#d8e3fb] shadow-xs">
          <span className="text-[9px] uppercase font-bold text-[#737784] block">Total Records</span>
          <span className="text-sm sm:text-lg font-bold text-[#111c2d] font-mono block">{donations.length}</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-3 border border-[#d8e3fb] shadow-xs flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-[#737784] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search donor name, receipt #, address, or initiative..."
            className="w-full pl-8 pr-3 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
          >
            <option value="all">All Methods</option>
            <option value="bank">Bank Transfer</option>
            <option value="esewa">eSewa</option>
            <option value="khalti">Khalti</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
          >
            <option value="all">All Status</option>
            <option value="Verified">Verified / Approved</option>
            <option value="Pending">Pending Slip</option>
            <option value="Failed">Failed / Cancelled</option>
          </select>
        </div>
      </div>

      {/* Ledger Table & Mobile Cards */}
      <div>
        {/* Mobile Cards (Visible on mobile) */}
        <div className="block md:hidden space-y-2.5">
          {filteredDonations.map((item) => (
            <div key={item.id} className="bg-white p-3.5 border border-[#d8e3fb] shadow-xs space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {item.donorPhotoUrl ? (
                    <img
                      src={item.donorPhotoUrl}
                      alt={item.donorName}
                      className="w-8 h-8 rounded-full object-cover border border-[#d8e3fb] shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#00743a]/10 text-[#00743a] flex items-center justify-center font-bold text-[10px] shrink-0">
                      {item.donorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className="font-mono font-bold text-[#003c90] text-xs block">{item.receiptNumber || item.id}</span>
                    <span className="font-bold text-[#111c2d] text-xs">{item.donorName}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-[#00743a] text-sm block">
                    रू {Number(item.amount).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#737784] block">{item.date}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-xs py-1.5 border-y border-[#f0f3ff]">
                <div>
                  <span className="text-[9px] text-[#737784] uppercase font-bold block">Method:</span>
                  <span className="font-semibold text-[#003c90] uppercase text-[10px]">
                    {item.paymentMethod ? item.paymentMethod.replace('_', ' ') : 'Bank'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#737784] uppercase font-bold block">Location:</span>
                  <span className="text-[#111c2d] text-[10px] truncate block">{item.donorAddress || 'Nepal'}</span>
                </div>
                {item.paymentSlipUrl && (
                  <div className="col-span-2 flex items-center gap-2 pt-1">
                    <span className="text-[9px] text-[#737784] uppercase font-bold">Uploaded Slip:</span>
                    <button
                      type="button"
                      onClick={() => setSelectedSlipImage(item.paymentSlipUrl || null)}
                      className="text-[10px] font-bold text-[#003c90] hover:underline flex items-center gap-0.5"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Receipt Slip</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-1 flex items-center justify-between gap-2">
                <select
                  value={item.status}
                  onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
                  className={`flex-1 px-2 py-1.5 text-xs font-bold border ${
                    item.status === 'Verified' || item.status === 'Approved'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : item.status === 'Pending'
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-red-50 text-red-900 border-red-300'
                  }`}
                >
                  <option value="Verified">✅ Verified (Active on Wall)</option>
                  <option value="Pending">⏳ Pending Verification</option>
                  <option value="Failed">❌ Cancelled</option>
                </select>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white border border-[#d8e3fb] shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f0f4ff] text-[#003c90] uppercase font-bold border-b border-[#d8e3fb] text-[10px] tracking-wider">
              <tr>
                <th className="p-2.5">Receipt & Date</th>
                <th className="p-2.5">Donor Details</th>
                <th className="p-2.5">Amount</th>
                <th className="p-2.5">Target Initiative</th>
                <th className="p-2.5">Method</th>
                <th className="p-2.5">Bank Slip</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3ff]">
              {filteredDonations.map((item) => (
                <tr key={item.id} className="hover:bg-[#fcfdff] transition-colors">
                  <td className="p-2.5 align-top font-mono">
                    <span className="font-bold text-[#003c90] block">{item.receiptNumber || item.id}</span>
                    <span className="text-[10px] text-[#737784] font-sans">{item.date}</span>
                  </td>

                  <td className="p-2.5 align-top">
                    <div className="flex items-center gap-2">
                      {item.donorPhotoUrl ? (
                        <img
                          src={item.donorPhotoUrl}
                          alt={item.donorName}
                          className="w-7 h-7 rounded-full object-cover border border-[#d8e3fb] shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#00743a]/10 text-[#00743a] flex items-center justify-center font-bold text-[9px] shrink-0">
                          {item.donorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-[#111c2d] block">{item.donorName}</span>
                        <div className="text-[10px] text-[#737784] flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-rose-500" />
                          <span>{item.donorAddress || 'Nepal'}</span>
                          {item.donorPhone && <span>• {item.donorPhone}</span>}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-2.5 align-top font-mono font-bold text-[#00743a] text-xs">
                    रू {Number(item.amount).toLocaleString()}
                  </td>

                  <td className="p-2.5 align-top">
                    <span className="text-[11px] font-semibold text-[#111c2d] block max-w-xs line-clamp-1">
                      {item.projectName}
                    </span>
                    {item.note && (
                      <span className="text-[10px] text-[#737784] italic line-clamp-1">"{item.note}"</span>
                    )}
                  </td>

                  <td className="p-2.5 align-top">
                    <span className="px-1.5 py-0.5 bg-[#f0f3ff] text-[#003c90] text-[10px] font-bold uppercase inline-block border border-blue-100">
                      {item.paymentMethod ? item.paymentMethod.replace('_', ' ') : 'Bank'}
                    </span>
                  </td>

                  {/* Payment Slip Thumbnail Column */}
                  <td className="p-2.5 align-top">
                    {item.paymentSlipUrl ? (
                      <button
                        type="button"
                        onClick={() => setSelectedSlipImage(item.paymentSlipUrl || null)}
                        className="group relative block"
                        title="Click to view slip"
                      >
                        <img
                          src={item.paymentSlipUrl}
                          alt="Slip"
                          className="w-10 h-10 object-cover rounded-xs border border-[#003c90] group-hover:opacity-80"
                        />
                      </button>
                    ) : (
                      <span className="text-[10px] text-[#737784] italic">No slip</span>
                    )}
                  </td>

                  <td className="p-2.5 align-top">
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
                      className={`px-2 py-1 text-[11px] font-bold border ${
                        item.status === 'Verified' || item.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : item.status === 'Pending'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-red-50 text-red-900 border-red-300'
                      }`}
                    >
                      <option value="Verified">✅ Verified</option>
                      <option value="Pending">⏳ Pending Slip</option>
                      <option value="Failed">❌ Cancelled</option>
                    </select>
                  </td>

                  <td className="p-2.5 align-top text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
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

      {/* Slip Image Full Preview Modal */}
      {selectedSlipImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedSlipImage(null)}
        >
          <div 
            className="bg-white max-w-xl w-full p-4 border border-[#d8e3fb] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#d8e3fb]">
              <span className="text-xs font-bold text-[#111c2d] uppercase tracking-wider">
                Bank Transfer Slip / Payment Proof
              </span>
              <button 
                onClick={() => setSelectedSlipImage(null)}
                className="p-1 text-gray-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-gray-50 p-2 border">
              <img
                src={selectedSlipImage}
                alt="Bank Slip Full"
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal to log manual donation */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-5 border border-[#d8e3fb] shadow-xl">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#d8e3fb]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d] font-heading">
                Record Offline / Bank Donation
              </h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-4 h-4 text-[#737784]" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-2.5 text-xs">
              <div>
                <label className="block font-bold text-[#111c2d] uppercase text-[10px] mb-0.5">Donor Name *</label>
                <input
                  type="text"
                  required
                  value={newDonation.donorName}
                  onChange={(e) => setNewDonation({ ...newDonation, donorName: e.target.value })}
                  placeholder="e.g. Ramesh Thapa"
                  className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#111c2d] uppercase text-[10px] mb-0.5">Phone</label>
                  <input
                    type="tel"
                    value={newDonation.donorPhone}
                    onChange={(e) => setNewDonation({ ...newDonation, donorPhone: e.target.value })}
                    placeholder="98XXXXXXXX"
                    className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#111c2d] uppercase text-[10px] mb-0.5">Location / City</label>
                  <input
                    type="text"
                    value={newDonation.donorAddress}
                    onChange={(e) => setNewDonation({ ...newDonation, donorAddress: e.target.value })}
                    placeholder="Kathmandu"
                    className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#111c2d] uppercase text-[10px] mb-0.5">Amount (NPR) *</label>
                  <input
                    type="number"
                    required
                    value={newDonation.amount}
                    onChange={(e) => setNewDonation({ ...newDonation, amount: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] font-mono font-bold text-[#00743a]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#111c2d] uppercase text-[10px] mb-0.5">Payment Method</label>
                  <select
                    value={newDonation.paymentMethod}
                    onChange={(e) => setNewDonation({ ...newDonation, paymentMethod: e.target.value as any })}
                    className="w-full px-2 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff]"
                  >
                    <option value="bank">Global IME Bank Transfer</option>
                    <option value="esewa">eSewa Direct Transfer</option>
                    <option value="khalti">Khalti Wallet Transfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111c2d] uppercase text-[10px] mb-0.5">Allocated Project / Initiative</label>
                <input
                  type="text"
                  value={newDonation.projectName}
                  onChange={(e) => setNewDonation({ ...newDonation, projectName: e.target.value })}
                  placeholder="e.g. Winter Clothes Relief Drive"
                  className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff]"
                />
              </div>

              <div className="pt-2 border-t border-[#d8e3fb] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-[#434653] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00743a] text-white font-bold uppercase text-xs"
                >
                  Record & Approve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
