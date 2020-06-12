import { prisma } from "../../../../generated/prisma-client";

const DELETE = "DELETE";
const EDIT = "EDIT";

export default {
  Mutation: {
    editPost: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);

      const {
        id,
        title,
        description,
        uploadDay,
        thumbnail,
        category,
        broadcast,
        action
      } = args;

      const { user } = request;

      //category로 부터 받아온 [value, value...]을 prisma에 connect하는 형식에 맞게 포장하는 코드
      var createCategoryArr = new Array();

      category.map((value) => {
        var createCategoryObj = new Object();

        createCategoryObj.id = value;
        createCategoryArr.push(createCategoryObj);
      });
      const post = await prisma.$exists.post({ id, teamName: { id: user.id } });

      try {
        if (post) {
          if (action === EDIT) {
            await prisma.updatePost({
              data: {
                title,
                description,
                uploadDay: { set: uploadDay },
                thumbnail,
                category: {
                  connect: createCategoryArr
                },
                broadcast
              },
              where: { id }
            });
            return true;
          } else if (action === DELETE) {
            await prisma.deletePost({ id });
            return true;
          }
        } else {
          throw Error("You Can't do that");
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
