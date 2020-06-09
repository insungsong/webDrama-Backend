import { prisma } from "../../../../generated/prisma-client";

//이메일이랑 시크릿코드가 같은 사람이 인증을 하는 부분
export default {
  Query: {
    confirmSecret: async (_, args) => {
      //requestSecret.js에서, 검증을 마치고 여기로 옴
      try {
        //email의 경우 개발자 측에서 이메일을 검증할때 사용한 email정보를 자동 기입해줌
        const { email, secretCode } = args;

        //prisma안에 secret정보들 중에서 email && secretCode가 일치하는 사람을 checkSecret에 담음
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
