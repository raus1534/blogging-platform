import { RequestWithFiles } from "../middlewares/fileParser";
import { categoriesTypes } from "../utils/category";
import { RequestHandler } from "express";
import Blog, { BlogDocument } from "../models/Blog";
import formidable from "formidable";
import cloudinary from "../cloud";
import { isValidObjectId } from "mongoose";
import Comment from "../models/Comment";

interface CreateBlogRequest extends RequestWithFiles {
  body: {
    title: string;
    content: string;
    category: categoriesTypes;
  };
}

export const createBlog: RequestHandler = async (
  req: CreateBlogRequest,
  res
) => {
  const { title, content, category } = req.body;
  const poster = req.files?.poster as formidable.File;
  const ownerId = req.user.id;

  if (!poster) return res.status(422).json({ error: "Poster is missing!" });

  const newBlog = new Blog({
    owner: ownerId,
    title,
    content,
    category,
  });

  const posterRes = await cloudinary.uploader.upload(poster.filepath, {
    folder: "CSBlog",
  });

  newBlog.poster = {
    url: posterRes.secure_url,
    publicId: posterRes.public_id,
  };

  await newBlog.save();

  res.status(201).json({
    message: "Blog Published Successfully",
  });
};

export const updateBlog: RequestHandler = async (
  req: CreateBlogRequest,
  res
) => {
  const { title, content, category } = req.body;
  const poster = req.files?.poster as formidable.File;
  const ownerId = req.user.id;
  const { blogId } = req.params;

  const blog = await Blog.findOneAndUpdate(
    { owner: ownerId, _id: blogId },
    { title, content, category },
    { new: true }
  );

  if (!blog) return res.status(404).json({ error: "Blog Not Found" });

  if (poster) {
    if (blog.poster?.publicId) {
      await cloudinary.uploader.destroy(blog.poster.publicId);
    }

    const posterRes = await cloudinary.uploader.upload(poster.filepath);

    blog.poster = {
      url: posterRes.secure_url,
      publicId: posterRes.public_id,
    };

    await blog.save();
  }

  res.status(201).json({
    message: "Blog Updated Successfully",
  });
};
export const getUserBlog: RequestHandler = async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid request!" });

  const blogs = await Blog.find({ owner: userId }).select(
    "title poster.url _id createdAt category"
  );

  res.status(201).json({
    blogs,
  });
};
export const getBlogByViews: RequestHandler = async (req, res) => {
  const blogs = await Blog.find({})
    .sort({ views: -1 })
    .limit(4)
    .select("_id title poster.url");

  if (!blogs.length) {
    return res.status(404).json({ error: "No blogs found!" });
  }

  res.status(200).json({ blogs });
};

export const getLatestBlogs: RequestHandler = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 }).limit(5);

  if (!blogs) {
    return res.status(404).json({ error: "Blog not found!" });
  }

  res.status(200).json({ blogs });
};

export const getOtherBlogs: RequestHandler = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 }).skip(5);

  if (!blogs) {
    return res.status(404).json({ error: "Blog not found!" });
  }

  res.status(200).json({ blogs });
};

export const getSpecificBlog: RequestHandler = async (req, res) => {
  const { blogId } = req.params;

  if (!isValidObjectId(blogId))
    return res.status(403).json({ error: "Invalid request!" });

  const blog = await Blog.findByIdAndUpdate(
    blogId,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("owner", "name");

  if (!blog) {
    return res.status(404).json({ error: "Blog not found!" });
  }

  res.status(200).json({ blog });
};
export const getNoOfCategory: RequestHandler = async (req, res) => {
  const result = await Blog.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        count: 1,
      },
    },
  ]);

  if (!result) {
    return res.status(404).json({ error: "Blog not found!" });
  }

  res.status(200).json({ result });
};

export const deleteBlog: RequestHandler = async (req, res) => {
  const { blogId } = req.params;

  if (!isValidObjectId(blogId))
    return res.status(403).json({ error: "Invalid request!" });

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return res.status(404).json({ error: "Blog not found!" });
  }

  const public_id = blog.poster?.publicId;
  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      return res.status(422).json({ error: "Couldn't Delete The Actor!!" });
    }
  }
  await Blog.findByIdAndDelete(blogId);
  await Comment.deleteMany({ blog: blogId });

  res.status(200).json({ message: "Blog Deleted Successfully" });
};

export const searchBlogs: RequestHandler = async (req, res) => {
  const { title } = req.query;

  if (!title) return res.status(422).json({ error: "Query Not Found" });
  const blogs = await Blog.find({
    title: { $regex: title, $options: "i" },
  });

  res.json({ blogs });
};
