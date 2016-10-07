import { Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Project} from 'magnuscli-shared/shared';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class WorkspaceService {

  selectProject: Subject<Project> = new Subject<Project>();
  currentProject: Project;
  projects: Array<Project> = new Array<Project>();

  constructor(private _http: Http) { }

  getProjects(): Observable<Array<Project>> {
    return this._http.get('http://localhost:3000/workspace/').map(res => res.json()).map(res=> {
      this.projects = res;
      this.currentProject = res[0];
      this.selectProject.next(this.currentProject);
      return res;
    });
  }

  getProjectByName(projectName: string): Observable<Project> {
    return this._http.get('http://localhost:3000/workspace/' + projectName).map(res => res.json());
  }

  updateProject(project: Project): Observable<Project> {
    return this._http.post('http://localhost:3000/workspace/', project).map(res => res.json());
  }

  islinked(projectName: string): Observable<boolean> {
    return this._http.post('http://localhost:3000/workspace/islinked', { name: projectName }).map(res => res.json());
  }

  issymlink(folder: string, dependencie: string): Observable<boolean> {
    return this._http.post('http://localhost:3000/workspace/issymlink', { folder: folder, dependencie: dependencie }).map(res => res.json());
  }

}
