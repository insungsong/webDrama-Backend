import { prisma } from "../../../generated/prisma-client";

export default {
  Like: {
    user: ({ id }) => prisma.like({ id }).user(),
    episode: ({ id }) => prisma.like({ id }).episode(),
    post: ({ id }) => prisma.like({ id }).post(),
    comment: ({ id }) => prisma.like({ id }).comment()
  }
};
