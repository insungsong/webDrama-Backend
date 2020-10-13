import { prisma } from "../../../../generated/prisma-client";
import { isAuthenticated } from "../../../middlewares";
import moment from "moment";

export default {
  Mutation: {
    reportCountUp: async (_, args, { request }) => {
      isAuthenticated(request);

      const { userId, count, reportId, offenderId, reportCategoryValue } = args;
      console.log(args);

      if ((userId && count) || count === 0) {
        const currentUser = await prisma.user({ id: userId });
        console.log(currentUser);

        if (count === 0) {
          await prisma.updateReport({
            where: { id: reportId },
            data: {
              status: "CHECKED"
            }
          });

          return true;
        } else if (count === 1) {
          const currentUserReportCountValue = currentUser.reportedCount + 1;

          if (currentUserReportCountValue >= 3) {
            if (
              currentUserReportCountValue <= 5 &&
              (currentUserReportCountValue / 3 === 1 ||
                currentUserReportCountValue % 3 === 1)
            ) {
              await prisma.updateUser({
                where: { id: userId },
                data: {
                  status: "STOP",
                  //날짜 업데이트 하는게 남았음
                  reportedCount: currentUserReportCountValue,
                  stopDay: 3,
                  stopWatch: moment()
                    .add(1, "days")
                    .format("YYYY-MM-DD")
                }
              });

              if (reportCategoryValue === "COMMENT_REPORT") {
                await prisma.updateManyReports({
                  where: {
                    AND: [
                      { offender: { user: { email: offenderId } } },
                      { reportCategory: { category: reportCategoryValue } }
                    ]
                  },
                  data: {
                    status: "CHECKED"
                  }
                });
              } else if (reportCategoryValue === "EPISODE_REPORT") {
                await prisma.updateManyReports({
                  where: {
                    AND: [
                      {
                        episode: { post: { teamName: { email: offenderId } } }
                      },
                      { reportCategory: { category: reportCategoryValue } }
                    ]
                  },
                  data: {
                    status: "CHECKED"
                  }
                });
              }
            } else if (
              currentUserReportCountValue <= 8 &&
              (currentUserReportCountValue / 3 === 2 ||
                currentUserReportCountValue % 3 === 1)
            ) {
              await prisma.updateUser({
                where: { id: userId },
                data: {
                  status: "STOP",
                  //날짜 업데이트 하는게 남았음
                  reportedCount: currentUserReportCountValue,
                  stopDay: 7,
                  stopWatch: moment()
                    .add(1, "days")
                    .format("YYYY-MM-DD")
                }
              });

              if (reportCategoryValue === "COMMENT_REPORT") {
                await prisma.updateManyReports({
                  where: {
                    AND: [
                      { offender: { user: { email: offenderId } } },
                      { reportCategory: { category: reportCategoryValue } }
                    ]
                  },
                  data: {
                    status: "CHECKED"
                  }
                });
              } else if (reportCategoryValue === "EPISODE_REPORT") {
                await prisma.updateManyReports({
                  where: {
                    AND: [
                      {
                        episode: { post: { teamName: { email: offenderId } } }
                      },
                      { reportCategory: { category: reportCategoryValue } }
                    ]
                  },
                  data: {
                    status: "CHECKED"
                  }
                });
              }
            } else if (
              currentUserReportCountValue / 3 === 3 ||
              currentUserReportCountValue % 3 === 0 ||
              currentUserReportCountValue % 3 === 1
            ) {
              await prisma.updateUser({
                where: { id: userId },
                data: {
                  status: "STOP",
                  //날짜 업데이트 하는게 남았음
                  reportedCount: currentUserReportCountValue,
                  stopDay: 14,
                  stopWatch: moment()
                    .add(1, "days")
                    .format("YYYY-MM-DD")
                }
              });

              if (reportCategoryValue === "COMMENT_REPORT") {
                await prisma.updateManyReports({
                  where: {
                    AND: [
                      { offender: { user: { email: offenderId } } },
                      { reportCategory: { category: reportCategoryValue } }
                    ]
                  },
                  data: {
                    status: "CHECKED"
                  }
                });
              } else if (reportCategoryValue === "EPISODE_REPORT") {
                await prisma.updateManyReports({
                  where: {
                    AND: [
                      {
                        episode: { post: { teamName: { email: offenderId } } }
                      },
                      { reportCategory: { category: reportCategoryValue } }
                    ]
                  },
                  data: {
                    status: "CHECKED"
                  }
                });
              }
            } else {
              await prisma.updateUser({
                where: { id: userId },
                data: {
                  status: "ALIVE",
                  reportedCount: currentUserReportCountValue
                }
              });

              if (reportCategoryValue === "COMMENT_REPORT") {
                await prisma.updateManyReports({
                  where: {
                    AND: [
                      { offender: { user: { email: offenderId } } },
                      { reportCategory: { category: reportCategoryValue } }
                    ]
                  },
                  data: {
                    status: "CHECKED"
                  }
                });
              } else if (reportCategoryValue === "EPISODE_REPORT") {
                await prisma.updateManyReports({
                  where: {
                    AND: [
                      {
                        episode: { post: { teamName: { email: offenderId } } }
                      },
                      { reportCategory: { category: reportCategoryValue } }
                    ]
                  },
                  data: {
                    status: "CHECKED"
                  }
                });
              }
            }
          } else {
            console.log("lalalla");
            await prisma.updateUser({
              where: { id: userId },
              data: {
                status: "ALIVE",
                reportedCount: currentUserReportCountValue
              }
            });

            if (reportCategoryValue === "COMMENT_REPORT") {
              await prisma.updateManyReports({
                where: {
                  AND: [
                    { offender: { user: { email: offenderId } } },
                    { reportCategory: { category: reportCategoryValue } }
                  ]
                },
                data: {
                  status: "CHECKED"
                }
              });
            } else if (reportCategoryValue === "EPISODE_REPORT") {
              console.log("");
              await prisma.updateManyReports({
                where: {
                  AND: [
                    { episode: { post: { teamName: { email: offenderId } } } },
                    { reportCategory: { category: reportCategoryValue } }
                  ]
                },
                data: {
                  status: "CHECKED"
                }
              });
            }

            //stop이 되는 순간 코멘트
            //await prisma.deleteManyComments({ user: { id: userId } });
          }
          return true;
        } else if (count === 2) {
          const currentUserReportCountValue = currentUser.reportedCount + 2;
          if (currentUserReportCountValue >= 3) {
            if (
              currentUserReportCountValue <= 5 &&
              (currentUserReportCountValue / 3 === 1 ||
                currentUserReportCountValue % 3 === 1)
            ) {
              await prisma.updateUser({
                where: { id: userId },
                data: {
                  status: "STOP",
                  //날짜 업데이트 하는게 남았음
                  reportedCount: currentUserReportCountValue,
                  stopDay: 3,
                  stopWatch: moment()
                    .add(1, "days")
                    .format("YYYY-MM-DD")
                }
              });

              //stop이 되는 순간 코멘트
              //await prisma.deleteManyComments({ user: { id: userId } });

              if (reportCategoryValue === "COMMENT_REPORT") {
                await prisma.updateManyReports({
                  where: {
                    AND: [
                      { offender: { user: { email: offenderId } } },
                      { reportCategory: { category: reportCategoryValue } }
                    ]
                  },
                  data: {
                    status: "CHECKED"
                  }
                });
              } else if (reportCategoryValue === "EPISODE_REPORT") {
                await prisma.updateManyReports({
                  where: {
                    AND: [
                      {
                        episode: { post: { teamName: { email: offenderId } } }
                      },
                      { reportCategory: { category: reportCategoryValue } }
                    ]
                  },
                  data: {
                    status: "CHECKED"
                  }
                });
              }
            } else if (
              currentUserReportCountValue <= 8 &&
              (currentUserReportCountValue / 3 === 2 ||
                currentUserReportCountValue % 3 === 1)
            ) {
              await prisma.updateUser({
                where: { id: userId },
                data: {
                  status: "STOP",
                  //날짜 업데이트 하는게 남았음
                  reportedCount: currentUserReportCountValue,
                  stopDay: 7,
                  stopWatch: moment()
                    .add(1, "days")
                    .format("YYYY-MM-DD")
                }
              });

              //stop이 되는 순간 코멘트
              //await prisma.deleteManyComments({ user: { id: userId } });

              if (reportCategoryValue === "COMMENT_REPORT") {
                await prisma.updateManyReports({
                  where: {
                    AND: [
                      { offender: { user: { email: offenderId } } },
                      { reportCategory: { category: reportCategoryValue } }
                    ]
                  },
                  data: {
                    status: "CHECKED"
                  }
                });
              } else if (reportCategoryValue === "EPISODE_REPORT") {
                await prisma.updateManyReports({
                  where: {
                    AND: [
                      {
                        episode: { post: { teamName: { email: offenderId } } }
                      },
                      { reportCategory: { category: reportCategoryValue } }
                    ]
                  },
                  data: {
                    status: "CHECKED"
                  }
                });
              }
            } else if (
              currentUserReportCountValue / 3 === 3 ||
              currentUserReportCountValue % 3 === 0 ||
              currentUserReportCountValue % 3 === 1
            ) {
              await prisma.updateUser({
                where: { id: userId },
                data: {
                  status: "STOP",
                  //날짜 업데이트 하는게 남았음
                  reportedCount: currentUserReportCountValue,
                  stopDay: 14,
                  stopWatch: moment()
                    .add(1, "days")
                    .format("YYYY-MM-DD")
                }
              });
              //stop이 되는 순간 코멘트
              //await prisma.deleteManyComments({ user: { id: userId } });

              if (reportCategoryValue === "COMMENT_REPORT") {
                await prisma.updateManyReports({
                  where: {
                    AND: [
                      { offender: { user: { email: offenderId } } },
                      { reportCategory: { category: reportCategoryValue } }
                    ]
                  },
                  data: {
                    status: "CHECKED"
                  }
                });
              } else if (reportCategoryValue === "EPISODE_REPORT") {
                await prisma.updateManyReports({
                  where: {
                    AND: [
                      {
                        episode: { post: { teamName: { email: offenderId } } }
                      },
                      { reportCategory: { category: reportCategoryValue } }
                    ]
                  },
                  data: {
                    status: "CHECKED"
                  }
                });
              }
            } else {
              await prisma.updateUser({
                where: { id: userId },
                data: {
                  status: "ALIVE",
                  reportedCount: currentUserReportCountValue
                }
              });

              if (reportCategoryValue === "COMMENT_REPORT") {
                await prisma.updateManyReports({
                  where: {
                    AND: [
                      { offender: { user: { email: offenderId } } },
                      { reportCategory: { category: reportCategoryValue } }
                    ]
                  },
                  data: {
                    status: "CHECKED"
                  }
                });
              } else if (reportCategoryValue === "EPISODE_REPORT") {
                await prisma.updateManyReports({
                  where: {
                    AND: [
                      {
                        episode: { post: { teamName: { email: offenderId } } }
                      },
                      { reportCategory: { category: reportCategoryValue } }
                    ]
                  },
                  data: {
                    status: "CHECKED"
                  }
                });
              }
            }
          } else {
            await prisma.updateUser({
              where: { id: userId },
              data: {
                status: "ALIVE",
                reportedCount: currentUserReportCountValue
              }
            });

            if (reportCategoryValue === "COMMENT_REPORT") {
              await prisma.updateManyReports({
                where: {
                  AND: [
                    { offender: { user: { email: offenderId } } },
                    { reportCategory: { category: reportCategoryValue } }
                  ]
                },
                data: {
                  status: "CHECKED"
                }
              });
            } else if (reportCategoryValue === "EPISODE_REPORT") {
              await prisma.updateManyReports({
                where: {
                  AND: [
                    { episode: { post: { teamName: { email: offenderId } } } },
                    { reportCategory: { category: reportCategoryValue } }
                  ]
                },
                data: {
                  status: "CHECKED"
                }
              });
            }
          }
          return true;
        } else {
          const currentUserReportCountValue = currentUser.reportedCount + 3;
          if (
            currentUserReportCountValue >= 3 &&
            currentUserReportCountValue < 6
          ) {
            await prisma.updateUser({
              where: { id: userId },
              data: {
                status: "STOP",
                reportedCount: currentUserReportCountValue,
                stopDay: 3,
                stopWatch: moment()
                  .add(1, "days")
                  .format("YYYY-MM-DD")
              }
            });

            if (reportCategoryValue === "COMMENT_REPORT") {
              await prisma.updateManyReports({
                where: {
                  AND: [
                    { offender: { user: { email: offenderId } } },
                    { reportCategory: { category: reportCategoryValue } }
                  ]
                },
                data: {
                  status: "CHECKED"
                }
              });
            } else if (reportCategoryValue === "EPISODE_REPORT") {
              await prisma.updateManyReports({
                where: {
                  AND: [
                    { episode: { post: { teamName: { email: offenderId } } } },
                    { reportCategory: { category: reportCategoryValue } }
                  ]
                },
                data: {
                  status: "CHECKED"
                }
              });
            }

            //stop이 되는 순간 코멘트
            //await prisma.deleteManyComments({ user: { id: userId } });
          } else if (
            currentUserReportCountValue >= 6 ||
            currentUserReportCountValue < 9
          ) {
            await prisma.updateUser({
              where: { id: userId },
              data: {
                status: "STOP",
                reportedCount: currentUserReportCountValue,
                stopDay: 7,
                stopWatch: moment()
                  .add(1, "days")
                  .format("YYYY-MM-DD")
              }
            });

            if (reportCategoryValue === "COMMENT_REPORT") {
              await prisma.updateManyReports({
                where: {
                  AND: [
                    { offender: { user: { email: offenderId } } },
                    { reportCategory: { category: reportCategoryValue } }
                  ]
                },
                data: {
                  status: "CHECKED"
                }
              });
            } else if (reportCategoryValue === "EPISODE_REPORT") {
              await prisma.updateManyReports({
                where: {
                  AND: [
                    { episode: { post: { teamName: { email: offenderId } } } },
                    { reportCategory: { category: reportCategoryValue } }
                  ]
                },
                data: {
                  status: "CHECKED"
                }
              });
            }
            //stop이 되는 순간 코멘트
            //await prisma.deleteManyComments({ user: { id: userId } });
          } else {
            await prisma.updateUser({
              where: { id: userId },
              data: {
                status: "STOP",
                reportedCount: currentUserReportCountValue,
                stopDay: 14,
                stopWatch: moment()
                  .add(1, "days")
                  .format("YYYY-MM-DD")
              }
            });

            if (reportCategoryValue === "COMMENT_REPORT") {
              await prisma.updateManyReports({
                where: {
                  AND: [
                    { offender: { user: { email: offenderId } } },
                    { reportCategory: { category: reportCategoryValue } }
                  ]
                },
                data: {
                  status: "CHECKED"
                }
              });
            } else if (reportCategoryValue === "EPISODE_REPORT") {
              await prisma.updateManyReports({
                where: {
                  AND: [
                    { episode: { post: { teamName: { email: offenderId } } } },
                    { reportCategory: { category: reportCategoryValue } }
                  ]
                },
                data: {
                  status: "CHECKED"
                }
              });
            }
            //stop이 되는 순간 코멘트
            //await prisma.deleteManyComments({ user: { id: userId } });
          }

          return true;
        }
      }
    }
  }
};
