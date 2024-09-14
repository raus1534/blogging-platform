import { getSingleBlog, updateBlog } from "@api/blog";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Container from "./Container";
import BlogForm from "./form/BlogForm";
import { BlogDataType } from "@types";
import { useNotification } from "@hooks/index";

const validate = (blogData: BlogDataType) => {
  const { title, category, content } = blogData;
  if (!title) return { ok: false, error: "Title is Missing" };
  if (title.length < 5) return { ok: false, error: "Invalid Title" };
  if (!category) return { ok: false, error: "Category is Missing" };
  if (!content) return { ok: false, error: "Blog is Missing" };
  return { ok: true };
};
export default function UpdateBlog() {
  const { blogId } = useParams();
  const [busy, setBusy] = useState(false);
  const [blogDetail, setBlogDetail] = useState();
  const { updateNotification } = useNotification();
  const navigate = useNavigate();
  const getBlog = async () => {
    const { blog, error } = await getSingleBlog(blogId!);
    if (error) return navigate("/");

    setBlogDetail(blog);
  };

  const handleUpdate = async (blogData: BlogDataType) => {
    console.log(blogData);
    setBusy(true);
    const { ok, error: err } = validate(blogData);
    if (!ok && err) return updateNotification("error", err);
    const formData = new FormData();

    for (let key in blogData) {
      if (blogData[key as keyof BlogDataType]) {
        formData.append(key, blogData[key as keyof BlogDataType] as any);
      }
    }

    const { error, message } = await updateBlog(formData, blogId!);
    setBusy(false);
    if (error) return updateNotification("error", error);
    updateNotification("success", message);
    return navigate("/dashboard");
  };
  useEffect(() => {
    getBlog();
  }, []);
  return (
    <Container>
      <BlogForm
        initialValue={blogDetail}
        onSubmit={handleUpdate}
        busy={busy}
      ></BlogForm>
    </Container>
  );
}
