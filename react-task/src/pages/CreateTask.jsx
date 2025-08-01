import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createTask } from "../appwriter/taskServices";
import { toast } from "react-toastify";

const CreateTask = () => {
  const { user } = useAuth(); // 👈 get current logged-in user
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setMessage("You must be logged in.");

    try {
      setLoading(true);
      setMessage("");

      await createTask(formData, user.id); // 👈 pass user ID to taskService
      setMessage("✅ Task created successfully!");

      // Optional: Redirect after short delay
      setTimeout(() => {
        navigate("/tasks");
      }, 1000);
    } catch (error) {
      console.error("Task creation error:", error);
      toast.error("Something went wrong!");

      setMessage("❌ Failed to create task.");
    } finally {
      setLoading(false);
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        dueDate: "",
      });
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
          Create New Task
        </h2>
        {message && (
          <div className="mt-4 text-center text-sm text-blue-600 font-medium">
            {message}
          </div>
        )}
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900">
              Title
            </label>
            <div className="mt-2">
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900  outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-900">
              Description
            </label>
            <div className="mt-2">
              <textarea
                id="description"
                name="description"
                rows="3"
                required
                value={formData.description}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              ></textarea>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-900">
              Priority
            </label>
            <div className="mt-2">
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-2 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-900">
              Status
            </label>
            <div className="mt-2">
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-2 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              >
                <option value="Pending">Pending</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-900">
              Due Date
            </label>
            <div className="mt-2">
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                required
                value={formData.dueDate}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-2 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
