import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import recipeRoutes from "./routes/recipes.js";
import adminRoutes from "./routes/admin.js";

const app = express();

dotenv.config({ path: "./.env" });

console.log("DEBUG MONGO_URI:", process.env.MONGO_URI);


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ MongoDB Connected");
  app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
})
.catch((err) => console.error("MongoDB connection error:", err));
