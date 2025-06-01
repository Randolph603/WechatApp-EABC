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

export const GetNavBarHeight = () => {
  const rect = wx.getMenuButtonBoundingClientRect();
  const statusBarHeight = wx.getWindowInfo().statusBarHeight;
  const navBarHeight = rect.bottom + rect.top - statusBarHeight;
  return navBarHeight;
}