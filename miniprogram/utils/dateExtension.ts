import { GetLanguageVersion, Languages } from "@Language/languageUtils";

export const ParseISOString = (s: any) => {
  if (typeof s === 'string' || s instanceof String) {
    const b = s.toString().split(/\D+/);
    return new Date(Date.UTC(Number(b[0]), Number(b[1]) - 1, Number(b[2]), Number(b[3]), Number(b[4]), Number(b[5]), Number(b[6])));
  } else {
    return s;
  }
}

export const ToShortDateString = (value: string) => {
  const date = ParseISOString(value);

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
  const date = ParseISOString(value);

  const lang = GetLanguageVersion();
  if (lang === Languages.English.value) {
    return date.toLocaleDateString('en-us', { weekday: "short" });
  }
  if (lang === Languages.Chinese.value) {
    return days[date.getDay()];
  }
  return null;
}

const formatNumber = (n: any) => {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

const formatShortTime = (value: string) => {
  const time = ParseISOString(value);
  const hour = time.getHours();
  const minute = time.getMinutes();
  return [hour, minute].map(formatNumber).join(':');
}

export const ToShortTimeRange = (value: string, during: number) => {
  const startTime = ParseISOString(value);
  const endTime = ParseISOString(value);
  endTime.setMinutes(endTime.getMinutes() + during);

  return `${formatShortTime(startTime.toISOString())}-${formatShortTime(endTime.toISOString())}`
}