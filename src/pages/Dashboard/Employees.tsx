import { useState, useEffect, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axiosInstance from '../../Data/axiosInstance';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Calendar, Trash2 } from 'lucide-react';
import { AddEmployeeDialog } from '@/components/AddEmployeeDialog';
import { SchedulingModal } from '@/components/ScheduleDialog';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';

interface Schedule {
  id: number;
  type: 'daily' | 'weekly' | 'monthly';
  amount: number;
  asset: string;
  status: 'active' | 'paused';
  nextPayment: string;
}

interface Employee {
  employeeId: string;
  name: string;
  email: string;
  position: string;
  walletAddress: string;
  asset: 'USDT' | 'USDC';
  network: 'BASE' | 'POLYGON' | 'ETHEREUM';
  schedules?: Schedule[];
  scheduleTransaction?: {
    _id: string;
    employer: string;
    employee: string;
    scheduleType: string;
    frequency?: string;
    amount: number;
    network: string;
    asset: string;
    status: string;
    lastExecuted?: string;
    nextExecution?: string;
    executionCount?: number;
    createdAt: string;
    updatedAt: string;
    jobId?: string;
  } | null;
}

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Add state for delete confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<{
    type: 'local' | 'backend';
    schedule: Schedule | Employee['scheduleTransaction'];
    employeeId: string;
  } | null>(null);
  
  // Add state for employee deletion
  const [showDeleteEmployeeDialog, setShowDeleteEmployeeDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [showEditEmployeeDialog, setShowEditEmployeeDialog] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    walletAddress: '',
    network: '',
    asset: '',
  });

  // Move fetchEmployees outside useEffect so it can be reused
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data: response } = await axiosInstance.get('/employee/getemployees');
      setEmployees(response.data || []);
    } catch (error: any) {
      setError('Failed to load employees');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add function to handle schedule click
  const handleScheduleClick = (schedule: Schedule | Employee['scheduleTransaction'], employeeId: string, type: 'local' | 'backend') => {
    setScheduleToDelete({ type, schedule, employeeId });
    setShowDeleteDialog(true);
  };

  const handleDeleteSchedule = async () => {
    if (!scheduleToDelete) return;

    try {
      console.log('Deleting schedule:', scheduleToDelete);
      
      // Make API call to delete scheduled transaction
      if (scheduleToDelete.type === 'backend') {
        // Type guard to ensure we have the backend schedule type
        const backendSchedule = scheduleToDelete.schedule as Employee['scheduleTransaction'];
        
        if (!backendSchedule || !backendSchedule._id) {
          throw new Error('Invalid backend schedule - missing ID');
        }
        
        const response = await axiosInstance.delete(`/employee/scheduledtransaction/${backendSchedule._id}`);
        
        if (response.data.success) {
          console.log('Schedule deleted successfully:', response.data);
          
          // Show warnings if any
          if (response.data.warnings && response.data.warnings.length > 0) {
            console.warn('Deletion warnings:', response.data.warnings);
           
          } else {
           
          }
          
          // Refresh the employees list to reflect the changes
          await fetchEmployees();
        } else {
          throw new Error(response.data.message || 'Failed to delete schedule');
        }
      } else if (scheduleToDelete.type === 'local') {
        // Handle local schedules deletion
        const localSchedule = scheduleToDelete.schedule as Schedule;
        
        if (!localSchedule || !localSchedule.id) {
          throw new Error('Invalid local schedule - missing ID');
        }
        
        // Remove from local state
        setEmployees(prev => 
          prev.map(emp => {
            if (emp.employeeId === scheduleToDelete.employeeId) {
              return {
                ...emp,
                schedules: (emp.schedules || []).filter(s => s.id !== localSchedule.id)
              };
            }
            return emp;
          })
        );
        
        alert('Local schedule deleted successfully!');
      }
      
    } catch (error: any) {
      console.error('Failed to delete schedule:', error);
      
      // Show user-friendly error message
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete schedule';
      alert(`Error deleting schedule: ${errorMessage}`);
    } finally {
      setShowDeleteDialog(false);
      setScheduleToDelete(null);
    }
  };
  const handleEmployeeEditClick = (employee: Employee) => {
  setEmployeeToEdit(employee);
  setEditFormData({
    name: employee.name || '',
    email: employee.email || '',
    walletAddress: employee.walletAddress || '',
    network: employee.network || '',
    asset: employee.asset || '',
  });
  setShowEditEmployeeDialog(true);
};

const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setEditFormData(prevState => ({ ...prevState, [name]: value }));
};

const handleEditSelectChange = (name: string, value: string) => {
  setEditFormData(prevState => ({ ...prevState, [name]: value }));
};

const handleUpdateEmployee = async () => {
  if (!employeeToEdit) return;

  try {
    const response = await axiosInstance.put(
      `/employee/update/${employeeToEdit.employeeId}`,
      editFormData
    );

    if (response.data.success) {
      toast.success('Employee updated successfully!');
      setShowEditEmployeeDialog(false);
      // Refresh employee list
      fetchEmployees();
    } else {
      toast.error(response.data.message || 'Failed to update employee.');
    }
  } catch (error) {
    console.error('Error updating employee:', error);
    toast.error(error.response?.data?.message || 'An error occurred while updating employee.');
  }
};

  const networks = [
    { id: 'BASE', name: 'BASE', assets: ['USDT', 'USDC'] },
    { id: 'ETHEREUM', name: 'ETHEREUM', assets: ['USDT', 'USDC'] },
    { id: 'POLYGON', name: 'POLYGON', assets: ['USDT', 'USDC'] },
    { id: 'CELO', name: 'CELO', assets: ['CUSD'] }
  ];

  const selectedNetwork = networks.find(n => n.id === editFormData.network);
  const availableAssets = selectedNetwork?.assets || ['USDT', 'USDC'];

  // Add function to handle employee delete click
  const handleEmployeeDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteEmployeeDialog(true);
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;
  
    try {
      console.log('Deleting employee:', employeeToDelete);
      
      // Make API call to delete employee
      const response = await axiosInstance.delete(`/employee/delete/${employeeToDelete.employeeId}`);
      
      if (response.data.success) {
        // Refresh the employees list after successful deletion
        await fetchEmployees();
        alert('Employee deleted successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to delete employee');
      }
      
    } catch (error: any) {
      console.error('Failed to delete employee:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete employee';
      alert(`Error deleting employee: ${errorMessage}`);
    } finally {
      setShowDeleteEmployeeDialog(false);
      setEmployeeToDelete(null);
    }
  };

  useEffect(() => {
    if (!showAddEmployee) {
      fetchEmployees();
    }
  }, [showAddEmployee]);

  const filteredEmployees = useMemo(() =>
    employees.filter(employee =>
      (employee.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (employee.email?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (employee.position?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
    ), [employees, searchTerm]);

  const addEmployee = async (employeeData: Omit<Employee, 'employeeId' | 'schedules' | 'scheduleTransaction'>) => {
  try {
    setLoading(true);
    
    const { data } = await axiosInstance.post('/employee/register', employeeData);
    
    if (data && data.data) {
      await fetchEmployees();
      toast.success('Employee added successfully!');
    } else {
      throw new Error('Invalid response structure from server');
    }
  } catch (error: any) {
    console.error('Registration failed:', error.response?.data?.message || error.message);
    toast.error(error.response?.data?.message || 'Failed to add employee. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const openScheduleDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowScheduleDialog(true);
  };

  const addSchedule = (schedule: Omit<Schedule, 'id'>) => {
    if (!selectedEmployee) return;
    
    const newSchedule: Schedule = {
      ...schedule,
      id: Date.now()
    };
    
    const updatedEmployee = {
      ...selectedEmployee,
      schedules: [...(selectedEmployee.schedules || []), newSchedule]
    };
    
    setEmployees(prev => 
      prev.map(emp => 
        emp.employeeId === selectedEmployee.employeeId ? updatedEmployee : emp
      )
    );
    
    setSelectedEmployee(updatedEmployee);
    console.log('Schedule added successfully:', newSchedule);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />
      <main className="px-6 py-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center p-8 text-[#ECE147]">Loading employees...</div>
        ) : error ? (
          <div className="text-center p-8 text-red-400">
            Error: {error}
            <Button onClick={() => window.location.reload()} className="ml-4">
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Employees</h1>
                <p className="text-[#B3B3B3]">Manage your team and payment schedules</p>
              </div>
              <Button 
                onClick={() => setShowAddEmployee(true)}
                className="bg-[#ECE147] text-black hover:bg-[#ECE147]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-white">{employees.length}</div>
                  <div className="text-[#B3B3B3] text-sm">Total Employees</div>
                </CardContent>
              </Card>
              <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-white">
                    {employees.reduce((total, emp) => {
                      const schedulesCount = (emp.schedules || []).filter(s => s.status === 'active').length;
                      const transactionCount = emp.scheduleTransaction?.status === 'active' ? 1 : 0;
                      return total + schedulesCount + transactionCount;
                    }, 0)}
                  </div>
                  <div className="text-[#B3B3B3] text-sm">Active Schedules</div>
                </CardContent>
              </Card>
              <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-white">
                    ${employees.reduce((total, emp) => {
                      const schedulesTotal = (emp.schedules || []).reduce((sum, schedule) => sum + Number(schedule.amount || 0), 0);
                      const transactionTotal = emp.scheduleTransaction?.amount || 0;
                      return total + schedulesTotal + transactionTotal;
                    }, 0).toLocaleString()}
                  </div>
                  <div className="text-[#B3B3B3] text-sm">Total Monthly Payroll</div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="bg-[#1A1A1A] border-[#2C2C2C] mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3] w-4 h-4" />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-[#2C2C2C] border-[#2C2C2C] text-white placeholder:text-[#B3B3B3]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employees Table */}
            <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
              <CardHeader>
                <CardTitle className="text-white">Employee List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#2C2C2C]">
                      <TableHead className="text-[#B3B3B3]">Employee</TableHead>
                      <TableHead className="text-[#B3B3B3]">Position</TableHead>
                      <TableHead className="text-[#B3B3B3]">Wallet & Network</TableHead>
                      <TableHead className="text-[#B3B3B3]">Schedules</TableHead>
                      <TableHead className="text-[#B3B3B3]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.employeeId} className="border-[#2C2C2C]">
                        <TableCell>
                          <div>
                            <div className="text-white font-medium">{employee.name}</div>
                            <div className="text-[#B3B3B3] text-sm">{employee.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">{employee.position}</TableCell>
                        <TableCell>
                          <div>
                            <div className="text-white font-mono text-sm">
                              {employee.walletAddress.slice(0, 8)}...{employee.walletAddress.slice(-8)}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="bg-[#ECE147]/10 text-[#ECE147]">
                                {employee.asset}
                              </Badge>
                              <Badge variant="secondary" className="bg-[#9AE66E]/10 text-[#9AE66E]">
                                {employee.network}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {/* Display schedules from schedules array */}
                            {(employee.schedules || []).map((schedule) => (
                              <div 
                                key={schedule.id} 
                                className="flex items-center gap-2 cursor-pointer hover:bg-gray-800/50 p-2 rounded transition-colors group"
                                onClick={() => handleScheduleClick(schedule, employee.employeeId, 'local')}
                                title="Click to delete this schedule"
                              >
                                <Badge 
                                  variant={schedule.status === 'active' ? 'default' : 'secondary'}
                                  className={schedule.status === 'active' ? 'bg-[#9AE66E]/10 text-[#9AE66E]' : 'bg-yellow-400/10 text-yellow-400'}
                                >
                                  {schedule.type}
                                </Badge>
                                <span className="text-white text-sm">
                                  ${schedule.amount} {schedule.asset}
                                </span>
                                <Trash2 className="w-3 h-3 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                              </div>
                            ))}
                            {/* Display scheduleTransaction if exists */}
                            {employee.scheduleTransaction && (
                              <div 
                                className="flex items-center gap-2 cursor-pointer hover:bg-gray-800/50 p-2 rounded transition-colors group"
                                onClick={() => handleScheduleClick(employee.scheduleTransaction, employee.employeeId, 'backend')}
                                title="Click to delete this schedule"
                              >
                                <Badge 
                                  variant={employee.scheduleTransaction.status === 'active' ? 'default' : 'secondary'}
                                  className={employee.scheduleTransaction.status === 'active' ? 'bg-[#9AE66E]/10 text-[#9AE66E]' : 'bg-yellow-400/10 text-yellow-400'}
                                >
                                  {employee.scheduleTransaction.scheduleType}
                                </Badge>
                                <span className="text-white text-sm">
                                  ${employee.scheduleTransaction.amount} {employee.scheduleTransaction.asset.toUpperCase()}
                                </span>
                                <Trash2 className="w-3 h-3 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                              </div>
                            )}
                            {/* Show "No schedules" only if both are empty */}
                            {(!employee.schedules || employee.schedules.length === 0) && !employee.scheduleTransaction && (
                              <span className="text-[#B3B3B3] text-sm">No schedules</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openScheduleDialog(employee)}
                              className="text-[#ECE147] hover:text-[#ECE147]/80"
                            >
                              <Calendar className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEmployeeEditClick(employee)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEmployeeDeleteClick(employee)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </main>
      
      {/* MOVED AlertDialog to proper location - BEFORE closing main div */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete this schedule? This action cannot be undone.
              
              {scheduleToDelete && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Schedule Type:</span>
                      <span className="text-white">
                        {scheduleToDelete.type === 'backend' 
                          ? (scheduleToDelete.schedule as Employee['scheduleTransaction'])?.scheduleType
                          : (scheduleToDelete.schedule as Schedule)?.type
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white">
                        ${scheduleToDelete.schedule?.amount} {scheduleToDelete.schedule?.asset?.toUpperCase()}
                      </span>
                    </div>
                    {scheduleToDelete.type === 'backend' && (scheduleToDelete.schedule as Employee['scheduleTransaction'])?.nextExecution && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Next Execution:</span>
                        <span className="text-white">
                          {new Date((scheduleToDelete.schedule as Employee['scheduleTransaction'])!.nextExecution!).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {scheduleToDelete.type === 'local' && (scheduleToDelete.schedule as Schedule)?.nextPayment && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Next Payment:</span>
                        <span className="text-white">
                          {new Date((scheduleToDelete.schedule as Schedule).nextPayment).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`${scheduleToDelete.schedule?.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {scheduleToDelete.schedule?.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSchedule}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

            {/* Employee Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteEmployeeDialog} onOpenChange={setShowDeleteEmployeeDialog}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Employee</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete this employee? This action cannot be undone and will remove all associated schedules and data.
              
              {employeeToDelete && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white font-medium">{employeeToDelete.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{employeeToDelete.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Position:</span>
                      <span className="text-white">{employeeToDelete.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wallet Address:</span>
                      <span className="text-white font-mono text-sm">
                        {employeeToDelete.walletAddress.slice(0, 8)}...{employeeToDelete.walletAddress.slice(-8)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network:</span>
                      <span className="text-white">
                        <Badge variant="secondary" className="bg-[#9AE66E]/10 text-[#9AE66E]">
                          {employeeToDelete.network}
                        </Badge>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Asset:</span>
                      <span className="text-white">
                        <Badge variant="secondary" className="bg-[#ECE147]/10 text-[#ECE147]">
                          {employeeToDelete.asset}
                        </Badge>
                      </span>
                    </div>
                    {/* Show active schedules count */}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Schedules:</span>
                      <span className="text-white">
                        {(() => {
                          const schedulesCount = (employeeToDelete.schedules || []).filter(s => s.status === 'active').length;
                          const transactionCount = employeeToDelete.scheduleTransaction?.status === 'active' ? 1 : 0;
                          return schedulesCount + transactionCount;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEmployee}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Yes, Delete Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
            {/* Employee Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteEmployeeDialog} onOpenChange={setShowDeleteEmployeeDialog}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Employee</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete this employee? This action cannot be undone and will remove all associated schedules and data.
              
              {employeeToDelete && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white font-medium">{employeeToDelete.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{employeeToDelete.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Position:</span>
                      <span className="text-white">{employeeToDelete.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wallet Address:</span>
                      <span className="text-white font-mono text-sm">
                        {employeeToDelete.walletAddress.slice(0, 8)}...{employeeToDelete.walletAddress.slice(-8)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network:</span>
                      <span className="text-white">
                        <Badge variant="secondary" className="bg-[#9AE66E]/10 text-[#9AE66E]">
                          {employeeToDelete.network}
                        </Badge>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Asset:</span>
                      <span className="text-white">
                        <Badge variant="secondary" className="bg-[#ECE147]/10 text-[#ECE147]">
                          {employeeToDelete.asset}
                        </Badge>
                      </span>
                    </div>
                    {/* Show active schedules count */}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Schedules:</span>
                      <span className="text-white">
                        {(() => {
                          const schedulesCount = (employeeToDelete.schedules || []).filter(s => s.status === 'active').length;
                          const transactionCount = employeeToDelete.scheduleTransaction?.status === 'active' ? 1 : 0;
                          return schedulesCount + transactionCount;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEmployee}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Yes, Delete Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
           {/* Employee Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteEmployeeDialog} onOpenChange={setShowDeleteEmployeeDialog}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Employee</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete this employee? This action cannot be undone and will remove all associated schedules and data.
              
              {employeeToDelete && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white font-medium">{employeeToDelete.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{employeeToDelete.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Position:</span>
                      <span className="text-white">{employeeToDelete.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wallet Address:</span>
                      <span className="text-white font-mono text-sm">
                        {employeeToDelete.walletAddress.slice(0, 8)}...{employeeToDelete.walletAddress.slice(-8)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network:</span>
                      <span className="text-white">
                        <Badge variant="secondary" className="bg-[#9AE66E]/10 text-[#9AE66E]">
                          {employeeToDelete.network}
                        </Badge>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Asset:</span>
                      <span className="text-white">
                        <Badge variant="secondary" className="bg-[#ECE147]/10 text-[#ECE147]">
                          {employeeToDelete.asset}
                        </Badge>
                      </span>
                    </div>
                    {/* Show active schedules count */}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Schedules:</span>
                      <span className="text-white">
                        {(() => {
                          const schedulesCount = (employeeToDelete.schedules || []).filter(s => s.status === 'active').length;
                          const transactionCount = employeeToDelete.scheduleTransaction?.status === 'active' ? 1 : 0;
                          return schedulesCount + transactionCount;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEmployee}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Yes, Delete Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
         {/* Employee Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteEmployeeDialog} onOpenChange={setShowDeleteEmployeeDialog}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Employee</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete this employee? This action cannot be undone and will remove all associated schedules and data.
              
              {employeeToDelete && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white font-medium">{employeeToDelete.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{employeeToDelete.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Position:</span>
                      <span className="text-white">{employeeToDelete.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wallet Address:</span>
                      <span className="text-white font-mono text-sm">
                        {employeeToDelete.walletAddress.slice(0, 8)}...{employeeToDelete.walletAddress.slice(-8)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network:</span>
                      <span className="text-white">
                        <Badge variant="secondary" className="bg-[#9AE66E]/10 text-[#9AE66E]">
                          {employeeToDelete.network}
                        </Badge>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Asset:</span>
                      <span className="text-white">
                        <Badge variant="secondary" className="bg-[#ECE147]/10 text-[#ECE147]">
                          {employeeToDelete.asset}
                        </Badge>
                      </span>
                    </div>
                    {/* Show active schedules count */}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Schedules:</span>
                      <span className="text-white">
                        {(() => {
                          const schedulesCount = (employeeToDelete.schedules || []).filter(s => s.status === 'active').length;
                          const transactionCount = employeeToDelete.scheduleTransaction?.status === 'active' ? 1 : 0;
                          return schedulesCount + transactionCount;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEmployee}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Yes, Delete Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AddEmployeeDialog 
        isOpen={showAddEmployee} 
        onClose={() => setShowAddEmployee(false)} 
        onAddEmployee={addEmployee}
      />
      
      {selectedEmployee && showScheduleDialog && (
        <SchedulingModal 
          isOpen={showScheduleDialog} 
          onClose={() => setShowScheduleDialog(false)} 
          employee={{
            employeeId: selectedEmployee.employeeId,
            name: selectedEmployee.name,
            position: selectedEmployee.position,
            asset: selectedEmployee.asset,
            network: selectedEmployee.network
          }}
          onRefresh={fetchEmployees}
        />
      )}
      {showEditEmployeeDialog && employeeToEdit && (
  <Dialog open={showEditEmployeeDialog} onOpenChange={setShowEditEmployeeDialog}>
    <DialogContent className="bg-[#1A1A1A] border-[#2C2C2C] text-white max-w-md">
      <DialogHeader>
        <DialogTitle className="text-white">Edit Employee: {employeeToEdit.name} </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-[#B3B3B3]">Name</Label>
          <Input
            id="name"
            name="name"
            value={editFormData.name}
            onChange={handleEditFormChange}
            className="bg-[#2C2C2C] border-[#2C2C2C] text-white"
            placeholder="Enter first name"
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="text-[#B3B3B3]">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={editFormData.email}
            onChange={handleEditFormChange}
            className="bg-[#2C2C2C] border-[#2C2C2C] text-white"
            placeholder="Enter email address"
          />
        </div>
        
        <div>
          <Label htmlFor="walletAddress" className="text-[#B3B3B3]">Wallet Address</Label>
          <Input
            id="walletAddress"
            name="walletAddress"
            value={editFormData.walletAddress}
            onChange={handleEditFormChange}
            className="bg-[#2C2C2C] border-[#2C2C2C] text-white font-mono"
            placeholder="0x..."
          />
        </div>
        
        <div>
          <Label htmlFor="network" className="text-[#B3B3B3]">Network</Label>
          <Select 
            value={editFormData.network} 
            onValueChange={(value) => {
              handleEditSelectChange('network', value);
              // Reset asset when network changes
              handleEditSelectChange('asset', '');
            }}
          >
            <SelectTrigger className="bg-[#2C2C2C] border-[#2C2C2C] text-white">
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[#2C2C2C]">
              {networks.map((network) => (
                <SelectItem key={network.id} value={network.id} className="text-white hover:bg-[#2C2C2C]">
                  {network.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="asset" className="text-[#B3B3B3]">Asset</Label>
          <Select 
            value={editFormData.asset} 
            onValueChange={(value) => handleEditSelectChange('asset', value)}
            disabled={!editFormData.network}
          >
            <SelectTrigger className="bg-[#2C2C2C] border-[#2C2C2C] text-white">
              <SelectValue placeholder="Select asset" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[#2C2C2C]">
              {availableAssets.map((asset) => (
                <SelectItem key={asset} value={asset} className="text-white hover:bg-[#2C2C2C]">
                  {asset}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          onClick={() => setShowEditEmployeeDialog(false)}
          className="flex-1 border-[#2C2C2C] text-[#B3B3B3] hover:bg-[#2C2C2C]"
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdateEmployee}
          className="flex-1 bg-[#ECE147] text-black hover:bg-[#ECE147]/90"
        >
          Save Changes
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)}
    </div>
  );
};

export default Employees;