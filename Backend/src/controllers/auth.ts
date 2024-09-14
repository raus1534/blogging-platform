import { CreateUser, VerifyEmailRequest } from "../@types/user";
import User from "../models/User";
import emailVerificationToken from "../models/EmailVerificationToken";
import { formatProfile, generateToken } from "../utils/helper";
import {
  sendForgetPasswordLink,
  sendPassResetSuccessEmail,
  sendVerificationMail,
} from "../utils/mail";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import PasswordResetToken from "../models/PasswordResetToken";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { RequestWithFiles } from "../middlewares/fileParser";
import formidable from "formidable";
import cloudinary from "../cloud";

export const createBlogger: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;

  const isExistingUser = await User.findOne({ email });
  if (isExistingUser)
    return res.status(403).json({
      error: "The email you entered is already associated with an account.",
    });

  const user = await User.create({ name, email, password });

  const token = generateToken();
  await emailVerificationToken.create({
    owner: user._id,
    token,
  });

  sendVerificationMail(token, { name, email, userId: user._id.toString() });

  res.status(201).json({ user: { id: user._id, name, email } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;
  if (!isValidObjectId(userId))
    return res.status(422).json({ error: "Invalid User Id" });

  const verificationToken = await emailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({ error: "Invalid token!" });

  const isExistingUser = await User.findById(userId);
  if (!isExistingUser) return res.status(404).json({ error: "User not Found" });
  const isMatched = await verificationToken.compareToken(token);
  if (!isMatched) return res.status(403).json({ error: "Invalid token!" });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });
  await emailVerificationToken.findByIdAndDelete(verificationToken._id);
  const jwtToken = jwt.sign(
    { userId: isExistingUser._id },
    process.env.JWT_SECRET!
  );

  res.json({
    user: {
      id: isExistingUser._id,
      name: isExistingUser.name,
      email: isExistingUser.email,
      verified: isExistingUser.verified,
      avatar: isExistingUser.avatar?.url,
      token: jwtToken,
    },
    message: "You Are Verified",
  });
};

export const sendReVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid request!" });

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Invalid request!" });

  if (user.verified)
    return res.status(422).json({ error: "Your account is already verified!" });

  await emailVerificationToken.findOneAndDelete({
    owner: userId,
  });

  const token = generateToken();

  await emailVerificationToken.create({
    owner: userId,
    token,
  });

  sendVerificationMail(token, {
    name: user?.name,
    email: user?.email,
    userId: user?._id.toString(),
  });

  res.json({ message: "Please check your mail." });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User doesn't Exist!" });

  await PasswordResetToken.findOneAndDelete({
    owner: user._id,
  });

  const token = crypto.randomBytes(36).toString("hex");

  await PasswordResetToken.create({
    owner: user._id,
    token,
  });

  const resetLink = `${process.env
    .PASSWORD_RESET_LINK!}?token=${token}&userId=${user._id}`;

  sendForgetPasswordLink({ email: user.email, link: resetLink });

  res.json({ message: "Check you registered mail." });
};

export const grantValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Unauthorized access!" });

  const isMatched = await user.comparePassword(password);
  if (isMatched)
    return res
      .status(422)
      .json({ error: "The new password must be different!" });

  user.password = password;
  await user.save();

  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  sendPassResetSuccessEmail(user.name, user.email);
  res.json({ message: "Password resets successfully." });
};

export const signIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });
  if (!user)
    return res
      .status(403)
      .json({ error: "The email and password do not match." });

  const matched = await user.comparePassword(password);
  if (!matched)
    return res
      .status(403)
      .json({ error: "The email and password do not match." });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);

  await user.save();

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      token,
    },
  });
};
export const updateProfile: RequestHandler = async (
  req: RequestWithFiles,
  res
) => {
  const { name } = req.body;
  const avatar = req.files?.avatar as formidable.File;

  const user = await User.findById(req.user.id);
  if (!user) throw new Error("something went wrong, user not found!");

  if (typeof name !== "string")
    return res.status(422).json({ error: "Invalid name!" });

  if (name.trim().length < 3)
    return res.status(422).json({ error: "Invalid name!" });

  user.name = name;

  if (avatar) {
    // if there is already an avatar file, we want to remove that
    if (user.avatar?.publicId) {
      await cloudinary.uploader.destroy(user.avatar?.publicId);
    }

    // upload new avatar file
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      avatar.filepath,
      {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
        folder: "CSBlog/User",
      }
    );

    user.avatar = { url: secure_url, publicId: public_id };
  }

  await user.save();

  res.json({ message: "Profile Updated Successfully" });
};

export const sendProfile: RequestHandler = (req, res) => {
  res.json({ user: req.user });
};
