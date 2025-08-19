
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const PayrollWidget: React.FC = () => {
  const [teamSize, setTeamSize] = useState<string>('5');
  const [chain, setChain] = useState<string>('ethereum');
  const [amount, setAmount] = useState<string>('2500');
  const [estimatedTotal, setEstimatedTotal] = useState<number | null>(null);

  const calculateEstimate = () => {
    const total = parseInt(teamSize) * parseFloat(amount);
    setEstimatedTotal(total);
  };

  return (
    <div className="bg-coinomad-card border border-coinomad-border rounded-lg p-6 md:p-8">
      <h3 className="text-xl font-semibold mb-6">Estimate Your Monthly Payroll</h3>
      
      <div className="space-y-5">
        <div>
          <label htmlFor="team-size" className="text-sm text-coinomad-textGray block mb-2">
            Team Size
          </label>
          <Input
            id="team-size"
            type="number"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className="bg-black border-coinomad-border focus:border-coinomad-primary"
            placeholder="Enter team size"
          />
        </div>

        <div>
          <label htmlFor="chain" className="text-sm text-coinomad-textGray block mb-2">
            Blockchain & Currency
          </label>
          <Select value={chain} onValueChange={setChain}>
            <SelectTrigger className="bg-black border-coinomad-border focus:border-coinomad-primary">
              <SelectValue placeholder="Select chain" />
            </SelectTrigger>
            <SelectContent className="bg-coinomad-card border-coinomad-border">
              <SelectItem value="ethereum">Ethereum (USDC)</SelectItem>
              <SelectItem value="solana">Solana (USDC)</SelectItem>
              <SelectItem value="polygon">Polygon (USDT)</SelectItem>
              <SelectItem value="celo">Celo (cUSD)</SelectItem>
              <SelectItem value="stellar">Stellar (XLM)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="amount" className="text-sm text-coinomad-textGray block mb-2">
            Amount Per Employee (USD)
          </label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-black border-coinomad-border focus:border-coinomad-primary"
            placeholder="Amount per employee"
          />
        </div>

        <Button 
          onClick={calculateEstimate} 
          className="w-full bg-coinomad-primary hover:bg-coinomad-primary text-black font-medium neon-glow-primary hover:scale-105 transition-transform duration-200"
        >
          Estimate Monthly Payout
        </Button>

        {estimatedTotal !== null && (
          <div className="mt-6 text-center p-4 border border-coinomad-primary rounded bg-black bg-opacity-50">
            <p className="text-sm text-coinomad-textGray mb-1">Estimated Monthly Payout</p>
            <p className="text-2xl font-bold text-coinomad-primary">${estimatedTotal.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollWidget;
