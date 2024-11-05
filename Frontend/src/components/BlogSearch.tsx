import { useSearchParams } from "react-router-dom";
import Container from "./Container";
import { useEffect, useState } from "react";
import { searchBlog } from "@api/blog";
import { useNotification } from "@hooks/index";
import NotFoundText from "./NotFoundText";
import BlogCard from "./BlogCard";

const BlogSearchSkeleton = ({ query }: { query: string }) => {
  return (
    <div className="pt-4 bg-white text-primary dark:text-white dark:bg-primary">
      <Container className="flex">
        <div className="w-full p-4 py-3 space-y-2">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Search Result: {query}
          </h1>
          <div className="w-full min-h-screen space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex p-4 space-x-4 bg-gray-100 rounded-md animate-pulse"
              >
                <div className="w-16 h-16 bg-gray-300 rounded-md"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-2/3 h-4 bg-gray-300 rounded-md"></div>
                  <div className="w-1/2 h-4 bg-gray-300 rounded-md"></div>
                  <div className="w-3/4 h-4 bg-gray-300 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default function BlogSearch() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [resultNotFound, setResultNotFound] = useState<boolean>(false);
  const { updateNotification } = useNotification();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("title") || "";
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  const searchBlogs = async (val: string) => {
    setLoading(true);
    const { error, blogs } = await searchBlog(val);
    setLoading(false);
    if (error) return updateNotification("error", error);
    if (!blogs.length) {
      setResultNotFound(true);
      return setBlogs([]);
    }
    setResultNotFound(false);
    setBlogs([...blogs]);
    console.log(blogs);
  };

  useEffect(() => {
    if (query.trim()) searchBlogs(query);
  }, [query]);

  if (loading) return <BlogSearchSkeleton query={query} />;

  return (
    <div className="pt-4 bg-white text-primary dark:text-white dark:bg-primary">
      <Container className="flex">
        <div className="w-full p-4 py-3 space-y-2">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Search Result: {query}
          </h1>
          <NotFoundText visible={resultNotFound} text="Blog Not Found" />
          <div className="w-full min-h-screen space-y-3">
            {blogs.map(({ _id, title, createdAt, content, poster }) => {
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
        </div>
      </Container>
    </div>
  );
}
