import {Map} from 'immutable';
import * as lib from '../lib/lib';
import {Project} from 'magnuscli-shared/shared';

export class Workspace {

  //to make private
  private projects: Array<Project> = new Array<Project>();
  private listProcess: Map<string, lib.ProjectWatcher> = Map<string, lib.ProjectWatcher>();
  private projectsMap: Map<string, Project> = Map<string, Project>();

  hasProcess(processName: string): boolean {
    return this.listProcess.has(processName);
  }

  addProcess(moduleId, childProcess) {
    this.listProcess = this.listProcess.set(moduleId, childProcess);
  }

  removeProcess(moduleId) {
    var childProcesses = this.listProcess.get(moduleId);
    childProcesses.end();
    this.listProcess = this.listProcess.remove(moduleId);
  }

  setAllProjects(projects: Array<Project>) {
    var tempMap = this.projectsMap.asMutable();
    projects.forEach(project=> tempMap.set(project.name, project));
    this.projectsMap = tempMap.asImmutable();
  }

  updateProject(project) {
    this.projectsMap = this.projectsMap.set(project.name, project);
  }

  getProjectByName(projectName: string): Project {
    return this.projectsMap.get(projectName);
  }

  getAllProjects(): Array<Project> {
    return this.projectsMap.toArray();
  }

}
