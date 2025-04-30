import { GetLanguageVersion, Languages } from 'miniprogram/languages/languageUtils';

const parseISOString = (s: any) => {
  if (typeof s === 'string' || s instanceof String) {
    var b = s.toString().split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
  } else {
    return s;
  }
}

const formatDateAndTime = value => {
  const date = parseISOString(value);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const minute = date.getMinutes();

  var hour = date.getHours();
  const ampm = hour >= 12 ? 'pm' : 'am';
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'

  return [year, month, day].map(formatNumber).join('-') + ', ' + [hour, minute].map(formatNumber).join(':') + ' ' + ampm;
}

const formatDate = value => {
  const date = parseISOString(value);

  const lang = languageVersion();
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

const formatShortDate = value => {
  const date = parseISOString(value);
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  const lang = GetLanguageVersion();
  if (lang === Languages.English.value) {
    return date.toLocaleDateString('en-us', { weekday: "long", month: "long", day: "numeric" });
  }
  if (lang === Languages.Chinese.value) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日 (${days[date.getDay()]})`;
  }
  return date.toString();
}

const formatShortTime = value => {
  const time = parseISOString(value);
  const hour = time.getHours();
  const minute = time.getMinutes();
  return [hour, minute].map(formatNumber).join(':');
}

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

const formatDatOfWeek = value => {
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

const formatShortTimeRange = (value, during) => {
  const startTime = parseISOString(value);
  const endTime = parseISOString(value);
  endTime.setMinutes(endTime.getMinutes() + during);

  return `${formatShortTime(startTime.toISOString())}-${formatShortTime(endTime.toISOString())}`
}

module.exports = {
  formatDateAndTime: formatDateAndTime,
  formatDate: formatDate,

  formatShortDate: formatShortDate,
  formatShortTime: formatShortTime,
  formatShortTimeRange: formatShortTimeRange,

  formatDatOfWeek: formatDatOfWeek,
  parseISOString: parseISOString,
}