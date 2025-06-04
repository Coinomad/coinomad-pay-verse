
import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Calendar, Trash2 } from 'lucide-react';
import { AddEmployeeDialog } from '@/components/AddEmployeeDialog';
import { ScheduleDialog } from '@/components/ScheduleDialog';
import { Input } from '@/components/ui/input';

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  walletAddress: string;
  asset: string;
  network: string;
  schedules: Schedule[];
}

interface Schedule {
  id: number;
  type: 'daily' | 'weekly' | 'monthly';
  amount: number;
  asset: string;
  status: 'active' | 'paused';
  nextPayment: string;
}

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@company.com',
      position: 'Software Engineer',
      walletAddress: '0x742d35cc6bf4532c0932b35a35b35c56d3f5f1d7',
      asset: 'USDT',
      network: 'Base',
      schedules: [
        {
          id: 1,
          type: 'monthly',
          amount: 5000,
          asset: 'USDT',
          status: 'active',
          nextPayment: '2024-07-01'
        }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@company.com',
      position: 'Product Manager',
      walletAddress: '0x892d35cc6bf4532c0932b35a35b35c56d3f5f1d8',
      asset: 'USDC',
      network: 'Ethereum',
      schedules: [
        {
          id: 2,
          type: 'weekly',
          amount: 1500,
          asset: 'USDC',
          status: 'active',
          nextPayment: '2024-06-10'
        }
      ]
    }
  ]);

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addEmployee = (employeeData: Omit<Employee, 'id' | 'schedules'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: employees.length + 1,
      schedules: []
    };
    setEmployees([...employees, newEmployee]);
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

    setEmployees(employees.map(emp => 
      emp.id === selectedEmployee.id 
        ? { ...emp, schedules: [...emp.schedules, newSchedule] }
        : emp
    ));
  };

  const removeEmployee = (employeeId: number) => {
    setEmployees(employees.filter(emp => emp.id !== employeeId));
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />
      
      <main className="px-6 py-8 max-w-7xl mx-auto">
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
                {employees.reduce((total, emp) => total + emp.schedules.filter(s => s.status === 'active').length, 0)}
              </div>
              <div className="text-[#B3B3B3] text-sm">Active Schedules</div>
            </CardContent>
          </Card>
          <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-white">
                ${employees.reduce((total, emp) => 
                  total + emp.schedules.reduce((sum, schedule) => sum + schedule.amount, 0), 0
                ).toLocaleString()}
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
                  <TableRow key={employee.id} className="border-[#2C2C2C]">
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
                        {employee.schedules.length > 0 ? (
                          employee.schedules.map((schedule) => (
                            <div key={schedule.id} className="flex items-center gap-2">
                              <Badge 
                                variant={schedule.status === 'active' ? 'default' : 'secondary'}
                                className={schedule.status === 'active' ? 'bg-[#9AE66E]/10 text-[#9AE66E]' : 'bg-yellow-400/10 text-yellow-400'}
                              >
                                {schedule.type}
                              </Badge>
                              <span className="text-white text-sm">
                                ${schedule.amount} {schedule.asset}
                              </span>
                            </div>
                          ))
                        ) : (
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
                          className="text-[#B3B3B3] hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEmployee(employee.id)}
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
      </main>

      <AddEmployeeDialog 
        isOpen={showAddEmployee} 
        onClose={() => setShowAddEmployee(false)} 
        onAddEmployee={addEmployee}
      />
      
      {selectedEmployee && (
        <ScheduleDialog 
          isOpen={showScheduleDialog} 
          onClose={() => setShowScheduleDialog(false)} 
          employee={selectedEmployee}
          onAddSchedule={addSchedule}
        />
      )}
    </div>
  );
};

export default Employees;
