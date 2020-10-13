import { prisma } from "../../../generated/prisma-client";

export default {
  Comment: {
    user: ({ id }) => prisma.comment({ id }).user(),
    episode: ({ id }) => prisma.comment({ id }).episode(),
    likes: ({ id }) => prisma.comment({ id }).likes(),
    unlikes: ({ id }) => prisma.comment({ id }).unlikes()
  },

  KeepComment: {
    user: ({ id }) => prisma.keepComment({ id }).user(),
    episode: ({ id }) => prisma.keepEpisode({ id }).episodeId()
  }
};
