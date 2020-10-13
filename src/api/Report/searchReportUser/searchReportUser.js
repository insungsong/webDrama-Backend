import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    searchReportUser: async (_, args, { request }) => {
      const { props } = args;
      const { user } = request;

      if (user && user.rank === "master") {
        const checkedFindReports = await prisma.reports({
          where: {
            OR: [{ email_contains: props }, { id_contains: props }]
          }
        });
        return checkedFindReports;
      } else {
        throw Error("해당 유저는 관리자가 아닙니다.");
      }
    }
  }
};
