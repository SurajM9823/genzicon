import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  CheckCircle2
} from 'lucide-react';
import { FINANCIAL_ALLOCATION_DATA, EXPENSE_LEDGER_DATA, ANNUAL_AUDIT_REPORTS } from '../data/mockData';
import { Language } from '../types';

interface TransparencyScreenProps {
  language: Language;
}

export const TransparencyScreen: React.FC<TransparencyScreenProps> = ({ language }) => {
  const isNp = language === 'np';
  const [selectedLedgerCategory, setSelectedLedgerCategory] = useState<string>('All');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const filteredLedger = EXPENSE_LEDGER_DATA.filter(
    (item) => selectedLedgerCategory === 'All' || item.category.toLowerCase().includes(selectedLedgerCategory.toLowerCase())
  );

  const handleDownload = (docName: string) => {
    setDownloadSuccess(docName);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div id="transparency-screen" className="w-full pt-16 pb-12 bg-[#f9f9ff]">
      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-6">
        <div className="border-b border-[#d8e3fb] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#00743a] block mb-0.5">
                {isNp ? 'पारदर्शी आर्थिक विवरण' : 'Financial Transparency'}
              </span>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111c2d]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {isNp ? 'सार्वजनिक अडिट तथा खर्च खाता' : 'Public Audit & Expense Ledger'}
              </h1>
            </div>
            <p className="text-xs text-[#434653] max-w-md">
              {isNp
                ? '८८% बजेट प्रत्यक्ष फिल्डमा। प्रत्येक बिल, भर्पाई र स्वतन्त्र अडिट प्रतिवेदन सार्वजनिक उपलब्ध छन्।'
                : '88% direct program ratio. Download certified CA audits and inspect itemized field procurements.'}
            </p>
          </div>
        </div>
      </div>

      {/* Download Alert Notification */}
      {downloadSuccess && (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-4">
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between rounded-none sm:rounded-xs">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Downloaded verified copy of: <strong>{downloadSuccess}</strong></span>
            </span>
            <span className="text-[10px] text-emerald-700">SWC Reg: 54128</span>
          </div>
        </div>
      )}

      {/* Allocation Breakdown Cards */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FINANCIAL_ALLOCATION_DATA.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-4 sm:p-5 border border-[#d8e3fb] rounded-none sm:rounded-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold font-heading" style={{ color: item.color }}>
                    {item.percentage}%
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#f0f3ff] text-[#434653] rounded-none">
                    {idx === 0 ? 'Primary' : 'Support'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#111c2d] mb-1">
                  {isNp ? item.labelNp : item.label}
                </h3>
                <p className="text-xs text-[#737784] leading-relaxed">
                  {isNp ? item.descriptionNp : item.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#f0f3ff]">
                <div className="w-full h-1.5 rounded-none bg-[#f0f3ff] overflow-hidden">
                  <div
                    className="h-full rounded-none"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Annual Certified Audits Downloads */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-6">
        <div className="bg-white p-4 sm:p-5 border border-[#d8e3fb] rounded-none sm:rounded-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 pb-3 border-b border-[#f0f3ff]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#003c90] mb-0.5 block">
                {isNp ? 'प्रमाणित वित्तीय प्रतिवेदनहरू' : 'Certified Disclosures'}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#111c2d]">
                {isNp ? 'वार्षिक अडिट तथा समाज कल्याण परिषद् प्रतिवेदन' : 'Independent Audit Reports (FY 2080/81)'}
              </h3>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-[#00743a] text-[10px] font-bold rounded-none border border-emerald-200">
              Grade AAA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ANNUAL_AUDIT_REPORTS.map((rep) => (
              <div
                key={rep.id}
                className="p-3.5 bg-[#f9f9ff] border border-[#d8e3fb] rounded-none sm:rounded-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#003c90] bg-[#e7eeff] px-2 py-0.5 rounded-none">
                      {rep.fiscalYear}
                    </span>
                    <span className="text-[10px] text-[#737784] font-semibold">{rep.fileSize}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#111c2d] mb-1">
                    {isNp && rep.titleNp ? rep.titleNp : rep.title}
                  </h4>
                  <div className="text-[11px] text-[#434653] space-y-0.5 mb-3">
                    <div>Auditor: <strong>{rep.auditor}</strong></div>
                    <div>Income: <strong>रू {rep.totalIncomeNpr.toLocaleString()}</strong></div>
                    <div>Expenses: <strong>रू {rep.totalExpenditureNpr.toLocaleString()}</strong></div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(rep.title)}
                  className="w-full py-1.5 bg-white border border-[#d8e3fb] hover:border-[#003c90] text-[#003c90] rounded-none text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download PDF</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Itemized Public Ledger Table */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="bg-white p-4 sm:p-5 border border-[#d8e3fb] rounded-none sm:rounded-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00743a] mb-0.5 block">
                {isNp ? 'प्रत्यक्ष खर्च विवरण' : 'Live Ledger Items'}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#111c2d]">
                {isNp ? 'हालै सम्पन्न भएका फिल्ड खरिद तथा भुक्तानीहरू' : 'Recent Field Procurements & Verified Invoices'}
              </h3>
            </div>

            {/* Category Filter */}
            <div className="inline-flex bg-[#f0f3ff] border border-[#d8e3fb] rounded-none sm:rounded-xs text-xs font-bold">
              {['All', 'Equipment', 'Medical', 'Relief', 'Solar'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedLedgerCategory(cat)}
                  className={`px-2.5 py-1 transition-colors ${
                    selectedLedgerCategory === cat
                      ? 'bg-[#003c90] text-white'
                      : 'text-[#434653] hover:text-[#003c90]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e7eeff] text-[#737784] uppercase tracking-wider font-bold text-[10px]">
                  <th className="pb-2 pr-3">Date</th>
                  <th className="pb-2 px-3">Item & Description</th>
                  <th className="pb-2 px-3">Project / District</th>
                  <th className="pb-2 px-3">Vendor</th>
                  <th className="pb-2 px-3 text-right">Amount (NPR)</th>
                  <th className="pb-2 pl-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3ff]">
                {filteredLedger.map((row) => (
                  <tr key={row.id} className="hover:bg-[#f9f9ff] transition-colors">
                    <td className="py-2.5 pr-3 text-[#737784] font-semibold whitespace-nowrap text-[11px]">{row.date}</td>
                    <td className="py-2.5 px-3 font-bold text-[#111c2d]">
                      {isNp && row.itemNp ? row.itemNp : row.item}
                      <span className="block text-[10px] text-[#737784] font-normal">{row.category}</span>
                    </td>
                    <td className="py-2.5 px-3 text-[#434653] font-semibold">{row.project}</td>
                    <td className="py-2.5 px-3 text-[#737784]">{row.vendor}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#00743a] whitespace-nowrap">
                      रू {row.amountNpr.toLocaleString()}
                    </td>
                    <td className="py-2.5 pl-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-none">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
