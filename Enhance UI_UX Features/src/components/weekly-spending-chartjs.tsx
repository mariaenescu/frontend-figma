import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Function to get bar chart colors based on current theme
const getBarChartColors = () => {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  
  if (isDark) {
    return [
      '#a855f7', // purple-500
      '#0ea5e9', // sky-500  
      '#f97316', // orange-500
      '#ec4899', // pink-500
      '#22c55e', // green-500
      '#8b5cf6', // purple-600
      '#0284c7', // sky-600
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
    ];
  }
};

interface WeeklyBarDTO {
  day: string;
  total: number;
}

interface WeeklySpendingChartProps {
  data: WeeklyBarDTO[];
}

export function WeeklySpendingChart({ data }: WeeklySpendingChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartData = {
    labels: data.map(item => item.day.substring(0, 3)),
    datasets: [
      {
        label: 'Daily Spending',
        data: data.map(item => item.total),
        backgroundColor: getBarChartColors(),
        borderColor: getBarChartColors(),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: getBarChartColors().map(color => color + 'CC'),
        hoverBorderColor: getBarChartColors(),
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#1b1c1f' : '#ffffff',
        titleColor: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#e4e4e7' : '#030213',
        bodyColor: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#e4e4e7' : '#030213',
        borderColor: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#6366f1' : '#030213',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            return `💰 Spent: ${formatCurrency(context.parsed.y)}`;
          },
          title: function(context: any) {
            const fullDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
            const dayIndex = context[0].dataIndex;
            return `📅 ${fullDays[dayIndex]}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#333741' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#a1a1aa' : '#717182',
          font: {
            size: 12,
            weight: '500' as const,
          },
          padding: 8,
          callback: function(value: any) {
            return formatCurrency(value);
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#e4e4e7' : '#030213',
          font: {
            size: 13,
            weight: '600' as const,
          },
          padding: 8,
        }
      }
    },
    onHover: (event: any, elements: any) => {
      event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    },
  };

  const maxValue = Math.max(...data.map(d => d.total));
  const hasData = maxValue > 0;

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        <div className="text-center">
          <p className="text-lg">No spending data</p>
          <p className="text-sm">Start recording your expenses to see charts here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <Bar data={chartData} options={options} />
    </div>
  );
}