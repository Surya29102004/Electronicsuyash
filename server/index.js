import express from "express";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
import cloudinary from "cloudinary";
import cors from "cors";
import axios from "axios";
// importing routes
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/address.js";
import orderRoutes from "./routes/order.js";
import salesRoutes from "./routes/sales.js"; // Import the new sales route

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

const url = `http://localhost:4000`;
const interval = 30000;

function reloadWebsite() {
  axios
    .get(url)
    .then(() => {
      console.log("Website reloaded");
    })
    .catch((error) => {
      console.error(`Error : ${error.message}`);
    });
}

setInterval(reloadWebsite, interval);

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 4000; // Set default port

// using routes
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
app.use("/api", salesRoutes);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});
