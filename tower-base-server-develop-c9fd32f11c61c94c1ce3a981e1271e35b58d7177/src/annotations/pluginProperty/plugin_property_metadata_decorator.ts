import {PluginPropertyMetadata, defaultPluginMetadataRegistry} from '../../metadata/metadata';

export function PluginProperty(metadata: PluginPropertyMetadata) {
  return (target: any, key: string) => {
    metadata.target = target;
    metadata.key = key;
    metadata.name = target.constructor.name + ':' + metadata.name;
    defaultPluginMetadataRegistry.addPluginProperty(metadata);
  };
}
