import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Spinner,
} from '@nextui-org/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { fetchRevenueReport, fetchProfitReport, fetchSalesReport } from '../requests/report.js';
import Row from '../components/layout/Row';
import Column from '../components/layout/Column';
import { formatPrice } from '../ultis/ultis.js';

const RevenueReportPage = () => {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30))
    .toISOString()
    .split('T')[0];

  const [interval, setInterval] = useState('day');
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);

  const { data: revenueRawData, isLoading: isRevenueLoading } = useQuery({
    queryKey: ['revenueReport', interval, startDate, endDate],
    queryFn: ({ signal }) =>
      fetchRevenueReport({ signal, startDate, endDate, interval, groupBy: 'product' }),
  });
  const revenueData = revenueRawData?.data || {};

  const { data: profitRawData, isLoading: isProfitLoading } = useQuery({
    queryKey: ['profitReport', interval, startDate, endDate],
    queryFn: ({ signal }) =>
      fetchProfitReport({ signal, startDate, endDate, interval }),
  });
  const profitData = profitRawData?.data || {};

  const { data: salesRawData, isLoading: isSalesLoading } = useQuery({
    queryKey: ['salesReport', interval, startDate, endDate],
    queryFn: ({ signal }) =>
      fetchSalesReport({ signal, startDate, endDate, interval }),
  });
  const salesData = salesRawData?.data || {};

  const formatChartData = () => {
    if (!revenueData?.chartData?.labels) return [];
    
    return revenueData.chartData.labels.map((label, index) => ({
      name: new Intl.DateTimeFormat('vi-VN', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(label)),
      revenue: revenueData.chartData.revenue?.[index] || 0,
      profit: profitData.chartData.profit?.[index] || 0,
      sales: salesData.chartData.sales?.[index] || 0,
    }));
  };

  if (isRevenueLoading || isProfitLoading || isSalesLoading) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-200 bg-opacity-50 rounded-lg shadow-lg">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-lg font-semibold">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardBody>
          <Column className="w-full justify-between mb-4 gap-4">
            <h3 className="text-lg font-semibold">Revenue Report</h3>
            <Row className="gap-4 mt-4">
              <Select
                label="Interval"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                selectedKeys={[interval]}
                className="flex-1"
              >
                <SelectItem key='day' value="day">Daily</SelectItem>
                <SelectItem key='month' value="month">Monthly</SelectItem>
                <SelectItem key='year' value="year">Yearly</SelectItem>
              </Select>
              <Input
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1"
              />
              <Input
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1"
              />
            </Row>
          </Column>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  name="Revenue"
                />
                {/* <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#82ca9d"
                  name="Profit"
                /> */}
                {/* <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#ffc658"
                  name="Sales"
                /> */}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <Row className="mt-6 gap-4">
            <Card className="flex-1">
              <CardBody>
                <h4 className="text-lg font-medium">Total Revenue</h4>
                <p className="text-2xl font-bold mt-2">
                  {revenueData?.totalRevenue ? formatPrice(revenueData?.totalRevenue) : '-'}
                </p>
              </CardBody>
            </Card>
            {/* <Card className="flex-1">
              <CardBody>
                <h4 className="text-lg font-medium">Total Profit</h4>
                <p className="text-2xl font-bold mt-2">
                  {profitData?.totalProfit ? formatPrice(profitData?.totalProfit) : '-'}
                </p>
              </CardBody>
            </Card> */}
            <Card className="flex-1">
              <CardBody>
                <h4 className="text-lg font-medium">Best Sellers</h4>
                <div className="mt-2">
                  {salesData?.bestsellers?.slice(0, 3).map((product) => (
                    <div key={product.productId} className="flex justify-between">
                      <span>{product.name}</span>
                      <span>{product.quantitySold} units</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
            <Card className="flex-1">
              <CardBody>
                <h4 className="text-lg font-medium">Slow Sellers</h4>
                <div className="mt-2">
                  {salesData?.slowSellers?.slice(0, 3).map((product) => (
                    <div key={product.productId} className="flex justify-between">
                      <span>{product.name}</span>
                      <span>{product.quantitySold} units</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default RevenueReportPage;