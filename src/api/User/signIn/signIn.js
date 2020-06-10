import { prisma } from "../../../../generated/prisma-client";
import { generateToken } from "../../../utils";

export default {
  Query: {
    signIn: async (_, args) => {
      try {
        const { email, password } = args;
        const user = await prisma.users({
          where: {
            AND: [{ email }, { password }]
          }
        });

        console.log(user);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
