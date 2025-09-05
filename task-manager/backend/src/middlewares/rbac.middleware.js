
// Role hierarchy and permissions
const ROLE_PERMISSIONS = {
  admin: {
    tasks: ['create', 'read', 'update', 'delete', 'assign'],
    users: ['create', 'read', 'update', 'delete', 'manage_roles'],
    all: true, // Admin can access everything
  },
  user: {
    tasks: ['read'], // Can only read tasks assigned to them
    assigned_tasks: ['read', 'update_status'], // Can view and update only status of assigned tasks
    users: ['read'], // Can only read their own profile
  }
};

// Check if user has required role
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
    }

    next();
  };
};


// Check if user can access specific task based on role and ownership
export const canAccessTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const taskId = req.params.id || req.params.taskId;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'Task ID is required'
      });
    }

    // Admin can access any task
    if (userRole === 'admin') {
      return next();
    }

    // Import Task model dynamically to avoid circular imports
    const { default: Task } = await import('../models/task.model.js');
    
    const task = await Task.findByPk(taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // User can only access tasks assigned to them
    if (userRole === 'user') {
      if (task.assignedTo === userId) {
        req.task = task;
        return next();
      }
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own tasks.'
    });

  } catch (error) {
    console.error('Error in canAccessTask middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Check if user can modify task (stricter than read access) - Admin/Manager only
export const canModifyTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const taskId = req.params.id || req.params.taskId;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'Task ID is required'
      });
    }

    // Only Admin can modify any task
    if (userRole === 'admin') {
      return next();
    }

    // Users cannot modify tasks through this middleware
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only admins can modify tasks.'
    });

  } catch (error) {
    console.error('Error in canModifyTask middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Check if user can update task status only (for assigned users)
export const canUpdateTaskStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const taskId = req.params.id || req.params.taskId;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'Task ID is required'
      });
    }

    // Admin can update any task
    if (userRole === 'admin') {
      return next();
    }

    // Import Task model dynamically
    const { default: Task } = await import('../models/task.model.js');
    
    const task = await Task.findByPk(taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // User can only update status of tasks assigned to them
    if (userRole === 'user') {
      if (task.assignedTo === userId) {
        // Restrict what fields can be updated - only status
        const allowedFields = ['status'];
        const updateFields = Object.keys(req.body);
        const hasRestrictedFields = updateFields.some(field => !allowedFields.includes(field));
        
        if (hasRestrictedFields) {
          return res.status(403).json({
            success: false,
            message: 'You can only update the status of assigned tasks'
          });
        }
        
        req.task = task;
        return next();
      }
      
      return res.status(403).json({
        success: false,
        message: 'You can only update status of tasks assigned to you'
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });

  } catch (error) {
    console.error('Error in canUpdateTaskStatus middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Check if user can assign tasks (only admin)
export const canAssignTasks = (req, res, next) => {
  const userRole = req.user.role;
  
  if (userRole === 'admin') {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Only admins can assign tasks'
  });
};

// Helper function specifically for admin-only routes
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

export default {
  requireRole,
  requireAdmin,
  canAccessTask,
  canModifyTask,
  canUpdateTaskStatus,
  canAssignTasks,
  ROLE_PERMISSIONS
};
