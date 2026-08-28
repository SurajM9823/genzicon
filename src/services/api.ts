// Django REST Framework API Client for Genzicon Foundation
import { Project, ClothesHubConfig } from '../types';

const API_BASE = (typeof window !== 'undefined' && (window as any).VITE_API_URL) 
  ? (window as any).VITE_API_URL 
  : '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('genzicon_admin_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  return headers;
}

// --------------------------------------------------------------------------
// 1. Authentication
// --------------------------------------------------------------------------
export async function apiAdminLogin(usernameOrEmail: string, password: string) {
  try {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameOrEmail, password }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Authentication failed');
    }
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('genzicon_admin_token', data.token);
      localStorage.setItem('genzicon_admin_auth', 'true');
    }
    return data;
  } catch (error: any) {
    console.warn('API login request error:', error.message);
    throw error;
  }
}

export function apiAdminLogout() {
  localStorage.removeItem('genzicon_admin_token');
  localStorage.removeItem('genzicon_admin_auth');
}

// --------------------------------------------------------------------------
// 2. Dashboard Analytics & Summary
// --------------------------------------------------------------------------
export async function apiGetDashboardOverview() {
  try {
    const res = await fetch(`${API_BASE}/dashboard/overview/`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Could not fetch live dashboard overview:', e);
  }
  return null;
}

// --------------------------------------------------------------------------
// 3. Site Content & Hero CMS
// --------------------------------------------------------------------------
export async function apiGetSiteContent() {
  try {
    const res = await fetch(`${API_BASE}/site-content/current/`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      const impactStats = Array.isArray(data.impact_stats) && data.impact_stats.length > 0
        ? data.impact_stats.map((s: any) => ({
            id: s.id || s.stat_id,
            number: s.number,
            label: s.label,
            labelNp: s.labelNp || s.label_np || '',
            description: s.description || '',
            descriptionNp: s.descriptionNp || s.description_np || '',
            color: s.color || 'primary',
          }))
        : undefined;

      return {
        heroTitle: data.hero_title || '',
        heroTitleNp: data.hero_title_np || '',
        heroSubtitle: data.hero_subtitle || '',
        heroSubtitleNp: data.hero_subtitle_np || '',
        heroImageUrl: data.hero_image_url || '',
        heroImages: Array.isArray(data.hero_images) ? data.hero_images : [data.hero_image_url],
        heroSlides: Array.isArray(data.hero_slides) ? data.hero_slides : undefined,
        heroBannerTag: data.hero_banner_tag || '',
        heroBannerTagNp: data.hero_banner_tag_np || '',
        impactStats,
      };
    } else {
      // Fallback: try listing /site-content/
      const listRes = await fetch(`${API_BASE}/site-content/`, {
        headers: getAuthHeaders(),
      });
      if (listRes.ok) {
        const listData = await listRes.json();
        const items = Array.isArray(listData) ? listData : (listData.results || []);
        if (items.length > 0) {
          const slides = items.map((item: any) => ({
            id: `slide-${item.id}`,
            title: item.hero_title,
            titleNp: item.hero_title_np,
            subtitle: item.hero_subtitle,
            subtitleNp: item.hero_subtitle_np,
            tag: item.hero_banner_tag,
            tagNp: item.hero_banner_tag_np,
            imageUrl: item.final_image_url || item.hero_image || item.hero_image_url,
          }));
          const first = items[0];
          return {
            heroTitle: first.hero_title,
            heroTitleNp: first.hero_title_np,
            heroSubtitle: first.hero_subtitle,
            heroSubtitleNp: first.hero_subtitle_np,
            heroImageUrl: first.final_image_url || first.hero_image || first.hero_image_url,
            heroImages: slides.map((s: any) => s.imageUrl),
            heroSlides: slides,
            heroBannerTag: first.hero_banner_tag,
            heroBannerTagNp: first.hero_banner_tag_np,
          };
        }
      }
    }
  } catch (e) {
    console.warn('Could not fetch live site content:', e);
  }
  return null;
}

export async function apiUpdateSiteContent(id: number = 1, content: any) {
  try {
    const payload = {
      hero_title: content.heroTitle,
      hero_title_np: content.heroTitleNp,
      hero_subtitle: content.heroSubtitle,
      hero_subtitle_np: content.heroSubtitleNp,
      hero_image_url: content.heroImageUrl,
      hero_banner_tag: content.heroBannerTag,
      hero_banner_tag_np: content.heroBannerTagNp,
    };
    const res = await fetch(`${API_BASE}/site-content/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Could not update site content:', e);
  }
  return null;
}

export async function apiGetImpactStats() {
  try {
    const res = await fetch(`${API_BASE}/impact-stats/`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.results || []);
      if (items.length > 0) {
        return items.map((s: any) => ({
          id: s.stat_id || s.id,
          number: s.number,
          label: s.label,
          labelNp: s.label_np || s.labelNp || '',
          description: s.description || '',
          descriptionNp: s.description_np || s.descriptionNp || '',
          color: s.color || 'primary',
          order: s.order || 0,
        }));
      }
    }
  } catch (e) {
    console.warn('Could not fetch impact stats:', e);
  }
  return null;
}

export async function apiSaveImpactStats(stats: any[]) {
  try {
    const payload = {
      stats: stats.map((s, idx) => ({
        id: s.id,
        stat_id: s.id,
        number: s.number,
        label: s.label,
        label_np: s.labelNp || s.label_np || '',
        description: s.description || '',
        description_np: s.descriptionNp || s.description_np || '',
        color: s.color || 'primary',
        order: idx + 1,
      })),
    };
    const res = await fetch(`${API_BASE}/impact-stats/bulk_save/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Could not save impact stats to backend:', e);
  }
  return null;
}

// --------------------------------------------------------------------------
// 4. Ground Programs & Projects
// --------------------------------------------------------------------------
export function formatProjectFromBackend(p: any): Project {
  const goalNpr = Number(p.target_amount) || 0;
  const raisedNpr = Number(p.raised_amount) || 0;
  const fundedPct = goalNpr > 0 ? Math.min(100, Math.round((raisedNpr / goalNpr) * 100)) : 0;
  
  return {
    id: String(p.id),
    slug: p.slug || `program-${p.id}`,
    title: p.title,
    titleNp: p.title_np || p.title,
    category: p.category || 'Field Initiative',
    categoryNp: p.category_np || p.category,
    categoryType: p.category?.toLowerCase().includes('clean') ? 'agriculture' : (p.category?.toLowerCase().includes('skill') ? 'education' : 'relief'),
    description: p.description || '',
    descriptionNp: p.description_np || p.description || '',
    fullDescription: p.full_description || p.description || '',
    fullDescriptionNp: p.full_description_np || p.description_np || '',
    status: p.status || 'Active',
    fundedPercentage: p.progress_percentage || fundedPct,
    goalAmountNpr: goalNpr,
    raisedAmountNpr: raisedNpr,
    goalAmountUsd: Math.round(goalNpr / 133),
    raisedAmountUsd: Math.round(raisedNpr / 133),
    donorCount: Number(p.donor_count) || (raisedNpr > 0 ? Math.max(1, Math.round(raisedNpr / 4500)) : 0),
    location: p.province ? `${p.district}, ${p.province}` : (p.district || 'Nepal'),
    beneficiaries: p.beneficiaries_count || '1,000+ Citizens',
    imageUrl: p.image_url || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200',
    imageAlt: p.title || 'Field Program',
  };
}

export async function apiGetProjects(): Promise<Project[] | null> {
  try {
    const res = await fetch(`${API_BASE}/projects/`);
    if (res.ok) {
      const data = await res.json();
      const results = Array.isArray(data) ? data : (data.results || []);
      if (results.length > 0) {
        return results.map(formatProjectFromBackend);
      }
    }
  } catch (e) {
    console.warn('Could not fetch live projects from backend:', e);
  }
  return null;
}

export async function apiGetProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API_BASE}/projects/by_slug/?slug=${encodeURIComponent(slug)}`);
    if (res.ok) {
      const data = await res.json();
      return formatProjectFromBackend(data);
    }
  } catch (e) {
    console.warn(`Could not fetch project with slug ${slug}:`, e);
  }
  return null;
}

export async function apiCreateProject(projectData: Partial<Project>) {
  try {
    const locParts = (projectData.location || 'Kathmandu, Bagmati').split(',');
    const payload = {
      slug: projectData.slug || undefined,
      title: projectData.title,
      title_np: projectData.titleNp || projectData.title,
      category: projectData.category || 'Clothes Bank Nepal',
      category_np: projectData.categoryNp || projectData.category,
      district: locParts[0]?.trim() || 'Kathmandu',
      province: locParts[1]?.trim() || 'Bagmati Province',
      status: projectData.status || 'Active',
      target_amount: projectData.goalAmountNpr || 500000,
      raised_amount: projectData.raisedAmountNpr || 0,
      donor_count: projectData.donorCount || 0,
      beneficiaries_count: projectData.beneficiaries || '1,000+ Citizens',
      image_url: projectData.imageUrl || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200',
      description: projectData.description || '',
      description_np: projectData.descriptionNp || projectData.description || '',
      full_description: projectData.fullDescription || projectData.description || '',
      full_description_np: projectData.fullDescriptionNp || projectData.descriptionNp || '',
      is_featured: true,
    };
    const res = await fetch(`${API_BASE}/projects/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Could not create project on backend:', e);
  }
  return null;
}

export async function apiUpdateProject(id: string | number, projectData: Partial<Project>) {
  try {
    const locParts = (projectData.location || '').split(',');
    const payload: any = {};
    if (projectData.title !== undefined) payload.title = projectData.title;
    if (projectData.titleNp !== undefined) payload.title_np = projectData.titleNp;
    if (projectData.slug !== undefined) payload.slug = projectData.slug;
    if (projectData.category !== undefined) payload.category = projectData.category;
    if (projectData.categoryNp !== undefined) payload.category_np = projectData.categoryNp;
    if (projectData.status !== undefined) payload.status = projectData.status;
    if (projectData.goalAmountNpr !== undefined) payload.target_amount = projectData.goalAmountNpr;
    if (projectData.raisedAmountNpr !== undefined) payload.raised_amount = projectData.raisedAmountNpr;
    if (projectData.donorCount !== undefined) payload.donor_count = projectData.donorCount;
    if (projectData.beneficiaries !== undefined) payload.beneficiaries_count = projectData.beneficiaries;
    if (projectData.imageUrl !== undefined) payload.image_url = projectData.imageUrl;
    if (projectData.description !== undefined) payload.description = projectData.description;
    if (projectData.descriptionNp !== undefined) payload.description_np = projectData.descriptionNp;
    if (projectData.fullDescription !== undefined) payload.full_description = projectData.fullDescription;
    if (projectData.fullDescriptionNp !== undefined) payload.full_description_np = projectData.fullDescriptionNp;
    if (locParts.length > 0 && locParts[0].trim()) payload.district = locParts[0].trim();
    if (locParts.length > 1 && locParts[1].trim()) payload.province = locParts[1].trim();

    const res = await fetch(`${API_BASE}/projects/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn(`Could not update project ${id}:`, e);
  }
  return null;
}

export async function apiAdjustProjectDonations(id: string | number, data: { add_amount?: number; set_raised?: number; set_goal?: number; add_donors?: number; set_donors?: number }) {
  try {
    const res = await fetch(`${API_BASE}/projects/${id}/adjust_donation/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn(`Could not adjust donation for project ${id}:`, e);
  }
  return null;
}

export async function apiDeleteProject(id: string | number) {
  try {
    const res = await fetch(`${API_BASE}/projects/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  } catch (e) {
    console.warn('Could not delete project:', e);
    return false;
  }
}

// --------------------------------------------------------------------------
// 5. Clothes Bank Nepal: Donors Showcase & Donation Submissions
// --------------------------------------------------------------------------
export async function apiGetClothesDonors() {
  try {
    const res = await fetch(`${API_BASE}/clothes-donors/`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      const results = Array.isArray(data) ? data : data.results || [];
      return results.map((d: any) => ({
        id: String(d.id),
        name: d.name,
        nameNp: d.name_np || '',
        location: d.location || 'Kathmandu',
        locationNp: d.location_np || '',
        itemsCount: d.items_count || 0,
        clothesType: d.clothes_type || 'Winter Wear',
        clothesTypeNp: d.clothes_type_np || '',
        imageUrl: d.final_image_url || d.donor_image || d.image_url || '',
        note: d.note || '',
        noteNp: d.note_np || '',
        date: d.date || (d.created_at ? d.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
        isVerified: d.is_verified ?? true,
        isFeatured: d.is_featured ?? true,
      }));
    }
  } catch (e) {
    console.warn('Could not fetch clothes donors from backend:', e);
  }
  return null;
}

export async function apiCreateClothesDonor(data: {
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
  date?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
}) {
  try {
    const payload = {
      name: data.name,
      name_np: data.nameNp || '',
      location: data.location,
      location_np: data.locationNp || '',
      items_count: data.itemsCount,
      clothes_type: data.clothesType,
      clothes_type_np: data.clothesTypeNp || '',
      image_url: data.imageUrl || '',
      note: data.note || '',
      note_np: data.noteNp || '',
      date: data.date || new Date().toISOString().split('T')[0],
      is_verified: data.isVerified ?? true,
      is_featured: data.isFeatured ?? true,
    };
    const res = await fetch(`${API_BASE}/clothes-donors/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Could not create clothes donor on backend:', e);
  }
  return null;
}

export async function apiUpdateClothesDonor(id: string | number, data: Partial<{
  name: string;
  nameNp: string;
  location: string;
  locationNp: string;
  itemsCount: number;
  clothesType: string;
  clothesTypeNp: string;
  imageUrl: string;
  note: string;
  noteNp: string;
  date: string;
  isVerified: boolean;
  isFeatured: boolean;
}>) {
  try {
    const payload: any = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.nameNp !== undefined) payload.name_np = data.nameNp;
    if (data.location !== undefined) payload.location = data.location;
    if (data.locationNp !== undefined) payload.location_np = data.locationNp;
    if (data.itemsCount !== undefined) payload.items_count = data.itemsCount;
    if (data.clothesType !== undefined) payload.clothes_type = data.clothesType;
    if (data.clothesTypeNp !== undefined) payload.clothes_type_np = data.clothesTypeNp;
    if (data.imageUrl !== undefined) payload.image_url = data.imageUrl;
    if (data.note !== undefined) payload.note = data.note;
    if (data.noteNp !== undefined) payload.note_np = data.noteNp;
    if (data.date !== undefined) payload.date = data.date;
    if (data.isVerified !== undefined) payload.is_verified = data.isVerified;
    if (data.isFeatured !== undefined) payload.is_featured = data.isFeatured;

    const res = await fetch(`${API_BASE}/clothes-donors/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (e) {
    console.warn('Could not update clothes donor on backend:', e);
    return false;
  }
}

export async function apiDeleteClothesDonor(id: string | number) {
  try {
    const res = await fetch(`${API_BASE}/clothes-donors/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  } catch (e) {
    console.warn('Could not delete clothes donor on backend:', e);
    return false;
  }
}

export async function apiSubmitClothesDonation(data: {
  donorName: string;
  phone: string;
  email?: string;
  province: string;
  district: string;
  city?: string;
  address: string;
  clothesType: string;
  approxItemsCount: number;
  donationMode: string;
  pickupDate?: string;
  dropoffHub?: string;
  notes?: string;
}) {
  const fallbackRefId = `CBN-${Math.floor(10000 + Math.random() * 90000)}`;
  try {
    // Map frontend donation modes to Django model choices
    let backendMode = 'dropoff_hub';
    if (data.donationMode === 'self_dropoff' || data.donationMode === 'dropoff_hub') {
      backendMode = 'dropoff_hub';
    } else if (data.donationMode === 'courier_parcel' || data.donationMode === 'pathao_rider') {
      backendMode = 'courier_parcel';
    } else if (data.donationMode === 'doorstep_pickup') {
      backendMode = 'doorstep_pickup';
    }

    const payload: Record<string, any> = {
      donor_name: data.donorName,
      phone: data.phone,
      province: data.province,
      district: data.district,
      city: data.city || '',
      address: data.address,
      clothes_type: data.clothesType,
      approx_items_count: Number(data.approxItemsCount) || 10,
      donation_mode: backendMode,
      dropoff_hub: data.dropoffHub || 'Genzicon Central Hub, Tinkune, Kathmandu',
      notes: data.notes || '',
    };

    if (data.email && data.email.trim()) {
      payload.email = data.email.trim();
    }
    if (data.pickupDate && data.pickupDate.trim()) {
      payload.pickup_date = data.pickupDate.trim();
    }

    const res = await fetch(`${API_BASE}/clothes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const json = await res.json();
        return {
          id: json.ref_id || (json.id ? String(json.id) : fallbackRefId),
          ref_id: json.ref_id || fallbackRefId,
          ...json
        };
      }
    } else {
      const errText = await res.text();
      console.warn('Backend rejected clothes donation:', res.status, errText);
    }
  } catch (e) {
    console.warn('Failed to submit clothes donation to live API (using local persistence):', e);
  }
  return {
    id: fallbackRefId,
    ref_id: fallbackRefId,
  };
}

export async function apiGetClothesDonations() {
  try {
    const res = await fetch(`${API_BASE}/clothes/`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        const results = Array.isArray(data) ? data : data.results || [];
        if (results.length > 0) {
          return results.map((c: any) => ({
            id: String(c.ref_id || c.id),
            refId: c.ref_id || String(c.id),
            donorName: c.donor_name,
            phone: c.phone,
            email: c.email || '',
            province: c.province,
            district: c.district,
            city: c.city || '',
            address: c.address,
            clothesType: c.clothes_type,
            approxItemsCount: c.approx_items_count,
            donationMode: c.donation_mode,
            pickupDate: c.pickup_date || '',
            dropoffHub: c.dropoff_hub || '',
            notes: c.notes || '',
            date: c.created_at ? c.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            status: c.status || 'Pending',
          }));
        }
      }
    }
  } catch (e) {
    console.warn('Could not fetch clothes donations from backend, falling back to local storage:', e);
  }
  return null;
}

export async function apiUpdateClothesStatus(id: string | number, status: string) {
  try {
    const res = await fetch(`${API_BASE}/clothes/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch (e) {
    console.warn('Could not update clothes status:', e);
    return false;
  }
}

// --------------------------------------------------------------------------
// 5.1 Central Clothes Hub Dynamic Configuration & Map Embed Parser
// --------------------------------------------------------------------------
/**
 * Safely extracts or normalizes a Google Maps embed URL from various user input formats:
 * 1. Full <iframe> embed code: <iframe src="https://www.google.com/maps/embed?..." ...></iframe>
 * 2. Raw embed URL: https://www.google.com/maps/embed?...
 * 3. Regular Google Maps search/place URL: https://maps.google.com/?q=... -> https://maps.google.com/maps?q=...&output=embed
 * 4. Standard OpenStreetMap or custom embed URL
 */
export function getCleanMapEmbedUrl(rawInput?: string): string {
  const fallback = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14130.857353982845!2d85.3400!3d27.6890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1997d4a46083%3A0x6b4502d99d14631e!2sTinkune%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp';
  if (!rawInput || typeof rawInput !== 'string' || !rawInput.trim()) {
    return fallback;
  }

  const trimmed = rawInput.trim();

  // If user pasted full <iframe ... src="..." ...> tag
  if (trimmed.toLowerCase().includes('<iframe')) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }

  // If it's already an embed link (Google Maps embed or OSM embed)
  if (trimmed.includes('/maps/embed') || trimmed.includes('output=embed')) {
    return trimmed;
  }

  // If it's a standard Google Maps URL with ?q= or /place/
  if (trimmed.includes('google.com/maps') || trimmed.includes('maps.google.com')) {
    try {
      const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      const q = url.searchParams.get('q');
      if (q) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }
      const placeMatch = trimmed.match(/maps\/(?:place|search)\/([^/@?]+)/i);
      if (placeMatch && placeMatch[1]) {
        const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
        return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }
    } catch {
      // ignore
    }
  }

  return trimmed;
}

export async function apiGetClothesHubConfig(): Promise<ClothesHubConfig | null> {
  try {
    const res = await fetch(`${API_BASE}/clothes-hub-config/`);
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        const item = Array.isArray(data) ? (data[0] || null) : data;
        if (item && (item.hub_name || item.hubName || item.phone1)) {
          return {
            hubName: item.hub_name || item.hubName,
            hubNameNp: item.hub_name_np || item.hubNameNp || '',
            address: item.address,
            addressNp: item.address_np || item.addressNp || '',
            landmark: item.landmark || '',
            landmarkNp: item.landmark_np || item.landmarkNp || '',
            city: item.city || 'Kathmandu',
            district: item.district || 'Kathmandu',
            province: item.province || 'Bagmati Province',
            phone1: item.phone1,
            phone2: item.phone2 || '',
            email: item.email || '',
            operatingHours: item.operating_hours || item.operatingHours || '',
            operatingHoursNp: item.operating_hours_np || item.operatingHoursNp || '',
            mapEmbedUrl: item.map_embed_url || item.mapEmbedUrl || '',
            googleMapsDirectionsUrl: item.google_maps_directions_url || item.googleMapsDirectionsUrl || '',
            contactNote: item.contact_note || item.contactNote || '',
            contactNoteNp: item.contact_note_np || item.contactNoteNp || '',
          };
        }
      }
    }
  } catch (e) {
    console.warn('Could not fetch clothes hub config from backend:', e);
  }
  return null;
}

export async function apiSaveClothesHubConfig(config: ClothesHubConfig): Promise<boolean> {
  try {
    const payload = {
      hub_name: config.hubName,
      hub_name_np: config.hubNameNp,
      address: config.address,
      address_np: config.addressNp,
      landmark: config.landmark,
      landmark_np: config.landmarkNp,
      city: config.city,
      district: config.district,
      province: config.province,
      phone1: config.phone1,
      phone2: config.phone2,
      email: config.email || '',
      operating_hours: config.operatingHours,
      operating_hours_np: config.operatingHoursNp,
      map_embed_url: config.mapEmbedUrl,
      google_maps_directions_url: config.googleMapsDirectionsUrl,
      contact_note: config.contactNote,
      contact_note_np: config.contactNoteNp,
    };
    const res = await fetch(`${API_BASE}/clothes-hub-config/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (e) {
    console.warn('Could not save clothes hub config to backend:', e);
    return false;
  }
}

// --------------------------------------------------------------------------
// 6. Youth Volunteer Registrations
// --------------------------------------------------------------------------
export async function apiSubmitVolunteer(data: {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  interest: string;
  availability: string;
  skills?: string;
}) {
  try {
    const payload = {
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      province: data.province,
      district: data.district,
      interest: data.interest,
      availability: data.availability,
      skills: data.skills || '',
    };
    const res = await fetch(`${API_BASE}/volunteers/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Failed to submit volunteer registration:', e);
  }
  return null;
}

export async function apiGetVolunteers() {
  try {
    const res = await fetch(`${API_BASE}/volunteers/`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      const results = Array.isArray(data) ? data : data.results || [];
      return results.map((v: any) => ({
        id: String(v.id),
        volunteerId: v.volunteer_id,
        fullName: v.full_name,
        phone: v.phone,
        email: v.email,
        province: v.province,
        district: v.district,
        interest: v.interest,
        availability: v.availability,
        reason: v.skills || 'Youth volunteer civic contribution',
        experience: '',
        submittedAt: v.created_at ? v.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        status: v.status,
      }));
    }
  } catch (e) {
    console.warn('Could not fetch volunteers from backend:', e);
  }
  return null;
}

export async function apiUpdateVolunteerStatus(id: string | number, status: string) {
  try {
    const res = await fetch(`${API_BASE}/volunteers/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch (e) {
    console.warn('Could not update volunteer status:', e);
    return false;
  }
}

// --------------------------------------------------------------------------
// 7. Donations & Financial Records
// --------------------------------------------------------------------------
export async function apiSubmitDonation(data: {
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  amount: number;
  currency?: string;
  projectName?: string;
  paymentMethod: string;
  frequency?: string;
}) {
  try {
    const payload = {
      donor_name: data.donorName,
      donor_email: data.donorEmail || '',
      donor_phone: data.donorPhone || '',
      amount: data.amount,
      currency: data.currency || 'NPR',
      project_name: data.projectName || 'General Fund',
      payment_method: data.paymentMethod,
      frequency: data.frequency || 'one-time',
    };
    const res = await fetch(`${API_BASE}/donations/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Failed to submit donation record to backend:', e);
  }
  return null;
}

export async function apiGetDonations() {
  try {
    const res = await fetch(`${API_BASE}/donations/`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      const results = Array.isArray(data) ? data : data.results || [];
      return results.map((d: any) => ({
        id: String(d.id),
        receiptNumber: d.receipt_number,
        donorName: d.donor_name,
        donorEmail: d.donor_email || '',
        donorPhone: d.donor_phone || '',
        amount: Number(d.amount),
        currency: d.currency || 'NPR',
        frequency: d.frequency || 'one-time',
        paymentMethod: d.payment_method,
        projectName: d.project_name || 'General Fund',
        date: d.created_at ? d.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        status: d.status,
      }));
    }
  } catch (e) {
    console.warn('Could not fetch donations from backend:', e);
  }
  return null;
}

export async function apiUpdateDonationStatus(id: string | number, status: string) {
  try {
    const res = await fetch(`${API_BASE}/donations/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch (e) {
    console.warn('Could not update donation status:', e);
    return false;
  }
}

// --------------------------------------------------------------------------
// 8. Contact Inquiries
// --------------------------------------------------------------------------
export async function apiSubmitContact(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  try {
    const res = await fetch(`${API_BASE}/contacts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Failed to submit contact inquiry to live backend:', e);
  }
  return null;
}

export async function apiGetContacts() {
  try {
    const res = await fetch(`${API_BASE}/contacts/`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      const results = Array.isArray(data) ? data : data.results || [];
      return results.map((c: any) => ({
        id: String(c.id),
        name: c.name,
        email: c.email,
        phone: c.phone || '',
        subject: c.subject,
        message: c.message,
        date: c.created_at ? c.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        status: c.status,
      }));
    }
  } catch (e) {
    console.warn('Could not fetch contacts from backend:', e);
  }
  return null;
}

export async function apiUpdateContactStatus(id: string | number, status: string) {
  try {
    const res = await fetch(`${API_BASE}/contacts/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch (e) {
    console.warn('Could not update contact status:', e);
    return false;
  }
}
