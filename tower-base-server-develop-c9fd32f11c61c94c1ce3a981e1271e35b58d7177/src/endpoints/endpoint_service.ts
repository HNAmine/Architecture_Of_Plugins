import {Observable} from 'rxjs/Observable'
import {Map} from 'immutable';
let myArgs = require('optimist').argv;

export class ApiArtefact {
  port: number;
  app: any;
  obs: Observable<string>;
  apiTaskId: string;
}

export class ApiRegsitry {
  apis: Map<string, ApiArtefact> = Map<string, ApiArtefact>();

  getApiByName(names: Array<string>): Array<{ endPoint: string, url: string, taskId: string }> {
    return this.getRunningApis().filter(api => names.indexOf(api.endPoint) !== -1);
  }

  getRunningApis(): Array<{ endPoint: string, url: string, taskId: string }> {
    let res = [];
    var serverIp = this.getServerIp();
    this.apis.forEach((value, key) => {
      res.push({ endPoint: key, url: `http://${serverIp}:${value.port}`, taskId: value.apiTaskId });
    });
    console.log('###################################################');
    console.log(myArgs.loginApi);
    console.log('###################################################');
    if (myArgs.loginApi) {
      res.push({ endPoint: 'login.api', url: `${myArgs.loginApi}` });
    } else {
      res.push({ endPoint: 'login.api', url: `http://identity.magnus-ci.duckdns.org` });
    }
    return res;
  }

  addApi(name: string, apiObject: ApiArtefact) {
    this.apis = this.apis.set(name, apiObject);
  }

  removeApi(name: string) {
    this.apis = this.apis.remove(name);
  }

  private getServerIp(): string {
    var os = require('os');
    var ifaces = os.networkInterfaces();
    var values = Object.keys(ifaces).map((name) => {
      return ifaces[name];
    });
    values = [].concat.apply([], values).filter((val) => {
      return val.family == 'IPv4' && val.internal == false;
    });
    return values.length ? values[0].address : '0.0.0.0';
  }

}
