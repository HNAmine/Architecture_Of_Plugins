import {Project, SCOPE_PROJECT, PackageInfoSummary} from 'magnuscli-shared/shared';
import { libConfig} from './workspace_config';
import {getPackageInfoFromRegistry} from '../lib/registry/npm_registry_api';
import {getProjectFromPackageJson, getLibProjectFromLibDef, loadLocalProject, ProjectTuple} from './workspace_helper';

var fs = require('fs');
var glob = require('glob');
var path = require('path');

import * as semver from'semver';

export function loadWorkspace(clearBuilds?: boolean): Array<Project> {

  console.log('#########   LOADING PROJECTS    ####################');
  var listProjects = loadLocalProject().map((val: ProjectTuple) => {
    console.log('#########   PROCESSING PROJECT  ' + val.pkg.name + '  ####################   ' + val.folder);
    return getProjectFromPackageJson(val.pkg, val.folder, SCOPE_PROJECT.LOCAL);
  });
  console.log('#########   LOADING LIBS    ####################');
  var listLibs = libConfig.map(lib => {
    console.log('#########   PROCESSING LIBS  ' + lib.name + '  ####################');
    var listPackageFile: Array<string> = glob.sync(`libs/${lib.name}/package.json`);
    if (listPackageFile && listPackageFile.length === 1) {
      var packageInfoStr = fs.readFileSync(listPackageFile[0]);
      var packageInfo = JSON.parse(packageInfoStr);
      var e = path.parse(listPackageFile[0]);
      var p = getProjectFromPackageJson(packageInfo, e.dir, SCOPE_PROJECT.LIB, lib);
      p.present = true;
      return p;
    } else {
      return getLibProjectFromLibDef(lib);
    }
  });
  return listProjects.concat(listLibs);
}

export function loadRegistry(projects: Array<Project>): Promise<PackageInfoSummary[]> {
  var listPromises = projects.map(project => {
    return getPackageInfoFromRegistry(project.name, 'https://nexus.magnus-ci.duckdns.org/repository/npm-all').then((summary: PackageInfoSummary) => {
      if (summary) {
        summary.name = project.name;
        summary.current = project.version ? project.version : summary.latest;
        summary.isUpdated = project.version ? semver.eq(project.version, summary.latest) : true;
        return summary;
      }
    });
  });
  return Promise.all(listPromises).then(list => list);
}
