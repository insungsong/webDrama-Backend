import { prisma } from "../../../generated/prisma-client";

export default {
  User: {
    watchedEpisode: ({ id }) => prisma.user({ id }).watchedEpisode()
  }
};
