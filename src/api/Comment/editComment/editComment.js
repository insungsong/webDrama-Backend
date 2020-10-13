import { prisma } from "../../../../generated/prisma-client";

const DELETE = "DELETE";
const EDIT = "EDIT";

export default {
  Mutation: {
    editComment: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);

      const { episodeId, commentId, text, actions } = args;

      const { user } = request;

      //현재 댓글의 ID
      const isWriterComment = await prisma.comment({ id: commentId });

      //현재 댓글을 작성한 ID인지 확인
      const isWriter = await prisma.$exists.user({
        AND: [{ id: user.id }, { comments_some: { id: isWriterComment.id } }]
      });

      console.log(isWriter);

      //댓글 작성자 이외에 작가도 댓글을 지울 수 있도록함
      const isteamName = await prisma.$exists.user({
        posts_some: { episodes_some: { id: episodeId } }
      });

      try {
        if (isWriter || user.rank === "master" || isteamName) {
          if (
            (isWriter && actions === EDIT) ||
            (user.rank === "master" && actions === EDIT)
          ) {
            await prisma.updateComment({
              data: {
                text
              },
              where: {
                id: commentId
              }
            });

            const currentKeepComment = await prisma.keepComment({
              commentId
            });

            await prisma.updateKeepComment({
              data: {
                text
              },
              where: {
                id: currentKeepComment.id
              }
            });
            return true;
          } else if (
            actions === DELETE &&
            (isteamName || user.rank === "master" || isWriter)
          ) {
            await prisma.deleteManyComments({
              id: commentId
            });
            return true;
          } else {
            throw Error("해당 댓글을 수정할 권한이 없습니다.🥺");
          }
        } else {
          throw Error("댓글을 수정할 권한이 없습니다.🤪");
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
