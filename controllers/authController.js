const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//handle errors

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  //incorrect email
  if (err.message === "Email Id is incorrect!!") {
    errors.email = "This email is not registered! You need to sign up";
  }

  //incorrect password
  if (err.message === "Password is incorrect!!") {
    errors.password = "Incorrect Password!";
  }

  // duplicate email error code
  if (err.code === 11000) {
    errors.email = "Sorry!! This email is already registered";
    return errors;
  }

  //validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, `${process.env.secret_key}`, { expiresIn: maxAge });
};
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { firstname, lastname, email, password, phone, age, skills } = req.body;
  try {
    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
      phone,
      age,
      skills,
    });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports.profile_get = (req, res) => {
  res.render("profile");
};

module.exports.profile_post = (req, res) => {
  const { profession, phone, address, age, skills } = req.body;
  const token = req.cookies.jwt;
  let userid;
  jwt.verify(token, `${process.env.secret_key}`, async (err, decodedToken) => {
    if (err) {
      console.log(err.message);
      res.locals.user = null;
    } else {
      userid = decodedToken.id;
    }
  });

  try {
    User.findByIdAndUpdate(
      userid,
      {
        profession,
        phone,
        address,
        age,
        skills,
      },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Profile Updated");
          res.redirect("profile");
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports.courses_get = (req, res) => {
  res.render("courses");
};

module.exports.courses_post = (req, res) => {
  const { lesson1, lesson2, lesson3, lesson4 } = req.body;
  console.log("Hello from course");
  const token = req.cookies.jwt;
  let userid;
  jwt.verify(token, `${process.env.secret_key}`, async (err, decodedToken) => {
    if (err) {
      console.log(err.message);
      res.locals.user = null;
    } else {
      userid = decodedToken.id;
    }
  });

  try {
    User.findByIdAndUpdate(
      userid,
      {
        lesson1,
        lesson2,
        lesson3,
        lesson4,
      },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("course status Updated");
          res.redirect("courses");
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};
