import API_ENDPOINTS from './endpoints';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.token = null;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('authToken');
      }
    }
  }

  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      includeAuth = true,
      params = null,
    } = options;

    let url = `${BASE_URL}${endpoint}`;
    if (params) {
      const query = new URLSearchParams(params).toString();
      url += `?${query}`;
    }

    const fetchOptions = {
      method,
      headers: this.getHeaders(includeAuth),
    };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, fetchOptions);
      const data = await response.json();
      console.log("response:::", response)
      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null);
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ========== AUTH ==========
  register(userData) {
    return this.request(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: userData,
      includeAuth: false,
    });
  }

  login(credentials) {
    return this.request(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: credentials,
      includeAuth: false,
    });
  }

  logout() {
    return this.request(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
  }

  adminLogin(credentials) {
    return this.request(API_ENDPOINTS.AUTH.ADMIN_LOGIN, {
      method: 'POST',
      body: credentials,
      includeAuth: false,
    });
  }

  // ========== USER ==========
  getProfile() {
    return this.request(API_ENDPOINTS.USER.PROFILE);
  }

  updateProfile(data) {
    return this.request(API_ENDPOINTS.USER.UPDATE, {
      method: 'PUT',
      body: data,
    });
  }

  changePin(data) {
    return this.request(API_ENDPOINTS.USER.CHANGE_PIN, {
      method: 'PUT',
      body: data,
    });
  }

  getUserOrders(filters = {}) {
    return this.request(API_ENDPOINTS.USER.ORDERS, {
      params: filters,
    });
  }

  getOrderDetails(orderId) {
    const endpoint = API_ENDPOINTS.USER.ORDER_DETAILS.replace(':orderId', orderId);
    return this.request(endpoint);
  }

  getUserCounts() {
    return this.request(API_ENDPOINTS.USER.COUNTS);
  }
  // ========== EVENTS ==========
  getEvents(filters = {}) {
    return this.request(API_ENDPOINTS.EVENTS.GET_ALL, {
      params: filters,
      includeAuth: false,
    });
  }

  getUpcomingEvents() {
    return this.request(API_ENDPOINTS.EVENTS.GET_UPCOMING, {
      includeAuth: false,
    });
  }

  getEventById(id) {
    const endpoint = API_ENDPOINTS.EVENTS.GET_BY_ID.replace(':id', id);
    return this.request(endpoint, { includeAuth: false });
  }

  // ========== ORDERS (Bookings) ==========
  createOrder(data) {
    return this.request(API_ENDPOINTS.ORDERS.CREATE, {
      method: 'POST',
      body: data,
    });
  }

  getOrder(orderId) {
    const endpoint = API_ENDPOINTS.ORDERS.GET_BY_ID.replace(':orderId', orderId);
    return this.request(endpoint);
  }

  cancelOrder(orderId) {
    const endpoint = API_ENDPOINTS.ORDERS.CANCEL.replace(':orderId', orderId);
    return this.request(endpoint, {
      method: 'PUT',
    });
  }

  // ========== PAYMENT ==========
  createRazorpayOrder(data) {
    return this.request(API_ENDPOINTS.PAYMENT.CREATE_ORDER, {
      method: 'POST',
      body: data,
    });
  }

  verifyPayment(data) {
    return this.request(API_ENDPOINTS.PAYMENT.VERIFY, {
      method: 'POST',
      body: data,
    });
  }

  getPaymentStatus(orderId) {
    const endpoint = API_ENDPOINTS.PAYMENT.STATUS.replace(':orderId', orderId);
    return this.request(endpoint);
  }

  // ========== GALLERY ==========
  getGallery(filters = {}) {
    return this.request(API_ENDPOINTS.GALLERY.GET_ALL, {
      params: filters,
      includeAuth: false,
    });
  }

  // ========== CONTACT ==========
  sendContactMessage(data) {
    return this.request(API_ENDPOINTS.CONTACT.SEND, {
      method: 'POST',
      body: data,
      includeAuth: false,
    });
  }
}

export default new ApiService();