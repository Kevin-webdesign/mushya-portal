import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { BarChart3, DollarSign, Wallet, TrendingUp, FileSearch, Download } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const cashFlowData = [
  { month: 'Jan', inflow: 180000, outflow: 120000 },
  { month: 'Feb', inflow: 165000, outflow: 140000 },
  { month: 'Mar', inflow: 220000, outflow: 155000 },
  { month: 'Apr', inflow: 195000, outflow: 165000 },
  { month: 'May', inflow: 240000, outflow: 180000 },
  { month: 'Jun', inflow: 210000, outflow: 175000 },
];

const poolBalanceData = [
  { name: 'Operating Fund', balance: 312500, change: 5.2 },
  { name: 'Emergency Reserve', balance: 178500, change: -2.1 },
  { name: 'Development Fund', balance: 223200, change: 8.4 },
  { name: 'Marketing Budget', balance: 107100, change: 12.3 },
  { name: 'Reserve Fund', balance: 71400, change: 0.5 },
];

const auditLogs = [
  { id: '1', action: 'Role Created', user: 'System Admin', module: 'Roles', timestamp: '2024-12-06 09:15:00', ip: '192.168.1.100' },
  { id: '2', action: 'Budget Approved', user: 'John Smith', module: 'Budgets', timestamp: '2024-12-06 08:45:00', ip: '192.168.1.105' },
  { id: '3', action: 'Disbursement Paid', user: 'Finance Team', module: 'Disbursements', timestamp: '2024-12-06 08:30:00', ip: '192.168.1.102' },
  { id: '4', action: 'Password Viewed', user: 'IT Admin', module: 'Vault', timestamp: '2024-12-06 08:00:00', ip: '192.168.1.101' },
  { id: '5', action: 'User Login', user: 'Sarah Chen', module: 'Auth', timestamp: '2024-12-06 07:45:00', ip: '192.168.1.110' },
];

export function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Financial reports and audit logs</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="cashflow" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-lg">
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="pools">Pool Balances</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        {/* Cash Flow Report */}
        <TabsContent value="cashflow" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Inflow</p>
                  <p className="text-2xl font-bold text-success">$1.21M</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success opacity-50" />
              </div>
            </Card>
            <Card className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Outflow</p>
                  <p className="text-2xl font-bold text-destructive">$935K</p>
                </div>
                <DollarSign className="h-8 w-8 text-destructive opacity-50" />
              </div>
            </Card>
            <Card className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Cash Flow</p>
                  <p className="text-2xl font-bold">$275K</p>
                </div>
                <Badge variant="default" className="bg-success">+22.7%</Badge>
              </div>
            </Card>
          </div>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Monthly Cash Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashFlowData}>
                    <defs>
                      <linearGradient id="inflowGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="outflowGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 15%)" />
                    <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                    <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 8%)',
                        border: '1px solid hsl(217, 33%, 15%)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    />
                    <Area type="monotone" dataKey="inflow" stroke="hsl(160, 84%, 39%)" strokeWidth={2} fill="url(#inflowGradient)" name="Inflow" />
                    <Area type="monotone" dataKey="outflow" stroke="hsl(0, 72%, 51%)" strokeWidth={2} fill="url(#outflowGradient)" name="Outflow" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pool Balances Report */}
        <TabsContent value="pools" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Pool Balance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pool Name</TableHead>
                    <TableHead className="text-right">Current Balance</TableHead>
                    <TableHead className="text-right">Change (MTD)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {poolBalanceData.map((pool, i) => (
                    <TableRow key={i} className="table-row-hover">
                      <TableCell className="font-medium">{pool.name}</TableCell>
                      <TableCell className="text-right font-semibold">${pool.balance.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={pool.change >= 0 ? 'default' : 'destructive'} className={pool.change >= 0 ? 'bg-success/10 text-success' : ''}>
                          {pool.change >= 0 ? '+' : ''}{pool.change}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profitability Report */}
        <TabsContent value="profitability" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Project Profitability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { project: 'ERP', budget: 500, spent: 320, profit: 180 },
                    { project: 'Website', budget: 150, spent: 142, profit: 8 },
                    { project: 'Mobile App', budget: 250, spent: 180, profit: 70 },
                    { project: 'Migration', budget: 80, spent: 45, profit: 35 },
                    { project: 'Security', budget: 60, spent: 15, profit: 45 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 15%)" />
                    <XAxis dataKey="project" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                    <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} tickFormatter={(v) => `$${v}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 8%)',
                        border: '1px solid hsl(217, 33%, 15%)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`$${value}K`, '']}
                    />
                    <Bar dataKey="budget" fill="hsl(217, 91%, 60%)" name="Budget" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="spent" fill="hsl(38, 92%, 50%)" name="Spent" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="profit" fill="hsl(160, 84%, 39%)" name="Profit" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs */}
        <TabsContent value="audit" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSearch className="h-5 w-5 text-primary" />
                Recent Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id} className="table-row-hover">
                      <TableCell className="text-muted-foreground text-sm font-mono">
                        {log.timestamp}
                      </TableCell>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.module}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">{log.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
