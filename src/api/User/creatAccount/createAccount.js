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
        nEvent = false,
        status = "CONNECT",
        rank = "user",
        agreePrivacy = false
      } = args;

      try {
        await prisma.createUser({
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
          rank,
          agreePrivacy
        });
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
      // const keepUser = await prisma.createKeepUser({
      //   email,
      //   username,
      //   inflow,
      //   ageRange,
      //   birthyear,
      //   birthday,
      //   certification,
      //   password,
      //   nickname,
      //   gender,
      //   nEvent,
      //   status,
      //   rank,
      //   agreePrivacy
      // });
    }
  }
};
