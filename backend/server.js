import express from "express";
import connectDB from "./utils/connectDB.js";
import documentRoutes from "./routes/documentRoutes.js";
import "dotenv/config";

const app = express();

// Middleware
app.use(express.json());
// MongoDB Connection
connectDB();

app.use("/api/documents", documentRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
