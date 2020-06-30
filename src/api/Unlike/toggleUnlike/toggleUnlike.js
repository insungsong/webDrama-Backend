import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    toggleUnlike: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { commentId } = args;

      //user json에 like타입이 있는지 확인하는 코드
      const userLiked = await prisma.user({ id: user.id });

      const filterComment = {
        AND: [{ user: { id: user.id } }, { comment: { id: commentId } }]
      };

      try {
        if (userLiked !== undefined) {
          const commentUnliked = await prisma.$exists.unlike(filterComment);

          if (commentUnliked) {
            await prisma.deleteManyUnlikes(filterComment);
            return false;
          } else {
            await prisma.createUnlike({
              user: { connect: { id: user.id } },
              comment: { connect: { id: commentId } }
            });
            return true;
          }
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
