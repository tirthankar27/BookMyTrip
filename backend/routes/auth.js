const express = require("express");
const router = express.Router();
// require("dotenv").config({ path: __dirname + "/.env" });
//Fetch the schema
const User = require("../models/Userbymail");
//Get the validator
const { body, validationResult } = require("express-validator");
//Get bcrypt
const bcrypt = require("bcryptjs");
//Get webtoken
const jwt = require("jsonwebtoken");

//Fetch fetch user
const fetchUser = require("../middleware/fetchUser");

//Create a user using: POST "/api/auth/createUser"
router.post(
  "/createUser",
  [
    //Add validation for fields
    body("username", "Username is required").notEmpty(),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be 8 characters long").isLength({ min: 8 }),
  ],
  //Check if validation is fine else send the error for the validation
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ success: false, errors: result.array() });
    }
    //Check whether the user with same email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Sorry user with this email already exist",
          });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //Create new user with given details from json(req.body)
      const allowedRoles = ["user", "agency"];
      const role = allowedRoles.includes(req.body.role) ? req.body.role : "user";
      user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: secPass,
        role,
      });
      const data = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      res.status(200).json({ success: true, authToken });
    } catch (err) {
      console.log(__dirname);
      console.error(err);
      res.status(500).json({ success: false, error: "Some error occured" });
    }
  }
);

//Authenticate a user "/api/auth/login"
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "passowrd can not be blank").exists(),
  ],
  async (req, res) => {
    //Check if all the validation passess
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ success: false, errors: result.array() });
    }
    // Get the email and password entered by user
    const { email, password } = req.body;
    try {
      //Try to get the email with user given email
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Please provide correct credentials",
          });
      }
      //if exist then compare for the password
      const passowrdCompare = await bcrypt.compare(password, user.password);
      if (!passowrdCompare) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Please provide correct credentials",
          });
      }
      //if password and email is fine then send the user the id(id of the data stored in the )
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      res.json({ success: true, authToken, username: user.username, role: user.role });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, error: "Some internal server error occured" });
    }
  }
);

//Get user details '/api/auth/getuser'
//Use middleware fetchUser which will get the user details and then run the async function
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    //Get the id from the appended req.user
    const userId = req.user.id;

    //Now find the user by its id and fetch all the details except the password
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Some internal server error occured");
  }
});
module.exports = router;
