import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';

@ObjectType({ description: 'The User model' })
export class User {
	@Field(() => ID)
	@Property({ required: false })
	id: string;

	@Field({ nullable: true })
	@Property({ required: true, trim: true })
	email: string;

	@Field()
	@Property({ required: true, trim: true })
	firstName: string;

	@Field()
	@Property({ required: false, trim: true })
	lastName: string;

	@Field()
	@Property({ required: true, trim: true })
	phoneNumber: string;

	@Field(() => Boolean)
	@Property()
	isAdmin = false;

	@Field(() => ID)
	@Property({ required: true })
	authoId: string;

	@Field({ nullable: true })
	@Property({ required: true })
	imageUrl: string[];
}
export const UserModel = getModelForClass(User);
