import {Workspace} from './workspace_model';
import {loadWorkspace, loadRegistry} from './workspace_loader';
import {getProjectFromPackageJson} from './workspace_helper';
import {Map} from 'immutable';
import {ProjectWatcher} from '../lib/lib';
import {Project, PackageInfoSummary, GitRepository} from 'magnuscli-shared/shared';
import * as path from 'path';
import { SocketService, Inject} from 'magnus-back/magnus_back';
import {readPackageJson} from '../lib/folder_utils/folder_utils';
import {Subject} from 'rxjs/Subject';

export class WorkspaceService {

  private currentWorkspace: Workspace = new Workspace();
  private userProcess: Map<string, ProjectWatcher> = Map<string, ProjectWatcher>();
  private sysProcess: Map<string, ProjectWatcher> = Map<string, ProjectWatcher>();
  private npmRegistryCache: Map<string, PackageInfoSummary> = Map<string, PackageInfoSummary>();
  registryLoaded: boolean;
  changeEvent: Subject<Project> = new Subject<Project>();

  @Inject() sock: SocketService;
  @Inject() projectWatcher: ProjectWatcher;

  fillIndex() {
    this.currentWorkspace.setAllProjects(loadWorkspace(true));
    loadRegistry(this.currentWorkspace.getAllProjects()).then(listSummaries => {
      var tempMap = this.npmRegistryCache.asMutable();
      listSummaries.forEach(summary => summary ? tempMap.set(summary.name, summary) : null);
      this.npmRegistryCache = tempMap.asImmutable();
      this.registryLoaded = true;
      console.log('################### registry loaded');
    }).catch(err => {
      console.error('################### not registry loaded');
      console.log(err);
    });
  }

  init() {
    this.currentWorkspace.getAllProjects().forEach(project => {
      this.sock.addNamespace(project.name);
      this.projectWatcher.watch(project);
    });
  }

  startDevMode(projectName: string) {

  }

  addGitSummaryForProject(projectName: string, summary: GitRepository) {
    // this.gitCache.addSummary(projectName, summary)
  }

  getGitSummaryForProject(projectName: string): GitRepository {
    // return this.gitCache.getSummary(projectName)
    return null;
  }

  getSummaryForProject(projectName: string): PackageInfoSummary {
    return this.npmRegistryCache.get(projectName);
  }

  getProjectByName(projectName: string): Project {
    return this.currentWorkspace.getProjectByName(projectName);
  }

  updateProject(project: Project) {
    this.currentWorkspace.updateProject(project);
  }

  getProjects(): Array<Project> {
    return this.currentWorkspace.getAllProjects().map(project => {
      if (this.hasUserProcess(project.name)) {
        project.watched = true;
      }
      return project;
    });
  }

  reloadProject(project: Project) {
    var pkg = readPackageJson(path.join(process.cwd(), project.project_folder, 'package.json'));
    var newProject = getProjectFromPackageJson(pkg, project.project_folder, project.scope);
    this.currentWorkspace.updateProject(newProject);
    //this.socket.emit('/workspace/reload', { project: project.name });
    this.emitChangeEvent(newProject);
  }

  emitChangeEvent(project) {
    this.changeEvent.next(project);
  }

  hasUserProcess(processName: string): boolean {
    return this.userProcess.has(processName);
  }

  hasSysProcess(processName: string): boolean {
    return this.userProcess.has(processName);
  }

  getUserProcess(processName: string): ProjectWatcher {
    if (this.userProcess.has(processName)) {
      return this.userProcess.get(processName);
    } else {
      var p = new ProjectWatcher();
      this.addUserProcess(processName, p);
      return p;
    }
  }

  addUserProcess(moduleId, childProcess) {
    console.log(`saving up user watcher for ${moduleId}`);
    this.userProcess = this.userProcess.set(moduleId, childProcess);
  }

  addSysProcess(moduleId, childProcess) {
    console.log(`saving up sys watcher for ${moduleId}`);
    this.sysProcess = this.sysProcess.set(moduleId, childProcess);
  }

  removeUserProcess(moduleId) {
    var childProcesses = this.userProcess.get(moduleId);
    childProcesses.end();
    this.userProcess = this.userProcess.remove(moduleId);
  }

  removeSysProcess(moduleId) {
    var childProcesses = this.sysProcess.get(moduleId);
    childProcesses.end();
    this.sysProcess = this.sysProcess.remove(moduleId);
  }

}
