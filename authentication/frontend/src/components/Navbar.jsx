// src/components/Navbar.js
import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext)

  // Logout function
  const handleLogout = () => {
    fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => {
        setUser(null);
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  return (
    <nav className="navbar">
      <div className="container inner">
        <Link to="/" className="logo">MyApp</Link>
        <div className="nav-links">
          {user ? (
            <>
              <span className="user">Hello, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-danger" style={{width:"auto", padding:"8px 12px"}}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>Login</NavLink>
              <NavLink to="/signup" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>Signup</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}


export default Navbar;
