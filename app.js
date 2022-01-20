const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
require("dotenv").config();

const app = express();

//middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI = `mongodb+srv://${process.env.useraccess}:${process.env.password}@cluster0.m7xi6.mongodb.net/LMS`;
mongoose
  .connect(dbURI)
  .then((result) => app.listen(5000))
  .catch((err) => console.log(err));

//routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/courses", requireAuth, (req, res) => res.render("courses"));
app.get("/profile", requireAuth, (req, res) => res.render("profile"));
app.get("/tasks", requireAuth, (req, res) => res.render("tasks"));
app.get("/addOrEdit", requireAuth, (req, res) => res.render("addOrEdit"));
app.use(authRoutes);
