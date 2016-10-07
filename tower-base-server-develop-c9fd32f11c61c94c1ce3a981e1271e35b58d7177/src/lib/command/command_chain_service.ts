import {exec} from 'child_process';
import {Observable} from 'rxjs/Observable';
import * as async from 'async';

export interface Command {
  command: string;
  options?: {
    cwd?: string;
  };
}

export class CommandChainService {

  static executeCommand(command: Command): Observable<any> {
    return new Observable(observer=> {
      console.log('executing =========>  ' + command.command);
      var child = exec(command.command, command.options, (error, output) => {
        console.log(error);
        if (error !== null) observer.error(error);
        console.log('No error ');
        observer.complete();
      });

      child.stdout.on('data', (data) => {
        console.log('****************** data ********************');
        console.log(data);
        observer.next(data);
      });

      child.stderr.on('data', (data) => {
        console.log('****************** error ********************');
        console.log(data);
        observer.next(data);
      });
    }
  );
  }


  static executeChainCommand(commands: Array<Command>, parallel?: boolean): Observable<any> {
    return new Observable(observer=> {

      var listFunc = commands.map(val => {

        return (callback) => {
          console.log('executing =========>  ' + JSON.stringify(val));
          var child = exec(val.command, val.options, (code, output) => {
            callback(null, code);
            console.log(code);
            observer.next('------------  end command ' + val.command);
          });
          observer.next('------------  start command ' + val.command);
          child.stdout.on('data', (data) => {
            console.log(data);
            observer.next(data);
          });
          child.stderr.on('data', (data) => {
            console.log(data);
            observer.next(data);
          });
        };
      });
      async.series(listFunc, () => {
        observer.complete();
      });
    });

  }

}
