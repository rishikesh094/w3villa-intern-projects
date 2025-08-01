import {  Route, Routes } from "react-router-dom";
import Navbar from "./component/Navbar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import CreateTask from "./pages/CreateTask";
import ProtectedRoute from "./component/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
  <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-task"
          element={
            <ProtectedRoute allowedRoles={["admin","user"]}>
              <CreateTask />
            </ProtectedRoute>
          }
        />
      </Routes>
  </>
  );
}

export default App;
