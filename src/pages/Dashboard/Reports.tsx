import React, { useMemo, useState, useEffect } from "react";
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Area, AreaChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { EmployeeIcon, ClockIcon, CoinIcon } from '@/components/icons';
import { CryptoIcon } from '@/components/icons';
import { DynamicBarChart } from '@/components/charts/BarChart';
import { reportAPI } from '@/Data/reportAPI';

const periods = ["Day", "Week", "Month", "All Time"] as const;
type Period = (typeof periods)[number];

const dailyPayroll = [
  { label: "Mon", amount: 4200 },
  { label: "Tue", amount: 3800 },
  { label: "Wed", amount: 4600 },
  { label: "Thu", amount: 5100 },
  { label: "Fri", amount: 4800 },
  { label: "Sat", amount: 3000 },
  { label: "Sun", amount: 2200 },
];

const weeklyPayroll = [
  { label: "W1", amount: 28000 },
  { label: "W2", amount: 30500 },
  { label: "W3", amount: 29200 },
  { label: "W4", amount: 31000 },
  { label: "W5", amount: 29800 },
];

const monthlyPayroll = [
  { month: "Jan", amount: 125000, employees: 98 },
  { month: "Feb", amount: 132000, employees: 102 },
  { month: "Mar", amount: 145000, employees: 105 },
  { month: "Apr", amount: 138000, employees: 104 },
  { month: "May", amount: 155000, employees: 108 },
  { month: "Jun", amount: 162000, employees: 112 },
  { month: "Jul", amount: 158000, employees: 110 },
  { month: "Aug", amount: 166000, employees: 113 },
  { month: "Sep", amount: 150000, employees: 109 },
  { month: "Oct", amount: 172000, employees: 115 },
  { month: "Nov", amount: 165000, employees: 111 },
  { month: "Dec", amount: 180000, employees: 118 },
];

const allTimePayroll = [
  { label: "2019", amount: 900000 },
  { label: "2020", amount: 980000 },
  { label: "2021", amount: 1_120_000 },
  { label: "2022", amount: 1_260_000 },
  { label: "2023", amount: 1_420_000 },
  { label: "2024", amount: 1_580_000 },
];

const payrollData = [
  { month: "Jan", amount: 125000, employees: 98 },
  { month: "Feb", amount: 132000, employees: 102 },
  { month: "Mar", amount: 145000, employees: 105 },
  { month: "Apr", amount: 138000, employees: 104 },
  { month: "May", amount: 155000, employees: 108 },
  { month: "Jun", amount: 162000, employees: 112 },
  { month: "Jul", amount: 168000, employees: 115 },
  { month: "Aug", amount: 172500, employees: 117 },
  { month: "Sep", amount: 170000, employees: 116 },
  { month: "Oct", amount: 178500, employees: 119 },
  { month: "Nov", amount: 185000, employees: 121 },
  { month: "Dec", amount: 195000, employees: 125 },
]

const assetDistribution = [
  { name: 'USDT', value: 45, amount: 1450000 },
  { name: 'USDC', value: 35, amount: 1130000 },
  { name: 'CUSD', value: 20, amount: 645000 },
];

const networkData = [
  { network: 'Ethereum', transactions: 245, volume: 1200000, symbol: 'eth' },
  { network: 'Polygon', transactions: 189, volume: 890000, symbol: 'polygon' },
  { network: 'Base', transactions: 156, volume: 750000, symbol: 'base' },
  { network: 'BTC', transactions: 98, volume: 485000, symbol: 'btc' },
];

const employeeLocationData = [
  { location: "HQ", employees: 120 },
  { location: "NY Office", employees: 85 },
  { location: "Nigeria", employees: 150 },
  { location: "London", employees: 95 },
  { location: "Remote", employees: 300 },
]

const COLORS = ['#ECE147', '#9AE66E', '#B3B3B3', '#2C2C2C'];

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("Month");
  const [amountPaid, setAmountPaid] = useState<string>('USD 0.00');
  const [amountPaidRaw, setAmountPaidRaw] = useState<number>(0);
  const [activeEmployees, setActiveEmployees] = useState<number>(0);
  const [transactions, setTransactions] = useState<number>(0);

  useEffect(() => {
    const fetchReportStats = async () => {
      try {
        const res = await reportAPI.getReportStats();
        const data = res?.data || {};
        const paid = Number(data.amountPaid ?? 0);
        setAmountPaidRaw(paid);
        setAmountPaid(`USD ${paid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        setActiveEmployees(Number(data.activeEmployees ?? 0));
        setTransactions(Number(data.transaction ?? 0));
      } catch (e) {
        // keep defaults on error
        setAmountPaid('USD 0.00');
        setAmountPaidRaw(0);
        setActiveEmployees(0);
        setTransactions(0);
      }
    };
    fetchReportStats();
  }, []);

  const avgPerTxn = useMemo(() => {
    return transactions > 0 ? amountPaidRaw / transactions : 0;
  }, [amountPaidRaw, transactions]);

  const txnsPerEmployee = useMemo(() => {
    return activeEmployees > 0 ? transactions / activeEmployees : 0;
  }, [transactions, activeEmployees]);

  // Normalize data shape for Recharts (use `label` as x-axis key)
  const chartData = useMemo(() => {
    switch (selectedPeriod) {
      case "Day":
        return dailyPayroll.map((d) => ({ label: d.label, amount: d.amount }));
      case "Week":
        return weeklyPayroll.map((d) => ({ label: d.label, amount: d.amount }));
      case "All Time":
        return allTimePayroll.map((d) => ({ label: d.label, amount: d.amount }));
      case "Month":
      default:
        return monthlyPayroll.map((d) => ({ label: d.month, amount: d.amount }));
    }
  }, [selectedPeriod]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white px-9 pt-8">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-[#B3B3B3]">Comprehensive insights into your payroll operations</p>
        </div>

        {/* Report Controls */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center">
          <Select defaultValue="3months">
            <SelectTrigger className="w-full sm:w-48 bg-[#1A1A1A] border-[#2C2C2C] text-white rounded-[12px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[#2C2C2C] rounded-[12px]">
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-[#ECE147] text-black hover:bg-[#ECE147]/90 rounded-[12px] w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[#1A1A1A] border-[#2C2C2C] py-3 px-[10px] rounded-[10px] w-full flex-nowrap items-center justify-start gap-2 overflow-x-auto">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-[#ECE147] data-[state=active]:text-black rounded-[10px] whitespace-nowrap shrink-0">
              Overview
            </TabsTrigger>
            <TabsTrigger value="payroll" className="text-white data-[state=active]:bg-[#ECE147] data-[state=active]:text-black rounded-[10px] whitespace-nowrap shrink-0">
              Payroll Analysis
            </TabsTrigger>
            <TabsTrigger value="assets" className="text-white data-[state=active]:bg-[#ECE147] data-[state=active]:text-black rounded-[10px] whitespace-nowrap shrink-0">
              Asset Distribution
            </TabsTrigger>
            <TabsTrigger value="networks" className="text-white data-[state=active]:bg-[#ECE147] data-[state=active]:text-black rounded-[10px] whitespace-nowrap shrink-0">
              Network Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#B3B3B3] text-sm font-normal flex items-center">
                    {/* <DollarSign className="w-4 h-4 mr-2 text-[#ECE147]" /> */}
                    <CoinIcon className="mr-2" />
                    Total Payroll Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{amountPaid}</div>
                  <div className="text-sm text-[#9AE66E] flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Avg per transaction: USD {avgPerTxn.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#B3B3B3] text-sm font-normal flex items-center">
                    <EmployeeIcon className="mr-2" />
                    Active Employees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{activeEmployees}</div>
                  <div className="text-sm text-[#9AE66E] flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Transactions per employee: {txnsPerEmployee.toFixed(1)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#B3B3B3] text-sm font-normal flex items-center">
                    <FileText className="w-4 h-4 mr-2 " />
                    Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{transactions}</div>
                  <div className="text-sm text-[#B3B3B3] mt-1">This period</div>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#B3B3B3] text-sm font-normal flex items-center">
                    <ClockIcon />
                    Avg Processing Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">0.00 min</div>
                  <div className="text-sm text-[#9AE66E] flex items-center mt-1">
                    Transactions this period: {transactions}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payroll Trends */}
            <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-white">Payroll Trends</CardTitle>
                <div className="flex flex-nowrap gap-1 bg-[#0D0D0D] border border-stone-300/25 rounded-[15px] py-2 px-3 w-full sm:w-auto overflow-x-auto">
                  {periods.map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedPeriod(period)}
                      className={`text-xs h-[29px] rounded-[10px] px-3 ${selectedPeriod === period
                        ? "bg-[#ECE147] text-black hover:bg-[#ECE147]/90"
                        : "text-[#B3B3B3] hover:text-white hover:bg-[#2C2C2C]"
                        }`}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="pb-4 sm:pb-6">
                <div className="h-[220px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ left: -12, right: 8, top: 8, bottom: 0 }}
                    >
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        {/* Top bright yellow but with opacity like Tailwind */}
                        <stop offset="30%" stopColor="#FACC15" stopOpacity={0.4} />
                        {/* Bottom fades to dark stone-ish color */}
                        <stop offset="76%" stopColor="#1C1917" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />

                    <XAxis
                      dataKey="month"
                      axisLine={{ stroke: "#FFFFFF", strokeWidth: 1 }}
                      tick={{ fill: "#FFFFFF", fontSize: 12 }}
                      tickLine={false}
                    />

                    <YAxis
                      axisLine={{ stroke: "#FFFFFF", strokeWidth: 1 }}
                      tick={{ fill: "#FFFFFF", fontSize: 12 }}
                      tickLine={false}
                      tickFormatter={(v) =>
                        v >= 1_000_000
                          ? `${(v / 1_000_000).toFixed(1)}M`
                          : v >= 1000
                            ? `${(v / 1000).toFixed(0)}k`
                            : `${v}`
                      }
                    />

                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#ECE147"
                      strokeWidth={3}
                      fill="url(#areaGradient)"
                      dot={{ fill: "#ECE147", r: 4 }}
                      activeDot={{ r: 6, stroke: "#0D0D0D", strokeWidth: 2 }}
                    />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <div className="relative w-full bg-stone-900 rounded-[20px] p-4 sm:p-6">
              <CardHeader>
                <CardTitle className="text-white">Employee Distribution by Location</CardTitle>
                <CardDescription className="text-white">Current employee count by office location</CardDescription>
              </CardHeader>
              <DynamicBarChart
                data={employeeLocationData}
                dataKey="employees"
                labelKey="location"
                title="Employees by Location"
                color="#F7EE24"
                heightClassName="h-[170px] sm:h-[320px]"
                showGrid={true}
                showYAxis={true}
                className="w-full"
              />
              <p className="flex items-center justify-center">Employees</p>
            </div>
          </TabsContent>

          <TabsContent value="payroll" className="space-y-6">
            <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-white">Payroll Volume</CardTitle>

                <div className="flex flex-nowrap gap-1 bg-[#0D0D0D] border border-stone-300/25 rounded-[15px] py-2 px-3 w-full sm:w-auto overflow-x-auto">
                  {periods.map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedPeriod(period)}
                      className={`text-xs h-[29px] rounded-[10px] px-3 ${selectedPeriod === period
                        ? "bg-[#ECE147] text-black hover:bg-[#ECE147]/90"
                        : "text-[#B3B3B3] hover:text-white hover:bg-[#2C2C2C]"
                        }`}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="pb-4 sm:pb-6">
                <div className="h-[220px] sm:h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
                      <XAxis dataKey="month" axisLine={{ stroke: '#FFFFFF', strokeWidth: 1 }} tick={{ fill: '#FFFFFF', fontSize: 12, style: { fill: '#FFFFFF' } }} />
                      <YAxis axisLine={{ stroke: '#FFFFFF', strokeWidth: 1 }} tick={{ fill: '#FFFFFF', fontSize: 12, style: { fill: '#FFFFFF' } }} tickFormatter={(v) =>
                        // format big numbers smartly
                        v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                      } />
                      <Bar dataKey="amount" fill="#ECE147" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
                <CardHeader>
                  <CardTitle className="text-white">Asset Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px] sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={assetDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {assetDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
                <CardHeader>
                  <CardTitle className="text-white">Asset Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assetDistribution.map((asset, index) => (
                    <div key={asset.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-white">{asset.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">${asset.amount.toLocaleString()}</div>
                        <div className="text-[#B3B3B3] text-sm">{asset.value}%</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="networks" className="space-y-6">
            <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
              <CardHeader>
                <CardTitle className="text-white">Network Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {networkData.map((network) => (
                    <div key={network.network} className="flex flex-col gap-3 p-4 bg-[#0D0D0D] rounded-lg border border-[#2C2C2C] sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-3">
                        {/* Crypto icon by symbol */}
                        <CryptoIcon symbol={network.symbol as any} size={28} color="#ECE147" className="shrink-0" />
                        <div>
                          <div className="text-white font-semibold">{network.network}</div>
                          <div className="text-[#B3B3B3] text-sm">{network.transactions} transactions</div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-white font-semibold">${network.volume.toLocaleString()}</div>
                        <div className="text-[#B3B3B3] text-sm">Volume</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
