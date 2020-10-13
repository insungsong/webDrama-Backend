import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    toggleLike: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { postId, episodeId, commentId } = args;
      const { user } = request;
      //user json에 like타입이 있는지 확인하는 코드
      const userLiked = await prisma.user({ id: user.id });
      console.log(postId, episodeId, commentId);
      //user가 특정 Episode에 좋아요를 해둔것이 있는지 확인하기 위함
      const filterEpisode = {
        AND: [{ user: { id: user.id } }, { episode: { id: episodeId } }]
      };

      const filterPost = {
        AND: [{ user: { id: user.id } }, { post: { id: postId } }]
      };

      const filterComment = {
        AND: [{ user: { id: user.id } }, { comment: { id: commentId } }]
      };

      if (userLiked !== undefined) {
        //user의 Like의 유무
        const episodeLiked = await prisma.$exists.like(filterEpisode);
        const postLiked = await prisma.$exists.like(filterPost);
        const commentLiked = await prisma.$exists.like(filterComment);
        console.log(episodeLiked, postLiked, commentLiked);
        //좋아요한 episode를 다시 누른경우, 즉 좋아요 취소
        if (episodeLiked && episodeId) {
          await prisma.deleteManyLikes(filterEpisode);
          return false;
        }
        //좋아요한 Post 다시 누른경우, 즉 좋아요 취소
        else if (postLiked && postId) {
          await prisma.deleteManyLikes(filterPost);
          return false;
        }
        //comment 좋아요 취소기능
        else if (commentLiked && commentId) {
          await prisma.deleteManyLikes(filterComment);
          return false;
        }
        //좋아요를 안눌러놨다가 누르는 경우
        else if (episodeId) {
          await prisma.createLike({
            user: { connect: { id: user.id } },
            episode: { connect: { id: episodeId } }
          });
          return true;
        } else if (postId) {
          await prisma.createLike({
            user: { connect: { id: user.id } },
            post: { connect: { id: postId } }
          });
          return true;
        }
        //comment에 좋아요를 안해놓아서 좋아요를 누르는 기능
        else if (commentId) {
          await prisma.createLike({
            user: { connect: { id: user.id } },
            comment: {
              connect: {
                id: commentId
              }
            }
          });
          return true;
        }
      }
    }
  }
};
