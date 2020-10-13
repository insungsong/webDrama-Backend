import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    hitCountUpdateEpisode: async (_, args) => {
      const { episodeId } = args;

      try {
        const currentEpisodeHitCount = await prisma
          .episode({ id: episodeId })
          .hitCount();

        const currentEpisodeHitCountUpdate = await prisma.updateEpisode({
          where: {
            id: episodeId
          },
          data: {
            hitCount: currentEpisodeHitCount + 1
          }
        });
        console.log(currentEpisodeHitCountUpdate);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
