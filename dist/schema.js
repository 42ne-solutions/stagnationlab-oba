"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
const apollo_server_1 = require("apollo-server");
const SEB_1 = require("./lib/providers/SEB");
exports.typeDefs = apollo_server_1.gql `

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
exports.resolvers = {
    Query: {
        authorization: (_, { id }) => SEB_1.SEB.getAuthorizationById(id),
    },
    Mutation: {
        startAuthorization: (_, { method, psuId, psuCorporateId, bic, clientId }) => SEB_1.SEB.startAuthorization(method, psuId, psuCorporateId, bic || "EEUHEE2X", clientId || "111", ["accounts"]),
        createAccessToken: (_, { authorizationId }) => SEB_1.SEB.createAccessToken(authorizationId),
    }
};
