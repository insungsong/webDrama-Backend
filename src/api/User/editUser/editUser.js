import { prisma } from "../../../../generated/prisma-client";
import { isAuthenticated } from "../../../middlewares";

const EDIT = "EDIT";
const DELETE = "DELETE";

export default {
  Mutation: {
    editUser: async (_, args, { request }) => {
      isAuthenticated(request);
      const { user } = request;
      try {
        const {
          username,
          birthyear,
          birthday,
          password,
          nickname,
          nEvent,
          actions
        } = args;

        if (actions === EDIT) {
          await prisma.updateUser({
            where: { id: user.id },
            data: {
              username,
              birthyear,
              birthday,
              password,
              nickname,
              nEvent
            }
          });
        } else {
          await prisma.deleteUser({
            id: user.id
          });
        }
        return true;
      } catch (e) {
        console.log(e);
      }
    }
  }
};
