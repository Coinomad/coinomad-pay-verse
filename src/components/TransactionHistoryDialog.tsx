import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

interface TransactionHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export const TransactionHistoryDialog = ({ 
  isOpen, 
  onClose, 
  transactions 
}: TransactionHistoryDialogProps) => {
  const copyTxHash = (txHash: string) => {
    navigator.clipboard.writeText(txHash);
    toast({
      title: "Transaction hash copied!",
      description: "Transaction hash copied to clipboard",
    });
  };

  // Determine the explorer URL based on the network
  const getExplorerUrl = (network: string, txHash: string) => {
    switch(network.toLowerCase()) {
      case 'ethereum':
        return `https://etherscan.io/tx/${txHash}`;
      case 'polygon':
        return `https://polygonscan.com/tx/${txHash}`;
      case 'base':
        return `https://basescan.org/tx/${txHash}`;
      case 'celo':
        return `https://explorer.celo.org/mainnet/tx/${txHash}`;
      default:
        return `https://etherscan.io/tx/${txHash}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] border-[#2C2C2C] text-white max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-white">Transaction History</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2 overflow-y-auto max-h-[60vh] pr-2">
          {transactions.length === 0 ? (
            <div className="text-center text-[#B3B3B3] py-8">No transactions found</div>
          ) : (
            transactions.map((tx) => (
              <div 
                key={tx.transactionId} 
                className="flex items-center justify-between p-3 bg-[#2C2C2C] rounded-lg hover:bg-[#3C3C3C] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'incoming' ? 'bg-[#9AE66E]/10' : 'bg-red-400/10'
                  }`}>
                    {tx.type === 'incoming' ? (
                      <TrendingUp className="w-4 h-4 text-[#9AE66E]" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-white font-semibold capitalize">{tx.type}</div>
                    <div className="text-[#B3B3B3] text-sm">
                      {tx.asset} • {tx.network}
                    </div>
                    <div className="text-[#B3B3B3] text-xs">
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    tx.type === 'incoming' ? 'text-[#9AE66E]' : 'text-red-400'
                  }`}>
                    {tx.type === 'incoming' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <Badge variant={tx.status === 'CONFIRMED' ? 'default' : 'secondary'}
                           className={tx.status === 'CONFIRMED' ? 'bg-[#9AE66E]/10 text-[#9AE66E]' : 'bg-yellow-400/10 text-yellow-400'}>
                      {tx.status.toLowerCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <span className="text-[#B3B3B3] text-xs font-mono">
                      {tx.txHash.slice(0, 8)}...{tx.txHash.slice(-6)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyTxHash(tx.txHash)}
                      className="text-[#ECE147] hover:text-[#ECE147]/80 h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(getExplorerUrl(tx.network, tx.txHash), '_blank')}
                      className="text-[#ECE147] hover:text-[#ECE147]/80 h-6 w-6 p-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};