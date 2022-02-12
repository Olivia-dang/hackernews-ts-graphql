import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    // "links" represents all the links that have been posted by that particular user.
    t.nonNull.list.nonNull.field("links", {
      type: "Link",
      resolve(parent, args, context) {
        return (
          context.prisma.user
            // You are using the parent argument which contains the all the fields of the user that you are trying to resolve
            .findUnique({ where: { id: parent.id } })
            .links()
        );
      },
    });
    t.nonNull.list.nonNull.field("votes", {
      type: "Link",
      resolve(parent, args, context) {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .votes();
      },
    });
  },
});
