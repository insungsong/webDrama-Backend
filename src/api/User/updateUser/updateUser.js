import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    updateUser: async (_, args) => {
      try {
        const {
          username,
          birthyear,
          birthday,
          password,
          nickname,
          nEvent
        } = args;

        const user = await prisma.user({ id: user.id });
        console.log(user);

        return true;
      } catch (e) {
        console.log(e);
      }
    }
  }
};
