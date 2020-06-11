import { prisma } from "../../../generated/prisma-client";

export default {
  Like: {
    user: ({ id }) => prisma.user({ id }).user(),
    episode: ({ id }) => prisma.episode({ id }).episode(),
    post: ({ id }) => prisma.episode({ id }).post()
  }
};
