// lib/storage.js
import ApiService from '../services/api';

// ==================== USER STORAGE ====================

export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const setUser = (userData) => {
  try {
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error setting user:', error);
    return false;
  }
};

export const removeUser = () => {
  try {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLogin');
    ApiService.setToken(null);
    return true;
  } catch (error) {
    console.error('Error removing user:', error);
    return false;
  }
};

export const getToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
    ApiService.setToken(token);
    return true;
  } catch (error) {
    console.error('Error setting token:', error);
    return false;
  }
};

// ==================== TESTIMONIALS STORAGE ====================

// Mock testimonials data
const MOCK_TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Regular Participant',
    avatar: '/images/avatar1.jpg',
    content: 'The drum circle experience is absolutely transformative! I\'ve been attending for 6 months and it has completely changed my perspective on community and music. The energy is incredible.',
    rating: 5,
    date: '2024-12-15'
  },
  {
    id: 2,
    name: 'Amit Patel',
    role: 'First-time Participant',
    avatar: '/images/avatar2.jpg',
    content: 'I was nervous at first, but the facilitators made me feel so welcome. Within minutes, I was lost in the rhythm. This is something everyone should experience at least once.',
    rating: 5,
    date: '2024-12-10'
  },
  {
    id: 3,
    name: 'Sneha Reddy',
    role: 'Drum Circle Enthusiast',
    avatar: '/images/avatar3.jpg',
    content: 'I\'ve been to many drum circles around the world, but this one is special. The sense of community, the professional facilitation, and the pure joy of making music together is unmatched.',
    rating: 5,
    date: '2024-12-05'
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'Corporate Team Building',
    avatar: '/images/avatar4.jpg',
    content: 'We brought our entire team for a corporate retreat and it was the best decision we made. The drum circle broke down all barriers and brought everyone together in a way I\'ve never seen before.',
    rating: 5,
    date: '2024-11-28'
  },
  {
    id: 5,
    name: 'Meera Iyer',
    role: 'Regular Participant',
    avatar: '/images/avatar5.jpg',
    content: 'Every session is a journey. The facilitators are amazing at creating a safe, inclusive space where everyone can express themselves. I leave every session feeling rejuvenated.',
    rating: 5,
    date: '2024-11-20'
  },
  {
    id: 6,
    name: 'Rajesh Kumar',
    role: 'Musician',
    avatar: '/images/avatar6.jpg',
    content: 'As a professional musician, I was skeptical about community drum circles. But this one changed my mind. The quality of the instruments and the expertise of the facilitators is top-notch.',
    rating: 4,
    date: '2024-11-15'
  }
];

// Get all testimonials (static data - can be replaced with API call)
export const getTestimonials = async () => {
  try {
    // For now, return static data
    // Later you can fetch from API:
    // const response = await ApiService.getTestimonials();
    // return response.data || [];
    
    return MOCK_TESTIMONIALS;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
};

// Get a single testimonial by ID
export const getTestimonialById = (id) => {
  return MOCK_TESTIMONIALS.find(t => t.id === id) || null;
};

// Get featured testimonials (highest rated)
export const getFeaturedTestimonials = async (count = 3) => {
  try {
    const all = await getTestimonials();
    // Sort by rating (highest first) and return top 'count'
    return all.sort((a, b) => b.rating - a.rating).slice(0, count);
  } catch (error) {
    console.error('Error fetching featured testimonials:', error);
    return [];
  }
};

// Add a new testimonial (for future use)
export const addTestimonial = (testimonial) => {
  try {
    const newTestimonial = {
      id: MOCK_TESTIMONIALS.length + 1,
      ...testimonial,
      date: new Date().toISOString().split('T')[0]
    };
    MOCK_TESTIMONIALS.push(newTestimonial);
    return newTestimonial;
  } catch (error) {
    console.error('Error adding testimonial:', error);
    return null;
  }
};