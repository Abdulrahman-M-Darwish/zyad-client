import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function downloadCloudinaryVideo(
  publicId: string,
  filename: string
) {
  try {
    // Construct Cloudinary URL for the video
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const url = `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}`;

    // Fetch the video
    const response = await fetch(url);
    const blob = await response.blob();

    // Create a temporary link element to trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.mp4`; // Set the download filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error downloading video:", error);
    throw new Error("Failed to download video");
  }
}
