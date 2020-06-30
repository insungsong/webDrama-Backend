import { prisma } from "../../../../../generated/prisma-client";

export default {
  Mutation: {
    uploadWatchedEpisode: async (_, args, { request }) => {
      const { user } = request;
      const { episodeId } = args;

      const findEpisode = await prisma.episode({ id: episodeId });

      try {
        if (user) {
          //유저의 필드에 최근본 목록을 넣는 작업
          const watchedUser = await prisma.updateUser({
            where: { id: user.id },
            data: {
              watchedEpisode: { set: episodeId }
            }
          });

          //현재 유저의 최근본 목록을 전부 가져오기
          const currentUserWatchedEpisodeArr = await prisma
            .user({ id: user.id })
            .watchedEpisode();

          //현재 회원의 최근 본 목록이 일정 길이 이상일때 이전에 본 최근목록 삭제
          if (currentUserWatchedEpisodeArr.length > 2) {
            const lastUserWatchedEpisode = currentUserWatchedEpisodeArr[0];

            await prisma.updateUser({
              where: {
                id: user.id
              },
              data: {
                watchedEpisode: {
                  disconnect: { id: lastUserWatchedEpisode.id }
                }
              }
            });
          }
        }

        //에피소드의 조회수를 올리는 작업
        //hitCount가 0이면 1부터 올려준다.
        if (findEpisode.hitCount === 0 || findEpisode.hitCount === undefined) {
          const episodeHitCount = await prisma.updateEpisode({
            where: { id: episodeId },
            data: {
              hitCount: 1
            }
          });
        } else {
          //db를 기반으로 조회수가 +1씩 증가
          await prisma.updateEpisode({
            where: { id: episodeId },
            data: {
              hitCount: findEpisode.hitCount + 1
            }
          });
        }
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
