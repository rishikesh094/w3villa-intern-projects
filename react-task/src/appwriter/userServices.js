import { Client, Databases, ID, Query } from "appwrite";
import config from "../config/config";

const client = new Client()
  .setEndpoint(config.appwriteUrl)
  .setProject(config.appwriteProjectID);

const databases = new Databases(client);
const DATABASE_ID = config.appwriteDatabaseID;
const COLLECTION_ID = config.appwriteUsersCollectionID;

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    return response.documents;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Delete a user by ID
export const deleteUser = async (userId) => {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, userId);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Update user role
export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, userId, {
      role: newRole,
    });
    return response;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};
