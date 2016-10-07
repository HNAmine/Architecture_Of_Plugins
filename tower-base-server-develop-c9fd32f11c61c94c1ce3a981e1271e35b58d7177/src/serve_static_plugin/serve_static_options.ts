export interface ServeStaticOtion {

  staticDirectory?: string;

  interceptorDirectories?: string[];

  errorConsoleLoggingEnabled?: boolean;

  errorOverridingMap: any;

  defaultErrorHandler: any;

  jsonErrorHandler: any;
}
