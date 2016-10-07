import {PluginInitOptions, IPlugin,ExpressPlugin, Container} from 'magnus-back/magnus_back';
import {ServeStaticOtion} from './serve_static_options';
import {Log} from 'magnus-metadata/magnus_metadata';
import {join} from 'path';
// import * as lib from "../lib/lib";
import * as lib from 'tower-base-server';
var connectLivereload = require('connect-livereload');
var serveStatic = require('serve-static');

var LIVE_RELOAD_PORT_APP = 4002;
var LIVE_RELOAD_PORT_TOWER = 4501;
import {TinyWrapper} from './tiny_warpper';

export class ServeStaticPlugin implements IPlugin {

    private options: PluginInitOptions;
    private mgExpressPlugin: ExpressPlugin;

    constructor(private staticDirectory: string, private liveReload?: boolean) {

    }

    getName(): string { return 'ServeStaticPlugin'; };

    init(options: PluginInitOptions, configuration: ServeStaticOtion, dependencies?: Array<IPlugin>): void {
        this.options = options;
        this.mgExpressPlugin = <ExpressPlugin>dependencies.reduce((found, mod) => mod.getName() === 'ExpressPlugin' ? mod : found, undefined);
    };

    getDependencies(): string[] {
        return ['ExpressPlugin'];
    };

    getConfigurationName(): string {
        return 'serve-static';
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
        this.mgExpressPlugin.express
        var tinyWrapper: TinyWrapper = new TinyWrapper()
        Container.set('tinyLrApp', TinyWrapper, tinyWrapper)
        if (this.liveReload) {
            tinyWrapper.mapLr['tinyLrApp'] = lib.tinyReloadFactory();
            tinyWrapper.mapLr['tinyLrApp'].listen(LIVE_RELOAD_PORT_TOWER);

            this.mgExpressPlugin.express.use('/', connectLivereload({
                port: LIVE_RELOAD_PORT_TOWER
            }), serveStatic(this.staticDirectory));
        } else {
            this.mgExpressPlugin.express.use('/', serveStatic(this.staticDirectory));
        }
        this.mgExpressPlugin.express.get('/', (req, res) => {
            res.sendFile(join(this.staticDirectory, 'index.html'));
        });
        return Promise.resolve();
    };

    onClose(): Promise<any> {
        return Promise.resolve();
    };

}
