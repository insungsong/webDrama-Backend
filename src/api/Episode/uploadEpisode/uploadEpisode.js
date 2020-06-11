import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    uploadEpisode: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);

      const { post, title, thumnail, file } = args;
      const { user } = request;

      try {
        const checkPostOfUser = await prisma.$exists.user({
          AND: [{ id: user.id }, { post }]
        });

        if (checkPostOfUser) {
          //checkPostOfUser 의 조건이 맞는다면,
          await prisma.createEpisode({
            post: { connect: { id: post } },
            title,
            thumnail,
            file
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
