import { NitroModules } from 'react-native-nitro-modules';
import type { NitroBase64 } from './NitroBase64.nitro';

const NitroBase64HybridObject =
  NitroModules.createHybridObject<NitroBase64>('NitroBase64');

// const NitroBase64ModuleHybridObject =
//   NitroModules.createHybridObject<NitroBase64Module>('NitroBase64Module');
export function decode(base64: string, urlSafe = false): string {
  return NitroBase64HybridObject.decode(base64, urlSafe);
}

export function encode(input: string, urlSafe = false): string {
  return NitroBase64HybridObject.encode(input, urlSafe);
}

export function install(): void {
  NitroBase64HybridObject.install();
}
export default NitroBase64HybridObject;
