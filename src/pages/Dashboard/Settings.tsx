
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Shield, 
  Bell, 
  Wallet, 
  Settings as SettingsIcon, 
  Save,
  Key,
  Globe,
  Moon,
  Smartphone
} from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-[#B3B3B3]">Manage your account preferences and security settings</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-[#1A1A1A] border-[#2C2C2C]">
            <TabsTrigger value="profile" className="text-white data-[state=active]:bg-[#ECE147] data-[state=active]:text-black">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="text-white data-[state=active]:bg-[#ECE147] data-[state=active]:text-black">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-[#ECE147] data-[state=active]:text-black">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="wallets" className="text-white data-[state=active]:bg-[#ECE147] data-[state=active]:text-black">
              <Wallet className="w-4 h-4 mr-2" />
              Wallets
            </TabsTrigger>
            <TabsTrigger value="preferences" className="text-white data-[state=active]:bg-[#ECE147] data-[state=active]:text-black">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 rounded-full bg-[#ECE147] flex items-center justify-center">
                    <User className="w-8 h-8 text-black" />
                  </div>
                  <Button variant="outline" className="border-[#2C2C2C] text-white hover:bg-[#2C2C2C]">
                    Change Avatar
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white">First Name</Label>
                    <Input 
                      id="firstName" 
                      defaultValue="John" 
                      className="bg-[#0D0D0D] border-[#2C2C2C] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white">Last Name</Label>
                    <Input 
                      id="lastName" 
                      defaultValue="Doe" 
                      className="bg-[#0D0D0D] border-[#2C2C2C] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      defaultValue="john.doe@company.com" 
                      className="bg-[#0D0D0D] border-[#2C2C2C] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-white">Role</Label>
                    <Select defaultValue="admin">
                      <SelectTrigger className="bg-[#0D0D0D] border-[#2C2C2C] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-[#2C2C2C]">
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="hr">HR Manager</SelectItem>
                        <SelectItem value="finance">Finance Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button className="bg-[#ECE147] text-black hover:bg-[#ECE147]/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
              <CardHeader>
                <CardTitle className="text-white">Password & Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      className="bg-[#0D0D0D] border-[#2C2C2C] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-white">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      className="bg-[#0D0D0D] border-[#2C2C2C] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      className="bg-[#0D0D0D] border-[#2C2C2C] text-white"
                    />
                  </div>
                </div>
                
                <Separator className="bg-[#2C2C2C]" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-white font-medium">Two-Factor Authentication</div>
                      <div className="text-[#B3B3B3] text-sm">Add an extra layer of security to your account</div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-white font-medium flex items-center">
                        <Key className="w-4 h-4 mr-2 text-[#ECE147]" />
                        API Keys
                      </div>
                      <div className="text-[#B3B3B3] text-sm">Manage API access keys</div>
                    </div>
                    <Button variant="outline" className="border-[#2C2C2C] text-white hover:bg-[#2C2C2C]">
                      Manage
                    </Button>
                  </div>
                </div>
                
                <Button className="bg-[#ECE147] text-black hover:bg-[#ECE147]/90">
                  Update Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-white font-medium">Email Notifications</div>
                      <div className="text-[#B3B3B3] text-sm">Receive notifications via email</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-white font-medium">Payroll Alerts</div>
                      <div className="text-[#B3B3B3] text-sm">Get notified about payroll events</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-white font-medium">Transaction Updates</div>
                      <div className="text-[#B3B3B3] text-sm">Notifications for successful transactions</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-white font-medium">Security Alerts</div>
                      <div className="text-[#B3B3B3] text-sm">Important security notifications</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-white font-medium flex items-center">
                        <Smartphone className="w-4 h-4 mr-2 text-[#ECE147]" />
                        Push Notifications
                      </div>
                      <div className="text-[#B3B3B3] text-sm">Mobile push notifications</div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallets" className="space-y-6">
            <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
              <CardHeader>
                <CardTitle className="text-white">Connected Wallets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { network: 'Ethereum', address: '0x742d35Cc6634C0532925a3b8D', status: 'Connected' },
                  { network: 'Polygon', address: '0x742d35Cc6634C0532925a3b8D', status: 'Connected' },
                  { network: 'Base', address: '0x742d35Cc6634C0532925a3b8D', status: 'Connected' },
                  { network: 'Celo', address: '0x742d35Cc6634C0532925a3b8D', status: 'Disconnected' },
                ].map((wallet) => (
                  <div key={wallet.network} className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-lg border border-[#2C2C2C]">
                    <div>
                      <div className="text-white font-semibold">{wallet.network}</div>
                      <div className="text-[#B3B3B3] text-sm font-mono">{wallet.address}...</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        wallet.status === 'Connected' 
                          ? 'bg-[#9AE66E]/20 text-[#9AE66E]' 
                          : 'bg-[#B3B3B3]/20 text-[#B3B3B3]'
                      }`}>
                        {wallet.status}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-[#2C2C2C] text-white hover:bg-[#2C2C2C]"
                      >
                        {wallet.status === 'Connected' ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="bg-[#1A1A1A] border-[#2C2C2C]">
              <CardHeader>
                <CardTitle className="text-white">General Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-white flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-[#ECE147]" />
                      Timezone
                    </Label>
                    <Select defaultValue="utc">
                      <SelectTrigger className="bg-[#0D0D0D] border-[#2C2C2C] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-[#2C2C2C]">
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time</SelectItem>
                        <SelectItem value="pst">Pacific Time</SelectItem>
                        <SelectItem value="cet">Central European Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-white">Default Currency Display</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger className="bg-[#0D0D0D] border-[#2C2C2C] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-[#2C2C2C]">
                        <SelectItem value="usd">USD</SelectItem>
                        <SelectItem value="eur">EUR</SelectItem>
                        <SelectItem value="crypto">Crypto Native</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-white font-medium flex items-center">
                        <Moon className="w-4 h-4 mr-2 text-[#ECE147]" />
                        Dark Mode
                      </div>
                      <div className="text-[#B3B3B3] text-sm">Use dark theme</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-white font-medium">Auto-refresh Data</div>
                      <div className="text-[#B3B3B3] text-sm">Automatically update dashboard data</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-white font-medium">Compact View</div>
                      <div className="text-[#B3B3B3] text-sm">Show more data in less space</div>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <Button className="bg-[#ECE147] text-black hover:bg-[#ECE147]/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
