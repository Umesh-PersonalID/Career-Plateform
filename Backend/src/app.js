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
    origin: allowedOrigins,
    credentials: true
}));

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app