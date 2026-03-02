const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");

/* require routes */
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const userRouter = require("./routes/user.routes");

const app = express();
app.set("trust proxy", 1);

// ✅ Improved CORS config
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.static("./public"));

/* using routes */
// Auth routes are mounted directly under /api so that the
// frontend can simply call "/login", "/register", etc.  The
// production build removed the "/auth" prefix from the generated
// paths, so we align the backend accordingly.
app.use("/api", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

// ✅ Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

/* Serve frontend SPA - must be LAST after all API routes */
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "/public/index.html"));
});

module.exports = app;
