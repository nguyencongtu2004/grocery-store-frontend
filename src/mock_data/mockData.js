export const mockData = {
  revenueReport: {
    chartData: {
      labels: ["Jan 2023", "Feb 2023", "Mar 2023"],
      revenue: [1200, 1500, 1700]
    },
    totalRevenue: 4400
  },
  profitReport: {
    chartData: {
      labels: ["Jan 2023", "Feb 2023", "Mar 2023"],
      profit: [200, 300, 400]
    },
    totalProfit: 900
  },
  salesReport: {
    chartData: {
      labels: ["Jan 2023", "Feb 2023", "Mar 2023"],
      sales: [120, 150, 170]
    },
    bestsellers: [
      { productId: "1", name: "Product A", quantitySold: 50 },
      { productId: "2", name: "Product B", quantitySold: 40 }
    ],
    slowSellers: [
      { productId: "3", name: "Product C", quantitySold: 5 }
    ]
  },
  stockByCategory: {
    categories: [
      {
        categoryId: "64b9f5c2e34f5a001fa12c34",
        name: "Electronics",
        products: [
          {
            productId: "64b9f5c2e34f5a001fa12c45",
            name: "Laptop",
            stockQuantity: 3
          },
          {
            productId: "64b9f5c2e34f5a001fa12c67",
            name: "Phone",
            stockQuantity: 10
          }
        ]
      },
      {
        categoryId: "64b9f5c2e34f5a001fa12d78",
        name: "Clothing",
        products: [
          {
            productId: "64b9f5c2e34f5a001fa12e89",
            name: "T-Shirt",
            stockQuantity: 2
          }
        ]
      }
    ]
  },
  expiringProducts: {
    expiringProducts: [
      {
        productId: "64b9f5c2e34f5a001fa12c45",
        name: "Milk",
        expireDate: "2024-01-15T00:00:00Z",
        stockQuantity: 10
      },
      {
        productId: "64b9f5c2e34f5a001fa12c67",
        name: "Cheese",
        expireDate: "2024-01-20T00:00:00Z",
        stockQuantity: 5
      }
    ]
  },
  importByProvider: {
    providers: [
      {
        providerId: "64b9f5c2e34f5a001fa12c78",
        name: "Supplier A",
        totalImportPrice: 1500.0,
        purchaseOrders: [
          {
            orderId: "64b9f5c2e34f5a001fa12d12",
            orderDate: "2023-12-01T00:00:00Z",
            totalPrice: 800.0
          },
          {
            orderId: "64b9f5c2e34f5a001fa12d34",
            orderDate: "2023-12-10T00:00:00Z",
            totalPrice: 700.0
          }
        ]
      },
      {
        providerId: "64b9f5c2e34f5a001fa12e45",
        name: "Supplier B",
        totalImportPrice: 1000.0,
        purchaseOrders: [
          {
            orderId: "64b9f5c2e34f5a001fa12f67",
            orderDate: "2023-12-05T00:00:00Z",
            totalPrice: 1000.0
          }
        ]
      }
    ]
  },
  topSellingProducts: {
    topSellingProducts: [
      {
        productId: "64b9f5c2e34f5a001fa12c45",
        name: "Laptop",
        quantitySold: 100,
        stockQuantity: 20
      },
      {
        productId: "64b9f5c2e34f5a001fa12c67",
        name: "Phone",
        quantitySold: 80,
        stockQuantity: 50
      }
    ]
  }
};

