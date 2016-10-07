import {ITask, TaskPayload, TaskArgs, TaskStatus, TaskLogs} from "magnuscli-shared/shared"
import {Task} from "./task_model";
import * as Rx from 'rxjs/Rx';
import {RedisStore, SocketService, Inject} from "magnus-back/magnus_back";
import {Map} from 'immutable';
import {SocketEventOverride} from "./socket-events";

export class TaskManager {

  @Inject() socket: SocketService;

  currentTasks: Map<string, Task<TaskPayload, TaskArgs>> = Map<string, Task<TaskPayload, TaskArgs>>()
  taskEvents: Rx.Subject<TaskLogs> = new Rx.Subject<TaskLogs>();

  registerTask(t: Task<TaskPayload, TaskArgs>): string {
    this.currentTasks = this.currentTasks.set(t.id, t);
    return t.id;
  }

  runTask(taskId: string): Rx.Observable<TaskLogs> {
    if (this.currentTasks.has(taskId)) {
      var t = this.currentTasks.get(taskId)
      return this.startTask(t);
    }
    throw new Error('no task registred with this ID')
  }

  startTask(t: Task<TaskPayload, TaskArgs>, pluginName?: string): Rx.Observable<TaskLogs> {
    console.log(` is stream unsubscribed =======> ${t.taskStream.isUnsubscribed}`)
    t.taskStream.subscribe((log: TaskLogs) => {
      if (t.socketOptions && t.socketOptions.namespace) {
        this.emitSocket(t.socketOptions.namespace, log, 1, pluginName);
      }
    })
    t.start();
    return t.taskStream.asObservable();
  }

  private emitSocket(namespace: string, data: any, eventType?: number, pluginName?: string) {
    var socketEvent: SocketEventOverride = {};
    socketEvent.namespace = namespace;
    socketEvent.data = { contentsLog: "" };
    socketEvent.data.contentsLog = data;
    socketEvent.data.eventType = eventType;
    socketEvent.data.pluginName = pluginName;
    this.socket.emitSocket(socketEvent);
  }

}
