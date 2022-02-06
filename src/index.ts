import { ApolloServer } from "apollo-server";
import { context } from "./context";
// import The schema object you created using Nexus defines your GraphQL schema. You need to provide this when instantiating your server
import { schema } from "./schema";
export const server = new ApolloServer({
  schema,
  context,
});

const port = 3000;

server.listen({ port }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
