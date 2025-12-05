
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { payrollAPI } from '@/Data/payrollAPI';

type ChartPoint = { label: string; crypto: number; fiat?: number };
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const getDaySuffix = (d: number) => {
  if (d % 10 === 1 && d % 100 !== 11) return 'st';
  if (d % 10 === 2 && d % 100 !== 12) return 'nd';
  if (d % 10 === 3 && d % 100 !== 13) return 'rd';
  return 'th';
};
const formatDailyLabel = (pt: any, idx: number) => {
  // Try explicit day field
  const day = typeof pt?.day === 'number' ? pt.day : undefined;
  if (typeof day === 'number' && day >= 1 && day <= 31) return `${day}${getDaySuffix(day)}`;
  // Try date or timestamp
  const rawDate = pt?.date ?? pt?.timestamp ?? pt?.createdAt;
  const d = rawDate ? new Date(rawDate) : null;
  const dom = d && !isNaN(d.getTime()) ? d.getDate() : (idx + 1);
  return `${dom}${getDaySuffix(dom)}`;
};
const formatWeeklyLabel = (pt: any, idx: number) => {
  const weekNumber = typeof pt?.week === 'number' ? pt.week : (typeof pt?.weekNumber === 'number' ? pt.weekNumber : (idx + 1));
  return `Week ${weekNumber}`;
};
const formatMonthlyLabel = (pt: any, idx: number) => {
  if (typeof pt?.month === 'number') {
    const i = Math.max(1, Math.min(12, pt.month)) - 1;
    return monthNames[i];
  }
  if (typeof pt?.month === 'string') {
    // Normalize common month strings
    const m = pt.month.slice(0, 3);
    const found = monthNames.find((n) => n.toLowerCase() === m.toLowerCase());
    return found ?? m;
  }
  const rawDate = pt?.date ?? pt?.timestamp ?? pt?.createdAt;
  const d = rawDate ? new Date(rawDate) : null;
  if (d && !isNaN(d.getTime())) return monthNames[d.getMonth()];
  return monthNames[Math.min(idx, 11)];
};
const formatLabel = (type: 'daily' | 'weekly' | 'monthly', idx: number, pt?: any) => {
  if (typeof pt?.label === 'string') return pt.label;
  if (type === 'daily') return formatDailyLabel(pt, idx);
  if (type === 'weekly') return formatWeeklyLabel(pt, idx);
  return formatMonthlyLabel(pt, idx);
};

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
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapPeriod = (p: string): 'daily' | 'weekly' | 'monthly' => {
    const key = p.toLowerCase();
    if (key.startsWith('day')) return 'daily';
    if (key.startsWith('week')) return 'weekly';
    return 'monthly';
  };

  useEffect(() => {
    const fetchGraph = async () => {
      setLoading(true);
      setError(null);
      const type = mapPeriod(selectedPeriod);
      try {
        const res = await payrollAPI.getGraphs(type);
        const payload = res?.data;
        const points = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.points)
            ? payload.points
            : Array.isArray(payload)
              ? payload
              : [];
        const normalized: ChartPoint[] = points.map((pt: any, idx: number) => ({
          label: formatLabel(type, idx, pt),
          crypto: Number(pt?.crypto ?? pt?.value ?? pt?.amount ?? 0),
          fiat: typeof pt?.fiat === 'number' ? pt.fiat : undefined,
        }));
        setChartData(normalized);
      } catch (e) {
        setError('Failed to load graph data');
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, [selectedPeriod]);

  return (
    <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-white">
          Monthly Payroll Volume
        </CardTitle>
        <div className="flex space-x-1 bg-[#0D0D0D] border border-stone-300/25 rounded-[15px] py-2 px-9">
          {periods.map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPeriodChange(period)}
              className={`text-xs h-[29px] rounded-[10px] ${selectedPeriod === period
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
        {error && (
          <div className="w-full h-[300px] flex items-center justify-center text-red-400">
            Failed to load graph data
          </div>
        )}
        {!error && loading && (
          <div className="w-full h-[300px] flex items-center justify-center text-[#B3B3B3]">
            Loading payroll data…
          </div>
        )}
        {!error && !loading && chartData.length === 0 && (
          <div className="w-full h-[300px] flex items-center justify-center text-[#B3B3B3]">
            No payroll data available yet
          </div>
        )}
        {!error && !loading && chartData.length > 0 && (
          <ChartContainer config={chartConfig} className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="cryptoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ECE147" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ECE147" stopOpacity={0} />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <CartesianGrid stroke="#444" strokeDasharray="4 4" />

                {/* X Axis */}
                <XAxis
                  dataKey="label"
                  axisLine={{ stroke: '#FFFFFF', strokeWidth: 1 }}
                  tickLine={false}
                  tick={{ fill: '#FFFFFF', fontSize: 12, style: { fill: '#FFFFFF' } }}
                  tickMargin={20}
                />

                {/* Y Axis */}
                <YAxis
                  axisLine={{ stroke: '#FFFFFF', strokeWidth: 1 }}
                  tickLine={false}
                  tick={{ fill: '#FFFFFF', fontSize: 12, style: { fill: '#FFFFFF' } }}
                  tickMargin={20}
                  tickFormatter={(value) => `₿${(value / 1000).toFixed(1)}k`}
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
        )}
      </CardContent>
    </Card>
  );
};
