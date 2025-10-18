import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface LineChartData {
  month?: string;
  date?: string;
  revenue?: number;
  occupancy?: number;
}

interface LineChartProps {
  data: LineChartData[];
  type: 'revenue' | 'occupancy';
  title?: string;
}

export default function LineChart({ data, type, title }: LineChartProps) {
  const isRevenue = type === 'revenue';
  
  const categories = data.map(item => item.month || item.date || '');
  const seriesData = data.map(item => isRevenue ? item.revenue || 0 : item.occupancy || 0);

  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      height: 300,
    },
    title: {
      text: title || '',
      style: {
        fontSize: '14px',
        fontWeight: '600',
      }
    },
    xAxis: {
      categories: categories,
      title: {
        text: isRevenue ? 'Tháng' : 'Ngày'
      }
    },
    yAxis: {
      title: {
        text: isRevenue ? 'Doanh thu (VNĐ)' : 'Tỷ lệ lấp đầy (%)'
      },
      labels: {
        formatter: function() {
          if (isRevenue) {
            return new Intl.NumberFormat('vi-VN').format(this.value as number);
          }
          return this.value + '%';
        }
      }
    },
    tooltip: {
      formatter: function() {
        if (isRevenue) {
          return `<b>${this.x}</b><br/>Doanh thu: <b>${new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(this.y as number)}</b>`;
        }
        return `<b>${this.x}</b><br/>Tỷ lệ lấp đầy: <b>${this.y}%</b>`;
      }
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: false
        },
        enableMouseTracking: true,
        marker: {
          enabled: true,
          radius: 4
        }
      }
    },
    series: [{
      name: isRevenue ? 'Doanh thu' : 'Tỷ lệ lấp đầy',
      type: 'line',
      data: seriesData,
      color: isRevenue ? '#10B981' : '#3B82F6'
    }],
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    }
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
