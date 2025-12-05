import axiosInstance from './axiosInstance';

export const reportAPI = {
  getReportStats: () => axiosInstance.get('/reports/stats'),
}