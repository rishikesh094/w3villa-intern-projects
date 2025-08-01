import config from "../config/config";
import { Account, Client, ID, Databases, Query } from "appwrite";

export class AuthService {
  client = new Client();
  account;
  databases;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectID);

    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
  }

  // Create user account and store role in Database
  async createAccount(obj) {
    try {
      const email = obj?.email || "";
      const password = obj?.password || "";
      const name = obj?.name || "";
      const role = obj?.role || "user"; 

      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (userAccount) {
        await this.databases.createDocument(
          config.appwriteDatabaseID,
          config.appwriteUsersCollectionID,
          ID.unique(),
          {
            userId: userAccount.$id,
            name,
            email,
            role,
          }
        );

        return userAccount;
      }

      return userAccount;
    } catch (error) {
      console.error("Error in createAccount:", error.message);
      throw error;
    }
  }

  async login(email, password) {
    try {
      await this.account.deleteSession("current");
    } catch (err) {
      console.warn("No active session to delete.", err);
    }
    
    try {
      console.log("Logging in with:", email, password);
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      return session;
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      throw error;
    }
  }

  async getUserRole(userId) {
    try {
      const res = await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteUsersCollectionID,
        [Query.equal("userId", userId)]
      );

      return res.documents[0]?.role || "User";
    } catch (error) {
      console.error("Error in getUserRole:", error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
      return true;
    } catch (error) {
      console.error("Error in logout:", error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
