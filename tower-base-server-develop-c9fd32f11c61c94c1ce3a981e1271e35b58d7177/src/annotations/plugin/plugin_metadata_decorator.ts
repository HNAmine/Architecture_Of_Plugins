import {PluginMetadata, defaultPluginMetadataRegistry} from '../../metadata/metadata';

export function Plugin(metadata?: PluginMetadata) {
  return (target: any) => {
    metadata.target = target;
    defaultPluginMetadataRegistry.addPlugin(metadata);
  };
}
