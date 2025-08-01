const config = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectID: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseID: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteUsersCollectionID: String(import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID),
  appwriteTaskCollectionID: String(import.meta.env.VITE_APPWRITE_TASKS_COLLECTION_ID),
};

export default config;
