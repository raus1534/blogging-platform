import { Link, useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { useAuth, useNotification } from "@hooks/index";
import { AuthContextType } from "@context/AuthProvider";
import { deleteBlog, getUserBlogs } from "@api/blog";
import { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import NotFoundText from "./NotFoundText";

export default function UserBlog() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [showNotFound, setShowNotFound] = useState(false);
  const { updateNotification } = useNotification();
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [selectedBlog, setSelectedBlog] = useState<string>();
  const [busy, setBusy] = useState<boolean>(false);
  const { authInfo } = useAuth() as AuthContextType;
  const { profile } = authInfo;
  const userId = profile?.id;
  const navigate = useNavigate();

  const getBlogs = async () => {
    const { blogs, error } = await getUserBlogs(userId!);
    if (error) return navigate("/");
    if (!blogs.length) return setShowNotFound(true);

    setBlogs([...blogs]);
  };

  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    console.log(selectedBlog);
    const { error, message } = await deleteBlog(selectedBlog!);
    setBusy(false);
    if (error) return updateNotification("error", error);
    updateNotification("success", message);
    hideConfirmModal();
    getBlogs();
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <>
      <div className="flex-1 h-screen space-y-4 bg-gray-100 dark:bg-primary">
        <Link
          to="/blog/create"
          className="flex items-center justify-center w-1/2 h-10 p-1 text-lg font-semibold text-white transition rounded cursor-pointer sm:w-1/5 bg-primary hover:bg-opacity-90"
        >
          Create Blog
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          My Blogs
        </h1>
        <div className="overflow-scroll h-[85%]">
          {blogs.map(({ _id: id, title, poster }) => {
            return (
              <div
                key={id}
                className="flex flex-col items-center w-full space-y-2 border-b-2 md:flex-row border-primary dark:border-gray-600"
              >
                <Link
                  to={"/blog/" + id}
                  className="flex flex-col items-center w-full p-1 space-x-3 space-y-2 md:flex-row"
                >
                  <img
                    src={poster.url}
                    alt="blog"
                    className="object-cover w-32 h-16 rounded-lg" // Set a uniform width with object-cover
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {title}
                    </p>
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      July 1, 2024
                    </span>
                  </div>
                </Link>
                <div className="flex px-2 space-x-3 text-xl">
                  <Link to={"/blog/update/" + id}>
                    <CiEdit className="text-gray-700 cursor-pointer dark:text-gray-300" />
                  </Link>
                  <MdDelete
                    className="text-gray-700 cursor-pointer dark:text-gray-300"
                    onClick={() => {
                      setShowConfirmModal(true);
                      setSelectedBlog(id);
                    }}
                  />
                </div>
              </div>
            );
          })}

          <NotFoundText visible={showNotFound} text="No Blogs Yet :(" />
        </div>
      </div>
      <div>
        <ConfirmModal
          title="Are You Sure"
          subTitle="This action will remove this blog permanently!!"
          visible={showConfirmModal}
          onConfirm={handleOnDeleteConfirm}
          onCancel={hideConfirmModal}
          busy={busy}
        />
      </div>
    </>
  );
}
