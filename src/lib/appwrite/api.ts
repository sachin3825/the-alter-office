import { INewPost, FileType } from "@/types";
import type { ImageGravity } from "appwrite";
import {
  account,
  appwriteConfig,
  avatars,
  databases,
  OAuthProvider,
  storage,
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

export async function getCurrentUser() {
  try {
    const currentAccount = await getUser();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

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

export async function uploadFile(files: File | File[]) {
  try {
    // Convert single file to an array for unified handling
    const fileArray = Array.isArray(files) ? files : [files];

    const uploadPromises = fileArray.map((file) => {
      // Check and log the MIME type
      console.log("Uploading file with MIME type:", file.type);

      // Ensure correct MIME type handling (especially for video files)
      return storage.createFile(appwriteConfig.storageId, ID.unique(), file);
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    return uploadedFiles;
  } catch (error) {
    console.error("Error uploading file(s):", error);
    throw error;
  }
}

export async function createPost(post: INewPost) {
  try {
    // Determine if post contains a video
    const isVideo = post.type === FileType.VIDEO;

    const uploadedFiles = await uploadFile(post.file);
    if (!uploadedFiles) throw Error("File upload failed");

    // Generate file URLs after upload
    const fileUrls = await Promise.all(
      uploadedFiles.map((file) => getFilePreview(file.$id, isVideo))
    );

    // If any file URL generation fails, clean up uploaded files and throw error
    if (fileUrls.includes(undefined)) {
      await Promise.all(uploadedFiles.map((file) => deleteFile(file.$id)));
      throw Error("Failed to generate file previews");
    }

    // Convert tags into an array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Prepare the post payload based on file type
    const postPayload: any = {
      creator: post.userId,
      caption: post.caption,
      tags: tags,
      Type: post.type,
    };

    if (isVideo) {
      // For video posts, use the video URL
      postPayload["VideoUrl"] = fileUrls[0]; // Assuming one video file
    } else {
      // For image posts, use the image URLs
      postPayload["imageUrl"] = fileUrls; // Multiple image URLs
    }

    // Save post to the database
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      postPayload
    );

    if (!newPost) {
      await Promise.all(uploadedFiles.map((file) => deleteFile(file.$id)));
      throw Error("Failed to create post in DB");
    }

    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export function getFilePreview(fileId: string, isVideo: boolean) {
  try {
    if (isVideo) {
      // Use the getFileView method to get the video URL
      return storage.getFileView(appwriteConfig.storageId, fileId);
    } else {
      // Generate preview for image files
      return storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top" as ImageGravity,
        100
      ); // This gives you an image preview URL
    }
  } catch (error) {
    console.log("Error generating file preview or view:", error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: "ok" };
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}

export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc(`$createdAt`), Query.limit(20)]
  );

  if (!posts) throw Error;

  return posts;
}
