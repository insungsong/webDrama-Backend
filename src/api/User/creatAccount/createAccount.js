import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    createAccount: async (_, args) => {
      const {
        email,
        username,
        inflow = "weberyday",
        ageRange,
        birthyear,
        birthday,
        certification = false,
        password,
        nickname,
        gender,
        nEvent,
        status = "connect",
        rank = "user"
      } = args;

      const user = await prisma.createUser({
        email,
        username,
        inflow,
        ageRange,
        birthyear,
        birthday,
        certification,
        password,
        nickname,
        gender,
        nEvent,
        status,
        rank
      });
      console.log(user);
      return user;
    }
  }
};
