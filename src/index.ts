import { ApolloServer } from "apollo-server";

// 1 The schema object you created using Nexus defines your GraphQL schema. You need to provide this when instantiating your server 
import { schema } from "./schema";
export const server = new ApolloServer({
    schema,
});

const port = 3000;
// 2
server.listen({port}).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});