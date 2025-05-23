const UserList = [
  {
    avatarUrl: "/mocks/avatar1.jpg",
    nickName: "尝尝唱唱唱changchangchang",
    gender: 1,
    memberId: 10001,
    powerPoint: 123,
    creditBalance: 321,
    userRole: 3,
    userLevel: 1
  },
  {
    avatarUrl: "/mocks/avatar2.jpg",
    nickName: "Juliet",
    gender: 2,
    memberId: 10002,
    powerPoint: 123,
    creditBalance: 321,
    userRole: 3,
    userLevel: 1
  },
  {
    avatarUrl: "/mocks/avatar3.jpg",
    nickName: "KK",
    gender: 0,
    memberId: 10003,
    powerPoint: 123,
    creditBalance: 321,
    userRole: 3,
    userLevel: 1
  },
  {
    avatarUrl: "/mocks/avatar4.jpg",
    nickName: "KK",
    gender: 2,
    memberId: 10004,
    powerPoint: 123,
    creditBalance: 321,
    userRole: 3,
    userLevel: 1
  },
  {
    avatarUrl: "/mocks/avatar5.jpg",
    nickName: "KK",
    gender: 1,
    memberId: 10005,
    powerPoint: 123,
    creditBalance: 321,
    userRole: 3,
    userLevel: 1
  },
];

export const GetUserByUnionId = () => {
  const index = Math.floor(Math.random() * UserList.length);
  return UserList[index];
}