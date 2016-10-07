export function PluginParam(target: any, key: string, index: number) {

  var metadataKey = `log_${key}_parameters`;
  if (Array.isArray(target[metadataKey])) {
    target[metadataKey].push(index);
  }
  else {
    target[metadataKey] = [index];
  }

}
