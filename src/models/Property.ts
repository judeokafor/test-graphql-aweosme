import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass, Ref } from '@typegoose/typegoose';

import { User } from './User';

@ObjectType({ description: 'The PropertyListing model' })
export class PropertyListing {
	@Field(() => ID)
	id: string;

	@Field()
	@Property({ required: true })
	name: string;

	@Field(() => [User], { nullable: false })
	@Property({ ref: User, required: true })
	owners: Ref<User>[];
}
export const PropertyListingModel = getModelForClass(PropertyListing);
