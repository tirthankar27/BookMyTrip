const jwt = require("jsonwebtoken");
require("dotenv").config();

const fetchuser = (req, res, next) => {
  console.log("fetchuser hit");
  //Get the user from the jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    //verify if the token is matching with the provided token
    const data = jwt.verify(token, process.env.JWT_SECRET);

    //If yes then get the data and from data get the user and append the value to req.user and then call the next() basically the async function in the auth.js file
    req.user = data.user;
    next();
  } catch (err) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchuser;
