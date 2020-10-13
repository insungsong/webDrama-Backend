import { prisma } from "../../../../generated/prisma-client";
import { generateToken } from "../../../utils";

export default {
  Mutation: {
    //로그인 할때 토큰을 생성하는 코드
    signIn: async (_, args) => {
      try {
        const { email, password } = args;
        const user = await prisma.user({ email });

        console.log(user);

        if (user.password === password) {
          const token = await generateToken(user.id);
          return token;
        } else {
          throw Error(
            "해당 계정의 아이디 또는 패스워드가 일치하지 않습니다. 확인부탁드립니다."
          );
        }
      } catch (e) {
        console.log(e);
        return "";
      }
    },
    adminSignIn: async (_, args) => {
      try {
        const { email, password } = args;
        const user = await prisma.user({ email });

        if (user.password === password && user.rank === "master") {
          const token = await generateToken(user.id);
          return token;
        } else {
          throw Error(
            "해당 계정의 아이디 또는 패스워드가 일치하지 않습니다. 확인부탁드립니다."
          );
        }
      } catch (e) {
        console.log(e);
        return "";
      }
    }
  }
};
