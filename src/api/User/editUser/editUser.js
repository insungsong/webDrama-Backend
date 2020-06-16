import { prisma } from "../../../../generated/prisma-client";
import { isAuthenticated } from "../../../middlewares";

export default {
  Mutation: {
    editUser: async (_, args, { request }) => {
      isAuthenticated(request);
      const { user } = request;
      try {
        const {
          username,
          birthyear,
          birthday,
          password,
          nickname,
          nEvent
        } = args;

        await prisma.updateUser({
          where: { id: user.id },
          data: {
            username,
            birthyear,
            birthday,
            password,
            nickname,
            nEvent
          }
        });

        return true;
      } catch (e) {
        console.log(e);
      }
    }
  }
};
