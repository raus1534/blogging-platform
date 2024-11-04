import { getBlogsByViews } from "@api/blog";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export default function Slider() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const navigate = useNavigate();

  const getBlogs = async () => {
    const { blogs, error } = await getBlogsByViews();
    if (error) return navigate("/");

    setBlogs([...blogs]);
  };

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <>
      <Link
        to={"/blog/" + blogs[0]?._id}
        className="relative w-full overflow-hidden rounded-xl"
      >
        <img
          src={blogs[0]?.poster?.url}
          alt="blog"
          className="w-full h-[250px] sm:h-[400px] object-cover rounded-xl"
        />
        <span className="absolute bottom-0 p-3 text-lg font-bold text-white uppercase bg-black sm:text-2xl left-5 right-3 bg-opacity-60">
          {blogs[0]?.title}
        </span>
      </Link>
      <div className="flex p-3 space-x-2">
        {blogs.slice(1).map(({ title, poster, _id }) => {
          return (
            <Link
              to={"/blog/" + _id}
              key={_id}
              className="w-1/3 transition-colors rounded-lg shadow-md dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <img
                src={poster?.url}
                alt="blog"
                className="w-full h-40 transition-transform duration-200 transform rounded-lg sm:h-60" // Fixed height for uniformity
              />
              <div className="hidden px-4 font-bold sm:block text-md text-stone-800 dark:text-gray-300 text-wrap">
                {title.slice(0, 50) + `${title.length > 50 ? " ...." : ""}`}
              </div>
              <div className="px-1 text-xs font-bold sm:hidden sm:px-4 text-stone-800 dark:text-gray-300">
                {title.slice(0, 32) + `${title.length > 32 ? " ...." : ""}`}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
