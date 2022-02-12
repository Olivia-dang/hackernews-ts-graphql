import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
    t.nonNull.dateTime("createdAt"); // so long as createdAt field already exists in the Link Prisma model.
    t.field("postedBy", {
      // add an optional field without "nonNull"
      type: "User",
      resolve(parent, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .postedBy();
      },
    });
    t.nonNull.list.nonNull.field("voters", {
      // 1
      type: "User",
      resolve(parent, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .voters();
      },
    });
  },
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      args: {
        filter: stringArg(), // this `filter` argument is optional
        skip: intArg(), //The start index is called skip, since you’re skipping that many elements in the list before collecting the items to be returned. If skip is not provided, it’s 0 by default.
        take: intArg(), // the limit is called "take", meaning you’re “taking” x elements after a provided start index.
      },
      resolve(parent, args, context, info) {
        const where = args.filter
          ? {
              OR: [
                { description: { contains: args.filter } },
                { url: { contains: args.filter } },
              ],
            }
          : {};
        // using the PrismaClient instance available through context.prisma.
        return context.prisma.link.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
        });
      },
    });
  },
});

export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createLink", {
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },

      resolve(parent, args, context) {
        const { description, url } = args;
        const { userId } = context;

        if (!userId) {
          // only authorized users can add a new link.
          throw new Error("Cannot post without logging in.");
        }

        // calling the create method on the Link model from your Prisma Client API
        const newLink = context.prisma.link.create({
          data: {
            description,
            url,
            postedBy: { connect: { id: userId } }, // The connect operator is used by Prisma to specify which user the newly created link should be associated with.
          },
        });
        return newLink;
      },
    });
  },
});
