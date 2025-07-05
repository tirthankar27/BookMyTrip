const express = require("express");
const router = express.Router();
//Fetch the schema
const User = require("../models/Userbymail");
//Get the validator
const { body, validationResult } = require("express-validator");
//Get bcrypt
const bcrypt = require("bcryptjs");
//Get webtoken
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Create a user using: POST "/api/auth/createUser"
router.post(
  "/createUser",
  [
    //Add validation for fields
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be 8 characters long").isLength({ min: 8 }),
  ],
  //Check if validation is fine else send the error for the validation
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    //Check whether the user with same email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry user with this email already exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password,salt);
      //Create new user with given details from json(req.body)
      user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user:{
            id: user.id
        }
      }
      const authToken=jwt.sign('data',process.env.JWT_SECRET)
      res.json({authToken});
    } catch (err) {
      console.error(err);
      res.status(500).send("Som error occured");
    }
  }
);

module.exports = router;
