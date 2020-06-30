import { prisma } from "../../../../generated/prisma-client";
import { sendSecretMail } from "../../../utils";

export default {
  Mutation: {
    //인증된 이메일에 발송되는 SecretCode
    requestSecret: async (_, args) => {
      const secretKey = Math.floor(Math.random() * 1000000);
      const strSecretKey = String(secretKey);
      const { email } = args;
      //TO DO
      //front-end단에서 이메일 정규식을 잘 거쳐서 들어왔다는 가정하에 진행

      //db상에서 email이 있는지 첫번째로 확인
      const exist = await prisma.user({ email });
      if (exist) {
        throw Error(
          "해당 email은 존재하는 이메일입니다. 다른 이메일의 사용을 부탁드립니다."
        );
      }

      //secret Type Filed에 email이 있는지 확인하는작업
      //1번 발송한 이후에 생길수 있는 try catch문 (예외 상황)
      try {
        const emailCheck = await prisma.secrets({ where: { email } });

        if (emailCheck.length !== 0) {
          await prisma.deleteManySecrets({
            OR: [
              { email: emailCheck[0].email },
              { AND: [{ email: null }, { user: null }] }
            ]
          });
        }
      } catch (e) {
        console.log(e);
      }

      //secret Type Filed에 이메일이 없는지 확인이 되었다면, creatSecret을 실행함
      try {
        if (strSecretKey) {
          //secretKey(랜덤의 6자리 숫자)이 Fun은 (utils.js)에 존재

          await prisma.createSecret({
            secretCode: strSecretKey,
            email //클라이언트가 입력한 email
          });

          // prisma.createSecret을 진행하고 나서, 해당 email을 가진 사람에게 sendGrid를 보냄
          await sendSecretMail(email, secretKey);
          return true;
        } else {
          throw Error("weberyday 관리자 측에 문의 바랍니다.");
        }
      } catch (e) {
        console.log(e);
        return false;
      }

      //3. sendGrid를 통해 해당 클라이언트 이메일에 secretCode sending => utils.js에 구현됨

      //4. cofirmSecret.js에서 클라이언트에보낸 secretKey db검증

      //5.회원가입 폼으로 이동(front-end)
    }
  }
};
