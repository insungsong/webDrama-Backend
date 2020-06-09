import { prisma } from "../../../generated/prisma-client";

export default {
  Secret: {
    user: ({ id }) => prisma.secret({ id }).user()
  }
};
