import * as fs from 'fs';
import * as path from 'path';

export function checkIfDirectoryIsSymLink(dir): boolean {
  if (!fs.existsSync(dir)) return false;
  var stats: fs.Stats = fs.lstatSync(dir);
  return stats.isSymbolicLink();
};

export function readPackageJson(file: string): any {
  var packageInfoStr = fs.readFileSync(file);
  return JSON.parse(packageInfoStr.toString());
}

export function pkgTransform(file: string, transformFn: (content: any) => any): Promise<any> {
  return new Promise((resolve, reject) => {
    var pkg;
    try {
      pkg = readPackageJson(file);
      var content = transformFn(pkg);
      fs.writeFileSync(file, JSON.stringify(content, null, 2));
    } catch (e) {
      return reject(new Error(e));
    }
    resolve(true);
  });
}

export function writePackageJson(file: string, content: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(file, content);
    } catch (e) {
      return reject(new Error('Invalid JSON'));
    }
    resolve(true);
  });
}

export function checkIfPackageIsLinkedGlobal(pkgName): boolean {
  var NODE_PATH: string = process.env.NODE_PATH;
  var res = NODE_PATH.split(':').map(dir => {
    console.log('check in dir  ' + dir + 'for pkg   ' + pkgName);
    return fs.existsSync(path.join(dir, pkgName));
  });
  return res.indexOf(true) !== -1;
}
