import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Film, 
  Save, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { FilmstripScene, Language } from '../../types';

interface AdminFilmstripModalProps {
  isOpen: boolean;
  onClose: () => void;
  sceneToEdit: FilmstripScene | null;
  onSave: (scene: FilmstripScene, file?: File) => Promise<void>;
  language: Language;
  nextSceneIndex?: number;
}

export const AdminFilmstripModal: React.FC<AdminFilmstripModalProps> = ({
  isOpen,
  onClose,
  sceneToEdit,
  onSave,
  language,
  nextSceneIndex = 1
}) => {
  const isNp = language === 'np';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<FilmstripScene>>({
    sceneNumber: `SCENE ${String(nextSceneIndex).padStart(2, '0')}`,
    frameCode: String(12 + nextSceneIndex),
    title: '',
    titleNp: '',
    category: 'Ground Work',
    categoryNp: 'मैदानी अभियान',
    location: 'Kathmandu, Nepal',
    locationNp: 'काठमाडौँ, नेपाल',
    date: '2024',
    dateNp: '२०८१',
    description: '',
    descriptionNp: '',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1400&q=85',
    quote: '',
    quoteNp: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (sceneToEdit) {
      setFormData({ ...sceneToEdit });
      setPreviewUrl(sceneToEdit.imageUrl);
      setSelectedFile(undefined);
    } else {
      const defaultImg = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1400&q=85';
      setFormData({
        sceneNumber: `SCENE ${String(nextSceneIndex).padStart(2, '0')}`,
        frameCode: String(12 + nextSceneIndex),
        title: '',
        titleNp: '',
        category: 'Clothes Bank Nepal',
        categoryNp: 'कपडा बैंक नेपाल',
        location: 'Central Hub, Kathmandu',
        locationNp: 'केन्द्रीय संकलन केन्द्र, काठमाडौँ',
        date: '2024',
        dateNp: '२०८१',
        description: '',
        descriptionNp: '',
        imageUrl: defaultImg,
        quote: '',
        quoteNp: ''
      });
      setPreviewUrl(defaultImg);
      setSelectedFile(undefined);
    }
    setErrorMsg('');
  }, [sceneToEdit, nextSceneIndex, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objUrl = URL.createObjectURL(file);
      setPreviewUrl(objUrl);
      setFormData(prev => ({ ...prev, imageUrl: objUrl }));
    }
  };

  const handleUrlChange = (url: string) => {
    setSelectedFile(undefined);
    setPreviewUrl(url);
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setErrorMsg(isNp ? 'कृपया शीर्षक प्रविष्ट गर्नुहोस्' : 'Please enter a scene title.');
      return;
    }
    if (!formData.imageUrl?.trim() && !selectedFile) {
      setErrorMsg(isNp ? 'कृपया तस्विर चयन गर्नुहोस्' : 'Please provide an image URL or upload a file.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const scenePayload: FilmstripScene = {
        id: sceneToEdit?.id || `scene-${Date.now()}`,
        sceneNumber: formData.sceneNumber || `SCENE 01`,
        frameCode: formData.frameCode || '16',
        title: formData.title || '',
        titleNp: formData.titleNp || formData.title || '',
        category: formData.category || 'Ground Work',
        categoryNp: formData.categoryNp || formData.category || '',
        location: formData.location || 'Nepal',
        locationNp: formData.locationNp || formData.location || '',
        date: formData.date || '2024',
        dateNp: formData.dateNp || formData.date || '',
        description: formData.description || '',
        descriptionNp: formData.descriptionNp || formData.description || '',
        imageUrl: formData.imageUrl || '',
        quote: formData.quote || '',
        quoteNp: formData.quoteNp || formData.quote || ''
      };

      await onSave(scenePayload, selectedFile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving scene. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        className="bg-[#0b0f19] border border-white/20 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl text-white flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0b0f19] z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                {sceneToEdit 
                  ? (isNp ? 'फिल्मसिट दृश्य सम्पादन' : 'Edit Filmstrip Scene') 
                  : (isNp ? 'नयाँ फिल्मसिट दृश्य थप्नुहोस्' : 'Add New Filmstrip Scene')}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isNp ? '३५ एमएम रीलमा देखिने तस्विर तथा विवरण व्यवस्थापन' : 'Configure 35mm film reel photo frame & grassroots story'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          
          {errorMsg && (
            <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl flex items-center gap-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Live 35mm Film Mockup Preview */}
          <div>
            <label className="block text-xs font-mono text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>{isNp ? 'लाइभ ३५ एमएम रील पूर्वावलोकन' : 'Live 35mm Filmstrip Preview'}</span>
            </label>
            <div className="w-full bg-[#05070d] rounded-xl border border-white/15 overflow-hidden shadow-inner flex flex-col items-center">
              {/* Top Sprocket holes */}
              <div className="w-full bg-[#0b0f19] border-b border-white/10 px-3 py-1.5 flex items-center justify-around">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-3 h-4 rounded-[2px] bg-white/80" />
                    <span className="font-mono text-[8px] font-bold text-amber-400/80">
                      {formData.frameCode || '16'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Photo Frame */}
              <div className="w-full sm:w-[70%] h-44 sm:h-52 relative overflow-hidden bg-black flex items-center justify-center my-2 rounded-lg border border-white/20">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="text-center text-slate-500 text-xs">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span>No image preview</span>
                  </div>
                )}
                
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                
                {/* Top Badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-white/20 text-white font-mono text-[10px] font-bold">
                  {formData.sceneNumber || 'SCENE 01'}
                </div>

                {/* Bottom Title */}
                <div className="absolute bottom-2 inset-x-2 text-left pointer-events-none">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500 text-black inline-block mb-1">
                    {formData.category || 'Category'}
                  </span>
                  <div className="text-xs font-bold text-white truncate drop-shadow">
                    {formData.title || 'Scene Title Preview'}
                  </div>
                  <div className="text-[10px] text-white/80 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                    <span>{formData.location || 'Location'}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Sprocket holes */}
              <div className="w-full bg-[#0b0f19] border-t border-white/10 px-3 py-1.5 flex items-center justify-around">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-3 h-4 rounded-[2px] bg-white/80" />
                    <span className="font-mono text-[8px] font-bold text-amber-400/80">
                      {formData.frameCode || '16'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Scene Number */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                {isNp ? 'दृश्य संकेत (Scene Number)' : 'Scene Badge Code'}
              </label>
              <input
                type="text"
                value={formData.sceneNumber || ''}
                onChange={(e) => setFormData({ ...formData, sceneNumber: e.target.value })}
                placeholder="e.g. SCENE 01"
                className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-lg text-sm text-white font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Frame Code */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                {isNp ? 'रील फ्रेम नम्बर (Frame Number)' : 'Negative Frame Number'}
              </label>
              <input
                type="text"
                value={formData.frameCode || ''}
                onChange={(e) => setFormData({ ...formData, frameCode: e.target.value })}
                placeholder="e.g. 14, 15, 16"
                className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-lg text-sm text-white font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Title (English) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isNp ? 'शीर्षक (अंग्रेजी)' : 'Scene Title (English) *'}
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Free Clothes Bank Distribution in Musahar Settlement"
                className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-lg text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Title (Nepali) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isNp ? 'शीर्षक (नेपाली)' : 'Scene Title (Nepali)'}
              </label>
              <input
                type="text"
                value={formData.titleNp || ''}
                onChange={(e) => setFormData({ ...formData, titleNp: e.target.value })}
                placeholder="उदा. मुसहर बस्तीमा कपडा बैंक निःशुल्क वितरण महाअभियान"
                className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-lg text-sm text-white focus:border-amber-400 focus:outline-none font-medium"
              />
            </div>

            {/* Category (English & Nepali) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isNp ? 'वर्ग (English)' : 'Category (English)'}
              </label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Clothes Bank Nepal / Green Nepal"
                className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-lg text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isNp ? 'वर्ग (नेपाली)' : 'Category (Nepali)'}
              </label>
              <input
                type="text"
                value={formData.categoryNp || ''}
                onChange={(e) => setFormData({ ...formData, categoryNp: e.target.value })}
                placeholder="उदा. कपडा बैंक नेपाल / हरित नेपाल"
                className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-lg text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Location (English & Nepali) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isNp ? 'स्थान (English)' : 'Location (English)'}
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Hansapur, Dhanusha"
                className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-lg text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isNp ? 'स्थान (नेपाली)' : 'Location (Nepali)'}
              </label>
              <input
                type="text"
                value={formData.locationNp || ''}
                onChange={(e) => setFormData({ ...formData, locationNp: e.target.value })}
                placeholder="उदा. हंसपुर, धनुषा"
                className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-lg text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Date / Season */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isNp ? 'मिति / मौसम (English)' : 'Date / Season (English)'}
              </label>
              <input
                type="text"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="e.g. Autumn 2024"
                className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-lg text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isNp ? 'मिति / मौसम (नेपाली)' : 'Date / Season (Nepali)'}
              </label>
              <input
                type="text"
                value={formData.dateNp || ''}
                onChange={(e) => setFormData({ ...formData, dateNp: e.target.value })}
                placeholder="उदा. शरद ऋतु २०८१"
                className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-lg text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Description (English) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isNp ? 'विवरण (English)' : 'Description (English)'}
              </label>
              <textarea
                rows={2}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Explain the grassroots field impact, community participation, or relief distributed..."
                className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-lg text-sm text-white focus:border-amber-400 focus:outline-none resize-none"
              />
            </div>

            {/* Description (Nepali) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isNp ? 'विवरण (नेपाली)' : 'Description (Nepali)'}
              </label>
              <textarea
                rows={2}
                value={formData.descriptionNp || ''}
                onChange={(e) => setFormData({ ...formData, descriptionNp: e.target.value })}
                placeholder="समुदायमा पुगेको प्रत्यक्ष सहयोग, स्वयंसेवक परिचालन तथा प्रभावको विवरण..."
                className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-lg text-sm text-white focus:border-amber-400 focus:outline-none resize-none"
              />
            </div>

            {/* Image URL & File Upload */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                {isNp ? 'तस्विर चयन (Image URL वा फाइल अपलोड) *' : 'Scene Photo (File Upload OR Image URL) *'}
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={formData.imageUrl || ''}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="Paste high-resolution image URL (e.g. https://...)"
                  className="flex-1 px-3 py-2 bg-slate-900 border border-white/15 rounded-lg text-sm text-white font-mono focus:border-amber-400 focus:outline-none"
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-1.5 transition-colors shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isNp ? 'फाइल छान्नुहोस्' : 'Upload File'}</span>
                </button>
              </div>

              {selectedFile && (
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Selected file: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>

          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0 bg-[#0b0f19] z-20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              {isNp ? 'रद्द गर्नुहोस्' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-lg active:scale-95 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? (isNp ? 'सुरक्षित गर्दै...' : 'Saving...') : (isNp ? 'सुरक्षित गर्नुहोस्' : 'Save Scene')}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

