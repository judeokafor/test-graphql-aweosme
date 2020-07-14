import { InputType, Field } from 'type-graphql';
import { Length, IsEmail, IsPhoneNumber } from 'class-validator';
import { User } from '../../models/User';

@InputType()
export class RegisterUserInput implements Partial<User> {
	@Field()
	@Length(3, 25)
	firstName: string;

	@Field({ nullable: true })
	@Length(3, 25)
	lastName: string;

	@Field()
	@IsEmail()
	email: string;

	@Field()
	password: string;

	@Field({ nullable: true })
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
