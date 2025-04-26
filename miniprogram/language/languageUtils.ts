import en from '@Language/_en';
import zh from '@Language/_zh';

const language = {
  English: { index: 0, value: 'en', name: 'English', setting: 'Language' },
  Chinese: { index: 1, value: 'zh', name: '中文', setting: '多语言' },
};
const languageArray = [language.English, language.Chinese];

const languageVersion = function () {
  const appBaseInfo = wx.getAppBaseInfo();
  let defaultLang = language.English.value;
  switch (appBaseInfo.language.toLocaleLowerCase()) {
    case 'en':
      defaultLang = language.English.value;
      break;
    case 'zh':
    case 'zh_cn':
    case 'zh_tw':
    case 'zh_hk':
      defaultLang = language.Chinese.value;
      break;
    default:
      console.log(`Sorry, we are out of ${res.language}.`);
  }
  return wx.getStorageSync('lang') || defaultLang;
}

const getCurrentLanguage = () => {
  const langValue = languageVersion();
  const matchedLanguage = languageArray.find(l => l.value === langValue);
  return matchedLanguage.setting;
}

const getLaguageLib = () => {
  switch (languageVersion()) {
    case 'en':
      return en;
    case 'zh':
      return zh;
    default:
      return en;
  }
}

const getLaguageMap = () => getLaguageLib().languageMap;

const changeLanguage = (langType) => {
  const matchedLanguage = languageArray.find(l => l.index === langType);
  if (matchedLanguage) {
    wx.setStorageSync('lang', matchedLanguage.value);
  }
}

module.exports = {
  languageVersion: languageVersion,
  getCurrentLanguage: getCurrentLanguage,
  changeLanguage: changeLanguage,
  getLaguageLib: getLaguageLib,
  getLaguageMap: getLaguageMap,
  Language: language,
  LanguageArray: languageArray,
}

export {
  languageVersion,
  getCurrentLanguage,
  changeLanguage,
  getLaguageLib,
  getLaguageMap,
  language as Language,
  languageArray as LanguageArray,
}