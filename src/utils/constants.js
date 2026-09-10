export const PRAYER_NAMES = {
  fajer: 'Fajer',
  duher: 'Duher',
  aser: 'Aser',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

export const PRAYER_TIMES = {
  fajer: 'Dawn',
  duher: 'Midday',
  aser: 'Afternoon',
  maghrib: 'Sunset',
  isha: 'Night',
};

export const PRAYER_COLORS = {
  fajer: '#fcd34d',
  duher: '#f59e0b',
  aser: '#f97316',
  maghrib: '#ef4444',
  isha: '#8b5cf6',
};

export const STATUS_TYPES = {
  COMPLETE: 'complete',
  PENDING: 'pending',
  MISSED: 'missed',
};

export const STATUS_LABELS = {
  complete: 'Complete',
  pending: 'Pending',
  missed: 'Missed',
};

export const STATUS_COLORS = {
  complete: '#10b981',
  pending: '#f59e0b',
  missed: '#ef4444',
};

export const STATUS_ICONS = {
  complete: '✅',
  pending: '⏳',
  missed: '❌',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  AREAS: '/areas',
  COURSES: '/courses',
  BOOKS: '/books',
  GOALS: '/goals',
  PRAYERS: '/prayers',
  REVIEWS: '/reviews',
  ADMIN: '/admin',
};