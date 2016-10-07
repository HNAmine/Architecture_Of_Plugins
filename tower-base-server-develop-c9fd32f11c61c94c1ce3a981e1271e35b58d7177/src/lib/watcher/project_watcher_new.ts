import {Event, EVENT_TYPE, EVENT_PRIORITY, EVENT_STATUS} from '../../metadata/metadata';
import {Subject} from 'rxjs/Subject';
import {Project} from 'magnuscli-shared/shared';

const path = require('path');
var Watchpack = require('watchpack');

export class ProjectWatcher {

  watchStream: Subject<any> = new Subject<any>();
  private watcherList: Map<Project, any> = new Map<Project, any>();

  watch(project: Project) {

    var w = new Watchpack({
      aggregateTimeout: 2000,
      ignored: /node_modules/,
    });
    var currentEvents: Map<number, Event> = new Map<number, Event>();
    var startTime = Date.now() + 10000;

    w.watch([], [path.join(process.cwd(), project.project_folder)], startTime);

    w.on('change', ((filePath, mtime) => {
      var fileName: string = path.posix.basename(filePath);
      var event: Event = new Event();

      if (fileName === 'package.json') {
        event.eventType = EVENT_TYPE.PACKAGE_CHANGES;
        event.eventPriority = EVENT_PRIORITY.NORMAL;
      }
      else {
        event.eventType = EVENT_TYPE.SRC_FILES_CHANGES;
        event.eventPriority = EVENT_PRIORITY.HIGHEST;
      }
      event.eventStatus = EVENT_STATUS.TRIGGERED;
      event.dateCreationEvent = new Date(mtime);
      event.project = project.name;
      currentEvents.set(event.eventType, event);

    }));

    w.on('aggregated', (changes) => {
      console.log('change======>   ' + changes);
      this.watchStream.next(Array.from(currentEvents.values()));
      currentEvents.clear();
    });
    this.watcherList.set(project, w);
  }

  end() {
    this.watcherList.forEach(child => child.close());
    this.watcherList.clear();
  }

  pause() {
    this.watcherList.forEach(child => child.pause());
  }

  resume() {
    this.watcherList.forEach(child => {
      var startTime = Date.now() - 10000;
      child.watch([], [], startTime);
    });
  }

}
