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

      const exist = await prisma.user({ email });

      if (exist) {
        throw Error(
          "해당 email은 존재하는 이메일입니다. 다른 이메일의 사용을 부탁드립니다."
        );
      }

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
