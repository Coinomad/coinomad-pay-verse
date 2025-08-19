
import { TrendingUp, TrendingDown, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const StatsCards = () => {
  const stats = [
    {
      title: 'Monthly Payroll (Crypto)',
      value: '₿3,230.25',
      fiatValue: '$3,230,250.00',
      change: '+12.5%',
      isPositive: true,
      icon: TrendingUp
    },
    {
      title: 'Employees Paid This Month',
      value: '104',
      change: '+8 new',
      isPositive: true,
      icon: Users
    }
  ];

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-[#1A1A1A] border-[#2C2C2C] p-6">
          <CardContent className="p-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-[#ECE147]/10 rounded-lg">
                  <stat.icon className="w-4 h-4 text-[#ECE147]" />
                </div>
                <h3 className="text-sm font-medium text-[#B3B3B3]">{stat.title}</h3>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              {stat.fiatValue && (
                <p className="text-sm text-[#B3B3B3]">{stat.fiatValue}</p>
              )}
            </div>
            
            <div className="flex items-center justify-end mt-4">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${
                stat.isPositive 
                  ? 'bg-[#9AE66E]/10 text-[#9AE66E]' 
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {stat.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
