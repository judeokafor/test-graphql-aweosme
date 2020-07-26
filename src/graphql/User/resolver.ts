import { Resolver, Arg, Query, Mutation, Authorized } from 'type-graphql';

import { User, UserModel } from '../../models/User';
import {
	RegisterUserInput,
	EditUserInput,
	UploadUserImageInput,
	UploadMultipleImageInput,
} from './input';
import shared from '../../shared';

const { uploads, authChecker } = shared;
const { Roles } = authChecker;

@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: false })
	async fetchSingleUser(@Arg('id') id: string) {
		return await UserModel.findById(id);
	}
	@Authorized([Roles.ADMIN])
	@Query(() => [User], { nullable: true })
	async returnAllUser(): Promise<User[]> {
		return await UserModel.find();
	}
	@Mutation(() => User)
	async registerUser(@Arg('input') input: RegisterUserInput): Promise<User> {
		const { email, isAdmin, phoneNumber, lastName, firstName, authoId } = input;
		try {
			const userCreated = await UserModel.create({
				email,
				firstName,
				lastName,
				phoneNumber,
				isAdmin,
				authoId,
				imageUrl: ['jajjaja', 'allals'],
			});

			if (userCreated) {
				return userCreated;
			}

			throw new Error('User not created');
		} catch (error) {
			throw new Error(error);
		}
	}

	@Mutation(() => User)
	async editUser(@Arg('id') id: string, @Arg('input') input: EditUserInput): Promise<User> {
		const user = await UserModel.findByIdAndUpdate(id, input, { new: true });
		if (user) {
			return user;
		}
		throw new Error('User does not created');
	}

	// @Mutation(() => User)
	// async uploadUserImage(@Arg('input') input: UploadUserImageInput): Promise<User> {
	// 	const { id, uploadImage } = input;

	// 	const { url: imageUrl } = await uploads(uploadImage);
	// 	const user = await UserModel.findByIdAndUpdate(id, { imageUrl }, { new: true });
	// 	if (user) {
	// 		return user;
	// 	}
	// 	throw new Error('User does not created');
	// }

	@Mutation(() => User)
	async multipleUserUpload(@Arg('input') input: UploadMultipleImageInput): Promise<User> {
		const { id, uploadImages } = input;

		const promises = uploadImages.map(uploadImage => uploads(uploadImage));

		const imageResponses = await Promise.all(promises);

		const imageUrls = imageResponses.map(({ url }) => url);

		console.log({ imageUrls });

		const user = await UserModel.findByIdAndUpdate(id, { imageUrls }, { new: true });
		if (user) {
			return user;
		}
		throw new Error('User does not created');
	}
}
