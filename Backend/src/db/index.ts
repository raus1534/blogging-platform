import mongoose from "mongoose";
import { MONGO_URI } from "#/utils/envs";

mongoose.set("strictQuery", true);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Successfully Established Connected with Database");
  })
  .catch((err) => {
    console.log("Connected Failed with Database: ", err);
  });
