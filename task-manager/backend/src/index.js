import app from "./app.js";
import sequelize from "./db/db.js";
import User from "./models/user.model.js";
import Task from "./models/task.model.js";

import cors from "cors";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 4040;

// Set up model associations directly
User.hasMany(Task, { foreignKey: 'createdBy', as: 'createdTasks' });
User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });


app.use(cookieParser());
// CORS configuration
app.use(cors({
  origin: "https://task-manager094.netlify.app", 
  credentials: true
}));

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Database connection established");

    // Sync database models
    await sequelize.sync();
    console.log("✅ Database models synchronized");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} already in use`);
        process.exit(1);
      } else {
        console.error("❌ Server Error:", err);
      }
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
