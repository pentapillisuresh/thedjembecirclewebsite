// lib/storage.js

// Local storage helper functions
export const setItem = (key, value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getItem = (key) => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item);
    } catch (e) {
      // Log the error for debugging and remove the invalid item
      console.warn(`Invalid JSON for key "${key}":`, item);
      localStorage.removeItem(key);
      return null;
    }
  }
  return null;
};

export const removeItem = (key) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

// Auth helpers
export const getUser = () => {
  try {
    return getItem('user');
  } catch {
    removeUser();
    return null;
  }
};

export const setUser = (user) => setItem('user', user);
export const removeUser = () => removeItem('user');

// Booking helpers
export const getBookings = () => getItem('bookings') || [];
export const setBookings = (bookings) => setItem('bookings', bookings);
export const addBooking = (booking) => {
  const bookings = getBookings();
  bookings.push(booking);
  setBookings(bookings);
};

// Events helpers
export const getEvents = () => {
  // Check for old events and clear if needed
  if (typeof window !== 'undefined') {
    const existingEvents = getItem('events');
    if (existingEvents && existingEvents.length > 0) {
      // If event name contains 'Africa', clear and refresh
      if (existingEvents[0].name.includes('Africa')) {
        removeItem('events');
      }
    }
  }
  
  const events = getItem('events');
  if (events) return events;
  
  // Default mock events with Hyderabad address
  const mockEvents = [
    {
      id: '1',
      name: 'Rhythm of Hyderabad Drum Circle',
      venue: 'Flat No 401, 16-10-30/1, Ajay Vihar, Old Malakpet',
      city: 'Hyderabad',
      state: 'Telangana',
      pin: '500036',
      date: '2026-08-15',
      time: '7:00 PM - 10:00 PM',
      price: 999,
      capacity: 200,
      category: 'Drum Circle',
      description: 'Experience the heartbeat of Hyderabad with our signature drum circle event. Join us for an unforgettable evening of rhythm and community.',
      fullDescription: 'Join us for an unforgettable evening of drumming, dance, and community spirit. All skill levels welcome! Instruments provided. This is a unique opportunity to connect with the vibrant drumming community in Hyderabad.',
      image: '/images/event1.jpg',
      status: 'Upcoming',
      spots: 150,
    },
    {
      id: '2',
      name: 'Drumming Workshop Hyderabad',
      venue: 'Flat No 401, 16-10-30/1, Ajay Vihar, Old Malakpet',
      city: 'Hyderabad',
      state: 'Telangana',
      pin: '500036',
      date: '2026-09-01',
      time: '10:00 AM - 1:00 PM',
      price: 999,
      capacity: 50,
      category: 'Workshop',
      description: 'Learn the basics of djembe drumming from master drummers in the heart of Hyderabad.',
      fullDescription: 'A hands-on workshop designed for beginners and intermediate drummers. Learn traditional rhythms, techniques, and connect with fellow music enthusiasts in Hyderabad.',
      image: '/images/event2.jpg',
      status: 'Upcoming',
      spots: 35,
    },
    {
      id: '3',
      name: 'Full Moon Drumming Festival',
      venue: 'Flat No 401, 16-10-30/1, Ajay Vihar, Old Malakpet',
      city: 'Hyderabad',
      state: 'Telangana',
      pin: '500036',
      date: '2026-09-15',
      time: '6:00 PM - 11:00 PM',
      price: 999,
      capacity: 500,
      category: 'Festival',
      description: 'A magical night of drumming under the full moon in Hyderabad. Celebrate with the community.',
      fullDescription: 'Experience the magic of drumming under the full moon at our biggest festival of the year. Multiple drum circles, guest artists, food stalls, and a vibrant community celebration in Hyderabad.',
      image: '/images/event3.jpg',
      status: 'Upcoming',
      spots: 300,
    },
    {
      id: '4',
      name: 'Community Drum Circle',
      venue: 'Flat No 401, 16-10-30/1, Ajay Vihar, Old Malakpet',
      city: 'Hyderabad',
      state: 'Telangana',
      pin: '500036',
      date: '2026-07-30',
      time: '5:00 PM - 7:00 PM',
      price: 999,
      capacity: 100,
      category: 'Drum Circle',
      description: 'Weekly community drum circle in Hyderabad. Open to all ages and skill levels.',
      fullDescription: 'Join our weekly community drum circle in Hyderabad. A perfect way to unwind, connect with others, and experience the joy of group rhythm-making.',
      image: '/images/event4.jpg',
      status: 'Ongoing',
      spots: 75,
    },
  ];
  setItem('events', mockEvents);
  return mockEvents;
};

export const getTestimonials = () => {
  const testimonials = getItem('testimonials');
  if (testimonials) return testimonials;
  
  const mockTestimonials = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Regular Attendee',
      content: 'The drum circle experience is absolutely transformative! I\'ve been attending for 3 years now. The community in Hyderabad is amazing.',
      rating: 5,
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Workshop Participant',
      content: 'I learned so much from the workshop. The instructors are world-class and so welcoming. Best drumming community in Hyderabad!',
      rating: 5,
    },
    {
      id: '3',
      name: 'Priya Patel',
      role: 'First-time Attendee',
      content: 'I was nervous at first, but everyone was so inclusive and encouraging. The Hyderabad drum circle feels like family now.',
      rating: 5,
    },
    {
      id: '4',
      name: 'David Williams',
      role: 'Regular Attendee',
      content: 'The energy at these drum circles is incredible. I\'ve made so many friends and learned so much about rhythm and community.',
      rating: 5,
    },
  ];
  setItem('testimonials', mockTestimonials);
  return mockTestimonials;
};

export const getGallery = () => {
  const gallery = getItem('gallery');
  if (gallery) return gallery;
  
  const mockGallery = [
    { id: '1', type: 'image', title: 'Drum Circle Performance', image: '/images/gallery1.jpg' },
    { id: '2', type: 'image', title: 'Workshop Session', image: '/images/gallery2.jpg' },
    { id: '3', type: 'video', title: 'Rhythm in Motion', image: '/images/gallery3.jpg' },
    { id: '4', type: 'image', title: 'Festival Crowd', image: '/images/gallery4.jpg' },
    { id: '5', type: 'image', title: 'Master Drummer', image: '/images/gallery5.jpg' },
    { id: '6', type: 'video', title: 'Full Moon Drumming', image: '/images/gallery6.jpg' },
  ];
  setItem('gallery', mockGallery);
  return mockGallery;
};

// Clear all data (for testing)
export const clearAllData = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
  }
};