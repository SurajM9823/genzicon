import React, { useState } from 'react';
import { 
  Building2, 
  QrCode, 
  Save, 
  CheckCircle2, 
  RotateCcw, 
  Phone, 
  Mail, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { BankAndQrConfig, Language } from '../../types';
import { DEFAULT_BANK_QR_CONFIG } from '../../data/mockData';

interface AdminSettingsTabProps {
  language: Language;
  bankQrConfig: BankAndQrConfig;
  onSaveBankQrConfig: (config: BankAndQrConfig) => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  language,
  bankQrConfig,
  onSaveBankQrConfig
}) => {
  const isNp = language === 'np';
  const [formData, setFormData] = useState<BankAndQrConfig>(bankQrConfig);
  const [saveToast, setSaveToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBankQrConfig(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Reset bank details and QR codes to standard organization defaults?')) {
      setFormData(DEFAULT_BANK_QR_CONFIG);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 border border-[#d8e3fb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#111c2d] font-heading flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#003c90]" />
            <span>Bank Account & Donation QR Code Configuration</span>
          </h2>
          <p className="text-xs text-[#737784]">
            Manage the official NGO bank account details, Fonepay merchant QR code, and mobile wallet IDs displayed on the donation page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Published Live!</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 bg-[#f9f9ff] hover:bg-[#f0f3ff] text-[#434653] text-xs font-bold border border-[#d8e3fb] flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-[#00743a] hover:bg-[#005227] text-white text-xs font-bold uppercase tracking-wider shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Update Donate Page</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form for Bank and QR settings */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Official Bank Details */}
          <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#f0f3ff]">
              <Building2 className="w-4 h-4 text-[#003c90]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                1. Official Commercial Bank Details (Direct Wire / Cheque)
              </h3>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                Bank Name *
              </label>
              <input
                type="text"
                required
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="e.g. Global IME Bank Ltd."
                className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Account Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  placeholder="e.g. GENZICON FOUNDATION NEPAL"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white uppercase font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="e.g. 01201010009823"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-mono font-bold text-[#003c90] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Branch Name & City
                </label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="e.g. Putalisadak Central Branch, Kathmandu"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  SWIFT Code (for International Wire)
                </label>
                <input
                  type="text"
                  value={formData.swiftCode || ''}
                  onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                  placeholder="e.g. GLBBNPKA"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-mono text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Fonepay QR & Mobile Wallets */}
          <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#f0f3ff]">
              <QrCode className="w-4 h-4 text-[#00743a]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                2. Fonepay QR Merchant & Mobile Wallet Display
              </h3>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                Fonepay Merchant Display Name
              </label>
              <input
                type="text"
                value={formData.fonepayMerchantName}
                onChange={(e) => setFormData({ ...formData, fonepayMerchantName: e.target.value })}
                placeholder="e.g. GENZICON FOUNDATION NEPAL"
                className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                Fonepay QR Image URL
              </label>
              <input
                type="url"
                value={formData.fonepayQrImage}
                onChange={(e) => setFormData({ ...formData, fonepayQrImage: e.target.value })}
                placeholder="https://api.qrserver.com/v1/..."
                className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-mono text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  eSewa ID / Registered Phone
                </label>
                <input
                  type="text"
                  value={formData.esewaId || ''}
                  onChange={(e) => setFormData({ ...formData, esewaId: e.target.value })}
                  placeholder="9823000000 / genzicon.esewa"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Khalti ID / Registered Phone
                </label>
                <input
                  type="text"
                  value={formData.khaltiId || ''}
                  onChange={(e) => setFormData({ ...formData, khaltiId: e.target.value })}
                  placeholder="9823000000"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Donation Support Hotline Phone
                </label>
                <input
                  type="text"
                  value={formData.hotlinePhone || ''}
                  onChange={(e) => setFormData({ ...formData, hotlinePhone: e.target.value })}
                  placeholder="+977 1-4240000 / 9823000000"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Donation Finance Email
                </label>
                <input
                  type="email"
                  value={formData.hotlineEmail || ''}
                  onChange={(e) => setFormData({ ...formData, hotlineEmail: e.target.value })}
                  placeholder="donate@genzicon.org"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview of Donor Payment Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d] mb-1">
              Live Preview: Donor View on /donate
            </h3>
            <p className="text-[11px] text-[#737784] mb-3">
              This exact bank and QR card is shown to donors across Nepal and globally.
            </p>

            {/* Fonepay QR Card Box */}
            <div className="p-4 bg-[#f0f4ff] border-2 border-[#003c90] text-center space-y-3 mb-4">
              <span className="px-2 py-0.5 bg-[#003c90] text-white text-[10px] font-bold uppercase tracking-wider">
                Scan with any Nepal Bank / Wallet App
              </span>
              <div className="w-36 h-36 mx-auto bg-white p-2 border border-[#d8e3fb] shadow-xs">
                <img
                  src={formData.fonepayQrImage}
                  alt="Fonepay QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-bold text-xs text-[#111c2d]">{formData.fonepayMerchantName}</div>
                <div className="text-[10px] text-[#737784]">All 50+ Mobile Banking Apps & Wallets Supported</div>
              </div>
            </div>

            {/* Commercial Bank Account Preview Box */}
            <div className="p-4 bg-[#f9f9ff] border border-[#d8e3fb] space-y-2 text-xs">
              <div className="font-bold text-[#003c90] text-sm flex items-center gap-1.5 pb-1.5 border-b border-[#e7eeff]">
                <Building2 className="w-4 h-4" />
                <span>{formData.bankName}</span>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#737784]">Account Name:</span>
                  <span className="font-bold text-[#111c2d]">{formData.accountName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737784]">Account Number:</span>
                  <span className="font-mono font-bold text-[#003c90]">{formData.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737784]">Branch:</span>
                  <span className="text-[#111c2d]">{formData.branch}</span>
                </div>
                {formData.swiftCode && (
                  <div className="flex justify-between">
                    <span className="text-[#737784]">SWIFT Code:</span>
                    <span className="font-mono font-bold text-[#111c2d]">{formData.swiftCode}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
