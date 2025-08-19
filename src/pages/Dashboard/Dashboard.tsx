import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { authAPI } from '@/Data/authAPI';
import axiosInstance from '../../Data/axiosInstance';
import { Copy, QrCode, TrendingUp, TrendingDown, Wallet, RefreshCw, History } from 'lucide-react';
import { QRCodeDialog } from '@/components/QRCodeDialog';
import { toast } from '@/hooks/use-toast';
import { TransactionDetailsDialog } from '@/components/TransactionDetailsDialog';
import { TransactionHistoryDialog } from '@/components/TransactionHistoryDialog';


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

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [selectedWallet, setSelectedWallet] = useState('base');
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrAddress, setQrAddress] = useState('');
  const [wallets, setWallets] = useState<Record<string, any>>({});
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await axiosInstance.get('/wallet/transactions');
        const transactionsArray = data.transactions || [];
        if (Array.isArray(transactionsArray)) {
          setAllTransactions(transactionsArray);
          setTransactions(transactionsArray.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast({ 
          title: "Error", 
          description: error instanceof Error ? error.message : 'Failed to load transactions'
        });
      }
    };
    
    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchWalletBalances = async () => {
      try {
        const { data } = await axiosInstance.get('/wallet/balance');
        setWallets(data);
      } catch (error) {
        console.error('Error fetching wallet balances:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to load wallet balances'
        });
      }
    };

    fetchWalletBalances();
    const interval = setInterval(fetchWalletBalances, 30000);
    return () => clearInterval(interval);
  }, []);

  // Remove hardcoded wallets object

  const totalBalance = Object.values(wallets).reduce((total: number, wallet: any) => {
    return total + (wallet.assets?.USDT?.balance || 0) + (wallet.assets?.USDC?.balance || 0);
  }, 0);

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address copied!",
      description: "Wallet address copied to clipboard",
    });
  };

  const showQR = (address: string) => {
    setQrAddress(address);
    setShowQRCode(true);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />
      
      <main className="px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-[#B3B3B3]">Monitor your crypto balances and transaction history</p>
        </div>

        {/* Total Balance Card */}
        <Card className="bg-[#1A1A1A] border-[#2C2C2C] mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#ECE147]" />
              Total Portfolio Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            {/* <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#9AE66E]" />
              <span className="text-[#9AE66E] text-sm">+4.2% this month</span>
            </div> */}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Wallet Balances */}
          <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
            <CardHeader>
              <CardTitle className="text-white">Wallet Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedWallet} onValueChange={setSelectedWallet}>
                <TabsList className="grid w-full grid-cols-4 bg-[#2C2C2C]">
                  {Object.entries(wallets).map(([key, wallet]) => (
                    <TabsTrigger key={key} value={key} className="text-white data-[state=active]:bg-[#ECE147] data-[state=active]:text-black">
                      {wallet.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(wallets).map(([key, wallet]) => (
                  <TabsContent key={key} value={key} className="mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-[#2C2C2C] rounded-lg">
                        <span className="text-[#B3B3B3] text-sm">Wallet Address</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono text-sm">
                            {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyAddress(wallet.address)}
                            className="text-[#ECE147] hover:text-[#ECE147]/80"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => showQR(wallet.address)}
                            className="text-[#ECE147] hover:text-[#ECE147]/80"
                          >
                            <QrCode className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {Object.entries(wallet.assets).map(([asset, data]) => (
                          <div key={asset} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#ECE147]/10 rounded-full flex items-center justify-center">
                                  <span className="flex items-center gap-1">
                                    {asset === 'USDC' && (
                                      <img src="/src/assets/usdc.png" alt="USDC" className="w-10 inline-block" />
                                    )}
                                    {asset === 'USDT' && (
                                      <img src="/src/assets/usdt.png" alt="USDT" className="w-10 inline-block" />
                                    )}
                                  </span>
                                </div>
                              <div>
                                <div className="text-white font-semibold">{asset}</div>
                                <div className="text-[#B3B3B3] text-sm">{wallet.name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold">
                                ${(data as { balance: number }).balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </div>
                              {/* <div className={`text-sm flex items-center gap-1 ${
                                data.isPositive ? 'text-[#9AE66E]' : 'text-red-400'
                              }`}>
                                {data.isPositive ? (
                                  <TrendingUp className="w-3 h-3" />
                                ) : (
                                  <TrendingDown className="w-3 h-3" />
                                )}
                                {data.change}
                              </div> */}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Recent Transactions</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#ECE147] hover:text-[#ECE147]/80"
                  onClick={() => setShowTransactionHistory(true)}
                >
                  <History className="w-4 h-4" />
                  <span className="ml-1">Full History</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-[#ECE147] hover:text-[#ECE147]/80">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div 
                    key={tx.transactionId} 
                    className="flex items-center justify-between p-3 bg-[#2C2C2C] rounded-lg cursor-pointer hover:bg-[#3C3C3C] transition-colors"
                    onClick={() => {
                      setSelectedTransaction(tx);
                      setShowTransactionDetails(true);
                    }}
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
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        tx.type === 'incoming' ? 'text-[#9AE66E]' : 'text-red-400'
                      }`}>
                        {tx.type === 'incoming' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={tx.status === 'CONFIRMED' ? 'default' : 'secondary'}
                               className={tx.status === 'CONFIRMED' ? 'bg-[#9AE66E]/10 text-[#9AE66E]' : 'bg-yellow-400/10 text-yellow-400'}>
                          {tx.status.toLowerCase()}
                        </Badge>
                        <span className="text-[#B3B3B3] text-xs">
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <TransactionDetailsDialog 
                  isOpen={showTransactionDetails} 
                  onClose={() => setShowTransactionDetails(false)} 
                  transaction={selectedTransaction} 
                />

                <TransactionHistoryDialog
                  isOpen={showTransactionHistory}
                  onClose={() => setShowTransactionHistory(false)}
                  transactions={allTransactions}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <QRCodeDialog 
        isOpen={showQRCode} 
        onClose={() => setShowQRCode(false)} 
        address={qrAddress} 
      />
    </div>
  );
};

export default Dashboard;