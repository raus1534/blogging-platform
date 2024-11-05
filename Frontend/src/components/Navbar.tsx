import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Sun, Moon, LogOut, X, Menu } from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "@hooks/index";
import { AuthContextType } from "@context/AuthProvider";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedMode = localStorage.getItem("dark-mode");
    // Default to dark mode if there is no saved preference
    return savedMode === "true" || (savedMode === null && true);
  });
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { authInfo, handleLogout } = useAuth() as AuthContextType;
  const { isLoggedIn, profile } = authInfo;
  const avatar = profile?.avatar;

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = (): void => {
    setIsDark((prev) => {
      const newTheme = !prev;
      document.documentElement.classList.toggle("dark", newTheme);
      localStorage.setItem("dark-mode", String(newTheme)); // Save preference to localStorage
      return newTheme;
    });
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    navigate(`/blog/search?title=${searchQuery}`);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  // Apply dark class based on initial isDark value
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <>
      <div className="sticky top-0 z-50 w-full transition-colors duration-200 bg-white border-b border-blue-100 shadow-sm dark:bg-primary dark:border-gray-800">
        <div className="px-4 mx-auto max-w-7xl">
          {/* Main Navbar */}
          <div className="flex items-center justify-between h-16">
            {/* Left Section: Logo & Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src={logo}
                  alt="logo"
                  className="border-black h-7 sm:h-8 md:h-10 dark:border-white"
                />
                <span className="text-base font-semibold text-blue-950 dark:text-white sm:text-lg">
                  BlogIn
                </span>
              </Link>
            </div>

            {/* Center Section: Search Bar (Hidden on Mobile) */}
            <div className="hidden mx-4 md:block md:w-1/2 lg:w-2/5">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search
                  size={18}
                  className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400 dark:text-slate-500"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full py-2 pl-10 pr-4 text-sm transition-all border rounded-lg outline-none border-slate-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                />
              </form>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 transition-colors rounded-lg md:hidden hover:bg-blue-50 text-slate-600 dark:text-slate-200 dark:hover:bg-gray-800 sm:p-2"
                aria-label="Open search"
              >
                <Search size={20} />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 transition-colors rounded-lg hover:bg-blue-50 text-slate-600 dark:text-slate-200 dark:hover:bg-gray-800 sm:p-2"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Auth Section */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                  <Link
                    to="/dashboard"
                    className="relative inline-flex items-center justify-center w-8 h-8 overflow-hidden transition-all rounded-full sm:h-9 sm:w-9 ring-2 ring-blue-100 hover:ring-blue-300 dark:ring-gray-700 dark:hover:ring-gray-600"
                  >
                    {profile?.avatar ? (
                      <img
                        src={avatar || logo}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-blue-50 dark:bg-gray-800">
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          B
                        </span>
                      </div>
                    )}
                  </Link>
                  <button
                    className="hidden p-1.5 transition-colors rounded-lg sm:block hover:bg-blue-50 text-slate-600 dark:text-slate-200 dark:hover:bg-gray-800 sm:p-2"
                    aria-label="Logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} />
                  </button>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-1.5 transition-colors rounded-lg md:hidden hover:bg-blue-50 text-slate-600 dark:text-slate-200 dark:hover:bg-gray-800 sm:p-2"
                    aria-label="Toggle mobile menu"
                  >
                    <Menu size={20} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth/signin"
                  className="px-3 py-1.5 text-sm font-medium text-white transition-colors bg-blue-500 rounded-lg shadow-sm sm:px-4 sm:py-2 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isLoggedIn && isMobileMenuOpen && (
            <div className="py-4 border-t border-blue-100 dark:border-gray-800 md:hidden">
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm transition-colors rounded-lg hover:bg-blue-50 text-slate-600 dark:text-slate-200 dark:hover:bg-gray-800"
                >
                  Dashboard
                </Link>
                <Link
                  to="/blog"
                  className="px-4 py-2 text-sm transition-colors rounded-lg hover:bg-blue-50 text-slate-600 dark:text-slate-200 dark:hover:bg-gray-800"
                >
                  Blog
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm transition-colors rounded-lg hover:bg-blue-50 text-slate-600 dark:text-slate-200 dark:hover:bg-gray-800"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm dark:bg-primary/95"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-md dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-3 right-3 p-1.5 transition-colors rounded-lg hover:bg-blue-50 text-slate-600 dark:text-slate-200 dark:hover:bg-gray-700"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search
                size={18}
                className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400 dark:text-slate-500"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full py-2 pl-10 pr-4 text-sm transition-all border rounded-lg outline-none border-slate-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-900"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
