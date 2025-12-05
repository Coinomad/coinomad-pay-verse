
import { useEffect, useState } from 'react';
import { Search, Filter, Grid, List, Calendar, Download, Eye, Edit, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { payrollAPI } from '@/Data/payrollAPI';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type EmployeeItem = {
  id: number | string;
  name: string;
  avatar?: string;
  position?: string;
  fiatSalary?: string;
  paymentDate?: string;
  status?: string;
  wallet?: string;
};

export const EmployeeTable = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const normalizeEmployee = (item: any, index: number): EmployeeItem => {
    const id = item?.id ?? item?.employeeId ?? item?.employee_id ?? item?._id ?? index + 1;
    const name = item?.name ?? ([item?.firstName, item?.lastName].filter(Boolean).join(' ') || '—');
    const wallet = item?.wallet ?? item?.walletAddress ?? item?.address ?? '—';
    const position = item?.position ?? item?.department ?? item?.role ?? '—';
    const status = item?.status ?? item?.paymentStatus ?? 'Pending';
    const avatar = item?.avatarUrl ?? item?.avatar ?? undefined;
    const fiatRaw = item?.fiatSalary ?? item?.salary ?? item?.pay ?? null;
    const fiatSalary = typeof fiatRaw === 'number' ? `$${fiatRaw.toLocaleString()}` : (fiatRaw || undefined);
    const dateRaw = item?.paymentDate ?? item?.lastPaymentDate ?? item?.createdAt ?? null;
    const paymentDate = dateRaw ? new Date(dateRaw).toISOString().slice(0, 10) : undefined;
    return { id, name, wallet, position, status, avatar, fiatSalary, paymentDate };
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await payrollAPI.getEmployeePayroll();
        const payload = res?.data;
        const list = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.employees)
            ? payload.employees
            : Array.isArray(payload)
              ? payload
              : [];
        const normalized = list.map((item: any, idx: number) => normalizeEmployee(item, idx));
        setEmployees(normalized);
      } catch (e) {
        setError('Failed to load employee payroll');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(employees.map(emp => Number(emp.id)));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, id]);
    } else {
      setSelectedEmployees(selectedEmployees.filter(empId => empId !== id));
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.position || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = filteredEmployees.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // clamp page within bounds
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total);
  const displayedEmployees = filteredEmployees.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Employee Payments</h2>
            <p className="text-white">Manage and review current payroll details for all employees.</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3] w-4 h-4" />
              <Input
                placeholder="Search Employee"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#0D0D0D] border-stone-300/25 rounded-[15px] text-white placeholder-white w-full"
              />
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap gap-3">


            <button className="flex items-center w-21 h-[37px] px-3 rounded-[9px] bg-[#0D0D0D] border border-[#2C2C2C] text-[#B3B3B3] hover:text-white">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            {/* 
            <div className="flex bg-[#0D0D0D] rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-[#ECE147] text-black' : 'text-[#B3B3B3] hover:text-white'}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-[#ECE147] text-black' : 'text-[#B3B3B3] hover:text-white'}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div> */}

            {/* <Button variant="outline" size="sm" className="bg-[#0D0D0D] border-[#2C2C2C] text-[#B3B3B3] hover:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              01 Apr 2025 – 30 Apr 2025
            </Button> */}

            <button className="flex items-center w-21 h-[37px] px-3 rounded-[9px] bg-[#0D0D0D] border border-[#2C2C2C] text-[#B3B3B3] hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className='bg-[#262626] rounded-[20px] mx-8 mb-8'>
        <Table>
          <TableHeader>
            <TableRow className="border-[#2C2C2C] hover:bg-transparent">
              {/* <TableHead className="w-12">
                <Checkbox
                  checked={selectedEmployees.length === employeeData.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead> */}
              <TableHead className="text-[#B3B3B3]">Employee</TableHead>
              <TableHead className="text-[#B3B3B3]">Department</TableHead>
              <TableHead className="text-[#B3B3B3]">Salary</TableHead>
              <TableHead className="text-[#B3B3B3]">Payment Date</TableHead>
              <TableHead className="text-[#B3B3B3]">Status</TableHead>
              <TableHead className="text-[#B3B3B3] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow className="border-[#2C2C2C] hover:bg-transparent">
                <TableCell colSpan={6} className="text-center text-[#B3B3B3]">Loading employees…</TableCell>
              </TableRow>
            )}
            {!loading && displayedEmployees.length === 0 && (
              <TableRow className="border-[#2C2C2C] hover:bg-transparent">
                <TableCell colSpan={6} className="text-center text-[#B3B3B3]">No employees found</TableCell>
              </TableRow>
            )}
            {!loading && displayedEmployees.map((employee) => (
              <TableRow
                key={employee.id}
                className="border-[#2C2C2C] hover:bg-[#0D0D0D]/50"
              >
                {/* <TableCell>
                  <Checkbox
                    checked={selectedEmployees.includes(employee.id)}
                    onCheckedChange={(checked) => handleSelectEmployee(employee.id, !!checked)}
                  />
                </TableCell> */}
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{employee.name}</p>
                      <p className="text-xs text-[#B3B3B3] font-mono">{(employee.wallet || '—').slice(0, 12)}{employee.wallet ? '...' : ''}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-[#B3B3B3]">{employee.position || '—'}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-xs text-[#B3B3B3]">{employee.fiatSalary || '—'}</p>
                  </div>
                </TableCell>
                <TableCell className="text-[#B3B3B3]">{employee.paymentDate || '—'}</TableCell>
                <TableCell>
                  <Badge
                    variant="default"
                    className={
                      `h-7 w-[73px] flex justify-center ${employee.status === 'White'
                        ? 'bg-white text-gray-900 border-0'
                        : employee.status === 'Paid'
                          ? 'bg-[#148210] text-white border-0'
                          : employee.status === 'Pending'
                            ? 'bg-[#101D82] text-white border-0'
                            : employee.status === 'Failed'
                              ? 'bg-[#821B10] text-white border-0'
                              : 'bg-gray-500 text-white border-0'
                      }`
                    }
                  >
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="sm" className="text-[#B3B3B3] hover:text-white p-2">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#B3B3B3] hover:text-white p-2">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#B3B3B3] hover:text-white p-2">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Footer: showing range and pagination controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-[#B3B3B3]">
            {total === 0 ? (
              <span>Showing 0 of 0 employees</span>
            ) : (
              <span>Showing {startIndex}-{endIndex} of {total} employees</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#B3B3B3] hover:text-white"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>

            <div className="text-sm text-[#B3B3B3]">{currentPage} / {totalPages}</div>

            <Button
              variant="ghost"
              size="sm"
              className="text-[#B3B3B3] hover:text-white"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
