import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    uploadViewdEpisodeRecord: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { episodeId, viewTime } = args;

      try {
        if (user) {
          await prisma.createViewedEpisodeRecord({
            user: {
              connect: {
                id: user.id
              }
            },
            episode: {
              connect: {
                id: episodeId
              }
            },
            viewTime
          });
        }
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
