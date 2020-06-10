import { prisma } from "../../../../generated/prisma-client";
import { sendSecretMail } from "../../../utils";

export default {
  Query: {
    //클라이언트 입력한 Email이 db상에 존재하는지를 확인하는 Query문
    checkUserEmail: async (_, args) => {
      const { email } = args;
      const userEmail = await prisma.user({ email });
      try {
        if (userEmail) {
          return true;
        } else {
          throw Error("입력하신 이메일은 존재하지 않습니다.");
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  },
  Mutation: {
    //Query문을 통해 존재하는 db를 이메일에 비밀코드를 발송한 후
    //secret Type 필드 한줄이 추가되는 Mutation data

    userSecretKeyUpdate: async (_, args) => {
      const { email } = args;
      const user = await prisma.user({ email });
      try {
        if (user) {
          const secretKey = Math.floor(Math.random() * 1000000);

          var newSecretCode = secretKey; //랜덤 숫자 6자리를 변수에 담음
          console.log(newSecretCode);

          //Type Secret을 생성할때, 필드중 하나인, user의 데이터Type이 User!때문에, user 필드의 리턴값을 User와 연결해야함
          await prisma.createSecret({
            user: {
              connect: {
                //현재 파일에서 Type User를 리턴하는 값이 존재하지 않음. user.id를 Type Secret의 필드인 user와 연결함(연결위치:/Secret/Secret.js)
                id: user.id
              }
            },
            secretCode: newSecretCode
          });
          //SendGrid
          //await sendSecretMail(email, newSecretCode);

          //클라이언트가 비밀코드를 재요청했을때 연결이 끊긴 Secrey Type 한줄 삭제 코드
          await prisma.deleteManySecrets({
            AND: [{ user: null }, { email: null }]
          });

          return true;
        } else {
          throw Error(
            "새로운 비밀코드를 생성하지 못했습니다. 다시 시도해주세요."
          );
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    userPasswordUpdate: async (_, args) => {
      const { email, password } = args;
      const user = await prisma.user({ email });

      try {
        if (user) {
          await prisma.updateUser({
            where: { id: user.id },
            data: {
              password
            }
          });
          return true;
        } else {
          throw Error("🤔비밀번호 변경을 실패했습니다. 다시 시도해주세요.");
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
