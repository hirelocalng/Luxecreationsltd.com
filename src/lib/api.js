import { API_URL } from '../utils/api';

const BASE = API_URL;

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`API error [${res.status}] ${path}:`, data);
    throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status, data });
  }
  return data;
}

export const api = {
  submitInquiry: (body) => request('/api/inquiries', { method: 'POST', body: JSON.stringify(body) }),
  subscribeNewsletter: (body) => request('/api/newsletter/subscribe', { method: 'POST', body: JSON.stringify(body) }),
  getServices: (division) => request(division ? `/api/services?division=${encodeURIComponent(division)}` : '/api/services'),
  getTestimonials: () => request('/api/testimonials'),
  getPortfolio: (category) => request(category ? `/api/portfolio?category=${encodeURIComponent(category)}` : '/api/portfolio'),
  getPortfolioItem: (id) => request(`/api/portfolio/${id}`),
  getBlogPosts: (page = 1) => request(`/api/blog?page=${page}`),
  getBlogPost: (slug) => request(`/api/blog/${slug}`),
  getSeo: (page) => request(`/api/seo/${page}`),
};
