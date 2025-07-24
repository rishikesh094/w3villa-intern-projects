import { useEffect, useState } from "react";

function FetchData() {
  const [jsonData, setJsonData] = useState([]);
  useEffect(() => {
    const fetchJson = async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await res.json();

      setJsonData(data);
    };
    fetchJson();
  }, []);

  return (
    <div>
      {jsonData.map((item) => (
        <p key={item.id}> {item.title}</p>
      ))}
    </div>
  );
}

export default FetchData;
