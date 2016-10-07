import { WorkspaceService, checkIfPackageIsLinkedGlobal, checkIfDirectoryIsSymLink} from 'tower-base-server';

import {Inject} from 'magnus-back';
import {JsonController} from 'routing-controllers/decorator/controllers';
import {Get, Post} from 'routing-controllers/decorator/methods';
import {Param, Req, Res, Body} from 'routing-controllers/decorator/params';
import {Response, Request} from 'express';
import {Project} from 'magnuscli-shared/shared';
var join = require('path').join;

@JsonController('/workspace')
export class WorkspaceController {

  @Inject() workspaceService: WorkspaceService;

  @Get('/')
  getProjects( @Req() request: Request, @Res() response: Response): Array<Project> {
    return this.workspaceService.getProjects();
  }

  @Get('/:projectName')
  getProject( @Req() request: Request,
    @Res() response: Response,
    @Param('projectName') projectName: string) {
    var project = this.workspaceService.getProjectByName(projectName);
    if (!project) {
      response.status(404).send({});
    }
    response.status(200).send(project);
  }

  @Post('/')
  updateProject( @Req() request: Request,
    @Res() response: Response,
    @Body() project) {
    this.workspaceService.updateProject(project);
    return { 'status': 'updated' };
  }

  @Post('/islinked')
  islinked( @Req() request: Request, @Res() response: Response, @Body('dir') dir: any) {
    return checkIfPackageIsLinkedGlobal(dir.name);
  }

  @Post('/issymlink')
  isSymLink( @Req() request: Request, @Res() response: Response, @Body('dir') dir: any) {
    var depFolder = join(process.cwd(), dir.folder, 'node_modules', dir.dependencie);
    return checkIfDirectoryIsSymLink(depFolder);
  }

}
