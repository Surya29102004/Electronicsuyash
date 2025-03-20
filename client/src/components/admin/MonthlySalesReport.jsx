import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Loading from "../Loading";
import toast from "react-hot-toast";

const MonthlySalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    async function fetchMonthlySales() 
    {
      try {
               const { data } = await axios.get(`${server}/api/sales/monthly`, {
          headers: { token: Cookies.get("token") },
        });

        setSalesData(data || []);
        setTotalRevenue(data.reduce((sum, item) => sum + item.totalSales, 0));
        setTotalOrders(data.reduce((sum, item) => sum + item.totalOrders, 0));
      } catch (error) {
        toast.error("Error fetching sales data");
      } finally {
        setLoading(false);
      }
    }
    fetchMonthlySales();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Monthly Sales Report</h1>

      {loading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto">
          <Card>
            <CardHeader>
              <CardTitle>Sales Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Total Sales ($)</TableHead>
                    <TableHead>Total Orders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.length > 0 ? (
                    salesData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.month}</TableCell>
                        <TableCell>${item.totalSales.toFixed(2)}</TableCell>
                        <TableCell>{item.totalOrders}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="3" className="text-center py-2">
                        No sales data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="mt-4">
                <div className="text-lg font-semibold">Total Revenue: ${totalRevenue.toFixed(2)}</div>
                <div className="text-lg font-semibold">Total Orders: {totalOrders}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sales Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={500} height={300} data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalSales" fill="#8884d8" radius={8} />
          </BarChart>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlySalesReport;
