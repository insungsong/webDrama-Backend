import { prisma } from "../../../../generated/prisma-client";

const EDIT = "EDIT";
const DELETE = "DELETE";

export default {
  Mutation: {
    editEpisode: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);

      const { episodeId, title, thumbnail, file, endTime, actions } = args;
      const { user } = request;

      const filterUser = await prisma.$exists.user({
        AND: [
          { id: user.id },
          { posts_some: { episodes_some: { id: episodeId } } }
        ]
      });

      try {
        if (filterUser) {
          if (actions === EDIT) {
            await prisma.updateEpisode({
              data: {
                title,
                thumbnail,
                file,
                endTime
              },
              where: {
                id: episodeId
              }
            });

            await prisma.updateKeepEpisode({
              data: {
                title,
                thumbnail,
                file,
                endTime
              },
              where: {
                episodeId
              }
            });
          } else {
            await prisma.deleteEpisode({
              id: episodeId
            });
          }
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
