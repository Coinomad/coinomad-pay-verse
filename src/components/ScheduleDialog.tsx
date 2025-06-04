import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';

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

interface ScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onAddSchedule: (schedule: Omit<Schedule, 'id'>) => void;
}

export const ScheduleDialog = ({ isOpen, onClose, employee, onAddSchedule }: ScheduleDialogProps) => {
  const [newSchedule, setNewSchedule] = useState({
    type: '' as 'daily' | 'weekly' | 'monthly' | '',
    amount: '',
    asset: employee.asset,
    status: 'active' as 'active' | 'paused'
  });

  const getNextPaymentDate = (type: string): string => {
    const now = new Date();
    switch (type) {
      case 'daily':
        now.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        now.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        break;
      default:
        break;
    }
    return now.toISOString().split('T')[0];
  };

  const handleAddSchedule = () => {
    if (newSchedule.type && newSchedule.amount) {
      onAddSchedule({
        type: newSchedule.type as 'daily' | 'weekly' | 'monthly',
        amount: parseFloat(newSchedule.amount),
        asset: newSchedule.asset,
        status: newSchedule.status,
        nextPayment: getNextPaymentDate(newSchedule.type)
      });
      setNewSchedule({
        type: '',
        amount: '',
        asset: employee.asset,
        status: 'active'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] border-[#2C2C2C] text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">
            Payment Schedules - {employee.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Employee Info */}
          <div className="p-4 bg-[#2C2C2C] rounded-lg">
            <div className="text-white font-medium">{employee.name}</div>
            <div className="text-[#B3B3B3] text-sm">{employee.position}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-[#ECE147]/10 text-[#ECE147]">
                {employee.asset}
              </Badge>
              <Badge variant="secondary" className="bg-[#9AE66E]/10 text-[#9AE66E]">
                {employee.network}
              </Badge>
            </div>
          </div>

          {/* Existing Schedules */}
          <div>
            <h3 className="text-white font-medium mb-3">Current Schedules</h3>
            {employee.schedules.length > 0 ? (
              <div className="space-y-2">
                {employee.schedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-3 bg-[#2C2C2C] rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={schedule.status === 'active' ? 'default' : 'secondary'}
                        className={schedule.status === 'active' ? 'bg-[#9AE66E]/10 text-[#9AE66E]' : 'bg-yellow-400/10 text-yellow-400'}
                      >
                        {schedule.type}
                      </Badge>
                      <div>
                        <div className="text-white font-medium">
                          ${schedule.amount} {schedule.asset}
                        </div>
                        <div className="text-[#B3B3B3] text-sm">
                          Next: {schedule.nextPayment}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[#B3B3B3] text-sm p-4 bg-[#2C2C2C] rounded-lg text-center">
                No payment schedules set up yet
              </div>
            )}
          </div>

          {/* Add New Schedule */}
          <div>
            <h3 className="text-white font-medium mb-3">Add New Schedule</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="type" className="text-[#B3B3B3]">Frequency</Label>
                  <Select value={newSchedule.type} onValueChange={(type) => setNewSchedule(prev => ({ ...prev, type: type as any }))}>
                    <SelectTrigger className="bg-[#2C2C2C] border-[#2C2C2C] text-white">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#2C2C2C]">
                      <SelectItem value="daily" className="text-white hover:bg-[#2C2C2C]">Daily</SelectItem>
                      <SelectItem value="weekly" className="text-white hover:bg-[#2C2C2C]">Weekly</SelectItem>
                      <SelectItem value="monthly" className="text-white hover:bg-[#2C2C2C]">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount" className="text-[#B3B3B3]">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newSchedule.amount}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, amount: e.target.value }))}
                    className="bg-[#2C2C2C] border-[#2C2C2C] text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="asset" className="text-[#B3B3B3]">Asset</Label>
                  <Select value={newSchedule.asset} onValueChange={(asset) => setNewSchedule(prev => ({ ...prev, asset }))}>
                    <SelectTrigger className="bg-[#2C2C2C] border-[#2C2C2C] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#2C2C2C]">
                      <SelectItem value="USDT" className="text-white hover:bg-[#2C2C2C]">USDT</SelectItem>
                      <SelectItem value="USDC" className="text-white hover:bg-[#2C2C2C]">USDC</SelectItem>
                      <SelectItem value="CUSD" className="text-white hover:bg-[#2C2C2C]">CUSD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status" className="text-[#B3B3B3]">Status</Label>
                  <Select value={newSchedule.status} onValueChange={(status) => setNewSchedule(prev => ({ ...prev, status: status as any }))}>
                    <SelectTrigger className="bg-[#2C2C2C] border-[#2C2C2C] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#2C2C2C]">
                      <SelectItem value="active" className="text-white hover:bg-[#2C2C2C]">Active</SelectItem>
                      <SelectItem value="paused" className="text-white hover:bg-[#2C2C2C]">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleAddSchedule}
                disabled={!newSchedule.type || !newSchedule.amount}
                className="w-full bg-[#ECE147] text-black hover:bg-[#ECE147]/90 disabled:opacity-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Schedule
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#2C2C2C] text-[#B3B3B3] hover:bg-[#2C2C2C]"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
