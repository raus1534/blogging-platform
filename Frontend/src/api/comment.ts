import { handleAxiosError } from "@utils/helper";
import client from "./client";

export const createComment = async (commentInfo: {
  blog: string;
  comment: string;
}) => {
  try {
    const token = localStorage.getItem("auth-token");
    const { data } = await client.post("/comment/create", commentInfo, {
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
export const updateComment = async (id: string, comment: string) => {
  try {
    const token = localStorage.getItem("auth-token");
    const { data } = await client.patch(
      "/comment/" + id,
      { comment },
      {
        headers: {
          authorization: "BlogIn " + token,
          accept: "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getComments = async (blogId: string) => {
  try {
    const { data } = await client.get("/comment/" + blogId);
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const deleteComment = async (blogId: string) => {
  try {
    const token = localStorage.getItem("auth-token");
    const { data } = await client.delete("/comment/" + blogId, {
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
