import { INewUser } from "@/types";
import {
  account,
  appwriteConfig,
  avatars,
  databases,
  OAuthProvider,
} from "./config";
import { ID, Query } from "appwrite";

export const loginWithGoogle = async () => {
  try {
    // Initiate Google OAuth2 session
    await account.createOAuth2Session(
      OAuthProvider.Google,
      "http://localhost:5173/",
      "http://localhost:5173/"
    );
  } catch (error) {
    console.error("Error logging in with Google:", error);
  }
};

export async function checkUserInDB(email: string) {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("email", [email])]
    );

    return users.total;
  } catch (error) {
    console.error("Error checking user in DB:", error);
    return false;
  }
}
export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error(error);
  }
};

export const getUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.error(error);
  }
};

export async function createUserAccount(user: any) {
  try {
    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: user.$id,
      name: user.name,
      email: user.email,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}
