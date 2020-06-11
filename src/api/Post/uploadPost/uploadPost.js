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

      //category로 부터 받아온 [value, value...]을 prisma에 connect하는 형식에 맞게 포장하는 코드
      var createCategoryArr = new Array();

      category.map((value) => {
        var createCategoryObj = new Object();

        createCategoryObj.id = value;
        createCategoryArr.push(createCategoryObj);
      });

      try {
        if (user) {
          await prisma.createPost({
            teamName: {
              connect: {
                id: user.id
              }
            },
            title,
            description,
            thumnail,
            category: {
              connect: createCategoryArr
            },
            broadcast,
            uploadDay: { set: uploadDay }
          });
          return true;
        } else if (!user) {
          throw Error(
            "😞로그인 정보가 없습니다. 로그인 후 해당기능을 이용해주세요"
          );
        } else {
          throw Error(
            "👨🏻 💻직품을 생성할 수 없습니다. 관리자에게 문의하세요👨🏻 💻"
          );
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
