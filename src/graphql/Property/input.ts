import { InputType, Field, ID } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { Length } from 'class-validator';

import { PropertyListing } from '../../models/Property';

@InputType()
export class PropertyListingInput implements Partial<PropertyListing> {
	@Field()
	@Length(3, 25)
	name: string;

	@Field(() => [ID])
	owners: ObjectId[];
}
