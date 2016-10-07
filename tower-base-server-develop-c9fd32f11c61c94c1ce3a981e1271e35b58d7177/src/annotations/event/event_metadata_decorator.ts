import {EventListenerMetadata, defaultPluginMetadataRegistry} from '../../metadata/metadata';

export function EventListener(metadata?: EventListenerMetadata) {
  return (target: any, key: string, value: any) => {
    metadata.target = target;
    metadata.key = key;
    metadata.value = value;
    metadata.id = target.constructor.name + ':' + metadata.name;
    defaultPluginMetadataRegistry.addEventListener(metadata);
  };
}
