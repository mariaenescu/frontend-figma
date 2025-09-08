import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyBarDTO {
  day: string;
  total: number;
}

interface WeeklySpendingChartProps {
  data: WeeklyBarDTO[];
}

export function WeeklySpendingChart({ data }: WeeklySpendingChartProps) {
  // Transform data for better display
  const chartData = data.map(item => ({
    day: item.day.substring(0, 3), // Show first 3 letters of day
    total: item.total,
    fullDay: item.day
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.fullDay}</p>
          <p className="text-sm text-muted-foreground">
            Spent: <span className="font-medium text-foreground">{formatCurrency(data.total)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const maxValue = Math.max(...data.map(d => d.total));
  const hasData = maxValue > 0;

  return (
    <div className="w-full h-[300px]">
      {!hasData ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <p className="text-lg">No spending data</p>
            <p className="text-sm">Start recording your expenses to see charts here</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-muted-foreground/20"
            />
            <XAxis 
              dataKey="day" 
              className="text-muted-foreground"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-muted-foreground"
              tick={{ fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="total" 
              className="fill-chart-1"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}