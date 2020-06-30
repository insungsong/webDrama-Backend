import { prisma } from "../../../generated/prisma-client";

export default {
  ViewedEpisodeRecord: {
    user: ({ id }) => prisma.viewedEpisodeRecord({ id }).user(),
    episode: ({ id }) => prisma.viewedEpisodeRecord({ id }).episode()
  }
};
