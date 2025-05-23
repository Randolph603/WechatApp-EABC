export const ConvertFileIdToHttps = (fileId: string) =>{
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