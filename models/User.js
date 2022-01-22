const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const taskSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  description: {
    type: String,
  },
  completed: {
    type: String,
  },
  deadline: {
    type: String,
  },
});

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please enter first name"],
  },
  lastname: {
    type: String,
    required: [true, "Please enter last name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 8 characters"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter Phone number"],
    length: [10, "Please enter a 10 digit number"],
  },
  age: {
    type: Number,
  },
  skills: {
    type: String,
    maxlength: [50, "Maximum length allowed is 50 characters"],
  },
  address: {
    type: String,
  },
  profession: {
    type: String,
  },
  image: {
    type: String,
  },
  lesson1: {
    type: String,
  },
  lesson2: {
    type: String,
  },
  lesson3: {
    type: String,
  },
  lesson4: {
    type: String,
  },
});

//hashing the password before saving it to database
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Password is incorrect!!");
  }
  throw Error("Email Id is incorrect!!");
};

const User = mongoose.model("user", userSchema);
const Task = mongoose.model("task", taskSchema);

module.exports = { User, Task };
