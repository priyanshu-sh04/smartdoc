import express from "express";
import connectDB from "./utils/connectDB.js";
import documentRoutes from "./routes/documentRoutes.js";
import issuerRoutes from "./routes/issuerRoutes.js";
import "dotenv/config";

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
connectDB();
// In server.js, before route definitions
app.use((req, res, next) => {
    console.log('Request Method:', req.method);
    console.log('Request Path:', req.path);
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('Request Body:', req.body);
    next();
  });
app.use("/api/documents", documentRoutes);
app.use("/api/issuer", issuerRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
