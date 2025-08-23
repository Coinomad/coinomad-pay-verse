
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: {
    name: string;
    email: string;
    position: string;
    walletAddress: string;
    asset: string;
    network: string;
  }) => void;
}

export const AddEmployeeDialog = ({ isOpen, onClose, onAddEmployee }: AddEmployeeDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    walletAddress: '',
    asset: '',
    network: ''
  });

  const networks = [
    { id: 'BASE', name: 'Base', assets: ['USDT', 'USDC'] },
    { id: 'ETHEREUM', name: 'Ethereum', assets: ['USDT', 'USDC'] },
    { id: 'POLYGON', name: 'Polygon', assets: ['USDT', 'USDC'] },
  ];

  const selectedNetwork = networks.find(n => n.id === formData.network);
  const availableAssets = selectedNetwork?.assets || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).every(value => value.trim())) {
      onAddEmployee(formData);
      setFormData({
        name: '',
        email: '',
        position: '',
        walletAddress: '',
        asset: '',
        network: ''
      });
      onClose();
    }
  };

  const handleNetworkChange = (network: string) => {
    setFormData(prev => ({
      ...prev,
      network,
      asset: '' // Reset asset when network changes
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] border-[#2C2C2C] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Employee</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-[#B3B3B3]">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-[#2C2C2C] border-[#2C2C2C] text-white"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-[#B3B3B3]">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-[#2C2C2C] border-[#2C2C2C] text-white"
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <Label htmlFor="position" className="text-[#B3B3B3]">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              className="bg-[#2C2C2C] border-[#2C2C2C] text-white"
              placeholder="Enter job position"
              required
            />
          </div>

          <div>
            <Label htmlFor="walletAddress" className="text-[#B3B3B3]">Wallet Address</Label>
            <Input
              id="walletAddress"
              value={formData.walletAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, walletAddress: e.target.value }))}
              className="bg-[#2C2C2C] border-[#2C2C2C] text-white font-mono"
              placeholder="0x..."
              required
            />
          </div>

          <div>
            <Label htmlFor="network" className="text-[#B3B3B3]">Network</Label>
            <Select value={formData.network} onValueChange={handleNetworkChange}>
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
              value={formData.asset} 
              onValueChange={(asset) => setFormData(prev => ({ ...prev, asset }))}
              disabled={!formData.network}
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

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#2C2C2C] text-[#B3B3B3] hover:bg-[#2C2C2C]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#ECE147] text-black hover:bg-[#ECE147]/90"
            >
              Add Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
