"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
const apollo_server_1 = require("apollo-server");
const Env_1 = require("./lib/Env");
const server = new apollo_server_1.ApolloServer({
    typeDefs: schema_1.typeDefs,
    resolvers: schema_1.resolvers,
});
server.listen({ host: Env_1.Env.host, port: Env_1.Env.port }).then(({ url }) => {
    console.log('Server is live and rocking at: ' + url);
});
