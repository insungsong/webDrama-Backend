import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    //순서바꿀때는 순서만 바꾸기
    arrEditBanner: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { id } = args;
      const { user } = request;

      //마스터 계정인지 확인
      const isMasterUser = await prisma.$exists.user({
        AND: [{ id: user.id }, { rank: "master" }]
      });

      try {
        if (isMasterUser) {
          let orderByNumber = 0;
          id.map(async (value) => {
            orderByNumber++;
            await prisma.updateBanner({
              where: { id: value },
              data: {
                orderBy: orderByNumber
              }
            });
          });

          return true;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    //정보 바꿀떄는 정보만 바꾸기
    oneEditBanner: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { id, image, url, upload, uploadTime, downTime } = args;
      const { user } = request;

      //마스터 계정인지 확인
      const isMasterUser = await prisma.$exists.user({
        AND: [{ id: user.id }, { rank: "master" }]
      });

      try {
        if (isMasterUser) {
          await prisma.updateBanner({
            where: { id },
            data: {
              image,
              url,
              upload,
              uploadTime,
              downTime
            }
          });
        }
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
