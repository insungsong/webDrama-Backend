import { prisma } from "../../../generated/prisma-client";

export default {
  Unlike: {
    user: ({ id }) => prisma.user({ id }).user(),
    comment: ({ id }) => prisma.comment({ id })
  }
};
