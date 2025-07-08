const connectToMongo = require("./db.js");

connectToMongo();

const express = require("express");
const app = express();
const port = 5000;

app.use(express.json());

//Available Routes
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/booking", require('./routes/booking.js'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
