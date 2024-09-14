import {
  createBlogger,
  generateForgetPasswordLink,
  grantValid,
  sendProfile,
  sendReVerificationToken,
  signIn,
  updatePassword,
  updateProfile,
  verifyEmail,
} from "../controllers/auth";
import { isAuth, isValidPassResetToken, isVerified } from "../middlewares/auth";
import fileParser from "../middlewares/fileParser";
import { validate } from "../middlewares/validator";
import {
  CreateUserSchema,
  SignInValidationSchema,
  TokenAndIDValidation,
  UpdatePasswordSchema,
} from "../utils/validationSchema";
import { Router } from "express";

const routes = Router();

routes.post("/create", validate(CreateUserSchema), createBlogger);
routes.post("/verify-email", validate(TokenAndIDValidation), verifyEmail);
routes.post("/resend-verify-token", sendReVerificationToken);
routes.post("/forget-password", generateForgetPasswordLink);
routes.post(
  "/verify-pass-reset-token",
  validate(TokenAndIDValidation),
  isValidPassResetToken,
  grantValid
);
routes.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPassResetToken,
  updatePassword
);
routes.post("/update-profile", isAuth, isVerified, fileParser, updateProfile);
routes.get("/is-auth", isAuth, sendProfile);
routes.post("/sign-in", validate(SignInValidationSchema), signIn);

export default routes;
