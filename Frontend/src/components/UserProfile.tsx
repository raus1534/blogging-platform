import React from "react";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ImPencil, ImSpinner5 } from "react-icons/im";
import { useAuth, useNotification } from "@hooks/index";
import { AuthContextType } from "@context/AuthProvider";
import { useNavigate } from "react-router";
import { updateUserProfile } from "@api/auth";

type UserInfo = {
  name: string;
  avatar: File | null;
  [key: string]: string | File | null;
};

export default function UserProfile() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    avatar: null,
  });
  const [avatarFile, setAvatarFile] = useState<File>();
  const [isPending, setIsPending] = useState(false);
  const { authInfo } = useAuth() as AuthContextType;
  const { updateNotification } = useNotification();
  const { isLoggedIn } = authInfo;
  const profile = authInfo?.profile;
  const avatar = authInfo?.profile?.avatar?.url;
  const navigate = useNavigate();

  const avatarSource = avatarFile ? URL.createObjectURL(avatarFile) : avatar;
  let showSubmitButton =
    avatarSource !== avatar || userInfo?.name !== profile?.name;

  const handleChange = ({ target }: { target: HTMLInputElement }) => {
    const { value, files, name } = target;
    if (name === "avatar" && files) {
      const file = files[0];
      setAvatarFile && setAvatarFile(file);
      return setUserInfo({ ...userInfo, avatar: file });
    }
    setUserInfo({ ...userInfo, [name]: value });
  };

  const updateUserInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    if (userInfo?.name.trim().length < 5) return toast.error("Name is Invalid");
    const formData = new FormData();

    for (let key in userInfo) {
      if (userInfo[key]) formData.append(key, userInfo[key] as any);
    }
    const { message, error } = await updateUserProfile(formData);
    setIsPending(false);
    if (error) return updateNotification("error", error);
    updateNotification("success", message);
    return window.location.reload();
  };

  useEffect(() => {
    if (profile) {
      setUserInfo({ name: profile?.name, avatar: null });
    }
  }, [profile, isLoggedIn, navigate]);

  return (
    <div className="pt-4 pr-3 border-r-2 border-primary">
      <form className="space-y-6" onSubmit={updateUserInfo}>
        <div className="flex items-center space-x-4">
          <div className="relative inline-block mx-auto">
            <div className="flex items-center justify-center overflow-hidden text-xl font-semibold border-2 rounded-full w-28 h-28 border-primary">
              <img
                src={avatarSource || profile?.avatar || logo}
                className="w-28 h-28 "
                alt="User Avatar"
              />
            </div>

            <label
              className="absolute right-0 bg-white rounded-full top-2 dark:bg-gray-800" // Changed background color for dark mode
              htmlFor="avatar"
            >
              <input
                onChange={handleChange}
                name="avatar"
                type="file"
                id="avatar"
                hidden
                accept="image/*"
              />
              <ImPencil className="w-6 h-6 p-1 cursor-pointer" />
            </label>
          </div>
        </div>
        <div className="flex flex-col-reverse">
          <input
            id={"name"}
            name={"name"}
            type="text"
            value={userInfo?.name}
            className="w-full p-1 bg-transparent border-2 border-gray-600 rounded outline-none dark:border-gray-300 peer" // Changed dark border color
            onChange={handleChange}
          />
          <label
            htmlFor={"name"}
            className="self-start font-semibold text-gray-800 dark:text-gray-200" // Changed label text color
          >
            Name
          </label>
        </div>
        <div className="flex flex-col-reverse">
          <input
            id={"email"}
            name={"email"}
            className="w-full p-1 bg-transparent border-2 border-gray-600 rounded outline-none dark:border-gray-300 peer" // Changed dark border color
            value={profile?.email}
            disabled
          />
          <label
            htmlFor={"email"}
            className="self-start font-semibold text-gray-800 dark:text-gray-200" // Changed label text color
          >
            Email
          </label>
        </div>

        {showSubmitButton ? (
          <button
            type="submit"
            className="flex items-center justify-center w-full h-10 p-1 text-lg font-semibold text-white transition rounded cursor-pointer bg-primary hover:bg-opacity-90"
          >
            {isPending ? <ImSpinner5 className="animate-spin" /> : "Submit"}
          </button>
        ) : null}
      </form>
    </div>
  );
}
