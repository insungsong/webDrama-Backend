import { prisma } from "../../../generated/prisma-client";

export default {
  Episode: {
    post: ({ id }) => prisma.episode({ id }).post()
  }
};
