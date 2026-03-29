import { create } from 'zustand';

const API_URL = 'http://localhost:5001/api/auth';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, id: data._id }));
      localStorage.setItem('token', data.token);
      
      set({ user: { name: data.name, email: data.email, id: data._id }, token: data.token, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, id: data._id }));
      localStorage.setItem('token', data.token);
      
      set({ user: { name: data.name, email: data.email, id: data._id }, token: data.token, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
