import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    searchNotification: async (_, __, { request }) => {
      try {
        const searchNotification = await prisma.notifications();
        return searchNotification;
      } catch (e) {
        return null;
      }
    },
    oneItemNotification: async (_, args, { request }) => {
      const { props } = args;

      if (props) {
        const oneItemNotification = await prisma.notifications({
          where: { OR: [{ id_contains: props }, { title_contains: props }] }
        });

        return oneItemNotification;
      } else {
        return null;
      }
    }
  }
};
