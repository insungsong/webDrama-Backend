import { prisma } from "../../../generated/prisma-client";

export default {
  Query: {
    search: async (_, args) => {
      const { term } = args;

      try {
        const posts = await prisma.posts({
          where: {
            OR: [
              { title_contains: term },
              { teamName: { teamName_contains: term } }
            ]
          }
        });
        return posts;
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }
};
