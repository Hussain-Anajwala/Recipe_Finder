import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import recipeRoutes from "./routes/recipes.js";
import adminRoutes from "./routes/admin.js";

const app = express();

dotenv.config({ path: "./.env" });


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
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
})
.catch((err) => console.error("MongoDB connection error:", err));
