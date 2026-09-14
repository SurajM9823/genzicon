import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  User, 
  Mail, 
  Phone, 
  Linkedin, 
  Save, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { BoardMember, Language } from '../../types';

interface AdminBoardMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit: BoardMember | null;
  onSave: (member: BoardMember, file?: File) => Promise<void>;
  language: Language;
  nextOrder?: number;
}

const POSITION_SUGGESTIONS = [
  { en: 'Founder & Chairperson', np: 'संस्थापक तथा अध्यक्ष' },
  { en: 'Vice Chairperson', np: 'उपाध्यक्ष' },
  { en: 'General Secretary', np: 'महासचिव' },
  { en: 'Treasurer', np: 'कोषाध्यक्ष' },
  { en: 'Executive Board Member', np: 'कार्यकारी सदस्य' },
  { en: 'Advisory Board Member', np: 'सल्लाहकार सदस्य' },
];

export const AdminBoardMemberModal: React.FC<AdminBoardMemberModalProps> = ({
  isOpen,
  onClose,
  memberToEdit,
  onSave,
  language,
  nextOrder = 1
}) => {
  const isNp = language === 'np';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<BoardMember>>({
    name: '',
    nameNp: '',
    position: 'Executive Board Member',
    positionNp: 'कार्यकारी सदस्य',
    email: '',
    phone: '',
    linkedin: '',
    bio: '',
    bioNp: '',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    order: nextOrder,
    isActive: true
  });

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (memberToEdit) {
      setFormData({ ...memberToEdit });
      setPreviewUrl(memberToEdit.imageUrl || memberToEdit.final_image_url || '');
      setSelectedFile(undefined);
    } else {
      const defaultImg = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
      setFormData({
        name: '',
        nameNp: '',
        position: 'Executive Board Member',
        positionNp: 'कार्यकारी सदस्य',
        email: '',
        phone: '',
        linkedin: '',
        bio: '',
        bioNp: '',
        imageUrl: defaultImg,
        order: nextOrder,
        isActive: true
      });
      setPreviewUrl(defaultImg);
      setSelectedFile(undefined);
    }
    setErrorMsg('');
  }, [memberToEdit, nextOrder, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please select a valid image file (JPG, PNG, WEBP).');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData(prev => ({ ...prev, imageUrl: url }));
      setErrorMsg('');
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
    setPreviewUrl(url);
    setSelectedFile(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setErrorMsg('Full name is required.');
      return;
    }
    if (!formData.position?.trim()) {
      setErrorMsg('Position / Role is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload: BoardMember = {
        id: memberToEdit?.id || `member-${Date.now()}`,
        name: formData.name.trim(),
        nameNp: formData.nameNp?.trim() || '',
        position: formData.position.trim(),
        positionNp: formData.positionNp?.trim() || '',
        email: formData.email?.trim() || '',
        phone: formData.phone?.trim() || '',
        linkedin: formData.linkedin?.trim() || '',
        bio: formData.bio?.trim() || '',
        bioNp: formData.bioNp?.trim() || '',
        imageUrl: formData.imageUrl || previewUrl,
        order: Number(formData.order) || nextOrder,
        isActive: formData.isActive !== false,
      };

      await onSave(payload, selectedFile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save board member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white border border-[#d8e3fb] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-[#111c2d]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#003c90] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold font-heading">
                {memberToEdit 
                  ? (isNp ? 'बोर्ड सदस्य सम्पादन गर्नुहोस्' : 'Edit Board Member') 
                  : (isNp ? 'नयाँ बोर्ड सदस्य थप्नुहोस्' : 'Add New Board Member')}
              </h2>
              <p className="text-[11px] text-white/80">
                {isNp 
                  ? 'सम्पर्क पृष्ठ (Contact Page) मा देखिने सञ्चालक समिति सदस्यको विवरण' 
                  : 'Manage leadership shown on the Contact page'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Live Circular Avatar Preview */}
          <div className="p-4 bg-[#f9f9ff] border border-[#d8e3fb] flex flex-col sm:flex-row items-center gap-5">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-[#003c90] bg-[#e7eeff] shrink-0">
              <img 
                src={previewUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                }}
              />
            </div>
            <div className="text-center sm:text-left flex-1">
              <span className="text-[10px] font-bold text-[#003c90] uppercase tracking-wider block mb-0.5">Live Preview on Contact Page</span>
              <h4 className="text-sm font-bold text-[#111c2d]">
                {formData.name || (isNp ? 'सदस्यको नाम' : 'Member Full Name')}
              </h4>
              <p className="text-xs text-[#00743a] font-semibold mt-0.5">
                {formData.position || (isNp ? 'पद / भूमिका' : 'Position / Role')}
              </p>
              <span className="text-[10px] text-[#737784] mt-1 block">
                Order #{formData.order} &bull; {formData.isActive ? 'Active' : 'Hidden'}
              </span>
            </div>
          </div>

          {/* Photo Upload & URL */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#111c2d]">
              Profile Photo (File Upload OR Image URL)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-8">
                <input
                  type="text"
                  placeholder="Paste Image URL (https://...)"
                  value={formData.imageUrl || ''}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#d8e3fb] focus:outline-hidden focus:border-[#003c90]"
                />
              </div>
              <div className="sm:col-span-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-3 py-2 text-xs border border-[#003c90] text-[#003c90] hover:bg-[#e7eeff] font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
              </div>
            </div>
          </div>

          {/* Names (English & Nepali) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111c2d] mb-1">
                Full Name (English) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Suman Yadav"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-[#d8e3fb] focus:outline-hidden focus:border-[#003c90]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#111c2d] mb-1">
                Full Name (Nepali - नेपाली)
              </label>
              <input
                type="text"
                placeholder="जस्तै: सुमन यादव"
                value={formData.nameNp || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, nameNp: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-[#d8e3fb] focus:outline-hidden focus:border-[#003c90]"
              />
            </div>
          </div>

          {/* Position / Role with Quick Suggestions */}
          <div>
            <label className="block text-xs font-bold text-[#111c2d] mb-1">
              Position / Role Suggestions:
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {POSITION_SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, position: sug.en, positionNp: sug.np }))}
                  className={`text-[10px] px-2 py-1 border transition-colors ${
                    formData.position === sug.en 
                      ? 'bg-[#003c90] text-white border-[#003c90]' 
                      : 'bg-[#f9f9ff] text-[#434653] border-[#d8e3fb] hover:border-[#003c90]'
                  }`}
                >
                  {sug.en}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111c2d] mb-1">
                  Position (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Founder & Chairperson"
                  value={formData.position || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-[#d8e3fb] focus:outline-hidden focus:border-[#003c90]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111c2d] mb-1">
                  Position (Nepali - नेपाली)
                </label>
                <input
                  type="text"
                  placeholder="जस्तै: संस्थापक तथा अध्यक्ष"
                  value={formData.positionNp || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, positionNp: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-[#d8e3fb] focus:outline-hidden focus:border-[#003c90]"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#111c2d] mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="member@genzicon.org"
                value={formData.email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-[#d8e3fb] focus:outline-hidden focus:border-[#003c90]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#111c2d] mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+977 9823000000"
                value={formData.phone || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-[#d8e3fb] focus:outline-hidden focus:border-[#003c90]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#111c2d] mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={formData.linkedin || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-[#d8e3fb] focus:outline-hidden focus:border-[#003c90]"
              />
            </div>
          </div>

          {/* Order and Active Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-[#111c2d] mb-1">
                Display Order Number
              </label>
              <input
                type="number"
                min="1"
                value={formData.order || 1}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 text-xs border border-[#d8e3fb] focus:outline-hidden focus:border-[#003c90]"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="is_member_active"
                checked={formData.isActive !== false}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 text-[#003c90] border-gray-300 rounded focus:ring-[#003c90]"
              />
              <label htmlFor="is_member_active" className="text-xs font-bold text-[#111c2d] cursor-pointer">
                Visible on Contact Page
              </label>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-3 bg-[#f9f9ff] border-t border-[#d8e3fb] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-bold border border-[#d8e3fb] text-[#434653] hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold bg-[#003c90] hover:bg-[#002660] text-white flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Saving Member...' : 'Save Member'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

