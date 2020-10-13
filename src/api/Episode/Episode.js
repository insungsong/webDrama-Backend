import { prisma } from "../../../generated/prisma-client";

export default {
  Episode: {
    post: ({ id }) => prisma.episode({ id }).post(),
    likes: ({ id }) => prisma.episode({ id }).likes(),
    comments: ({ id }) => prisma.episode({ id }).comments()
  }
};
