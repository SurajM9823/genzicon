import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Search, 
  Download, 
  Plus, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  QrCode, 
  Building2, 
  Trash2, 
  FileText, 
  X,
  CreditCard
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

  // Manual Donation Entry Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDonation, setNewDonation] = useState<Partial<DonationRecord>>({
    donorName: '',
    donorEmail: '',
    amount: 5000,
    currency: 'NPR',
    frequency: 'one-time',
    paymentMethod: 'bank_transfer',
    projectName: 'General Foundation Fund / Clothes Bank',
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
      donorEmail: newDonation.donorEmail || 'offline@donor.np',
      amount: Number(newDonation.amount) || 1000,
      currency: newDonation.currency || 'NPR',
      frequency: (newDonation.frequency as any) || 'one-time',
      paymentMethod: (newDonation.paymentMethod as any) || 'bank_transfer',
      projectName: newDonation.projectName || 'General Foundation Fund',
      date: newDonation.date || new Date().toISOString().split('T')[0],
      receiptNumber: `REC-GZ-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      status: (newDonation.status as any) || 'Verified'
    };

    onSaveDonations([entry, ...donations]);
    setShowAddModal(false);
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Receipt Number,Donor Name,Email,Amount,Currency,Frequency,Method,Project Name,Status,Date\n";
    donations.forEach(d => {
      csvContent += `"${d.id}","${d.receiptNumber || ''}","${d.donorName}","${d.donorEmail}",${d.amount},"${d.currency}","${d.frequency}","${d.paymentMethod}","${d.projectName.replace(/"/g, '""')}","${d.status}","${d.date}"\n`;
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
    .filter(d => d.status === 'Verified' && d.currency === 'NPR')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingVerificationCount = donations.filter(d => d.status === 'Pending').length;

  const filteredDonations = donations.filter(d => {
    const matchesSearch = d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              Donations & QR Ledger
            </h2>
            <p className="text-[11px] text-[#737784]">
              Review bank slips, verify QR payments, and log donations
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
          <span className="text-[9px] uppercase font-bold text-[#737784] block">Verified</span>
          <span className="text-sm sm:text-lg font-bold text-[#003c90] font-mono truncate block">रू {verifiedTotalNpr.toLocaleString()}</span>
        </div>

        <div className="p-2.5 sm:p-3 bg-white border border-[#d8e3fb] shadow-xs">
          <span className="text-[9px] uppercase font-bold text-[#737784] block">Pending</span>
          <span className="text-sm sm:text-lg font-bold text-amber-700 font-mono block">{pendingVerificationCount}</span>
        </div>

        <div className="p-2.5 sm:p-3 bg-white border border-[#d8e3fb] shadow-xs">
          <span className="text-[9px] uppercase font-bold text-[#737784] block">Total</span>
          <span className="text-sm sm:text-lg font-bold text-[#111c2d] font-mono block">{donations.length}</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 border border-[#d8e3fb] shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#737784] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by donor name, receipt #, email, project..."
            className="w-full pl-9 pr-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
          >
            <option value="all">All Payment Methods</option>
            <option value="bank_transfer">Direct Bank Wire</option>
            <option value="fonepay">Fonepay QR</option>
            <option value="esewa">eSewa</option>
            <option value="khalti">Khalti</option>
            <option value="offline_cash">Offline Cash / Cheque</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
          >
            <option value="all">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Ledger Table & Mobile Cards */}
      <div>
        {/* Mobile Cards (Visible on mobile) */}
        <div className="block md:hidden space-y-3">
          {filteredDonations.map((item) => (
            <div key={item.id} className="bg-white p-4 border border-[#d8e3fb] shadow-xs space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono font-bold text-[#003c90] text-xs block">{item.receiptNumber || item.id}</span>
                  <span className="font-bold text-[#111c2d] text-sm">{item.donorName}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#003c90] text-base block">
                    {item.currency} {item.amount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#737784] capitalize block">{item.frequency}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-1.5 border-y border-[#f0f3ff]">
                <div>
                  <span className="text-[10px] text-[#737784] uppercase font-bold block">Method:</span>
                  <span className="font-semibold text-[#003c90] uppercase text-[11px]">
                    {item.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#737784] uppercase font-bold block">Date:</span>
                  <span className="text-[#111c2d]">{item.date}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-[#737784] uppercase font-bold block">Target Program:</span>
                  <span className="font-semibold text-[#111c2d] text-[11px] line-clamp-1">{item.projectName}</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold text-[#737784]">Status:</span>
                <select
                  value={item.status}
                  onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
                  className={`flex-1 px-2.5 py-2 text-xs font-bold border min-h-[40px] ${
                    item.status === 'Verified' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                    item.status === 'Pending' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                    'bg-red-50 text-red-900 border-red-300'
                  }`}
                >
                  <option value="Verified">✅ Verified</option>
                  <option value="Pending">⏳ Pending Slip</option>
                  <option value="Failed">❌ Cancelled</option>
                </select>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50"
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
                <th className="p-3">Receipt & Date</th>
                <th className="p-3">Donor Name & Contact</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Target Project</th>
                <th className="p-3">Method & Channel</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3ff]">
              {filteredDonations.map((item) => (
                <tr key={item.id} className="hover:bg-[#fcfdff] transition-colors">
                  <td className="p-3 align-top font-mono">
                    <span className="font-bold text-[#003c90] block">{item.receiptNumber || item.id}</span>
                    <span className="text-[10px] text-[#737784] font-sans">{item.date}</span>
                  </td>

                  <td className="p-3 align-top">
                    <span className="font-bold text-[#111c2d] block">{item.donorName}</span>
                    <span className="text-[10px] text-[#737784]">{item.donorEmail}</span>
                  </td>

                  <td className="p-3 align-top font-mono font-bold text-[#003c90] text-sm">
                    {item.currency} {item.amount.toLocaleString()}
                    <span className="text-[10px] font-sans font-normal text-[#737784] block capitalize">
                      {item.frequency}
                    </span>
                  </td>

                  <td className="p-3 align-top">
                    <span className="text-[11px] font-semibold text-[#111c2d] block max-w-xs line-clamp-2">
                      {item.projectName}
                    </span>
                  </td>

                  <td className="p-3 align-top">
                    <span className="px-2 py-0.5 bg-[#f0f3ff] text-[#003c90] text-[10px] font-bold uppercase inline-block">
                      {item.paymentMethod.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="p-3 align-top">
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
                      className={`px-2 py-1 text-[11px] font-bold border ${
                        item.status === 'Verified' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                        item.status === 'Pending' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                        'bg-red-50 text-red-900 border-red-300'
                      }`}
                    >
                      <option value="Verified">✅ Verified</option>
                      <option value="Pending">⏳ Pending Slip</option>
                      <option value="Failed">❌ Cancelled</option>
                    </select>
                  </td>

                  <td className="p-3 align-top text-right">
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

      {/* Modal to log manual donation */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 border border-[#d8e3fb] shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#d8e3fb]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111c2d] font-heading">
                Record Offline / Bank Donation
              </h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-4 h-4 text-[#737784]" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#111c2d] uppercase mb-1">Donor Name *</label>
                <input
                  type="text"
                  required
                  value={newDonation.donorName}
                  onChange={(e) => setNewDonation({ ...newDonation, donorName: e.target.value })}
                  placeholder="e.g. Ramesh Thapa"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111c2d] uppercase mb-1">Donor Email</label>
                <input
                  type="email"
                  value={newDonation.donorEmail}
                  onChange={(e) => setNewDonation({ ...newDonation, donorEmail: e.target.value })}
                  placeholder="ramesh.thapa@gmail.com"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#111c2d] uppercase mb-1">Amount *</label>
                  <input
                    type="number"
                    required
                    value={newDonation.amount}
                    onChange={(e) => setNewDonation({ ...newDonation, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] font-mono font-bold text-[#003c90]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#111c2d] uppercase mb-1">Currency</label>
                  <select
                    value={newDonation.currency}
                    onChange={(e) => setNewDonation({ ...newDonation, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff]"
                  >
                    <option value="NPR">NPR (रू)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111c2d] uppercase mb-1">Payment Method</label>
                <select
                  value={newDonation.paymentMethod}
                  onChange={(e) => setNewDonation({ ...newDonation, paymentMethod: e.target.value as any })}
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff]"
                >
                  <option value="bank_transfer">Direct Bank Transfer / Wire</option>
                  <option value="fonepay">Fonepay Dynamic QR</option>
                  <option value="esewa">eSewa Direct Transfer</option>
                  <option value="khalti">Khalti Pay</option>
                  <option value="offline_cash">Offline Cash Handover</option>
                  <option value="cheque">Bank Account Payee Cheque</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#111c2d] uppercase mb-1">Allocated Program</label>
                <input
                  type="text"
                  value={newDonation.projectName}
                  onChange={(e) => setNewDonation({ ...newDonation, projectName: e.target.value })}
                  placeholder="e.g. Winter Clothes Relief Drive"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111c2d] uppercase mb-1">Date</label>
                <input
                  type="date"
                  value={newDonation.date}
                  onChange={(e) => setNewDonation({ ...newDonation, date: e.target.value })}
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
                  Record Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
