import express from "express";
import connectDB from "./utils/connectDB.js";
import documentRoutes from "./routes/documentRoutes.js";
import issuerRoutes from "./routes/issuerRoutes.js";
import "dotenv/config";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use((req, res, next) => {
  console.log("Request Method:", req.method);
  console.log("Request Path:", req.path);
  console.log("Content-Type:", req.get("Content-Type"));
  console.log("Request Body:", req.body);
  next();
});

app.use("/api/documents", documentRoutes);
app.use("/api/issuer", issuerRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
