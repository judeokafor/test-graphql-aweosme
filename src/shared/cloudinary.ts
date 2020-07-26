import * as cloudinary from 'cloudinary';
import { FileUpload } from 'graphql-upload';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
	cloud_name: process.env._CLOUDINARY_CLOUD_NAME,
	api_key: process.env._CLOUDINARY_API_KEY,
	api_secret: process.env._CLOUDINARY_API_SECRET,
});

const uploads = (file: FileUpload) => {
	const { createReadStream } = file;
	const result: Promise<{ url: string; id: string }> = new Promise((resolve, reject) => {
		const piped = cloudinary.v2.uploader.upload_stream((error, result) => {
			if (result) {
				return resolve({
					url: result.secure_url,
					id: result.public_id,
				});
			}
			return reject(error);
		});
		return createReadStream().pipe(piped);
	});
	return result;
};
export default uploads;
