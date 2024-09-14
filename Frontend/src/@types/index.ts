import { categoriesTypes } from "@utils/category";

export interface BlogDataType {
  poster: File | null;
  title: string;
  category: categoriesTypes;
  content: string;
}
