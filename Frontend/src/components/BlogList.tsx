import { getOtherBlogs } from "@api/blog";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BlogCard from "./BlogCard";

export default function BlogList() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const navigate = useNavigate();

  const getBlogs = async () => {
    const { error, blogs } = await getOtherBlogs();
    if (error) return navigate("/");
    setBlogs([...blogs]);
  };

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <div className="w-full h-[120vh] p-3 space-y-3 overflow-scroll dark:bg-gray-900">
      {blogs.map(({ _id, title, createdAt, poster, content }) => {
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
