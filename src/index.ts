
import { typeDefs, resolvers } from "./schema";
import { ApolloServer } from "apollo-server";
import { Env } from "./lib/Env";

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

server.listen({ host: Env.host, port: Env.port }).then(({ url }) => {
	console.log('Server is live and rocking at: ' + url);
});
