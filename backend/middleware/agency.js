// middleware/agency.js

const User = require("../models/Userbymail");

const agencyOnly = async (req, res, next) => {
  console.log("Agency hit");
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "agency") {
      return res.status(403).json({
        success: false,
        message: "Agency access required",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = agencyOnly;