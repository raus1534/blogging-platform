import { getNoOfCategory } from "@api/blog";
import { categories } from "@utils/category";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Categories() {
  const [result, setResult] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  const getResult = async () => {
    try {
      const response = await getNoOfCategory();
      const { error, result } = response;
      if (error) {
        navigate("/");
      } else {
        const categoryCounts: Record<string, number> = {};
        result.forEach((item: { category: string; count: number }) => {
          categoryCounts[item.category] = item.count;
        });
        setResult(categoryCounts);
      }
    } catch (err) {
      console.error("Error fetching category counts:", err);
      navigate("/");
    }
  };

  useEffect(() => {
    getResult();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <h1 className="pb-2 mb-4 text-lg font-bold text-gray-800 uppercase border-b border-gray-300 dark:text-gray-100 dark:border-gray-600">
        Categories
      </h1>
      <div className="space-y-3">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 text-sm text-gray-700 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="font-medium">{category}</span>
            <span className="text-gray-500 dark:text-gray-400">
              ({result[category] || 0})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
