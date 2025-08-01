import { useEffect, useState } from "react";
import { getUserTasks, updateTask } from "../appwriter/taskServices";
import { account } from "../appwriter/appwriteConfig";
import { toast } from "react-toastify";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    status: "",
  });

  const fetchTasks = async () => {
    const currentUser = await account.get();
    const data = await getUserTasks(currentUser.$id);
    setTasks(data);
    setFilteredTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    if (statusFilter) {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [statusFilter, priorityFilter, tasks]);

  const handleEditClick = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.split("T")[0],
      priority: task.priority,
      status: task.status,
    });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    await updateTask(editingTask.$id, form);
    toast.success("Task updated successfully!");

    setEditingTask(null);
    fetchTasks();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <a
          href="/create-task"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Task
        </a>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border px-3 py-2 rounded"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="In-Progress">In-Progress</option>
        </select>

        <select
          className="border px-3 py-2 rounded"
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Task List */}
      <div className="grid gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.$id}
              className="bg-white p-4 rounded shadow-sm border"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : task.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Priority: {task.priority} | Due:{" "}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>

              <button
                onClick={() => handleEditClick(task)}
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No tasks found.</p>
        )}
      </div>

      {/* Edit Form */}
      {editingTask && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h3 className="text-xl font-bold mb-4">Edit Task</h3>
      <form onSubmit={handleUpdateSubmit} className="grid gap-3">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleFormChange}
          className="border px-3 py-2 rounded"
          placeholder="Title"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleFormChange}
          className="border px-3 py-2 rounded"
          placeholder="Description"
        />
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleFormChange}
          className="border px-3 py-2 rounded"
        />
        <select
          name="priority"
          value={form.priority}
          onChange={handleFormChange}
          className="border px-3 py-2 rounded"
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select
          name="status"
          value={form.status}
          onChange={handleFormChange}
          className="border px-3 py-2 rounded"
        >
          <option>Pending</option>
          <option>In-Progress</option>
          <option>Completed</option>
        </select>

        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={() => setEditingTask(null)}
            className="text-gray-600 hover:text-black"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default Tasks;
