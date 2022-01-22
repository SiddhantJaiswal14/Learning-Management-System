const { Router } = require("express");
const authController = require("../controllers/authController");
const { User } = require("../models/User");

const router = Router();

router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);

// router.post("/profile/:id", async (req, res) => {
//   const { profession, address, phone, age, skills } = req.body;
//     console.log(req.body._id);
//     try {
//       const user = await User.findByIdAndUpdate(
//         req.body._id,
//         {
//           profession,
//           address,

//           phone,
//           age,
//           skills,
//         },
//         function (err, docs) {
//           if (err) {
//             console.log(err);
//           } else {
//             console.log("hello");
//             console.log(docs);
//           }
//         }
//       );
//       //   const token = createToken(user._id);
//       //   res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
//       //   res.status(201).json({ user: user._id });
//     } catch (err) {
//       //   const errors = handleErrors(err);
//       //   res.status(400).json({ errors });
//       console.log(error);
//     }
// });

module.exports = router;
