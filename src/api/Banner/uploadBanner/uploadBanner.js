import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    uploadBanner: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);

      const {
        image,
        url,
        upload,
        orderBy,
        uploadTime = new Date(),
        downTime = new Date()
      } = args;
      const { user } = request;

      //마스터 계정인지 확인
      const isMasterUser = await prisma.$exists.user({
        AND: [{ id: user.id }, { rank: "master" }]
      });

      try {
        if (isMasterUser) {
          const bannerArr = await prisma.banners();

          //배열안에 가장 마지막 요소의 orderBy를 구하라
          //가장 큰 orderBy값을 받기위한 변수 box
          var biggerOrderBy;
          if (bannerArr !== null) {
            bannerArr.map((value) => {
              biggerOrderBy = value.orderBy;
              if (biggerOrderBy < value.orderBy) {
                biggerOrderBy = value.orderBy;
              }
            });

            console.log(biggerOrderBy);

            const inputOrderByNumber = biggerOrderBy + 1;
            console.log(inputOrderByNumber);

            var orderByData = orderBy;
            if (orderBy === undefined) {
              orderByData = inputOrderByNumber;
            }

            const newBanner = await prisma.createBanner({
              upload,
              url,
              orderBy: orderByData,
              image,
              uploadTime,
              downTime
            });

            console.log(newBanner);
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
