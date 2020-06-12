import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    editReport: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { reportId, status } = args;
      const { user } = request;

      //마스터 계정인지 확인
      const isMasterUser = await prisma.$exists.user({
        AND: [{ id: user.id }, { rank: "master" }]
      });

      try {
        if (isMasterUser) {
          await prisma.updateReport({
            where: { id: reportId },
            data: {
              status
            }
          });
          return true;
        } else {
          throw Error("개발자야 일하자🥵");
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
