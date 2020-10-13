import { prisma } from "../../../../generated/prisma-client";
import { isAuthenticated } from "../../../middlewares";

export default {
  Query: {
    searchFindUser: async (_, args, { request }) => {
      isAuthenticated(request);
      const { props } = args;

      if (props) {
        const currentUser = await prisma.users({
          where: {
            OR: [{ email_contains: props }, { username_contains: props }]
          }
        });
        console.log(currentUser);
        return currentUser;
      } else {
        return null;
      }
    }
  }
};
