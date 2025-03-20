import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { getMonthlySales, getYearlySales, getStats } from "../controller/salesController.js";

const router = express.Router();

// ✅ Test route to verify sales API is working
router.get("/", (req, res) => {
  res.send("Sales API is working!");
});

router.get("/sales", getMonthlySales);
router.get("/sales/monthly", getMonthlySales);
router.get("/sales/yearly", getYearlySales);
router.get("/sales/stats", getStats);

export default router;
