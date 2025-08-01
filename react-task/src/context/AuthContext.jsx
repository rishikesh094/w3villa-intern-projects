import { createContext, useContext, useEffect, useState } from "react";
import authService from "../appwriter/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const session = await authService.account.getSession("current");
      console.log("✅ Session found:", session);

      if (!session) {
        throw new Error("No active session");
      }

      const userData = await authService.getCurrentUser();
      if (!userData) {
        throw new Error("Failed to fetch user data");
      }

      const role = await authService.getUserRole(userData.$id);
      console.log("✅ User data:", userData, "Role:", role);

      setUser({
        id: userData.$id,
        name: userData.name,
        email: userData.email,
        role: role , 
      });
    } catch (error) {
      console.error("❌ Error in fetchUser:", error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
  try {
    await authService.logout(); // Appwrite se session delete
    setUser(null);              // Context se user hatao
    toast.info("You’ve been logged out.");

    navigate("/login");         // Redirect to login
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, fetchUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
