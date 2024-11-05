import { useEffect, useState } from "react";
import { commonModalClasses } from "../../utils/Theme";
import Container from "../Container";
import FormContainer from "../form/FormContainer";
import SubmitBtn from "../form/SubmitBtn";
import Title from "../form/Title";
import { useLocation, useNavigate } from "react-router-dom";
import { resendOTP, verifyUserEmail } from "../../api/auth";
import { useNotification } from "../../hooks";
import { useAuth } from "../../hooks";
import { AuthContextType } from "@context/AuthProvider";

const OTP_LENGTH = 6;

export default function EmailVerification() {
  const [otp, newOtp] = useState<string>("");

  const { updateNotification } = useNotification();
  const { authInfo, isAuth } = useAuth() as AuthContextType;
  const { isLoggedIn } = authInfo;
  const isVerified = authInfo.profile?.verified;

  const { state } = useLocation();
  const user = state?.user;

  const navigate = useNavigate();

  const handleOTPChange = ({ target }: { target: HTMLInputElement }) => {
    const { value } = target;
    if (/^\d*$/.test(value) && value.length <= OTP_LENGTH) {
      newOtp(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) return;
    const {
      user: userResponse,
      message,
      error,
    } = await verifyUserEmail({
      userId: user.id,
      token: otp!,
    });

    if (error) return updateNotification("error", error);
    updateNotification("success", message);
    localStorage.setItem("auth-token", userResponse.token);
    isAuth();
  };

  const handleResendOTP = async () => {
    const { error, message } = await resendOTP(user.id);
    if (error) return updateNotification("error", error);
    updateNotification("success", message);
  };

  useEffect(() => {
    if (!user) navigate("/NotFound");
    if (isLoggedIn && isVerified) navigate("/");
  }, [user, navigate, isLoggedIn, isVerified]);

  return (
    <FormContainer className="bg-white dark:bg-primary">
      <Container>
        <form
          onSubmit={handleSubmit}
          className={`${commonModalClasses} max-w-lg p-8 bg-white rounded-lg shadow-md dark:bg-primary dark:text-gray-100`}
        >
          <div className="text-center">
            <Title>Please Enter The OTP To Verify Your Account</Title>
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              OTP has been sent to {user.email.charAt(0)}****@gmail.com
            </p>
          </div>
          <div className="flex items-center justify-center my-4 space-x-4">
            <input
              type="number"
              value={otp}
              onChange={handleOTPChange}
              className="w-full h-12 px-4 text-2xl font-bold text-center transition-colors bg-transparent border-2 rounded-lg outline-none border-primary text-primary dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:border-primary dark:focus:border-blue-500"
            />
          </div>
          <div className="space-y-4">
            <SubmitBtn submitValue="Verify" />
            <button
              onClick={handleResendOTP}
              type="button"
              className="w-full text-lg font-semibold text-center text-blue-600 dark:text-blue-400"
            >
              I don't have an OTP
            </button>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
