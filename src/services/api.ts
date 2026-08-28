// Django REST Framework API Client for Genzicon Foundation

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

// --------------------------------------------------------------------------
// 4. Ground Programs & Projects
// --------------------------------------------------------------------------
export async function apiGetProjects() {
  try {
    const res = await fetch(`${API_BASE}/projects/`);
    if (res.ok) {
      const data = await res.json();
      const results = Array.isArray(data) ? data : data.results || [];
      return results.map((p: any) => ({
        id: String(p.id),
        title: p.title,
        titleNp: p.title_np,
        category: p.category,
        categoryType: p.category?.toLowerCase().includes('clean') ? 'clean-energy' : 'education',
        description: p.description,
        descriptionNp: p.description_np,
        status: p.status,
        fundedPercentage: p.progress_percentage || 0,
        goalAmountNpr: Number(p.target_amount) || 0,
        raisedAmountNpr: Number(p.raised_amount) || 0,
        goalAmountUsd: Math.round((Number(p.target_amount) || 0) / 135),
        raisedAmountUsd: Math.round((Number(p.raised_amount) || 0) / 135),
        location: `${p.district}, ${p.province}`,
        beneficiaries: p.beneficiaries_count,
        imageUrl: p.image_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
        imageAlt: p.title,
      }));
    }
  } catch (e) {
    console.warn('Could not fetch live projects from backend:', e);
  }
  return null;
}

export async function apiCreateProject(projectData: any) {
  try {
    const payload = {
      title: projectData.title,
      title_np: projectData.titleNp || projectData.title,
      category: projectData.category || 'Grassroots Relief',
      district: projectData.location?.split(',')[0]?.trim() || 'Kathmandu',
      province: projectData.location?.split(',')[1]?.trim() || 'Bagmati Province',
      status: projectData.status || 'Active',
      target_amount: projectData.goalAmountNpr || 100000,
      raised_amount: projectData.raisedAmountNpr || 0,
      beneficiaries_count: projectData.beneficiaries || '500+ People',
      image_url: projectData.imageUrl,
      description: projectData.description,
      description_np: projectData.descriptionNp || projectData.description,
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

export async function apiDeleteProject(id: string) {
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
// 5. Clothes Bank Donations
// --------------------------------------------------------------------------
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
  try {
    const payload = {
      donor_name: data.donorName,
      phone: data.phone,
      email: data.email || '',
      province: data.province,
      district: data.district,
      city: data.city || '',
      address: data.address,
      clothes_type: data.clothesType,
      approx_items_count: data.approxItemsCount,
      donation_mode: data.donationMode,
      pickup_date: data.pickupDate || null,
      dropoff_hub: data.dropoffHub || '',
      notes: data.notes || '',
    };
    const res = await fetch(`${API_BASE}/clothes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Failed to submit clothes donation to live API:', e);
  }
  return null;
}

export async function apiGetClothesDonations() {
  try {
    const res = await fetch(`${API_BASE}/clothes/`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      const results = Array.isArray(data) ? data : data.results || [];
      return results.map((c: any) => ({
        id: String(c.id),
        refId: c.ref_id,
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
        status: c.status,
      }));
    }
  } catch (e) {
    console.warn('Could not fetch clothes donations from backend:', e);
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
