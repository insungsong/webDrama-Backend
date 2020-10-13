import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    findEpisodeReportCategory: async (
      _,
      args,
      { request, isAuthenticated }
    ) => {
      isAuthenticated(request);
      const { category } = args;
      try {
        const findEpisodeReportCategoryList = await prisma.reportCategories({
          where: { category }
        });

        return findEpisodeReportCategoryList;
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }
};
