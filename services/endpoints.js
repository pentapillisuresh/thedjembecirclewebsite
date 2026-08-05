export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/signup',      // POST /api/auth/signup
    LOGIN: '/auth/login',          // POST /api/auth/login
    LOGOUT: '/auth/logout',        // POST /api/auth/logout (optional)
    ADMIN_LOGIN: '/auth/admin/login', // POST /api/auth/admin/login
  },

  // User
  USER: {
    PROFILE: '/users/profile',     // GET /api/users/profile
    UPDATE: '/users/profile',      // PUT /api/users/profile
    CHANGE_PIN: '/users/change-pin', // PUT /api/users/change-pin
    ORDERS: '/users/orders',       // GET /api/users/orders
    ORDER_DETAILS: '/users/orders/:orderId', // GET /api/users/orders/:orderId
    COUNTS: '/users/userCounts', // GET /api/users/orders/:orderId
  },

  // Events
  EVENTS: {
    GET_ALL: '/events',            // GET /api/events?status=&limit=&offset=
    GET_UPCOMING: '/events/upcoming', // GET /api/events/upcoming
    GET_BY_ID: '/events/:id',      // GET /api/events/:id
  },

  // Orders (booking)
  ORDERS: {
    CREATE: '/orders/create',      // POST /api/orders/create
    GET_BY_ID: '/orders/:orderId', // GET /api/orders/:orderId
    CANCEL: '/orders/:orderId/cancel', // PUT /api/orders/:orderId/cancel
    REFUND: '/orders/:orderId/refund',
  },

  // Payment
  PAYMENT: {
    CREATE_ORDER: '/payment/create-order', // POST /api/payment/create-order
    VERIFY: '/payment/verify',     // POST /api/payment/verify
    STATUS: '/payment/status/:orderId', // GET /api/payment/status/:orderId
    // Refund is admin-only, not included here
  },

  // Gallery
  GALLERY: {
    GET_ALL: '/gallery',           // GET /api/gallery
  },

  // Contact (if you have a contact endpoint)
  CONTACT: {
    SEND: '/contact',              // POST /api/contact (if defined)
  },

  // Blog
BLOG: {
  GET_ALL: '/blog',
  GET_BY_SLUG: '/blog/:slug',
  CREATE: '/admin/blog',
  UPDATE: '/admin/blog/:id',
  DELETE: '/admin/blog/:id',
  GET_ALL_ADMIN: '/admin/blog',
},

// Leads (public)
LEADS: {
  SUBMIT: '/leads',
  // admin endpoints omitted – usually only used in admin panel
}
};

export default API_ENDPOINTS;