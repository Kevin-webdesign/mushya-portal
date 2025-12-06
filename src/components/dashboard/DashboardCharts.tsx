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
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const revenueData = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 3000, expenses: 1398 },
  { month: 'Mar', revenue: 2000, expenses: 9800 },
  { month: 'Apr', revenue: 2780, expenses: 3908 },
  { month: 'May', revenue: 1890, expenses: 4800 },
  { month: 'Jun', revenue: 2390, expenses: 3800 },
  { month: 'Jul', revenue: 3490, expenses: 4300 },
  { month: 'Aug', revenue: 4200, expenses: 3200 },
  { month: 'Sep', revenue: 5100, expenses: 4100 },
  { month: 'Oct', revenue: 4800, expenses: 3600 },
  { month: 'Nov', revenue: 5600, expenses: 4200 },
  { month: 'Dec', revenue: 6200, expenses: 4800 },
];

const poolData = [
  { name: 'Operating', value: 35, color: 'hsl(217, 91%, 60%)' },
  { name: 'Emergency', value: 20, color: 'hsl(160, 84%, 39%)' },
  { name: 'Development', value: 25, color: 'hsl(38, 92%, 50%)' },
  { name: 'Marketing', value: 12, color: 'hsl(280, 65%, 60%)' },
  { name: 'Reserve', value: 8, color: 'hsl(199, 89%, 48%)' },
];

const departmentBudgets = [
  { department: 'IT', allocated: 150000, spent: 95000 },
  { department: 'HR', allocated: 80000, spent: 62000 },
  { department: 'Marketing', allocated: 120000, spent: 98000 },
  { department: 'Operations', allocated: 200000, spent: 145000 },
  { department: 'Finance', allocated: 90000, spent: 72000 },
];

export function RevenueChart() {
  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Revenue & Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
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
                labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="hsl(0, 72%, 51%)"
                strokeWidth={2}
                fill="url(#expensesGradient)"
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function PoolDistributionChart() {
  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Pool Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={poolData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {poolData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 47%, 8%)',
                  border: '1px solid hsl(217, 33%, 15%)',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value}%`, '']}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function BudgetComparisonChart() {
  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Budget vs Spending by Department</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentBudgets} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 15%)" />
              <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
              <YAxis dataKey="department" type="category" stroke="hsl(215, 20%, 55%)" fontSize={12} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 47%, 8%)',
                  border: '1px solid hsl(217, 33%, 15%)',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Bar dataKey="allocated" fill="hsl(217, 91%, 60%)" name="Allocated" radius={[0, 4, 4, 0]} />
              <Bar dataKey="spent" fill="hsl(160, 84%, 39%)" name="Spent" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
