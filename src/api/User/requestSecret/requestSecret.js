import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    requestSecret: async (_, args) => {
      const { email } = args;
      //TO DO
      //front-end단에서 이메일 정규식을 잘 거쳐서 들어왔다는 가정하에 진행

      const exist = await prisma.user({ email });
      if (exist) {
        throw Error(
          "해당 email은 존재하는 이메일입니다. 다른 이메일의 사용을 부탁드립니다."
        );
      }

      try {
        const emailCheck = await prisma.secrets({ where: { email } });

        if (emailCheck) {
          const box = await prisma.deleteManySecrets({ email });
          console.log("box", box);
        }
      } catch (e) {
        console.log("Asdasd", e);
      }

      try {
        //1.secretKey create
        const secretKey = Math.floor(Math.random() * 1000000);

        //2.prisma db create type Secret => secretkey create한것을 Secret Type filed secretCode input

        if (secretKey) {
          await prisma.createSecret({
            secretCode: secretKey,
            email
          });
          return true;
        } else {
          throw Error("weberyday 관리자 측에 문의 바랍니다.");
        }
      } catch (e) {
        console.log(e);
        return false;
      }
      //3. sendGrid를 통해 해당 클라이언트 이메일에 secretCode sending

      //4. cofirmRequestSecret.js에서 클라이언트에보낸 secretKey db검증

      //5.회원가입 폼으로 이동(front-end)
    }
  }
};
