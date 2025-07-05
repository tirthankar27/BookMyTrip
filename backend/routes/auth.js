const express = require("express");
const router = express.Router();
const User = require("../models/Userbymail");
const { body, validationResult } = require("express-validator");

//Create a user using: POST "/api/auth/createUser"
router.post(
  "/createUser",
  [
    //Add validation for fields
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be 8 characters long").isLength({ min: 8 }),
  ],
  //check if validation is fine else send the error for the validation
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    //check whether the user with same email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry user with this email already exist" });
      }
      user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).send("Som error occured");
    }
  }
);

module.exports = router;
