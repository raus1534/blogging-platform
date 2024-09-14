import { handleAxiosError } from "@utils/helper";
import client from "./client";

export const createBlog = async (blogInfo: any) => {
  try {
    const token = localStorage.getItem("auth-token");
    const { data } = await client.post("/blog/create", blogInfo, {
      headers: {
        authorization: "BlogIn " + token,
        accept: "application/json",
      },
    });
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};
export const updateBlog = async (blogInfo: any, blogId: string) => {
  try {
    const token = localStorage.getItem("auth-token");
    const { data } = await client.patch("/blog/" + blogId, blogInfo, {
      headers: {
        authorization: "BlogIn " + token,
        accept: "application/json",
      },
    });
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};
export const deleteBlog = async (blogId: string) => {
  try {
    const token = localStorage.getItem("auth-token");
    const { data } = await client.delete("/blog/" + blogId, {
      headers: {
        authorization: "BlogIn " + token,
        accept: "application/json",
      },
    });
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};
export const getUserBlogs = async (userId: string) => {
  try {
    const { data } = await client.get("/blog/user/" + userId);
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};
export const getSingleBlog = async (blogId: string) => {
  try {
    const { data } = await client.get("/blog/single/" + blogId);
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};
export const getBlogsByViews = async () => {
  try {
    const { data } = await client.get("/blog/highView");
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getLatestBlogs = async () => {
  try {
    const { data } = await client.get("/blog/latest");
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getOtherBlogs = async () => {
  try {
    const { data } = await client.get("/blog/others");
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getNoOfCategory = async () => {
  try {
    const { data } = await client.get("/blog/byCategory");
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const searchBlog = async (query: string) => {
  try {
    const { data } = await client.get("/blog/search?title=" + query);
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};
