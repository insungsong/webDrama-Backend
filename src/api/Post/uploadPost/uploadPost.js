import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    uploadPost: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const {
        title,
        description,
        thumbnail,
        backgroundImage,
        category,
        broadcast,
        uploadDay,
        s3ThumbnailId,
        s3BackgroundImageId
      } = args;

      const { user } = request;

      //const objectCategory = new Object();

      //category로 부터 받아온 [value, value...]을 prisma에 connect하는 형식에 맞게 포장하는 코드
      //var createCategoryArr = new Array();

      // if (category !== undefined) {
      //   category.map((value) => {
      //     var createCategoryObj = new Object();

      //     createCategoryObj.id = value;
      //     createCategoryArr.push(createCategoryObj);
      //   });
      // }

      try {
        if (user && user.certification) {
          const currentPost = await prisma.createPost({
            teamName: {
              connect: {
                id: user.id
              }
            },
            title,
            description,
            thumbnail,
            backgroundImage,
            s3ThumbnailId,
            s3BackgroundImageId,
            category: {
              connect: { id: category }
            },
            broadcast,
            uploadDay: { set: uploadDay }
          });

          //keepPost만들기
          //const postId = currentPost.id;
          // await prisma.createKeepPost({
          //   teamName: {
          //     connect: {
          //       email: user.email
          //     }
          //   },
          //   title,
          //   description,
          //   thumbnail,
          // backgroundImage,
          //   broadcast,
          //   postId,
          //   uploadDay: { set: uploadDay }
          // });
          return true;
        } else if (!user) {
          throw Error(
            "😞로그인 정보가 없습니다. 로그인 후 해당기능을 이용해주세요"
          );
        } else if (user.certification === false) {
          throw Error("😃작가 인증을 등록해주세요!");
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
