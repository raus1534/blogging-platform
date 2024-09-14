import { handleAxiosError } from "@utils/helper";
import client from "./client";

export const createUser = async (userInfo: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const { data } = await client.post("/auth/create", userInfo);
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const verifyUserEmail = async (userInfo: {
  userId: string;
  token: string;
}) => {
  try {
    const { data } = await client.post("/auth/verify-email", userInfo);
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const signInUser = async (userInfo: {
  email: string;
  password: string;
}) => {
  try {
    const { data } = await client.post("/auth/sign-in", userInfo);
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getIsAuth = async (token: string) => {
  try {
    const { data } = await client.get("/auth/is-auth", {
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

export const forgetPassword = async (email: string) => {
  try {
    const { data } = await client.post("/auth/forget-password", { email });
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};
export const validateResetToken = async (token: string, userId: string) => {
  try {
    const { data } = await client.post("/auth/verify-pass-reset-token", {
      token,
      userId,
    });
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};
export const resetPassword = async (passwordInfo: {
  password: string;
  userId: string;
  token: string;
}) => {
  try {
    const { data } = await client.post("/auth/update-password", passwordInfo);
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};
export const resendOTP = async (userId: string) => {
  try {
    const { data } = await client.post("/auth/resend-verify-token", { userId });
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};
export const updateUserProfile = async (userInfo: any) => {
  const token = localStorage.getItem("auth-token");
  try {
    const { data } = await client.post("/auth/update-profile", userInfo, {
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
