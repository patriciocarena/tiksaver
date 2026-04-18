import { Platform } from "react-native";
import { File, Paths, Directory } from "expo-file-system/next";
import * as MediaLibrary from "expo-media-library";

export interface DownloadOptions {
  url: string;
  filename: string;
}

export interface DownloadResult {
  success: boolean;
  localUri?: string;
  error?: string;
}

/**
 * Sanitize filename by removing invalid characters and ensuring .mp4 extension
 */
export function sanitizeFilename(name: string): string {
  // Remove invalid characters for filenames
  let sanitized = name.replace(/[/\\:*?"<>|#%&{}$!'@+`=]/g, "").trim();
  // Replace multiple spaces/dots with a single underscore
  sanitized = sanitized.replace(/[\s.]+/g, "_");
  // Limit length
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }
  // Ensure it has .mp4 extension
  if (!sanitized.toLowerCase().endsWith(".mp4")) {
    sanitized = `${sanitized}.mp4`;
  }
  return sanitized || `tiktok_video_${Date.now()}.mp4`;
}

/**
 * Generate a default filename from a video title
 */
export function generateDefaultFilename(title: string): string {
  if (!title || title === "TikTok Video") {
    return `tiksave_${Date.now()}`;
  }
  // Truncate long titles and clean up
  const clean = title
    .replace(/[/\\:*?"<>|#%&{}$!'@+`=]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 60);
  return clean || `tiksave_${Date.now()}`;
}

/**
 * Download video and save to device gallery/files
 */
export async function downloadAndSaveVideo(
  options: DownloadOptions
): Promise<DownloadResult> {
  const { url, filename } = options;

  if (Platform.OS === "web") {
    return downloadForWeb(url, filename);
  }

  return downloadForNative(url, filename);
}

/**
 * Web download - triggers browser download
 */
function downloadForWeb(url: string, filename: string): DownloadResult {
  try {
    const sanitized = sanitizeFilename(filename);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = sanitized;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Web download failed",
    };
  }
}

/**
 * Native download - downloads file and saves to media library
 */
async function downloadForNative(
  url: string,
  filename: string
): Promise<DownloadResult> {
  try {
    // Request media library permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      return {
        success: false,
        error:
          "Permission denied. Please allow access to your media library in Settings.",
      };
    }

    const sanitized = sanitizeFilename(filename);

    // Create a destination file in cache directory
    const destination = new File(Paths.cache, sanitized);

    // Download the video file using the new expo-file-system API
    const downloadedFile = await File.downloadFileAsync(url, destination, {
      idempotent: true,
    });

    // Save to media library (makes it visible in gallery/photos/files)
    const asset = await MediaLibrary.createAssetAsync(downloadedFile.uri);

    // Try to add to a dedicated album for organization
    try {
      const album = await MediaLibrary.getAlbumAsync("TikSave");
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync("TikSave", asset, false);
      }
    } catch {
      // Album creation is optional - video is already saved to the library
    }

    // Clean up the cached file after saving to library
    try {
      downloadedFile.delete();
    } catch {
      // Cleanup is not critical
    }

    return { success: true, localUri: asset.uri };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Download failed",
    };
  }
}
