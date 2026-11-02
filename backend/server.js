require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

const allowedOrigins = [
  "https://frontend-chi-seven-87.vercel.app", 
  "http://localhost:5173",                     
  "http://localhost:3000"                      
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.CLIENT_URL) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Event Booking Platform API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (
    !process.env.MONGO_URI ||
    !process.env.JWT_SECRET ||
    !process.env.GEMINI_API_KEY
  ) {
    console.error(
      "MONGO_URI, JWT_SECRET and GEMINI_API_KEY are required in .env"
    );
    process.exit(1);
  }

  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();