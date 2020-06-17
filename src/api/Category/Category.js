import { prisma } from "../../../generated/prisma-client";

export default {
  Category: {
    post: ({ id }) => prisma.category({ id }).post()
  }
};
