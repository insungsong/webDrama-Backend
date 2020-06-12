import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    editEpisode: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);

      const { epsodeId, title, thumbnail, file } = args;
      const { user } = request;

      const filterUser = await prisma.$exists.user({
        AND: [
          { id: user.id },
          { posts_some: { episodes_some: { id: epsodeId } } }
        ]
      });

      try {
        if (filterUser) {
          await prisma.updateEpisode({
            data: {
              title,
              thumbnail,
              file
            },
            where: {
              id: epsodeId
            }
          });
          return true;
        } else {
          throw Error(
            "해당 계정은 해당 작품을 올린 작가본인인지 확인하십시오🧐"
          );
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
