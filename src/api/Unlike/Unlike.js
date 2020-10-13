import { prisma } from "../../../generated/prisma-client";

export default {
  Unlike: {
    user: ({ id }) => prisma.unlike({ id }).user(),
    comment: ({ id }) => prisma.unlike({ id }).comment()
  }
};
