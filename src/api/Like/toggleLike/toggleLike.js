import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    toggleLike: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { postId, episodeId } = args;
      const { user } = request;

      const episodeLikeChecked = await prisma.user({ id: user.id });

      const filterEpisode = {
        AND: [{ user: { id: user.id } }, { episode: { id: episodeId } }]
      };

      if (episodeLikeChecked !== undefined) {
        const exist = await prisma.$exists.like(filterEpisode);
        console.log(exist);
        if (exist) {
          await prisma.deleteManyLikes(filterEpisode);
        } else {
          await prisma.createLike({});
        }
      } else {
        throw Error("😭 찜한 작품이 없습니다.");
      }

      return true;
    }
  }
};
