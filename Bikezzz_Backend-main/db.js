const mongoose = require("mongoose");

function connectDB() {
  mongoose.connect(
    "mongodb+srv://Sivakar:Sivakar%402004@cluster0.exoirqs.mongodb.net/?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  );

  const connection = mongoose.connection;

  connection.on("connected", () => {
    console.log("Mongo DB Connection Successfull");
  });

  connection.on("error", () => {
    console.log("Mongo DB connection Error");
  });
}

connectDB();

module.exports = mongoose;