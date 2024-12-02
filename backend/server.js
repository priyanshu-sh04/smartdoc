import express from "express";
import connectDB from "./utils/connectDB.js";
import documentRoutes from "./routes/documentRoutes.js";
import issuerRoutes from "./routes/issuerRoutes.js";
import documentRequest from "./routes/documentRequest.js";
import "dotenv/config";
import cors from "cors";

const app = express();

// CORS configuration
const FRONTEND_URL = process.env.FRONTEND_URL;

if (!FRONTEND_URL) {
  console.error("FRONTEND_URL environment variable is not set!");
  process.exit(1);
}

const corsOptions = {
  origin: (origin, callback) => {
    if (origin === FRONTEND_URL || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200, // For legacy browser support
};

// Use CORS with options
app.use(cors(corsOptions));
app.use(express.json());

// Connect to the database
connectDB();

// Middleware to log requests
app.use((req, res, next) => {
  console.log("Request Method:", req.method);
  console.log("Request Path:", req.path);
  console.log("Content-Type:", req.get("Content-Type"));
  console.log("Request Body:", req.body);
  next();
});

// Routes
app.use("/api/documents", documentRoutes);
app.use("/api/issuer", issuerRoutes);
app.use("/api/documents", documentRequest)

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
