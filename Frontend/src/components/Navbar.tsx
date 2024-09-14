import { Link, useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import Container from "./Container";
import logo from "../assets/logo.png";
import AppSearchForm from "./AppSearchForm";
import { AuthContextType } from "@context/AuthProvider";
import { useAuth } from "@hooks/index";

export default function Navbar() {
  const navigate = useNavigate();

  const { authInfo, handleLogout } = useAuth() as AuthContextType;
  const { isLoggedIn, profile } = authInfo;
  const avatar = profile?.avatar;

  const handleOnSearchSubmit = (query: string) => {
    navigate("/blog/search?title=" + query);
  };

  return (
    <div>
      <div className="text-white bg-primary">
        <Container className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between ">
              <Link to="/" className="flex items-center justify-center">
                <img
                  src={logo}
                  alt="logo"
                  className="h-8 border-black sm:h-10"
                />
              </Link>
            </div>
            <div className="w-1/2">
              <AppSearchForm onSubmit={handleOnSearchSubmit} />
            </div>
            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                <>
                  <Link
                    to={"/dashboard"}
                    className="w-8 h-8 p-0.5 border-2 border-white rounded-full cursor-pointer overflow-hidden"
                  >
                    <img src={avatar || logo} alt="Dashboard" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex text-lg font-semibold"
                  >
                    <IoLogOutOutline size={30} />
                  </button>
                </>
              ) : (
                <Link to="/auth/signin" className="flex font-semibold text-md">
                  Login
                </Link>
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
