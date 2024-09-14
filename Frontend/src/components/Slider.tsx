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
        className="w-full sm:h-[65%] h-1/2 relative"
      >
        <img
          src={blogs[0]?.poster?.url}
          alt="blog"
          className="relative w-full p-3 pb-0 sm:h-[500px] h-1/2"
        />
        <span className="absolute bottom-0 p-3 text-xl font-bold uppercase sm:text-3xl sm:text-white text-primary left-5 right-3 slider slider-hover">
          {blogs[0]?.title}
        </span>
      </Link>
      <div className="flex space-x-2">
        {blogs.slice(1).map(({ title, poster, _id }) => {
          return (
            <Link to={"/blog/" + _id} key={_id} className="w-1/3 rounded-xl">
              <img
                src={poster?.url}
                alt="blog"
                className="w-full p-1 pb-0 sm:p-3 sm:h-4/5 h-3/5"
              />
              <div className="hidden px-4 font-bold sm:block text-md text-stone-800 text-wrap">
                {title.slice(0, 50) + `${title.length > 50 ? " ...." : ""}`}
              </div>
              <div className="px-1 text-sm font-bold sm:hidden sm:px-4 text-stone-800">
                {title.slice(0, 32) + `${title.length > 32 ? " ...." : ""}`}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
