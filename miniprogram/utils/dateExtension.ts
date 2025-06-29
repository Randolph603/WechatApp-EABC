import { GetCurrentLanguage, Languages } from "@Language/languageUtils";

// e.g. 27/06/2025, 09:27:33  as ['27', '06', '2025', '09', '27', '33']
const ToNewZealandDateArray = (value: Date) => {
  // split by number , en-GB is 24h
  return value.toLocaleString('en-GB', { timeZone: 'Pacific/Auckland' }).split(/\D+/);
}

// e.g. 
// '2025-06-26T21:11:15.237Z' to Fri Jun 27 2025 10:09:30 GMT+1200 (New Zealand Standard Time) {}
const ConverToDate = (value: string | Date) => {
  return (typeof value === 'string' || value instanceof String)
    ? new Date(value)
    : value;
}

// format: YYYY-MM-DD
export const ToNZDateString = (value: string | Date) => {
  const dateTime = ConverToDate(value);
  const array = ToNewZealandDateArray(dateTime);
  return `${array[2]}-${array[1]}-${array[0]}`;
}

// e.g. 27 Jun 2025 or 2025年6月27日
export const ToNZShortDateString = (value: string | Date) => {
  const dateTime = ConverToDate(value);

  const lang = GetCurrentLanguage();
  if (lang === Languages.English) {
    return dateTime.toLocaleDateString('en-GB', { year: "numeric", month: "short", day: "numeric" });
  }
  if (lang === Languages.Chinese) {
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1;
    const day = dateTime.getDate();
    return `${year}年${month}月${day}日`;
  }
  return ToNZDateString(dateTime);
}

// format: hh:mm
export const ToNZTimeString = (value: string | Date) => {
  const dateTime = ConverToDate(value);
  const array = ToNewZealandDateArray(dateTime);
  return `${array[3]}:${array[4]}`;
}

// e.g. 19:30-21:30
export const ToNZTimeRangeString = (value: string | Date, during: number) => {
  const startTime = ConverToDate(value);
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + Number(during));
  return `${ToNZTimeString(startTime)}-${ToNZTimeString(endTime)}`;
}

// e.g. Fri or 周五
export const ToDayOfWeekString = (value: string | Date) => {
  const dataTime = ConverToDate(value);
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const lang = GetCurrentLanguage();

  if (lang === Languages.English) {
    return dataTime.toLocaleDateString('en-nz', { weekday: "short" });
  }
  if (lang === Languages.Chinese) {
    return days[dataTime.getDay()];
  }
  return null;
}