import { AuthChecker } from 'type-graphql';
import { Request } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

import { UserModel } from '../models/User';

export enum Roles {
	ADMIN = 'ADMIN',
}

type User = {
	id: string;
	firstName: string;
	lastName: string;
	isAdmin: boolean;
};
type Context = {
	req: Request;
};

dotenv.config();

const client = jwksClient({
	jwksUri: `https://${process.env._AUTH0_DOMAIN}/.well-known/jwks.json`,
});

const getKey = (header: any, callback: any) => {
	client.getSigningKey(header.kid, (err, key) => {
		if (err) throw new Error(`${err}`);

		const signinKey = key.getPublicKey();
		callback(null, signinKey);
	});
};

// @Authorizer(['ADMIN']); assuming that we are passing the roles as an array of strings;

// create auth checker function AuthChecker<ContextType> { root, args, context, info }
export const authChecker: AuthChecker<Context> = ({ context: { req } }, roles) => {
	const bearerToken = req.headers.authorization;
	const token = bearerToken?.split(' ')[1];

	if (token) {
		jwt.verify(
			token,
			getKey,
			{
				audience: process.env._API_IDENTIFIER,
				issuer: `https://${process.env._AUTH0_DOMAIN}/`,
				algorithms: ['RS256'],
			},

			async (err, decoded) => {
				if (err) {
					return false;
				}

				const { id: authoId } = decoded as User;
				const user = await UserModel.findOne({ authoId });

				if (roles.length === 0) {
					return user !== undefined;
				}

				if (user) {
					const { isAdmin } = user;
					if (isAdmin && roles.includes(Roles.ADMIN)) {
						return true;
					}
				}

				return false;
			}
		);
	}
	return false;
};
