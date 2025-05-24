import { GetLanguageVersion, Languages } from "@Language/languageUtils";

export const ConvertFileIdToHttps = (fileId: string) => {
  const regex = /cloud:\/\/(.+)\.([^\/]+)\/(.+)/;
  const match = fileId.match(regex);
  if (!match) {
    return '无法兑换成https链接';
  }
  // const envId = match[1];
  const customId = match[2];
  const path = match[3];
  return `https://${customId}.tcb.qcloud.la/${path}`;
}

const parseISOString = (s: any) => {
  if (typeof s === 'string' || s instanceof String) {
    var b = s.toString().split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
  } else {
    return s;
  }
}

export const ToShortDateString = (value: string) => {
  const date = parseISOString(value);

  const lang = GetLanguageVersion();
  if (lang === Languages.English.value) {
    return date.toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" });
  }
  if (lang === Languages.Chinese.value) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  }
  return date.toLocaleDateString();
}

export const ToDayOfWeekString = (value: string) => {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const date = parseISOString(value);

  const lang = GetLanguageVersion();
  if (lang === Languages.English.value) {
    return date.toLocaleDateString('en-us', { weekday: "short" });
  } 
  if (lang === Languages.Chinese.value) {
    return days[date.getDay()];
  }
  return null;
}