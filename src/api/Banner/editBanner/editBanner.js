import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    arrEditBanner: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { id, image, url, upload, orderBy, uploadTime, downTime } = args;
      const { user } = request;

      console.log(id);

      //마스터 계정인지 확인
      const isMasterUser = await prisma.$exists.user({
        AND: [{ id: user.id }, { rank: "master" }]
      });

      try {
        if (isMasterUser) {
          var orderByNumber = 1;
          try {
            var idArr = id.map(async (value) => {
              await prisma.updateBanner({
                where: { id: value },
                data: {
                  image,
                  url,
                  upload,
                  orderBy: orderByNumber
                }
              });
              orderByNumber++;
            });
            console.log("idArr", idArr);
          } catch (e) {
            console.log("-------");
            console.log(e);
          }

          const editBanner = await prisma.updateBanner({
            where: { id },
            data: {
              image,
              url,
              upload,
              orderBy,
              uploadTime,
              downTime
            }
          });
          console.log(editBanner);
          return true;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
