import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

mongoose.set("strictQuery", true);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Successfully Established Connected with Database");
  })
  .catch((err) => {
    console.log("Connected Failed with Database: ", err);
  });
