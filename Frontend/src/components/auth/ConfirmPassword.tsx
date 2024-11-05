import { useEffect, useState } from "react";
import { commonModalClasses } from "../../utils/Theme";
import Container from "../Container";
import FormContainer from "../form/FormContainer";
import InputField from "../form/InputField";
import SubmitBtn from "../form/SubmitBtn";
import Title from "../form/Title";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ImSpinner5 } from "react-icons/im";
import { resetPassword, validateResetToken } from "../../api/auth";
import { useNotification } from "../../hooks";

export default function ConfirmPassword() {
  const [password, setPassword] = useState({
    one: "",
    two: "",
  });
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const { updateNotification } = useNotification();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  const isValidToken = async () => {
    if (!token || !userId) return;
    const { valid, error } = await validateResetToken(token, userId);
    setIsVerifying(false);
    if (error) {
      navigate("/auth/reset-password/", { replace: true });
      return updateNotification("error", error);
    }
    if (!valid) {
      return navigate("/auth/reset-password/", { replace: true });
    }
    setIsValid(true);
  };

  const handleChange = ({ target }: { target: HTMLInputElement }) => {
    const { name, value } = target;
    setPassword({ ...password, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.one.trim().length < 8)
      return updateNotification("error", "Password Must Be 8 Characters Long");
    if (password.one !== password.two)
      return updateNotification("error", "Passwords Don't Match");
    if (!token || !userId) return;

    const { message, error } = await resetPassword({
      password: password.one,
      token,
      userId,
    });

    if (error) return updateNotification("error", error);
    updateNotification("success", message);
    navigate("/auth/signin", { replace: true });
  };

  useEffect(() => {
    isValidToken();
    //eslint-disable-next-line
  }, []);

  if (isVerifying) {
    return (
      <FormContainer>
        <Container className="text-4xl font-semibold dark:text-gray-100">
          <div className="flex items-center space-x-4">
            <h1 className="text-primary dark:text-gray-300">
              Please Wait, Token is Being Verified
            </h1>
            <ImSpinner5 className="text-4xl animate-spin text-primary dark:text-gray-100" />
          </div>
        </Container>
      </FormContainer>
    );
  }
  if (!isValid) {
    return (
      <FormContainer>
        <Container className="text-4xl font-semibold dark:text-gray-100">
          <div className="flex items-center space-x-4">
            <h1 className="text-red-600 dark:text-red-500">Invalid Token</h1>
          </div>
        </Container>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <Container>
        <form
          onSubmit={handleSubmit}
          className={`${commonModalClasses} w-80 bg-white dark:bg-primary p-6 rounded-lg shadow-lg`}
        >
          <Title>New Password</Title>
          <InputField
            label="New Password"
            placeholder="Enter New Password"
            name="one"
            value={password.one}
            onChange={handleChange}
            className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          />
          <InputField
            label="Confirm Password"
            placeholder="Confirm New Password"
            name="two"
            value={password.two}
            onChange={handleChange}
            className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          />
          <SubmitBtn submitValue="Confirm Password" />
        </form>
      </Container>
    </FormContainer>
  );
}
