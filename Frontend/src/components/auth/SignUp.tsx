import { useEffect, useState } from "react";
import { commonModalClasses } from "@utils/Theme";
import Container from "../Container";
import FormContainer from "@components/form/FormContainer";
import InputField from "@components/form/InputField";
import SubmitBtn from "../form/SubmitBtn";
import Title from "../form/Title";
import { createUser } from "../../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useNotification } from "../../hooks";
import { isValidEmail, isValidName } from "@utils/helper";
import { AuthContextType } from "@context/AuthProvider";

const validateUserDetail = ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  if (!name.trim()) return { ok: false, error: "Name doesn't exist" };
  if (!isValidName(name)) return { ok: false, error: "Invalid Name" };
  if (!email.trim()) return { ok: false, error: "Email doesn't exist" };
  if (!isValidEmail(email)) return { ok: false, error: "Invalid Email" };
  if (!password.trim()) return { ok: false, error: "Invalid Password" };
  if (password.length < 8)
    return { ok: false, error: "Password must be at least 8 characters" };

  return { ok: true };
};

export default function SignUp() {
  const navigate = useNavigate();
  const { updateNotification } = useNotification();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = userInfo;
  const { authInfo } = useAuth() as AuthContextType;
  const { isLoggedIn } = authInfo;

  const handleOnChange = ({ target }: { target: HTMLInputElement }) => {
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { ok, error } = validateUserDetail(userInfo);
    if (!ok && error) return updateNotification("error", error);
    const response = await createUser(userInfo);
    if (response.error) return updateNotification("error", response.error);
    navigate("/auth/email-verification", {
      state: { user: response.user },
      replace: true,
    });
  };

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  return (
    <FormContainer className="flex items-center justify-center min-h-screen bg-white dark:bg-primary">
      <Container>
        <form
          className={`${commonModalClasses} w-full max-w-md p-6 mx-auto rounded-lg shadow-lg dark:bg-gray-800 dark:text-white transition-all ease-in-out`}
          onSubmit={handleSubmit}
        >
          <Title>Sign Up</Title>
          <InputField
            label="Name"
            placeholder="Your Name"
            name="name"
            value={name}
            onChange={handleOnChange}
          />
          <InputField
            label="Email"
            placeholder="youremail@gmail.com"
            name="email"
            value={email}
            onChange={handleOnChange}
          />
          <InputField
            label="Password"
            placeholder="********"
            name="password"
            value={password}
            onChange={handleOnChange}
            type="password"
          />
          <SubmitBtn submitValue="Sign Up" />
          <div className="flex justify-between mt-4 text-sm text-blue-600 dark:text-blue-400">
            <Link to="/auth/signin">Sign In</Link>
            <Link to="/auth/forget-password">Forget Password?</Link>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
