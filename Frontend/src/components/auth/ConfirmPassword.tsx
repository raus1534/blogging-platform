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
      return updateNotification("error", "Password Must Be 8 Character Long");
    if (password.one !== password.two)
      return updateNotification("error", "Password Doesn't Match");
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
        <Container className="text-4xl font-semibold dark:text-white">
          <div className="flex items-center space-x-4">
            <h1 className="text-primary">
              Please Wait Token is Being Verifying
            </h1>
            <ImSpinner5 className="text-4xl animate-spin dark:text-white text-primary" />
          </div>
        </Container>
      </FormContainer>
    );
  }
  if (!isValid) {
    return (
      <FormContainer>
        <Container className="text-4xl font-semibold dark:text-white">
          <div className="flex items-center space-x-4">
            <h1>Invalid Token</h1>
          </div>
        </Container>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + "w-80"}>
          <Title>New Password</Title>
          <InputField
            label="New Password"
            placeholder="Enter New Password"
            name="one"
            value={password.one}
            onChange={handleChange}
          />
          <InputField
            label="Confirm Password"
            placeholder="Confirm New Password"
            name="two"
            value={password.two}
            onChange={handleChange}
          />
          <SubmitBtn submitValue="Confirm Password" />
        </form>
      </Container>
    </FormContainer>
  );
}
