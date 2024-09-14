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
    <Container className="flex">
      <>
        <div className="w-full px-3 py-3 space-y-2 sm:px-0 sm:w-2/3">
          <img
            src={singleBlog?.poster.url}
            alt="blog"
            className="w-full sm:h-[500px] h-[250px]"
          />
          <div className="space-y-0">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold sm:text-4xl">
                {singleBlog?.title}
              </h1>
              <span className="flex items-center pr-5 space-x-1">
                <IoMdEye />
                <span>{singleBlog?.views}</span>
              </span>
            </div>
            <div className="flex justify-between pr-5">
              <span className="text-stone-600 text-md">
                {formatDate(singleBlog?.createdAt) || ""}
              </span>
              <div className="text-stone-600 text-md">
                <span>{singleBlog?.owner.name}</span>
              </div>
            </div>
          </div>
          <p
            className="pr-4 text-lg text-justify"
            dangerouslySetInnerHTML={sanitizeHTML(singleBlog?.content || "")}
          />
          <hr className="border-2 border-primary" />
          <Comment blog={blogId!} />
        </div>
      </>
      {/* //extra */}
      <div className="hidden w-1/3 px-2 space-y-2 sm:block">
        <RecentPost />
        <Categories />
      </div>
    </Container>
  );
}
