export const isAuthenticated = (request) => {
  if (!request.user) {
    throw Error("로그인이 필요한 기능입니다.");
  }
  return;
};
