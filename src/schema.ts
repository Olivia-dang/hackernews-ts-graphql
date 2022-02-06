import { makeSchema } from "nexus";
import { join } from "path";
import * as types from "./graphql";

export const schema = makeSchema({
  types,
  outputs: {
    schema: join(__dirname, "..", "schema.graphql"),
    typegen: join(__dirname, "..", "nexus-typegen.ts"),
  },
  contextType: {
    module: join(__dirname, "./context.ts"), // 1
    export: "Context", // Name of the exported interface in that module.
  },
});
