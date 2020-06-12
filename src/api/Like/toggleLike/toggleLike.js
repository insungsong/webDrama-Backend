import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    toggleLike: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { postId, episodeId } = args;
      const { user } = request;

      //user json에 like타입이 있는지 확인하는 코드
      const userLiked = await prisma.user({ id: user.id });

      //user가 특정 Episode에 좋아요를 해둔것이 있는지 확인하기 위함
      const filterEpisode = {
        AND: [{ user: { id: user.id } }, { episode: { id: episodeId } }]
      };

      const filterPost = {
        AND: [{ user: { id: user.id } }, { post: { id: postId } }]
      };

      if (userLiked !== undefined) {
        //user의 Like의 유무
        const episodeLiked = await prisma.$exists.like(filterEpisode);
        const postLiked = await prisma.$exists.like(filterPost);

        if (episodeLiked && !postLiked) {
          await prisma.deleteManyLikes(filterEpisode);
          return false;
        } else if (!episodeLiked && postLiked) {
          await prisma.deleteManyLikes(filterPost);
          return false;
        } else if (episodeId) {
          await prisma.createLike({
            user: { connect: { id: user.id } },
            episode: { connect: { id: episodeId } }
          });
          return true;
        } else if (postId) {
          await prisma.createLike({
            user: { connect: { id: user.id } },
            post: { connect: { id: postId } }
          });
          return true;
        }
      }
    }
  }
};
