import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    uploadJokeCategory: async (_, args, { request }) => {
      const { title, orderBy } = args;
      const { user } = request;
      console.log(user);
      try {
        if (user.rank === "manager") {
          const createJokeCategory = await prisma.createJokeCategory({
            title,
            orderBy
          });
          console.log(createJokeCategory);
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
