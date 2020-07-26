import { InputType, Field, ID } from 'type-graphql';
import { Length, IsEmail, IsPhoneNumber } from 'class-validator';
import { User } from '../../models/User';

import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType()
export class RegisterUserInput implements Partial<User> {
	@Field()
	@Length(3, 25)
	firstName: string;

	@Field()
	authoId: string;

	@Field({ nullable: true })
	@Length(3, 25)
	lastName: string;

	@Field()
	@IsEmail()
	email: string;

	@Field({ nullable: false })
	@IsPhoneNumber('NG')
	phoneNumber: string;

	@Field(() => String, { nullable: true })
	isAdmin = false;
}
@InputType()
export class LoginInput implements Partial<User> {
	@Field()
	@IsEmail()
	email: string;

	@Field()
	password: string;
}

@InputType()
export class EditUserInput implements Partial<User> {
	@Field({ nullable: true })
	@Length(3, 25)
	firstName: string;

	@Field({ nullable: true })
	@Length(3, 25)
	lastName: string;

	@Field({ nullable: true })
	@IsPhoneNumber('NG')
	phoneNumber: string;
}
@InputType()
export class ResetPasswordInput {
	@Field({ nullable: false })
	resetPasswordCode: string;

	@Field({ nullable: false })
	newPassword: string;
}
@InputType()
export class UploadUserImageInput {
	@Field(() => ID, { nullable: false })
	readonly id: string;

	@Field(() => GraphQLUpload, { nullable: false })
	readonly uploadImage: FileUpload;
}
@InputType()
export class UploadMultipleImageInput {
	@Field(() => ID, { nullable: false })
	readonly id: string;

	@Field(() => [GraphQLUpload], { nullable: false })
	readonly uploadImages: FileUpload[];
}
