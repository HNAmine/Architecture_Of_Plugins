import {PluginInitOptions, IPlugin, Container, SocketService} from 'magnus-back/magnus_back';
import {Log} from 'magnus-metadata/magnus_metadata';
import {WorkspaceService, ProjectWatcher, TaskManager} from 'tower-base-server';
import {EventManager} from '../event_manager/event_manager';

export class WorkspacePlugin implements IPlugin {

  private options: PluginInitOptions;

  getName(): string { return 'WorkspacePlugin'; };

  init(options: PluginInitOptions, configuration: any, dependencies?: Array<IPlugin>): void {
    this.options = options;
  };

  getDependencies(): string[] {
    return ['ExpressPlugin'];
  };

  getConfigurationName(): string {
    return 'workspace';
  }

  isConfigurationRequired(): boolean {
    return false;
  }

  @Log()
  onBootstrap(): Promise<any> {
    return Promise.resolve();
  };

  @Log()
  afterBootstrap(): Promise<any> {
    var workspaceService: WorkspaceService = <WorkspaceService>Container.get(WorkspaceService);
    // TODO FIX ME
    let projectWatcher = <ProjectWatcher>Container.get(ProjectWatcher);
    let eventManager = <EventManager>Container.get(EventManager);
    let taskManager = <TaskManager>Container.get(TaskManager);
    eventManager.watcher = projectWatcher;
    eventManager.init();
    workspaceService.projectWatcher = projectWatcher;
    workspaceService.sock = <SocketService> Container.get(SocketService);
    taskManager.socket = <SocketService> Container.get(SocketService);
    workspaceService.fillIndex();
    workspaceService.init();
    return Promise.resolve();
  };

  onClose(): Promise<any> {
    return Promise.resolve();
  };

}
