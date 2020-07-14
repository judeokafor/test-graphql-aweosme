import { Resolver, Arg, Query, Mutation } from 'type-graphql';
import bcrypt from 'bcryptjs';
import utils from '../../utils';
import { User, UserModel } from '../../models/User';

import { RegisterUserInput, EditUserInput, LoginInput, ResetPasswordInput } from './input';

const { firebase } = utils;
const { firebase: fireBase } = firebase;

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
	async registerUser(@Arg('input') input: RegisterUserInput): Promise<User> {
		const { email, password, isAdmin, phoneNumber, lastName, firstName } = input;
		try {
			const { user } = await fireBase.auth().createUserWithEmailAndPassword(email, password);
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			if (user) {
				const { uid, getIdToken } = user;
				const token = await getIdToken();

				const userCreated = await UserModel.create({
					email,
					firstName,
					lastName,
					phoneNumber,
					isAdmin,
					uid,
					password: hashedPassword,
					token,
				});

				if (userCreated) {
					return userCreated;
				}

				throw new Error('User not created');
			}
			throw new Error('Error creating User');
		} catch (error) {
			throw new Error(error);
		}
	}
	@Mutation(() => User)
	async signInUser(@Arg('input') input: LoginInput): Promise<User> {
		const { email, password } = input;

		const { user } = await fireBase.auth().signInWithEmailAndPassword(email, password);

		if (user) {
			const { uid, getIdToken } = user;

			const token = await getIdToken();

			const userData = await UserModel.findOne({
				uid,
			});

			if (userData) {
				return { ...userData, token };
			}
			throw new Error('User not created');
		}
		throw new Error('User does not exist');
	}

	@Mutation(() => User)
	async signOut(@Arg('id') id: string): Promise<User> {
		await fireBase.auth().signOut();
		const userSignedOut = await UserModel.findByIdAndUpdate(
			id,
			{
				token: '',
			},
			{ new: true }
		);

		if (userSignedOut) {
			return userSignedOut;
		}
		throw new Error('User does not exist');
	}

	@Mutation(() => User)
	async editUser(@Arg('id') id: string, @Arg('input') input: EditUserInput): Promise<User> {
		const { phoneNumber, firstName, lastName } = input;

		const user = await UserModel.findByIdAndUpdate(
			id,
			{
				phoneNumber,
				firstName,
				lastName,
			},
			{ new: true }
		);
		if (user) {
			return user;
		}
		throw new Error('User does not created');
	}

	@Mutation(() => User)
	async requestResetPassword(@Arg('email') email: string): Promise<User> {
		try {
			await fireBase.auth().sendPasswordResetEmail(email);
			const user = await UserModel.findOne({ email: email.trim() });
			if (user) {
				return user;
			}
			throw new Error('User does not exist');
		} catch (error) {
			throw new Error(error);
		}
	}

	@Mutation(() => User)
	async resetPassword(@Arg('input') input: ResetPasswordInput): Promise<User> {
		const { resetPasswordCode, newPassword } = input;
		try {
			const email = await fireBase.auth().verifyPasswordResetCode(resetPasswordCode);
			await fireBase.auth().confirmPasswordReset(resetPasswordCode, newPassword);
			const user = await UserModel.findOne({ email });
			if (user) {
				return user;
			}
			throw new Error('User does not exist');
		} catch (error) {
			throw new Error(error);
		}
	}
}
