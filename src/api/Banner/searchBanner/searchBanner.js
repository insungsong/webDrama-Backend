import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    allBanner: async (_, __) => {
      try {
        const allBanner = await prisma.banners();
        return allBanner;
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }
};
