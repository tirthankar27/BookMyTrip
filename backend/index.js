require("dotenv").config({ path: __dirname + "/.env" });
const connectToMongo = require("./db.js");


connectToMongo();

const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
app.use(cors());

app.use(express.json());

//Available Routes
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/booking", require('./routes/booking.js'));

app.listen(port, () => {
  console.log(__dirname + '/.env');
  console.log(`BookMyTrip listening on port ${port}`);
});
