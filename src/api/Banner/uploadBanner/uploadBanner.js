import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    uploadBanner: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);

      const { image, url, upload, uploadTime, downTime, s3ThumbnailId } = args;
      const { user } = request;
      console.log(args);
      //마스터 계정인지 확인
      const isMasterUser = await prisma.$exists.user({
        AND: [{ id: user.id }, { rank: "master" }]
      });

      try {
        if (isMasterUser) {
          const bannerArr = await prisma.banners();

          //배열안에 가장 마지막 요소의 orderBy를 구하라
          //가장 큰 orderBy값을 받기위한 변수 box

          //배너 Type에 아무것도 생성되지 않았을 경우
          if (bannerArr.length === 0) {
            await prisma.createBanner({
              upload,
              url,
              orderBy: 1,
              image,
              s3ThumbnailId,
              uploadTime,
              downTime
            });

            //배너 Type에 하나이상의 creat가 존재할때
          } else if (bannerArr.length !== 0) {
            var biggerOrderBy;
            bannerArr.map((value) => {
              biggerOrderBy = value.orderBy;
              if (biggerOrderBy < value.orderBy) {
                biggerOrderBy = value.orderBy;
              }
            });

            const inputOrderByNumber = biggerOrderBy + 1;

            const newBanner = await prisma.createBanner({
              upload,
              url,
              orderBy: inputOrderByNumber,
              image,
              s3ThumbnailId,
              uploadTime,
              downTime
            });
          }
          return true;
        } else {
          throw Error("🐜순서 제대로 넣으세요😡");
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};