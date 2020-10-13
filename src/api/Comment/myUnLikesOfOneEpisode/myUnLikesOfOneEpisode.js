import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    myUnLikesOfOneEpisode: async (_, args, { request, isAuthenticated }) => {
      try {
        const { user } = request;
        const { episodeId } = args;

        const myUnLikesOfOneEpisode = await prisma
          .episode({ id: episodeId })
          .comments({ where: { unlikes_some: { user: { id: user.id } } } });

        return myUnLikesOfOneEpisode;
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }
};
