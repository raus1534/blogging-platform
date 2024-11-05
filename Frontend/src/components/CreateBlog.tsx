import { BlogDataType } from "@types";
import Container from "./Container";
import BlogForm from "./form/BlogForm";
import { useNotification } from "@hooks/index";
import { createBlog } from "@api/blog";
import { useNavigate } from "react-router";
import { useState } from "react";

const validate = (blogData: BlogDataType) => {
  const { title, poster, category, content } = blogData;
  if (!title) return { ok: false, error: "Title is Missing" };
  if (title.length < 5) return { ok: false, error: "Invalid Title" };
  if (!poster) return { ok: false, error: "Poster is Missing" };
  if (!category) return { ok: false, error: "Category is Missing" };
  if (!content) return { ok: false, error: "Blog is Missing" };
  return { ok: true };
};

export default function CreateBlog() {
  const { updateNotification } = useNotification();
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();
  const handleUpload = async (blogData: BlogDataType) => {
    setBusy(true);
    const { ok, error: err } = validate(blogData);
    if (!ok && err) return updateNotification("error", err);
    const formData = new FormData();

    for (let key in blogData) {
      if (blogData[key as keyof BlogDataType]) {
        formData.append(key, blogData[key as keyof BlogDataType] as any);
      }
    }

    const { error, message } = await createBlog(formData);
    setBusy(false);
    if (error) return updateNotification("error", error);
    updateNotification("success", message);
    return navigate("/dashboard");
  };
  return (
    <div className="bg-white text-primary dark:bg-primary dark:text-white">
      <Container>
        <BlogForm onSubmit={handleUpload} busy={busy} />
      </Container>
    </div>
  );
}
