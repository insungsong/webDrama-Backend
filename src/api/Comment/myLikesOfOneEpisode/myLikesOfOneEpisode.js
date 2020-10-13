import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    myLikesOfOneEpisode: async (_, args, { request, isAuthenticated }) => {
      try {
        const { user } = request;
        const { episodeId } = args;

        const myLikesOfOneEpisode = await prisma
          .episode({ id: episodeId })
          .comments({ where: { likes_some: { user: { id: user.id } } } });

        return myLikesOfOneEpisode;
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }
};
