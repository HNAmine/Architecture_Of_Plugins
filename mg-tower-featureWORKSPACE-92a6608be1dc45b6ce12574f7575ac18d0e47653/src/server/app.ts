import {MagnusMicro, MgMicroBase, ExpressPlugin, ControllertsPlugin, MagnusRegistryPlugin, MongoosePlugin}from 'magnus-back/magnus_back';
import {join} from 'path';
import {defaultMetadataRegistry} from 'magnus-metadata/magnus_metadata';
import {WorkspacePlugin} from './workspace_plugin/workspace_plugin';
import {ServeStaticPlugin} from './serve_static_plugin/serve_static';
import {defaultMetadataArgsStorage} from 'routing-controllers';

@MagnusMicro({
  name: 'TestApp',
  settings: {
    configFiles: [join(__dirname, 'config.json')],
    plugins: [
      new ExpressPlugin(),
      new ControllertsPlugin(defaultMetadataArgsStorage()),
      new MagnusRegistryPlugin(<any>defaultMetadataRegistry),
      new MongoosePlugin(),
      new ServeStaticPlugin(join(__dirname, '..', 'client'), false),
      new WorkspacePlugin()
    ],
  },
  options: {
    srcDirectory: __dirname
  }
})
export class TestApp extends MgMicroBase {

}
