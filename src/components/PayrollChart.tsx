
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const chartData = [
  { month: 'Jan', crypto: 2800, fiat: 2800000 },
  { month: 'Feb', crypto: 3100, fiat: 3100000 },
  { month: 'Mar', crypto: 2900, fiat: 2900000 },
  { month: 'Apr', crypto: 3300, fiat: 3300000 },
  { month: 'May', crypto: 3100, fiat: 3100000 },
  { month: 'Jun', crypto: 3400, fiat: 3400000 },
  { month: 'Jul', crypto: 3200, fiat: 3200000 },
  { month: 'Aug', crypto: 3500, fiat: 3500000 },
  { month: 'Sep', crypto: 3230, fiat: 3230000 }
];

const chartConfig = {
  crypto: {
    label: 'Crypto Volume',
    color: '#ECE147'
  },
  fiat: {
    label: 'Fiat Volume',
    color: '#9AE66E'
  }
};

interface PayrollChartProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export const PayrollChart = ({ selectedPeriod, onPeriodChange }: PayrollChartProps) => {
  const periods = ['Day', 'Week', 'Month'];

  return (
    <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-white">
          Monthly Payroll Volume
        </CardTitle>
        <div className="flex space-x-1 bg-[#0D0D0D] rounded-lg p-1">
          {periods.map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPeriodChange(period)}
              className={`text-xs ${
                selectedPeriod === period
                  ? 'bg-[#ECE147] text-black hover:bg-[#ECE147]/90'
                  : 'text-[#B3B3B3] hover:text-white hover:bg-[#2C2C2C]'
              }`}
            >
              {period}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="cryptoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ECE147" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ECE147" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#B3B3B3', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#B3B3B3', fontSize: 12 }}
                tickFormatter={(value) => `₿${(value/1000).toFixed(1)}k`}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ stroke: '#ECE147', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="crypto"
                stroke="#ECE147"
                strokeWidth={2}
                fill="url(#cryptoGradient)"
                dot={{ fill: '#ECE147', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#ECE147', stroke: '#0D0D0D', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
