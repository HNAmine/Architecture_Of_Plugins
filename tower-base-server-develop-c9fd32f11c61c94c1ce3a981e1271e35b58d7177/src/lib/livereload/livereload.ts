var tinylrFn = require('tiny-lr');

export function tinyReloadFactory() {
  return tinylrFn();
}

export function notifyLiveReload(e, tinyLr) {
  let fileName = e.path;
  tinyLr.changed({
    body: {
      files: [fileName]
    }
  });
}
