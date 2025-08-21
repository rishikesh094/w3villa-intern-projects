import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";

export default function Home() {
  const { user, loading } = useContext(AuthContext);

  return (
    <div className="card">
      <h2>Welcome{user ? `, ${user.name}` : ""}</h2>
      <p className="sub">
        {loading
          ? "Checking your session..."
          : user
          ? "You're logged in. Visit your profile or logout from the navbar."
          : "Please login or create an account to continue."}
      </p>
      {!loading && (
        <div className="actions" style={{ display: "flex", gap: 12 }}>
          {user ? (
            <Link to="/profile" className="btn" style={{ width: "auto", padding: "12px 16px" }}>
              Go to Profile
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn" style={{ width: "auto", padding: "12px 16px" }}>
                Login
              </Link>
              <Link
                to="/signup"
                className="btn"
                style={{
                  width: "auto",
                  padding: "12px 16px",
                  background: "linear-gradient(180deg, #22c55e, #16a34a)",
                  boxShadow: "0 6px 18px rgba(34,197,94,.25)",
                }}
              >
                Create account
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}


