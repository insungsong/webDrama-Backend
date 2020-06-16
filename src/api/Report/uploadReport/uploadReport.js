import { prisma } from "../../../../generated/prisma-client";

const SITE_REPORT = "SITE_REPORT";
const COMMENT_REPORT = "COMMENT_REPORT";
const POST_REPORT = "POST_REPORT";

export default {
  Mutation: {
    uploadReport: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);

      const {
        file,
        text,
        offenderId,
        category,
        categoryValue,
        episodeId
      } = args;
      const { user } = request;

      try {
        if (user) {
          if (category === SITE_REPORT) {
            await prisma.createReport({
              user: {
                connect: {
                  id: user.id
                }
              },
              category,
              categoryValue,
              file,
              text,
              status: "CHECKING"
            });
            return true;
          } else if (category === COMMENT_REPORT) {
            //TO DO : offenderId만으로 episode와 연결 없이 신고를 만들었는데 지금은 offenderId로만 연결하는 상태

            await prisma.createReport({
              user: {
                connect: {
                  id: user.id
                }
              },
              offender: {
                connect: {
                  id: offenderId
                }
              },
              category,
              categoryValue,
              file,
              text,
              status: "CHECKING"
            });
            return true;
          } else if (category === POST_REPORT) {
            await prisma.createReport({
              user: {
                connect: {
                  id: user.id
                }
              },
              episode: {
                connect: {
                  id: episodeId
                }
              },
              category,
              categoryValue,
              file,
              text,
              status: "CHECKING"
            });

            return true;
          }
        } else {
          throw Error("해당 부분을 신고할 수 없습니다. 문의부탁드립니다.😓");
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
