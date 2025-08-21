import { useContext, useState } from "react";
import axios from "axios";
import {useNavigate, Link} from "react-router-dom"
import { AuthContext } from "../contexts/authContext";

axios.defaults.withCredentials = true;

export default function Login() {
  const {setUser}=useContext(AuthContext)  
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const res = await axios.post("http://localhost:5000/api/auth/login", form);
    alert(res.data.message);
    setUser(res.data.user)
    navigate("/")
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <p className="sub">Welcome back. Please sign in to continue.</p>
      <div className="form">
        <div className="field">
          <label className="label" htmlFor="email">Email</label>
          <input className="input" id="email" name="email" placeholder="e.g. jane@doe.com" onChange={handleChange} />
        </div>
        <div className="field">
          <label className="label" htmlFor="password">Password</label>
          <input className="input" id="password" name="password" type="password" placeholder="••••••••" onChange={handleChange} />
        </div>
        <div className="actions">
          <button className="btn" onClick={handleSubmit}>Login</button>
        </div>
        <p className="muted" style={{marginTop: 8}}>Don't have an account? <Link to="/signup" className="nav-link">Create one</Link></p>
      </div>
    </div>
  );
}
