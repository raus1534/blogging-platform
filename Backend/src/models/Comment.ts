import { Model, model, ObjectId, Schema } from "mongoose";

export interface CommentDocument {
  _id: ObjectId;
  owner: ObjectId;
  blog: ObjectId;
  comment: string;
}

const commentSchema = new Schema<CommentDocument>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      require: true,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default model("Comment", commentSchema) as Model<CommentDocument>;
