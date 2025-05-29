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

const maxImageSize = 19;
const ActivityList = [
  {
    "Attendees": [
      {
        "joinMore": 0,
        "memberId": 10024,
      },
      {
        "joinMore": 0,
        "memberId": 10502,
      },
      {
        "joinMore": 0,
        "memberId": 10444,
      },
      {
        "joinMore": 0,
        "memberId": 10598,
      },
      {
        "joinMore": 0,
        "memberId": 10615,
      }
    ],
    "address": "Lloyd Elsmore Park Badminton",
    "area": "东区",
    "category": "badminton",
    "city": "奥克兰",
    "coverImageSrc": "/mocks/image/"+Math.floor(Math.random() * maxImageSize)+".jpg",
    "date": "May 25, 2025",
    "dayOfWeek": "Sun",
    "during": 120,
    "isCancelled": false,
    "isCompleted": true,
    "maxAttendee": 6,
    "startTime": "2025-05-25T02:00:00.217Z",
    "title": "双打羽毛球",
    "toPublic": true,
    "type": "happy",
    "updateDate": "2025-05-25T04:16:29.071Z",
    "viewCount": 201,
  },
  {
    "Attendees": [
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T21:44:15.347Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10516,
        "sectionIndex": 0,
        "updateDate": "2025-05-18T21:44:15.347Z",
        "_openid": "ohSP64vda_ofgBKlkDk79Zl3BQQ0"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T21:44:24.869Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10513,
        "sectionIndex": 0,
        "updateDate": "2025-05-18T21:44:24.869Z",
        "_openid": "ohSP64vda_ofgBKlkDk79Zl3BQQ0"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T21:44:35.519Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10521,
        "sectionIndex": 0,
        "updateDate": "2025-05-18T21:44:35.519Z",
        "_openid": "ohSP64vda_ofgBKlkDk79Zl3BQQ0"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T21:44:45.042Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10248,
        "sectionIndex": 1,
        "updateDate": "2025-05-18T21:44:45.042Z",
        "_openid": "ohSP64vda_ofgBKlkDk79Zl3BQQ0"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T21:45:28.312Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10511,
        "sectionIndex": 0,
        "updateDate": "2025-05-18T21:45:28.312Z",
        "_openid": "ohSP64vda_ofgBKlkDk79Zl3BQQ0"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T21:45:44.496Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10470,
        "sectionIndex": 0,
        "updateDate": "2025-05-18T21:45:44.496Z",
        "_openid": "ohSP64vda_ofgBKlkDk79Zl3BQQ0"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T21:45:52.217Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10332,
        "sectionIndex": 1,
        "updateDate": "2025-05-18T21:45:52.217Z",
        "_openid": "ohSP64vda_ofgBKlkDk79Zl3BQQ0"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T21:47:16.085Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10533,
        "sectionIndex": 0,
        "updateDate": "2025-05-18T21:47:16.085Z",
        "_openid": "ohSP64vda_ofgBKlkDk79Zl3BQQ0"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T21:47:32.057Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10056,
        "sectionIndex": 1,
        "updateDate": "2025-05-18T21:47:32.057Z",
        "_openid": "ohSP64vda_ofgBKlkDk79Zl3BQQ0"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T21:48:29.301Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10067,
        "sectionIndex": 1,
        "updateDate": "2025-05-18T21:48:29.301Z",
        "_openid": "ohSP64vda_ofgBKlkDk79Zl3BQQ0"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T21:48:47.527Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10239,
        "sectionIndex": 1,
        "updateDate": "2025-05-18T21:48:47.527Z",
        "_openid": "ohSP64vda_ofgBKlkDk79Zl3BQQ0"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T21:48:55.515Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10009,
        "sectionIndex": 1,
        "updateDate": "2025-05-18T21:48:55.515Z",
        "_openid": "ohSP64vda_ofgBKlkDk79Zl3BQQ0"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T21:49:17.839Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10609,
        "sectionIndex": 1,
        "updateDate": "2025-05-18T21:49:17.839Z",
        "_openid": "ohSP64vda_ofgBKlkDk79Zl3BQQ0"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T21:49:39.649Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10475,
        "sectionIndex": 1,
        "updateDate": "2025-05-18T21:49:39.649Z",
        "_openid": "ohSP64vda_ofgBKlkDk79Zl3BQQ0"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T21:49:49.480Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10476,
        "sectionIndex": 1,
        "updateDate": "2025-05-18T21:49:49.480Z",
        "_openid": "ohSP64vda_ofgBKlkDk79Zl3BQQ0"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T23:36:04.889Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10372,
        "sectionIndex": 1,
        "updateDate": "2025-05-18T23:36:04.889Z",
        "_openid": "ohSP64pu6ZqntL9XyhxvRPwFKUqE"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T23:44:28.160Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10590,
        "sectionIndex": 0,
        "updateDate": "2025-05-18T23:44:28.160Z",
        "_openid": "ohSP64uPp17tzgYWwMBVKOY_pSWM"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-19T00:05:20.207Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10616,
        "sectionIndex": 0,
        "updateDate": "2025-05-19T00:05:20.207Z",
        "_openid": "ohSP64nXGmvCqUgsBVGbVFI2ysBI"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-19T21:50:50.723Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10612,
        "sectionIndex": 1,
        "updateDate": "2025-05-19T21:50:50.723Z",
        "_openid": "ohSP64oE_dgn1SHg-HBH2PpMeI6k"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-20T01:07:33.926Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10607,
        "sectionIndex": 1,
        "updateDate": "2025-05-20T01:07:33.926Z",
        "_openid": "ohSP64mY5HmiHhXU5Ik28S51Cadw"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-21T22:56:56.350Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10060,
        "sectionIndex": 1,
        "updateDate": "2025-05-21T22:56:56.350Z",
        "_openid": "ohSP64p0eIGUdZvmEvFmGgoYTRDY"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-21T22:57:22.516Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10563,
        "sectionIndex": 1,
        "updateDate": "2025-05-21T22:57:22.516Z",
        "_openid": "ohSP64nUJUkiNpufMKuLYwBohYtw"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-22T05:32:54.398Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10593,
        "sectionIndex": 0,
        "updateDate": "2025-05-22T05:32:54.398Z",
        "_openid": "ohSP64rFflEkjgxBbh2FbjWLCj9k"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-22T22:05:48.350Z",
        "isCancelled": false,
        "joinMore": 0,
        "memberId": 10497,
        "sectionIndex": 1,
        "updateDate": "2025-05-22T22:05:48.350Z",
        "_openid": "ohSP64oBNA0XNPcAov_OoPHovLbg"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T21:47:47.188Z",
        "isCancelled": false,
        "joinMore": 1,
        "memberId": 10513,
        "sectionIndex": 1,
        "updateDate": "2025-05-18T21:47:47.188Z",
        "_openid": "ohSP64vda_ofgBKlkDk79Zl3BQQ0"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-18T23:44:35.539Z",
        "isCancelled": false,
        "joinMore": 1,
        "memberId": 10590,
        "sectionIndex": 0,
        "updateDate": "2025-05-18T23:44:35.539Z",
        "_openid": "ohSP64uPp17tzgYWwMBVKOY_pSWM"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-20T23:59:49.967Z",
        "isCancelled": false,
        "joinMore": 1,
        "memberId": 10521,
        "sectionIndex": 0,
        "updateDate": "2025-05-20T23:59:49.967Z",
        "_openid": "ohSP64m9bgz-66ZECI5PeGpkU4Vc"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-21T08:24:49.659Z",
        "isCancelled": false,
        "joinMore": 1,
        "memberId": 10475,
        "sectionIndex": 1,
        "updateDate": "2025-05-21T08:24:49.659Z",
        "_openid": "ohSP64q4R2axOmKmqlsBREBTJ-i4"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-21T21:57:08.640Z",
        "isCancelled": false,
        "joinMore": 1,
        "memberId": 10516,
        "sectionIndex": 0,
        "updateDate": "2025-05-21T21:57:08.640Z",
        "_openid": "ohSP64gHCM6gY1VfO21uzlGNJVyM"
      },
      {
        "activityId": "29dca3d5682a541b008d87e0580ea616",
        "createDate": "2025-05-20T23:59:54.688Z",
        "isCancelled": false,
        "joinMore": 2,
        "memberId": 10521,
        "sectionIndex": 1,
        "updateDate": "2025-05-20T23:59:54.688Z",
        "_openid": "ohSP64m9bgz-66ZECI5PeGpkU4Vc"
      }
    ],
    "address": "Lloyd Elsmore Park Badminton",
    "area": "东区",
    "category": "badminton",
    "city": "奥克兰",
    "courts": [
      1,
      2,
      5,
      6,
      8
    ],
    "coverImageHeight": 257,
    "coverImageSrc": "/mocks/image/"+Math.floor(Math.random() * maxImageSize)+".jpg",
    "date": "May 23, 2025",
    "dayOfWeek": "Fri",
    "during": 120,
    "isCancelled": false,
    "isCompleted": true,
    "maxAttendee": 30,
    "minUserLevel": 1,
    "organizerMemberId": 10024,
    "price": 17,
    "sections": [
      "娱乐区1，2号场",
      "对抗区5，6，8号场"
    ],
    "shareCount": 10,
    "startTime": "2025-05-23T07:30:00.833Z",
    "title": "双打羽毛球",
    "toPublic": true,
    "type": "happy",
    "updateDate": "2025-05-23T08:01:23.926Z",
    "viewCount": 514,
    "wxActivityExpirationTime": 1748043906,
    "wxActivityId": "1323_pCsO3oJG8KL6bwK4ZQ4tbbVOy_2oceoViOMj0KQ150CZgyR4L0NqOLxqQ9g~",
    "_id": "29dca3d5682a541b008d87e0580ea616",
    "_openid": "ohSP64vda_ofgBKlkDk79Zl3BQQ0"
  },
  {
    "Attendees": [
      {
        "joinMore": 0,
        "memberId": 10024,
      },
      {
        "joinMore": 0,
        "memberId": 10502,
      },
      {
        "joinMore": 0,
        "memberId": 10444,
      },
      {
        "joinMore": 0,
        "memberId": 10598,
      },
      {
        "joinMore": 0,
        "memberId": 10615,
      }
    ],
    "address": "Lloyd Elsmore Park Badminton",
    "area": "东区",
    "category": "badminton",
    "city": "奥克兰",
    "coverImageSrc": "/mocks/image/"+Math.floor(Math.random() * maxImageSize)+".jpg",
    "date": "May 25, 2025",
    "dayOfWeek": "Sun",
    "during": 120,
    "isCancelled": false,
    "isCompleted": true,
    "maxAttendee": 6,
    "startTime": "2025-05-25T02:00:00.217Z",
    "title": "双打羽毛球",
    "toPublic": true,
    "type": "happy",
    "updateDate": "2025-05-25T04:16:29.071Z",
    "viewCount": 201,
  },
  {
    "Attendees": [
      {
        "joinMore": 0,
        "memberId": 10024,
      },
      {
        "joinMore": 0,
        "memberId": 10502,
      },
      {
        "joinMore": 0,
        "memberId": 10444,
      },
      {
        "joinMore": 0,
        "memberId": 10598,
      },
      {
        "joinMore": 0,
        "memberId": 10615,
      }
    ],
    "address": "Lloyd Elsmore Park Badminton",
    "area": "东区",
    "category": "badminton",
    "city": "奥克兰",
    "coverImageSrc": "/mocks/image/"+Math.floor(Math.random() * maxImageSize)+".jpg",
    "date": "May 25, 2025",
    "dayOfWeek": "Sun",
    "during": 120,
    "isCancelled": false,
    "isCompleted": true,
    "maxAttendee": 6,
    "startTime": "2025-05-25T02:00:00.217Z",
    "title": "双打羽毛球",
    "toPublic": true,
    "type": "happy",
    "updateDate": "2025-05-25T04:16:29.071Z",
    "viewCount": 201,
  },
  {
    "Attendees": [
      {
        "joinMore": 0,
        "memberId": 10024,
      },
      {
        "joinMore": 0,
        "memberId": 10502,
      },
      {
        "joinMore": 0,
        "memberId": 10444,
      },
      {
        "joinMore": 0,
        "memberId": 10598,
      },
      {
        "joinMore": 0,
        "memberId": 10615,
      }
    ],
    "address": "Lloyd Elsmore Park Badminton",
    "area": "东区",
    "category": "badminton",
    "city": "奥克兰",
    "coverImageSrc": "/mocks/image/"+Math.floor(Math.random() * maxImageSize)+".jpg",
    "date": "May 25, 2025",
    "dayOfWeek": "Sun",
    "during": 120,
    "isCancelled": false,
    "isCompleted": true,
    "maxAttendee": 6,
    "startTime": "2025-05-25T02:00:00.217Z",
    "title": "双打羽毛球",
    "toPublic": true,
    "type": "happy",
    "updateDate": "2025-05-25T04:16:29.071Z",
    "viewCount": 201,
  },
  {
    "Attendees": [
      {
        "joinMore": 0,
        "memberId": 10024,
      },
      {
        "joinMore": 0,
        "memberId": 10502,
      },
      {
        "joinMore": 0,
        "memberId": 10444,
      },
      {
        "joinMore": 0,
        "memberId": 10598,
      },
      {
        "joinMore": 0,
        "memberId": 10615,
      }
    ],
    "address": "Lloyd Elsmore Park Badminton",
    "area": "东区",
    "category": "badminton",
    "city": "奥克兰",
    "coverImageSrc": "/mocks/image/"+Math.floor(Math.random() * maxImageSize)+".jpg",
    "date": "May 25, 2025",
    "dayOfWeek": "Sun",
    "during": 120,
    "isCancelled": false,
    "isCompleted": true,
    "maxAttendee": 6,
    "startTime": "2025-05-25T02:00:00.217Z",
    "title": "双打羽毛球",
    "toPublic": true,
    "type": "happy",
    "updateDate": "2025-05-25T04:16:29.071Z",
    "viewCount": 201,
  },
  {
    "Attendees": [
      {
        "joinMore": 0,
        "memberId": 10024,
      },
      {
        "joinMore": 0,
        "memberId": 10502,
      },
      {
        "joinMore": 0,
        "memberId": 10444,
      },
      {
        "joinMore": 0,
        "memberId": 10598,
      },
      {
        "joinMore": 0,
        "memberId": 10615,
      }
    ],
    "address": "Lloyd Elsmore Park Badminton",
    "area": "东区",
    "category": "badminton",
    "city": "奥克兰",
    "coverImageSrc": "/mocks/image/"+Math.floor(Math.random() * maxImageSize)+".jpg",
    "date": "May 25, 2025",
    "dayOfWeek": "Sun",
    "during": 120,
    "isCancelled": false,
    "isCompleted": true,
    "maxAttendee": 6,
    "startTime": "2025-05-25T02:00:00.217Z",
    "title": "双打羽毛球",
    "toPublic": true,
    "type": "happy",
    "updateDate": "2025-05-25T04:16:29.071Z",
    "viewCount": 201,
  },
];

export const LoadAllActivitiesAsync = () => {
  

  return ActivityList;
}
