import {ActionMetadata, defaultPluginMetadataRegistry} from '../../metadata/metadata';

export function Action(metadata?: ActionMetadata) {
  return (target: any, key: string, value: any) => {
    metadata.target = target;
    metadata.key = key;
    metadata.value = value;
    metadata.id = target.constructor.name + ':' + metadata.name;
    // metadata.name = target.constructor.name + ":" + metadata.name;
    defaultPluginMetadataRegistry.addAction(metadata);
  };
}
