const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

const env = require("node-env-file");
const session = require("express-session");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const mongoose = require("mongoose");

const apiRoutes = require("./routes/api");
const webRoutes = require("./routes/web");

const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/mongouploads";

mongoose
  .connect(DB_URI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const app = express();
app.disable("x-powered-by");

app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));

app.use("/api/v1/", apiRoutes);
app.use("/", webRoutes);

app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(error, req, res, next) {
  if (!error.status)
    error = {
      status: 500,
      message: "Whoops! Something went wrong."
    };
  res.status(error.status).render("error", { error: error });
});

module.exports = app;
