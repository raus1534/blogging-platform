import { categories, categoriesTypes } from "../utils/category";
import { Model, model, ObjectId, Schema } from "mongoose";

export interface BlogDocument {
  _id: ObjectId;
  owner: ObjectId;
  title: string;
  content: string;
  views: number;
  poster?: { url: string; publicId: string };
  category: categoriesTypes;
}

const blogSchema = new Schema<BlogDocument>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    poster: {
      type: Object,
      url: String,
      publicId: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      enum: categories,
    },
  },
  { timestamps: true }
);

export default model("Blog", blogSchema) as Model<BlogDocument>;
