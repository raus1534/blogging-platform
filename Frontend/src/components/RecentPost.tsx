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
    <div className="p-2 shadow-2xl">
      <h1 className="p-2 pb-0 pl-1 mb-3 text-xl font-bold uppercase open-sans text-stone-950">
        Recent Post
      </h1>
      {blogs?.map(({ _id, title, poster, createdAt }) => {
        return (
          <Link
            key={_id}
            to={"/blog/" + _id}
            className="flex items-center p-1 space-x-2 space-y-2"
          >
            <div className="w-1/3">
              <img
                src={poster?.url}
                alt="blog"
                className="h-16 w-32 rounded-lg"
              />
            </div>
            <div className="w-2/3">
              <p className="text-md font-semibold leading-tight">{title}</p>
              <span className="text-xs text-gray-700">
                {formatDate(createdAt)}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
