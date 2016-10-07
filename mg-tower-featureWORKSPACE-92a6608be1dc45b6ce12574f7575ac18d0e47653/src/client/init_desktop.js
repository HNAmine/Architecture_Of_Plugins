var SystemJS = require('systemjs');

SystemJS.import('./config/content-config.js').then(function(m) {
  console.log(m.r);
  return m.r;
})
  .then(function(mapObj) {
  console.log('second !');
  console.log(mapObj);

  window['content-config'] = mapObj;
  window['content-config'] = mapObj;
  mapObj.systemjsConfig.bundles.bundleLib.push('@ngrx/core/*.js', '@ngrx/core.js', '@ngrx/store.js', '@ngrx/effects.js');
  mapObj.systemjsConfig.bundles['magnus-front'].push('angular2-jwt.js');
  System.config(mapObj.systemjsConfig);
  System.import('./bootstrap.js')
    .catch(function(e) {
    return console.error(e, 'Report this error at https://github.com/mgechev/angular2-seed/issues');
  });
}).catch(function(e) {
  return console.log('KO')
});
