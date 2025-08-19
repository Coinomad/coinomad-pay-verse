import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  transactionId: string;
  type: 'incoming' | 'withdrawal';
  asset: 'USDC' | 'USDT' | 'CUSD';
  network: string;
  amount: number;
  timestamp: string;
  status: 'PENDING' | 'CONFIRMED';
  txHash: string;
}

interface TransactionDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const TransactionDetailsDialog = ({ 
  isOpen, 
  onClose, 
  transaction 
}: TransactionDetailsDialogProps) => {
  if (!transaction) return null;
  
  const copyTxHash = () => {
    navigator.clipboard.writeText(transaction.txHash);
    toast({
      title: "Transaction hash copied!",
      description: "Transaction hash copied to clipboard",
    });
  };

  // Determine the explorer URL based on the network
  const getExplorerUrl = () => {
    switch(transaction.network.toLowerCase()) {
      case 'ethereum':
        return `https://etherscan.io/tx/${transaction.txHash}`;
      case 'polygon':
        return `https://polygonscan.com/tx/${transaction.txHash}`;
      case 'base':
        return `https://basescan.org/tx/${transaction.txHash}`;
      case 'celo':
        return `https://explorer.celo.org/mainnet/tx/${transaction.txHash}`;
      default:
        return `https://etherscan.io/tx/${transaction.txHash}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] border-[#2C2C2C] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Transaction Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {/* Transaction ID */}
          <div className="space-y-1">
            <div className="text-[#B3B3B3] text-sm">Transaction ID:</div>
            <div className="text-white font-mono text-sm break-all p-2 bg-[#2C2C2C] rounded-lg">
              {transaction.transactionId}
            </div>
          </div>
          
          {/* Type and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-[#B3B3B3] text-sm">Type:</div>
              <div className="text-white font-medium capitalize">{transaction.type}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[#B3B3B3] text-sm">Status:</div>
              <Badge variant={transaction.status === 'CONFIRMED' ? 'default' : 'secondary'}
                     className={transaction.status === 'CONFIRMED' ? 'bg-[#9AE66E]/10 text-[#9AE66E]' : 'bg-yellow-400/10 text-yellow-400'}>
                {transaction.status.toLowerCase()}
              </Badge>
            </div>
          </div>
          
          {/* Amount and Asset */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-[#B3B3B3] text-sm">Amount:</div>
              <div className={`font-semibold ${transaction.type === 'incoming' ? 'text-[#9AE66E]' : 'text-red-400'}`}>
                {transaction.type === 'incoming' ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[#B3B3B3] text-sm">Asset:</div>
              <div className="text-white font-medium">{transaction.asset} • {transaction.network}</div>
            </div>
          </div>
          
          {/* Timestamp */}
          <div className="space-y-1">
            <div className="text-[#B3B3B3] text-sm">Timestamp:</div>
            <div className="text-white">
              {new Date(transaction.timestamp).toLocaleString()}
            </div>
          </div>
          
          {/* Transaction Hash */}
          <div className="space-y-1">
            <div className="text-[#B3B3B3] text-sm">Transaction Hash:</div>
            <div className="flex items-center gap-2 p-2 bg-[#2C2C2C] rounded-lg">
              <span className="text-white font-mono text-sm flex-1 break-all">
                {transaction.txHash.slice(0, 20)}...{transaction.txHash.slice(-8)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyTxHash}
                className="text-[#ECE147] hover:text-[#ECE147]/80"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(getExplorerUrl(), '_blank')}
                className="text-[#ECE147] hover:text-[#ECE147]/80"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};