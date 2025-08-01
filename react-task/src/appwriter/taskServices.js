import { Client, Databases, ID, Query, Permission, Role } from "appwrite";
import config from "../config/config";
import { account } from "./appwriteConfig";

const client = new Client()
  .setEndpoint(config.appwriteUrl)
  .setProject(config.appwriteProjectID);

const databases = new Databases(client);
const DATABASE_ID = config.appwriteDatabaseID;
const COLLECTION_ID = config.appwriteTaskCollectionID; 

// Create a new task
export const createTask = async (taskData, userId) => {
  try {
    console.log("hii",taskData);
     const user = await account.get();
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {
        ...taskData,
        createdBy: userId,
        userId:user.$id,
      },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
    return response;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Get tasks for logged-in user
export const getUserTasks = async (userId) => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", [userId]),
      Query.orderDesc("$createdAt"),
    ]);
    return response.documents;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    throw error;
  }
};

// Get all tasks (Admin only)
export const getAllTasks = async () => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
    ]);
    return response.documents;
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    throw error;
  }
};

// Update a task
export const updateTask = async (taskId, updatedData) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      taskId,
      updatedData
    );
    return response;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, taskId);
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
