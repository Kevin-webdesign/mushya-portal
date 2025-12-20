import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Settings, Bell, Shield, Building2, Save, DollarSign, Coins, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useCurrency } from '@/hooks/useCurrency';

export function SettingsPage() {
  const { settings: currencySettings, updateSettings } = useCurrency();
  const [localSettings, setLocalSettings] = useState(currencySettings);

  useEffect(() => {
    setLocalSettings(currencySettings);
  }, [currencySettings]);

  const handleSaveCurrency = () => {
    updateSettings(localSettings);
    toast.success('Currency settings saved - all financial displays updated');
  };

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your portal settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="currency" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Currency
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Update your organization's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input defaultValue="Mushya Group" />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Input defaultValue="Technology & Consulting" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Contact Email</Label>
                  <Input type="email" defaultValue="contact@mushyagroup.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue="+250 788 123 456" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input defaultValue="KG 123 St, Kigali, Rwanda" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Fiscal Settings</CardTitle>
              <CardDescription>Configure fiscal year settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fiscal Year Start</Label>
                  <Input type="date" defaultValue="2024-01-01" />
                </div>
                <div className="space-y-2">
                  <Label>Fiscal Year End</Label>
                  <Input type="date" defaultValue="2024-12-31" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Currency Settings */}
        <TabsContent value="currency" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Currency Configuration
              </CardTitle>
              <CardDescription>
                Set up your preferred currency settings. Changes apply system-wide to all financial displays.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">Default Currency</Label>
                <RadioGroup
                  value={localSettings.defaultCurrency}
                  onValueChange={(value: 'RWF' | 'USD') => 
                    setLocalSettings(prev => ({ ...prev, defaultCurrency: value }))
                  }
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="RWF" id="rwf" />
                    <Label htmlFor="rwf" className="flex items-center gap-2 cursor-pointer flex-1">
                      <span className="text-2xl">🇷🇼</span>
                      <div>
                        <p className="font-medium">Rwandan Franc (RWF)</p>
                        <p className="text-sm text-muted-foreground">Local currency</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="USD" id="usd" />
                    <Label htmlFor="usd" className="flex items-center gap-2 cursor-pointer flex-1">
                      <span className="text-2xl">🇺🇸</span>
                      <div>
                        <p className="font-medium">US Dollar (USD)</p>
                        <p className="text-sm text-muted-foreground">International currency</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Both Currencies</p>
                  <p className="text-sm text-muted-foreground">Display amounts in both RWF and USD throughout the portal</p>
                </div>
                <Switch
                  checked={localSettings.showBothCurrencies}
                  onCheckedChange={(checked) => 
                    setLocalSettings(prev => ({ ...prev, showBothCurrencies: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Exchange Rate (1 USD = X RWF)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={localSettings.exchangeRate}
                    onChange={(e) => 
                      setLocalSettings(prev => ({ ...prev, exchangeRate: parseFloat(e.target.value) || 0 }))
                    }
                    className="max-w-[200px]"
                  />
                  <span className="text-sm text-muted-foreground">RWF per USD</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This rate is used for converting between currencies in reports and displays
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Currency Preview</CardTitle>
              <CardDescription>See how amounts will be displayed across the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-1">Sample Amount (RWF)</p>
                  <p className="text-xl font-bold">
                    {localSettings.defaultCurrency === 'RWF' 
                      ? 'RWF 1,300,000'
                      : `$${(1300000 / localSettings.exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    }
                  </p>
                  {localSettings.showBothCurrencies && (
                    <p className="text-sm text-muted-foreground">
                      {localSettings.defaultCurrency === 'RWF'
                        ? `≈ $${(1300000 / localSettings.exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
                        : `≈ RWF 1,300,000`
                      }
                    </p>
                  )}
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-1">Sample Amount (USD)</p>
                  <p className="text-xl font-bold">
                    {localSettings.defaultCurrency === 'USD' 
                      ? '$1,000.00'
                      : `RWF ${(1000 * localSettings.exchangeRate).toLocaleString()}`
                    }
                  </p>
                  {localSettings.showBothCurrencies && (
                    <p className="text-sm text-muted-foreground">
                      {localSettings.defaultCurrency === 'USD'
                        ? `≈ RWF ${(1000 * localSettings.exchangeRate).toLocaleString()}`
                        : '≈ $1,000.00 USD'
                      }
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setLocalSettings(currencySettings)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSaveCurrency}>
              <Save className="h-4 w-4 mr-2" />
              Save Currency Settings
            </Button>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure when you receive email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Approval Requests</p>
                  <p className="text-sm text-muted-foreground">Receive emails for pending approvals</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Budget Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when budgets exceed thresholds</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Contract Expiry</p>
                  <p className="text-sm text-muted-foreground">Alerts for expiring contracts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Digest</p>
                  <p className="text-sm text-muted-foreground">Weekly summary of all activities</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>Real-time notifications in the portal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Disbursement Updates</p>
                  <p className="text-sm text-muted-foreground">Status changes on your requests</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Project Milestones</p>
                  <p className="text-sm text-muted-foreground">Updates on project progress</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>Manage authentication and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Require OTP for all logins</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Session Timeout</p>
                  <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue="30" className="w-20" />
                  <span className="text-sm text-muted-foreground">minutes</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">OTP for Vault Access</p>
                  <p className="text-sm text-muted-foreground">Require OTP to view passwords</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
              <CardDescription>Set password requirements for all users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Minimum Password Length</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue="12" className="w-20" />
                  <span className="text-sm text-muted-foreground">characters</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Require Special Characters</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Password Expiry</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue="90" className="w-20" />
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Security Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
