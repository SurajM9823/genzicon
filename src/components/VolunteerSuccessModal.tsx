import React from 'react';
import { HeartHandshake, X, Calendar, ShieldCheck } from 'lucide-react';
import { VolunteerFormData, Language } from '../types';

interface VolunteerSuccessModalProps {
  data: VolunteerFormData | null;
  language?: Language;
  onClose: () => void;
}

export const VolunteerSuccessModal: React.FC<VolunteerSuccessModalProps> = ({
  data,
  language = 'en',
  onClose
}) => {
  if (!data) return null;
  const isNp = language === 'np';
  const volunteerId = `VNP-${Math.floor(10000 + Math.random() * 90000)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-none sm:rounded-xs max-w-md w-full p-5 shadow-2xl border border-[#d8e3fb] relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-6 h-6 rounded-none text-[#737784] hover:text-[#111c2d] flex items-center justify-center text-xs font-bold"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 bg-emerald-100 text-[#00743a] rounded-none mx-auto flex items-center justify-center mb-2">
          <HeartHandshake className="w-6 h-6" />
        </div>

        <h2 className="text-base font-bold text-[#111c2d] mb-1 font-heading">
          {isNp ? `स्वागत छ, ${data.fullName}!` : `Welcome, ${data.fullName}!`}
        </h2>

        <p className="text-xs text-[#434653] leading-relaxed mb-4">
          {isNp
            ? 'जेन्जिकन फाउन्डेशनमा तपाईंको स्वयंसेवक आवेदन सफलतापूर्वक दर्ता भएको छ।'
            : `Your application for ${data.interest} has been recorded in our Nepal Volunteer Taskforce.`}
        </p>

        <div className="bg-[#111c2d] text-white p-3.5 rounded-none text-left mb-4 border border-white/10">
          <div className="flex justify-between items-start mb-2 border-b border-white/20 pb-1.5">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400 block">
                  Volunteer Application Pass
                </span>
                <span className="text-[8px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-xs font-bold">
                  {isNp ? 'प्रमाणीकरण बाँकी (Pending Review)' : 'Pending Verification'}
                </span>
              </div>
              <h4 className="text-xs font-bold mt-0.5">{data.fullName}</h4>
            </div>
            <span className="font-mono text-[11px] bg-white/20 px-2 py-0.5 rounded-none font-bold">
              {volunteerId}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-white/80 mb-2">
            <div>
              <span className="text-white/50 block text-[9px]">Location:</span>
              <strong>{data.district}, {data.province}</strong>
            </div>
            <div>
              <span className="text-white/50 block text-[9px]">Track:</span>
              <strong className="truncate block">{data.interest}</strong>
            </div>
          </div>

          <div className="text-[9px] text-emerald-300 font-semibold flex items-center gap-1 pt-1.5 border-t border-white/10">
            <ShieldCheck className="w-3 h-3" />
            <span>Genzicon Civic Youth Taskforce Registry</span>
          </div>
        </div>

        <div className="bg-[#f0f3ff] p-3 rounded-none text-left text-xs space-y-1 border border-[#d8e3fb] mb-4 text-[#434653]">
          <div className="font-bold text-[#003c90] flex items-center gap-1 text-[11px]">
            <Calendar className="w-3 h-3" />
            <span>{isNp ? 'आगामी प्रक्रिया (Next Steps):' : 'Verification & Activation Process:'}</span>
          </div>
          <p className="text-[11px]">• {isNp ? 'तपाईंको आवेदन फिल्ड संयोजकलाई पठाइएको छ र प्रमाणीकरण हुँदैछ।' : 'Your application is registered in Pending status and sent to our field leads.'}</p>
          <p className="text-[11px]">• {isNp ? 'प्रमाणीकरण पूरा भएपछि तपाईंको नाम यसै पृष्ठको सक्रिय स्वयंसेवक सूचीमा समावेश हुनेछ।' : 'Once approved, your verified profile will appear on the Active Volunteers Directory below.'}</p>
          <p className="text-[11px]">• {isNp ? 'अभिमुखीकरण सामग्री तपाईंको इमेलमा पठाइएको छ।' : `Orientation packet and next task details sent to ${data.email}.`}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-[#003c90] text-white rounded-none sm:rounded-xs text-xs font-bold uppercase tracking-wider hover:bg-[#002660] transition-colors"
        >
          {isNp ? 'सम्पन्न' : 'Done'}
        </button>
      </div>
    </div>
  );
};
