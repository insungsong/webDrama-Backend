import { prisma } from "../../../../generated/prisma-client";
import { isAuthenticated } from "../../../middlewares";

const EDIT = "EDIT";
const DELETE = "DELETE";

export default {
  Query: {
    findUser: async (_, args, { request }) => {
      isAuthenticated(request);
      const { user } = request;

      try {
        const { password } = args;

        const userInfo = await prisma.users({
          where: { email: user.email, password }
        });

        return userInfo[0];
      } catch (e) {
        console.log(e);
        return null;
      }
    },
    findUserInfo: async (_, __, { request }) => {
      isAuthenticated(request);
      try {
        const { user } = request;

        const userInfo = await prisma.user({
          email: user.email
        });
        return userInfo;
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  },
  Mutation: {
    editUser: async (_, args, { request }) => {
      isAuthenticated(request);
      const { user } = request;

      try {
        const {
          username,
          birthday,
          gender,
          password,
          nickname,
          nEvent,
          agreePrivacy,
          actions,
          email,
          signOutReason
        } = args;

        if (actions === EDIT) {
          await prisma.updateUser({
            where: { id: user.id },
            data: {
              username,
              birthday,
              gender,
              password,
              nickname,
              agreePrivacy,
              nEvent
            }
          });

          // await prisma.updateKeepUser({
          //   where: { email: user.email },
          //   data: {
          //     username,
          //     birthday,
          //     password,
          //     nickname,
          //     agreePrivacy,
          //     nEvent
          //   }
          // });
          return true;
        } else {
          await prisma.deleteUser({
            id: user.id
          });

          await prisma.updateKeepUser({
            data: {
              signOutReason
            },
            where: { email }
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
