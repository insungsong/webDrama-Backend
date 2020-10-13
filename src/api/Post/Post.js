import { prisma } from "../../../generated/prisma-client";

export default {
  Post: {
    teamName: async (_, __, { request }) => {
      //이것이 나의 작품일수도 다른 사람의 작품일 수도 있는 code
      const postId = await prisma.post({ id: _.id }).teamName();

      const { user } = request;
      try {
        if (user.email === postId.email) {
          return prisma.user({ id: user.id });
        } else {
          return postId;
        }
      } catch (e) {
        return postId;
      }
    },
    likes: async (parent) => {
      const { id } = parent;
      return prisma.post({ id }).likes();
    },
    episodes: async (parent) => {
      const { id } = parent;
      return prisma.post({ id }).episodes();
    },
    category: async (parent) => {
      const { id } = parent;
      return prisma.post({ id }).category();
    },
    subscriber: async (parent) => {
      const { id } = parent;
      return prisma.post({ id }).subscriber();
    }
  }
};
