import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    //Banner를 삭제하기 위한 것
    deleteBanner: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { id } = args;
      const { user } = request;
      console.log(id);
      //마스터 계정인지 확인
      const isMasterUser = await prisma.$exists.user({
        AND: [{ id: user.id }, { rank: "master" }]
      });

      try {
        if (isMasterUser) {
          await prisma.deleteBanner({
            id
          });
          const allBanner = await prisma.banners();

          allBanner.map(async (value, index) => {
            if (value.orderBy !== index + 1) {
              await prisma.updateBanner({
                where: { id: value.id },
                data: { orderBy: index + 1 }
              });
            }
          });
          return true;
        }
      } catch (err) {
        console.log(err);
        return false;
      }
    },
    //main으로 사용하는 mutation
    oneEditBanner: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { id, image, url, upload, uploadTime, downTime, orderBy } = args;
      const { user } = request;
      //마스터 계정인지 확인
      const isMasterUser = await prisma.$exists.user({
        AND: [{ id: user.id }, { rank: "master" }]
      });

      try {
        if (isMasterUser) {
          const allBanner = await prisma.banners();
          //정보를 수정하는 배너의 정보
          allBanner.sort(function(a, b) {
            if (a.orderBy > b.orderBy) {
              return 1;
            }
            if (a.orderBy < b.orderBy) {
              return -1;
            }
            return 0;
          });
          let myBanner = "";
          allBanner.map((i) => {
            if (i.id === id) {
              console.log(i.id, i.orderBy);
              myBanner = i.orderBy;
            }
          });

          //수정하는 배너(a)가 원하는 자리에 있는 배너(b)의 정보
          let changeBanner = orderBy;


          //내가 변경하려는 배너(a)가 변경할 위치보다 뒤에 있다면
          //변경할 위치의 배너(b)부터 변경할 배너(a)의 위치까지 배너(b)들을 한칸씩 뒤로 민다.
          if (myBanner > changeBanner) {
            const result = allBanner.find((value) => value.orderBy === orderBy);

            allBanner.map(async (value, index) => {
              if (value.orderBy >= changeBanner && value.orderBy <= myBanner) {
                console.log(index, value);
                await prisma.updateBanner({
                  where: { id: allBanner[index].id },
                  data: { orderBy: allBanner[index].orderBy + 1 }
                });
              }
            });

            await prisma.updateBanner({
              where: { id },
              data: {
                image,
                url,
                upload,
                uploadTime,
                downTime,
                orderBy
              }
            });
          } else if (myBanner < changeBanner) {
            allBanner.map(async (value, index) => {
              if (index <= changeBanner && index >= myBanner) {
                await prisma.updateBanner({
                  where: { id: allBanner[index].id },
                  data: { orderBy: allBanner[index].orderBy - 1 }
                });
              }
            });

            await prisma.updateBanner({
              where: { id },
              data: {
                image,
                url,
                upload,
                uploadTime,
                downTime,
                orderBy
              }
            });
          } else if (myBanner === changeBanner) {

            await prisma.updateBanner({
              where: { id },
              data: {
                image,
                url,
                upload,
                uploadTime,
                downTime,
                orderBy
              }
            });
          }
          await prisma.updateBanner({
            where: { id },
            data: {
              image,
              url,
              upload,
              uploadTime,
              downTime,
              orderBy
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