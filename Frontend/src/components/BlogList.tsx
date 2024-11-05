import { getOtherBlogs } from "@api/blog";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BlogCard from "./BlogCard";

const BlogSkeleton = () => {
  return (
    <div className="w-full h-[120vh] p-3 space-y-3 overflow-scroll dark:bg-primary animate-pulse">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col p-4 transition-shadow duration-300 bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-pulse"
        >
          <div className="w-full h-40 bg-gray-300 rounded-lg"></div>
          <div className="mt-4">
            <div className="h-6 mb-2 bg-gray-400 rounded-md"></div>
            <div className="w-3/4 h-4 mb-2 bg-gray-400 rounded-md"></div>
            <div className="w-1/2 h-4 mb-2 bg-gray-400 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function BlogList() {
  const [blogs, setBlogs] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true); // State for loading
  const navigate = useNavigate();

  const getBlogs = async () => {
    setLoading(true); // Set loading to true when fetching starts
    const { error, blogs } = await getOtherBlogs();
    setLoading(false); // Set loading to false when fetching ends
    if (error) return navigate("/");
    setBlogs([...blogs]);
  };

  useEffect(() => {
    getBlogs();
  }, []);

  if (loading || !blogs) {
    return <BlogSkeleton />;
  }
  return (
    <div className="w-full h-[120vh] p-3 space-y-3 overflow-scroll dark:bg-primary">
      {blogs?.map(({ _id, title, createdAt, poster, content }) => {
        return (
          <BlogCard
            key={_id}
            id={_id}
            title={title}
            createdAt={createdAt}
            poster={poster?.url}
            content={content}
          />
        );
      })}
    </div>
  );
}
