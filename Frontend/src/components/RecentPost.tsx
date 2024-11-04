import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getLatestBlogs } from "@api/blog";
import { Link } from "react-router-dom";
import { formatDate } from "@utils/helper";

const BlogSkeleton = () => {
  return (
    <div className="p-4 m-2 rounded-lg shadow-2xl md:m-0 dark:bg-gray-800 animate-pulse">
      <h1 className="p-4 pb-0 pl-1 mb-3 text-xl font-bold uppercase text-stone-950 dark:text-gray-100">
        Recent Post
      </h1>
      {/* Placeholder for the blog posts */}
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex items-center p-1 mb-2 space-x-2 space-y-2 transition-colors rounded-lg dark:hover:bg-gray-700"
        >
          <div className="w-1/3">
            <div className="w-32 h-16 bg-gray-300 rounded-lg"></div>
          </div>
          <div className="w-2/3">
            <div className="h-4 mb-2 bg-gray-400 rounded-md animate-pulse"></div>
            <div className="w-1/2 h-3 bg-gray-400 rounded-md animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function RecentPost() {
  const [blogs, setBlogs] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true); // State for loading
  const navigate = useNavigate();

  const getBlogs = async () => {
    setLoading(true); // Set loading to true when fetching starts
    const { error, blogs } = await getLatestBlogs();
    setLoading(false); // Set loading to false when fetching ends
    if (error) return navigate("/");
    setBlogs([...blogs]);
  };

  useEffect(() => {
    getBlogs();
  }, []);

  // Show loading skeleton while fetching data
  if (loading || !blogs) {
    return <BlogSkeleton />;
  }

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
