import { InputType, Field } from 'type-graphql';
import { Length } from 'class-validator';
import { User } from '../../models/User';

@InputType()
export class UserInput implements Partial<User> {
	@Field()
	@Length(3, 25)
	username: string;

	@Field()
	email: string;

	@Field(() => String, { nullable: true })
	role = 'student';
}

@InputType()
export class EditUserInput implements Partial<User> {
	@Field()
	@Length(3, 25)
	username: string;

	@Field()
	email: string;
}
