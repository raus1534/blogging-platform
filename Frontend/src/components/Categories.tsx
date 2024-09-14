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
    <div className="p-2 bg-white shadow-2xl">
      <h1 className="p-2 pb-0 pl-1 mb-2 text-xl font-semibold uppercase open-sans text-stone-950">
        Categories
      </h1>
      {categories.map((category, index) => {
        return (
          <div key={index} className="flex justify-between p-1 py-2 border-b-2">
            <span>{category}</span>
            <span>({result[category] || 0})</span>
          </div>
        );
      })}
    </div>
  );
}
