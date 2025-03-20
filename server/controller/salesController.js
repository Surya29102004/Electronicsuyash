import TryCatch from "../utils/TryCatch.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

// 📌 Helper function to calculate monthly sales
const calculateMonthlySales = async () => {
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        totalSales: { $sum: { $ifNull: ["$subTotal", 0] } }, // ✅ Ensure subTotal exists
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
  ]);

  return salesData.length > 0
    ? salesData.map(({ _id, totalSales, totalOrders }) => ({
        month: `${_id.month}-${_id.year}`,
        totalSales,
        totalOrders,
      }))
    : [];
};

// 📌 Get Monthly Sales Report
export const getMonthlySales = TryCatch(async (req, res) => {
  const sales = await calculateMonthlySales();
  res.json(sales);
});

// 📌 Get Yearly Sales Report
export const getYearlySales = TryCatch(async (req, res) => {
  const yearlySales = await Order.aggregate([
    {
      $group: {
        _id: { year: { $year: "$createdAt" } },
        totalSales: { $sum: { $ifNull: ["$subTotal", 0] } }, // ✅ Ensure subTotal exists
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1 } },
  ]);

  res.json(
    yearlySales.length > 0
      ? yearlySales.map(({ _id, totalSales, totalOrders }) => ({
          year: _id.year,
          totalSales,
          totalOrders,
        }))
      : []
  );
});

// 📌 Get General Sales Statistics
export const getStats = TryCatch(async (req, res) => {
  const [totalOrders, totalRevenueData, products] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: { $ifNull: ["$subTotal", 0] } } } }]), // ✅ Ensure subTotal exists
    Product.find().select("title sold").lean(),
  ]);

  const totalRevenue = totalRevenueData[0]?.total || 0;

  res.json({
    totalOrders,
    totalRevenue,
    bestSellingProducts: products
      .sort((a, b) => b.sold - a.sold) // Sort in descending order
      .slice(0, 5), // Get top 5 products
  });
});
