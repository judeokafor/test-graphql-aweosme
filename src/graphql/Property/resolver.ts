import { Resolver, Arg, Query, Mutation } from 'type-graphql';
import { PropertyListing, PropertyListingModel } from '../../models/Property';

import { PropertyListingInput } from './input';

@Resolver()
export class PropertyListingResolver {
	@Query(() => [PropertyListing], { nullable: false })
	async returnAllPropertyListing(): Promise<PropertyListing[]> {
		const properties = await PropertyListingModel.find().populate('owners');
		console.log({ properties });
		return properties;
	}
	@Mutation(() => PropertyListing)
	async createPropertyListing(
		@Arg('input') input: PropertyListingInput
	): Promise<PropertyListing> {
		const { name, owners } = input;

		const { _id } = await PropertyListingModel.create({
			name,
			owners,
		});
		if (_id) {
			const property = await PropertyListingModel.findById(_id).populate('owners');
			if (property) {
				return property;
			}
		}
		throw new Error('Property not created');
	}
}
