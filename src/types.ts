export type NavTab = 
  | 'impact' 
  | 'clothes-bank'
  | 'initiatives'
  | 'programs'
  | 'about' 
  | 'team' 
  | 'volunteer' 
  | 'donate' 
  | 'contact' 
  | 'admin'
  | 'projects'
  | 'gallery'
  | 'transparency'
  | 'news';

export type Language = 'en' | 'np';

export type Currency = 'NPR' | 'USD';

export interface ClothesDonor {
  id: string;
  name: string;
  nameNp?: string;
  location: string;
  locationNp?: string;
  itemsCount: number;
  clothesType: string;
  clothesTypeNp?: string;
  imageUrl?: string;
  note?: string;
  noteNp?: string;
  date: string;
  isVerified?: boolean;
  isFeatured?: boolean;
}

export interface ClothesDonationRequest {
  id: string;
  donorName: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  city: string;
  address: string;
  clothesType: 'winter' | 'summer' | 'kids' | 'blankets' | 'mixed';
  approxItemsCount: number;
  donationMode: 'doorstep_pickup' | 'dropoff_center';
  dropoffHub?: string;
  pickupDate?: string;
  notes?: string;
  date: string;
  status: 'Pending' | 'Scheduled' | 'Collected' | 'Distributed';
}

export interface ClothesAssistanceRequest {
  id: string;
  applicantName: string;
  organization?: string;
  phone: string;
  email?: string;
  province: string;
  district: string;
  locationDetails: string;
  beneficiaryCount: number;
  urgencyReason: 'winter_cold_wave' | 'flood_disaster' | 'orphanage_elderly' | 'marginalized_community' | 'remote_school';
  requiredTypes: string[];
  notes?: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Dispatched' | 'Completed';
}

export interface DropoffHub {
  id: string;
  name: string;
  nameNp: string;
  city: string;
  district: string;
  address: string;
  addressNp: string;
  phone: string;
  timing: string;
  timingNp: string;
}

export interface PillarData {
  id: 'clothes-bank' | 'clean-green-nepal' | 'skills-development';
  key: string;
  title: string;
  titleNp: string;
  subtitle: string;
  subtitleNp: string;
  badge: string;
  badgeNp: string;
  description: string;
  descriptionNp: string;
  highlights: string[];
  highlightsNp: string[];
  metrics: { value: string; label: string; labelNp: string }[];
  imageUrl: string;
}

export interface ProjectUpdate {
  date: string;
  title: string;
  titleNp?: string;
  description: string;
  descriptionNp?: string;
}

export interface Project {
  id: string;
  slug?: string;
  title: string;
  titleNp?: string;
  category: string;
  categoryNp?: string;
  categoryType: 'clean-energy' | 'water' | 'agriculture' | 'education' | 'healthcare' | 'relief' | 'infrastructure';
  description: string;
  descriptionNp?: string;
  fullDescription?: string;
  fullDescriptionNp?: string;
  status: 'Active' | 'Urgent' | 'Completed';
  fundedPercentage: number;
  goalAmountNpr: number;
  raisedAmountNpr: number;
  goalAmountUsd: number;
  raisedAmountUsd: number;
  donorCount?: number;
  location: string;
  locationNp?: string;
  beneficiaries: string;
  beneficiariesNp?: string;
  imageUrl: string;
  imageAlt: string;
  galleryImages?: string[];
  updates?: ProjectUpdate[];
}

export interface StatMetric {
  id: string;
  number: string;
  label: string;
  labelNp?: string;
  color: 'primary' | 'secondary';
  description?: string;
  descriptionNp?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  nameNp?: string;
  role: string;
  roleNp?: string;
  category: 'core' | 'advisor' | 'volunteer';
  bio: string;
  bioNp?: string;
  location: string;
  avatarUrl: string;
  phone?: string;
  email?: string;
  facebook?: string;
  linkedin?: string;
}

export interface GalleryMedia {
  id: string;
  title: string;
  titleNp?: string;
  category: 'Education' | 'Clean Water' | 'Healthcare' | 'Disaster Relief' | 'Agriculture & Environment';
  type: 'photo' | 'video';
  mediaUrl: string;
  thumbnailUrl: string;
  videoEmbedUrl?: string;
  location: string;
  date: string;
  description?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  titleNp?: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  summary?: string;
  summaryNp?: string;
  excerpt?: string;
  excerptNp?: string;
  content: string;
  contentNp?: string;
  imageUrl: string;
  isEvent?: boolean;
  eventDate?: string;
  eventLocation?: string;
}

export interface ExpenseLedgerItem {
  id: string;
  date: string;
  item: string;
  itemNp?: string;
  category: string;
  project: string;
  vendor: string;
  amountNpr: number;
  status: 'Verified' | 'Audited';
}

export interface AnnualAuditReport {
  id: string;
  fiscalYear: string;
  title: string;
  titleNp?: string;
  fileSize: string;
  auditor: string;
  totalIncomeNpr: number;
  totalExpenditureNpr: number;
}

export interface VolunteerFormData {
  fullName: string;
  email: string;
  phone: string;
  province: string;
  district: string;
  interest: string;
  availability: string;
  reason: string;
  experience?: string;
  agreeTerms?: boolean;
}

export interface VolunteerRecord extends VolunteerFormData {
  id: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Contacted';
  volunteerId: string;
}

export interface DonationSubmission {
  amount: number;
  currency: Currency;
  customAmount?: string;
  frequency: 'one-time' | 'monthly';
  paymentMethod: 'esewa' | 'khalti' | 'fonepay' | 'bank' | 'card';
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  projectId?: string;
  projectName?: string;
  address?: string;
  receiptNumber?: string;
  transactionRef?: string;
  date?: string;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  currency: Currency;
  frequency: 'one-time' | 'monthly';
  paymentMethod: 'esewa' | 'khalti' | 'fonepay' | 'bank' | 'card';
  projectName: string;
  date: string;
  receiptNumber: string;
  status: 'Verified' | 'Pending';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'New' | 'Replied' | 'Resolved';
}

export interface HeroSlideItem {
  id: string;
  title: string;
  titleNp?: string;
  subtitle: string;
  subtitleNp?: string;
  tag?: string;
  tagNp?: string;
  imageUrl: string;
}

export interface SiteContentConfig {
  heroImageUrl: string;
  heroCarouselImages?: string[];
  heroImages?: string[];
  heroSlides?: HeroSlideItem[];
  heroTitle: string;
  heroTitleNp: string;
  heroSubtitle: string;
  heroSubtitleNp: string;
  heroBannerTag: string;
  heroBannerTagNp: string;
  impactStats?: StatMetric[];
}

export interface BankAndQrConfig {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  swiftCode: string;
  fonepayMerchantName: string;
  fonepayQrImage: string;
  esewaId: string;
  esewaQrImage: string;
  khaltiId: string;
  khaltiQrImage: string;
  hotlinePhone: string;
  hotlineEmail: string;
}

export interface ClothesHubConfig {
  hubName: string;
  hubNameNp: string;
  address: string;
  addressNp: string;
  landmark: string;
  landmarkNp: string;
  city: string;
  district: string;
  province: string;
  phone1: string;
  phone2: string;
  email?: string;
  operatingHours: string;
  operatingHoursNp: string;
  mapEmbedUrl: string;
  googleMapsDirectionsUrl: string;
  contactNote: string;
  contactNoteNp: string;
}

