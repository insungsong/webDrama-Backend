import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    //전체 포스트 가져오기
    allPost: async (_, __) => {
      try {
        const allPost = await prisma.posts();

        return allPost;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
    //특정 작품에 들어갈때
    oneOfPost: async (_, args) => {
      const { id } = args;
      try {
        const oneOfPost = await prisma.posts({ where: { id } });
        return oneOfPost[0];
      } catch (e) {
        console.log(e);
        return null;
      }
    },

    guestOneOfPost: async (_, args) => {
      const { id } = args;
      try {
        const guestOneOfPost = await prisma.posts({ where: { id } });

        return guestOneOfPost[0];
      } catch (e) {
        console.log(e);
        return null;
      }
    },

    //특정 작가명 또는 작품명을 통해 작품을 찾을때
    searchPost: async (_, args) => {
      const { term } = args;
      if (term !== "") {
        try {
          const searchPost = await prisma.posts({
            where: {
              OR: [
                { teamName: { teamName_contains: term } },
                { title_contains: term }
              ]
            }
          });
          return searchPost;
        } catch (e) {
          console.log(e);
          return null;
        }
      }
    }
  }
};
