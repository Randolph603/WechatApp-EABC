import { WxRequestAsync } from "@Lib/promisify";
const token = '2|NaXRu9JnMpSdb8l86BkJxj6gzKJofnhmExwr8EWkQtHoattDAGimsSYhpM22a61e1crjTjfIGTKfhzxA';
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
const imageMap: { [key: number]: string } = {
  // MS
  57945: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1697434141/assets/players/thumbnail/57945.png",
  91554: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1697434685/assets/players/thumbnail/91554.png",
  64032: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1689644372/assets/players/thumbnail/64032.png",
  95476: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1697425579/assets/players/thumbnail/95476.png",
  73442: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1697434451/assets/players/thumbnail/73442.png",
  34810: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1658715713/assets/players/thumbnail/34810.png",
  94580: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1693891862/assets/players/thumbnail/94580.png",
  62063: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1689644343/assets/players/thumbnail/62063.png",
  76115: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1671091040/assets/players/thumbnail/76115.png",
  72885: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1719991249/assets/players/thumbnail/72885.png",
  // WS
  87442: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1748582728/assets/players/thumbnail/87442.png",
  61854: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1751261783/assets/players/thumbnail/61854.png",
  92967: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1748583881/assets/players/thumbnail/92967.png",
  78778: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1689647649/assets/players/thumbnail/78778.png",
  96312: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1748583585/assets/players/thumbnail/96312.png",
  84062: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1697765882/assets/players/thumbnail/84062.png",
  83802: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1637133297/assets/players/thumbnail/83802.png",
  82070: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1667175143/assets/players/thumbnail/82070.png",
  76890: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1604896439/assets/players/thumbnail/76890.png",
  35642: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1604897731/assets/players/thumbnail/35642.png",
  // MD
  61444: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1747635431/assets/players/thumbnail/61444.png",
  66513: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1732493690/assets/players/thumbnail/66513.png",
  56203: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1627949889/assets/players/thumbnail/56203.png",
  99389: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1736916607/assets/players/thumbnail/99389.png",
  90768: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1636512672/assets/players/thumbnail/90768.png",
  94814: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1636512792/assets/players/thumbnail/94814.png",
  88876: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1689648880/assets/players/thumbnail/88876.png",
  91130: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1690160931/assets/players/thumbnail/91130.png",
  92980: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1636531494/assets/players/thumbnail/92980.png",
  44414: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1636531127/assets/players/thumbnail/44414.png",
  90531: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1736832980/assets/players/thumbnail/90531.png",
  55414: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1736841863/assets/players/thumbnail/55414.png",
  78409: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1697420743/assets/players/thumbnail/78409.png",
  85129: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1697443452/assets/players/thumbnail/85129.png",
  87432: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1732493631/assets/players/thumbnail/87432.png",
  86136: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1604895633/assets/players/thumbnail/86136.png",
  72435: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1697771308/assets/players/thumbnail/72435.png",
  70500: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1697771565/assets/players/thumbnail/70500.png",
  68633: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1604896458/assets/players/thumbnail/68633.png",
  79658: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1647993849/assets/players/thumbnail/79658.png",
  93130: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1690181900/assets/players/thumbnail/93130.png",
  71223: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1690181939/assets/players/thumbnail/71223.png",
  // WD
  81599: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1667177004/assets/players/thumbnail/81599.png",
  59880: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1690355943/assets/players/thumbnail/59880.png",
  85551: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1657779588/assets/players/thumbnail/85551.png",
  68628: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1634281515/assets/players/thumbnail/68628.png",
  65212: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1657872624/assets/players/thumbnail/65212.png",
  68282: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1736133198/assets/players/thumbnail/68282.png",
  56706: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1604897799/assets/players/thumbnail/56706.png",
  91292: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1736820468/assets/players/thumbnail/91292.png",
  83419: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1657778970/assets/players/thumbnail/83419.png",
  71391: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1658733080/assets/players/thumbnail/71391.png",
  65144: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1657779441/assets/players/thumbnail/65144.png",
  85914: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1658132716/assets/players/thumbnail/85914.png",
  85540: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1736926648/assets/players/thumbnail/85540.png",
  65300: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1736919879/assets/players/thumbnail/65300.png",
  71023: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1657872319/assets/players/thumbnail/71023.png",
  81609: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1658132498/assets/players/thumbnail/81609.png",
  88135: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1736919293/assets/players/thumbnail/88135.png",
  87428: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1736919598/assets/players/thumbnail/87428.png",
  79664: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1604897782/assets/players/thumbnail/79664.png",
  67761: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1604897780/assets/players/thumbnail/67761.png",
  // XD
  65267: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1697420441/assets/players/thumbnail/65267.png",
  89426: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1697424201/assets/players/thumbnail/89426.png",
  63029: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1736736201/assets/players/thumbnail/63029.png",
  57246: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1736735606/assets/players/thumbnail/57246.png",
  61731: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1636447436/assets/players/thumbnail/61731.png",
  74980: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1636443943/assets/players/thumbnail/74980.png",
  91090: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1604896192/assets/players/thumbnail/91090.png",
  59621: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1604896515/assets/players/thumbnail/59621.png",
  77689: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1658733477/assets/players/thumbnail/77689.png",
  61435: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1658733507/assets/players/thumbnail/61435.png",
  92593: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1604896123/assets/players/thumbnail/92593.png",
  56352: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1633672620/assets/players/thumbnail/56352.png",
  81844: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1604896470/assets/players/thumbnail/81844.png",
  50469: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1690357071/assets/players/thumbnail/50469.png",
  68544: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1604895451/assets/players/thumbnail/68544.png",
  70762: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1604895480/assets/players/thumbnail/70762.png",
  64944: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1604896575/assets/players/thumbnail/64944.png",
  55417: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1604896443/assets/players/thumbnail/55417.png",
  81705: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1741912088/assets/players/thumbnail/81705.png",
  95643: "https://img.bwfbadminton.com/image/upload/t_96_player_profile/v1634093078/assets/players/thumbnail/95643.png",
};

export const LoadMSRankAsync = async (): Promise<any> => {
  const data = {
    "catId": 6,
    "drawCount": 1,
    "rankId": 2,
    "publicationId": 0,
    "doubles": false,
    "searchKey": "",
    "pageKey": "20",
    "page": 1,
  };
  const { results } = await LoadRankAsync(data);
  return results.data.map((d: any) => {
    return {
      rank: d.rank,
      rank_change: d.rank_change,
      rank_previous: d.rank_previous,
      tournaments: d.tournaments,
      points: Number(d.points).toLocaleString("en-US"),
      displayName: d.player1_model.name_display,
      nation: d.player1_model.country_model.name,
      avatarUrl: imageMap[d.player1_id] ?? defaultAvatarUrl,
    }
  })
}

export const LoadWSRankAsync = async (): Promise<any> => {
  const data = {
    "catId": 7,
    "drawCount": 2,
    "rankId": 2,
    "publicationId": 0,
    "doubles": false,
    "searchKey": "",
    "pageKey": "20",
    "page": 1,
  };
  const { results } = await LoadRankAsync(data);
  return results.data.map((d: any) => {
    return {
      rank: d.rank,
      rank_change: d.rank_change,
      rank_previous: d.rank_previous,
      tournaments: d.tournaments,
      points: Number(d.points).toLocaleString("en-US"),
      displayName: d.player1_model.name_display,
      nation: d.player1_model.country_model.name,
      avatarUrl: imageMap[d.player1_id] ?? defaultAvatarUrl,
    }
  })
}

export const LoadMDRankAsync = async (): Promise<any> => {
  const data = {
    "catId": 8,
    "drawCount": 3,
    "rankId": 2,
    "publicationId": 0,
    "doubles": true,
    "searchKey": "",
    "pageKey": "20",
    "page": 1,
  };
  const { results } = await LoadRankAsync(data);
  return results.data.map((d: any) => {
    return {
      rank: d.rank,
      rank_change: d.rank_change,
      rank_previous: d.rank_previous,
      tournaments: d.tournaments,
      points: Number(d.points).toLocaleString("en-US"),

      player1_displayName: d.player1_model.name_display,
      player1_nation: d.player1_model.country_model.name,
      player1_avatarUrl: imageMap[d.player1_id] ?? defaultAvatarUrl,

      player2_displayName: d.player2_model.name_display,
      player2_nation: d.player2_model.country_model.name,
      player2_avatarUrl: imageMap[d.player2_id] ?? defaultAvatarUrl,
    }
  })
}

export const LoadWDRankAsync = async (): Promise<any> => {
  const data = {
    "catId": 9,
    "drawCount": 4,
    "rankId": 2,
    "publicationId": 0,
    "doubles": true,
    "searchKey": "",
    "pageKey": "20",
    "page": 1,
  };
  const { results } = await LoadRankAsync(data);
  return results.data.map((d: any) => {
    return {
      rank: d.rank,
      rank_change: d.rank_change,
      rank_previous: d.rank_previous,
      tournaments: d.tournaments,
      points: Number(d.points).toLocaleString("en-US"),

      player1_displayName: d.player1_model.name_display,
      player1_nation: d.player1_model.country_model.name,
      player1_avatarUrl: imageMap[d.player1_id] ?? defaultAvatarUrl,

      player2_displayName: d.player2_model.name_display,
      player2_nation: d.player2_model.country_model.name,
      player2_avatarUrl: imageMap[d.player2_id] ?? defaultAvatarUrl,
    }
  })
}

export const LoadXDRankAsync = async (): Promise<any> => {
  const data = {
    "catId": 10,
    "drawCount": 5,
    "rankId": 2,
    "publicationId": 0,
    "doubles": true,
    "searchKey": "",
    "pageKey": "20",
    "page": 1,
  };
  const { results } = await LoadRankAsync(data);
  return results.data.map((d: any) => {
    return {
      rank: d.rank,
      rank_change: d.rank_change,
      rank_previous: d.rank_previous,
      tournaments: d.tournaments,
      points: Number(d.points).toLocaleString("en-US"),

      player1_displayName: d.player1_model.name_display,
      player1_nation: d.player1_model.country_model.name,
      player1_avatarUrl: imageMap[d.player1_id] ?? defaultAvatarUrl,

      player2_displayName: d.player2_model.name_display,
      player2_nation: d.player2_model.country_model.name,
      player2_avatarUrl: imageMap[d.player2_id] ?? defaultAvatarUrl,
    }
  })
}

const LoadRankAsync = async (data: object): Promise<any> => {
  const response = await WxRequestAsync({
    url: 'https://extranet-lv.bwfbadminton.com/api/vue-rankingtable',
    method: 'POST',
    data: data,
    header: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  return response.data;
}