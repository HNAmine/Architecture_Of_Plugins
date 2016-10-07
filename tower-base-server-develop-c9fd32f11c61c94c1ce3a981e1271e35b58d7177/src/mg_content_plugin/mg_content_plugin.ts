import {PluginInitOptions, IPlugin} from 'magnus-back/magnus_back';
import {MgContentOption} from './mg_content_options';
import {Container} from 'magnus-back/magnus_back';
import {Log} from 'magnus-metadata/magnus_metadata';
import {WorkspaceService} from '../workspace/workspace_service';
import {TYPE_PROJECT, SCOPE_PROJECT, SystemJSConfig} from 'magnuscli-shared/shared';
import {ApiRegsitry} from '../endpoints/endpoint_service';
import * as fs from 'fs';
import {join} from 'path';
var _ = require('lodash');

export interface ExecConfig {
    moduleUi: Array<string>;
    moduleShared: Array<string>;
    endPoints: Array<string>;
}

export class MgContentPlugin implements IPlugin {

    private options: PluginInitOptions;
    private currentWorkspace: WorkspaceService = <WorkspaceService>Container.get(WorkspaceService);
    private apiRegsitry: ApiRegsitry = <ApiRegsitry>Container.get(ApiRegsitry);

    constructor(private staticDirectory: string, private execConfig: ExecConfig) {
    }

    getName(): string { return 'MgContentPlugin'; };

    init(options: PluginInitOptions, configuration: MgContentOption, dependencies?: Array<IPlugin>): void {
        this.options = options;
    };

    getDependencies(): string[] {
        return [];
    };

    getConfigurationName(): string {
        return 'mg-content';
    }

    isConfigurationRequired(): boolean {
        return false;
    }

    @Log()
    onBootstrap(): Promise<any> {
        var listModules = this.currentWorkspace.getProjects()
            .filter(p => (p.type === TYPE_PROJECT.UI || p.type === TYPE_PROJECT.SHARED))
            .map(project => {
                return project.loaderConfig;
            });
        var config = new SystemJSConfig();
        listModules.forEach(m => {
            config = _.merge(m, config);
        });
        config.defaultJSExtensions = true;
        config.baseURL = '/';
        config.map['rxjs'] = 'rxjs';
        config.bundles['bundleLib'] = ['immutable.js', 'lodash.js', 'moment.js', '@angular/*.js', '@angular2-material/*.js',
            'primeng/primeng'
        ];
        config.paths['bundleLib'] = 'lib/libs-ng2-bundle.js';
        config.paths['socket.io-client'] = 'lib/socket.io.js';
        var mgContent = {
            'systemjsConfig': config,
            'sharedPackages': this.execConfig.moduleShared,
            'uiModules': this.execConfig.moduleUi,
            'endPoints': this.apiRegsitry.getApiByName(this.execConfig.endPoints.concat('login.api'))
        };
        var outputFilename = join(this.staticDirectory, 'content-config.json');
        fs.writeFileSync(outputFilename, JSON.stringify(mgContent, null, 4));
        return Promise.resolve();
    };

    @Log()
    afterBootstrap(): Promise<any> {
        return Promise.resolve();
    };

    onClose(): Promise<any> {
        return Promise.resolve();
    };

}
