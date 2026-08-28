import React from 'react';
import { 
  Shirt, 
  Users, 
  HeartHandshake, 
  FolderKanban, 
  Mail, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { 
  Project, 
  VolunteerRecord, 
  DonationRecord, 
  ClothesDonationRequest, 
  ContactMessage,
  SiteContentConfig,
  Language 
} from '../../types';
import { AdminTabType } from './AdminHeader';

interface AdminOverviewTabProps {
  language: Language;
  siteContent: SiteContentConfig;
  projects: Project[];
  clothesDonations: ClothesDonationRequest[];
  volunteers: VolunteerRecord[];
  donations: DonationRecord[];
  contacts: ContactMessage[];
  setActiveTab: (tab: AdminTabType) => void;
  onOpenAddProjectModal: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  language,
  siteContent,
  projects,
  clothesDonations,
  volunteers,
  donations,
  contacts,
  setActiveTab,
  onOpenAddProjectModal
}) => {
  const isNp = language === 'np';

  // Calculations
  const totalVerifiedDonationsNpr = donations
    .filter(d => d.status === 'Verified' && d.currency === 'NPR')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingDonationsCount = donations.filter(d => d.status === 'Pending').length;
  const pendingClothesPickups = clothesDonations.filter(c => c.status === 'Pending' || c.status === 'Scheduled').length;
  const totalClothesPiecesScheduled = clothesDonations.reduce((acc, curr) => acc + (curr.approxItemsCount || 0), 0);
  const pendingVolunteers = volunteers.filter(v => v.status === 'Pending').length;
  const activeProjectsCount = projects.filter(p => p.status === 'Active').length;
  const newContactsCount = contacts.filter(c => c.status === 'New').length;

  return (
    <div className="space-y-4">
      {/* 4 Primary Top-Level Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Clothes Bank */}
        <div className="bg-white p-3.5 sm:p-4 border border-[#d8e3fb] shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
              {isNp ? 'कपडा बैंक' : 'Clothes Requests'}
            </span>
            <Shirt className="w-3.5 h-3.5 text-[#003c90]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-[#111c2d]">
            {clothesDonations.length}
          </div>
          <div className="text-[11px] text-[#737784] mt-0.5 flex items-center justify-between">
            <span>{totalClothesPiecesScheduled} pcs</span>
            {pendingClothesPickups > 0 && (
              <span className="text-amber-700 font-semibold bg-amber-50 px-1 py-0.2 text-[9px]">
                {pendingClothesPickups} pending
              </span>
            )}
          </div>
          <button
            onClick={() => setActiveTab('clothes')}
            className="mt-2.5 pt-2 w-full border-t border-[#f0f3ff] text-[10px] font-bold text-[#003c90] hover:underline flex items-center justify-between"
          >
            <span>View Pickups</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Metric 2: Volunteers Network */}
        <div className="bg-white p-3.5 sm:p-4 border border-[#d8e3fb] shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
              {isNp ? 'स्वयंसेवक' : 'Volunteers'}
            </span>
            <Users className="w-3.5 h-3.5 text-[#00743a]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-[#111c2d]">
            {volunteers.length}
          </div>
          <div className="text-[11px] text-[#737784] mt-0.5 flex items-center justify-between">
            <span>7 provinces</span>
            {pendingVolunteers > 0 && (
              <span className="text-blue-700 font-semibold bg-blue-50 px-1 py-0.2 text-[9px]">
                {pendingVolunteers} new
              </span>
            )}
          </div>
          <button
            onClick={() => setActiveTab('volunteers')}
            className="mt-2.5 pt-2 w-full border-t border-[#f0f3ff] text-[10px] font-bold text-[#00743a] hover:underline flex items-center justify-between"
          >
            <span>Applications</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Metric 3: Donation Slips & Funds */}
        <div className="bg-white p-3.5 sm:p-4 border border-[#d8e3fb] shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
              {isNp ? 'दान संकलन' : 'Verified Donations'}
            </span>
            <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-[#003c90] truncate">
            रू {totalVerifiedDonationsNpr.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#737784] mt-0.5 flex items-center justify-between">
            <span>{donations.length} records</span>
            {pendingDonationsCount > 0 && (
              <span className="text-amber-700 font-semibold bg-amber-50 px-1 py-0.2 text-[9px]">
                {pendingDonationsCount} unverified
              </span>
            )}
          </div>
          <button
            onClick={() => setActiveTab('donations')}
            className="mt-2.5 pt-2 w-full border-t border-[#f0f3ff] text-[10px] font-bold text-[#003c90] hover:underline flex items-center justify-between"
          >
            <span>Ledger</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Metric 4: Active Field Programs */}
        <div className="bg-white p-3.5 sm:p-4 border border-[#d8e3fb] shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
              {isNp ? 'कार्यक्रमहरू' : 'Programs'}
            </span>
            <FolderKanban className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-[#111c2d]">
            {activeProjectsCount} Active
          </div>
          <div className="text-[11px] text-[#737784] mt-0.5 flex items-center justify-between">
            <span>{projects.length} total</span>
            <span className="text-emerald-700 font-semibold text-[9px]">Ground</span>
          </div>
          <button
            onClick={() => setActiveTab('projects')}
            className="mt-2.5 pt-2 w-full border-t border-[#f0f3ff] text-[10px] font-bold text-amber-800 hover:underline flex items-center justify-between"
          >
            <span>Programs</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Quick Actions & Live Website Preview Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Quick Actions & Recent Pickup Requests */}
        <div className="lg:col-span-7 space-y-4">
          {/* Quick CMS Action Buttons */}
          <div className="bg-white p-3.5 sm:p-4 border border-[#d8e3fb] shadow-xs">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#434653] mb-2.5">
              {isNp ? 'द्रुत कार्यहरू' : 'Quick Actions'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={onOpenAddProjectModal}
                className="p-2.5 bg-[#f0f4ff] hover:bg-[#e0e8ff] border border-blue-100 text-[#003c90] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Program</span>
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className="p-2.5 bg-[#f0fbf4] hover:bg-[#e0f5e8] border border-emerald-100 text-[#00743a] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Hero & Stats</span>
              </button>

              <button
                onClick={() => setActiveTab('clothes')}
                className="p-2.5 bg-[#fcf8ee] hover:bg-[#faedd0] border border-amber-100 text-amber-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>Clothes Log</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="p-2.5 bg-[#f9f9ff] hover:bg-[#f0f3ff] border border-[#d8e3fb] text-[#434653] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Bank & QR</span>
              </button>
            </div>
          </div>

          {/* Recent Clothes Requests */}
          <div className="bg-white p-3.5 sm:p-4 border border-[#d8e3fb] shadow-xs">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#f0f3ff]">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#111c2d] flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-[#003c90]" />
                <span>Latest Clothes Requests</span>
              </h3>
              <button
                onClick={() => setActiveTab('clothes')}
                className="text-[10px] font-bold text-[#003c90] hover:underline"
              >
                View All ({clothesDonations.length})
              </button>
            </div>

            <div className="divide-y divide-[#f0f3ff]">
              {clothesDonations.slice(0, 4).map((item) => (
                <div key={item.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#111c2d] truncate">{item.donorName}</span>
                      <span className={`px-1.5 py-0.2 text-[8px] font-bold uppercase ${
                        item.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        item.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#737784] truncate">
                      {item.clothesType} • ~{item.approxItemsCount} pcs • {item.city || item.district}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9px] text-[#737784] block">{item.pickupDate || item.date}</span>
                    <span className="text-[10px] font-mono text-[#003c90]">{item.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Hero & Inquiries */}
        <div className="lg:col-span-5 space-y-4">
          {/* Current Live Hero Preview */}
          <div className="bg-white p-3.5 sm:p-4 border border-[#d8e3fb] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#111c2d]">
                Homepage Hero Preview
              </h3>
              <button
                onClick={() => setActiveTab('content')}
                className="text-[10px] font-bold text-[#003c90] hover:underline"
              >
                Edit Hero
              </button>
            </div>

            <div className="relative h-28 w-full overflow-hidden border border-[#d8e3fb] mb-2.5">
              <img
                src={siteContent.heroImageUrl}
                alt="Live hero banner"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-2.5 text-white">
                <span className="text-[8px] uppercase font-bold text-emerald-400">
                  {siteContent.heroBannerTag}
                </span>
                <h4 className="text-xs font-bold line-clamp-1">
                  {siteContent.heroTitle}
                </h4>
              </div>
            </div>

            {/* Impact Metric values */}
            <div className="grid grid-cols-2 gap-1.5 text-center text-xs">
              {siteContent.impactStats.slice(0, 4).map((stat) => (
                <div key={stat.id} className="p-1.5 bg-[#f9f9ff] border border-[#d8e3fb]">
                  <div className="font-bold text-[#003c90] text-xs font-mono">
                    {stat.number}
                  </div>
                  <div className="text-[9px] text-[#737784] truncate">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Queries Box */}
          <div className="bg-white p-3.5 sm:p-4 border border-[#d8e3fb] shadow-xs">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#f0f3ff]">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#111c2d] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                <span>Recent Inquiries</span>
              </h3>
              <button
                onClick={() => setActiveTab('contacts')}
                className="text-[10px] font-bold text-[#003c90] hover:underline"
              >
                View ({contacts.length})
              </button>
            </div>

            <div className="space-y-1.5">
              {contacts.slice(0, 3).map((msg) => (
                <div key={msg.id} className="p-2 bg-[#f9f9ff] border border-[#d8e3fb] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#111c2d] text-[11px]">{msg.name}</span>
                    <span className={`px-1 py-0.2 text-[8px] font-bold ${
                      msg.status === 'New' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {msg.status}
                    </span>
                  </div>
                  <div className="text-[10px] font-semibold text-[#003c90] truncate">
                    {msg.subject}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
