import React from 'react';
import { Target, HeartHandshake, ShieldCheck, Award, FileCheck, CheckCircle2 } from 'lucide-react';
import { NavTab, Language } from '../types';

interface AboutScreenProps {
  language: Language;
  onSelectTab: (tab: NavTab) => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ language, onSelectTab }) => {
  const isNp = language === 'np';

  return (
    <div id="about-screen" className="w-full pt-16 pb-12 bg-[#f9f9ff]">
      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-6">
        <div className="border-b border-[#d8e3fb] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#003c90] block mb-0.5">
                {isNp ? 'हाम्रो परिचय तथा वैधानिकता' : 'Institutional Background'}
              </span>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111c2d]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {isNp ? 'जेन्जिकन फाउन्डेशन नेपाल' : 'About Genzicon Foundation'}
              </h1>
            </div>
            <p className="text-xs text-[#434653] max-w-md">
              {isNp
                ? 'समाज कल्याण परिषद् सम्बन्धन नं. ५४१२८ अन्तर्गत युवा नेतृत्वमा सञ्चालित पारदर्शी गैरसरकारी संस्था।'
                : 'Registered NGO dedicated to sustainable drinking water, solar classrooms, and disaster relief.'}
            </p>
          </div>
        </div>
      </div>

      {/* Official Legal & Compliance Accreditation Bar */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-6">
        <div className="bg-white p-4 sm:p-5 rounded-none sm:rounded-xs border border-[#d8e3fb]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-[#f9f9ff] border border-[#d8e3fb] rounded-none sm:rounded-xs">
              <FileCheck className="w-5 h-5 text-[#003c90] mx-auto mb-1" />
              <div className="text-xs font-bold text-[#111c2d]">SWC Affiliation</div>
              <div className="text-[11px] text-[#00743a] font-bold">No. 54128</div>
              <div className="text-[10px] text-[#737784]">Social Welfare Council</div>
            </div>

            <div className="p-3 bg-[#f9f9ff] border border-[#d8e3fb] rounded-none sm:rounded-xs">
              <ShieldCheck className="w-5 h-5 text-[#003c90] mx-auto mb-1" />
              <div className="text-xs font-bold text-[#111c2d]">NGO Registration</div>
              <div className="text-[11px] text-[#00743a] font-bold">Reg: 842/075</div>
              <div className="text-[10px] text-[#737784]">Govt. of Nepal</div>
            </div>

            <div className="p-3 bg-[#f9f9ff] border border-[#d8e3fb] rounded-none sm:rounded-xs">
              <Award className="w-5 h-5 text-[#003c90] mx-auto mb-1" />
              <div className="text-xs font-bold text-[#111c2d]">Tax Exemption / PAN</div>
              <div className="text-[11px] text-[#00743a] font-bold">PAN: 609823451</div>
              <div className="text-[10px] text-[#737784]">Inland Revenue Dept</div>
            </div>

            <div className="p-3 bg-[#f9f9ff] border border-[#d8e3fb] rounded-none sm:rounded-xs">
              <CheckCircle2 className="w-5 h-5 text-[#00743a] mx-auto mb-1" />
              <div className="text-xs font-bold text-[#111c2d]">Annual Audit</div>
              <div className="text-[11px] text-[#00743a] font-bold">88% Direct Field Ratio</div>
              <div className="text-[10px] text-[#737784]">Independent CA Certified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision, Mission, Objectives: Sharp 3-col minimal */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Vision */}
          <div className="bg-white p-5 rounded-none sm:rounded-xs border border-[#d8e3fb]">
            <div className="w-8 h-8 rounded-none bg-[#e7eeff] text-[#003c90] flex items-center justify-center mb-3">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#111c2d] mb-1.5 font-heading">
              {isNp ? 'हाम्रो दूरदृष्टि (Vision)' : 'Our Vision'}
            </h3>
            <p className="text-xs text-[#434653] leading-relaxed">
              {isNp
                ? 'नेपालका ग्रामीण बस्तीहरूमा शुद्ध खानेपानी, भरपर्दो उर्जा, आधुनिक शिक्षा र आधारभूत स्वास्थ्य सेवा सुनिश्चित गर्नु।'
                : 'A resilient Nepal where every rural community possesses clean drinking water, renewable energy, and digital learning tools.'}
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white p-5 rounded-none sm:rounded-xs border border-[#d8e3fb]">
            <div className="w-8 h-8 rounded-none bg-[#e7eeff] text-[#00743a] flex items-center justify-center mb-3">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#111c2d] mb-1.5 font-heading">
              {isNp ? 'हाम्रो लक्ष्य (Mission)' : 'Our Mission'}
            </h3>
            <p className="text-xs text-[#434653] leading-relaxed">
              {isNp
                ? 'युवा स्वयंसेवकहरूलाई परिचालन गरी १००% पारदर्शी ढङ्गले खानेपानी र शिक्षा परियोजनाहरू कार्यान्वयन गर्नु।'
                : 'To execute measurable, open-ledger development programs with local village committees and trained caretakers.'}
            </p>
          </div>

          {/* Core Values */}
          <div className="bg-white p-5 rounded-none sm:rounded-xs border border-[#d8e3fb]">
            <div className="w-8 h-8 rounded-none bg-[#e7eeff] text-[#003c90] flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#111c2d] mb-1.5 font-heading">
              {isNp ? 'हाम्रा मान्यता (Values)' : 'Core Values'}
            </h3>
            <ul className="text-xs text-[#434653] space-y-1.5 leading-relaxed">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-none bg-[#00743a]" />
                <strong>{isNp ? 'पूर्ण पारदर्शिता' : 'Radical Transparency'}:</strong> {isNp ? 'सार्वजनिक खर्च विवरण' : 'Public ledgers & audit'}
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-none bg-[#00743a]" />
                <strong>{isNp ? 'स्थानीय स्वामित्व' : 'Community Ownership'}:</strong> {isNp ? 'गाउँपालिका सम्झौता' : 'Village council pacts'}
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-none bg-[#00743a]" />
                <strong>{isNp ? 'युवा नेतृत्व' : 'Youth Leadership'}:</strong> {isNp ? 'प्रत्यक्ष फिल्ड उपस्थिति' : 'Direct field execution'}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Story & Image Section */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-6">
        <div className="bg-white p-5 sm:p-6 border border-[#d8e3fb] rounded-none sm:rounded-xs grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#003c90] mb-1 block">
              {isNp ? 'हाम्रो यात्रा' : 'Our Story'}
            </span>
            <h2 className="text-base sm:text-xl font-bold text-[#111c2d] mb-2 font-heading leading-tight">
              {isNp
                ? 'जनकपुर र काठमाडौँबाट सुरु भएको युवा अभियान'
                : 'From a Grassroots Taskforce to Nationwide Impact'}
            </h2>
            <div className="space-y-2 text-xs text-[#434653] leading-relaxed">
              <p>
                {isNp
                  ? 'सन् २०१८ मा इन्जिनियरिङ तथा मेडिकल विद्यार्थीहरूले मधेसका बाढी प्रभावित क्षेत्रमा आकस्मिक राहत वितरणबाट यो संस्थाको थालनी गरेका थिए।'
                  : 'In 2018, young engineering and medical graduates began delivering emergency aid in flood-affected plains of southern Nepal. Seeking radical transparency, they established Genzicon Foundation.'}
              </p>
              <p>
                {isNp
                  ? 'आज कर्णालीका १५ विद्यालयमा सोलार, धनुषामा आर्सेनिकमुक्त बोरिङ र मधेसका किशोरीलाई डिजिटल सीप प्रदान गरिएको छ।'
                  : 'By establishing an open-ledger philosophy, 88% of funds directly power field infrastructure. Today, we manage solar grids in Karnali and clean water wells across Nepal.'}
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => onSelectTab('team')}
                className="px-4 py-2 bg-[#003c90] text-white rounded-none sm:rounded-xs text-xs font-bold uppercase tracking-wider hover:bg-[#002660] transition-colors"
              >
                {isNp ? 'हाम्रो टिम' : 'Team'}
              </button>
              <button
                onClick={() => onSelectTab('transparency')}
                className="px-4 py-2 bg-[#f0f3ff] text-[#003c90] border border-[#d8e3fb] rounded-none sm:rounded-xs text-xs font-bold uppercase tracking-wider hover:bg-[#e7eeff] transition-colors"
              >
                {isNp ? 'पारदर्शिता प्रतिवेदन' : 'Financials'}
              </button>
            </div>
          </div>

          <div className="h-56 sm:h-64 overflow-hidden border border-[#d8e3fb] rounded-none sm:rounded-xs relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL4Mfh5GFiLxesJe3tOcT5KWd_ZkdYVcWP_ej1Fja92C7ZN9fJciSHe5ZRKrJZBH2Sps_dTSLEt9FX3jcg80yXzqF-crJbXnyevYYWpfcw4lrHPl7mzRKWzRWTt06z_MhcBQ_Xpd9iRg_gg8gILWw6uq7miWek7jXxu3L75jmd_QgR5LJc8_UEA3GUDk7qfT_Ywhzea7yLUuT32S41_Yip0U_82rJ5MF0z1N9OSNgFCvQSUc0DKesM"
              alt="Genzicon Foundation field team in Nepal"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
