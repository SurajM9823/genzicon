import React, { useState } from 'react';
import { 
  Mail, 
  Search, 
  Download, 
  CheckCircle2, 
  Trash2, 
  Eye, 
  X,
  Phone,
  MessageSquare
} from 'lucide-react';
import { ContactMessage, Language } from '../../types';

interface AdminContactsTabProps {
  language: Language;
  contacts: ContactMessage[];
  onSaveContacts: (updated: ContactMessage[]) => void;
}

export const AdminContactsTab: React.FC<AdminContactsTabProps> = ({
  language,
  contacts,
  onSaveContacts
}) => {
  const isNp = language === 'np';
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const handleUpdateStatus = (id: string, newStatus: ContactMessage['status']) => {
    const updated = contacts.map(c => c.id === id ? { ...c, status: newStatus } : c);
    onSaveContacts(updated);
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, status: newStatus });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this message?')) {
      onSaveContacts(contacts.filter(c => c.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Name,Email,Phone,Subject,Message,Status,Date\n";
    contacts.forEach(c => {
      csvContent += `"${c.id}","${c.name}","${c.email}","${c.phone || ''}","${c.subject.replace(/"/g, '""')}","${c.message.replace(/"/g, '""')}","${c.status}","${c.date}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `genzicon_contact_inquiries_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm)) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-3.5 sm:p-4 border border-[#d8e3fb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#003c90]" />
          <div>
            <h2 className="text-sm font-bold text-[#111c2d]">
              Inquiries & Messages
            </h2>
            <p className="text-[11px] text-[#737784]">
              Manage citizen queries and feedback ({contacts.length} total)
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

      {/* Search & Filter */}
      <div className="bg-white p-3 border border-[#d8e3fb] shadow-xs flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-[#737784] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inquiries by sender name, subject, email or phone..."
            className="w-full pl-8 pr-3 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] w-full sm:w-auto"
        >
          <option value="all">All Statuses</option>
          <option value="New">New / Unread</option>
          <option value="Replied">Replied</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Inquiries Table & Mobile Cards */}
      <div>
        {/* Mobile Cards (Visible on mobile) */}
        <div className="block md:hidden space-y-3">
          {filteredContacts.map((item) => (
            <div key={item.id} className="bg-white p-4 border border-[#d8e3fb] shadow-xs space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-bold text-[#111c2d] text-sm block">{item.name}</span>
                  <span className="text-[10px] text-[#737784] block">{item.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedMessage(item)}
                    className="p-1.5 text-[#003c90] bg-[#f0f4ff] hover:bg-[#e0e8ff]"
                    title="View Full Message"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="py-1 text-xs border-y border-[#f0f3ff] space-y-1">
                <div>
                  <span className="text-[10px] text-[#737784] uppercase font-bold block">Subject:</span>
                  <span className="font-bold text-[#003c90] text-xs">{item.subject}</span>
                </div>
                <p className="text-[11px] text-[#434653] line-clamp-2">
                  {item.message}
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px]">
                  <a href={`mailto:${item.email}`} className="text-[#003c90] font-semibold hover:underline">
                    {item.email}
                  </a>
                  {item.phone && (
                    <a href={`tel:${item.phone}`} className="font-mono text-[#00743a] font-bold">
                      {item.phone}
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold text-[#737784]">Status:</span>
                <select
                  value={item.status}
                  onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
                  className={`flex-1 px-2.5 py-2 text-xs font-bold border min-h-[40px] ${
                    item.status === 'New' ? 'bg-red-50 text-red-800 border-red-300' :
                    item.status === 'Replied' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                    'bg-emerald-50 text-emerald-800 border-emerald-300'
                  }`}
                >
                  <option value="New">🔴 New / Unread</option>
                  <option value="Replied">🔵 Replied</option>
                  <option value="Resolved">🟢 Resolved</option>
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
                <th className="p-3">Sender Name & Date</th>
                <th className="p-3">Contact Details</th>
                <th className="p-3">Subject & Inquiry Snippet</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3ff]">
              {filteredContacts.map((item) => (
                <tr key={item.id} className="hover:bg-[#fcfdff] transition-colors">
                  <td className="p-3 align-top">
                    <span className="font-bold text-[#111c2d] block">{item.name}</span>
                    <span className="text-[10px] text-[#737784] block">{item.date}</span>
                  </td>

                  <td className="p-3 align-top">
                    <span className="text-[11px] text-[#111c2d] block">{item.email}</span>
                    {item.phone && <span className="font-mono text-[11px] text-[#434653] block">{item.phone}</span>}
                  </td>

                  <td className="p-3 align-top">
                    <span className="font-bold text-[#003c90] block text-xs mb-0.5">{item.subject}</span>
                    <p className="text-[11px] text-[#434653] line-clamp-2 max-w-md">
                      {item.message}
                    </p>
                  </td>

                  <td className="p-3 align-top">
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
                      className={`px-2 py-1 text-[11px] font-bold border ${
                        item.status === 'New' ? 'bg-red-50 text-red-800 border-red-300' :
                        item.status === 'Replied' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                        'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      <option value="New">🔴 New</option>
                      <option value="Replied">🔵 Replied</option>
                      <option value="Resolved">🟢 Resolved</option>
                    </select>
                  </td>

                  <td className="p-3 align-top text-right space-x-1">
                    <button
                      onClick={() => setSelectedMessage(item)}
                      className="p-1 text-[#003c90] hover:bg-[#f0f3ff]"
                      title="View Full Message"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-red-600 hover:bg-red-50"
                      title="Delete message"
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

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 border border-[#d8e3fb] shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#d8e3fb]">
              <h3 className="text-sm font-bold text-[#111c2d] font-heading">
                Inquiry from {selectedMessage.name}
              </h3>
              <button onClick={() => setSelectedMessage(null)}>
                <X className="w-4 h-4 text-[#737784]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#f9f9ff] border border-[#d8e3fb] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[10px] font-bold text-[#737784] uppercase">Date:</span>
                  <span className="font-semibold text-[#111c2d]">{selectedMessage.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] font-bold text-[#737784] uppercase">Email:</span>
                  <a href={`mailto:${selectedMessage.email}`} className="text-[#003c90] font-bold hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div className="flex justify-between">
                    <span className="text-[10px] font-bold text-[#737784] uppercase">Phone:</span>
                    <a href={`tel:${selectedMessage.phone}`} className="font-mono text-[#00743a] font-bold">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#737784] uppercase block mb-0.5">Subject:</span>
                <p className="font-bold text-[#003c90] text-sm">{selectedMessage.subject}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#737784] uppercase block mb-1">Message Body:</span>
                <div className="p-3.5 bg-[#f9f9ff] border border-[#d8e3fb] text-[#434653] leading-relaxed whitespace-pre-line text-xs">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="pt-3 border-t border-[#d8e3fb] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-[#737784]">Status:</span>
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleUpdateStatus(selectedMessage.id, e.target.value as any)}
                    className="px-2 py-1 text-xs font-bold border border-[#d8e3fb] bg-white"
                  >
                    <option value="New">New</option>
                    <option value="Replied">Replied</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="px-4 py-2 bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold uppercase flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
