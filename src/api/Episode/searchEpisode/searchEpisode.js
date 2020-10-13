import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    //내가 작품을 올린 에피소드들을 가져오는 쿼리문
    searchEpisode: async (_, args, { request, isAuthenticated }) => {
      try {
        const { episodeId } = args;

        const findEpisode = await prisma.episode({ id: episodeId });

        return findEpisode;
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }
};
