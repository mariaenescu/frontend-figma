import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { WeeklySpendingChart } from "./weekly-spending-chart";
import { CategorySpendingChart } from "./category-spending-chart";
import { Moon, Sun, TrendingUp, TrendingDown, DollarSign, PiggyBank } from "lucide-react";
import { useState, useEffect } from "react";

interface SummaryDTO {
  incomes: number;
  expense: number;
  netSavings: number;
}

interface WeeklyBarDTO {
  day: string;
  total: number;
}

interface CategorySpendingDTO {
  category: string;
  total: number;
}

interface DashboardStatsDTO {
  monthSummary: SummaryDTO;
  weekSummary: SummaryDTO;
  weeklySpending: WeeklyBarDTO[];
  spendingByCategory: CategorySpendingDTO[];
}

// Mock data based on the API response
const mockData: DashboardStatsDTO = {
  monthSummary: {
    incomes: 880,
    expense: 691,
    netSavings: 189
  },
  weekSummary: {
    incomes: 0,
    expense: 0,
    netSavings: 0
  },
  weeklySpending: [
    { day: "MONDAY", total: 0 },
    { day: "TUESDAY", total: 0 },
    { day: "WEDNESDAY", total: 0 },
    { day: "THURSDAY", total: 0 },
    { day: "FRIDAY", total: 0 },
    { day: "SATURDAY", total: 0 },
    { day: "SUNDAY", total: 0 }
  ],
  spendingByCategory: [
    { category: "USER", total: 691 }
  ]
};

export function StatsDashboard() {
  const [isDark, setIsDark] = useState(false);
  const [data, setData] = useState<DashboardStatsDTO>(mockData);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'week'>('month');

  useEffect(() => {
    // Check if dark mode is already enabled
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const currentSummary = selectedPeriod === 'month' ? data.monthSummary : data.weekSummary;
  const isPositiveSavings = currentSummary.netSavings > 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Financial Dashboard</h1>
            <p className="text-muted-foreground">Track your income, expenses, and savings</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={selectedPeriod === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('month')}
              >
                Month
              </Button>
              <Button
                variant={selectedPeriod === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('week')}
              >
                Week
              </Button>
            </div>
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {formatCurrency(currentSummary.incomes)}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedPeriod === 'month' ? 'This month' : 'This week'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {formatCurrency(currentSummary.expense)}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedPeriod === 'month' ? 'This month' : 'This week'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
              <PiggyBank className={`h-4 w-4 ${isPositiveSavings ? 'text-green-500' : 'text-red-500'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isPositiveSavings ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(currentSummary.netSavings)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={isPositiveSavings ? 'default' : 'destructive'} className="text-xs">
                  {isPositiveSavings ? 'Saving' : 'Overspending'}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {selectedPeriod === 'month' ? 'This month' : 'This week'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Spending Chart */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Weekly Spending
              </CardTitle>
              <CardDescription>
                Daily spending breakdown for the current week
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <WeeklySpendingChart data={data.weeklySpending} />
            </CardContent>
          </Card>

          {/* Category Spending Chart */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Spending by Category
              </CardTitle>
              <CardDescription>
                Breakdown of expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <CategorySpendingChart data={data.spendingByCategory} />
            </CardContent>
          </Card>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Financial Health</CardTitle>
              <CardDescription>
                Insights about your spending habits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Savings Rate</span>
                  <span className="font-medium">
                    {currentSummary.incomes > 0 
                      ? `${Math.round((currentSummary.netSavings / currentSummary.incomes) * 100)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Expense Ratio</span>
                  <span className="font-medium">
                    {currentSummary.incomes > 0 
                      ? `${Math.round((currentSummary.expense / currentSummary.incomes) * 100)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Budget Status</span>
                  <Badge variant={isPositiveSavings ? 'default' : 'destructive'}>
                    {isPositiveSavings ? 'On Track' : 'Over Budget'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your finances
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                Add New Income
              </Button>
              <Button className="w-full" variant="outline">
                Record Expense
              </Button>
              <Button className="w-full" variant="outline">
                Set Budget Goal
              </Button>
              <Button className="w-full" variant="outline">
                Export Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}