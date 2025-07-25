import { useContext } from "react";
import { UserContext } from "./context/UserContext";


function UserComponent() {
  const { name, setName } = useContext(UserContext);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold">Hello, {name}</h2>
      <button className="py-2 px-4 border-2 rounded-lg bg-gray-600 text-white" onClick={() => setName("Rishikesh")}>Change Name</button>
    </div>
  );
}

export default UserComponent;
