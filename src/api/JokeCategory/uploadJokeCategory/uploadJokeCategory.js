import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    uploadJokeCategory: async (_, args, { request }) => {
      const { title, postId, orderBy } = args;
      const { user } = request;

      //마스터 계정만 뽑아옴
      const isMasterUser = await prisma.$exists.user({
        AND: [{ id: user.id }, { rank: "master" }]
      });

      //JSON 포장지 만들기
      var inputJokeCategoryArr = new Array();

      if (postId !== undefined) {
        postId.map((value) => {
          var inputPostIdObj = new Object();

          inputPostIdObj.id = value;
          inputJokeCategoryArr.push(inputPostIdObj);
        });
      }

      try {
        if (isMasterUser) {
          const jokeCategoryArr = await prisma.jokeCategories();

          if (jokeCategoryArr.length === 0) {
            await prisma.createJokeCategory({
              orderBy: 1,
              title,
              posts: {
                connect: inputJokeCategoryArr
              }
            });
          }
          //orderBy를 지정하지 않으면서 조크카테고리가 있을때 => orderBy를 안주고 카테고리를 만드는 경우
          else if (!orderBy && jokeCategoryArr.length !== 0) {
            var biggerOrderBy = 0;
            jokeCategoryArr.map((value) => {
              if (biggerOrderBy < value.orderBy) {
                biggerOrderBy = value.orderBy;
              }
            });

            const inputOrderByNumber = biggerOrderBy + 1;
            console.log(inputOrderByNumber);

            await prisma.createJokeCategory({
              title,
              posts: { connect: inputJokeCategoryArr },
              orderBy: inputOrderByNumber
            });
            //postId를 지정해주어서 만들떄 => postId를 주고 카테고리를 만드는 경우
          } else if (postId !== undefined) {
            await prisma.createJokeCategory({
              title,
              orderBy,
              posts: {
                connect: inputJokeCategoryArr
              }
            });
            //postId를 주지 않았을때 =>postId를 안넣고 카테고리를 만드는 경우
          } else {
            await prisma.createJokeCategory({
              title,
              orderBy
            });
          }
          return true;
        } else {
          //여기는 관리자 단접근임으로 redirect home던지기
          throw Error("잘못된 접근입니다. 회원페이지에서 활동 부탁드립니다.🥰");
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
