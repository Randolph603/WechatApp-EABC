// Define a generic type for the success callback's response.
interface WxSuccessResponse {
  errMsg: string;
  [key: string]: any; // Allow for additional properties
}

// Define a generic type for the fail callback's response
interface WxFailResponse {
  errMsg: string;
  [key: string]: any; // Allow for additional properties
}

const wxPromisify = <T, U extends object>(fn: (obj: U) => void) => {
  return function (obj: U = {} as U): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const successHandler = (res: T & WxSuccessResponse) => {
        resolve(res);
      };

      const failHandler = (res: WxFailResponse) => {
        reject(res);
      };

      const augmentedObj = {
        ...obj,
        success: successHandler,
        fail: failHandler,
      };

      fn(augmentedObj as U);
    });
  };
};

export default wxPromisify;
export const WxLoginAsync = wxPromisify<any, object>(wx.login);
export const WxGetFileInfoAsync = wxPromisify<any, any>(wx.getFileSystemManager().getFileInfo);
export const WxShowModalAsync = wxPromisify<any, object>(wx.showModal);