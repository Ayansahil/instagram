const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("../src/routes/auth.routes");
const postRouter = require("../src/routes/post.routes");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

module.exports = app;
