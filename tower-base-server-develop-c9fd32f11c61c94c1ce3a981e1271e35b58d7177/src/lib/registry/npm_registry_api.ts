import * as request from 'request';
import {PackageInfoSummary} from 'magnuscli-shared/shared';

export function getPackageInfoFromRegistry(packageName: string, registryUrl: string): Promise<PackageInfoSummary | Error> {
  return new Promise((resolve, reject) => {
    console.log(`requesting ${registryUrl}/${packageName}`);
    request(`${registryUrl}/${packageName}`,{strictSSL : false, auth :{ user : 'admin', password : 'admin123'}}, (error, response, body) => {
      if (error) reject(error);


      if (!response || response.statusCode === 401 || response.statusCode === 404) {
        console.log(`not received ${packageName}`);
        resolve(null);
        return null;
      }
      console.log(` ${packageName} ${response.statusCode}`);
      var summary: PackageInfoSummary = new PackageInfoSummary();
      summary.versions = [];
      console.log(`received ${packageName}`);
      var res = body ? JSON.parse(body) : null;
      if (res && res.versions) {

        Object.keys(res.versions).forEach(key=> {
          summary.versions.push(key);
        });
        summary.latest = res['dist-tags'].latest;
        console.log(`resolved ${packageName}`);

        resolve(summary);
      } else {
        resolve(null);
      }
    });
  });
}
