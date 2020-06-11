import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    editJokeCategory: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { id, postId } = args;
      const { user } = request;

      try {
        if (user.rank === "manager") {
          var createJokeCategoryArr = new Array();

          postId.map((value) => {
            var createCJokeCategoryObj = new Object();

            createCJokeCategoryObj.id = value;
            createJokeCategoryArr.push(createCJokeCategoryObj);
          });

          const editJoke = await prisma.updateJokeCategory({
            where: { id },
            data: {
              posts: { connect: createJokeCategoryArr }
            }
          });
          console.log(editJoke);
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
    }
  }
};
