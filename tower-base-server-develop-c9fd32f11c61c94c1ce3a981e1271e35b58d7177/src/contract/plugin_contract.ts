import {WorkspaceService} from '../workspace/workspace';
import {TaskManager} from '../tasks/tasks';

export class MgPlugin {
  workspaceService: WorkspaceService;
  taskManager: TaskManager;
}
