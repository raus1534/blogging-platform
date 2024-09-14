import {
  createBlog,
  deleteBlog,
  getBlogByViews,
  getLatestBlogs,
  getNoOfCategory,
  getOtherBlogs,
  getSpecificBlog,
  getUserBlog,
  searchBlogs,
  updateBlog,
} from "../controllers/blog";
import { isAuth, isVerified } from "../middlewares/auth";
import fileParser from "../middlewares/fileParser";
import { validate } from "../middlewares/validator";
import { BlogValidationSchema } from "../utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/create",
  isAuth,
  isVerified,
  fileParser,
  validate(BlogValidationSchema),
  createBlog
);
router.patch(
  "/:blogId",
  isAuth,
  isVerified,
  fileParser,
  validate(BlogValidationSchema),
  updateBlog
);
router.get("/user/:userId", getUserBlog);
router.get("/highView", getBlogByViews);
router.get("/latest", getLatestBlogs);
router.get("/others", getOtherBlogs);
router.get("/single/:blogId", getSpecificBlog);
router.get("/byCategory", getNoOfCategory);
router.get("/search", searchBlogs);
router.delete("/:blogId", isAuth, isVerified, deleteBlog);

export default router;
