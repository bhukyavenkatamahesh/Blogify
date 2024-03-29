const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;
const mongoose = require("mongoose");
const Blog = require("./models/blog");

const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");

const cookieParser = require("cookie-parser");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

mongoose
  .connect("mongodb://127.0.0.1:27017/blogify")
  .then((e) => console.log("MongoDB Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allblogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allblogs,
  });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
