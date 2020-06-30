import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    //해당 User가 이 해당에피소드를 한번이상 보고 나갔다가 다시 들어와서 보다가 다시 나갔을때 일어나는 일
    editViewedEpisodeRecord: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { episodeId, viewTime } = args;

      try {
        if (user) {
          //
          const userViewedEpisodes = await prisma
            .user({ id: user.id })
            .viewedEpisode({ where: { episode: { id: episodeId } } });
          console.log(userViewedEpisodes);

          //해당 에피소드의 영상의 시간을 가져옴
          const endTimeOfcurrentEpisode = await prisma
            .episode({
              id: episodeId
            })
            .endTime();

          if (userViewedEpisodes[0].viewTime === endTimeOfcurrentEpisode) {
            throw Error("해당 유저는 해당 비디오 시청을 완료하였습니다.😄");
          } else {
            await prisma.updateViewedEpisodeRecord({
              where: { id: userViewedEpisodes[0].id },
              data: {
                viewTime
              }
            });
          }
        }
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
