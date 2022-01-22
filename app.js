const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const authController = require("./controllers/authController");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const taskController = require("./controllers/taskController");

const { requireAuth, checkUser } = require("./middleware/authMiddleware");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

//middleware
const static_path = path.join(__dirname, "public");
app.use(express.static(static_path));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // convert all request data to json format

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views/"));

const hbs = exphbs.create({
  defaultLayout: "mainLayout",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  layoutsDir: __dirname + "/views/layouts/",
});

app.engine("hbs", hbs.engine);

// database connection
const dbURI = `mongodb+srv://${process.env.useraccess}:${process.env.password}@cluster0.m7xi6.mongodb.net/LMS`;
mongoose
  .connect(dbURI)
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));

//routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));

app.get("/courses", requireAuth, authController.courses_get);
app.post("/courses", requireAuth, authController.courses_post);
app.get("/profile", requireAuth, authController.profile_get);
app.post("/profile", requireAuth, authController.profile_post);

app.use(taskController);
app.use(authRoutes);
