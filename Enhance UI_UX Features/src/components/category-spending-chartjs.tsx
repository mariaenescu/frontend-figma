import { Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategorySpendingDTO {
  category: string;
  total: number;
}

interface CategorySpendingChartProps {
  data: CategorySpendingDTO[];
}

// Function to get CSS variable value
const getCSSVariable = (variable: string) => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  }
  return '';
};

// Function to get chart colors based on current theme
const getChartColors = () => {
  const isDark = document.documentElement.classList.contains('dark');
  
  if (isDark) {
    return [
      '#a855f7', // purple-500
      '#0ea5e9', // sky-500  
      '#f97316', // orange-500
      '#ec4899', // pink-500
      '#22c55e', // green-500
      '#8b5cf6', // purple-600
      '#0284c7', // sky-600
      '#ea580c', // orange-600
    ];
  } else {
    return [
      '#f59e0b', // amber-500
      '#06b6d4', // cyan-500
      '#8b5cf6', // purple-500
      '#ef4444', // red-500
      '#10b981', // emerald-500
      '#f97316', // orange-500
      '#3b82f6', // blue-500
      '#ec4899', // pink-500
    ];
  }
};

const COLORS = getChartColors();
const HOVER_COLORS = COLORS.map(color => color + 'E6'); // Add transparency for hover
const BORDER_COLORS = COLORS;

export function CategorySpendingChart({ data }: CategorySpendingChartProps) {
  const [chartType, setChartType] = useState<'pie' | 'doughnut'>('doughnut');
  const [colors, setColors] = useState(getChartColors());

  // Update colors when theme changes
  useEffect(() => {
    const updateColors = () => {
      setColors(getChartColors());
    };
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateColors();
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

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
        backgroundColor: colors.slice(0, data.length),
        borderColor: colors.slice(0, data.length),
        borderWidth: 3,
        hoverOffset: 12,
        hoverBackgroundColor: colors.map(color => color + 'CC').slice(0, data.length), // Add transparency
        hoverBorderColor: colors.slice(0, data.length),
        hoverBorderWidth: 4,
        offset: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: 'easeInOutCubic' as const,
    },
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#e4e4e7' : '#030213',
          font: {
            size: 13,
            weight: '500' as const,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          pointStyleWidth: 12,
          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const meta = chart.getDatasetMeta(0);
                const style = meta.controller.getStyle(i);
                const percentage = total > 0 ? ((data.datasets[0].data[i] / total) * 100).toFixed(1) : '0';
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: style.backgroundColor,
                  strokeStyle: style.borderColor,
                  lineWidth: style.borderWidth,
                  pointStyle: 'circle',
                  hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#1b1c1f' : '#ffffff',
        titleColor: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#e4e4e7' : '#030213',
        bodyColor: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#e4e4e7' : '#030213',
        borderColor: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#6366f1' : '#030213',
        borderWidth: 2,
        cornerRadius: 12,
        padding: 15,
        titleFont: {
          size: 15,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        displayColors: true,
        usePointStyle: true,
        pointStyle: 'rectRounded',
        callbacks: {
          title: function(context: any) {
            return `📊 ${context[0].label}`;
          },
          label: function(context: any) {
            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : '0';
            return [
              `💰 Amount: ${formatCurrency(context.parsed)}`,
              `📈 Percentage: ${percentage}%`
            ];
          }
        }
      },
    },
    cutout: chartType === 'doughnut' ? '60%' : '0%',
    onHover: (event: any, elements: any) => {
      event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    },
  };

  const chartDataWithPercentages = data.map((item, index) => ({
    ...item,
    percentage: total > 0 ? ((item.total / total) * 100).toFixed(1) : '0',
    color: colors[index % colors.length]
  }));

  const hasData = total > 0;

  return (
    <div className="w-full">
      <div className="flex justify-center gap-2 mb-4 p-1 rounded-lg bg-muted/30">
        <Button
          variant={chartType === 'doughnut' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setChartType('doughnut')}
          className={`transition-all duration-200 ${
            chartType === 'doughnut' 
              ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg' 
              : 'hover:bg-purple-100 dark:hover:bg-purple-900/30'
          }`}
        >
          🍩 Doughnut
        </Button>
        <Button
          variant={chartType === 'pie' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setChartType('pie')}
          className={`transition-all duration-200 ${
            chartType === 'pie' 
              ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg' 
              : 'hover:bg-purple-100 dark:hover:bg-purple-900/30'
          }`}
        >
          🥧 Pie
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
        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
            📊 Category Breakdown
          </h4>
          {chartDataWithPercentages.map((item, index) => (
            <div 
              key={item.category} 
              className="flex justify-between items-center p-4 rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer border border-transparent hover:border-purple-500/30"
              style={{
                background: `linear-gradient(135deg, ${item.color}15, ${item.color}05)`,
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-5 h-5 rounded-full flex-shrink-0 shadow-md hover:scale-110 transition-transform" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium">{item.category}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{formatCurrency(item.total)}</div>
                <div 
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: `${item.color}20`,
                    color: item.color 
                  }}
                >
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}