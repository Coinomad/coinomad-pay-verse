import axiosInstance from './axiosInstance';

export const authAPI = {
  login: (credentials) => axiosInstance.post('/employerauth/login', credentials),
  signup: (userData) => axiosInstance.post('/employerauth/signup/email', userData, { timeout: 30000 }), // 30 seconds
  verifyEmail: (data) => axiosInstance.post('/employerauth/signup/verify-email', data, { timeout: 30000 }), // 30 seconds
  resendVerificationCode: (email) => axiosInstance.post('/employerauth/signup/resend-token', { email }, { timeout: 60000 }), // 60 seconds timeout
  logout: () => axiosInstance.post('/employerauth/logout')
};

export const userAPI = {
    recentTransactions: () => axiosInstance.get('/employers/transactions'),
}