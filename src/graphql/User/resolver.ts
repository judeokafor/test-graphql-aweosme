import { Resolver, Arg, Query, Mutation, Authorized } from 'type-graphql';
import { User, UserModel } from '../../models/User';

import { RegisterUserInput, EditUserInput } from './input';
import { Roles } from '../../shared/auth-checker';

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
}
