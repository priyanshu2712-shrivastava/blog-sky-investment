import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export const deleteImage = async (url: string) => {
    try {
        // Extract public_id from URL
        // Format: https://res.cloudinary.com/[cloud_name]/image/upload/v[version]/[folder]/[id].[extension]
        // or just [folder]/[id]
        const regex = /\/v\d+\/(.+)\.[a-z]+$/;
        const match = url.match(regex);
        if (!match) return;

        const publicId = match[1];
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting image:', error);
    }
};

export default cloudinary;
