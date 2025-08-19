
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

const payrollData = [
  { month: 'Jan', amount: 125000, employees: 98 },
  { month: 'Feb', amount: 132000, employees: 102 },
  { month: 'Mar', amount: 145000, employees: 105 },
  { month: 'Apr', amount: 138000, employees: 104 },
  { month: 'May', amount: 155000, employees: 108 },
  { month: 'Jun', amount: 162000, employees: 112 },
];

const assetDistribution = [
  { name: 'USDT', value: 45, amount: 1450000 },
  { name: 'USDC', value: 35, amount: 1130000 },
  { name: 'CUSD', value: 20, amount: 645000 },
];

const networkData = [
  { network: 'Ethereum', transactions: 245, volume: 1200000 },
  { network: 'Polygon', transactions: 189, volume: 890000 },
  { network: 'Base', transactions: 156, volume: 750000 },
  { network: 'Celo', transactions: 98, volume: 485000 },
];

const COLORS = ['#ECE147', '#9AE66E', '#B3B3B3', '#2C2C2C'];

const Reports = () => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-[#B3B3B3]">Comprehensive insights into your payroll operations</p>
        </div>

        {/* Report Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <Select defaultValue="3months">
            <SelectTrigger className="w-48 bg-[#1A1A1A] border-[#2C2C2C] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[#2C2C2C]">
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="bg-[#ECE147] text-black hover:bg-[#ECE147]/90">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[#1A1A1A] border-[#2C2C2C]">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-[#ECE147] data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="payroll" className="text-white data-[state=active]:bg-[#ECE147] data-[state=active]:text-black">
              Payroll Analysis
            </TabsTrigger>
            <TabsTrigger value="assets" className="text-white data-[state=active]:bg-[#ECE147] data-[state=active]:text-black">
              Asset Distribution
            </TabsTrigger>
            <TabsTrigger value="networks" className="text-white data-[state=active]:bg-[#ECE147] data-[state=active]:text-black">
              Network Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#B3B3B3] text-sm font-normal flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-[#ECE147]" />
                    Total Payroll Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">$957,000</div>
                  <div className="text-sm text-[#9AE66E] flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12.5% vs last period
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#B3B3B3] text-sm font-normal flex items-center">
                    <Users className="w-4 h-4 mr-2 text-[#ECE147]" />
                    Active Employees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">112</div>
                  <div className="text-sm text-[#9AE66E] flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +4 new hires
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#B3B3B3] text-sm font-normal flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-[#ECE147]" />
                    Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">688</div>
                  <div className="text-sm text-[#B3B3B3] mt-1">This period</div>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#B3B3B3] text-sm font-normal flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-[#ECE147]" />
                    Avg Processing Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">2.3 min</div>
                  <div className="text-sm text-[#9AE66E] flex items-center mt-1">
                    -15% faster
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payroll Trends */}
            <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
              <CardHeader>
                <CardTitle className="text-white">Payroll Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={payrollData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
                    <XAxis dataKey="month" stroke="#B3B3B3" />
                    <YAxis stroke="#B3B3B3" />
                    <Line type="monotone" dataKey="amount" stroke="#ECE147" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payroll" className="space-y-6">
            <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
              <CardHeader>
                <CardTitle className="text-white">Monthly Payroll Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={payrollData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
                    <XAxis dataKey="month" stroke="#B3B3B3" />
                    <YAxis stroke="#B3B3B3" />
                    <Bar dataKey="amount" fill="#ECE147" />
                  </BarChart>
                </ResponsiveContainer>
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
                  <ResponsiveContainer width="100%" height={300}>
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
                    <div key={network.network} className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-lg border border-[#2C2C2C]">
                      <div>
                        <div className="text-white font-semibold">{network.network}</div>
                        <div className="text-[#B3B3B3] text-sm">{network.transactions} transactions</div>
                      </div>
                      <div className="text-right">
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
