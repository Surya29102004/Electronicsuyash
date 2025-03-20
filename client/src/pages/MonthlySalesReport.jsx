import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const StaticMonthlySalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState({ online: 0, cod: 0 });
  const [totalOrders, setTotalOrders] = useState(0);
  const [unitsSold, setUnitsSold] = useState(0); // New state for total units sold

  useEffect(() => {
    async function fetchMonthlySales() {
      try {
        const { data } = await axios.get(`${server}/api/sales`, {
          headers: { token: Cookies.get("token") },
        });

        setSalesData(data.salesData || []);
        setTotalRevenue({ online: data.onlineRevenue ?? 0, cod: data.codRevenue ?? 0 });
        setTotalOrders(data.totalOrders ?? 0);

        // Calculate total units sold
        const totalUnits = data.salesData.reduce((sum, item) => sum + item.unitsSold, 0);
        setUnitsSold(totalUnits); // Update the state with total units sold
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    }
    fetchMonthlySales();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sales Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Report</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border text-sm bg-white shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Units Sold</th>
                <th className="border px-4 py-2">Revenue (₹)</th>
              </tr>
            </thead>
            <tbody>
              {salesData.length > 0 ? (
                salesData.slice(0, 10).map((item, index) => (
                  <tr key={index} className="border text-center">
                    <td className="border px-4 py-2">{item?.date || "N/A"}</td>
                    <td className="border px-4 py-2">{item?.product || "N/A"}</td>
                    <td className="border px-4 py-2">{item?.unitsSold ?? 0}</td>
                    <td className="border px-4 py-2">₹{item?.revenue?.toFixed(2) ?? "0.00"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-2">No sales data available</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-4">
            <div className="text-lg font-semibold">Online Revenue: ₹{totalRevenue.online.toFixed(2)}</div>
            <div className="text-lg font-semibold">COD Revenue: ₹{totalRevenue.cod.toFixed(2)}</div>
            <div className="text-lg font-semibold">Total Orders: {totalOrders}</div>
            <div className="text-lg font-semibold">Total Units Sold: {unitsSold}</div> {/* Display total units sold */}
          </div>
        </CardContent>
      </Card>

      {/* Sales Performance Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={500} height={300} data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" angle={-45} textAnchor="end" height={70} interval={0} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="unitsSold" fill="#8884d8" radius={8} />
          </BarChart>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaticMonthlySalesReport;