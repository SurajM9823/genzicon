import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Eye, 
  MapPin, 
  Phone, 
  Mail, 
  X,
  FileText
} from 'lucide-react';
import { VolunteerRecord, Language } from '../../types';

interface AdminVolunteersTabProps {
  language: Language;
  volunteers: VolunteerRecord[];
  onSaveVolunteers: (updated: VolunteerRecord[]) => void;
}

export const AdminVolunteersTab: React.FC<AdminVolunteersTabProps> = ({
  language,
  volunteers,
  onSaveVolunteers
}) => {
  const isNp = language === 'np';
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvince, setFilterProvince] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerRecord | null>(null);

  const handleUpdateStatus = (id: string, newStatus: VolunteerRecord['status']) => {
    const updated = volunteers.map(v => v.id === id ? { ...v, status: newStatus } : v);
    onSaveVolunteers(updated);
    if (selectedVolunteer && selectedVolunteer.id === id) {
      setSelectedVolunteer({ ...selectedVolunteer, status: newStatus });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this volunteer record?')) {
      onSaveVolunteers(volunteers.filter(v => v.id !== id));
      if (selectedVolunteer?.id === id) {
        setSelectedVolunteer(null);
      }
    }
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Volunteer ID,Full Name,Email,Phone,Province,District,Interest Area,Availability,Status,Submitted At\n";
    volunteers.forEach(v => {
      csvContent += `"${v.id}","${v.volunteerId}","${v.fullName}","${v.email}","${v.phone}","${v.province}","${v.district}","${v.interest.replace(/"/g, '""')}","${v.availability}","${v.status}","${v.submittedAt}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `genzicon_volunteers_network_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredVolunteers = volunteers.filter(v => {
    const matchesSearch = v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phone.includes(searchTerm) ||
      v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.volunteerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = filterProvince === 'all' || v.province === filterProvince;
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    return matchesSearch && matchesProvince && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-3.5 sm:p-4 border border-[#d8e3fb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#00743a]" />
          <div>
            <h2 className="text-sm font-bold text-[#111c2d]">
              Volunteer Management
            </h2>
            <p className="text-[11px] text-[#737784]">
              Review and activate youth volunteer registrations ({volunteers.length} total)
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-2.5 py-1.5 bg-[#f0f3ff] hover:bg-[#e0e8ff] text-[#003c90] text-xs font-semibold border border-blue-100 flex items-center gap-1 self-start sm:self-auto"
        >
          <Download className="w-3 h-3" />
          <span>Export CSV</span>
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
            placeholder="Search by name, phone, district, or ID..."
            className="w-full pl-8 pr-3 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterProvince}
            onChange={(e) => setFilterProvince(e.target.value)}
            className="px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
          >
            <option value="all">All Provinces</option>
            <option value="Bagmati Province">Bagmati</option>
            <option value="Madhesh Province">Madhesh</option>
            <option value="Gandaki Province">Gandaki</option>
            <option value="Koshi Province">Koshi</option>
            <option value="Lumbini Province">Lumbini</option>
            <option value="Karnali Province">Karnali</option>
            <option value="Sudurpashchim Province">Sudurpashchim</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Contacted">Contacted</option>
          </select>
        </div>
      </div>

      {/* Volunteers Table & Mobile Card List */}
      <div>
        {/* Mobile Cards (Visible on mobile) */}
        <div className="block md:hidden space-y-3">
          {filteredVolunteers.map((vol) => (
            <div key={vol.id} className="bg-white p-4 border border-[#d8e3fb] shadow-xs space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono font-bold text-[#003c90] text-xs block">{vol.volunteerId}</span>
                  <span className="font-bold text-[#111c2d] text-sm">{vol.fullName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedVolunteer(vol)}
                    className="p-1.5 text-[#003c90] bg-[#f0f4ff] hover:bg-[#e0e8ff]"
                    title="View Full Profile"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(vol.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-1.5 border-y border-[#f0f3ff]">
                <div>
                  <span className="text-[10px] text-[#737784] uppercase font-bold block">Phone:</span>
                  <a href={`tel:${vol.phone}`} className="font-mono font-bold text-[#00743a] hover:underline">
                    {vol.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-[#737784] uppercase font-bold block">Location:</span>
                  <span className="font-semibold text-[#111c2d]">{vol.district}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-[#737784] uppercase font-bold block">Interest / Domain:</span>
                  <span className="font-semibold text-[#003c90] text-[11px] line-clamp-1">{vol.interest}</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold text-[#737784]">Status:</span>
                <select
                  value={vol.status}
                  onChange={(e) => handleUpdateStatus(vol.id, e.target.value as any)}
                  className={`flex-1 px-2.5 py-2 text-xs font-bold border min-h-[40px] ${
                    vol.status === 'Pending' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                    vol.status === 'Approved' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                    'bg-blue-50 text-blue-900 border-blue-300'
                  }`}
                >
                  <option value="Pending">⏳ Pending</option>
                  <option value="Approved">✅ Approved (Active)</option>
                  <option value="Contacted">📞 Contacted</option>
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
                <th className="p-3">Volunteer ID</th>
                <th className="p-3">Full Name & Contact</th>
                <th className="p-3">Location</th>
                <th className="p-3">Primary Interest Area</th>
                <th className="p-3">Availability</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3ff]">
              {filteredVolunteers.map((vol) => (
                <tr key={vol.id} className="hover:bg-[#fcfdff] transition-colors">
                  <td className="p-3 align-top font-mono font-bold text-[#003c90]">
                    {vol.volunteerId}
                    <span className="text-[10px] text-[#737784] block font-sans font-normal">{vol.submittedAt}</span>
                  </td>

                  <td className="p-3 align-top">
                    <span className="font-bold text-[#111c2d] block">{vol.fullName}</span>
                    <span className="font-mono text-[11px] text-[#434653] block">{vol.phone}</span>
                    <span className="text-[10px] text-[#737784]">{vol.email}</span>
                  </td>

                  <td className="p-3 align-top">
                    <span className="font-semibold text-[#111c2d] block">{vol.district}</span>
                    <span className="text-[10px] text-[#737784]">{vol.province}</span>
                  </td>

                  <td className="p-3 align-top">
                    <span className="font-semibold text-[#003c90] block text-[11px] max-w-xs line-clamp-2">
                      {vol.interest}
                    </span>
                  </td>

                  <td className="p-3 align-top">
                    <span className="text-[11px] text-[#434653] block font-semibold">{vol.availability}</span>
                  </td>

                  <td className="p-3 align-top">
                    <select
                      value={vol.status}
                      onChange={(e) => handleUpdateStatus(vol.id, e.target.value as any)}
                      className={`px-2 py-1 text-[11px] font-bold border ${
                        vol.status === 'Pending' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                        vol.status === 'Approved' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                        'bg-blue-50 text-blue-900 border-blue-300'
                      }`}
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="Approved">✅ Approved (Active)</option>
                      <option value="Contacted">📞 Contacted</option>
                    </select>
                  </td>

                  <td className="p-3 align-top text-right space-x-1">
                    <button
                      onClick={() => setSelectedVolunteer(vol)}
                      className="p-1 text-[#003c90] hover:bg-[#f0f3ff] transition-colors"
                      title="View Full Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(vol.id)}
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

      {/* Volunteer Detail Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 border border-[#d8e3fb] shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#d8e3fb]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#003c90] block">
                  {selectedVolunteer.volunteerId}
                </span>
                <h3 className="text-sm font-bold text-[#111c2d] font-heading">
                  {selectedVolunteer.fullName}
                </h3>
              </div>
              <button onClick={() => setSelectedVolunteer(null)} className="p-1 hover:bg-[#f0f3ff]">
                <X className="w-4 h-4 text-[#737784]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-[#f9f9ff] border border-[#d8e3fb]">
                <div>
                  <span className="text-[10px] font-bold text-[#737784] uppercase block">Phone:</span>
                  <span className="font-mono font-bold text-[#111c2d]">{selectedVolunteer.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#737784] uppercase block">Email:</span>
                  <span className="text-[#111c2d]">{selectedVolunteer.email}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#737784] uppercase block">Location:</span>
                  <span className="font-semibold text-[#111c2d]">{selectedVolunteer.district}, {selectedVolunteer.province}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#737784] uppercase block">Availability:</span>
                  <span className="font-semibold text-[#003c90]">{selectedVolunteer.availability}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#737784] uppercase block mb-1">
                  Selected Taskforce Interest Area:
                </span>
                <div className="p-2.5 bg-blue-50 border border-blue-200 text-[#003c90] font-bold">
                  {selectedVolunteer.interest}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#737784] uppercase block mb-1">
                  Why they want to volunteer (Statement):
                </span>
                <p className="p-3 bg-[#f9f9ff] border border-[#d8e3fb] text-[#434653] leading-relaxed">
                  {selectedVolunteer.reason || 'No statement provided.'}
                </p>
              </div>

              {selectedVolunteer.experience && (
                <div>
                  <span className="text-[10px] font-bold text-[#737784] uppercase block mb-1">
                    Previous Skills & Experience:
                  </span>
                  <p className="p-3 bg-[#f9f9ff] border border-[#d8e3fb] text-[#434653] leading-relaxed">
                    {selectedVolunteer.experience}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-[#d8e3fb] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-[#737784]">Status:</span>
                  <select
                    value={selectedVolunteer.status}
                    onChange={(e) => handleUpdateStatus(selectedVolunteer.id, e.target.value as any)}
                    className="px-2 py-1 text-xs font-bold border border-[#d8e3fb] bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved (Active)</option>
                    <option value="Contacted">Contacted</option>
                  </select>
                </div>

                <button
                  onClick={() => setSelectedVolunteer(null)}
                  className="px-4 py-2 bg-[#003c90] text-white text-xs font-bold uppercase"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
