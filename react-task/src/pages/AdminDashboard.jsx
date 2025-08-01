import { useEffect, useState } from "react";
import { getAllUsers, deleteUser, updateUserRole } from "../appwriter/userServices";
import { getAllTasks, deleteTask } from "../appwriter/taskServices";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignedTo, setAssignedTo] = useState();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const usersData = await getAllUsers();
      console.log(usersData);

      const tasksData = await getAllTasks();
      console.log(tasksData);

      const userMap = {};
    usersData.forEach((user) => {
      userMap[user.userId] = user;
    })
    console.log(userMap);
    
    setAssignedTo(userMap); 
      
      setUsers(usersData);
      setTasks(tasksData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Something went wrong!");

    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId);
    toast.warn("Task deleted.");
    fetchDashboardData();
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    toast.warn("Task deleted.");
    fetchDashboardData();
  };

  const handleRoleChange = async (userId, newRole) => {
    await updateUserRole(userId, newRole);
    fetchDashboardData();
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* User Management */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.$id}>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.$id, e.target.value)}
                      className="border px-2 py-1"
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDeleteUser(user.$id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Task Management */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Task Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Assigned To</th>
                <th className="border px-4 py-2">Priority</th>
                <th className="border px-4 py-2">Due Date</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.$id}>
                  <td className="border px-4 py-2">{task.title}</td>
                  <td className="border px-4 py-2">{task.description || "-"}</td>
                  <td className="border px-4 py-2">{assignedTo[task.userId]?.name || "Unassigned"}</td>
                  <td className="border px-4 py-2">{task.priority || "-"}</td>
                  <td className="border px-4 py-2">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="border px-4 py-2 capitalize">{task.status || "pending"}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDeleteTask(task.$id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default AdminDashboard;
