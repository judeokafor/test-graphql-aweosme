import { Resolver, Arg, Query, Mutation } from 'type-graphql';
import { User, UserModel } from '../../models/User';

import { UserInput, EditUserInput } from './input';

@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: false })
	async returnSingleUser(@Arg('id') id: string) {
		return await UserModel.findById(id);
	}

	@Query(() => [User], { nullable: true })
	async returnAllUser(): Promise<User[]> {
		return await UserModel.find();
	}
	@Mutation(() => User)
	async createUser(@Arg('input') input: UserInput): Promise<User> {
		const { email, username } = input;
		console.log(input);
		const usercreated = await UserModel.create({
			email,
			username,
		});
		if (usercreated) {
			return usercreated;
		}
		throw new Error('User not created');
	}
	@Mutation(() => User)
	async editUser(@Arg('id') id: string, @Arg('input') input: EditUserInput): Promise<User> {
		const { email, username } = input;

		const user = await UserModel.findOneAndUpdate(
			{ _id: id },
			{
				email,
				username,
			},
			{ new: true }
		);
		if (user) {
			return user;
		}
		throw new Error('User not created');
	}
}
