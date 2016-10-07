import {JsonController} from 'routing-controllers';
import { Post, Get} from 'routing-controllers';
import {Param, Body, Req, Res} from 'routing-controllers';
import {Response, Request} from 'express';
import {Inject} from 'magnus-back';
import {PluginsManager} from '../plugins_manager/plugins_manager';
import {defaultPluginMetadataRegistry, PluginMetadataRegistry} from 'tower-base-server';

@JsonController()
export class PluginsController {

  @Inject() manager: PluginsManager;
  registry: PluginMetadataRegistry = defaultPluginMetadataRegistry;

  @Get('/registry')
  registryDefinition( @Req() request: Request, @Res() response: Response, @Body() parametres) {
    return this.registry;
  }

  @Post('/:projectName/:pluginName/:actionName')
  executePlugin( @Req() request: Request,
    @Res() response: Response,
    @Param('projectName') projectName: string,
    @Param('pluginName') pluginName: string,
    @Param('actionName') actionName: string,
    @Body() parametres) {
    return this.manager.execute(projectName, pluginName, actionName, parametres);
  }

  @Post('/:projectName/:pluginName/eventListner/:eventListnerName')
  getActionOfEventListeners( @Req() request: Request,
    @Res() response: Response,
    @Param('projectName') projectName: string,
    @Param('pluginName') pluginName: string,
    @Param('eventListnerName') eventListnerName: string,
    @Body() parametres) {
    return this.manager.getActionOfEventListener(projectName, pluginName, eventListnerName);
  }

}
