import React from 'react';
import { CheckCircle, Printer, X, ShieldCheck } from 'lucide-react';
import { DonationSubmission, Language } from '../types';

interface DonationReceiptModalProps {
  donation: DonationSubmission | null;
  language?: Language;
  onClose: () => void;
}

export const DonationReceiptModal: React.FC<DonationReceiptModalProps> = ({
  donation,
  language = 'en',
  onClose
}) => {
  if (!donation) return null;
  const isNp = language === 'np';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-none sm:rounded-xs max-w-md w-full p-5 shadow-2xl border border-[#d8e3fb] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-6 h-6 rounded-none text-[#737784] hover:text-[#111c2d] flex items-center justify-center text-xs font-bold"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-4">
          <div className="w-10 h-10 bg-emerald-100 text-[#00743a] rounded-none mx-auto flex items-center justify-center mb-2">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h2
            className="text-base font-bold text-[#111c2d] font-heading"
          >
            {isNp ? 'सहयोगका लागि धन्यवाद!' : 'Thank You for Your Contribution!'}
          </h2>
          <p className="text-[11px] text-[#434653] mt-0.5">
            {isNp ? 'कर छुट योग्य आधिकारिक रसिद जारी भएको छ।' : 'Official Tax Exemption Receipt • SWC Reg: 54128'}
          </p>
        </div>

        {/* Receipt Box */}
        <div className="bg-[#f9f9ff] border border-[#d8e3fb] rounded-none p-3.5 space-y-1.5 text-xs mb-4">
          <div className="flex justify-between border-b border-[#e7eeff] pb-1.5">
            <span className="text-[#737784]">{isNp ? 'रसिद नम्बर:' : 'Receipt No:'}</span>
            <span className="font-mono font-bold text-[#003c90]">{donation.receiptNumber || 'REC-GZ-2025-4819'}</span>
          </div>
          <div className="flex justify-between border-b border-[#e7eeff] pb-1.5">
            <span className="text-[#737784]">{isNp ? 'मिति:' : 'Date:'}</span>
            <span className="font-semibold text-[#111c2d]">{donation.date}</span>
          </div>
          <div className="flex justify-between border-b border-[#e7eeff] pb-1.5">
            <span className="text-[#737784]">{isNp ? 'दाता:' : 'Donor:'}</span>
            <span className="font-bold text-[#111c2d]">{donation.donorName}</span>
          </div>
          <div className="flex justify-between border-b border-[#e7eeff] pb-1.5">
            <span className="text-[#737784]">{isNp ? 'परियोजना:' : 'Program:'}</span>
            <span className="font-semibold text-[#00743a] text-right max-w-[180px] truncate">
              {donation.projectName}
            </span>
          </div>
          <div className="flex justify-between border-b border-[#e7eeff] pb-1.5">
            <span className="text-[#737784]">{isNp ? 'माध्यम:' : 'Method:'}</span>
            <span className="font-bold uppercase text-[#003c90]">{donation.paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center pt-1.5">
            <span className="text-[#111c2d] font-bold text-xs">{isNp ? 'सहयोग रकम:' : 'Total Amount:'}</span>
            <span className="text-base font-bold text-[#00743a]">
              {donation.currency === 'NPR' ? `रू ${donation.amount.toLocaleString()}` : `$${donation.amount.toLocaleString()}`}
              <span className="text-[10px] uppercase font-semibold text-[#737784] ml-1">({donation.frequency})</span>
            </span>
          </div>
        </div>

        {/* SWC & Tax Note */}
        <div className="p-2 bg-emerald-50 rounded-none text-[10px] text-emerald-900 font-semibold mb-4 flex items-center gap-1.5 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#00743a]" />
          <span>PAN: 609823451 • SWC Reg: 54128 • Tax Exemption Eligible</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2 border border-[#d8e3fb] text-[#434653] rounded-none sm:rounded-xs text-xs font-bold uppercase tracking-wider hover:bg-[#f0f3ff] flex items-center justify-center gap-1"
          >
            <Printer className="w-3 h-3" />
            <span>{isNp ? 'प्रिन्ट' : 'Print'}</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-[#003c90] text-white rounded-none sm:rounded-xs text-xs font-bold uppercase tracking-wider hover:bg-[#002660] text-center"
          >
            {isNp ? 'सम्पन्न' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
