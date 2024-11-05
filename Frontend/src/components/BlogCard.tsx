import { formatDate, sanitizeHTMLWithP } from "@utils/helper";
import { Link } from "react-router-dom";

interface Props {
  id: string;
  title: string;
  createdAt: string;
  content: string;
  poster: string;
}

export default function BlogCard({
  id,
  title,
  createdAt,
  content,
  poster,
}: Props) {
  return (
    <Link
      to={`/blog/${id}`}
      className="flex flex-col items-start p-4 transition-shadow duration-300 bg-white rounded-lg shadow-lg text-primary dark:text-white dark:bg-gray-800 sm:flex-row sm:items-center hover:shadow-xl"
    >
      <div className="w-full mb-3 sm:w-2/3 sm:mb-0">
        <h3 className="text-lg font-bold">{title}</h3>
        <span className="block mb-2 text-xs">{formatDate(createdAt)}</span>
        <p
          className="text-sm line-clamp-3"
          dangerouslySetInnerHTML={sanitizeHTMLWithP(
            content.slice(0, 200) + "..."
          )}
        />
      </div>
      <div className="w-full sm:w-1/3 sm:ml-4">
        <img
          src={poster}
          alt="blog"
          className="object-cover w-full h-40 transition-transform duration-300 rounded-lg sm:h-32 hover:scale-105"
        />
      </div>
    </Link>
  );
}
