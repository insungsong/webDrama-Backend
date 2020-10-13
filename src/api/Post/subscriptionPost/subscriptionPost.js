import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    subscriptionPost: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { postId } = args;

      const { user } = request;

      try {
        //클라이언트가 구독중인지 아닌지를 체크하는 여부 확인
        const checkedSub = await prisma.$exists.user({
          AND: [{ id: user.id }, { subscription_some: { id: postId } }]
        });

        //구독하기를 해놨다가 취소하는 경우
        if (checkedSub) {
          await prisma.updatePost({
            where: { id: postId },
            data: { subscriber: { disconnect: { id: user.id } } }
          });
          return false;
        } else {
          //구독하기를 한 경우
          await prisma.updatePost({
            where: { id: postId },
            data: { subscriber: { connect: { id: user.id } } }
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
