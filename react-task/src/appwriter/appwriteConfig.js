// appwriteConfig.js
import { Client, Account, Databases, ID, Query } from "appwrite";
import config from "../config/config";

const client = new Client()
  .setEndpoint(config.appwriteUrl) // 🔁 use your own endpoint
  .setProject(config.appwriteProjectID);

const account = new Account(client);
const databases = new Databases(client);

export { account, databases, ID, Query };
