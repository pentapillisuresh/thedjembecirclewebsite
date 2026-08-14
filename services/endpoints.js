// src/services/endpoints.js

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/signup',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ADMIN_LOGIN: '/auth/admin/login',
  },

  // User
  USER: {
    PROFILE: '/users/profile',
    UPDATE: '/users/profile',
    CHANGE_PIN: '/users/change-pin',
    ORDERS: '/users/orders',
    ORDER_DETAILS: '/users/orders/:orderId',
    COUNTS: '/users/userCounts',
  },

  // Events
  EVENTS: {
    GET_ALL: '/events',
    GET_UPCOMING: '/events/upcoming',
    GET_BY_ID: '/events/:id',
  },

  // Orders (booking)
  ORDERS: {
    CREATE: '/orders/create',
    GET_BY_ID: '/orders/:orderId',
    CANCEL: '/orders/:orderId/cancel',
    REFUND: '/orders/:orderId/refund',
  },

  // Payment
  PAYMENT: {
    CREATE_ORDER: '/payment/create-order',
    VERIFY: '/payment/verify',
    STATUS: '/payment/status/:orderId',
  },

  // Gallery
  GALLERY: {
    GET_ALL: '/gallery',
  },

  // Contact
  CONTACT: {
    SEND: '/contact',
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
},

COUPONS: {
  VALIDATE: '/coupons/validate',
  APPLY: '/coupons/apply',
},
};

export default API_ENDPOINTS;