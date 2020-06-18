import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    uploadEpisode: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);

      const { postId, title, thumbnail, file } = args;
      const { user } = request;

      try {
        const checkPostOfUser = await prisma.$exists.user({
          AND: [{ id: user.id }, { posts_some: { id: postId } }]
        });

        if (checkPostOfUser) {
          //checkPostOfUser 의 조건이 맞는다면,
          const currentEpisode = await prisma.createEpisode({
            post: { connect: { id: postId } },
            title,
            thumbnail,
            file
          });

          const episodeId = currentEpisode.id;

          await prisma.createKeepEpisode({
            post: { connect: { postId } },
            title,
            thumbnail,
            file,
            episodeId
          });
          return true;
        } else {
          throw Error("잘못된 방식의 접근입니다. 본인의 계정을 이용해주세요😎");
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
