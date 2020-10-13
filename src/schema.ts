
import { gql } from "apollo-server";
import { SEB } from "./lib/providers/SEB";

export const typeDefs = gql `

type Authorization {
	id: ID!
	status: AuthorizationStatus!
	challenge: AuthorizationChallenge
}

type AuthorizationChallenge {
	code: String!
}

enum AuthorizationStatus {
	IN_PROGRESS
	SUCCESS
	FAILURE
}

enum AuthorizationMethod {
	MOBILE_ID
	SMART_ID
}

type AccessToken {
	type: String!
	token: String!
	expiresIn: Int!
}

type Query {
	authorization( id: ID! ): Authorization
}

type Mutation {
	startAuthorization( method: AuthorizationMethod!, psuId: String!, psuCorporateId: String!, bic: String, clientId: String): Authorization!
	createAccessToken( authorizationId: ID! ): AccessToken!
}

`;

export const resolvers = {

	Query: {

	  authorization: (_, { id }) => SEB.getAuthorizationById(id),

	},

	Mutation: {

		startAuthorization: (_, { method, psuId, psuCorporateId, bic, clientId }) =>
			SEB.startAuthorization(method, psuId, psuCorporateId, bic || "EEUHEE2X", clientId || "111", [ "accounts" ]),

		createAccessToken: (_, { authorizationId }) => SEB.createAccessToken(authorizationId),

	}

};