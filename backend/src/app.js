const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");


/* require routes */
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const userRouter = require("./routes/user.routes");

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173"
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

/* using routes */
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

module.exports = app;
