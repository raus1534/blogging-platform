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
  }, [blog]);

  return (
    <div className="p-4 text-gray-900 rounded-lg shadow-md dark:text-white">
      <h1 className="mb-4 text-2xl font-semibold">Comments</h1>
      {isLoggedIn ? (
        <div className="mb-4">
          <textarea
            ref={textareaRef}
            name="comment"
            value={comment}
            onChange={handleChange}
            rows={5}
            className="w-full p-2 transition bg-white border-2 border-gray-300 rounded-lg outline-none resize-none focus:border-primary"
            placeholder="Write your thoughts"
          />
          <button
            type="button"
            className={`flex items-center justify-center w-full h-10 p-1 mt-2 text-lg font-semibold text-white transition rounded-lg ${
              commentToUpdate
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-primary hover:bg-opacity-90"
            }`}
            onClick={commentToUpdate ? handleCommentUpdate : handleSubmit}
            disabled={busy}
          >
            {busy ? (
              <ImSpinner5 className="animate-spin" />
            ) : commentToUpdate ? (
              "Update"
            ) : (
              "Submit"
            )}
          </button>
        </div>
      ) : (
        <span className="text-sm italic">
          Login First To Share Your Thoughts
        </span>
      )}
      <div className="mt-4 space-y-3">
        {comments.map((comment) => {
          return (
            <div
              key={comment._id}
              className="flex p-3 space-x-2 bg-white rounded-lg shadow-sm"
            >
              <img
                src={comment?.owner?.avatar?.url || logo}
                alt="User Avatar"
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-bold text-primary">
                    {comment?.owner?.name}
                  </span>
                  <span className="text-xs italic text-gray-700">
                    {formatDate(comment?.createdAt)}
                  </span>
                </div>
                <p className="text-base">{comment?.comment}</p>
                {userId === comment?.owner?._id && (
                  <div className="flex mt-2 space-x-2">
                    <BiEdit
                      className="text-blue-600 cursor-pointer hover:text-blue-700"
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
                      className="text-red-600 cursor-pointer hover:text-red-700"
                      onClick={() => handleCommentDelete(comment._id)}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <NotFoundText visible={comments.length === 0} text="No Comments Yet!" />
      </div>
    </div>
  );
}
