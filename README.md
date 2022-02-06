# Source

Tutorial for this project is here
<https://www.howtographql.com/typescript-apollo/1-getting-started/>

> ## Command lines

- You can run `npm run generate` to update your schema.graphql and nexus-typegen.ts file when there are any changes in your Nexus code.
- You can use `npm run dev` to start the web server and watch for any changes (Your schema should be updated automatically).
- Regenerate Prisma Client: `npx prisma generate`

> ## Q&A

- What is the role of Prisma Client in the GraphQL API?

  - It connects your GraphQL server to the database

- What is the second argument that's passed into GraphQL resolvers used for? `resolve(parent, args, context)`
  - It carries the arguments for the incoming GraphQL operation

-

> ## Notes

- src/graphql/Link.ts

  ```ts
  import { objectType } from "nexus"; //objectType is used to create a new type in your GraphQL schema

  // Define type Link, it has a, id, a description and a url. All not nullable.
  export const Link = objectType({
      name: "Link", // defines the name of the type
      definition(t) {  // add fields to the type
          t.nonNull.int("id"); 
          t.nonNull.string("description");
          t.nonNull.string("url");
      },
  });

  export const LinkQuery = extendType({  // You are extending the Query root type and adding a new root field to it called feed
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {   // define the return type of the feed query
            type: "Link",
            resolve(parent, args, context, info) {    // the name of the resolver function of the feed query
                return links;
            },
        });
    },
  });

  ```

  Try in the playground:

  ```ts

  query {
  feed {
    id
    url
    description
    }
  }
  ```

```ts
export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", { //The name of the mutation is `post`
      type: "Link", // returns a Link object
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
    ...  
    });
  },
});

```

- prisma/schema.prisma

  ```prisma
  generator client {
    provider = "prisma-client-js"
  }

  datasource db {
    provider = "postgresql" 
    url      = env("DATABASE_URL")
  }

  //  The Link model defines the structure of the Link database table that Prisma is going to create for you in a bit. 
  model Link {
    id          Int      @id @default(autoincrement())  
    createdAt   DateTime @default(now())  
    description String
    url         String
  }
  ```
