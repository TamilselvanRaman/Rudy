// SalesChart.jsx
import React from "react";
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

const data = [
  { period: "Daily", sales: 320 },
  { period: "Weekly", sales: 2100 },
  { period: "Monthly", sales: 8900 },
  { period: "Yearly", sales: 102300 },
];

const Dashboard = () => {
  return (
    <div className="w-full h-80 bg-white shadow-md rounded-xl p-4">
      <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">
        Shop Sales Overview
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#34D399" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
