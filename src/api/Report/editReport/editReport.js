import { prisma } from "../../../../generated/prisma-client";
import {
  filterExtensionDefinitions,
  typeContainsSelectionSet
} from "graphql-tools";

const CHECKING = "CHECKING";
const CHECKED = "CHECKED";
const COMMENT_WARNING = "COMMENT_WARNING";
const POST_WARNING = "POST_WARNING";
const COMMENT_BLACK_LIST = "COMMENT_BLACK_LIST";
const POST_BLACK_LIST = "POST_BLACK_LIST";

//TO DO
//1.status 상태값 추가(=> Post_STOP, COMMENT_STOP, ALL_STOP, nomar_STATE)
//2.달력 API를 사용하여, 현재는 new Data로 되어있는것을 미래의 시간으로 저장시키는 것
//3.예약시간과 지정해놓은 시간이 맞닿을때 또는 넘었을때 user의 status 1번 상태값중 하나로 변경시키는 일

export default {
  Mutation: {
    editReport: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { reportId, offenderId, episodeId, status } = args;

      const { user } = request;

      //마스터 계정인지 확인
      const isMasterUser = await prisma.$exists.user({
        AND: [{ id: user.id }, { rank: "master" }]
      });

      try {
        if (isMasterUser) {
          await prisma.updateReport({
            where: { id: reportId },
            data: {
              status
            }
          });

          //신고처리를 완료하고 난후 해야할 일
          //신고처리를 확정당한 offender의 id를 추적해서, 그 id의 report필드중에서 comment_waring or comment_warning이 3개 이상인지 확인하는 작업
          //back_list가 1개이상있는지 확인해서
          //그것에 맞는 상태값 전환이 필요함
          if (status !== CHECKED) {
            if (status === COMMENT_WARNING) {
              //댓글 신고당한 사람을 댓글 id를 가지고 찾는 작업
              const offender = await prisma.users({
                where: { comments_some: { id: offenderId } }
              });

              //댓글 작성자인 offender를 가지고 신고건들을 가지고옴
              const reportListOfOffender = await prisma.reports({
                where: { offender: { user: { id: offender[0].id } } }
              });

              let newArr = [];
              reportListOfOffender.map((filter) => {
                if (filter.status === COMMENT_WARNING) {
                  newArr.push(filter.status);
                }
              });

              if (newArr.length >= 3) {
                await prisma.updateUser({
                  where: { id: offender[0].id },
                  data: {
                    status: "COMMENT_STOP",
                    //new Date()부분을 미래에 달력 api로 대체해야함
                    commentWriteTimer: JSON.stringify(new Date())
                  }
                });
              }
            } else if (status === POST_WARNING) {
              //해당 포스트를 올린 신고팀
              const offenderTeam = await prisma.users({
                where: { posts_some: { episodes_some: { id: episodeId } } }
              });

              //해당 신고당한 팀의 에피소드를 찾는 코드
              const reportListOfOffenderTeam = await prisma.reports({
                where: { episode: { id: episodeId } }
              });

              let newArr = [];
              reportListOfOffenderTeam.map((filter) => {
                if (filter.status === POST_WARNING) {
                  newArr.push(filter.status);
                }
              });

              if (newArr.length >= 3) {
                await prisma.updateUser({
                  where: {
                    id: offenderTeam[0].id
                  },
                  data: {
                    status: "POST_STOP",
                    postWriteTimer: JSON.stringify(new Date())
                  }
                });
              }
            } else if (status === COMMENT_BLACK_LIST) {
              const user = await prisma.users({
                where: { comments_some: { id: offenderId } }
              });

              await prisma.updateUser({
                where: { id: user[0].id },
                data: {
                  status: "COMMENT_STOP",
                  commentWriteTimer: JSON.stringify(new Date())
                }
              });
            } else if (status === POST_BLACK_LIST) {
              const user = await prisma.users({
                where: { posts_some: { episodes_some: { id: episodeId } } }
              });

              await prisma.updateUser({
                where: { id: user[0].id },
                data: {
                  status: "POST_STOP",
                  postWriteTimer: JSON.stringify(new Date())
                }
              });
            }
          }
          return true;
        } else {
          throw Error("개발자야 일하자🥵");
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
