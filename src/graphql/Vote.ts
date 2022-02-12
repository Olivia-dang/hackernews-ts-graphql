import { objectType, extendType, nonNull, intArg } from "nexus";
import { User } from "@prisma/client";

// The Vote type is a union of two things: the link in question and the user who just cast the vote.
export const Vote = objectType({
  name: "Vote",
  definition(t) {
    t.nonNull.field("link", { type: "Link" });
    t.nonNull.field("user", { type: "User" });
  },
});

// VoteMutation returns an instance of Vote type
export const VoteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("vote", {
      type: "Vote",
      args: {
        linkId: nonNull(intArg()),
      },
      async resolve(parent, args, context) {
        const { userId } = context;
        const { linkId } = args;

        if (!userId) {
          throw new Error("Cannot vote without logging in.");
        }

        const link = await context.prisma.link.update({
          where: {
            id: linkId,
          },
          // the data option specifies the update payload
          data: {
            // many-to-many relation represented by the voters field. This can be done using the `connect` option.
            voters: {
              connect: {
                id: userId,
              },
            },
          },
        });

        const user = await context.prisma.user.findUnique({
          where: { id: userId },
        });

        return {
          link,
          user: user as User,
          // The typecasting (user as User) is necessary as the type returned by prisma.user.findUnique is User | null, whereas the type expected from the resolve function is User
        };
      },
    });
  },
});
