import { prisma } from "../../../../generated/prisma-client";

const DELETE = "DELETE";
const EDIT = "EDIT";

export default {
  Mutation: {
    editComment: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);

      const { episodeId, commentId, text, actions } = args;
      const { user } = request;
      console.log(user.rank === "master");

      //현재 댓글의 ID
      const isWriterComment = await prisma.comment({ id: commentId });

      //현재 댓글을 작성한 ID인지 확인
      const isWriter = await prisma.$exists.user({
        AND: [{ id: user.id }, { comments_some: { id: isWriterComment.id } }]
      });

      //댓글 작성자 이외에 작가도 댓글을 지울 수 있도록함
      const isteamName = await prisma.$exists.user({
        posts_some: { episodes_some: { id: episodeId } }
      });

      console.log(isteamName);

      try {
        if (isWriter || user.rank === "master") {
          if (actions === EDIT) {
            await prisma.updateComment({
              data: {
                text
              },
              where: {
                id: commentId
              }
            });
            return true;
          } else if (
            (actions === DELETE && isteamName) ||
            (actions === DELETE && user.rank === "master")
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