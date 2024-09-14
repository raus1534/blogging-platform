import { AuthContextType } from "@context/AuthProvider";
import { useAuth, useNotification } from "@hooks/index";
import { useEffect, useRef, useState } from "react";
import { ImSpinner5 } from "react-icons/im";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "@api/comment";
import { formatDate } from "@utils/helper";
import { BiEdit } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";
import logo from "../assets/logo.png";
import NotFoundText from "./NotFoundText";

export default function Comment({ blog }: { blog: string }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [commentToUpdate, setCommentToUpdate] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { authInfo } = useAuth() as AuthContextType;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const userId = authInfo?.profile?.id;
  const { updateNotification } = useNotification();
  const { isLoggedIn } = authInfo;

  const getComment = async () => {
    const { comments, error } = await getComments(blog!);
    if (error) return;
    setComments(comments);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleCommentUpdate = async () => {
    setBusy(true);
    const { message, error } = await updateComment(commentToUpdate!, comment);
    setBusy(false);
    if (error) return;
    setComment("");
    getComment();
    updateNotification("success", message);
  };

  const handleCommentDelete = async (id: string) => {
    const { message, error } = await deleteComment(id);
    if (error) return updateNotification("error", error);
    getComment();
    updateNotification("success", message);
  };

  const handleSubmit = async () => {
    setBusy(true);
    if (comment.length < 5)
      return updateNotification("warning", "Comment is too short");
    const { error, message } = await createComment({ blog, comment });
    setBusy(false);
    if (error) return updateNotification("error", error);
    getComment();
    setComment("");
    updateNotification("success", message);
  };

  useEffect(() => {
    getComment();
    console.log(comments);
  }, [blog]);

  return (
    <div className="">
      <h1 className="text-2xl font-semibold">Comments</h1>
      {isLoggedIn ? (
        <div>
          <textarea
            ref={textareaRef}
            name="comment"
            value={comment}
            onChange={handleChange}
            rows={5}
            className="w-full p-1 bg-transparent border-2 border-gray-600 rounded resize-none outline-primary"
            placeholder="Write your thoughts"
          />
          {comment.length ? (
            commentToUpdate ? (
              <button
                type="button"
                className="flex items-center justify-center w-full h-10 p-1 text-lg font-semibold text-white transition rounded cursor-pointer bg-primary hover:bg-opacity-90"
                onClick={handleCommentUpdate}
              >
                {busy ? <ImSpinner5 className="animate-spin" /> : "Update"}
              </button>
            ) : (
              <button
                type="button"
                className="flex items-center justify-center w-full h-10 p-1 text-lg font-semibold text-white transition rounded cursor-pointer bg-primary hover:bg-opacity-90"
                onClick={handleSubmit}
              >
                {busy ? <ImSpinner5 className="animate-spin" /> : "Submit"}
              </button>
            )
          ) : null}
        </div>
      ) : (
        <span className="text-sm italic">
          Login First To Share Your Thoughts
        </span>
      )}
      <div className="mt-4 space-y-3">
        {comments.map((comment) => {
          return (
            <div className="flex space-x-2">
              <img
                src={comment?.owner?.avatar?.url || logo}
                className="w-12 rounded-lg"
              />
              <div className="flex-1">
                <span className="flex justify-between">
                  <span className="font-bold text-primary">
                    {comment?.owner?.name}
                  </span>
                  <span className="text-xs italic text-gray-700">
                    {formatDate(comment?.createdAt)}
                  </span>
                </span>
                <span className="flex justify-between">
                  <span className="text-base">{comment?.comment}</span>
                  {userId === comment?.owner?._id ? (
                    <span className="flex space-x-2">
                      <BiEdit
                        className="cursor-pointer"
                        onClick={() => {
                          setComment(comment.comment);
                          setCommentToUpdate(comment?._id);
                          if (textareaRef.current) {
                            textareaRef.current.scrollIntoView({
                              behavior: "smooth",
                            });
                            textareaRef.current.focus();
                          }
                        }}
                      />
                      <FiDelete
                        className="cursor-pointer"
                        onClick={() => {
                          handleCommentDelete(comment._id);
                        }}
                      />
                    </span>
                  ) : null}
                </span>
              </div>
            </div>
          );
        })}
        <NotFoundText
          visible={comments.length === 0}
          text="Not Comments Yet!"
        />
      </div>
    </div>
  );
}
