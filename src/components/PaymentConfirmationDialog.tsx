import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Wallet, 
  DollarSign, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Repeat,
  CalendarDays
} from 'lucide-react';

interface Employee {
  employeeId: string;
  name: string;
  email: string;
  walletAddress: string;
  asset: string;
  network: string;
  position?: string;
}

interface PaymentDetails {
  amount: number;
  asset: string;
  network: string;
  scheduleType: 'recurring' | 'specific';
  frequency?: string; // For recurring payments
  scheduledDateTime?: string; // For specific payments
  nextExecution?: string; // For recurring payments
}

interface PaymentConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employee: Employee;
  paymentDetails: PaymentDetails;
  isSubmitting?: boolean;
}

export const PaymentConfirmationDialog: React.FC<PaymentConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  employee,
  paymentDetails,
  isSubmitting = false
}) => {
  // Calculate Coinomad fee (1.5%)
  const COINOMAD_FEE_PERCENTAGE = 1.5;
  const coinomadFee = paymentDetails.amount * (COINOMAD_FEE_PERCENTAGE / 100);
  const employeeReceives = paymentDetails.amount - coinomadFee;

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format frequency for display
  const formatFrequency = (frequency: string) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] border-[#2C2C2C] text-white max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#ECE147]" />
            Confirm Payment Schedule
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Schedule Type Indicator */}
          <div className="flex items-center justify-center">
            <Badge 
              variant="secondary" 
              className={`px-3 py-1 text-xs font-medium ${
                paymentDetails.scheduleType === 'recurring' 
                  ? 'bg-[#9AE66E]/10 text-[#9AE66E]' 
                  : 'bg-[#ECE147]/10 text-[#ECE147]'
              }`}
            >
              {paymentDetails.scheduleType === 'recurring' ? (
                <>
                  <Repeat className="w-3 h-3 mr-1" />
                  Recurring Payment
                </>
              ) : (
                <>
                  <CalendarDays className="w-3 h-3 mr-1" />
                  One-time Payment
                </>
              )}
            </Badge>
          </div>

          {/* Employee Information */}
          <Card className="bg-[#2C2C2C] border-[#3C3C3C]">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-[#ECE147]" />
                <h3 className="text-base font-semibold text-white">Employee Details</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-[#B3B3B3] text-xs">Name</span>
                  <span className="text-white text-sm font-medium">{employee.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#B3B3B3] text-xs">Email</span>
                  <span className="text-white text-sm">{employee.email}</span>
                </div>
                {employee.position && (
                  <div className="flex justify-between">
                    <span className="text-[#B3B3B3] text-xs">Position</span>
                    <span className="text-white text-sm">{employee.position}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#B3B3B3] text-xs">Wallet</span>
                  <span className="text-white font-mono text-xs">
                    {employee.walletAddress.slice(0, 6)}...{employee.walletAddress.slice(-6)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-[#ECE147]/10 text-[#ECE147] text-xs px-2 py-0.5">
                  {employee.asset.toUpperCase()}
                </Badge>
                <Badge variant="secondary" className="bg-[#9AE66E]/10 text-[#9AE66E] text-xs px-2 py-0.5">
                  {employee.network}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="bg-[#2C2C2C] border-[#3C3C3C]">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-[#ECE147]" />
                <h3 className="text-base font-semibold text-white">Payment Breakdown</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#B3B3B3] text-xs">Total Amount</span>
                  <span className="text-white font-semibold text-sm">
                    {paymentDetails.amount.toFixed(2)} {paymentDetails.asset.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#B3B3B3] text-xs">Coinomad Fee ({COINOMAD_FEE_PERCENTAGE}%)</span>
                  <span className="text-red-400 text-sm">
                    -{coinomadFee.toFixed(2)} {paymentDetails.asset.toUpperCase()}
                  </span>
                </div>
                <hr className="border-[#3C3C3C]" />
                <div className="flex justify-between items-center">
                  <span className="text-[#B3B3B3] text-xs">Employee Receives</span>
                  <span className="text-[#9AE66E] font-semibold text-sm">
                    {employeeReceives.toFixed(2)} {paymentDetails.asset.toUpperCase()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Information */}
          <Card className="bg-[#2C2C2C] border-[#3C3C3C]">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-3">
                {paymentDetails.scheduleType === 'recurring' ? (
                  <Clock className="w-4 h-4 text-[#ECE147]" />
                ) : (
                  <Calendar className="w-4 h-4 text-[#ECE147]" />
                )}
                <h3 className="text-base font-semibold text-white">Schedule Details</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#B3B3B3] text-xs">Schedule Type</span>
                  <span className="text-white text-sm font-medium">
                    {paymentDetails.scheduleType === 'recurring' ? 'Recurring' : 'One-time'}
                  </span>
                </div>
                {paymentDetails.scheduleType === 'recurring' && paymentDetails.frequency && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-[#B3B3B3] text-xs">Frequency</span>
                      <span className="text-white text-sm font-medium">
                        {formatFrequency(paymentDetails.frequency)}
                      </span>
                    </div>
                    {paymentDetails.nextExecution && (
                      <div className="flex justify-between items-center">
                        <span className="text-[#B3B3B3] text-xs">Next Payment</span>
                        <span className="text-white text-sm font-medium">
                          {formatDate(paymentDetails.nextExecution)}
                        </span>
                      </div>
                    )}
                  </>
                )}
                {paymentDetails.scheduleType === 'specific' && paymentDetails.scheduledDateTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#B3B3B3] text-xs">Scheduled Date & Time</span>
                    <span className="text-white text-sm font-medium">
                      {formatDate(paymentDetails.scheduledDateTime)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Warning Notice */}
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="text-yellow-500 font-medium text-sm mb-1">Important Notice</h4>
                  <p className="text-yellow-100 text-xs">
                    Once confirmed, this payment schedule will be created and cannot be easily modified. 
                    Please review all details carefully before proceeding.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2 pt-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="border-[#3C3C3C] text-[#B3B3B3] hover:bg-[#2C2C2C] hover:text-white text-sm px-3 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-[#ECE147] text-black hover:bg-[#ECE147]/90 font-medium text-sm px-3 py-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-black mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <CheckCircle className="w-3 h-3 mr-2" />
                Confirm Payment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentConfirmationDialog;