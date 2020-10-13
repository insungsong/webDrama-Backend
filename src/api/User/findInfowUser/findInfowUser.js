import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    inflowFindUser: async (_, args) => {
      const { email } = args;
      console.log(email);

      try {
        const user = await prisma.user({ email });

        return user;
      } catch (e) {
        return null;
      }
    }
  }
};
