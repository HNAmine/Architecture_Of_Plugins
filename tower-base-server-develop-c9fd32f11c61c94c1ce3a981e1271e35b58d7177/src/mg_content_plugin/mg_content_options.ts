export interface MgContentOption {
  /**
 * List of directories where from controller classes will be loaded.
 */
  staticDirectory?: string;

  /**
   * List of directories where from interceptor classes will be loaded.
   */
  interceptorDirectories?: string[];

  /**
   * Indicates if error console-logging is enabled or not. By default in routing-controllers it is enabled.
   */
  errorConsoleLoggingEnabled?: boolean;

  /**
   * Represents map that overrides some properties of handled errors.
   */
  errorOverridingMap: any;

  /**
   * Path to exported function that implements default error handling on its own.
   */
  defaultErrorHandler: any;

  /**
   * Path to exported function that implements json error handling on its own.
   */
  jsonErrorHandler: any;
}
