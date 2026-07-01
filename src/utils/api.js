export const API_URL = import.meta.env.VITE_API_URL || 'https://luxecreationsltd.com';

export const publicHeaders = () => ({
  'Content-Type': 'application/json',
});

export const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
});
