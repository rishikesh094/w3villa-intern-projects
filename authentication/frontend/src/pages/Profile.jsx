import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.withCredentials = true;

export default function Profile() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/auth/me")
      .then(res => setData(res.data))
      .catch(err => setData({ error: err.response?.data?.error }));
  }, []);

  return (
    <div className="card">
      <h2>Profile Page</h2>
      {console.log(data)
      }
      <p>Welcome, {data?.user.name}!</p>
      <p>Email: {data?.user.email}</p>
    </div>
  );
}
