import { prisma } from "../../../../generated/prisma-client";

//이메일이랑 시크릿코드가 같은 사람이 인증을 하는 부분
export default {
  Query: {
    confirmRequestSecret: async (_, args) => {
      try {
        const { email, secretCode } = args;
        const checkSecret = await prisma.$exists.secret({
          AND: [{ email }, { secretCode }]
        });

        if (checkSecret) {
          return true;
        } else {
          throw Error(
            "해당 시크릿코드 값이 올바르지 않습니다. 재확인 부탁드립니다."
          );
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
