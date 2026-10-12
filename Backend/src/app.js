const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
    "http://localhost:5173",
    "http://54.174.77.245:5173",
    ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map(url => url.trim()) : [])
]

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            return callback(null, true)
        }
        return callback(new Error("Not allowed by CORS"))
    },
    credentials: true
}));

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


const mongoose = require("mongoose")

/* health check and root endpoints */
app.get("/", (req, res) => {
    res.json({
        message: "Career Platform API is running",
        timestamp: new Date().toISOString()
    })
})

app.get("/api/health", async (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  let dbStatus = states[mongoose.connection.readyState] || "unknown";

  try {
    // Actively pings the MongoDB Atlas cluster over the wire
    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
      dbStatus = "connected";
    }
  } catch (error) {
    dbStatus = "error";
  }

  res.json({
    status: "ok",
    database: dbStatus,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasMongoUri: !!process.env.MONGO_URI,
    hasGeminiKey: !!process.env.GOOGLE_GENAI_API_KEY
  });
});


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

/* error handling middleware */
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err)
    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    })
})

module.exports = app