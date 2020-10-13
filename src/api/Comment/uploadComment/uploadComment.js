import { prisma } from "../../../../generated/prisma-client";
export default {
  Mutation: {
    uploadComment: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);

      const { text, episodeId } = args;
      const { user } = request;

      try {
        if (user) {
          const currentComment = await prisma.createComment({
            user: {
              connect: {
                id: user.id
              }
            },
            text,
            episode: {
              connect: {
                id: episodeId
              }
            }
          });

          //댓글이 생성될때, 그 해당 댓글을 keepComment하기 위한것
          if (currentComment) {
            const currentKeepUser = await prisma.keepUser({
              email: user.email
            });

            await prisma.createKeepComment({
              user: {
                connect: {
                  email: currentKeepUser.email
                }
              },
              text,
              commentId: currentComment.id
            });
          }

          return true;
          /*
          //추후, KeepEpisode가 있을 경우에 사용할 코드
            const currentKeepEpisode = await prisma.keepEpisode({ episodeId });
            await prisma.createKeepComment({
              user: {
                connect: {
                  email: user.email
                }
              },
              text,
              episode: {
                connect: {
                  id: currentKeepEpisode.id
                }
              },
              commentId: currentComment.id
            });
            return true;
          } else {
            throw Error("😅댓글을 입력할 수 없습니다 다시 시도해주세요.");
            */
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
