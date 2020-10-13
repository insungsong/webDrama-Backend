import { prisma } from "../../../../generated/prisma-client";

const DELETE = "DELETE";
const EDIT = "EDIT";

export default {
  Mutation: {
    editNotification: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);

      const {
        notificationId,
        title,
        text,
        url,
        imgFile,
        s3ImgFile,
        timeCreate,
        timeLimit,
        actions
      } = args;

      const { user } = request;

      try {
        //마스터 계정만 뽑아옴
        const isMasterUser = await prisma.$exists.user({
          AND: [{ id: user.id }, { rank: "master" }]
        });

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
          if (actions === EDIT) {
            await prisma.updateNotification({
              where: { id: notificationId },
              data: {
                title,
                text,
                url,
                imgFile,
                s3ImgFile,
                timeCreate,
                timeLimit
              }
            });
            return true;
          } else if (actions === DELETE) {
            await prisma.deleteNotification({ id: notificationId });

            return true;
          } else {
            throw Error("😩개발자들 일 터졌다. 일 시작하자");
          }
        } else {
          await prisma.updateNotification({
            notificationId,
            data: { users: { disconnect: { id: user.id } } }
          });
          return true;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
