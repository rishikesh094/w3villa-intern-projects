import { useState } from "react";
import { Link } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import { GiCrossMark } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">
          <Link to="/">TaskManager</Link>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
          <Link to="/tasks" className="text-gray-600 hover:text-blue-600">Tasks</Link>
          {user ? (
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl text-gray-600 focus:outline-none"
          >
            {isOpen ? <GiCrossMark /> : <IoMdMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col justify-center items-center px-4 pb-4 space-y-2">
          <Link to="/" className="block text-gray-600 hover:text-blue-600">Home</Link>
          <Link to="/dashboard" className="block text-gray-600 hover:text-blue-600">Dashboard</Link>
          <Link to="/tasks" className="block text-gray-600 hover:text-blue-600">Tasks</Link>
          {user ? (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="block bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-center"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-center"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
