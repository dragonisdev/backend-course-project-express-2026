import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


const app = express();

// Swagger documentation on port 3000


// Security middleware


// Rate limiting


// Body parsing middleware


// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes will be added here
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);

// Error handling middleware


export default app;