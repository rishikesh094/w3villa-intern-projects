import Task from "../models/task.model.js";
import User from "../models/user.model.js";

// Get all tasks based on user role
export const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let whereClause = {};
    
    // Role-based filtering
    if (userRole === 'user') {
      // Users can only see tasks assigned to them (not their own created tasks)
      whereClause = { assignedTo: userId };
    }
    // Admin can see all tasks
    
    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'email'],
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'fullName', 'email'],
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      message: 'Tasks retrieved successfully',
      tasks,
      userRole
    });

  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new task (Admin only - middleware enforces this)
export const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, priority, dueDate, assignedTo } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!assignedTo) {
      return res.status(400).json({ message: 'There is no user to assign!' });
    }

    // Validate assignedTo user exists if provided
    if (assignedTo) {
      const assigneeExists = await User.findByPk(assignedTo);
      if (!assigneeExists) {
        return res.status(400).json({ message: 'Assigned user not found' });
      }
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || 'medium',
      dueDate,
      assignedTo,
      createdBy: userId
    });

    const createdTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'email'],
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'fullName', 'email'],
        }
      ],
    });

    res.status(201).json({
      message: 'Task created successfully',
      task: createdTask
    });

  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update task (Admin only - middleware enforces this)
export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, priority, dueDate, assignedTo } = req.body;

    const task = await Task.findByPk(taskId);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Validate assignedTo user exists if provided
    if (assignedTo) {
      const assigneeExists = await User.findByPk(assignedTo);
      if (!assigneeExists) {
        return res.status(400).json({ message: 'Assigned user not found' });
      }
    }

    await task.update({
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      priority: priority || task.priority,
      dueDate: dueDate !== undefined ? dueDate : task.dueDate,
      assignedTo: assignedTo !== undefined ? assignedTo : task.assignedTo
    });

    const updatedTask = await Task.findByPk(taskId, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'email'],
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'fullName', 'email'],
        }
      ],
    });

    res.json({
      message: 'Task updated successfully',
      task: updatedTask
    });

  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update task status only (for users assigned to tasks)
export const updateTaskStatus = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Valid status is required',
        validStatuses 
      });
    }

    const task = req.task || await Task.findByPk(taskId); // req.task is set by middleware
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.update({ status });

    const updatedTask = await Task.findByPk(taskId, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'email'],
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'fullName', 'email'],
        }
      ],
    });

    res.json({
      message: 'Task status updated successfully',
      task: updatedTask
    });

  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete task (Admin only - middleware enforces this)
export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findByPk(taskId);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });

  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all users (Admin only - middleware enforces this)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'fullName', 'email', 'role'],
      order: [['fullName', 'ASC']]
    });

    res.json({
      message: 'Users retrieved successfully',
      users
    });

  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
