import { useState } from "react";
import { commonModalClasses } from "../../utils/Theme";
import Container from "../Container";
import FormContainer from "../form/FormContainer";
import InputField from "../form/InputField";
import SubmitBtn from "../form/SubmitBtn";
import Title from "../form/Title";
import { isValidEmail } from "../../utils/helper";
import { useNotification } from "../../hooks";
import { forgetPassword } from "../../api/auth";
import { Link } from "react-router-dom";

export default function ForgetPassword() {
  const { updateNotification } = useNotification();
  const [email, setEmail] = useState("");

  const handleChange = ({ target }: { target: HTMLInputElement }) => {
    const { value } = target;
    setEmail(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidEmail(email))
      return updateNotification("error", "Invalid Email");

    const { message, error } = await forgetPassword(email);

    if (error) return updateNotification("error", error);
    updateNotification("success", message);
  };
  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + "w-96"}>
          <Title>Forget Password</Title>
          <InputField
            label="Email"
            placeholder="youremail@gmail.com"
            name="email"
            value={email}
            onChange={handleChange}
          />
          <SubmitBtn submitValue="Send Email" />
          <div className="flex justify-between">
            <Link to="/auth/signup">Sign Up</Link>
            <Link to="/auth/signin">Sign In</Link>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
