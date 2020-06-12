import { prisma } from "../../../generated/prisma-client";

export default {
  Report: {
    user: ({ id }) => prisma.report({ id }).user(),
    offender: ({ id }) => prisma.report({ id }).user(),
    episode: ({ id }) => prisma.report({ id }).episode()
  }
};
