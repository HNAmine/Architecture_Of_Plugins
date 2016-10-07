window.fetch('/config/content-config.json')
  .then((response) => {
  return response.json();
}).then((mapObj) => {

  window['content-config'] = mapObj;

  window['content-config'] = mapObj;
  mapObj.systemjsConfig.bundles.bundleLib.push('@ngrx/core/*.js', '@ngrx/core.js', '@ngrx/store.js', '@ngrx/effects.js');
  mapObj.systemjsConfig.bundles['magnus-front'].push('angular2-jwt.js');
  System.config(mapObj.systemjsConfig);
  System.import('bootstrap')
    .catch(e => console.error(e,
    'Report this error at https://github.com/mgechev/angular2-seed/issues'));
});
