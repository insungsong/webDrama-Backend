import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    arrEditJokeCategory: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { editJokeCategoryId } = args;

      const { user } = request;

      //마스터 계정만 뽑아옴
      const isMasterUser = await prisma.$exists.user({
        AND: [{ id: user.id }, { rank: "master" }]
      });
      try {
        if (isMasterUser) {
          let orderByNumber = 0;
          editJokeCategoryId.map(async (value) => {
            orderByNumber++;
            await prisma.updateJokeCategory({
              where: { id: value },
              data: {
                orderBy: orderByNumber
              }
            });
          });
          return true;
        } else {
          throw Error(
            "해당 접근은 올바른 접근이 아닙니다. 메인 화면으로 이동합니다😎"
          );
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    //정보를 바꿀때는 정보만 바꾸기
    oneEditJokeCategory: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { editJokeCategoryId, title, postId } = args;

      try {
        //기존에 들어있는 해당 조크카테고리의 postId들의 배열을 가지고옴
        const jokeCategoryIdArr = await prisma
          .jokeCategory({ id: editJokeCategoryId })
          .posts();

        //커넥트를 끊는 이전의 postId들을
        const disconnectjokeCategoryIdArr = new Array();

        //해당 배열안에 들어있는 post변수로 prisma가 받기좋은 JSON 포장을 함
        jokeCategoryIdArr.map((post) => {
          const disconnectjokeCategoryObj = new Object();
          disconnectjokeCategoryObj.id = post.id;
          disconnectjokeCategoryIdArr.push(disconnectjokeCategoryObj);
        });

        //커넥트를 새로운 PostId와 연결
        const connectjokeCategoryIdArr = new Array();

        postId.map((post) => {
          const connectjokeCategoryObj = new Object();
          connectjokeCategoryObj.id = post;
          connectjokeCategoryIdArr.push(connectjokeCategoryObj);
        });

        //현재 jokeCategoryId와 연결된 postId들을 끊는다.
        await prisma.updateJokeCategory({
          where: { id: editJokeCategoryId },
          data: {
            title,
            posts: {
              disconnect: disconnectjokeCategoryIdArr
            }
          }
        });

        //현재 jokeCategoryId와 새로운 postId를 연결시킨다.
        await prisma.updateJokeCategory({
          where: { id: editJokeCategoryId },
          data: {
            title,
            posts: {
              connect: connectjokeCategoryIdArr
            }
          }
        });
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
