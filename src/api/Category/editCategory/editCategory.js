import { prisma } from "../../../../generated/prisma-client";

const EDIT = "EDIT";
const DELETE = "DELETE";

export default {
  Mutation: {
    editCategory: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);

      const { editCategoryId, genre, postId, actions } = args;
      const { user } = request;

      //마스터 계정만 뽑아옴
      const isMasterUser = await prisma.$exists.user({
        AND: [{ id: user.id }, { rank: "master" }]
      });

      var inputPostIdArr = new Array();

      if (postId !== undefined) {
        postId.map((value) => {
          var inputPostIdObj = new Object();

          inputPostIdObj.id = value;
          inputPostIdArr.push(inputPostIdObj);
        });
      }

      try {
        if (isMasterUser) {
          //장르명만 바꿀 경우
          if (actions === EDIT) {
            if (postId === undefined) {
              const newname = await prisma.updateCategory({
                where: { id: editCategoryId },
                data: {
                  genre
                }
              });
            }
            if (genre === undefined) {
              const postIdArr = await prisma
                .category({ id: editCategoryId })
                .post();

              const disconnectPostArr = new Array();

              postIdArr.map((post) => {
                const disconnectPostObj = new Object();
                disconnectPostObj.id = post.id;
                disconnectPostArr.push(disconnectPostObj);
              });

              //Post를 새로 채우기전에 이전에 있던 Post를 비움
              await prisma.updateCategory({
                where: { id: editCategoryId },
                data: {
                  post: {
                    disconnect: disconnectPostArr
                  }
                }
              });

              //비워진 카테고리 Post필드 안에 새로운 Post id를 채움
              await prisma.updateCategory({
                where: { id: editCategoryId },
                data: {
                  post: {
                    connect: inputPostIdArr
                  }
                }
              });
            }
          } else {
            await prisma.deleteCategory({
              id: editCategoryId
            });
          }
        } else {
          throw Error("부적절한 접근입니다. 회원의 서비스를 사용해주세요.🥺");
        }
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
