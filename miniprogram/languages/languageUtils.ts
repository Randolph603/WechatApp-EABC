import { LanguageMap as en, AttendTitle as enAttendTitle } from './_en';
import { LanguageMap as zh, AttendTitle as zhAttendTitle } from './_zh';

export const Languages = {
  English: { index: 0, value: 'en', name: 'English', setting: 'Language' },
  Chinese: { index: 1, value: 'zh', name: '中文', setting: '多语言' },
};
export const LanguageArray = [Languages.English, Languages.Chinese];

const GetLanguageVersion = () => {
  const appBaseInfo = wx.getAppBaseInfo();
  let defaultLang = Languages.English.value;
  switch (appBaseInfo.language.toLocaleLowerCase()) {
    case 'en':
      defaultLang = Languages.English.value;
      break;
    case 'zh':
    case 'zh_cn':
    case 'zh_tw':
    case 'zh_hk':
      defaultLang = Languages.Chinese.value;
      break;
    default:
      console.log(`Sorry, we are out of ${appBaseInfo.language.toLocaleLowerCase()}.`);
  }
  return wx.getStorageSync('lang') || defaultLang;
}

export const GetCurrentLanguage = () => {
  const langValue = GetLanguageVersion();
  const matchedLanguage = LanguageArray.find(l => l.value === langValue);
  return matchedLanguage;
}

export const GetLaguageMap = () => {
  switch (GetLanguageVersion()) {
    case 'en':
      return en;
    case 'zh':
      return zh;
    default:
      return en;
  }
}

export const GetAttendTitle = (a: number, b: number) => {
  switch (GetLanguageVersion()) {
    case 'en':
      return enAttendTitle(a, b);
    case 'zh':
      return zhAttendTitle(a, b);
    default:
      return enAttendTitle(a, b);
  }
}

export const ChangeLanguage = (langType: number) => {
  const matchedLanguage = LanguageArray.find(l => l.index === langType);
  if (matchedLanguage) {
    wx.setStorageSync('lang', matchedLanguage.value);
  }
}