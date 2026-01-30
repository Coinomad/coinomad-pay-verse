import axiosInstance from './axiosInstance';

export const payrollAPI = {
    getEmployee: () => axiosInstance.get('/payroll/employee'),
    // Alias to match requested naming
    getEmployeePayroll: () => axiosInstance.get('/payroll/employee'),
    // Parameterized to support day/week/month switching via query param
    getGraphs: (type = 'weekly') => axiosInstance.get('/payroll/payroll-graph', { params: { type } }),
    getTransstats: () => axiosInstance.get('/payroll/transaction-stats'),
}
