import { prisma } from "../../../../generated/prisma-client";
export default {
  Mutation: {
    uploadCategory: async (_, args, { request, isAuthenticated }) => {
      const { genre, postId } = args;
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
          if (postId !== undefined) {
            //장르를 만들때 post를 연결하는 경우
            await prisma.createCategory({
              genre,
              post: {
                connect: inputPostIdArr
              }
            });
          } else {
            //장르를 만들떄 post를 연결하지 않는 경우
            await prisma.createCategory({
              genre
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