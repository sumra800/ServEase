// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add token to headers if available
  const token = localStorage.getItem('servEaseToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Auth API
export const authAPI = {
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (email, password, role) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },
};

// Bookings API
export const bookingsAPI = {
  getAll: async () => {
    return apiRequest('/bookings');
  },

  getById: async (id) => {
    return apiRequest(`/bookings/${id}`);
  },

  create: async (bookingData) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  update: async (id, bookingData) => {
    return apiRequest(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },

  assignHelper: async (id, helperData) => {
    return apiRequest(`/bookings/${id}/assign-helper`, {
      method: 'PUT',
      body: JSON.stringify(helperData),
    });
  },

  updateStatus: async (id, status) => {
    return apiRequest(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  addRating: async (id, rating, review = '') => {
    return apiRequest(`/bookings/${id}/rating`, {
      method: 'PUT',
      body: JSON.stringify({ rating, review }),
    });
  },

  getProviderReviews: async (providerId) => {
    return apiRequest(`/bookings/provider/${providerId}/reviews`);
  },

  addClientRating: async (id, rating, review = '') => {
    return apiRequest(`/bookings/${id}/client-rating`, {
      method: 'PUT',
      body: JSON.stringify({ rating, review }),
    });
  },

  respondToBooking: async (id, response) => {
    return apiRequest(`/bookings/${id}/respond-provider`, {
      method: 'PUT',
      body: JSON.stringify({ response }),
    });
  },
};

// Providers API
export const providersAPI = {
  getAll: async (serviceId) => {
    let url = '/auth/providers';
    if (serviceId) {
      url += `?serviceId=${serviceId}`;
    }
    return apiRequest(url);
  },
};

// Services API
export const servicesAPI = {
  getAll: async () => {
    return apiRequest('/services');
  },
};

// Payments API
export const paymentsAPI = {
  jazzCashPayment: async (paymentData) => {
    return apiRequest('/payments/jazzcash', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  easyPaisaPayment: async (paymentData) => {
    return apiRequest('/payments/easypaisa', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  bankTransfer: async (transferData) => {
    return apiRequest('/payments/bank-transfer', {
      method: 'POST',
      body: JSON.stringify(transferData),
    });
  },

  qrPayment: async (bookingId, upiId) => {
    return apiRequest('/payments/qr-payment', {
      method: 'POST',
      body: JSON.stringify({ bookingId, upiId }),
    });
  },

  getPayment: async (paymentId) => {
    return apiRequest(`/payments/${paymentId}`);
  },

  getPaymentByBooking: async (bookingId) => {
    return apiRequest(`/payments/booking/${bookingId}`);
  },
};

// Auth API - Profile methods
export const profileAPI = {
  updateProfile: async (profileData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const token = localStorage.getItem('servEaseToken');
    const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiBase}/api/auth/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload avatar');
    }

    return response.json();
  },

  deleteAvatar: async () => {
    return apiRequest('/auth/avatar', {
      method: 'DELETE',
    });
  },
};

// Admin API
export const adminAPI = {
  getStats: async () => {
    return apiRequest('/admin/stats');
  },

  getUsers: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(`/admin/users?${params}`);
  },

  getUser: async (id) => {
    return apiRequest(`/admin/users/${id}`);
  },

  updateUser: async (id, userData) => {
    return apiRequest(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  verifyUser: async (id) => {
    return apiRequest(`/admin/users/${id}/verify`, {
      method: 'PUT',
    });
  },

  deleteUser: async (id) => {
    return apiRequest(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },

  getBookings: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(`/admin/bookings?${params}`);
  },

  assignHelper: async (bookingId, helperId) => {
    return apiRequest(`/admin/bookings/${bookingId}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ helperId }),
    });
  },

  approveBooking: async (bookingId) => {
    return apiRequest(`/bookings/${bookingId}/approve-admin`, {
      method: 'PUT',
    });
  },

  getStaff: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(`/admin/staff?${params}`);
  },

  getPayments: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(`/admin/payments?${params}`);
  },

  verifyPayment: async (paymentId) => {
    return apiRequest(`/admin/payments/${paymentId}/verify`, {
      method: 'PUT',
    });
  },
};

export default apiRequest;

