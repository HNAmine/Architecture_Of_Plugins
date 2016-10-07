var fs = require('fs');
var path = require('path');
var join = require('path').join;

import {Project, ProjectFeature, TYPE_PROJECT, TYPE_DEPENDENCY, SCOPE_PROJECT, SystemJSConfig, FrameworkProject} from 'magnuscli-shared/shared';
import {projectdependencyGraph, libDependencyGraph, GIT_PROVIDER} from './workspace_config';

var glob = require('glob');

import {ApiConfigEntry} from 'magnuscli-shared/shared';
import {checkIfDirectoryIsSymLink, checkIfPackageIsLinkedGlobal} from '../lib/folder_utils/folder_utils';

export interface ProjectTuple {
  folder: string;
  pkg: any;
}

export function loadLocalProject(): Array<ProjectTuple> {
  var listPackageFile: Array<string> = glob.sync('*/package.json');
  var listLocalProjects: Array<ProjectTuple> = [];
  listPackageFile.forEach(file => {
    var packageInfoStr = fs.readFileSync(file);
    var packageInfo = JSON.parse(packageInfoStr);
    if (packageInfo['mgConfig']) {
      console.log(`Found local project  ${packageInfo.name}`);
      var e = path.parse(file);
      listLocalProjects.push({ folder: e.dir, pkg: packageInfo });
    }
  });
  return listLocalProjects;
}

export function getLibProjectFromLibDef(lib): Project {
  var fmwk = <FrameworkProject>{};
  fmwk.name = lib.name;
  fmwk.type = lib.type;
  fmwk.connectype = lib.connectype;
  var url = '';
  if (lib.connectype === 'git') {
    url = url + 'git@' + GIT_PROVIDER + ':' + lib.repository;
  } else {
    url = url + 'https://$USERNAME$:$PASSWORD$@' + GIT_PROVIDER + '/' + lib.repository;
  }
  fmwk.project_folder = 'libs/' + lib.name;
  fmwk.repository = url;
  fmwk.scope = SCOPE_PROJECT.LIB;
  fmwk.initialized = true;
  if (lib.type === TYPE_PROJECT.UI || lib.type === TYPE_PROJECT.SHARED) {

    fmwk.loaderConfig = new SystemJSConfig();
    fmwk.loaderConfig.paths[lib.systemModule] = `lib/${lib.name}.js`;
    if (lib.bundles && lib.bundles.length > 0) {
      fmwk.loaderConfig.bundles[fmwk.name] = lib.bundles;
    }
  }
  fmwk.present = false;
  return fmwk;
}

export function getProjectFromPackageJson(packageInfo, folder, scope: SCOPE_PROJECT, libInfo?: any): Project {
  var project = packageInfo;
  var localProject = new Project();
  var moduleType = project.mgConfig.moduleType;

  localProject.type = moduleType === 'ui' ? TYPE_PROJECT.UI : localProject.type;
  localProject.type = moduleType === 'shared' ? TYPE_PROJECT.SHARED : localProject.type;
  localProject.type = moduleType === 'assets' ? TYPE_PROJECT.ASSETS : localProject.type;
  localProject.type = moduleType === 'back' ? TYPE_PROJECT.API : localProject.type;
  localProject.type = moduleType === 'base-app' ? TYPE_PROJECT.BASE_APP : localProject.type;

  localProject.link = checkIfPackageIsLinkedGlobal(project.name);
  localProject.scope = scope;
  localProject.name = project.name;
  localProject.present = true;
  localProject.version = project.version;
  //AfterPromise
  localProject.project_folder = folder;
  if (localProject.type === TYPE_PROJECT.UI || localProject.type === TYPE_PROJECT.SHARED) {
    //FIXME THAT FUCKING EVIL HACK
    var bundlerVar = project.mgConfig.systemjsBundle;
    localProject.systemModule = bundlerVar;
    localProject.loaderConfig = new SystemJSConfig();
    localProject.loaderConfig.paths[bundlerVar] = `assets/${scope}/${project.mgConfig.systemjsBundle}.js`;
  }
  if (localProject.type === TYPE_PROJECT.UI && localProject.scope === SCOPE_PROJECT.LOCAL) {
    if (!fs.existsSync(join(process.cwd(), localProject.project_folder, 'metadata.json'))) {
      console.log('#################################################');
      console.log('# NO METADATA PLEASE RUN gulp magnus:metadata  ##');
      console.log('#################################################');
      localProject.features = [];
    } else {
      var fileContent = fs.readFileSync(join(process.cwd(), localProject.project_folder, 'metadata.json'));
      //FIXME Serve only modules not Feature
      var feature: ProjectFeature = { name: project.name, displayName: 'Features for ' + project.name, childs: [] };
      feature.childs = JSON.parse(fileContent);
      localProject.features = [];
      localProject.features.push(feature);
    }
  }
  //TODO FIXME

  if (localProject.type === TYPE_PROJECT.API && localProject.scope === SCOPE_PROJECT.LOCAL) {
    if (!fs.existsSync(join(process.cwd(), localProject.project_folder, 'config.json'))) {
      console.log('#################################################');
      console.log('# NO Config file provided for api   ##');
      console.log('#################################################');
      localProject.features = [];
    } else {
      var fileContent = fs.readFileSync(join(process.cwd(), localProject.project_folder, 'config.json'));

      let config = JSON.parse(fileContent);

      let apiconfig = Object.keys(config).map(key => {
        let conf = new ApiConfigEntry();
        conf.key = key;
        let confArgs = config[key];
        conf.args = <any>[];
        Object.keys(confArgs).forEach(keyArgs => {
          conf.args.push({ key: keyArgs, value: confArgs[keyArgs] });
        });
        return conf;
      });
      localProject.config = apiconfig;
    }
  }

  if ((localProject.type === TYPE_PROJECT.UI || localProject.type === TYPE_PROJECT.SHARED) && localProject.present) {
    var joined = join(process.cwd(), localProject.project_folder, 'built/package', `${project.mgConfig.bundleLocation}`);
    if (fs.existsSync(joined)) {
      localProject.initialized = true;
    }

  }

  if (localProject.type === TYPE_PROJECT.ASSETS || localProject.type === TYPE_PROJECT.BASE_APP) {
    localProject.initialized = true;
  }

  localProject.scripts = [];
  if (project.scripts) {
    Object.keys(project.scripts).forEach(script => {
      localProject.scripts.push({ name: script, command: project.scripts[script] });
    });
  }
  localProject.dependencies = [];
  if (project.dependencies) {
    Object.keys(project.dependencies).forEach(dep => {
      //  console.log(dep)
      var dependency;
      if (scope === SCOPE_PROJECT.LIB) {
        dependency = libDependencyGraph[localProject.name].find(e => e === dep);
      } else {
        dependency = projectdependencyGraph[moduleType].find(e => e === dep);
      }

      if (dependency) {
        var depFolder = join(process.cwd(), localProject.project_folder, 'node_modules', dependency);
        var isLink = checkIfDirectoryIsSymLink(depFolder);
        localProject.dependencies.push({ name: dep, version: project.dependencies[dep], link: isLink, type: TYPE_DEPENDENCY.SIMPLE });
      }
    });

  }

  if (project.devDependencies) {
    Object.keys(project.devDependencies).forEach(dep => {
      var dependency;
      if (scope === SCOPE_PROJECT.LIB) {
        dependency = libDependencyGraph[localProject.name].find(e => e === dep);
      } else {
        dependency = projectdependencyGraph[moduleType].find(e => e === dep);
      }
      if (dependency) {
        var depFolder = join(process.cwd(), localProject.project_folder, 'node_modules', dependency);
        var isLink = checkIfDirectoryIsSymLink(depFolder);
        localProject.dependencies.push({ name: dep, version: project.devDependencies[dep], link: isLink, type: TYPE_DEPENDENCY.DEV });
      }
    });

  }


  if (libInfo && scope === SCOPE_PROJECT.LIB) {

    var url = '';
    if (libInfo.connectype === 'git') {
      url = url + 'git@' + GIT_PROVIDER + ':' + libInfo.repository;
    } else {
      url = url + 'https://$USERNAME$:$PASSWORD$@' + GIT_PROVIDER + '/' + libInfo.repository;
    }

    localProject.connectype = libInfo.connectype;
    localProject.repository = url;
    if (libInfo.type === TYPE_PROJECT.UI || libInfo.type === TYPE_PROJECT.SHARED) {

      localProject.loaderConfig = new SystemJSConfig();
      localProject.loaderConfig.paths[libInfo.systemModule] = `assets/2/${libInfo.name}.js`;
      if (libInfo.bundles && libInfo.bundles.length > 0) {
        localProject.loaderConfig.bundles[localProject.name] = libInfo.bundles;
      }

    }
  }
  return localProject;
}
