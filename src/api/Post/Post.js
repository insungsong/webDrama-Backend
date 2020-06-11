import { prisma } from "../../../generated/prisma-client";

export default {
  Post: {
    teamName: async (_, __, { request }) => {
      console.log(request);
      const { user } = request;
      return prisma.user({ id: user.id }).user();
    }
  }
};
