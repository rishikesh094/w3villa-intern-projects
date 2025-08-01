import { useEffect, useState } from "react";
import { getUserTasks } from "../appwriter/taskServices";
import { account } from "../appwriter/appwriteConfig"; // Appwrite se current user laane ke liye
import { toast } from "react-toastify";

const Dashboard = () => {
  const [totalTasks, setTotalTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const currentUser = await account.get();
        
        

        // Check role
       
          const userTasks = await getUserTasks(currentUser.$id);
         console.log(userTasks);
       
      

        setTotalTasks(userTasks.length);

        const completed = userTasks.filter((task) => task.status === "Completed");
        const pending = userTasks.filter((task) => task.status === "Pending" );
        const inProgress = userTasks.filter((task) =>  task.status === "In-Progress" );

        setCompletedTasks(completed.length);
        setPendingTasks(pending.length+inProgress.length);
      } catch (error) {
        toast.error("Something went wrong!");

        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold">Total Tasks</h3>
          <p className="text-2xl mt-2 font-bold text-blue-600">{totalTasks}</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold">Pending Tasks</h3>
          <p className="text-2xl mt-2 font-bold text-yellow-600">{pendingTasks}</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
          <h3 className="text-lg font-semibold">Completed Tasks</h3>
          <p className="text-2xl mt-2 font-bold text-green-600">{completedTasks}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
