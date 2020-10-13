import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    findSubscriptionPost: async (_, __, { request, isAuthenticated }) => {
      isAuthenticated(request);

      const { user } = request;

      try {
        const mySubscriptionPostList = await prisma
          .user({ id: user.id })
          .subscription();

        console.log("ss", mySubscriptionPostList);
        return mySubscriptionPostList;
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }
};
