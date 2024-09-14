import express from "express";
import "dotenv/config";
import "express-async-errors";
import "./db";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const allowedOrigins: string[] = [
  "https://blogincs.vercel.app",
  "http://localhost:5173",
];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or curl requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Origin is allowed
    } else {
      callback(new Error("Not allowed by CORS")); // Origin not allowed
    }
  },
  credentials: true, // Include credentials such as cookies
};

app.use(cors(corsOptions));

import authRouter from "./routes/auth";
import blogRouter from "./routes/blog";
import commentRouter from "./routes/comment";
import { errorHandler } from "./middlewares/error";

app.use("/api/auth", authRouter);
app.use("/api/blog", blogRouter);
app.use("/api/comment", commentRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Listening in PORT:" + PORT);
});
