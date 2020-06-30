import { prisma } from "../../../../generated/prisma-client";

//TO DO
//1. 본인인증 API를 도입
export default {
  Query: {
    //작품을 올리기위한 작가인증 3단계중, 팀명 업데이트
    searchTeamname: async (_, args) => {
      const { teamName } = args;
      try {
        const checkTeamname = await prisma.users({
          where: { teamName }
        });

        if (checkTeamname.length === 0) {
          throw Error("사용가능한 팀명입니다😇");
        } else {
          throw Error("중복된 팀명입니다😭");
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  },
  Mutation: {
    //본인 인증 API에서 인증후 넘겨주는 값에따라 해당 코드는 유동적임
    uploadTeamname: async (_, args, { request }) => {
      const { teamName } = args;
      const { user } = request;
      try {
        await prisma.updateUser({
          where: { id: user.id },
          data: {
            teamName,
            certification: true
          }
        });
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
