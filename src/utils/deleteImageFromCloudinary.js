import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const fileWithExtension = parts.pop(); 
  const fileName = fileWithExtension.split('.')[0]; 
  const folder = parts.slice(parts.indexOf('upload') + 1).join('/'); 
  return folder ? `${folder}/${fileName}` : fileName; 
};

export const deleteImageByUrl = async (url, resource_type = "image") => {
  const publicId = getPublicIdFromUrl(url);
  if (!publicId) return;

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type });
    console.log(`Deleted ${resource_type}:`, result);
    return result;
  } catch (error) {
    console.error(`Error deleting ${resource_type}:`, error);
  }
};
