import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
    uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'Clinic Management System',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );
            //console.log(uploadStream);
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async deleteFileByUrl(url: string): Promise<void> {
        try {
            // Extract the public_id from the URL by removing the Cloudinary base URL
            const public_id = this.extractPublicIdFromUrl(url);

            // Use the Cloudinary destroy method to delete the file by public_id
            const result = await cloudinary.uploader.destroy(public_id);

            // Log or handle the result if needed
            console.log('File deleted:', result);
        } catch (error) {
            // Handle errors if the file deletion fails
            console.error('Error deleting file:', error.message);
            throw new Error('Failed to delete the file from Cloudinary.');
        }
    }

    private extractPublicIdFromUrl(url: string): string {
        // Replace the Cloudinary base URL with an empty string to get the public_id
        const cloudinaryBaseUrl = cloudinary.url('', { secure: true }); // Make sure to set the secure option to match your Cloudinary configuration
        return url.replace(cloudinaryBaseUrl, '');
    }
}
