import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const mockSalesData = {
  "Aloe Vera Soap": [
    { period: "Daily", sales: 40 },
    { period: "Weekly", sales: 300 },
    { period: "Monthly", sales: 1400 },
    { period: "Yearly", sales: 16500 },
  ],
  "Natural Soap": [
    { period: "Daily", sales: 35 },
    { period: "Weekly", sales: 280 },
    { period: "Monthly", sales: 1200 },
    { period: "Yearly", sales: 14000 },
  ],
  "Shea Butter Soap": [
    { period: "Daily", sales: 25 },
    { period: "Weekly", sales: 200 },
    { period: "Monthly", sales: 1000 },
    { period: "Yearly", sales: 12300 },
  ],
  "Luscious Soap": [
    { period: "Daily", sales: 20 },
    { period: "Weekly", sales: 150 },
    { period: "Monthly", sales: 900 },
    { period: "Yearly", sales: 11000 },
  ],
  "Scrubbing Soaps": [
    { period: "Daily", sales: 15 },
    { period: "Weekly", sales: 120 },
    { period: "Monthly", sales: 700 },
    { period: "Yearly", sales: 9500 },
  ],
  "Argan Soap": [
    { period: "Daily", sales: 30 },
    { period: "Weekly", sales: 250 },
    { period: "Monthly", sales: 1300 },
    { period: "Yearly", sales: 15000 },
  ],
  "Organic Soap": [
    { period: "Daily", sales: 18 },
    { period: "Weekly", sales: 170 },
    { period: "Monthly", sales: 850 },
    { period: "Yearly", sales: 9800 },
  ],
  "Soothing Soap": [
    { period: "Daily", sales: 22 },
    { period: "Weekly", sales: 190 },
    { period: "Monthly", sales: 920 },
    { period: "Yearly", sales: 10200 },
  ],
  "Joyful Skin Soap": [
    { period: "Daily", sales: 27 },
    { period: "Weekly", sales: 210 },
    { period: "Monthly", sales: 950 },
    { period: "Yearly", sales: 10800 },
  ],
  "The Bro Bars": [
    { period: "Daily", sales: 33 },
    { period: "Weekly", sales: 260 },
    { period: "Monthly", sales: 1100 },
    { period: "Yearly", sales: 12000 },
  ],
  "Body Scrub Soap": [
    { period: "Daily", sales: 21 },
    { period: "Weekly", sales: 185 },
    { period: "Monthly", sales: 870 },
    { period: "Yearly", sales: 10100 },
  ],
  "Papaya Soap": [
    { period: "Daily", sales: 55 },
    { period: "Weekly", sales: 410 },
    { period: "Monthly", sales: 1800 },
    { period: "Yearly", sales: 22000 },
  ],
  "Bright Soap": [
    { period: "Daily", sales: 26 },
    { period: "Weekly", sales: 200 },
    { period: "Monthly", sales: 1050 },
    { period: "Yearly", sales: 12500 },
  ],
  "Beauty Bars": [
    { period: "Daily", sales: 36 },
    { period: "Weekly", sales: 300 },
    { period: "Monthly", sales: 1300 },
    { period: "Yearly", sales: 14500 },
  ],
  "Thy Skin Soap": [
    { period: "Daily", sales: 16 },
    { period: "Weekly", sales: 120 },
    { period: "Monthly", sales: 800 },
    { period: "Yearly", sales: 9500 },
  ],
  // Add more as needed from other categories...
};

const calculateTotalSales = () => {
  const periods = ["Daily", "Weekly", "Monthly", "Yearly"];
  return periods.map((period, index) => {
    const total = Object.values(mockSalesData).reduce(
      (sum, productData) => sum + productData[index].sales,
      0
    );
    return { period, sales: total };
  });
};

const SalesChart = () => {
  const [selectedProduct, setSelectedProduct] = useState("Total Sales");

  const productNames = ["Total Sales", ...Object.keys(mockSalesData)];

  const chartData =
    selectedProduct === "Total Sales"
      ? calculateTotalSales()
      : mockSalesData[selectedProduct];

  return (
    <div className="w-full bg-white shadow-md rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">
        Shop Sales Overview
      </h3>

      <div className="mb-4">
        <label className="block font-medium mb-2 text-gray-600">
          Select Product:
        </label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl"
        >
          {productNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#34D399" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
