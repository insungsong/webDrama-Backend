import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    uploadPost: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const {
        title,
        description,
        thumnail,
        category,
        broadcast,
        uploadDay
      } = args;
      const { user } = request;

      try {
        if (user) {
          const categorys = await prisma.categories();
          console.log(categorys[0]);

          const post = await prisma.createPost({
            teamName: {
              connect: {
                id: user.id
              }
            },
            title,
            description,
            thumnail,
            category,
            broadcast,
            uploadDay
          });
          return true;
        } else {
          throw Error("👨🏻‍💻직품을 생성할 수 없습니다. 관리자에게 문의하세요👨🏻‍💻");
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
