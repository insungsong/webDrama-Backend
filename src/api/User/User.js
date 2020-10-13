import { prisma } from "../../../generated/prisma-client";

export default {
  User: {
    watchedEpisode: ({ id }) => prisma.user({ id }).watchedEpisode(),
    posts: ({ email }) => prisma.user({ email }).posts(),
    likes: ({ email }) => prisma.user({ email }).likes(),
    unlikes: ({ email }) => prisma.user({ email }).unlikes(),
    subscription: ({ id }) => prisma.user({ id }).subscription()
  }
};
