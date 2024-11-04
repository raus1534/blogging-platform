import { useNavigate, useParams } from "react-router-dom";
import Container from "./Container";
import RecentPost from "./RecentPost";
import Categories from "./Categories";
import { useEffect, useState } from "react";
import { IoMdEye } from "react-icons/io";
import { getSingleBlog } from "@api/blog";
import { formatDate, sanitizeHTML } from "@utils/helper";
import Comment from "./Comment";

export default function Blog() {
  const { blogId } = useParams();
  const [singleBlog, setSingleBlog] = useState<any>();
  const navigate = useNavigate();

  const getBlog = async () => {
    const { blog, error } = await getSingleBlog(blogId!);
    if (error) return navigate("/");

    setSingleBlog(blog);
  };

  useEffect(() => {
    if (!blogId) return navigate("/");
    getBlog();
  }, [blogId]);

  return (
    <div className="pt-4 bg-white dark:bg-gray-900">
      <Container className="flex ">
        <div className="w-full px-3 py-3 space-y-2 sm:px-0 sm:w-2/3">
          <img
            src={singleBlog?.poster.url}
            alt="blog"
            className="w-full sm:h-[500px] h-[250px] object-cover rounded-lg"
          />
          <div className="space-y-2">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                {singleBlog?.title}
              </h1>
              <span className="flex items-center pr-5 space-x-1 text-gray-600 dark:text-gray-400">
                <IoMdEye />
                <span>{singleBlog?.views}</span>
              </span>
            </div>
            <div className="flex justify-between pr-5 text-gray-600 dark:text-gray-400">
              <span className="text-md">
                {formatDate(singleBlog?.createdAt) || ""}
              </span>
              <div className="text-md">
                <span>{singleBlog?.owner.name}</span>
              </div>
            </div>
          </div>
          <p
            className="pr-4 text-lg text-justify text-gray-800 dark:text-gray-300"
            dangerouslySetInnerHTML={sanitizeHTML(singleBlog?.content || "")}
          />
          <hr className="border-2 border-primary dark:border-gray-700" />
          <Comment blog={blogId!} />
        </div>
        {/* Extra */}
        <div className="hidden w-1/3 px-2 space-y-2 sm:block">
          <RecentPost />
          <Categories />
        </div>
      </Container>
    </div>
  );
}
