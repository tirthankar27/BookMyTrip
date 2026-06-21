require("dotenv").config({ path: __dirname + "/.env" });
const connectToMongo = require("./db.js");

connectToMongo();

const express = require("express");
const app = express();
const port = 5001;
const cors = require("cors");

// Simple CORS configuration
app.use(cors({
  origin: [
        "http://localhost:3000",
        "https://book-my-trip-9wmq.vercel.app"
    ]
  // credentials: true
}));

app.use(express.json());

// Available Routes
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/booking", require("./routes/booking.js"));
app.use("/api/data", require("./routes/data.js"));
app.use("/api/ai", require("./routes/ai"));

app.listen(port, () => {
  console.log(`BookMyTrip listening on port ${port}`);
});