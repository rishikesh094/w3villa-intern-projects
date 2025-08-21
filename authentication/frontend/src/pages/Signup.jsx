import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      alert(res.data.message);
      navigate("/login")
    } catch (error) {
      alert("Unauthorized User")
    }
  };

  return (
    <div className="card">
      <h2>Create account</h2>
      <p className="sub">Join us and get started in seconds.</p>
      <div className="form">
        <div className="field">
          <label className="label" htmlFor="name">Name</label>
          <input className="input" id="name" name="name" placeholder="Jane Doe" onChange={handleChange} />
        </div>
        <div className="field">
          <label className="label" htmlFor="email">Email</label>
          <input className="input" id="email" name="email" placeholder="e.g. jane@doe.com" onChange={handleChange} />
        </div>
        <div className="field">
          <label className="label" htmlFor="password">Password</label>
          <input className="input" id="password" name="password" type="password" placeholder="••••••••" onChange={handleChange} />
        </div>
        <div className="actions">
          <button className="btn" onClick={handleSubmit}>Create account</button>
        </div>
        <p className="muted" style={{marginTop: 8}}>Already have an account? <Link to="/login" className="nav-link">Sign in</Link></p>
      </div>
    </div>
  );
}
