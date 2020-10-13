import { prisma } from "../../../../generated/prisma-client";
import { isAuthenticated } from "../../../middlewares";
import moment from "moment";

export default {
  Query: {
    allStopWatch: async (_, args, { request }) => {
      isAuthenticated(request);
      const { user } = request;

      if (user && user.rank === "master") {
        const allStopWatchUser = await prisma.users({
          where: {
            status: "STOP"
          }
        });

        return allStopWatchUser;
      }
    },
    searchStopWatch: async (_, args, { request }) => {
      isAuthenticated(request);

      const { user } = request;

      if (user && user.rank === "master") {
        const midnightTodayStopWatchUser = await prisma.users({
          where: {
            AND: [
              { status: "STOP" },
              {
                stopWatch: moment().format("YYYY-MM-DD")
              }
            ]
          }
        });

        return midnightTodayStopWatchUser;
      }
    }
  },
  Mutation: {
    userStatusUpdate: async (_, args, { request }) => {
      isAuthenticated(request);

      const { user } = request;
      const { date } = args;

      if (user && user.rank === "master") {
        await prisma.updateManyUsers({
          where: {
            AND: [{ status: "STOP" }, { stopWatch: date }]
          },
          data: {
            status: "ALIVE",
            stopWatch: ""
          }
        });

        return true;
      } else {
        throw Error("유저의 status값을 일괄처리 할 수 없습니다.");
      }
    },
    userOfOneStatusUpdate: async (_, args, { request }) => {
      const { user } = request;
      const { id } = args;
      if (user && user.rank === "master") {
        await prisma.updateUser({
          where: { email: id },
          data: { status: "ALIVE" }
        });
        return true;
      } else {
        throw Error("한명의 유저의 status값을 update할 수 없습니다.");
      }
    }
  }
};
