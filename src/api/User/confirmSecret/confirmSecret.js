import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    confirmSecret: async (_, args) => {
      try {
        const { secretCode } = args;
        const checkSecret = await prisma.secrets({
          where: { secretCode }
        });
        if (checkSecret.length != 0) {
          return true;
        } else {
          throw Error(
            "해당 비밀코드는 올바르지 않은 비밀코드입니다. 다시 확인 부탁드립니다."
          );
        }
      } catch (e) {
        return false;
      }
    }
  }
};
