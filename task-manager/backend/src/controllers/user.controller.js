import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { Op } from "sequelize";

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'fullName', 'email', 'role', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ 
      success: true, 
      users 
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch users" 
    });
  }
};

// Get user by ID (admin only)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: ['id', 'fullName', 'email', 'role', 'createdAt', 'updatedAt']
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    res.json({ 
      success: true, 
      user 
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch user" 
    });
  }
};

// Create new user (admin only)
export const createUser = async (req, res) => {
  try {
    const { fullName, email, password, role = 'user' } = req.body;
    
    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Full name, email, and password are required" 
      });
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already exists" 
      });
    }
    
    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid role. Must be 'user' or 'admin'" 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role
    });
    
    // Return user without password
    const userResponse = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };
    
    res.status(201).json({ 
      success: true, 
      message: "User created successfully", 
      user: userResponse 
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create user" 
    });
  }
};

// Update user (admin only)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, role, password } = req.body;
    
    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    // Prevent admin from changing their own role to user
    if (req.user.id === parseInt(id) && role === 'user' && req.user.role === 'admin') {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot change your own admin role" 
      });
    }
    
    // Prepare update data
    const updateData = {};
    
    if (fullName) updateData.fullName = fullName;
    if (email) {
      // Check if email already exists (exclude current user)
      const existingUser = await User.findOne({ 
        where: { 
          email, 
          id: { [Op.ne]: id } 
        } 
      });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "Email already exists" 
        });
      }
      updateData.email = email;
    }
    if (role && ['user', 'admin'].includes(role)) {
      updateData.role = role;
    }
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    // Update user
    await user.update(updateData);
    
    // Return updated user without password
    const updatedUser = await User.findByPk(id, {
      attributes: ['id', 'fullName', 'email', 'role', 'createdAt', 'updatedAt']
    });
    
    res.json({ 
      success: true, 
      message: "User updated successfully", 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update user" 
    });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    // Prevent admin from deleting themselves
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot delete your own account" 
      });
    }
    
    // Delete user
    await user.destroy();
    
    res.json({ 
      success: true, 
      message: "User deleted successfully" 
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete user" 
    });
  }
};

// Get users count and statistics (admin only)
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const adminUsers = await User.count({ where: { role: 'admin' } });
    const regularUsers = await User.count({ where: { role: 'user' } });
    
    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        adminUsers,
        regularUsers,
        recentUsers
      }
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch user statistics" 
    });
  }
};
