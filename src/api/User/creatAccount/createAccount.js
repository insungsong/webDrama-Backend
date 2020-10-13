import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    isExistKeepUser: async (_, args) => {
      const { email } = args;
      console.log(email);
      const isExist = await prisma.keepUser({ email });
      if (isExist) {
        return true;
      } else {
        return false;
      }
    }
  },
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

        //유저 정보를 저장할 keepUser를 만든다.
        await prisma.createKeepUser({
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
    }
  }
};
