import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    findReport: async (_, __, { request, isAuthenticated }) => {
      const { user } = request;

      if (user && user.rank === "master") {
        const reports = await prisma.reports({ where: { status: "CHECKING" } });
        return reports;
      } else {
        throw Error("해당 유저는 관리자가 아닙니다.");
      }
    },
    checkedFindReport: async (_, __, { request }) => {
      const { user } = request;
      if (user && user.rank === "master") {
        const checkedReports = await prisma.reports({
          where: { status: "CHECKED" }
        });
        return checkedReports;
      } else {
        throw Error("해당 유저는 관리자가 아닙니다.");
      }
    }
  }
};
