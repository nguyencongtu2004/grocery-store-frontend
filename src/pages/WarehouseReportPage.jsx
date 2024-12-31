'use client'

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardBody,
  Input,
  Spinner,
} from '@nextui-org/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { stockByCategory, expiringProducts, importByProvider, topSellingProducts } from '../requests/report.js';
import Row from '../components/layout/Row';
import Column from '../components/layout/Column';

const WarehouseReportPage = () => {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30))
    .toISOString()
    .split('T')[0];

  const [threshold, setThreshold] = useState(10);
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);

  const { data: stockData, isLoading: isStockLoading } = useQuery({
    queryKey: ['stockByCategory', threshold],
    queryFn: ({ signal }) => stockByCategory({ signal, threshold }),
  });

  const { data: expiringData, isLoading: isExpiringLoading } = useQuery({
    queryKey: ['expiringProducts', startDate, endDate],
    queryFn: ({ signal }) => expiringProducts({ signal, startDate, endDate }),
  });

  const { data: importData, isLoading: isImportLoading } = useQuery({
    queryKey: ['importByProvider', startDate, endDate],
    queryFn: ({ signal }) => importByProvider({ signal, startDate, endDate }),
  });

  const { data: topSellingData, isLoading: isTopSellingLoading } = useQuery({
    queryKey: ['topSellingProducts', startDate, endDate],
    queryFn: ({ signal }) => topSellingProducts({ signal, startDate, endDate }),
  });

  const formatStockData = (data) => {
    if (!data?.categories) return [];
    return data.categories.map(category => ({
      name: category.name,
      stock: category.products.reduce((sum, product) => sum + product.stockQuantity, 0),
    }));
  };

  const formatExpiringData = (data) => {
    if (!data?.expiringProducts) return [];
    return data.expiringProducts.slice(0, 5);
  };

  const formatImportData = (data) => {
    if (!data?.providers) return [];
    return data.providers.map(provider => ({
      name: provider.name,
      value: provider.totalImportPrice,
    }));
  };

  const formatTopSellingData = (data) => {
    if (!data?.topSellingProducts) return [];
    return data.topSellingProducts.slice(0, 5);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (isStockLoading || isExpiringLoading || isImportLoading || isTopSellingLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardBody>
          <Column className="w-full justify-between mb-4 gap-4">
            <h3 className="text-lg font-semibold">Warehouse Report</h3>
            <Row className="gap-4 mt-4">
              <Input
                type="number"
                label="Stock Threshold"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="flex-1"
              />
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

          <Row className="gap-4">
            <Card className="flex-1">
              <CardBody>
                <h4 className="text-lg font-medium mb-4">Stock by Category</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formatStockData(stockData)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="stock" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
            <Card className="flex-1">
              <CardBody>
                <h4 className="text-lg font-medium mb-4">Imports by Provider</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formatImportData(importData)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {formatImportData(importData).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </Row>

          <Row className="mt-6 gap-4">
            <Card className="flex-1">
              <CardBody>
                <h4 className="text-lg font-medium mb-2">Expiring Products</h4>
                <div className="mt-2 max-h-[200px] overflow-y-auto">
                  {formatExpiringData(expiringData).map((product) => (
                    <div key={product.productId} className="flex justify-between mb-2">
                      <span>{product.name}</span>
                      <span>{new Date(product.expireDate).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
            <Card className="flex-1">
              <CardBody>
                <h4 className="text-lg font-medium mb-2">Top Selling Products</h4>
                <div className="mt-2 max-h-[200px] overflow-y-auto">
                  {formatTopSellingData(topSellingData).map((product) => (
                    <div key={product.productId} className="flex justify-between mb-2">
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

export default WarehouseReportPage;

