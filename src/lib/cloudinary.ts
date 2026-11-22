import { v2 as cloudinary } from "cloudinary";
import { getCmsData } from "./cmsData";

export interface CloudinaryConfig {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
  folder?: string;
}

export async function getActiveCloudinaryConfig(): Promise<CloudinaryConfig> {
  const envCloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const envApiKey = process.env.CLOUDINARY_API_KEY;
  const envApiSecret = process.env.CLOUDINARY_API_SECRET;

  if (envCloudName && envApiKey && envApiSecret) {
    return {
      cloudName: envCloudName,
      apiKey: envApiKey,
      apiSecret: envApiSecret,
      folder: process.env.CLOUDINARY_FOLDER || "geeta-hospital",
    };
  }

  // Fallback to CMS saved storage settings
  try {
    const cms = await getCmsData();
    if (cms.storageSettings && cms.storageSettings.cloudName && cms.storageSettings.apiKey && cms.storageSettings.apiSecret) {
      return {
        cloudName: cms.storageSettings.cloudName,
        apiKey: cms.storageSettings.apiKey,
        apiSecret: cms.storageSettings.apiSecret,
        folder: cms.storageSettings.folder || "geeta-hospital",
      };
    }
  } catch (e) {
    console.warn("Could not read CMS storage settings:", e);
  }

  return {
    folder: "geeta-hospital",
  };
}

export async function configureCloudinary(): Promise<boolean> {
  const config = await getActiveCloudinaryConfig();
  if (config.cloudName && config.apiKey && config.apiSecret) {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
      secure: true,
    });
    return true;
  }
  return false;
}

export async function isCloudinaryConfigured(): Promise<boolean> {
  const config = await getActiveCloudinaryConfig();
  return Boolean(config.cloudName && config.apiKey && config.apiSecret);
}

export async function uploadToCloudinary(
  buffer: Buffer,
  mimeType: string = "image/jpeg",
  folder: string = "geeta-hospital",
  baseFileName?: string
): Promise<{ success: boolean; url?: string; publicId?: string; error?: string }> {
  try {
    const isConfigured = await configureCloudinary();
    if (!isConfigured) {
      return { success: false, error: "Cloudinary credentials not configured" };
    }

    const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;
    const cleanPublicId = baseFileName
      ? `${folder}/${baseFileName.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase()}-${Date.now()}`
      : `${folder}/media-${Date.now()}`;

    const uploadResponse = await cloudinary.uploader.upload(base64Data, {
      public_id: cleanPublicId,
      folder: folder,
      resource_type: "auto",
      overwrite: true,
    });

    return {
      success: true,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: error.message || "Failed to upload to Cloudinary" };
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const isConfigured = await configureCloudinary();
    if (!isConfigured) return false;

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    return false;
  }
}

export async function clearCloudinaryFolder(folder: string = "geeta-hospital"): Promise<{
  success: boolean;
  deletedCount: number;
  error?: string;
}> {
  try {
    const isConfigured = await configureCloudinary();
    if (!isConfigured) {
      return { success: false, deletedCount: 0, error: "Cloudinary not configured" };
    }

    // Delete all resources prefixed with the folder
    const prefix = `${folder}/`;
    const result = await cloudinary.api.delete_resources_by_prefix(prefix);
    const deletedCount = result?.deleted ? Object.keys(result.deleted).length : 0;

    return { success: true, deletedCount };
  } catch (error: any) {
    console.error("Cloudinary clear folder error:", error);
    return { success: false, deletedCount: 0, error: error.message || "Failed to clear folder" };
  }
}

export async function testCloudinaryConnection(): Promise<{
  success: boolean;
  cloudName?: string;
  error?: string;
}> {
  try {
    const isConfigured = await configureCloudinary();
    if (!isConfigured) {
      return { success: false, error: "Please provide Cloud Name, API Key, and API Secret." };
    }

    const config = await getActiveCloudinaryConfig();
    const ping = await cloudinary.api.ping();

    if (ping?.status === "ok") {
      return { success: true, cloudName: config.cloudName };
    }

    return { success: false, error: "Invalid response from Cloudinary." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to connect to Cloudinary." };
  }
}
