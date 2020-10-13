import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    uploadNotification: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { title, text, url, imgFile, s3ImgFile } = args;
      const { user } = request;

      try {
        //마스터 계정만 뽑아옴
        const isMasterUser = await prisma.$exists.user({
          AND: [{ id: user.id }, { rank: "master" }]
        });

        if (!isMasterUser) {
          throw Error("해당 계정은 관리자 계정이 아닙니다.");
        }

        //회원들을 정보를 다 가지고옴
        const users = await prisma.users();

        //category로 부터 받아온 [value, value...]을 prisma에 connect하는 형식에 맞게 포장하는 코드
        var createNotificationArr = new Array();

        users.map((value) => {
          var createNotificationObj = new Object();

          createNotificationObj.id = value.id;
          createNotificationArr.push(createNotificationObj);
        });

        if (isMasterUser) {
          if (title === "" || text === "") {
            throw Error("title또는Text를 입력하셔야합니다.");
          }
          await prisma.createNotification({
            title,
            text,
            url,
            imgFile,
            s3ImgFile,
            users: { connect: createNotificationArr }
            // timeCreate,
            // timeLimit
          });
        } else {
          throw Error("해당 계정은 관리자 계정이 아닙니다.");
        }
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
