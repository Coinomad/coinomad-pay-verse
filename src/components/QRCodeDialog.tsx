
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

export const QRCodeDialog = ({ isOpen, onClose, address }: QRCodeDialogProps) => {
  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address copied!",
      description: "Wallet address copied to clipboard",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] border-[#2C2C2C] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Wallet Address QR Code</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          {/* QR Code placeholder - in a real app, you'd use a QR code library */}
          <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
            <div className="text-black text-center">
              <div className="text-xs font-mono break-all p-4">
                {address}
              </div>
              <div className="text-xs text-gray-600 mt-2">
                QR Code would appear here
              </div>
            </div>
          </div>
          
          <div className="w-full">
            <div className="text-[#B3B3B3] text-sm mb-2">Wallet Address:</div>
            <div className="flex items-center gap-2 p-3 bg-[#2C2C2C] rounded-lg">
              <span className="text-white font-mono text-sm flex-1 break-all">
                {address}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="text-[#ECE147] hover:text-[#ECE147]/80"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
