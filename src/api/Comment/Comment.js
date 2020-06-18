import { prisma } from "../../../generated/prisma-client";

export default {
  Comment: {
    user: ({ id }) => prisma.comment({ id }).user(),
    episode: ({ id }) => prisma.comment({ id }).episode()
  },

  KeepComment: {
    user: ({ id }) => prisma.keepComment({ id }).user(),
    episode: ({ id }) => prisma.keepEpisode({ id }).episodeId()
  }
};
