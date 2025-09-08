import { Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useState } from 'react';
import { Button } from './ui/button';

ChartJS.register(ArcElement, Tooltip, Legend);

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
  'hsl(var(--chart-1) / 0.8)',
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

  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => item.total),
        backgroundColor: COLORS.slice(0, data.length),
        borderColor: 'hsl(var(--background))',
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: 'hsl(var(--card))',
        titleColor: 'hsl(var(--card-foreground))',
        bodyColor: 'hsl(var(--card-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : '0';
            return [
              `Amount: ${formatCurrency(context.parsed)}`,
              `Percentage: ${percentage}%`
            ];
          }
        }
      },
    },
    cutout: chartType === 'doughnut' ? '50%' : '0%',
  };

  const chartDataWithPercentages = data.map((item, index) => ({
    ...item,
    percentage: total > 0 ? ((item.total / total) * 100).toFixed(1) : '0',
    color: COLORS[index % COLORS.length]
  }));

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
          <>
            {chartType === 'doughnut' ? (
              <Doughnut data={chartData} options={options} />
            ) : (
              <Pie data={chartData} options={options} />
            )}
          </>
        )}
      </div>

      {hasData && (
        <div className="mt-6 space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Category Breakdown</h4>
          {chartDataWithPercentages.map((item, index) => (
            <div key={item.category} className="flex justify-between items-center p-3 rounded-md bg-muted/50 hover:bg-muted/70 transition-colors">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0" 
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