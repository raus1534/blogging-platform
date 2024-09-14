import { RequestWithFiles } from "#/middlewares/fileParser";
import { RequestHandler } from "express";
import Blog from "#/models/Blog";
import { isValidObjectId } from "mongoose";
import Comment from "#/models/Comment";

interface CreateCommentRequest extends RequestWithFiles {
  body: {
    blog: string;
    comment: string;
  };
}

export const createComment: RequestHandler = async (
  req: CreateCommentRequest,
  res
) => {
  const { blog, comment } = req.body;
  const ownerId = req.user.id;

  if (!isValidObjectId(blog))
    return res.status(422).json({ error: "Invalid Blog" });

  const isExistingBlog = await Blog.findById(blog);
  if (!isExistingBlog) return res.status(404).json({ error: "Invalid Blog" });

  const isExisting = await Comment.findOne({ owner: ownerId, blog });
  if (isExisting)
    return res.status(422).json({ error: "Comment Already Exist" });
  const newComment = await Comment.create({
    owner: ownerId,
    comment,
    blog,
  });

  res.status(201).json({
    message: "Comment Posted Successfully",
  });
};

export const updateComment: RequestHandler = async (
  req: CreateCommentRequest,
  res
) => {
  const { comment } = req.body;
  const { commentId } = req.params;

  const commentUpdated = await Comment.findOneAndUpdate(
    { _id: commentId },
    { comment },
    { new: true }
  );

  if (!commentUpdated)
    return res.status(404).json({ error: "Comment Not Found" });

  res.status(201).json({
    message: "Comment Updated Successfully",
  });
};
export const getComments: RequestHandler = async (req, res) => {
  const { blogId } = req.params;
  if (!isValidObjectId(blogId))
    return res.status(403).json({ error: "Invalid request!" });

  const comments = await Comment.find({ blog: blogId })
    .select("comment owner createdAt")
    .populate({
      path: "owner",
      select: "name avatar.url", // Select the fields you need
    });

  res.status(201).json({
    comments,
  });
};

export const deleteComment: RequestHandler = async (req, res) => {
  const { commentId } = req.params;
  const ownerId = req.user.id;

  if (!isValidObjectId(commentId))
    return res.status(422).json({ error: "Invalid Request" });

  const comment = await Comment.findById(commentId);
  if (comment?.owner.toString() !== ownerId.toString())
    return res.status(422).json({ error: "Unauthorized Access" });

  await Comment.findByIdAndDelete(commentId);

  return res.status(201).json({ message: "Comment Deleted Successfully" });
};
