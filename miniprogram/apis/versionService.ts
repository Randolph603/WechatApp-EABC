/**
 * Check current app version and update
 */
const CheckUpdateVersion = () => {
  // verify if getUpdateManager method is available   
  if (wx.canIUse('getUpdateManager')) {
    const updateManager = wx.getUpdateManager();
    // Check for update
    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        // if has a newer version
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '版本更新',
            content: '新版本已经准备就绪.',
            confirmText: '更新',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.clearStorage();
                // update version and relaunch
                updateManager.applyUpdate();
              }
            }
          });
        });

        // if has a newer verion and update failed
        updateManager.onUpdateFailed(function () {
          wx.showModal({
            title: '版本更新',
            content: '当前版本较低,请删除本程序，重新从小程序列表中下载。',
          })
        })
      }
    })
  } else {
    wx.showModal({
      title: '警告',
      content: '微信版本过低，请更新微信！'
    });
  }
}

export default CheckUpdateVersion;