import { prisma } from "../../../../generated/prisma-client";
import { generateToken } from "../../../utils";

export default {
  Mutation: {
    naverEmailInTheUserInfomation: async (_, args) => {
      const { email } = args;
      const exist = await prisma.user({ email });
      const inflow = "naver";
      const certification = false;
      const nEvent = false;
      const rank = "user";
      const birthday = "";
      const isExist = await prisma.keepUser({ email });

      if (exist) {
        if (exist.inflow === "weberyday") {
          throw Error(
            "해당 Naver의 Email은 다른 계정 로그인용 이메일로 사용중입니다.",
            "네이버로그인을 제외한 다른 로그인 기능을 사용해주시길 바랍니다."
          );
        } else if (exist.inflow === "naver") {
          //네이버 로그인을 시켜줘야함 즉 token을 생성해야함
          const token = await generateToken(exist.id);
          console.log(token);
          return token;
        }
      } else if (!exist && isExist) {
        throw Error(
          "해당 계정은 탈퇴를 진행한 이메일로 새로운 이메일을 통해",
          "웨브리데이 로그인을 이용해주시길 바랍니다."
        );
      } else {
        await prisma.createUser({
          email,
          inflow,
          certification,
          nEvent,
          rank,
          birthday
        });

        //keepUser도 생성
        await prisma.createKeepUser({
          email,
          inflow,
          certification,
          nEvent,
          rank,
          birthday
        });
        const user = await prisma.user({ email });
        const token = await generateToken(user.id);
        return token;
      }
    }
  }
};
