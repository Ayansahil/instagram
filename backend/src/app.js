const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

/* require routes */
const authRouter = require("../src/routes/auth.routes");
const postRouter = require("../src/routes/post.routes");
const userRouter = require("./routes/user.routes");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

/* using routes */
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

module.exports = app;
