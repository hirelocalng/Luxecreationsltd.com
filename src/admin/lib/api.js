import { API_URL } from '../../utils/api';

const BASE = API_URL;

function getToken() {
  return localStorage.getItem('admin_token');
}

async function req(path, options = {}) {
  const tok = getToken();
  const isFormData = options.body instanceof FormData;
  const headers = { ...options.headers };
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (tok) headers['Authorization'] = `Bearer ${tok}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`Admin API error [${res.status}] ${path}:`, data);
    throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status, data });
  }
  return data;
}

export const adminApi = {
  login: (body) => req('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  changePassword: (body) => req('/api/auth/change-password', { method: 'POST', body: JSON.stringify(body) }),

  getInquiries: (params = {}) => {
    const q = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== '')));
    return req(`/api/inquiries?${q}`);
  },
  updateInquiry: (id, body) => req(`/api/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteInquiry: (id) => req(`/api/inquiries/${id}`, { method: 'DELETE' }),

  getTestimonials: () => req('/api/testimonials/admin'),
  createTestimonial: (body) => req('/api/testimonials', { method: 'POST', body: JSON.stringify(body) }),
  updateTestimonial: (id, body) => req(`/api/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  reorderTestimonials: (order) => req('/api/testimonials/reorder', { method: 'PATCH', body: JSON.stringify({ order }) }),
  deleteTestimonial: (id) => req(`/api/testimonials/${id}`, { method: 'DELETE' }),

  getServices: () => req('/api/services'),
  createService: (body) => req('/api/services', { method: 'POST', body: JSON.stringify(body) }),
  updateService: (id, body) => req(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteService: (id) => req(`/api/services/${id}`, { method: 'DELETE' }),

  getPortfolio: () => req('/api/portfolio/admin'),
  createPortfolioItem: (formData) => req('/api/portfolio', { method: 'POST', body: formData }),
  updatePortfolioItem: (id, body) => req(`/api/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePortfolioItem: (id) => req(`/api/portfolio/${id}`, { method: 'DELETE' }),

  getBlogPosts: (status) => req(`/api/blog/admin${status ? `?status=${status}` : ''}`),
  createBlogPost: (body) => req('/api/blog', { method: 'POST', body: JSON.stringify(body) }),
  updateBlogPost: (id, body) => req(`/api/blog/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteBlogPost: (id) => req(`/api/blog/${id}`, { method: 'DELETE' }),

  getAllSeo: () => req('/api/seo'),
  updateSeo: (page, body) => req(`/api/seo/${page}`, { method: 'PUT', body: JSON.stringify(body) }),

  getSubscribers: (status) => req(`/api/newsletter/subscribers${status ? `?status=${status}` : ''}`),
};
