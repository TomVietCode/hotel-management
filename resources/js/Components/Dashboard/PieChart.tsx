import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface PieChartData {
  name: string;
  y: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  title?: string;
}

export default function PieChart({ data, title }: PieChartProps) {
  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
      height: 300,
    },
    title: {
      text: title || '',
      style: {
        fontSize: '14px',
        fontWeight: '600',
      }
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br/>Số lượng: <b>{point.y}</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        },
        showInLegend: true
      }
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal'
    },
    series: [{
      name: 'Tỷ lệ',
      type: 'pie',
      data: data
    }],
    credits: {
      enabled: false
    }
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
