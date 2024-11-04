import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getLatestBlogs } from "@api/blog";
import { Link } from "react-router-dom";
import { formatDate } from "@utils/helper";

export default function RecentPost() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const navigate = useNavigate();

  const getBlogs = async () => {
    const { error, blogs } = await getLatestBlogs();
    if (error) return navigate("/");
    setBlogs([...blogs]);
  };

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <div className="p-4 m-2 rounded-lg shadow-2xl md:m-0 dark:bg-gray-800">
      <h1 className="p-4 pb-0 pl-1 mb-3 text-xl font-bold uppercase open-sans text-stone-950 dark:text-gray-100">
        Recent Post
      </h1>
      {blogs?.map(({ _id, title, poster, createdAt }) => {
        return (
          <Link
            key={_id}
            to={"/blog/" + _id}
            className="flex items-center p-1 space-x-2 space-y-2 transition-colors rounded-lg dark:hover:bg-gray-700"
          >
            <div className="w-1/3">
              <img
                src={poster?.url}
                alt="blog"
                className="w-32 h-16 rounded-lg"
              />
            </div>
            <div className="w-2/3">
              <p className="font-semibold leading-tight text-md text-stone-800 dark:text-gray-200">
                {title}
              </p>
              <span className="text-xs text-gray-700 dark:text-gray-400">
                {formatDate(createdAt)}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
