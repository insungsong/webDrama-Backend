import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    findCategory: async (_, __) => {
      const genres = await prisma.categories({
        where: { id_not: "" }
      });

      return genres;
    }
  }
};