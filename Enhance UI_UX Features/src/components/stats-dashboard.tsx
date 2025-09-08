import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { WeeklySpendingChart } from "./weekly-spending-chartjs";
import { CategorySpendingChart } from "./category-spending-chartjs";
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

// Mock data with more varied and realistic values
const mockData: DashboardStatsDTO = {
  monthSummary: {
    incomes: 3200,
    expense: 2150,
    netSavings: 1050
  },
  weekSummary: {
    incomes: 800,
    expense: 520,
    netSavings: 280
  },
  weeklySpending: [
    { day: "MONDAY", total: 85 },
    { day: "TUESDAY", total: 120 },
    { day: "WEDNESDAY", total: 65 },
    { day: "THURSDAY", total: 95 },
    { day: "FRIDAY", total: 180 },
    { day: "SATURDAY", total: 220 },
    { day: "SUNDAY", total: 110 }
  ],
  spendingByCategory: [
    { category: "FOOD", total: 650 },
    { category: "TRANSPORT", total: 380 },
    { category: "ENTERTAINMENT", total: 420 },
    { category: "SHOPPING", total: 290 },
    { category: "UTILITIES", total: 180 },
    { category: "HEALTHCARE", total: 230 }
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
    <div className={`min-h-screen bg-background p-6 transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Financial Dashboard</h1>
            <p className="text-muted-foreground">Track your income, expenses, and savings</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-1 rounded-lg bg-muted/50">
              <Button
                variant={selectedPeriod === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod('month')}
                className={`transition-all duration-200 ${
                  selectedPeriod === 'month' 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg' 
                    : 'hover:bg-blue-100 dark:hover:bg-blue-900/30'
                }`}
              >
                📅 Month
              </Button>
              <Button
                variant={selectedPeriod === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod('week')}
                className={`transition-all duration-200 ${
                  selectedPeriod === 'week' 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg' 
                    : 'hover:bg-blue-100 dark:hover:bg-blue-900/30'
                }`}
              >
                📊 Week
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleTheme}
              className="hover:scale-110 transition-all duration-200 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:border-yellow-500/50"
            >
              {isDark ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-blue-600" />}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 hover:shadow-xl hover:shadow-green-500/20 hover:border-green-500/50 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(currentSummary.incomes)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                💰 {selectedPeriod === 'month' ? 'This month' : 'This week'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-xl hover:shadow-red-500/20 hover:border-red-500/50 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-red-50/50 to-rose-50/30 dark:from-red-950/20 dark:to-rose-950/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(currentSummary.expense)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                💸 {selectedPeriod === 'month' ? 'This month' : 'This week'}
              </p>
            </CardContent>
          </Card>

          <Card className={`border-2 hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br ${
            isPositiveSavings 
              ? 'hover:shadow-blue-500/20 hover:border-blue-500/50 from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10' 
              : 'hover:shadow-orange-500/20 hover:border-orange-500/50 from-orange-50/50 to-yellow-50/30 dark:from-orange-950/20 dark:to-yellow-950/10'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
              <div className={`p-2 rounded-full ${
                isPositiveSavings 
                  ? 'bg-blue-100 dark:bg-blue-900/30' 
                  : 'bg-orange-100 dark:bg-orange-900/30'
              }`}>
                <PiggyBank className={`h-4 w-4 ${
                  isPositiveSavings 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-orange-600 dark:text-orange-400'
                }`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                isPositiveSavings 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-orange-600 dark:text-orange-400'
              }`}>
                {formatCurrency(currentSummary.netSavings)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={isPositiveSavings ? 'default' : 'destructive'} className="text-xs">
                  {isPositiveSavings ? '🎯 Saving' : '⚠️ Overspending'}
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
          <Card className="border-2 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 group bg-gradient-to-br from-blue-50/30 to-indigo-50/20 dark:from-blue-950/10 dark:to-indigo-950/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Weekly Spending
              </CardTitle>
              <CardDescription>
                📊 Daily spending breakdown for the current week
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <WeeklySpendingChart data={data.weeklySpending} />
              <div className="mt-4 flex justify-between items-center text-sm">
                <div className="px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  📅 Weekly Total: <span className="font-medium">{formatCurrency(data.weeklySpending.reduce((sum, day) => sum + day.total, 0))}</span>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                  📈 Avg/Day: <span className="font-medium">{formatCurrency(data.weeklySpending.reduce((sum, day) => sum + day.total, 0) / 7)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Spending Chart */}
          <Card className="border-2 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-300 group bg-gradient-to-br from-purple-50/30 to-pink-50/20 dark:from-purple-950/10 dark:to-pink-950/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:scale-110 transition-transform">
                  <TrendingDown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                Spending by Category
              </CardTitle>
              <CardDescription>
                🎯 Breakdown of expenses by category for {selectedPeriod}
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <CategorySpendingChart data={data.spendingByCategory} />
            </CardContent>
          </Card>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Financial Health</CardTitle>
              <CardDescription>
                Insights about your spending habits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <span className="text-sm text-muted-foreground">Savings Rate</span>
                  <span className={`font-medium ${isPositiveSavings ? 'text-green-500' : 'text-red-500'}`}>
                    {currentSummary.incomes > 0 
                      ? `${Math.round((currentSummary.netSavings / currentSummary.incomes) * 100)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <span className="text-sm text-muted-foreground">Expense Ratio</span>
                  <span className="font-medium">
                    {currentSummary.incomes > 0 
                      ? `${Math.round((currentSummary.expense / currentSummary.incomes) * 100)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <span className="text-sm text-muted-foreground">Budget Status</span>
                  <Badge variant={isPositiveSavings ? 'default' : 'destructive'} className="ml-2">
                    {isPositiveSavings ? 'On Track' : 'Over Budget'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your finances
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full hover:scale-105 transition-transform" variant="outline">
                Add New Income
              </Button>
              <Button className="w-full hover:scale-105 transition-transform" variant="outline">
                Record Expense
              </Button>
              <Button className="w-full hover:scale-105 transition-transform" variant="outline">
                Set Budget Goal
              </Button>
              <Button className="w-full hover:scale-105 transition-transform" variant="outline">
                Export Report
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>
                Comparison with previous periods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <span className="text-sm text-muted-foreground">Daily Average</span>
                  <span className="font-medium">
                    {formatCurrency(data.monthSummary.expense / 30)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <span className="text-sm text-muted-foreground">Top Category</span>
                  <span className="font-medium">
                    {data.spendingByCategory.length > 0 ? data.spendingByCategory[0].category : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <span className="text-sm text-muted-foreground">Peak Day</span>
                  <span className="font-medium">
                    {data.weeklySpending.reduce((max, day) => day.total > max.total ? day : max, data.weeklySpending[0]).day.substring(0, 3)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}