import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useState } from 'react';
import { Button } from './ui/button';

interface CategorySpendingDTO {
  category: string;
  total: number;
}

interface CategorySpendingChartProps {
  data: CategorySpendingDTO[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function CategorySpendingChart({ data }: CategorySpendingChartProps) {
  const [chartType, setChartType] = useState<'pie' | 'doughnut'>('doughnut');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const total = data.reduce((sum, item) => sum + item.total, 0);

  const chartData = data.map((item, index) => ({
    ...item,
    percentage: total > 0 ? ((item.total / total) * 100).toFixed(1) : '0',
    color: COLORS[index % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.category}</p>
          <p className="text-sm text-muted-foreground">
            Amount: <span className="font-medium text-foreground">{formatCurrency(data.total)}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Percentage: <span className="font-medium text-foreground">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const hasData = total > 0;

  return (
    <div className="w-full">
      <div className="flex justify-center gap-2 mb-4">
        <Button
          variant={chartType === 'doughnut' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setChartType('doughnut')}
        >
          Doughnut
        </Button>
        <Button
          variant={chartType === 'pie' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setChartType('pie')}
        >
          Pie
        </Button>
      </div>

      <div className="h-[300px]">
        {!hasData ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="text-lg">No category data</p>
              <p className="text-sm">Start categorizing your expenses to see breakdown here</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percentage }) => `${percentage}%`}
                outerRadius={chartType === 'doughnut' ? 80 : 80}
                innerRadius={chartType === 'doughnut' ? 40 : 0}
                fill="#8884d8"
                dataKey="total"
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {hasData && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Category Breakdown</h4>
          {chartData.map((item, index) => (
            <div key={item.category} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium">{item.category}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{formatCurrency(item.total)}</div>
                <div className="text-xs text-muted-foreground">{item.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}