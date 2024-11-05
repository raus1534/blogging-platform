import { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { categories, categoriesTypes } from "@utils/category";
import RichTextEditor from "@components/RichTextEditor";
import SubmitBtn from "./SubmitBtn";
import { BlogDataType } from "@types";

export interface BlogDataTypes {
  poster: File | null;
  title: string;
  category: categoriesTypes;
}
interface Props {
  initialValue?: {
    title: string;
    category: categoriesTypes;
    content: string;
    poster: any;
  };
  onSubmit: (blogData: BlogDataType) => void;
  busy?: boolean;
}

export default function BlogForm({ onSubmit, busy, initialValue }: Props) {
  const [blogData, setBlogData] = useState<BlogDataTypes>({
    poster: null,
    title: "",
    category: "Technology",
  });
  const [blog, setBlog] = useState("");
  const [posterForUi, setPosterForUi] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (
      name === "poster" &&
      e.target instanceof HTMLInputElement &&
      e.target.files
    ) {
      setPosterForUi(URL.createObjectURL(e.target.files[0]));
      return setBlogData({ ...blogData, poster: e.target.files[0] });
    }
    if (name === "title" || name === "category") {
      return setBlogData({ ...blogData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ ...blogData, content: blog });
  };

  useEffect(() => {
    if (initialValue) {
      const { title, category, content } = initialValue;
      setBlogData({ title, category, poster: null });
      setBlog(content);
      setPosterForUi(initialValue?.poster.url);
    }
  }, [initialValue]);

  return (
    <form
      className="p-5 space-y-5 bg-white dark:bg-gray-800"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center space-x-4">
        <label
          className="w-full overflow-hidden border-2 cursor-pointer sm:h-[420px] h-[190px] border-primary dark:border-gray-600 sm:rounded-xl"
          htmlFor="poster"
        >
          <input
            onChange={handleChange}
            name="poster"
            type="file"
            id="poster"
            hidden
            accept="image/*"
          />
          <div className="flex items-center justify-center w-full h-full overflow-hidden text-xl font-semibold">
            {posterForUi ? (
              <img src={posterForUi} alt="Poster" className="w-full" />
            ) : (
              <FaCloudUploadAlt className="w-1/2 text-gray-500 dark:text-gray-300 h-1/2" />
            )}
          </div>
        </label>
      </div>

      <div className="flex flex-col-reverse">
        <input
          id="title"
          name="title"
          type="text"
          className="w-full p-1 bg-transparent border-2 rounded outline-none text-primary dark:border-gray-600 dark:text-white peer"
          placeholder="Blog Title"
          value={blogData.title}
          onChange={handleChange}
        />
        <label
          htmlFor="title"
          className="self-start font-semibold text-primary dark:text-gray-300"
        >
          Title
        </label>
      </div>
      <div className="flex flex-col-reverse">
        <select
          id="category"
          name="category"
          className="w-full p-1 bg-transparent border-2 rounded outline-none text-primary dark:border-gray-600 dark:text-white peer"
          value={blogData.category}
          onChange={handleChange}
        >
          <option value="">Select a category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <label
          htmlFor="category"
          className="self-start font-semibold text-primary dark:text-gray-300"
        >
          Category
        </label>
      </div>
      <div className="">
        <label
          htmlFor="blog"
          className="self-start font-semibold text-primary dark:text-gray-300"
        >
          Blog
        </label>
        <RichTextEditor onChange={setBlog} value={blog} />
      </div>

      <SubmitBtn submitValue={initialValue ? "Update" : "Post"} busy={busy} />
    </form>
  );
}
