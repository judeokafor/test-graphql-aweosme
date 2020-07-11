import { UserResolver } from './User/resolver';
import { PropertyListingResolver } from './Property/resolver';

export default [UserResolver, PropertyListingResolver] as const;
