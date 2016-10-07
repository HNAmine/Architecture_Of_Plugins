import {EVENT_TYPE} from '../metadata/metadata';
import {SocketEvent} from 'magnus-back';

export interface SocketEventOverride extends SocketEvent {

  data?: {
    contentsLog: any,
    eventType?: EVENT_TYPE,
    pluginName?: string
  };

}
