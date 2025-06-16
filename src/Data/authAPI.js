import axiosInstance from './axiosInstance';

export const authAPI = {
  login: (credentials) => axiosInstance.post('/employerauth/login', credentials),
  signup: (userData) => axiosInstance.post('/employerauth/signup/email', userData),
  verifyEmail: (data) => axiosInstance.post('/employerauth/signup/verify-email', data),
  logout: () => axiosInstance.post('/employerauth/logout')
};

export const userAPI = {
    recentTransactions: () => axiosInstance.get('/employers/transactions'),
}