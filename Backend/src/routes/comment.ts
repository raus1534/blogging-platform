import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment";
import { isAuth, isVerified } from "../middlewares/auth";
import { validate } from "../middlewares/validator";
import { CommentValidationSchema } from "../utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/create",
  isAuth,
  isVerified,
  validate(CommentValidationSchema),
  createComment
);
router.patch(
  "/:commentId",
  isAuth,
  isVerified,
  validate(CommentValidationSchema),
  updateComment
);
router.get("/:blogId", getComments);
router.delete("/:commentId", isAuth, isVerified, deleteComment);

export default router;
