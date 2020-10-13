import { prisma } from "../../../../generated/prisma-client";
import { isAuthenticated } from "../../../middlewares";

export default {
  Query: {
    findUsers: async (_, __, { request }) => {
      isAuthenticated(request);

      const { user } = request;
      if (user && user.rank === "master") {
        const users = await prisma.users();

        return users;
      } else {
        throw Error("해당 유저는 관리자가 아닙니다.");
      }
    }
  }
};
